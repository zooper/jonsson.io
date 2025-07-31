// Modern Photoblog JavaScript
let currentPosts = [];
let currentImageIndex = 0;
let isLightboxOpen = false;
let currentGalleryImages = []; // Store gallery images with EXIF data

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLightbox();
    loadInitialContent();
    updateStats();
    loadAboutContent();
    
    // Listen for hash changes (browser back/forward buttons)
    window.addEventListener('hashchange', function() {
        loadInitialContent();
    });
});

// Helper function to reverse geocode GPS coordinates
async function reverseGeocode(lat, lon) {
    try {
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
        const data = await response.json();
        
        if (data && data.address) {
            const parts = [];
            if (data.address.city) parts.push(data.address.city);
            else if (data.address.town) parts.push(data.address.town);
            else if (data.address.village) parts.push(data.address.village);
            
            if (data.address.state) parts.push(data.address.state);
            if (data.address.country) parts.push(data.address.country);
            
            return parts.length > 0 ? parts.join(', ') : null;
        }
    } catch (error) {
        console.log('Geocoding failed:', error);
    }
    return null;
}

// Helper function to format date
function formatExifDate(dateString) {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return null;
    }
}

// Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // Update URL hash
            window.location.hash = targetSection;
            
            // Show the section
            showSection(targetSection);
            
            // Load content based on section
            if (targetSection === 'gallery') {
                loadGallery();
            } else if (targetSection === 'stories') {
                loadStories();
            } else if (targetSection === 'about') {
                // About section doesn't need special loading
            }
        });
    });
    
    // Gallery is always masonry view
}

// Lightbox functionality
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isLightboxOpen) {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && isLightboxOpen) {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight' && isLightboxOpen) {
            navigateLightbox(1);
        }
    });
    
    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

async function openLightbox(imageIndex) {
    if (!currentPosts.length) return;
    
    currentImageIndex = imageIndex;
    isLightboxOpen = true;
    
    const lightbox = document.getElementById('lightbox');
    const galleryImage = currentPosts[imageIndex];
    
    // Update lightbox content
    const image = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-title');
    const description = lightbox.querySelector('.lightbox-description');
    const date = lightbox.querySelector('.lightbox-date');
    
    if (galleryImage.b2_url) {
        image.src = galleryImage.b2_url;
        image.alt = galleryImage.alt_text || galleryImage.title || 'Gallery image';
        if (galleryImage.title && galleryImage.title.trim()) {
            title.textContent = galleryImage.title;
            title.style.display = 'block';
        } else {
            title.textContent = '';
            title.style.display = 'none';
        }
        description.textContent = galleryImage.description || '';
        
        const galleryDate = new Date(galleryImage.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        date.textContent = galleryDate;
        
        // Setup camera overlay
        await setupCameraOverlay(galleryImage);
        
        // Setup EXIF panel
        await setupExifPanel(galleryImage);
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

async function setupExifPanel(galleryImage) {
    const exifToggle = document.getElementById('exif-toggle');
    const exifPanel = document.getElementById('exif-panel');
    const exifContent = document.getElementById('exif-content');
    
    // Load and show EXIF data by default
    const exifData = await loadFullExifData(galleryImage.image_id);
    if (exifData) {
        exifContent.innerHTML = formatFullExifData(exifData, galleryImage);
        exifPanel.style.display = 'block';
        exifToggle.textContent = '📷 Hide EXIF Data';
    } else {
        exifContent.innerHTML = '<p>No EXIF data available for this image.</p>';
        exifPanel.style.display = 'none';
        exifToggle.textContent = 'No EXIF data available for this image.';
    }
    
    // Remove old event listeners and add new one
    const newToggle = exifToggle.cloneNode(true);
    exifToggle.parentNode.replaceChild(newToggle, exifToggle);
    
    // Only add click handler if EXIF data exists
    if (exifData) {
        newToggle.addEventListener('click', async () => {
            if (exifPanel.style.display === 'none') {
                // Show EXIF data
                if (!exifContent.innerHTML || exifContent.innerHTML.trim() === '') {
                    const exifData = await loadFullExifData(galleryImage.image_id);
                    if (exifData) {
                        exifContent.innerHTML = formatFullExifData(exifData, galleryImage);
                    } else {
                        exifContent.innerHTML = '<p>No EXIF data available for this image.</p>';
                    }
                }
                exifPanel.style.display = 'block';
                newToggle.textContent = '📷 Hide EXIF Data';
            } else {
                // Hide EXIF data
                exifPanel.style.display = 'none';
                newToggle.textContent = '📷 Show EXIF Data';
            }
        });
        
        // Make button look clickable
        newToggle.style.cursor = 'pointer';
    } else {
        // Make button look disabled when no EXIF data
        newToggle.style.cursor = 'default';
        newToggle.style.opacity = '0.6';
    }
}

async function setupCameraOverlay(galleryImage) {
    const cameraOverlay = document.getElementById('lightbox-camera-overlay');
    const cameraDetails = document.getElementById('camera-details');
    
    // Load EXIF data to get camera and lens info
    const exifData = await loadFullExifData(galleryImage.image_id);
    
    if (exifData && (exifData.camera_make || exifData.lens_model)) {
        let cameraInfo = [];
        
        // Add camera info
        if (exifData.camera_make && exifData.camera_model) {
            cameraInfo.push(`${exifData.camera_make} ${exifData.camera_model}`);
        }
        
        // Add lens info
        if (exifData.lens_model) {
            cameraInfo.push(exifData.lens_model);
        } else if (exifData.lens_make) {
            cameraInfo.push(exifData.lens_make);
        }
        
        if (cameraInfo.length > 0) {
            cameraDetails.innerHTML = cameraInfo.join('<br>');
            cameraOverlay.style.display = 'block';
        } else {
            cameraOverlay.style.display = 'none';
        }
    } else {
        cameraOverlay.style.display = 'none';
    }
}

async function loadFullExifData(imageId) {
    try {
        const response = await fetch(`/api/images/${imageId}/exif`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('Failed to load EXIF data:', error);
    }
    return null;
}

function formatFullExifData(exifData, galleryImage) {
    const sections = [];
    
    // Camera Information
    if (exifData.camera_make || exifData.camera_model) {
        const cameraRows = [];
        if (exifData.camera_make) cameraRows.push(`<div class="exif-row"><span class="exif-label">Make:</span><span class="exif-value">${exifData.camera_make}</span></div>`);
        if (exifData.camera_model) cameraRows.push(`<div class="exif-row"><span class="exif-label">Model:</span><span class="exif-value">${exifData.camera_model}</span></div>`);
        
        sections.push(`
            <div class="exif-section">
                <h4>📷 Camera</h4>
                ${cameraRows.join('')}
            </div>
        `);
    }
    
    // Lens Information
    if (exifData.lens_make || exifData.lens_model) {
        const lensRows = [];
        if (exifData.lens_make) lensRows.push(`<div class="exif-row"><span class="exif-label">Make:</span><span class="exif-value">${exifData.lens_make}</span></div>`);
        if (exifData.lens_model) lensRows.push(`<div class="exif-row"><span class="exif-label">Model:</span><span class="exif-value">${exifData.lens_model}</span></div>`);
        
        sections.push(`
            <div class="exif-section">
                <h4>🔍 Lens</h4>
                ${lensRows.join('')}
            </div>
        `);
    }
    
    // Camera Settings
    const settingsRows = [];
    if (exifData.focal_length) settingsRows.push(`<div class="exif-row"><span class="exif-label">Focal Length:</span><span class="exif-value">${exifData.focal_length}mm</span></div>`);
    if (exifData.focal_length_35mm) settingsRows.push(`<div class="exif-row"><span class="exif-label">35mm Equivalent:</span><span class="exif-value">${exifData.focal_length_35mm}mm</span></div>`);
    if (exifData.aperture) settingsRows.push(`<div class="exif-row"><span class="exif-label">Aperture:</span><span class="exif-value">f/${exifData.aperture}</span></div>`);
    if (exifData.shutter_speed) settingsRows.push(`<div class="exif-row"><span class="exif-label">Shutter Speed:</span><span class="exif-value">${exifData.shutter_speed}</span></div>`);
    if (exifData.iso) settingsRows.push(`<div class="exif-row"><span class="exif-label">ISO:</span><span class="exif-value">${exifData.iso}</span></div>`);
    if (exifData.flash) settingsRows.push(`<div class="exif-row"><span class="exif-label">Flash:</span><span class="exif-value">${exifData.flash}</span></div>`);
    
    if (settingsRows.length > 0) {
        sections.push(`
            <div class="exif-section">
                <h4>⚙️ Camera Settings</h4>
                ${settingsRows.join('')}
            </div>
        `);
    }
    
    // Location
    if (exifData.gps_latitude && exifData.gps_longitude) {
        sections.push(`
            <div class="exif-section">
                <h4>📍 Location</h4>
                <div class="exif-row"><span class="exif-label">Coordinates:</span><span class="exif-value">${exifData.gps_latitude.toFixed(6)}, ${exifData.gps_longitude.toFixed(6)}</span></div>
                ${exifData.gps_altitude ? `<div class="exif-row"><span class="exif-label">Altitude:</span><span class="exif-value">${exifData.gps_altitude}m</span></div>` : ''}
                <div style="margin-top: 0.5rem;">
                    <a href="https://www.google.com/maps?q=${exifData.gps_latitude},${exifData.gps_longitude}" target="_blank" style="color: var(--color-accent); text-decoration: none;">🗺️ View on Google Maps</a>
                </div>
            </div>
        `);
    }
    
    // Date and Other Info
    const otherRows = [];
    if (exifData.date_taken) {
        const date = new Date(exifData.date_taken).toLocaleString();
        otherRows.push(`<div class="exif-row"><span class="exif-label">Date Taken:</span><span class="exif-value">${date}</span></div>`);
    }
    if (exifData.software) otherRows.push(`<div class="exif-row"><span class="exif-label">Software:</span><span class="exif-value">${exifData.software}</span></div>`);
    if (exifData.artist) otherRows.push(`<div class="exif-row"><span class="exif-label">Artist:</span><span class="exif-value">${exifData.artist}</span></div>`);
    if (exifData.copyright) otherRows.push(`<div class="exif-row"><span class="exif-label">Copyright:</span><span class="exif-value">${exifData.copyright}</span></div>`);
    
    if (otherRows.length > 0) {
        sections.push(`
            <div class="exif-section">
                <h4>ℹ️ Other Information</h4>
                ${otherRows.join('')}
            </div>
        `);
    }
    
    return sections.length > 0 ? sections.join('') : '<p>No detailed EXIF data available.</p>';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    isLightboxOpen = false;
}

function navigateLightbox(direction) {
    const newIndex = currentImageIndex + direction;
    
    if (newIndex >= 0 && newIndex < currentPosts.length) {
        openLightbox(newIndex);
    }
}

// Load initial content
function loadInitialContent() {
    // Check URL hash to determine which section to show
    const hash = window.location.hash.substring(1); // Remove the # symbol
    
    if (hash === 'stories') {
        // Show stories section
        showSection('stories');
        loadStories();
    } else if (hash === 'gallery') {
        // Show gallery section
        showSection('gallery');
        loadGallery();
    } else if (hash === 'about') {
        // Show about section
        showSection('about');
    } else {
        // Default to gallery
        showSection('gallery');
        loadGallery();
    }
}

function showSection(sectionName) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    
    // Update active nav button
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });
    
    // Update active section
    sections.forEach(section => section.classList.remove('active'));
    const target = document.getElementById(sectionName);
    if (target) {
        target.classList.add('active');
    }
}

// Load gallery
async function loadGallery() {
    const gallery = document.getElementById('photo-gallery');
    
    // Show loading state
    gallery.innerHTML = `
        <div class="gallery-loading">
            <div class="loading-animation">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            <p>Loading gallery...</p>
        </div>
    `;
    
    try {
        const response = await fetch('/api/gallery');
        const galleryImages = await response.json();
        
        if (galleryImages.length === 0) {
            gallery.innerHTML = `
                <div class="gallery-loading">
                    <p>No photos in gallery yet.</p>
                    <p>Add some through the admin interface to get started.</p>
                </div>
            `;
            return;
        }
        
        renderGalleryImages(galleryImages);
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        gallery.innerHTML = `
            <div class="gallery-loading">
                <p>Error loading gallery. Please try again later.</p>
            </div>
        `;
    }
}

async function renderGalleryImages(galleryImages) {
    const gallery = document.getElementById('photo-gallery');
    
    // Store gallery images for lightbox
    currentPosts = galleryImages;
    currentGalleryImages = galleryImages;
    
    const galleryItems = await Promise.all(galleryImages.map(async (image, index) => {
        const aspectRatio = image.width && image.height ? image.width / image.height : 1;
        let orientationClass = 'square';
        
        if (aspectRatio > 1.5) orientationClass = 'panorama';
        else if (aspectRatio > 1.1) orientationClass = 'landscape';
        else if (aspectRatio < 0.9) orientationClass = 'portrait';
        
        // Build EXIF metadata for overlay
        const exifInfo = [];
        
        // Add date if available
        if (image.date_taken) {
            const formattedDate = formatExifDate(image.date_taken);
            if (formattedDate) {
                exifInfo.push(`📅 ${formattedDate}`);
            }
        }
        
        // Add camera settings if available
        const cameraSettings = [];
        if (image.aperture) cameraSettings.push(`f/${image.aperture}`);
        if (image.shutter_speed) cameraSettings.push(`${image.shutter_speed}`);
        if (image.iso) cameraSettings.push(`ISO ${image.iso}`);
        if (image.focal_length) cameraSettings.push(`${image.focal_length}mm`);
        
        if (cameraSettings.length > 0) {
            exifInfo.push(`📷 ${cameraSettings.join(' • ')}`);
        }
        
        // Add location if GPS coordinates are available
        if (image.gps_latitude && image.gps_longitude) {
            try {
                const location = await reverseGeocode(image.gps_latitude, image.gps_longitude);
                if (location) {
                    exifInfo.push(`📍 ${location}`);
                }
            } catch (error) {
                console.log('Location lookup failed for image', index);
            }
        }
        
        return `
            <div class="gallery-item ${orientationClass}" data-index="${index}">
                <img src="${image.b2_url}" 
                     alt="${image.alt_text || image.title || 'Gallery image'}" 
                     loading="lazy">
                <div class="gallery-overlay">
                    ${image.title ? `<h3>${image.title}</h3>` : ''}
                    ${image.description ? `<p>${truncateText(image.description, 100)}</p>` : ''}
                    ${exifInfo.length > 0 ? `<div class="exif-info">${exifInfo.join(' • ')}</div>` : ''}
                </div>
            </div>
        `;
    }));
    
    gallery.innerHTML = galleryItems.join('');
    
    // Add click handlers for gallery items to open lightbox
    gallery.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            openLightbox(index);
        });
    });
}

// Load stories
async function loadStories() {
    const storiesContainer = document.getElementById('stories-list');
    
    // Show loading state
    storiesContainer.innerHTML = `
        <div class="gallery-loading">
            <div class="loading-animation">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            <p>Loading stories...</p>
        </div>
    `;
    
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        // Filter posts that have content (stories vs just photos)
        const stories = posts.filter(post => post.content && post.content.trim().length > 0);
        
        if (stories.length === 0) {
            storiesContainer.innerHTML = `
                <div class="gallery-loading">
                    <p>No stories available yet.</p>
                    <p>Create some through the admin interface to share your narratives.</p>
                </div>
            `;
            return;
        }
        
        renderStories(stories);
        
    } catch (error) {
        console.error('Error loading stories:', error);
        storiesContainer.innerHTML = `
            <div class="gallery-loading">
                <p>Error loading stories. Please try again later.</p>
            </div>
        `;
    }
}

function renderStories(stories) {
    const storiesContainer = document.getElementById('stories-list');
    
    // Render stories - support both with and without images
    const storiesHTML = stories.map((story, index) => {
        const imageUrl = story.featured_image_url || (story.images && story.images[0]?.b2_url);
        const formattedDate = new Date(story.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        if (imageUrl) {
            // Story with image - use gallery-style layout
            const aspectRatio = story.featured_image_width && story.featured_image_height ? 
                story.featured_image_width / story.featured_image_height : 1;
            let orientationClass = 'square';
            
            if (aspectRatio > 1.5) orientationClass = 'panorama';
            else if (aspectRatio > 1.1) orientationClass = 'landscape';
            else if (aspectRatio < 0.9) orientationClass = 'portrait';
            
            return `
                <div class="gallery-item ${orientationClass}" data-slug="${story.slug}" style="cursor: pointer;">
                    <img src="${imageUrl}" 
                         alt="${story.featured_image_alt || story.title}" 
                         loading="lazy">
                    <div class="gallery-overlay">
                        <h3>${story.title}</h3>
                        ${story.content ? `<p>${truncateText(story.content, 100)}</p>` : ''}
                    </div>
                </div>
            `;
        } else {
            // Text-only story - use card layout
            return `
                <div class="story-card" data-slug="${story.slug}" style="cursor: pointer;">
                    <div class="story-card-content">
                        <h3>${story.title}</h3>
                        <div class="story-date">${formattedDate}</div>
                        ${story.content ? `<p>${truncateText(story.content, 200)}</p>` : ''}
                    </div>
                </div>
            `;
        }
    }).join('');
    
    // Use mixed layout for stories
    storiesContainer.innerHTML = `<div class="stories-grid">${storiesHTML}</div>`;
    
    // Add click handlers for story items to navigate to post
    storiesContainer.querySelectorAll('.gallery-item, .story-card').forEach(item => {
        item.addEventListener('click', () => {
            const slug = item.dataset.slug;
            if (slug) {
                window.location.href = `/post/${slug}`;
            }
        });
    });
}

// Load about page content
async function loadAboutContent() {
    try {
        const response = await fetch('/api/about');
        const about = await response.json();
        
        // Update about section content
        const aboutTitle = document.querySelector('.about-text h2');
        const aboutLead = document.querySelector('.about-content .lead');
        const aboutContentParagraphs = document.querySelectorAll('.about-content p:not(.lead)');
        const profileImage = document.querySelector('.about-image .image-placeholder');
        
        if (aboutTitle) aboutTitle.textContent = about.title || 'About';
        if (aboutLead) aboutLead.textContent = about.lead_text || '';
        
        // Update content paragraphs
        if (about.content && aboutContentParagraphs.length > 0) {
            const contentParagraphs = about.content.split('\n\n');
            aboutContentParagraphs.forEach((p, index) => {
                if (contentParagraphs[index]) {
                    p.textContent = contentParagraphs[index];
                } else {
                    p.style.display = 'none';
                }
            });
        }
        
        // Update profile image if available
        if (about.profile_image_url && profileImage) {
            profileImage.innerHTML = `<img src="${about.profile_image_url}" alt="${about.profile_image_alt || 'Profile'}" style="width: 250px; height: 250px; border-radius: 50%; object-fit: cover;">`;
        }
        
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// Update stats in about section
async function updateStats() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        const photoCount = posts.length;
        const storyCount = posts.filter(post => post.content && post.content.trim().length > 0).length;
        
        // Animate counters
        animateCounter('photo-count', photoCount);
        animateCounter('story-count', storyCount);
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1000; // 1 second
    const start = 0;
    const increment = targetValue / (duration / 16); // 60fps
    
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Utility functions
function truncateText(text, maxLength) {
    if (!text) return '';
    
    // Strip HTML tags first to avoid breaking HTML structure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Smooth scrolling for hero scroll indicator
document.addEventListener('DOMContentLoaded', function() {
    const heroScrollIndicator = document.querySelector('.hero-scroll');
    if (heroScrollIndicator) {
        heroScrollIndicator.addEventListener('click', () => {
            const main = document.querySelector('.main');
            if (main) {
                main.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Handle image loading errors
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
        
        // Add a placeholder or retry logic here if needed
        const parent = e.target.closest('.gallery-item, .story-image');
        if (parent) {
            parent.style.display = 'none';
        }
    }
}, true);

// Add scroll animations and effects
let ticking = false;

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        // Parallax effect for hero
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Initialize intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.gallery-item, .story-item, .about-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});