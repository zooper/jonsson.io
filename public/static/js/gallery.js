/**
 * Modern 2025 Photography Gallery with Advanced Interactions
 * Mobile-first, touch-optimized, accessible
 */

class PhotoGallery {
    constructor() {
        this.photos = [];
        this.currentPhotoIndex = 0;
        this.isLoading = false;
        this.lightboxOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchThreshold = 50;
        
        // Pagination state
        this.currentPage = 1;
        this.photosPerPage = 20;
        this.totalPhotos = 0;
        this.totalPages = 0;
        
        this.init();
    }
    
    async init() {
        await this.loadPhotos();
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupIntersectionObserver();
        this.updatePhotoCount();
        this.preloadFeaturedImage();
        
        // Initialize with fade-in animation
        document.body.style.opacity = '0';
        requestAnimationFrame(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        });
    }
    
    async loadPhotos(page = 1) {
        const loadingGrid = document.querySelector('.loading-grid');
        this.isLoading = true;
        
        try {
            const response = await fetch(`/api/photos?page=${page}&limit=${this.photosPerPage}`);
            if (!response.ok) throw new Error('Failed to load photos');
            
            const result = await response.json();
            
            // Handle both old (array) and new (paginated) response formats
            if (Array.isArray(result)) {
                // Old format - treat as all photos on one page
                this.photos = result;
                this.currentPage = 1;
                this.totalPhotos = result.length;
                this.totalPages = 1;
            } else {
                // New paginated format
                this.photos = result.photos;
                this.currentPage = result.pagination.page;
                this.totalPhotos = result.pagination.total;
                this.totalPages = result.pagination.totalPages;
            }
            
            this.renderGallery();
            
            if (loadingGrid) {
                loadingGrid.style.opacity = '0';
                setTimeout(() => loadingGrid.remove(), 300);
            }
            
        } catch (error) {
            console.error('Error loading photos:', error);
            this.showError('Failed to load photos. Please try again later.');
        } finally {
            this.isLoading = false;
            this.renderPagination(); // Render pagination after isLoading is set to false
            
            // Smooth scroll to gallery top if not on first page
            if (page > 1) {
                this.scrollToGallery();
            }
        }
    }
    
    renderGallery() {
        const gallery = document.getElementById('photo-gallery');
        if (!gallery) return;
        
        if (this.photos.length === 0) {
            gallery.innerHTML = '<div class="loading">No photos found.</div>';
            return;
        }
        
        gallery.innerHTML = this.photos.map((photo, index) => `
            <div class="photo-card" 
                 data-index="${index}"
                 style="animation-delay: ${index * 50}ms">
                <div class="photo-card-inner">
                    <img src="${photo.thumbnail_url || photo.url}" 
                         alt="${photo.title || 'Photo'}"
                         loading="lazy"
                         onload="this.style.opacity = 1">
                    <div class="photo-overlay">
                        <div class="photo-title">${photo.title || 'Untitled'}</div>
                        <div class="photo-description">${photo.description || ''}</div>
                        <div class="photo-meta">
                            <span class="photo-date">${photo.exif && photo.exif.dateTaken ? photo.exif.dateTaken : this.formatDate(photo.uploadDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click listeners to photo cards
        gallery.querySelectorAll('.photo-card').forEach((card, index) => {
            card.addEventListener('click', () => this.openLightbox(index));
            
            // Add hover effect for desktop
            if (!this.isTouchDevice()) {
                card.addEventListener('mouseenter', () => this.preloadImage(index));
            }
        });
    }
    
    updateExifDisplay(lightbox, exifData) {
        const exifCamera = lightbox.querySelector('.exif-camera');
        const exifLens = lightbox.querySelector('.exif-lens');
        const exifSettings = lightbox.querySelector('.exif-settings');
        const exifLocation = lightbox.querySelector('.exif-location');
        
        // Clear existing content
        exifCamera.innerHTML = '';
        exifLens.innerHTML = '';
        exifSettings.innerHTML = '';
        if (exifLocation) exifLocation.innerHTML = '';
        
        if (!exifData) return;
        
        // Camera information
        if (exifData.camera) {
            const make = this.sanitizeText(exifData.camera.make);
            const model = this.sanitizeText(exifData.camera.model);
            const cameraText = [make, model].filter(Boolean).join(' ');
            if (cameraText) {
                exifCamera.innerHTML = `<span>${cameraText}</span>`;
            }
        }
        
        // Lens information
        if (exifData.lens) {
            const parts = [];
            const lensModel = this.sanitizeText(exifData.lens.model);
            const focalLength = this.sanitizeText(exifData.lens.focalLength);
            const aperture = this.sanitizeText(exifData.lens.aperture);
            
            if (lensModel) parts.push(lensModel);
            if (focalLength) parts.push(focalLength);
            if (aperture) parts.push(aperture);
            
            if (parts.length > 0) {
                exifLens.innerHTML = `<span>${parts.join(' • ')}</span>`;
            }
        }
        
        // Camera settings
        if (exifData.settings) {
            const settings = [];
            const aperture = this.sanitizeText(exifData.settings.aperture);
            const shutterSpeed = this.sanitizeText(exifData.settings.shutterSpeed);
            const iso = this.sanitizeText(exifData.settings.iso);
            const focalLength = this.sanitizeText(exifData.settings.focalLength);
            
            if (aperture) settings.push(aperture);
            if (shutterSpeed) settings.push(shutterSpeed);
            if (iso) settings.push(iso);
            if (focalLength) settings.push(focalLength);
            
            if (settings.length > 0) {
                exifSettings.innerHTML = `<span>${settings.join(' • ')}</span>`;
            }
        }
        
        // Location information (resolved from GPS) - display only, no link
        if (exifData.location && exifLocation) {
            const locationText = this.sanitizeText(exifData.location.displayName);
            if (locationText) {
                exifLocation.innerHTML = `<span>${locationText}</span>`;
            }
        }
    }
    
    sanitizeText(text) {
        if (!text || typeof text !== 'string') return '';
        
        // Remove any non-printable characters and invalid UTF-8
        return text
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
            .replace(/�/g, '') // Remove replacement characters
            .trim();
    }
    
    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch gestures for lightbox
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Scroll-based navigation background
        let scrollTimer;
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.nav');
            const scrolled = window.scrollY > 50;
            
            nav.classList.toggle('scrolled', scrolled);
            
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.updateVisibleImages();
            }, 100);
        });
        
        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => this.scrollToGallery());
        }
        
        // Load more functionality (if needed)
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePhotos());
        }
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#0a0a0f' : '#fafafa';
        }
    }
    
    setupNavigation() {
        // Navigation setup no longer needed since hamburger menu was removed
        // Nav links will work with default anchor behavior for smooth scrolling
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        document.querySelectorAll('.glass-card, .photo-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    openLightbox(index) {
        if (index < 0 || index >= this.photos.length) return;
        
        this.currentPhotoIndex = index;
        this.lightboxOpen = true;
        const photo = this.photos[index];
        const lightbox = document.getElementById('lightbox');
        
        // Update lightbox content
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxDescription = lightbox.querySelector('.lightbox-description');
        const lightboxCurrent = lightbox.querySelector('#lightbox-current');
        const lightboxTotal = lightbox.querySelector('#lightbox-total');
        
        lightboxImage.src = photo.url;
        lightboxImage.alt = photo.title || 'Photo';
        lightboxTitle.textContent = photo.title || 'Untitled';
        lightboxDescription.textContent = photo.description || '';
        lightboxCurrent.textContent = index + 1;
        lightboxTotal.textContent = this.photos.length;
        
        // Update date display
        const metaDate = lightbox.querySelector('.meta-date');
        if (photo.exif && photo.exif.dateTaken) {
            metaDate.textContent = photo.exif.dateTaken;
        } else {
            metaDate.textContent = this.formatDate(photo.uploadDate);
        }
        
        // Update EXIF data
        this.updateExifDisplay(lightbox, photo.exif);
        
        // Keep info bar visibility state when navigating between photos
        // Only reset when opening lightbox for the first time
        
        // Show lightbox with animation
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Preload adjacent images
        this.preloadAdjacentImages(index);
        
        // Add loading state
        const imageLoader = lightbox.querySelector('.image-loader');
        if (imageLoader) {
            imageLoader.style.display = 'block';
            lightboxImage.onload = () => {
                imageLoader.style.display = 'none';
            };
        }
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        this.lightboxOpen = false;
        
        // Reset info bar visibility when closing lightbox
        const lightboxInfo = document.getElementById('lightbox-info');
        if (lightboxInfo) {
            lightboxInfo.classList.remove('visible');
        }
    }
    
    nextImage() {
        if (this.currentPhotoIndex < this.photos.length - 1) {
            this.openLightbox(this.currentPhotoIndex + 1);
        }
    }
    
    prevImage() {
        if (this.currentPhotoIndex > 0) {
            this.openLightbox(this.currentPhotoIndex - 1);
        }
    }
    
    handleKeydown(e) {
        if (!this.lightboxOpen) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextImage();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.prevImage();
                break;
            case 'i':
            case 'I':
                e.preventDefault();
                this.toggleLightboxInfo();
                break;
        }
    }
    
    handleTouchStart(e) {
        if (!this.lightboxOpen) return;
        
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleTouchMove(e) {
        if (!this.lightboxOpen) return;
        
        // Prevent scrolling when swiping in lightbox
        e.preventDefault();
    }
    
    handleTouchEnd(e) {
        if (!this.lightboxOpen) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.touchThreshold) {
            if (deltaX > 0) {
                this.prevImage();
            } else {
                this.nextImage();
            }
        }
        
        // Check if it's a vertical swipe down to close
        if (deltaY > this.touchThreshold * 2 && Math.abs(deltaX) < this.touchThreshold) {
            this.closeLightbox();
        }
    }
    
    preloadImage(index) {
        if (!this.photos[index]) return;
        
        const img = new Image();
        img.src = this.photos[index].url;
    }
    
    preloadAdjacentImages(index) {
        // Preload previous and next images
        if (index > 0) this.preloadImage(index - 1);
        if (index < this.photos.length - 1) this.preloadImage(index + 1);
    }
    
    async preloadFeaturedImage() {
        // Check for AI-generated hero quote with featured image first
        try {
            const response = await fetch('/api/hero-quote');
            if (response.ok) {
                const data = await response.json();
                this.updateHeroSection(data);
                return; // Exit early if AI quote system is working
            }
        } catch (error) {
            console.log('AI quote not available, using fallback featured image');
        }
        
        // Fallback to first photo if AI quote system isn't available
        if (this.photos.length > 0) {
            const featuredContainer = document.getElementById('hero-featured');
            if (featuredContainer) {
                const featured = this.photos[0];
                featuredContainer.innerHTML = `
                    <img src="${featured.thumbnail_url || featured.url}" 
                         alt="${featured.title || 'Featured photo'}">
                `;
            }
        }
    }
    
    updateHeroSection(data) {
        // Update quote
        const heroQuote = document.getElementById('heroQuote');
        if (heroQuote && data.quote) {
            // Don't add quotes here - the CSS ::before and ::after will add the decorative red quotes
            heroQuote.textContent = data.quote;
        }
        
        // Update featured image
        const heroFeaturedPlaceholder = document.getElementById('heroFeaturedPlaceholder');
        if (heroFeaturedPlaceholder && data.photo) {
            heroFeaturedPlaceholder.innerHTML = `<img src="${data.photo.url}" alt="${data.photo.title || 'Featured image'}">`;
        } else if (heroFeaturedPlaceholder) {
            // Keep the pulse loader if no featured image
            heroFeaturedPlaceholder.innerHTML = '<div class="pulse-loader"></div>';
        }
    }
    
    updatePhotoCount() {
        // Photo count element removed from UI in main design
        // but we could add it back if needed
        const countElement = document.querySelector('.photo-count');
        if (countElement) {
            countElement.textContent = this.totalPhotos;
        }
    }
    
    scrollToGallery() {
        const gallerySection = document.querySelector('#gallery');
        if (gallerySection) {
            const yOffset = -80; // Small offset for better visual positioning
            const y = gallerySection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: Math.max(0, y), // Don't scroll past the top of the page
                behavior: 'smooth'
            });
        }
    }
    
    renderPagination() {
        const paginationContainer = document.querySelector('.gallery-pagination');
        if (!paginationContainer || this.totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="gallery.loadPhotos(${this.currentPage - 1})" ${this.isLoading ? 'disabled' : ''}>‹ Previous</button>`;
        }
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="gallery.loadPhotos(1)" ${this.isLoading ? 'disabled' : ''}>1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="gallery.loadPhotos(${i})" ${this.isLoading ? 'disabled' : ''}>${i}</button>`;
        }
        
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="gallery.loadPhotos(${this.totalPages})" ${this.isLoading ? 'disabled' : ''}>${this.totalPages}</button>`;
        }
        
        // Next button
        if (this.currentPage < this.totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="gallery.loadPhotos(${this.currentPage + 1})" ${this.isLoading ? 'disabled' : ''}>Next ›</button>`;
        }
        
        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }
    
    toggleLightboxInfo() {
        const lightboxInfo = document.getElementById('lightbox-info');
        if (lightboxInfo) {
            lightboxInfo.classList.toggle('visible');
        }
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(start + (end - start) * easedProgress);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
    
    scrollToGallery() {
        const gallery = document.getElementById('gallery');
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = gallery.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    updateVisibleImages() {
        const images = document.querySelectorAll('.photo-card img[loading="lazy"]');
        
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !img.src.includes('data:')) {
                // Add subtle entrance animation
                img.style.transform = 'scale(0.95)';
                img.style.transition = 'transform 0.3s ease';
                
                img.onload = () => {
                    img.style.transform = 'scale(1)';
                };
            }
        });
    }
    
    showError(message) {
        const gallery = document.getElementById('photo-gallery');
        gallery.innerHTML = `
            <div class="error-message" style="
                text-align: center;
                padding: 3rem;
                color: var(--text-secondary);
                background: var(--glass-bg);
                border-radius: var(--border-radius);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
            ">
                <svg style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--accent-gradient);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 500;
                ">Try Again</button>
            </div>
        `;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('en-US', options);
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    async loadMorePhotos() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn || this.isLoading) return;
        
        this.isLoading = true;
        loadMoreBtn.classList.add('loading');
        
        try {
            // Simulate API call for more photos
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real implementation, you would fetch more photos here
            // const morePhotos = await fetch('/api/photos?offset=' + this.photos.length);
            
            loadMoreBtn.style.display = 'none'; // Hide if no more photos
            
        } catch (error) {
            console.error('Error loading more photos:', error);
        } finally {
            this.isLoading = false;
            loadMoreBtn.classList.remove('loading');
        }
    }
}

// Global functions for HTML onclick handlers
window.scrollToGallery = () => gallery.scrollToGallery();
window.openLightbox = (index) => gallery.openLightbox(index);
window.closeLightbox = () => gallery.closeLightbox();
window.nextImage = () => gallery.nextImage();
window.prevImage = () => gallery.prevImage();
window.toggleLightboxInfo = () => gallery.toggleLightboxInfo();

// Simple theme toggle function for immediate functionality
window.toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = newTheme === 'dark' ? '#0a0a0f' : '#fafafa';
    }
};

// Initialize gallery when DOM is ready
let gallery;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gallery = new PhotoGallery();
    });
} else {
    gallery = new PhotoGallery();
}