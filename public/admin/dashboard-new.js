// Modern Admin Dashboard JavaScript
const adminToken = localStorage.getItem('adminToken');
let photos = [];
let selectedPhotos = new Set();
let themes = [];
let selectedTheme = null;
let currentActiveTheme = null; // Track the actually active theme from server
let currentSection = 'photos';

// Check if user is logged in
if (!adminToken) {
    window.location.href = '/admin/index.html';
}

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const pageTitle = document.getElementById('pageTitle');
const photoCount = document.getElementById('photoCount');

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.toasts = new Map();
        this.idCounter = 0;
    }
    
    show(type, title, message, duration = 5000) {
        const id = ++this.idCounter;
        const toast = this.createToast(id, type, title, message, duration);
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }
        
        return id;
    }
    
    createToast(id, type, title, message, duration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.id = id;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-icon">${icons[type] || 'ℹ'}</div>
                <span>${title}</span>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="toast.hide(${id})">&times;</button>
            ${duration > 0 ? `<div class="toast-progress" style="animation: toast-progress ${duration}ms linear forwards;"></div>` : ''}
        `;
        
        return toast;
    }
    
    hide(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;
        
        toast.classList.add('hiding');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(id);
        }, 300);
    }
    
    success(title, message, duration) {
        return this.show('success', title, message, duration);
    }
    
    error(title, message, duration) {
        return this.show('error', title, message, duration);
    }
    
    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    }
    
    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }
}

// Initialize toast manager
const toast = new ToastManager();

// Add CSS animation for progress bar
const style = document.createElement('style');
style.textContent = `
    @keyframes toast-progress {
        from { width: 100%; }
        to { width: 0%; }
    }
`;
document.head.appendChild(style);

// Sidebar Management
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
}

function toggleMobileSidebar() {
    sidebar.classList.toggle('mobile-open');
}

// Section Management
function switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update page title
    const titles = {
        photos: 'Photos',
        quotes: 'AI Quotes',
        themes: 'Themes',
        dashboard: 'Dashboard',
        visitors: 'Visitors',
        settings: 'Settings'
    };
    
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName] || 'Dashboard';
    }
    
    currentSection = sectionName;
    
    // Load section-specific data
    loadSectionData(sectionName);
    
    // Close mobile sidebar when switching sections
    if (window.innerWidth <= 1024) {
        sidebar.classList.remove('mobile-open');
    }
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'photos':
            loadPhotos();
            break;
        case 'quotes':
            loadQuotes();
            break;
        case 'themes':
            loadThemes();
            break;
        case 'settings':
            loadSiteSettings();
            loadCurrentHeroQuote();
            loadAIStatus();
            break;
        case 'dashboard':
        case 'visitors':
            // Placeholder sections - no data to load yet
            break;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggles
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
    }
    
    // Navigation items
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) &&
            sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }
    });
    
    // Load initial section (photos)
    switchSection('photos');
});

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/index.html';
}

// Photo Management Functions
async function loadPhotos() {
    try {
        const response = await fetch('/admin/api/photos', {
            headers: {
                'Authorization': 'Bearer ' + adminToken
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load photos');
        }
        
        photos = await response.json();
        renderPhotos();
        updatePhotoCount();
    } catch (error) {
        console.error('Failed to load photos:', error);
        document.getElementById('photosGrid').innerHTML = '<div class="loading">Failed to load photos</div>';
    }
}

function updatePhotoCount() {
    if (photoCount) {
        photoCount.textContent = photos.length;
    }
}

function renderPhotos() {
    const grid = document.getElementById('photosGrid');
    
    if (photos.length === 0) {
        grid.innerHTML = '<div class="loading">No photos uploaded yet</div>';
        return;
    }
    
    grid.innerHTML = photos.map((photo, index) => {
        const isSelected = selectedPhotos.has(photo.id);
        return `
            <div class="photo-card${isSelected ? ' selected' : ''}" data-photo-id="${photo.id}">
                <input type="checkbox" class="photo-checkbox" 
                       onchange="togglePhotoSelection('${photo.id}')" 
                       ${isSelected ? 'checked' : ''}>
                <img src="${photo.thumbnail_url || photo.url}" alt="${photo.title || ''}" class="photo-image">
                <div class="photo-info">
                    <div class="photo-title">
                        <label>Title:</label>
                        <input type="text" value="${photo.title || ''}" 
                               onchange="updatePhotoMetadata('${photo.id}', 'title', this.value)" 
                               placeholder="Enter custom title...">
                    </div>
                    <div class="photo-description">
                        <label>Description:</label>
                        <textarea onchange="updatePhotoMetadata('${photo.id}', 'description', this.value)" 
                                 placeholder="Enter description...">${photo.description || ''}</textarea>
                    </div>
                    <div class="photo-actions">
                        <button class="btn btn-rescan" onclick="rescanExif('${photo.id}')">Rescan EXIF</button>
                        <button class="btn btn-delete" onclick="deletePhoto('${photo.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    updateBulkActionsVisibility();
}

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

if (uploadArea && fileInput) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

async function handleFiles(files) {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (!uploadProgress || !progressBar || !uploadStatus) return;
    
    uploadProgress.style.display = 'block';
    uploadStatus.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = ((i + 1) / files.length) * 100;
        
        progressBar.style.width = progress + '%';
        uploadStatus.innerHTML = `Uploading ${i + 1} of ${files.length}: ${file.name}`;
        
        try {
            const result = await uploadFile(file);
            
            // Show quote generation status
            if (result.quoteGenerated) {
                uploadStatus.innerHTML += `<br>🤖 AI quote generated for ${file.name}`;
            } else {
                uploadStatus.innerHTML += `<br>📝 Photo uploaded (quote generation failed)`;
            }
        } catch (error) {
            console.error('Upload failed:', error);
            uploadStatus.innerHTML += `<br>❌ Failed: ${file.name}`;
        }
    }
    
    uploadProgress.style.display = 'none';
    uploadStatus.innerHTML += '<br>✅ Upload complete!';
    
    // Show toast notification with quote generation summary
    const quotesGenerated = uploadStatus && uploadStatus.innerHTML.includes('🤖 AI quote generated');
    
    if (quotesGenerated) {
        toast.success('Upload Complete', 'Photos uploaded and AI quotes generated automatically!');
    } else {
        toast.info('Upload Complete', 'Photos uploaded successfully');
    }
    
    loadPhotos();
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await fetch('/admin/api/upload', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + adminToken
        },
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Upload failed');
    }
    
    return await response.json();
}

async function updatePhotoMetadata(photoId, field, value) {
    // Handle both title and description updates
    if (field !== 'title' && field !== 'description') {
        console.warn('Only title and description updates are supported');
        return;
    }
    
    // Update locally first for immediate UI feedback
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
        photo[field] = value;
        renderPhotos();
    }
    
    // Prepare update payload
    const updates = {};
    updates[field] = value;
    
    // Save to backend
    try {
        const response = await fetch('/admin/api/update', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                photoId: photoId,
                ...updates
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to update photo');
        }
        
        // Show success toast
        toast.success('Updated', `Photo ${field} saved successfully`);
        
    } catch (error) {
        console.error('Error updating photo metadata:', error);
        toast.error('Update Failed', error.message);
        
        // Revert local change on error - reload photos to get original data
        loadPhotos();
    }
}

async function deletePhoto(photoId) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }
    
    try {
        const response = await fetch('/admin/api/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photoId })
        });
        
        if (response.ok) {
            toast.success('Photo Deleted', 'Photo has been successfully deleted.');
            loadPhotos();
        } else {
            const error = await response.json();
            toast.error('Delete Failed', error.message || 'Failed to delete photo');
        }
    } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Delete Failed', error.message);
    }
}

// Bulk selection functions
function togglePhotoSelection(photoId) {
    if (selectedPhotos.has(photoId)) {
        selectedPhotos.delete(photoId);
    } else {
        selectedPhotos.add(photoId);
    }
    
    updateBulkActionsVisibility();
    updatePhotoCardSelection(photoId);
}

function updatePhotoCardSelection(photoId) {
    const photoCard = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (photoCard) {
        if (selectedPhotos.has(photoId)) {
            photoCard.classList.add('selected');
        } else {
            photoCard.classList.remove('selected');
        }
    }
}

function updateBulkActionsVisibility() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (!bulkActions || !selectedCount) return;
    
    if (selectedPhotos.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = selectedPhotos.size;
    } else {
        bulkActions.style.display = 'none';
    }
}

function selectAllPhotos() {
    photos.forEach(photo => {
        selectedPhotos.add(photo.id);
    });
    renderPhotos();
}

function deselectAllPhotos() {
    selectedPhotos.clear();
    renderPhotos();
}

async function bulkDeletePhotos() {
    if (selectedPhotos.size === 0) {
        toast.warning('No Selection', 'Please select photos to delete.');
        return;
    }
    
    const photoCount = selectedPhotos.size;
    if (!confirm(`Are you sure you want to delete ${photoCount} photo${photoCount > 1 ? 's' : ''}?`)) {
        return;
    }
    
    const selectedIds = Array.from(selectedPhotos);
    
    try {
        const response = await fetch('/admin/api/bulk-delete', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photoIds: selectedIds })
        });
        
        if (response.ok) {
            selectedPhotos.clear();
            loadPhotos();
            
            const result = await response.json();
            toast.success('Deletion Complete', `Successfully deleted ${result.deletedCount} photo${result.deletedCount > 1 ? 's' : ''}`);
        } else {
            const error = await response.json();
            toast.error('Deletion Failed', error.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Bulk delete failed:', error);
        toast.error('Deletion Failed', error.message);
    }
}

// EXIF Rescanning functions
async function rescanExif(photoId) {
    toast.info('Processing', 'Rescanning EXIF data...', 0);
    
    try {
        const response = await fetch('/admin/api/rescan-exif', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photoId })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('EXIF rescan result:', result);
            
            if (result.exifData) {
                const foundItems = [];
                if (result.exifData.camera) foundItems.push('Camera info');
                if (result.exifData.lens) foundItems.push('Lens info');
                if (result.exifData.settings) foundItems.push('Settings');
                if (result.exifData.gps) foundItems.push('GPS data');
                
                toast.success('EXIF Found', `Found: ${foundItems.join(', ')}`);
            } else {
                toast.warning('No EXIF Data', 'No EXIF data found in this image.');
            }
            
            // Refresh the photo list to show updated data
            loadPhotos();
        } else {
            const error = await response.json();
            toast.error('EXIF Rescan Failed', error.message || 'Unknown error');
        }
    } catch (error) {
        console.error('EXIF rescan failed:', error);
        toast.error('EXIF Rescan Failed', error.message);
    }
}

async function bulkRescanExif() {
    if (selectedPhotos.size === 0) {
        toast.warning('No Selection', 'Please select photos to rescan EXIF data.');
        return;
    }
    
    const photoCount = selectedPhotos.size;
    if (!confirm(`Rescan EXIF data for ${photoCount} photo${photoCount > 1 ? 's' : ''}? This may take a while.`)) {
        return;
    }
    
    const selectedIds = Array.from(selectedPhotos);
    
    try {
        // Show progress indicator
        const uploadStatus = document.getElementById('uploadStatus');
        if (uploadStatus) {
            uploadStatus.innerHTML = 'Rescanning EXIF data...';
        }
        
        const response = await fetch('/admin/api/bulk-rescan-exif', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photoIds: selectedIds })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Bulk EXIF rescan result:', result);
            
            let successCount = 0;
            let foundExifCount = 0;
            
            result.results.forEach(r => {
                if (r.success) successCount++;
                if (r.exifData) foundExifCount++;
            });
            
            if (uploadStatus) {
                uploadStatus.innerHTML = '';
            }
            
            if (foundExifCount > 0) {
                toast.success('EXIF Rescan Complete', `Rescanned ${successCount} photos. Found EXIF data in ${foundExifCount} photos.`);
            } else {
                toast.warning('EXIF Rescan Complete', `Rescanned ${successCount} photos. No EXIF data found.`);
            }
            
            if (result.errors && result.errors.length > 0) {
                console.log('EXIF rescan errors:', result.errors);
                toast.warning('Some Errors', 'Some photos had errors. Check console for details.');
            }
            
            // Clear selection and refresh
            selectedPhotos.clear();
            loadPhotos();
            
        } else {
            const error = await response.json();
            if (uploadStatus) {
                uploadStatus.innerHTML = '';
            }
            toast.error('EXIF Rescan Failed', error.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Bulk EXIF rescan failed:', error);
        const uploadStatus = document.getElementById('uploadStatus');
        if (uploadStatus) {
            uploadStatus.innerHTML = '';
        }
        toast.error('EXIF Rescan Failed', error.message);
    }
}

// Theme Management Functions
function getCurrentActiveTheme() {
    // Return the actually active theme from server
    return currentActiveTheme;
}

async function loadThemes() {
    try {
        const response = await fetch('/admin/api/themes', {
            headers: {
                'Authorization': 'Bearer ' + adminToken
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            themes = data.themes;
            selectedTheme = data.currentTheme;
            currentActiveTheme = data.currentTheme; // Store the actually active theme
            renderThemes();
        } else {
            toast.error('Error', 'Failed to load themes');
        }
    } catch (error) {
        console.error('Error loading themes:', error);
        toast.error('Error', 'Failed to load themes');
    }
}

function renderThemes() {
    const themeGrid = document.getElementById('themeGrid');
    
    if (!themeGrid) return;
    
    themeGrid.innerHTML = themes.map(theme => `
        <div class="theme-card ${theme.id === selectedTheme ? 'selected' : ''}" 
             data-theme="${theme.id}" 
             onclick="selectTheme('${theme.id}')">
            <div class="theme-preview">
                <div class="preview-elements">
                    <div class="preview-circle"></div>
                    <div class="preview-rect"></div>
                    <div class="preview-line"></div>
                </div>
            </div>
            <div class="theme-info">
                <h3 class="theme-name">${theme.name}</h3>
                <p class="theme-description">${theme.description}</p>
                <div class="theme-colors">
                    <div class="theme-color" style="background: ${theme.colors.primary}"></div>
                    <div class="theme-color" style="background: ${theme.colors.accent}"></div>
                    <div class="theme-color" style="background: ${theme.colors.background}"></div>
                </div>
            </div>
        </div>
    `).join('');
    
    updateApplyButton();
}

function selectTheme(themeId) {
    // Remove previous selection
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked theme
    const selectedCard = document.querySelector(`[data-theme="${themeId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedTheme = themeId;
        updateApplyButton();
    }
}

function updateApplyButton() {
    const applyBtn = document.getElementById('applyThemeBtn');
    if (!applyBtn) return;
    
    const currentTheme = themes.find(t => t.id === selectedTheme);
    
    if (currentTheme) {
        applyBtn.style.display = 'inline-block';
        applyBtn.onclick = () => applyTheme(selectedTheme);
        
        // Check if it's the currently active theme  
        const isCurrentTheme = selectedTheme === getCurrentActiveTheme();
        applyBtn.textContent = isCurrentTheme ? 'Theme Applied' : 'Apply Selected Theme';
        applyBtn.disabled = false;
    } else {
        applyBtn.style.display = 'none';
    }
}

async function applyTheme(themeId) {
    const applyBtn = document.getElementById('applyThemeBtn');
    if (!applyBtn) return;
    
    applyBtn.disabled = true;
    applyBtn.textContent = 'Applying...';
    
    try {
        const response = await fetch('/admin/api/themes', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ themeId })
        });
        
        if (response.ok) {
            const data = await response.json();
            toast.success('Theme Applied', `${themes.find(t => t.id === themeId)?.name} theme is now active on your website!`);
            
            // Update the current active theme
            currentActiveTheme = themeId;
            
            // Update button text
            applyBtn.textContent = 'Theme Applied';
            applyBtn.disabled = false;
            
        } else {
            const error = await response.json();
            toast.error('Apply Failed', error.message || 'Failed to apply theme');
            applyBtn.disabled = false;
            applyBtn.textContent = 'Apply Selected Theme';
        }
    } catch (error) {
        console.error('Error applying theme:', error);
        toast.error('Apply Failed', 'Failed to apply theme');
        applyBtn.disabled = false;
        applyBtn.textContent = 'Apply Selected Theme';
    }
}

// Site Settings Management Functions
async function loadSiteSettings() {
    try {
        const response = await fetch('/admin/api/site-settings', {
            headers: {
                'Authorization': 'Bearer ' + adminToken
            }
        });
        
        if (response.ok) {
            const settings = await response.json();
            populateSettingsForm(settings);
        } else {
            console.log('No site settings found, using defaults');
        }
    } catch (error) {
        console.error('Error loading site settings:', error);
        toast.error('Error', 'Failed to load site settings');
    }
}

function populateSettingsForm(settings) {
    // About settings
    if (settings.about) {
        document.getElementById('aboutTitle').value = settings.about.title || 'About';
        document.getElementById('aboutLead').value = settings.about.lead || '';
        document.getElementById('aboutDescription').value = settings.about.description || '';
        
        // Profile picture
        if (settings.about.profilePicture) {
            showProfilePicture(settings.about.profilePicture);
        }
    }
    
    // Contact settings
    if (settings.contact) {
        document.getElementById('contactTitle').value = settings.contact.title || 'Get In Touch';
        document.getElementById('contactSubtitle').value = settings.contact.subtitle || '';
        document.getElementById('contactEmail').value = settings.contact.email || '';
        document.getElementById('instagramHandle').value = settings.contact.instagramHandle || '';
        document.getElementById('instagramUrl').value = settings.contact.instagramUrl || '';
    }
}

function showProfilePicture(imageUrl) {
    const container = document.getElementById('currentProfileImage');
    container.innerHTML = `<img src="${imageUrl}" alt="Profile Picture">`;
    
    const removeBtn = document.getElementById('removeProfileBtn');
    removeBtn.style.display = 'inline-flex';
}

async function handleProfileImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
        toast.info('Uploading', 'Uploading profile picture...', 0);
        
        const response = await fetch('/admin/api/upload-profile-image', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + adminToken
            },
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            showProfilePicture(result.imageUrl);
            toast.success('Upload Complete', 'Profile picture uploaded successfully');
        } else {
            const error = await response.json();
            toast.error('Upload Failed', error.message || 'Failed to upload profile picture');
        }
    } catch (error) {
        console.error('Profile image upload failed:', error);
        toast.error('Upload Failed', error.message);
    } finally {
        input.value = ''; // Reset file input
    }
}

async function removeProfilePicture() {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
        return;
    }
    
    try {
        const response = await fetch('/admin/api/remove-profile-image', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + adminToken
            }
        });
        
        if (response.ok) {
            const container = document.getElementById('currentProfileImage');
            container.innerHTML = `
                <div class="image-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 2l3 3h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3zm3 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                    </svg>
                    <p>No profile picture uploaded</p>
                </div>
            `;
            
            const removeBtn = document.getElementById('removeProfileBtn');
            removeBtn.style.display = 'none';
            
            toast.success('Removed', 'Profile picture removed successfully');
        } else {
            const error = await response.json();
            toast.error('Remove Failed', error.message || 'Failed to remove profile picture');
        }
    } catch (error) {
        console.error('Remove profile picture failed:', error);
        toast.error('Remove Failed', error.message);
    }
}

async function saveAboutSettings() {
    const aboutSettings = {
        title: document.getElementById('aboutTitle').value,
        lead: document.getElementById('aboutLead').value,
        description: document.getElementById('aboutDescription').value
    };
    
    try {
        const response = await fetch('/admin/api/site-settings/about', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aboutSettings)
        });
        
        if (response.ok) {
            toast.success('Settings Saved', 'About section settings saved successfully');
        } else {
            const error = await response.json();
            toast.error('Save Failed', error.message || 'Failed to save about settings');
        }
    } catch (error) {
        console.error('Save about settings failed:', error);
        toast.error('Save Failed', error.message);
    }
}

async function saveContactSettings() {
    const contactSettings = {
        title: document.getElementById('contactTitle').value,
        subtitle: document.getElementById('contactSubtitle').value,
        email: document.getElementById('contactEmail').value,
        instagramHandle: document.getElementById('instagramHandle').value,
        instagramUrl: document.getElementById('instagramUrl').value
    };
    
    try {
        const response = await fetch('/admin/api/site-settings/contact', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactSettings)
        });
        
        if (response.ok) {
            toast.success('Settings Saved', 'Contact settings saved successfully');
        } else {
            const error = await response.json();
            toast.error('Save Failed', error.message || 'Failed to save contact settings');
        }
    } catch (error) {
        console.error('Save contact settings failed:', error);
        toast.error('Save Failed', error.message);
    }
}

// Hero Quote Management Functions
async function loadCurrentHeroQuote() {
    try {
        const response = await fetch('/api/hero-quote');
        
        if (response.ok) {
            const data = await response.json();
            displayHeroQuote(data);
        } else {
            console.log('No current hero quote found, using default');
            displayHeroQuote({
                quote: "Every photograph is a window into a moment that will never happen again",
                photo: null,
                lastUpdated: null
            });
        }
    } catch (error) {
        console.error('Error loading current hero quote:', error);
        toast.error('Error', 'Failed to load current hero quote');
    }
}

function displayHeroQuote(data) {
    const heroImagePreview = document.getElementById('heroImagePreview');
    const heroQuoteText = document.getElementById('heroQuoteText');
    const heroQuoteMeta = document.getElementById('heroQuoteMeta');
    
    // Update quote text
    if (heroQuoteText) {
        heroQuoteText.textContent = `"${data.quote}"`;
    }
    
    // Update image preview
    if (heroImagePreview && data.photo) {
        heroImagePreview.innerHTML = `<img src="${data.photo.url}" alt="${data.photo.title || 'Featured image'}">`;
    } else if (heroImagePreview) {
        heroImagePreview.innerHTML = `
            <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 2l3 3h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3zm3 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
                <p>Default quote (no featured image)</p>
            </div>
        `;
    }
    
    // Update meta information
    if (heroQuoteMeta) {
        if (data.lastUpdated) {
            const lastUpdated = new Date(data.lastUpdated).toLocaleString();
            heroQuoteMeta.innerHTML = `<span class="last-updated">Last updated: ${lastUpdated}</span>`;
        } else {
            heroQuoteMeta.innerHTML = `<span class="last-updated">Using default quote</span>`;
        }
    }
}

async function refreshHeroQuote() {
    const refreshBtn = document.querySelector('button[onclick="refreshHeroQuote()"]');
    
    if (!refreshBtn) return;
    
    // Show loading state
    const originalText = refreshBtn.innerHTML;
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
        </svg>
        Generating...
    `;
    
    try {
        toast.info('Processing', 'Generating new AI quote based on random photo...', 0);
        
        const response = await fetch('/admin/api/refresh-hero-quote', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Display the new quote and update status
            displayHeroQuote(result);
            await loadAIStatus();
            
            // Show success notification
            const aiGenerated = result.quote !== "Every photograph is a window into a moment that will never happen again";
            if (aiGenerated) {
                toast.success('Quote Generated', 'New AI-generated quote is now active on your homepage!');
            } else {
                toast.info('Fallback Quote', 'Generated a new quote using fallback system.');
            }
            
        } else {
            const error = await response.json();
            toast.error('Generation Failed', error.message || 'Failed to generate new quote');
        }
        
    } catch (error) {
        console.error('Error refreshing hero quote:', error);
        toast.error('Generation Failed', error.message);
    } finally {
        // Restore button state
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = originalText;
    }
}

async function setupAIQuotes() {
    const setupBtn = document.querySelector('button[onclick="setupAIQuotes()"]');
    
    if (!setupBtn) return;
    
    // Show loading state
    const originalText = setupBtn.innerHTML;
    setupBtn.disabled = true;
    setupBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
        </svg>
        Setting up...
    `;
    
    try {
        toast.info('Setting Up', 'Initializing AI quotes database and generating first quote...', 0);
        
        const response = await fetch('/admin/api/migrate-ai-quotes', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Show success notification
            toast.success('Setup Complete', 'AI quotes system is now ready to use!');
            
            // Reload the current hero quote and status
            await loadCurrentHeroQuote();
            await loadAIStatus();
            
        } else {
            const error = await response.json();
            toast.error('Setup Failed', error.message || 'Failed to setup AI quotes');
        }
        
    } catch (error) {
        console.error('Error setting up AI quotes:', error);
        toast.error('Setup Failed', error.message);
    } finally {
        // Restore button state
        setupBtn.disabled = false;
        setupBtn.innerHTML = originalText;
    }
}

// AI Status Management Functions
async function loadAIStatus() {
    try {
        const response = await fetch('/admin/api/ai-status', {
            headers: {
                'Authorization': 'Bearer ' + adminToken
            }
        });
        
        if (response.ok) {
            const status = await response.json();
            displayAIStatus(status);
        } else {
            console.error('Failed to load AI status');
            displayAIStatus({
                status: 'error',
                openai: { configured: false, working: false },
                database: { quotes: 0, photos: 0 }
            });
        }
    } catch (error) {
        console.error('Error loading AI status:', error);
        displayAIStatus({
            status: 'error',
            openai: { configured: false, working: false },
            database: { quotes: 0, photos: 0 }
        });
    }
}

function displayAIStatus(status) {
    const statusBadge = document.getElementById('statusBadge');
    const openaiStatus = document.getElementById('openaiStatus');
    const quotesCount = document.getElementById('quotesCount');
    const photosCount = document.getElementById('photosCount');
    
    if (!statusBadge) return;
    
    // Update main status badge
    statusBadge.className = 'status-badge ' + status.status;
    
    const statusMessages = {
        'ai_active': { icon: '🤖', text: 'AI Active' },
        'quotes_available': { icon: '💬', text: 'Quotes Available' },
        'fallback_only': { icon: '📝', text: 'Fallback Only' },
        'error': { icon: '❌', text: 'Error' }
    };
    
    const statusInfo = statusMessages[status.status] || { icon: '❓', text: 'Unknown' };
    statusBadge.innerHTML = `
        <div class="status-icon">${statusInfo.icon}</div>
        <span>${statusInfo.text}</span>
    `;
    
    // Update detailed status
    if (openaiStatus) {
        if (status.openai.configured) {
            if (status.openai.working) {
                openaiStatus.innerHTML = '<span class="success">✓ Working</span>';
            } else {
                openaiStatus.innerHTML = '<span class="error">✗ Error</span>';
                if (status.openai.error) {
                    openaiStatus.title = status.openai.error;
                }
            }
        } else {
            openaiStatus.innerHTML = '<span class="warning">Not Configured</span>';
        }
    }
    
    if (quotesCount) {
        quotesCount.textContent = status.database.quotes || 0;
        quotesCount.className = status.database.quotes > 0 ? 'success' : 'warning';
    }
    
    if (photosCount) {
        photosCount.textContent = status.database.photos || 0;
        photosCount.className = status.database.photos > 0 ? 'success' : 'error';
    }
}

// Bulk Quote Update Function
async function updateAllQuotes() {
    const updateBtn = document.querySelector('button[onclick="updateAllQuotes()"]');
    
    if (!updateBtn) return;
    
    // Confirm action since this is a big operation
    const photoCount = document.getElementById('photosCount')?.textContent || 'unknown';
    if (!confirm(`This will generate AI quotes for all ${photoCount} photos in your gallery. This may take several minutes. Continue?`)) {
        return;
    }
    
    // Show loading state
    const originalText = updateBtn.innerHTML;
    updateBtn.disabled = true;
    updateBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
        </svg>
        Processing...
    `;
    
    try {
        toast.info('Processing', `Generating personalized AI quotes for all photos. This may take several minutes...`, 0);
        
        const response = await fetch('/admin/api/update-all-quotes', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Show detailed success notification
            const aiText = result.usingAI ? 'AI-generated' : 'fallback';
            toast.success('Bulk Update Complete', 
                `Generated ${result.generated} ${aiText} quotes for ${result.total} photos! Your homepage now has maximum variety.`
            );
            
            // Show sample results in console for debugging
            console.log('Bulk quote update results:', result);
            
            if (result.sampleResults && result.sampleResults.length > 0) {
                console.log('Sample generated quotes:', result.sampleResults);
            }
            
            if (result.errors > 0) {
                toast.warning('Some Errors', 
                    `${result.errors} photos had errors. Check console for details.`
                );
                console.error('Quote generation errors:', result.errorDetails);
            }
            
            // Reload status and current quote
            await loadCurrentHeroQuote();
            await loadAIStatus();
            
        } else {
            const error = await response.json();
            toast.error('Bulk Update Failed', error.message || 'Failed to update all quotes');
        }
        
    } catch (error) {
        console.error('Error updating all quotes:', error);
        toast.error('Bulk Update Failed', error.message);
    } finally {
        // Restore button state
        updateBtn.disabled = false;
        updateBtn.innerHTML = originalText;
    }
}

// Quotes Management Functions
async function loadQuotes() {
    try {
        const response = await fetch('/admin/api/quotes', {
            headers: {
                'Authorization': 'Bearer ' + adminToken
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load quotes');
        }
        
        const data = await response.json();
        renderQuotes(data.quotes || []);
        updateQuotesCount(data.total || 0);
    } catch (error) {
        console.error('Failed to load quotes:', error);
        document.getElementById('quotesGrid').innerHTML = '<div class="loading">Failed to load quotes</div>';
    }
}

function updateQuotesCount(count) {
    const quotesCountEl = document.getElementById('quotesCount');
    if (quotesCountEl) {
        quotesCountEl.textContent = count;
    }
}

function renderQuotes(quotes) {
    const grid = document.getElementById('quotesGrid');
    
    if (quotes.length === 0) {
        grid.innerHTML = '<div class="loading">No quotes found. Run "Update All Quotes" to generate quotes for your photos.</div>';
        return;
    }
    
    grid.innerHTML = quotes.map(quote => `
        <div class="quote-card" data-quote-id="${quote.quote_id}">
            <div class="quote-image">
                <img src="${quote.photo_thumbnail || quote.photo_url}" alt="${quote.photo_title || 'Photo'}" loading="lazy">
            </div>
            <div class="quote-content">
                <div class="quote-meta">
                    <h3 class="photo-title">${quote.photo_title || 'Untitled'}</h3>
                    <p class="photo-description">${quote.photo_description || 'No description'}</p>
                    <span class="quote-date">Generated: ${new Date(quote.created_at).toLocaleDateString()}</span>
                </div>
                <div class="quote-text-container">
                    <label for="quote-${quote.quote_id}">AI Quote:</label>
                    <textarea 
                        id="quote-${quote.quote_id}" 
                        class="quote-textarea"
                        rows="3"
                        placeholder="Enter quote..."
                    >${quote.quote}</textarea>
                </div>
                <div class="quote-actions">
                    <button class="btn btn-primary" onclick="updateQuote('${quote.quote_id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        Save Quote
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function updateQuote(quoteId) {
    const textarea = document.getElementById(`quote-${quoteId}`);
    if (!textarea) return;
    
    const newQuote = textarea.value.trim();
    if (!newQuote) {
        toast.error('Invalid Quote', 'Quote cannot be empty');
        return;
    }
    
    try {
        toast.info('Saving', 'Updating quote...', 0);
        
        const response = await fetch('/admin/api/quotes/update', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteId: quoteId,
                quote: newQuote
            })
        });
        
        if (response.ok) {
            toast.success('Quote Updated', 'Quote has been successfully updated');
        } else {
            const error = await response.json();
            toast.error('Update Failed', error.message || 'Failed to update quote');
        }
    } catch (error) {
        console.error('Error updating quote:', error);
        toast.error('Update Failed', error.message);
    }
}

function refreshQuotesList() {
    loadQuotes();
}