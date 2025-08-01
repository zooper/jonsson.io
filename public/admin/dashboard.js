// Admin dashboard functionality
const adminToken = localStorage.getItem('adminToken');
let photos = [];
let selectedPhotos = new Set();

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

// Check if user is logged in
if (!adminToken) {
    window.location.href = '/admin/index.html';
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/index.html';
}

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

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

async function handleFiles(files) {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const uploadStatus = document.getElementById('uploadStatus');
    
    uploadProgress.style.display = 'block';
    uploadStatus.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = ((i + 1) / files.length) * 100;
        
        progressBar.style.width = progress + '%';
        uploadStatus.innerHTML = 'Uploading ' + (i + 1) + ' of ' + files.length + ': ' + file.name;
        
        try {
            await uploadFile(file);
        } catch (error) {
            console.error('Upload failed:', error);
            uploadStatus.innerHTML += '<br>❌ Failed: ' + file.name;
        }
    }
    
    uploadProgress.style.display = 'none';
    uploadStatus.innerHTML += '<br>✅ Upload complete!';
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
    } catch (error) {
        console.error('Failed to load photos:', error);
        document.getElementById('photosGrid').innerHTML = '<div class="loading">Failed to load photos</div>';
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
        return '<div class="photo-card' + (isSelected ? ' selected' : '') + '" data-photo-id="' + photo.id + '">' +
            '<input type="checkbox" class="photo-checkbox" ' +
                   'onchange="togglePhotoSelection(\'' + photo.id + '\')" ' +
                   (isSelected ? 'checked' : '') + '>' +
            '<img src="' + (photo.thumbnail_url || photo.url) + '" alt="' + (photo.title || '') + '" class="photo-image">' +
            '<div class="photo-info">' +
                '<div class="photo-title">' +
                    '<label>Title:</label>' +
                    '<input type="text" value="' + (photo.title || '') + '" ' +
                           'onchange="updatePhotoMetadata(\'' + photo.id + '\', \'title\', this.value)" ' +
                           'placeholder="Enter custom title...">' +
                '</div>' +
                '<div class="photo-description">' +
                    '<label>Description:</label>' +
                    '<textarea onchange="updatePhotoMetadata(\'' + photo.id + '\', \'description\', this.value)" ' +
                             'placeholder="Enter description...">' + (photo.description || '') + '</textarea>' +
                '</div>' +
                '<div class="photo-actions">' +
                    '<button class="btn btn-rescan" onclick="rescanExif(\'' + photo.id + '\')">Rescan EXIF</button>' +
                    '<button class="btn btn-delete" onclick="deletePhoto(\'' + photo.id + '\')">Delete</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
    
    updateBulkActionsVisibility();
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
        
        // Re-render the photo card to show updated field
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
        uploadStatus.innerHTML = 'Rescanning EXIF data...';
        
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
            
            uploadStatus.innerHTML = '';
            
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
            uploadStatus.innerHTML = '';
            toast.error('EXIF Rescan Failed', error.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Bulk EXIF rescan failed:', error);
        document.getElementById('uploadStatus').innerHTML = '';
        toast.error('EXIF Rescan Failed', error.message);
    }
}

// Load photos on page load
loadPhotos();