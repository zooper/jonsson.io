// Individual post page JavaScript
let currentPost = null;
let currentImages = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadPost();
    setupLightbox();
});

async function loadPost() {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];
    
    if (!slug || slug === 'post') {
        showError();
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${slug}`);
        
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        currentPost = await response.json();
        renderPost(currentPost);
        
    } catch (error) {
        console.error('Error loading post:', error);
        showError();
    }
}

function renderPost(post) {
    // Update page title
    document.title = `${post.title} - Visual Stories`;
    
    // Show post content
    document.getElementById('post-loading').style.display = 'none';
    document.getElementById('post-content').style.display = 'block';
    
    // Fill in post data
    document.getElementById('post-title').textContent = post.title;
    
    // Format and display date
    const date = new Date(post.created_at);
    document.getElementById('post-date').textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Display post content
    const postBody = document.getElementById('post-body');
    postBody.innerHTML = post.content || '';
    
    // Hide featured image section completely - featured images are only for promotion/thumbnails
    document.getElementById('post-featured-image').style.display = 'none';
    
    // For gallery, filter out images that are already in the post content
    let galleryImages = [];
    if (post.images && post.images.length > 0) {
        galleryImages = post.images.filter(image => {
            // Don't include if it's already in the post content
            if (post.content && post.content.includes(image.b2_url)) {
                return false;
            }
            return true;
        });
    }
    
    // Set up images for lightbox (all images from content + any remaining gallery images)
    currentImages = [];
    
    // Add images from content first
    const contentImages = extractImagesFromContent(post.content);
    currentImages = [...contentImages];
    
    // Add any remaining gallery images
    currentImages = [...currentImages, ...galleryImages];
    
    // Display gallery only if there are unused images
    if (galleryImages.length > 0) {
        renderPostGallery(galleryImages);
    }
    
    // Make images in content clickable for lightbox
    setupContentImages();
}

function renderPostGallery(images) {
    const gallery = document.getElementById('post-gallery');
    
    if (images.length === 0) {
        gallery.style.display = 'none';
        return;
    }
    
    gallery.innerHTML = `
        <div class="post-masonry-gallery">
            <h3>Gallery</h3>
            <div class="masonry-grid" id="masonry-grid">
                <!-- Images will be added dynamically -->
            </div>
        </div>
    `;
    gallery.style.display = 'block';
    
    // Add images to masonry grid after DOM is ready
    setTimeout(() => {
        const masonryGrid = document.getElementById('masonry-grid');
        
        images.forEach((image, index) => {
            const aspectRatio = image.width && image.height ? image.width / image.height : 1;
            let orientationClass = 'square';
            
            if (aspectRatio > 1.5) orientationClass = 'panorama';
            else if (aspectRatio > 1.1) orientationClass = 'landscape';
            else if (aspectRatio < 0.9) orientationClass = 'portrait';
            
            const imageElement = document.createElement('div');
            imageElement.className = `masonry-item ${orientationClass}`;
            imageElement.setAttribute('data-index', index);
            imageElement.innerHTML = `
                <img src="${image.b2_url}" 
                     alt="${image.alt_text || image.original_filename}"
                     loading="lazy">
            `;
            
            // Add click handler
            imageElement.addEventListener('click', () => openLightbox(index));
            
            masonryGrid.appendChild(imageElement);
        });
        
        // Adjust grid after images load
        adjustMasonryGrid();
    }, 50);
}

async function setupContentImages() {
    // Make all images in post content clickable for lightbox
    const contentImages = document.querySelectorAll('#post-body img');
    contentImages.forEach(async (img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', async () => {
            // Find this image in currentImages or create a temporary image object
            let imageData = {
                b2_url: img.src,
                alt_text: img.alt,
                original_filename: img.alt || 'Image'
            };
            
            // Check if this image is already in currentImages (from post.images)
            const existingImageFromPost = currentPost?.images?.find(image => image.b2_url === img.src);
            if (existingImageFromPost) {
                imageData = { ...imageData, ...existingImageFromPost };
            }
            
            // Add to currentImages if not already there
            const existingIndex = currentImages.findIndex(image => image.b2_url === img.src);
            if (existingIndex !== -1) {
                // Update existing entry with any new data
                currentImages[existingIndex] = { ...currentImages[existingIndex], ...imageData };
                openLightbox(existingIndex);
            } else {
                // Add as new image and open
                currentImages.push(imageData);
                openLightbox(currentImages.length - 1);
            }
        });
    });
}

function showError() {
    document.getElementById('post-loading').style.display = 'none';
    document.getElementById('post-error').style.display = 'block';
}

// Lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isLightboxOpen()) {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && isLightboxOpen()) {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight' && isLightboxOpen()) {
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

function isLightboxOpen() {
    return document.getElementById('lightbox').classList.contains('active');
}

async function openLightbox(index) {
    if (!currentImages || currentImages.length === 0) return;
    
    currentImageIndex = index;
    const galleryImage = currentImages[currentImageIndex];
    
    const lightbox = document.getElementById('lightbox');
    
    // Update lightbox content
    const image = lightbox.querySelector('.lightbox-image');
    
    if (galleryImage.b2_url) {
        image.src = galleryImage.b2_url;
        image.alt = galleryImage.alt_text || galleryImage.original_filename || 'Gallery image';
        
        // Setup camera overlay only
        await setupCameraOverlay(galleryImage);
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update navigation buttons
        updateLightboxNavigation();
    }
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const newIndex = currentImageIndex + direction;
    
    if (newIndex >= 0 && newIndex < currentImages.length) {
        openLightbox(newIndex);
    }
}

function updateLightboxNavigation() {
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (currentImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

async function setupCameraOverlay(galleryImage) {
    const cameraOverlay = document.getElementById('lightbox-camera-overlay');
    const cameraDetails = document.getElementById('camera-details');
    
    // Try to get image ID from the image data
    let imageId = galleryImage.image_id || galleryImage.id;
    
    // If we don't have an ID, try to find it by filename
    if (!imageId && galleryImage.b2_url) {
        try {
            // Extract filename from URL
            const urlParts = galleryImage.b2_url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const response = await fetch(`/api/images/by-filename?filename=${encodeURIComponent(filename)}`);
            if (response.ok) {
                const imageData = await response.json();
                imageId = imageData.id;
            }
        } catch (error) {
            console.log('Could not find image ID:', error);
        }
    }
    
    console.log('Found imageId:', imageId);
    
    if (imageId) {
        // Load EXIF data to get camera and lens info
        const exifData = await loadFullExifData(imageId);
        
        console.log('EXIF data loaded:', exifData);
        
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
    } else {
        cameraOverlay.style.display = 'none';
    }
}

// Story posts don't need EXIF panel - only camera overlay

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

function adjustMasonryGrid() {
    const grid = document.getElementById('masonry-grid');
    if (!grid) return;
    
    const items = grid.querySelectorAll('.masonry-item');
    
    items.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.complete) {
            adjustMasonryItem(item, img);
        } else if (img) {
            img.addEventListener('load', () => {
                adjustMasonryItem(item, img);
            });
        }
    });
}

function adjustMasonryItem(item, img) {
    if (!img.naturalWidth || !img.naturalHeight) return;
    
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    let orientationClass = 'square';
    
    if (aspectRatio > 1.5) orientationClass = 'panorama';
    else if (aspectRatio > 1.1) orientationClass = 'landscape';
    else if (aspectRatio < 0.9) orientationClass = 'portrait';
    
    // Remove existing orientation classes
    item.classList.remove('portrait', 'landscape', 'square', 'panorama');
    item.classList.add(orientationClass);
}

function extractImagesFromContent(content) {
    if (!content) return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const imgElements = tempDiv.querySelectorAll('img');
    
    return Array.from(imgElements).map(img => ({
        b2_url: img.src,
        alt_text: img.alt,
        original_filename: img.alt || 'Image from content'
    }));
}