// Admin interface JavaScript
let authToken = localStorage.getItem('adminToken');
let currentPosts = [];
let currentPostId = null;
let uploadedImages = [];
let blockEditor = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
    // Editor will be initialized when needed
});

function checkAuth() {
    const loginModal = document.getElementById('login-modal');
    const adminInterface = document.getElementById('admin-interface');
    
    if (authToken) {
        // Verify token by making a request
        fetch('/api/admin/posts', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (response.ok) {
                showAdminInterface();
                showPostsSection(); // Start with posts section active
            } else {
                showLoginModal();
            }
        })
        .catch(() => {
            showLoginModal();
        });
    } else {
        showLoginModal();
    }
    
    function showLoginModal() {
        loginModal.classList.add('active');
        adminInterface.classList.remove('active');
    }
    
    function showAdminInterface() {
        loginModal.classList.remove('active');
        adminInterface.classList.add('active');
    }
}

async function initializeRichTextEditor() {
    // Check if editor is already initialized
    if (blockEditor) {
        return blockEditor;
    }
    
    // Check if the container exists
    const container = document.getElementById('post-content');
    if (!container) {
        console.error('Editor container not found!');
        return null;
    }
    
    // Wait for EditorJS to be available
    if (typeof EditorJS === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
        return initializeRichTextEditor();
    }
    
    try {
        // Initialize EditorJS with Gutenberg-like blocks
        blockEditor = new EditorJS({
            holder: 'post-content',
            placeholder: 'Tell your story...',
            autofocus: true,
            tools: {
                header: {
                    class: window.Header,
                    config: {
                        placeholder: 'Enter a header',
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: window.List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                quote: {
                    class: window.Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author'
                    }
                },
                image: {
                    class: window.ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: async (file) => {
                                return await uploadImageForEditor(file);
                            }
                        }
                    }
                },
                imageLibrary: {
                    class: createImageLibraryTool(),
                    config: {}
                },
                embed: {
                    class: window.Embed,
                    config: {
                        services: {
                            youtube: true,
                            twitter: true,
                            instagram: true,
                            vimeo: true,
                            coub: true
                        }
                    }
                },
                table: {
                    class: window.Table,
                    inlineToolbar: true
                },
                code: {
                    class: window.CodeTool,
                    config: {
                        placeholder: 'Enter code here...'
                    }
                },
                raw: {
                    class: window.RawTool,
                    config: {
                        placeholder: 'Enter raw HTML...'
                    }
                },
                delimiter: window.Delimiter
            },
            onChange: () => {
                // Content changed
            },
            onReady: () => {
                // Editor ready
            }
        });
        
        return blockEditor;
    } catch (error) {
        console.error('Failed to initialize EditorJS:', error);
        return null;
    }
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Navigation
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('posts-nav-btn').addEventListener('click', showPostsSection);
    document.getElementById('gallery-nav-btn').addEventListener('click', showGallerySection);
    document.getElementById('about-nav-btn').addEventListener('click', showAboutSection);
    document.getElementById('themes-nav-btn').addEventListener('click', showThemesSection);
    document.getElementById('images-nav-btn').addEventListener('click', showImagesSection);
    document.getElementById('social-nav-btn').addEventListener('click', showSocialSection);
    document.getElementById('bucket-nav-btn').addEventListener('click', showBucketSection);
    document.getElementById('new-post-btn').addEventListener('click', showNewPostEditor);
    document.getElementById('cancel-edit-btn').addEventListener('click', showPostsList);
    
    // Initialize navigation reordering
    initializeNavigationReordering();
    
    // Post form
    const savePostBtn = document.getElementById('save-post-btn');
    if (savePostBtn) savePostBtn.addEventListener('click', savePost);
    
    // Slug editing
    const editSlugBtn = document.getElementById('edit-slug-btn');
    const regenerateSlugBtn = document.getElementById('regenerate-slug-btn');
    const cancelSlugBtn = document.getElementById('cancel-slug-btn');
    if (editSlugBtn) editSlugBtn.addEventListener('click', enableSlugEditing);
    if (regenerateSlugBtn) regenerateSlugBtn.addEventListener('click', regenerateSlugFromTitle);
    if (cancelSlugBtn) cancelSlugBtn.addEventListener('click', cancelSlugEditing);
    
    // Featured image
    const selectFeaturedBtn = document.getElementById('select-featured-btn');
    const removeFeaturedBtn = document.getElementById('remove-featured-btn');
    if (selectFeaturedBtn) selectFeaturedBtn.addEventListener('click', () => openFileManager('featured'));
    if (removeFeaturedBtn) removeFeaturedBtn.addEventListener('click', removeFeaturedImage);
    
    // File manager
    const manageImagesBtn = document.getElementById('manage-images-btn');
    const fileManagerClose = document.getElementById('file-manager-close');
    const cancelFileManagerBtn = document.getElementById('cancel-file-manager-btn');
    
    if (manageImagesBtn) manageImagesBtn.addEventListener('click', () => openFileManager('manage'));
    if (fileManagerClose) fileManagerClose.addEventListener('click', closeFileManager);
    if (cancelFileManagerBtn) cancelFileManagerBtn.addEventListener('click', closeFileManager);
    
    // File manager mode buttons
    const selectModeBtn = document.getElementById('select-mode-btn');
    const manageModeBtn = document.getElementById('manage-mode-btn');
    
    if (selectModeBtn) selectModeBtn.addEventListener('click', () => switchFileManagerMode('select'));
    if (manageModeBtn) manageModeBtn.addEventListener('click', () => switchFileManagerMode('manage'));
    
    // File manager action buttons
    const selectImagesBtn = document.getElementById('select-images-btn');
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    
    if (selectImagesBtn) selectImagesBtn.addEventListener('click', selectImages);
    if (deleteSelectedBtn) deleteSelectedBtn.addEventListener('click', deleteSelectedImages);
    
    // Gallery management
    const addToGalleryBtn = document.getElementById('add-to-gallery-btn');
    
    if (addToGalleryBtn) addToGalleryBtn.addEventListener('click', () => openFileManager('homepage-gallery'));
    
    // Image library management
    const uploadImagesBtn = document.getElementById('upload-images-btn');
    const bulkUploadInput = document.getElementById('bulk-upload-input');
    const updateExifBtn = document.getElementById('update-exif-btn');
    const migrateImagesBtn = document.getElementById('migrate-images-btn');
    const imagesSearch = document.getElementById('images-search');
    
    if (uploadImagesBtn) uploadImagesBtn.addEventListener('click', () => bulkUploadInput.click());
    if (bulkUploadInput) bulkUploadInput.addEventListener('change', handleBulkImageUpload);
    if (updateExifBtn) updateExifBtn.addEventListener('click', updateExifForAllImages);
    if (migrateImagesBtn) migrateImagesBtn.addEventListener('click', migrateImagesToFolder);
    if (imagesSearch) imagesSearch.addEventListener('input', filterImages);
    
    // S3 bucket import
    const testB2Btn = document.getElementById('test-b2-btn');
    const refreshBucketBtn = document.getElementById('refresh-bucket-btn');
    const importSelectedBtn = document.getElementById('import-selected-btn');
    const bucketSearch = document.getElementById('bucket-search');
    const fileTypeFilter = document.getElementById('file-type-filter');
    
    if (testB2Btn) testB2Btn.addEventListener('click', testB2Connection);
    if (refreshBucketBtn) refreshBucketBtn.addEventListener('click', () => loadBucketFiles());
    if (importSelectedBtn) importSelectedBtn.addEventListener('click', importSelectedFiles);
    if (bucketSearch) bucketSearch.addEventListener('input', filterBucketFiles);
    if (fileTypeFilter) fileTypeFilter.addEventListener('change', () => loadBucketFiles());
    
    // Social links management
    const addSocialLinkBtn = document.getElementById('add-social-link-btn');
    const socialLinkModal = document.getElementById('social-link-modal');
    const socialLinkModalClose = document.getElementById('social-link-modal-close');
    const cancelSocialLinkBtn = document.getElementById('cancel-social-link-btn');
    const socialLinkForm = document.getElementById('social-link-form');
    
    if (addSocialLinkBtn) addSocialLinkBtn.addEventListener('click', () => openSocialLinkModal());
    if (socialLinkModalClose) socialLinkModalClose.addEventListener('click', closeSocialLinkModal);
    if (cancelSocialLinkBtn) cancelSocialLinkBtn.addEventListener('click', closeSocialLinkModal);
    if (socialLinkForm) socialLinkForm.addEventListener('submit', saveSocialLink);
    
    // Icon picker management
    const iconPickerBtn = document.getElementById('icon-picker-btn');
    const iconPickerModalClose = document.getElementById('icon-picker-modal-close');
    const cancelIconPickerBtn = document.getElementById('cancel-icon-picker-btn');
    const platformInput = document.getElementById('social-platform');
    
    if (iconPickerBtn) iconPickerBtn.addEventListener('click', openIconPicker);
    if (iconPickerModalClose) iconPickerModalClose.addEventListener('click', closeIconPicker);
    if (cancelIconPickerBtn) cancelIconPickerBtn.addEventListener('click', closeIconPicker);
    if (platformInput) platformInput.addEventListener('input', autoDetectIcon);
    
    // Search
    document.getElementById('posts-search').addEventListener('input', filterPosts);
}

function showImageSelectionModal() {
    const modalHtml = `
        <div id="image-selection-modal" class="modal active">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add Image</h2>
                    <button class="modal-close" onclick="closeImageSelectionModal()">&times;</button>
                </div>
                <div class="image-selection-options">
                    <button class="btn btn-primary btn-large" onclick="selectFromLibrary()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                        Select from Image Library
                    </button>
                    <button class="btn btn-outline btn-large" onclick="uploadNewImage()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                        Upload New Image
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeImageSelectionModal() {
    const modal = document.getElementById('image-selection-modal');
    if (modal) {
        modal.remove();
    }
}

async function uploadImageForEditor(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        
        const imageData = await response.json();
        
        return {
            success: 1,
            file: {
                url: imageData.b2_url,
                size: imageData.file_size,
                name: imageData.original_filename,
                extension: imageData.original_filename.split('.').pop()
            }
        };
        
    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            success: 0,
            error: error.message
        };
    }
}

function selectFromLibrary() {
    closeImageSelectionModal();
    openFileManager('editor-image');
}

function uploadNewImage() {
    closeImageSelectionModal();
    selectLocalImage();
}

function selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            await insertImageIntoEditor(file);
        }
    };
}

async function insertImageIntoEditor(file) {
    try {
        const uploadResult = await uploadImageForEditor(file);
        
        if (uploadResult.success && blockEditor) {
            // Insert image block at the end
            const blocksCount = await blockEditor.blocks.getBlocksCount();
            blockEditor.blocks.insert('image', {
                file: uploadResult.file,
                caption: '',
                withBorder: false,
                withBackground: false,
                stretched: false
            }, {}, blocksCount);
        } else {
            throw new Error(uploadResult.error || 'Failed to upload image');
        }
        
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image: ' + error.message);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            checkAuth();
        } else {
            errorElement.textContent = data.error || 'Login failed';
        }
    } catch (error) {
        errorElement.textContent = 'Connection error. Please try again.';
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    checkAuth();
}

async function loadPosts() {
    const postsListElement = document.getElementById('posts-list');
    postsListElement.innerHTML = '<div class="loading">Loading posts...</div>';
    
    try {
        const response = await fetch('/api/admin/posts', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        
        currentPosts = await response.json();
        renderPosts(currentPosts);
    } catch (error) {
        postsListElement.innerHTML = '<div class="error-message">Error loading posts. Please try again.</div>';
    }
}

function renderPosts(posts) {
    const postsListElement = document.getElementById('posts-list');
    
    if (posts.length === 0) {
        postsListElement.innerHTML = `
            <div class="loading" style="text-align: center; padding: 4rem; color: #718096;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 1rem; opacity: 0.5;">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <h3 style="margin-bottom: 0.5rem; color: #4a5568;">No posts found</h3>
                <p>Create your first post to get started.</p>
            </div>
        `;
        return;
    }
    
    const postsHTML = posts.map(post => {
        const createdDate = new Date(post.created_at);
        const updatedDate = new Date(post.updated_at);
        const isUpdated = updatedDate > createdDate;
        const displayDate = isUpdated ? updatedDate : createdDate;
        const dateText = isUpdated ? 'Updated' : 'Created';
        
        const status = post.published ? 'published' : 'draft';
        const statusText = post.published ? 'Published' : 'Draft';
        
        // Create content preview (strip HTML and truncate)
        let contentPreview = '';
        if (post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            contentPreview = textContent.length > 300 ? 
                textContent.substring(0, 300) + '...' : 
                textContent;
        }
        
        // Create thumbnail HTML
        const thumbnailHtml = post.featured_image_url ? 
            `<div class="post-thumbnail">
                <img src="${post.featured_image_url}" alt="${post.title}" loading="lazy">
            </div>` : 
            `<div class="post-thumbnail">
                <div class="post-thumbnail-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                </div>
            </div>`;

        return `
            <div class="post-item">
                <div class="post-item-content">
                    ${thumbnailHtml}
                    <div class="post-item-header">
                        <div class="post-info">
                            <h3>${post.title}</h3>
                            <div class="post-meta">
                                <div class="post-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                    </svg>
                                    <span>${dateText}: ${displayDate.toLocaleDateString()}</span>
                                </div>
                                ${post.slug ? `
                                    <div class="post-meta-item">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                                        </svg>
                                        <span>/${post.slug}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <span class="post-status ${status}">${statusText}</span>
                        </div>
                        <div class="post-actions">
                            <button class="btn btn-outline" onclick="editPost(${post.id})">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                Edit
                            </button>
                            <button class="btn btn-danger" onclick="deletePost(${post.id})">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                ${contentPreview ? `<div class="post-preview">${contentPreview}</div>` : ''}
            </div>
        `;
    }).join('');
    
    postsListElement.innerHTML = postsHTML;
}

function filterPosts() {
    const searchTerm = document.getElementById('posts-search').value.toLowerCase();
    const filteredPosts = currentPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        (post.content && post.content.toLowerCase().includes(searchTerm))
    );
    renderPosts(filteredPosts);
}

function showPostsSection() {
    // Hide all sections
    document.getElementById('posts-section').classList.add('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('themes-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.remove('active');
    
    // Update nav buttons
    updateNavButtons('posts');
    
    loadPosts();
}

function showGallerySection() {
    // Hide all sections
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.add('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('themes-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.remove('active');
    
    // Update nav buttons
    updateNavButtons('gallery');
    
    loadGalleryAdmin();
}

function showAboutSection() {
    // Hide all sections
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.add('active');
    document.getElementById('themes-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.remove('active');
    
    // Update nav buttons
    updateNavButtons('about');
    
    loadAboutAdmin();
}

function showImagesSection() {
    // Hide all sections
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('themes-section').classList.remove('active');
    document.getElementById('images-section').classList.add('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.remove('active');
    
    // Update nav buttons
    updateNavButtons('images');
    
    loadImagesLibrary();
}

function showThemesSection() {
    // Hide all sections
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('themes-section').classList.add('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.remove('active');
    
    // Update nav buttons
    updateNavButtons('themes');
    
    loadThemesInterface();
}

function showSocialSection() {
    // Hide all sections
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('themes-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('social-section').classList.add('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.remove('active');
    
    // Update nav buttons
    updateNavButtons('social');
    
    loadSocialLinks();
}

function showBucketSection() {
    // Hide all sections
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('themes-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('social-section').classList.remove('active');
    document.getElementById('bucket-section').classList.add('active');
    document.getElementById('editor-section').classList.remove('active');
    
    // Update nav buttons
    updateNavButtons('bucket');
    
    // Don't auto-load bucket files - wait for user to click refresh
}

function updateNavButtons(activeSection) {
    const navButtons = ['posts-nav-btn', 'gallery-nav-btn', 'about-nav-btn', 'themes-nav-btn', 'images-nav-btn', 'social-nav-btn', 'bucket-nav-btn'];
    
    navButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    });
    
    const activeBtn = document.getElementById(`${activeSection}-nav-btn`);
    if (activeBtn) {
        activeBtn.classList.add('btn-primary');
        activeBtn.classList.remove('btn-outline');
    }
}

function showPostsList() {
    document.getElementById('posts-section').classList.add('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.remove('active');
    currentPostId = null;
    resetPostForm();
}

async function showNewPostEditor() {
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.add('active');
    document.getElementById('editor-title').textContent = 'New Post';
    resetPostForm();
    
    // Initialize editor when showing editor section
    await initializeRichTextEditor();
}

function resetPostForm() {
    document.getElementById('post-form').reset();
    if (blockEditor) {
        blockEditor.clear();
    }
    removeFeaturedImage();
    uploadedImages = [];
    currentPostId = null;
    
    // Reset slug editing state
    isEditingSlug = false;
    document.getElementById('post-slug').value = '';
    cancelSlugEditing();
}

// Convert HTML to EditorJS blocks
async function convertHtmlToBlocks(html) {
    if (!html || html.trim() === '') {
        return [];
    }
    
    const blocks = [];
    
    // Create a temporary container to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Process each child element
    for (const element of tempDiv.children) {
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                blocks.push({
                    type: 'header',
                    data: {
                        text: element.textContent,
                        level: parseInt(tagName[1])
                    }
                });
                break;
                
            case 'p':
                // Check if paragraph contains an image
                const img = element.querySelector('img');
                if (img) {
                    // Convert image to imageLibrary block
                    blocks.push({
                        type: 'imageLibrary',
                        data: {
                            url: img.src,
                            caption: img.alt || '',
                            width: img.getAttribute('data-width') || 'auto',
                            maxWidth: img.getAttribute('data-max-width') || '100%',
                            file: {
                                url: img.src
                            }
                        }
                    });
                    
                    // If there's also text in the paragraph (after image), add it as separate paragraph
                    const textContent = element.textContent.trim();
                    if (textContent && textContent !== img.alt) {
                        blocks.push({
                            type: 'paragraph',
                            data: {
                                text: textContent
                            }
                        });
                    }
                } else if (element.textContent.trim()) {
                    blocks.push({
                        type: 'paragraph',
                        data: {
                            text: element.innerHTML
                        }
                    });
                }
                break;
                
            case 'img':
                // Standalone image
                blocks.push({
                    type: 'imageLibrary',
                    data: {
                        url: element.src,
                        caption: element.alt || '',
                        width: element.getAttribute('data-width') || 'auto',
                        maxWidth: element.getAttribute('data-max-width') || '100%',
                        file: {
                            url: element.src
                        }
                    }
                });
                break;
                
            case 'ul':
            case 'ol':
                const items = Array.from(element.querySelectorAll('li')).map(li => li.innerHTML);
                blocks.push({
                    type: 'list',
                    data: {
                        style: tagName === 'ol' ? 'ordered' : 'unordered',
                        items: items
                    }
                });
                break;
                
            case 'blockquote':
                blocks.push({
                    type: 'quote',
                    data: {
                        text: element.textContent,
                        caption: ''
                    }
                });
                break;
                
            case 'pre':
                const code = element.querySelector('code');
                blocks.push({
                    type: 'code',
                    data: {
                        code: code ? code.textContent : element.textContent
                    }
                });
                break;
                
            default:
                // For any other element, treat as paragraph
                if (element.textContent.trim()) {
                    blocks.push({
                        type: 'paragraph',
                        data: {
                            text: element.innerHTML
                        }
                    });
                }
                break;
        }
    }
    
    // If no blocks were created but we have content, create a single paragraph
    if (blocks.length === 0 && html.trim()) {
        blocks.push({
            type: 'paragraph',
            data: {
                text: html
            }
        });
    }
    
    return blocks;
}

// Convert EditorJS blocks to HTML
async function convertBlocksToHtml(blocks) {
    let html = '';
    
    for (const block of blocks) {
        switch (block.type) {
            case 'paragraph':
                html += `<p>${block.data.text}</p>`;
                break;
            case 'header':
                const level = block.data.level || 2;
                html += `<h${level}>${block.data.text}</h${level}>`;
                break;
            case 'list':
                const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
                html += `<${listType}>`;
                block.data.items.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += `</${listType}>`;
                break;
            case 'quote':
                html += `<blockquote><p>${block.data.text}</p>`;
                if (block.data.caption) {
                    html += `<cite>${block.data.caption}</cite>`;
                }
                html += `</blockquote>`;
                break;
            case 'image':
                html += `<img src="${block.data.file.url}" alt="${block.data.caption || ''}"`;
                if (block.data.caption) {
                    html += ` title="${block.data.caption}"`;
                }
                html += `>`;
                if (block.data.caption) {
                    html += `<p><em>${block.data.caption}</em></p>`;
                }
                break;
            case 'imageLibrary':
                if (block.data.url) {
                    // Include width styling if specified
                    const widthStyle = block.data.width && block.data.width !== 'auto' 
                        ? ` style="width: ${block.data.width}; max-width: ${block.data.maxWidth || '100%'};"` 
                        : '';
                    html += `<img src="${block.data.url}" alt="${block.data.caption || ''}"`;
                    if (block.data.caption) {
                        html += ` title="${block.data.caption}"`;
                    }
                    // Add width data attributes for restoration
                    if (block.data.width) {
                        html += ` data-width="${block.data.width}"`;
                    }
                    if (block.data.maxWidth) {
                        html += ` data-max-width="${block.data.maxWidth}"`;
                    }
                    html += `${widthStyle}>`;
                    if (block.data.caption) {
                        html += `<p><em>${block.data.caption}</em></p>`;
                    }
                }
                break;
            case 'code':
                html += `<pre><code>${block.data.code}</code></pre>`;
                break;
            case 'raw':
                html += block.data.html;
                break;
            case 'delimiter':
                html += `<hr>`;
                break;
            case 'table':
                html += `<table>`;
                block.data.content.forEach(row => {
                    html += `<tr>`;
                    row.forEach(cell => {
                        html += `<td>${cell}</td>`;
                    });
                    html += `</tr>`;
                });
                html += `</table>`;
                break;
            case 'embed':
                if (block.data.service === 'youtube') {
                    html += `<iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allowfullscreen></iframe>`;
                } else {
                    html += `<div class="embed" data-service="${block.data.service}">${block.data.embed}</div>`;
                }
                break;
            default:
                // Fallback for unknown block types
                if (block.data.text) {
                    html += `<p>${block.data.text}</p>`;
                }
                break;
        }
    }
    
    return html;
}

async function editPost(postId) {
    currentPostId = postId;
    const post = currentPosts.find(p => p.id === postId);
    
    if (!post) {
        console.error('Post not found with ID:', postId);
        return;
    }
    
    // Fill form with post data
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-slug').value = post.slug;
    if (blockEditor) {
        // Parse HTML content and convert to EditorJS blocks
        try {
            const blocks = await convertHtmlToBlocks(post.content || '');
            blockEditor.render({ blocks });
        } catch (error) {
            console.error('Error loading post content:', error);
            // Fallback: create a single paragraph block with the content
            blockEditor.render({
                blocks: [{
                    type: 'paragraph',
                    data: {
                        text: post.content || ''
                    }
                }]
            });
        }
    }
    document.getElementById('post-published').checked = post.published;
    
    // Load featured image if exists
    if (post.featured_image_url && post.featured_image_id) {
        setFeaturedImage(post.featured_image_id, post.featured_image_url);
    } else {
        removeFeaturedImage();
    }
    
    
    // Show editor
    document.getElementById('posts-section').classList.remove('active');
    document.getElementById('gallery-section').classList.remove('active');
    document.getElementById('about-section').classList.remove('active');
    document.getElementById('images-section').classList.remove('active');
    document.getElementById('bucket-section').classList.remove('active');
    document.getElementById('editor-section').classList.add('active');
    document.getElementById('editor-title').textContent = 'Edit Post';
    
    // Initialize editor when showing editor section
    await initializeRichTextEditor();
}

// Make functions globally accessible for onclick handlers
window.editPost = editPost;
window.deletePost = deletePost;
window.openFileManager = openFileManager;
window.closeImageSelectionModal = closeImageSelectionModal;
window.selectFromLibrary = selectFromLibrary;
window.uploadNewImage = uploadNewImage;

// Fallback functions for removed gallery features (to prevent errors)
window.renderGalleryPreview = function() { /* Gallery feature removed */ };
window.loadPostGallery = function() { /* Gallery feature removed */ };
window.clearGallery = function() { /* Gallery feature removed */ };

// Editor-specific functions
window.openImageLibraryForEditor = openImageLibraryForEditor;

// Variable to track current editor block for image insertion
let currentEditorImageBlock = null;

function createImageLibraryTool() {
    return class ImageLibraryTool {
        static get toolbox() {
            return {
                title: 'Image Library',
                icon: '<svg width="17" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>'
            };
        }

        constructor({ data, api }) {
            this.api = api;
            this.data = data || {
                width: 'auto',
                maxWidth: '100%'
            };
            this.wrapper = undefined;
            this.isResizing = false;
            this.startWidth = 0;
            this.startHeight = 0;
            this.aspectRatio = 1;
            
            // Store instance reference for data updates
            window.currentLibraryToolInstance = this;
        }

        render() {
            this.wrapper = document.createElement('div');
            this.wrapper.classList.add('image-library-tool');
            
            if (this.data.url) {
                // If we have data, show the image
                this._createImage(this.data.url, this.data.caption);
            } else {
                // Show button to select from library
                this._createSelectButton();
            }

            return this.wrapper;
        }

        _createSelectButton() {
            this.wrapper.innerHTML = `
                <div style="
                    border: 2px dashed #ccc; 
                    border-radius: 8px; 
                    padding: 2rem; 
                    text-align: center; 
                    background: #fafafa;
                    cursor: pointer;
                " onclick="window.selectImageFromLibraryForBlock(this)">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#666" style="margin-bottom: 1rem;">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    <p style="margin: 0; color: #666; font-size: 16px;">Select Image from Library</p>
                    <p style="margin: 0.5rem 0 0 0; color: #999; font-size: 14px;">Choose from your uploaded images</p>
                </div>
            `;
        }

        _createImage(url, caption) {
            const imageWidth = this.data.width || 'auto';
            const maxWidth = this.data.maxWidth || '100%';
            
            this.wrapper.innerHTML = `
                <div class="resizable-image-container" style="text-align: center; position: relative; display: inline-block; max-width: 100%;">
                    <div class="image-wrapper" style="position: relative; display: inline-block; width: ${imageWidth}; max-width: ${maxWidth};">
                        <img 
                            src="${url}" 
                            style="width: 100%; height: auto; border-radius: 8px; display: block;" 
                            alt="${caption || ''}"
                            onload="this.parentElement.parentElement.querySelector('.resize-handle').style.display = 'none'"
                        >
                        <div class="resize-handle" style="
                            position: absolute;
                            bottom: -5px;
                            right: -5px;
                            width: 20px;
                            height: 20px;
                            background: #007cba;
                            border: 2px solid white;
                            border-radius: 50%;
                            cursor: nw-resize;
                            display: none;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        "></div>
                    </div>
                    ${caption ? `<p style="margin: 0.5rem 0 0 0; color: #666; font-style: italic;">${caption}</p>` : ''}
                </div>
            `;
            
            // Add resize event listeners
            this._addResizeListeners();
        }
        
        _addResizeListeners() {
            const handle = this.wrapper.querySelector('.resize-handle');
            const imageWrapper = this.wrapper.querySelector('.image-wrapper');
            const img = this.wrapper.querySelector('img');
            
            if (!handle || !imageWrapper || !img) return;
            
            // Wait for image to load to get proper dimensions
            if (img.complete) {
                this._setupResize(handle, imageWrapper, img);
            } else {
                img.onload = () => this._setupResize(handle, imageWrapper, img);
            }
        }
        
        _setupResize(handle, imageWrapper, img) {
            this.aspectRatio = img.naturalWidth / img.naturalHeight;
            
            const startResize = (e) => {
                e.preventDefault();
                this.isResizing = true;
                
                const rect = imageWrapper.getBoundingClientRect();
                this.startWidth = rect.width;
                this.startX = e.clientX;
                
                document.addEventListener('mousemove', doResize);
                document.addEventListener('mouseup', stopResize);
                
                // Add visual feedback
                imageWrapper.style.outline = '2px solid #007cba';
            };
            
            const doResize = (e) => {
                if (!this.isResizing) return;
                
                const deltaX = e.clientX - this.startX;
                let newWidth = this.startWidth + deltaX;
                
                // Minimum and maximum width constraints
                const minWidth = 100;
                const maxWidth = this.wrapper.closest('.ce-block__content').offsetWidth || 800;
                
                newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
                
                imageWrapper.style.width = `${newWidth}px`;
                imageWrapper.style.maxWidth = 'none';
                
                // Store the width for saving
                this.data.width = `${newWidth}px`;
                this.data.maxWidth = 'none';
            };
            
            const stopResize = () => {
                this.isResizing = false;
                imageWrapper.style.outline = 'none';
                
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
                
                // Trigger change event
                if (this.api && this.api.blocks) {
                    // Mark block as changed
                }
            };
            
            handle.addEventListener('mousedown', startResize);
            
            // Show/hide handle on hover
            imageWrapper.addEventListener('mouseenter', () => {
                handle.style.display = 'block';
            });
            
            this.wrapper.addEventListener('mouseleave', () => {
                if (!this.isResizing) {
                    handle.style.display = 'none';
                }
            });
        }

        save() {
            if (this.data.url) {
                const saveData = {
                    url: this.data.url,
                    caption: this.data.caption || '',
                    width: this.data.width || 'auto',
                    maxWidth: this.data.maxWidth || '100%',
                    file: {
                        url: this.data.url
                    }
                };
                return saveData;
            }
            return {};
        }
    };
}

// Global function to handle image selection for the custom tool
window.selectImageFromLibraryForBlock = function(element) {
    // Store reference to the block element and find the tool instance
    window.currentLibraryToolElement = element;
    
    // Find the EditorJS block that contains this element
    let blockElement = element;
    while (blockElement && !blockElement.classList.contains('ce-block')) {
        blockElement = blockElement.parentElement;
    }
    
    if (blockElement) {
        // Store a reference to the block so we can update it later
        window.currentLibraryBlock = blockElement;
    }
    
    openFileManager('editor-library-tool');
};

async function openImageLibraryForEditor() {
    // Store reference to the current block being edited
    currentEditorImageBlock = 'pending';
    openFileManager('editor-image-replace');
}

async function savePost() {
    const title = document.getElementById('post-title').value;
    let content = '';
    
    if (blockEditor) {
        try {
            const outputData = await blockEditor.save();
            content = await convertBlocksToHtml(outputData.blocks);
        } catch (error) {
            console.error('Error saving editor content:', error);
            content = '';
        }
    }
    
    const published = document.getElementById('post-published').checked;
    const featuredImageId = document.getElementById('featured-image-id').value;
    
    if (!title.trim()) {
        alert('Title is required');
        return;
    }
    
    const postData = {
        title: title.trim(),
        content: content.trim(),
        published: published,
        featured_image_id: featuredImageId || null,
        update_slug: isEditingSlug
    };
    
    try {
        const url = currentPostId ? `/api/admin/posts/${currentPostId}` : '/api/admin/posts';
        const method = currentPostId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save post');
        }
        
        const savedPost = await response.json();
        
        // Refresh posts list and go back to list view
        await loadPosts();
        showPostsList();
        
    } catch (error) {
        alert('Error saving post: ' + error.message);
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete post');
        }
        
        await loadPosts();
    } catch (error) {
        alert('Error deleting post: ' + error.message);
    }
}

async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const uploadBtn = document.getElementById('upload-btn');
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<span class="spinner"></span> Uploading...';
    
    try {
        for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Failed to upload ${file.name}`);
            }
            
            const imageData = await response.json();
            uploadedImages.push(imageData);
            addImagePreview(imageData);
        }
    } catch (error) {
        alert('Error uploading images: ' + error.message);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Images';
        e.target.value = ''; // Reset file input
    }
}

function addImagePreview(imageData) {
    const previewContainer = document.getElementById('image-preview');
    
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    previewItem.innerHTML = `
        <img src="${imageData.b2_url}" alt="${imageData.alt_text || imageData.original_filename}">
        <button class="remove-btn" onclick="removeImagePreview(this, ${imageData.id})">&times;</button>
    `;
    
    previewContainer.appendChild(previewItem);
}

function removeImagePreview(button, imageId) {
    button.parentElement.remove();
    uploadedImages = uploadedImages.filter(img => img.id !== imageId);
    
    // TODO: Also delete from server if needed
}

// File Manager
let fileManagerMode = 'select'; // 'select', 'manage', or 'featured'
let allImages = [];
let selectedImages = [];
let featuredImageId = null;

async function openFileManager(mode = 'select') {
    fileManagerMode = mode;
    selectedImages = [];
    
    const modal = document.getElementById('file-manager-modal');
    const title = document.getElementById('file-manager-title');
    const selectBtn = document.getElementById('select-mode-btn');
    const manageBtn = document.getElementById('manage-mode-btn');
    
    // Update UI based on mode
    if (mode === 'select' || mode === 'featured' || mode === 'editor-image' || mode === 'editor-image-replace' || mode === 'editor-library-tool' || mode === 'homepage-gallery' || mode === 'about-profile') {
        let titleText = 'Browse Image Library';
        if (mode === 'featured') titleText = 'Select Featured Image';
        if (mode === 'editor-image' || mode === 'editor-image-replace' || mode === 'editor-library-tool') titleText = 'Select Image for Editor';
        if (mode === 'homepage-gallery') titleText = 'Add Images to Homepage Gallery';
        if (mode === 'about-profile') titleText = 'Select Profile Image';
        
        title.textContent = titleText;
        selectBtn.classList.add('btn-primary');
        selectBtn.classList.remove('btn-secondary');
        manageBtn.classList.add('btn-secondary');
        manageBtn.classList.remove('btn-primary');
        
        // Hide mode switching toolbar for special modes
        const toolbar = document.querySelector('.file-manager-toolbar');
        if (mode === 'featured' || mode === 'editor-image' || mode === 'editor-image-replace' || mode === 'editor-library-tool' || mode === 'homepage-gallery' || mode === 'about-profile') {
            toolbar.style.display = 'none';
        } else {
            toolbar.style.display = 'flex';
        }
    } else {
        title.textContent = 'Manage Files';
        selectBtn.classList.add('btn-secondary');
        selectBtn.classList.remove('btn-primary');
        manageBtn.classList.add('btn-primary');
        manageBtn.classList.remove('btn-secondary');
        
        // Show toolbar
        const toolbar = document.querySelector('.file-manager-toolbar');
        toolbar.style.display = 'flex';
    }
    
    modal.classList.add('active');
    await loadImages();
}

function closeFileManager() {
    document.getElementById('file-manager-modal').classList.remove('active');
    selectedImages = [];
    updateSelectedCount();
}

async function loadImages() {
    const grid = document.getElementById('file-manager-grid');
    grid.innerHTML = '<div class="loading">Loading images...</div>';
    
    try {
        const response = await fetch('/api/admin/images', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load images');
        }
        
        allImages = await response.json();
        renderImages(allImages);
        
    } catch (error) {
        console.error('Error loading images:', error);
        grid.innerHTML = '<div class="error-message">Error loading images. Please try again.</div>';
    }
}

function renderImages(images) {
    const grid = document.getElementById('file-manager-grid');
    
    if (images.length === 0) {
        grid.innerHTML = '<div class="loading">No images found. Upload some images first.</div>';
        return;
    }
    
    const imagesHTML = images.map(image => {
        const date = new Date(image.created_at).toLocaleDateString();
        const fileSize = formatFileSize(image.file_size || 0);
        
        
        return `
            <div class="file-item ${fileManagerMode === 'manage' ? 'delete-mode' : ''}" data-image-id="${image.id}">
                <img src="${image.b2_url}" alt="${image.alt_text || image.original_filename}" loading="lazy">
                ${fileManagerMode === 'select' ? 
                    `<input type="checkbox" class="file-item-checkbox">` : 
                    `<button class="file-item-delete">&times;</button>`
                }
                <div class="file-item-info">
                    <div class="file-item-name">${image.original_filename}</div>
                    <div class="file-item-meta">${date} • ${fileSize}</div>
                </div>
            </div>
        `;
    }).join('');
    
    grid.innerHTML = imagesHTML;
    
    // Add event listeners
    setupFileItemListeners();
    updateSelectedCount();
}

function setupFileItemListeners() {
    const fileItems = document.querySelectorAll('.file-item');
    
    fileItems.forEach(item => {
        if (fileManagerMode === 'select') {
            const checkbox = item.querySelector('.file-item-checkbox');
            
            item.addEventListener('click', (e) => {
                if (e.target === checkbox) return;
                checkbox.checked = !checkbox.checked;
                toggleImageSelection(item, checkbox.checked);
            });
            
            checkbox.addEventListener('change', (e) => {
                toggleImageSelection(item, e.target.checked);
            });
        } else {
            const deleteBtn = item.querySelector('.file-item-delete');
            
            item.addEventListener('click', () => {
                toggleImageSelection(item, !item.classList.contains('selected'));
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const imageId = parseInt(item.dataset.imageId);
                deleteImage(imageId);
            });
        }
    });
}

function toggleImageSelection(item, selected) {
    const imageId = parseInt(item.dataset.imageId);
    
    if (selected) {
        item.classList.add('selected');
        if (!selectedImages.includes(imageId)) {
            selectedImages.push(imageId);
        }
    } else {
        item.classList.remove('selected');
        selectedImages = selectedImages.filter(id => id !== imageId);
    }
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const countEl = document.getElementById('selected-count');
    const selectBtn = document.getElementById('select-images-btn');
    const deleteBtn = document.getElementById('delete-selected-btn');
    
    countEl.textContent = `${selectedImages.length} selected`;
    
    if (fileManagerMode === 'select' || fileManagerMode === 'featured' || fileManagerMode === 'editor-image' || fileManagerMode === 'editor-image-replace' || fileManagerMode === 'editor-library-tool' || fileManagerMode === 'homepage-gallery' || fileManagerMode === 'about-profile') {
        selectBtn.style.display = selectedImages.length > 0 ? 'block' : 'none';
        deleteBtn.style.display = 'none';
        
        // Update button text for different modes
        if (fileManagerMode === 'featured') {
            selectBtn.textContent = 'Set as Featured';
        } else if (fileManagerMode === 'editor-image' || fileManagerMode === 'editor-image-replace' || fileManagerMode === 'editor-library-tool') {
            selectBtn.textContent = 'Insert Image';
        } else if (fileManagerMode === 'homepage-gallery') {
            selectBtn.textContent = 'Add to Homepage Gallery';
        } else if (fileManagerMode === 'about-profile') {
            selectBtn.textContent = 'Set as Profile Image';
        } else {
            selectBtn.textContent = 'Add Selected';
        }
    } else {
        selectBtn.style.display = 'none';
        deleteBtn.style.display = selectedImages.length > 0 ? 'block' : 'none';
    }
}

async function deleteImage(imageId) {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        
        // Remove from UI
        const item = document.querySelector(`[data-image-id="${imageId}"]`);
        if (item) {
            item.remove();
        }
        
        // Remove from arrays
        allImages = allImages.filter(img => img.id !== imageId);
        selectedImages = selectedImages.filter(id => id !== imageId);
        updateSelectedCount();
        
        showMessage('Image deleted successfully');
        
    } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image: ' + error.message);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Featured Image Functions
function setFeaturedImage(imageId, imageUrl) {
    featuredImageId = imageId;
    document.getElementById('featured-image-id').value = imageId;
    
    const preview = document.getElementById('featured-image-preview');
    preview.innerHTML = `<img src="${imageUrl}" alt="Featured image">`;
    
    document.getElementById('remove-featured-btn').style.display = 'inline-block';
}

function setProfileImage(imageId, imageUrl) {
    document.getElementById('about-profile-image-id').value = imageId;
    
    const preview = document.getElementById('current-profile-image');
    preview.innerHTML = `<img src="${imageUrl}" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">`;
}

function removeFeaturedImage() {
    featuredImageId = null;
    document.getElementById('featured-image-id').value = '';
    
    const preview = document.getElementById('featured-image-preview');
    preview.innerHTML = `
        <div class="featured-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
        </div>
    `;
    
    document.getElementById('remove-featured-btn').style.display = 'none';
}

// File Manager Mode Switching
function switchFileManagerMode(mode) {
    fileManagerMode = mode;
    selectedImages = [];
    
    const selectBtn = document.getElementById('select-mode-btn');
    const manageBtn = document.getElementById('manage-mode-btn');
    const title = document.getElementById('file-manager-title');
    
    if (mode === 'select') {
        title.textContent = 'Browse Image Library';
        selectBtn.classList.add('btn-primary');
        selectBtn.classList.remove('btn-secondary');
        manageBtn.classList.add('btn-secondary');
        manageBtn.classList.remove('btn-primary');
    } else {
        title.textContent = 'Manage Files';
        selectBtn.classList.add('btn-secondary');
        selectBtn.classList.remove('btn-primary');
        manageBtn.classList.add('btn-primary');
        manageBtn.classList.remove('btn-secondary');
    }
    
    renderImages(allImages);
}

// File Manager Actions
async function selectImages() {
    if (fileManagerMode === 'featured' && selectedImages.length > 0) {
        // For featured image, only select the first one
        const imageId = selectedImages[0];
        const image = allImages.find(img => img.id === imageId);
        if (image) {
            setFeaturedImage(image.id, image.b2_url);
        }
        closeFileManager();
    } else if (fileManagerMode === 'about-profile' && selectedImages.length > 0) {
        // For profile image, only select the first one
        const imageId = selectedImages[0];
        const image = allImages.find(img => img.id === imageId);
        if (image) {
            setProfileImage(image.id, image.b2_url);
        }
        closeFileManager();
    } else if ((fileManagerMode === 'editor-image' || fileManagerMode === 'editor-image-replace') && selectedImages.length > 0) {
        // For editor image insertion, insert all selected images into editor
        if (blockEditor) {
            try {
                if (fileManagerMode === 'editor-image-replace') {
                    // For replacement mode, we need to replace the current image block
                    // This is a simplified approach - in a full implementation you'd track the specific block
                    alert('Image replacement functionality needs more complex implementation. For now, the images will be added as new blocks.');
                }
                
                let blocksCount = await blockEditor.blocks.getBlocksCount();
                
                // Insert all selected images
                for (const imageId of selectedImages) {
                    const image = allImages.find(img => img.id === imageId);
                    if (image) {
                        blockEditor.blocks.insert('imageLibrary', {
                            url: image.b2_url,
                            caption: image.alt_text || '',
                            file: {
                                url: image.b2_url,
                                size: image.file_size,
                                name: image.original_filename,
                                extension: image.original_filename.split('.').pop()
                            },
                            width: 'auto',
                            maxWidth: '100%'
                        }, {}, blocksCount);
                        blocksCount++; // Increment for next insertion
                    }
                }
            } catch (error) {
                // Error handled silently
            }
        }
        currentEditorImageBlock = null;
        closeFileManager();
    } else if (fileManagerMode === 'editor-library-tool' && selectedImages.length > 0) {
        // For custom image library tool
        const imageId = selectedImages[0];
        const image = allImages.find(img => img.id === imageId);
        if (image && window.currentLibraryToolInstance) {
            // Update the tool instance data
            window.currentLibraryToolInstance.data = {
                url: image.b2_url,
                caption: image.alt_text || '',
                originalFilename: image.original_filename,
                width: 'auto',
                maxWidth: '100%'
            };
            
            // Recreate the image with resizable functionality
            window.currentLibraryToolInstance._createImage(image.b2_url, image.alt_text || '');
            
            // Trigger the EditorJS onChange event to mark the content as changed
            if (blockEditor) {
                try {
                    // Trigger onChange by calling it directly
                    const changeEvent = new Event('change');
                    window.currentLibraryToolInstance.wrapper.dispatchEvent(changeEvent);
                } catch (error) {
                    // Could not trigger change event
                }
            }
            
        }
        window.currentLibraryToolElement = null;
        window.currentLibraryBlock = null;
        closeFileManager();
    } else if (fileManagerMode === 'homepage-gallery') {
        // For homepage gallery, add images to the homepage gallery
        await addImagesToHomepageGallery(selectedImages);
        closeFileManager();
    } else {
        // For regular selection, add to post images
        selectedImages.forEach(imageId => {
            const image = allImages.find(img => img.id === imageId);
            if (image) {
                addImagePreview(image);
            }
        });
        closeFileManager();
    }
}

async function deleteSelectedImages() {
    if (selectedImages.length === 0) return;
    
    const confirmMsg = `Are you sure you want to delete ${selectedImages.length} image(s)? This action cannot be undone.`;
    if (!confirm(confirmMsg)) return;
    
    try {
        // Delete each selected image
        for (const imageId of selectedImages) {
            await fetch(`/api/admin/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            // Remove from UI
            const item = document.querySelector(`[data-image-id="${imageId}"]`);
            if (item) {
                item.remove();
            }
        }
        
        // Update arrays
        allImages = allImages.filter(img => !selectedImages.includes(img.id));
        selectedImages = [];
        updateSelectedCount();
        
        showMessage(`${selectedImages.length} image(s) deleted successfully`);
        
    } catch (error) {
        console.error('Error deleting images:', error);
        alert('Failed to delete some images: ' + error.message);
    }
}

// Gallery Management Functions

// Homepage Gallery Management Functions
async function loadGalleryAdmin() {
    const galleryList = document.getElementById('gallery-list');
    
    galleryList.innerHTML = '<div class="loading">Loading gallery...</div>';
    
    try {
        const response = await fetch('/api/admin/gallery', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load gallery');
        }
        
        const galleryImages = await response.json();
        renderGalleryAdmin(galleryImages);
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryList.innerHTML = '<div class="error-message">Error loading gallery. Please try again.</div>';
    }
}

function renderGalleryAdmin(images) {
    const galleryList = document.getElementById('gallery-list');
    
    if (images.length === 0) {
        galleryList.innerHTML = `
            <div class="loading">
                <p>No images in gallery yet.</p>
                <p>Click "Add Images to Gallery" to get started.</p>
            </div>
        `;
        return;
    }
    
    const imagesHTML = images.map(image => {
        const date = new Date(image.created_at).toLocaleDateString();
        
        return `
            <div class="gallery-admin-item" data-gallery-id="${image.id}">
                <div class="gallery-admin-image">
                    <img src="${image.b2_url}" alt="${image.alt_text || image.title || image.original_filename}" loading="lazy">
                </div>
                <div class="gallery-admin-info">
                    <h3>${image.title || image.original_filename}</h3>
                    <p class="gallery-admin-description">${image.description || 'No description'}</p>
                    <div class="gallery-admin-meta">
                        Added: ${date} • Order: ${image.sort_order}
                        ${!image.visible ? ' • <span class="hidden-badge">Hidden</span>' : ''}
                    </div>
                </div>
                <div class="gallery-admin-actions">
                    <button class="btn btn-small btn-outline" onclick="viewExifData(${image.image_id})">EXIF</button>
                    <button class="btn btn-small btn-outline" onclick="editGalleryItem(${image.id})">Edit</button>
                    <button class="btn btn-small btn-secondary" onclick="toggleGalleryVisibility(${image.id}, ${image.visible})">${image.visible ? 'Hide' : 'Show'}</button>
                    <button class="btn btn-small btn-danger" onclick="removeFromGallery(${image.id})">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    galleryList.innerHTML = `<div class="gallery-admin-grid">${imagesHTML}</div>`;
}

async function addImagesToHomepageGallery(imageIds) {
    try {
        for (const imageId of imageIds) {
            await fetch('/api/admin/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ image_id: imageId })
            });
        }
        
        showMessage(`${imageIds.length} image(s) added to gallery`);
        loadGalleryAdmin(); // Refresh the gallery view
        
    } catch (error) {
        console.error('Error adding to gallery:', error);
        alert('Failed to add some images to gallery: ' + error.message);
    }
}

async function removeFromGallery(galleryId) {
    if (!confirm('Are you sure you want to remove this image from the gallery?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/gallery/${galleryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove from gallery');
        }
        
        showMessage('Image removed from gallery');
        loadGalleryAdmin(); // Refresh the gallery view
        
    } catch (error) {
        console.error('Error removing from gallery:', error);
        alert('Failed to remove image from gallery: ' + error.message);
    }
}

async function toggleGalleryVisibility(galleryId, currentVisibility) {
    try {
        const response = await fetch(`/api/admin/gallery/${galleryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ visible: !currentVisibility })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update visibility');
        }
        
        showMessage(`Image ${!currentVisibility ? 'shown' : 'hidden'} in gallery`);
        loadGalleryAdmin(); // Refresh the gallery view
        
    } catch (error) {
        console.error('Error updating visibility:', error);
        alert('Failed to update image visibility: ' + error.message);
    }
}

function editGalleryItem(galleryId) {
    // TODO: Implement edit functionality with modal
    alert('Edit functionality coming soon!');
}

async function viewExifData(imageId) {
    try {
        const response = await fetch(`/api/images/${imageId}/exif`);
        
        if (!response.ok) {
            if (response.status === 404) {
                alert('No EXIF data found for this image.');
                return;
            }
            throw new Error('Failed to fetch EXIF data');
        }
        
        const exifData = await response.json();
        displayExifModal(exifData);
        
    } catch (error) {
        console.error('Error fetching EXIF data:', error);
        alert('Failed to load EXIF data: ' + error.message);
    }
}

function displayExifModal(exifData) {
    const modalHtml = `
        <div id="exif-modal" class="modal active">
            <div class="modal-content exif-modal-content">
                <div class="modal-header">
                    <h2>EXIF Data</h2>
                    <button class="modal-close" onclick="closeExifModal()">&times;</button>
                </div>
                <div class="exif-content">
                    ${formatExifData(exifData)}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function formatExifData(exif) {
    const sections = [];
    
    // Camera Information
    if (exif.camera_make || exif.camera_model) {
        sections.push(`
            <div class="exif-section">
                <h3>Camera</h3>
                ${exif.camera_make ? `<p><strong>Make:</strong> ${exif.camera_make}</p>` : ''}
                ${exif.camera_model ? `<p><strong>Model:</strong> ${exif.camera_model}</p>` : ''}
            </div>
        `);
    }
    
    // Lens Information
    if (exif.lens_make || exif.lens_model) {
        sections.push(`
            <div class="exif-section">
                <h3>Lens</h3>
                ${exif.lens_make ? `<p><strong>Make:</strong> ${exif.lens_make}</p>` : ''}
                ${exif.lens_model ? `<p><strong>Model:</strong> ${exif.lens_model}</p>` : ''}
            </div>
        `);
    }
    
    // Photography Settings
    const settings = [];
    if (exif.focal_length) settings.push(`<p><strong>Focal Length:</strong> ${exif.focal_length}mm</p>`);
    if (exif.focal_length_35mm) settings.push(`<p><strong>35mm Equivalent:</strong> ${exif.focal_length_35mm}mm</p>`);
    if (exif.aperture) settings.push(`<p><strong>Aperture:</strong> f/${exif.aperture}</p>`);
    if (exif.shutter_speed) settings.push(`<p><strong>Shutter Speed:</strong> ${exif.shutter_speed}</p>`);
    if (exif.iso) settings.push(`<p><strong>ISO:</strong> ${exif.iso}</p>`);
    if (exif.flash) settings.push(`<p><strong>Flash:</strong> ${exif.flash}</p>`);
    
    if (settings.length > 0) {
        sections.push(`
            <div class="exif-section">
                <h3>Camera Settings</h3>
                ${settings.join('')}
            </div>
        `);
    }
    
    // Location (GPS)
    if (exif.gps_latitude && exif.gps_longitude) {
        sections.push(`
            <div class="exif-section">
                <h3>Location</h3>
                <p><strong>Coordinates:</strong> ${exif.gps_latitude.toFixed(6)}, ${exif.gps_longitude.toFixed(6)}</p>
                ${exif.gps_altitude ? `<p><strong>Altitude:</strong> ${exif.gps_altitude}m</p>` : ''}
                <p><a href="https://www.google.com/maps?q=${exif.gps_latitude},${exif.gps_longitude}" target="_blank">View on Google Maps</a></p>
            </div>
        `);
    }
    
    // Date and Other Info
    const otherInfo = [];
    if (exif.date_taken) {
        const date = new Date(exif.date_taken).toLocaleString();
        otherInfo.push(`<p><strong>Date Taken:</strong> ${date}</p>`);
    }
    if (exif.software) otherInfo.push(`<p><strong>Software:</strong> ${exif.software}</p>`);
    if (exif.artist) otherInfo.push(`<p><strong>Artist:</strong> ${exif.artist}</p>`);
    if (exif.copyright) otherInfo.push(`<p><strong>Copyright:</strong> ${exif.copyright}</p>`);
    
    if (otherInfo.length > 0) {
        sections.push(`
            <div class="exif-section">
                <h3>Other Information</h3>
                ${otherInfo.join('')}
            </div>
        `);
    }
    
    if (sections.length === 0) {
        return '<p>No EXIF data available.</p>';
    }
    
    return sections.join('');
}

function closeExifModal() {
    const modal = document.getElementById('exif-modal');
    if (modal) {
        modal.remove();
    }
}

// About Page Management Functions
async function loadAboutAdmin() {
    const aboutForm = document.getElementById('about-form');
    const saveAboutBtn = document.getElementById('save-about-btn');
    
    aboutForm.innerHTML = '<div class="loading">Loading about page...</div>';
    
    try {
        const response = await fetch('/api/admin/about', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load about page');
        }
        
        const aboutData = await response.json();
        renderAboutForm(aboutData);
        
        // Setup save button listener
        saveAboutBtn.onclick = () => saveAboutPage();
        
    } catch (error) {
        console.error('Error loading about page:', error);
        aboutForm.innerHTML = '<div class="error">Failed to load about page. Please try again.</div>';
    }
}

function renderAboutForm(aboutData) {
    const aboutForm = document.getElementById('about-form');
    
    aboutForm.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="about-title">Title:</label>
                <input type="text" id="about-title" value="${aboutData.title || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="about-lead">Lead Text:</label>
                <textarea id="about-lead" rows="3" placeholder="A brief introduction or tagline...">${aboutData.lead_text || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="about-content">Content:</label>
                <textarea id="about-content" rows="10" placeholder="Main about content...">${aboutData.content || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="about-profile-image">Profile Image:</label>
                <div class="profile-image-section">
                    <div id="current-profile-image" class="current-image">
                        ${aboutData.profile_image_url ? 
                            `<img src="${aboutData.profile_image_url}" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">` 
                            : '<div class="no-image">No profile image selected</div>'
                        }
                    </div>
                    <div class="image-actions">
                        <button type="button" id="select-profile-btn" class="btn btn-outline">Select Image</button>
                        <button type="button" id="remove-profile-btn" class="btn btn-outline">Remove</button>
                        <input type="hidden" id="about-profile-image-id" value="${aboutData.profile_image_id || ''}">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup profile image selection
    document.getElementById('select-profile-btn').onclick = () => openFileManager('about-profile');
    document.getElementById('remove-profile-btn').onclick = () => removeProfileImage();
}

async function saveAboutPage() {
    const saveBtn = document.getElementById('save-about-btn');
    const originalText = saveBtn.textContent;
    
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    try {
        const aboutData = {
            title: document.getElementById('about-title').value,
            lead_text: document.getElementById('about-lead').value,
            content: document.getElementById('about-content').value,
            profile_image_id: document.getElementById('about-profile-image-id').value || null
        };
        
        const response = await fetch('/api/admin/about', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(aboutData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save about page');
        }
        
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error saving about page:', error);
        saveBtn.textContent = 'Error - Try Again';
        saveBtn.disabled = false;
        setTimeout(() => {
            saveBtn.textContent = originalText;
        }, 3000);
    }
}

function removeProfileImage() {
    document.getElementById('current-profile-image').innerHTML = '<div class="no-image">No profile image selected</div>';
    document.getElementById('about-profile-image-id').value = '';
}

// Image Library Management Functions
async function loadImagesLibrary(searchQuery = '') {
    const imagesList = document.getElementById('images-list');
    
    imagesList.innerHTML = '<div class="loading">Loading images...</div>';
    
    try {
        const url = new URL('/api/admin/images', window.location.origin);
        if (searchQuery.trim()) {
            url.searchParams.set('search', searchQuery.trim());
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load images');
        }
        
        const images = await response.json();
        renderImagesLibrary(images);
        
    } catch (error) {
        console.error('Error loading images:', error);
        imagesList.innerHTML = '<div class="error-message">Error loading images. Please try again.</div>';
    }
}

// Debounced search function
let searchTimeout;
function filterImages() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = document.getElementById('images-search').value;
        loadImagesLibrary(searchTerm);
    }, 300); // Wait 300ms after user stops typing
}

async function renderImagesLibrary(images) {
    const imagesList = document.getElementById('images-list');
    
    if (images.length === 0) {
        imagesList.innerHTML = `
            <div class="loading">
                <p>No images found.</p>
                <p>Try adjusting your search or upload new images.</p>
            </div>
        `;
        return;
    }
    
    const imagesHTML = images.map(image => {
        const date = new Date(image.created_at).toLocaleDateString();
        const fileSize = formatFileSize(image.file_size || 0);
        const hasExif = image.camera_make || image.camera_model || image.lens_make || image.lens_model;
        
        // Build EXIF info display
        const exifInfo = [];
        if (image.camera_make && image.camera_model) {
            exifInfo.push(`${image.camera_make} ${image.camera_model}`);
        } else if (image.camera_model) {
            exifInfo.push(image.camera_model);
        }
        
        if (image.lens_make && image.lens_model) {
            exifInfo.push(`${image.lens_make} ${image.lens_model}`);
        } else if (image.lens_model) {
            exifInfo.push(image.lens_model);
        }
        
        if (image.focal_length) {
            exifInfo.push(`${image.focal_length}mm`);
        }
        
        if (image.aperture) {
            exifInfo.push(`f/${image.aperture}`);
        }
        
        if (image.iso) {
            exifInfo.push(`ISO ${image.iso}`);
        }
        
        const exifDisplay = exifInfo.length > 0 ? exifInfo.join(' • ') : '';
        
        return `
            <div class="gallery-admin-item" data-image-id="${image.id}">
                <div class="gallery-admin-image">
                    <img src="${image.b2_url}" alt="${image.alt_text || image.original_filename}" loading="lazy">
                </div>
                <div class="gallery-admin-info">
                    <h3>${image.original_filename}</h3>
                    <p class="gallery-admin-description">${image.alt_text || 'No description'}</p>
                    ${exifDisplay ? `<p class="gallery-admin-exif" style="font-size: 0.8rem; color: #666; margin: 0.25rem 0;">${exifDisplay}</p>` : ''}
                    <div class="gallery-admin-meta">
                        Uploaded: ${date} • ${fileSize}
                        ${image.width && image.height ? ` • ${image.width}×${image.height}` : ''}
                        ${hasExif ? ' • <span style="color: #28a745;">Has EXIF</span>' : ' • <span style="color: #dc3545;">No EXIF</span>'}
                    </div>
                </div>
                <div class="gallery-admin-actions">
                    <button class="btn btn-small btn-outline" onclick="viewExifData(${image.id})">EXIF</button>
                    <button class="btn btn-small btn-outline" onclick="editImageDetails(${image.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteImageFromLibrary(${image.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    imagesList.innerHTML = `<div class="gallery-admin-grid">${imagesHTML}</div>`;
}

async function handleBulkImageUpload(e) {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const uploadBtn = document.getElementById('upload-images-btn');
    const originalText = uploadBtn.textContent;
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<span class="spinner"></span> Uploading...';
    
    try {
        let successCount = 0;
        let failCount = 0;
        
        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append('image', file);
                
                const response = await fetch('/api/admin/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: formData
                });
                
                if (response.ok) {
                    successCount++;
                } else {
                    failCount++;
                    console.error(`Failed to upload ${file.name}`);
                }
            } catch (error) {
                failCount++;
                console.error(`Error uploading ${file.name}:`, error);
            }
        }
        
        showMessage(`Uploaded ${successCount} image(s)${failCount > 0 ? `, ${failCount} failed` : ''}`);
        loadImagesLibrary(); // Refresh the images list
        
    } catch (error) {
        console.error('Error in bulk upload:', error);
        showMessage('Error uploading images', 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = originalText;
        e.target.value = ''; // Reset file input
    }
}

async function deleteImageFromLibrary(imageId) {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone and will remove it from all posts and galleries.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        
        showMessage('Image deleted successfully');
        loadImagesLibrary(); // Refresh the images list
        
    } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image: ' + error.message);
    }
}

function editImageDetails(imageId) {
    // TODO: Implement edit functionality with modal
    alert('Edit functionality coming soon!');
}

async function updateExifForAllImages() {
    const confirmMsg = 'This will scan all images in your library and extract EXIF data for any images that don\'t have it yet. This may take several minutes depending on the number of images. Continue?';
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    const updateBtn = document.getElementById('update-exif-btn');
    const originalText = updateBtn.textContent;
    updateBtn.disabled = true;
    updateBtn.innerHTML = '<span class="spinner"></span> Processing...';
    
    try {
        const response = await fetch('/api/admin/update-exif', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to update EXIF data');
        }
        
        const result = await response.json();
        
        if (result.success) {
            const message = result.total === 0 
                ? 'All images already have EXIF data!'
                : `EXIF update completed!\n\nProcessed: ${result.processed}\nFailed: ${result.failed}\nTotal checked: ${result.total}`;
            
            alert(message);
            
            // Refresh the images library to show any updated data
            if (document.getElementById('images-section').classList.contains('active')) {
                loadImagesLibrary();
            }
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('Error updating EXIF data:', error);
        alert('Failed to update EXIF data: ' + error.message);
    } finally {
        updateBtn.disabled = false;
        updateBtn.textContent = originalText;
    }
}

async function migrateImagesToFolder() {
    const confirmMsg = 'This will organize all your existing images into a proper folder structure (blog/images/year/month/) in your S3 bucket and update all references. This may take several minutes. Continue?';
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    const migrateBtn = document.getElementById('migrate-images-btn');
    const originalText = migrateBtn.textContent;
    migrateBtn.disabled = true;
    migrateBtn.innerHTML = '<span class="spinner"></span> Organizing...';
    
    try {
        const response = await fetch('/api/admin/migrate-images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to migrate images');
        }
        
        const result = await response.json();
        
        if (result.success) {
            const message = result.total === 0 
                ? 'All images are already organized!'
                : `File organization completed!\n\nMigrated: ${result.migrated}\nFailed: ${result.failed}\nTotal: ${result.total}\n\nYour images are now organized by date in the blog/images/ folder.`;
            
            alert(message);
            
            // Refresh the images library to show updated file paths
            if (document.getElementById('images-section').classList.contains('active')) {
                loadImagesLibrary();
            }
        } else {
            throw new Error(result.error || 'Migration failed');
        }
        
    } catch (error) {
        console.error('Error migrating images:', error);
        alert('Failed to organize images: ' + error.message);
    } finally {
        migrateBtn.disabled = false;
        migrateBtn.textContent = originalText;
    }
}

// S3 Bucket Browser Functions
let bucketData = { files: [], folders: [], currentPath: '', stats: {} };
let allBucketFiles = [];
let filteredBucketFiles = [];
let selectedBucketFiles = [];
let currentPath = '';

async function testB2Connection() {
    const testBtn = document.getElementById('test-b2-btn');
    const originalText = testBtn.textContent;
    
    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    
    // First, test if the server is responding at all
    try {
        const basicTest = await fetch('/api/admin/posts', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!basicTest.ok && basicTest.status === 404) {
            alert('❌ Server Error: API endpoints not responding. Is the server running?');
            return;
        }
    } catch (networkError) {
        alert(`❌ Network Error: ${networkError.message}\n\nIs the server running?`);
        return;
    }
    
    try {
        const response = await fetch('/api/admin/bucket-files?test=true', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        // Get the raw response text first
        const responseText = await response.text();
        
        // Try to parse as JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            alert(`❌ Server Response Error:
            
Status: ${response.status}
Response: ${responseText.substring(0, 500)}...

This suggests a server-side error. Check the server logs.`);
            return;
        }
        
        if (response.ok && result.success) {
            const message = `✅ B2 Connection Successful!
            
Account ID: ${result.accountId}
Configured Bucket: ${result.configuredBucket}
Allowed Bucket: ${result.allowedBucket}
Bucket Match: ${result.bucketMatch ? '✅ Yes' : '❌ No'}

API URL: ${result.apiUrl}
Download URL: ${result.downloadUrl}`;
            
            alert(message);
            
            if (!result.bucketMatch) {
                alert('⚠️ Warning: Your B2 Application Key is not authorized for the configured bucket ID. This is likely the cause of the 401 error.');
            }
        } else {
            const errorMsg = `❌ B2 Connection Failed:
            
Error: ${result.error}
Details: ${JSON.stringify(result.details, null, 2)}`;
            alert(errorMsg);
        }
        
    } catch (error) {
        alert(`❌ B2 Test Failed: ${error.message}`);
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = originalText;
    }
}

async function loadBucketFiles(path = currentPath) {
    const bucketList = document.getElementById('bucket-list');
    const refreshBtn = document.getElementById('refresh-bucket-btn');
    const filter = document.getElementById('file-type-filter').value;
    
    bucketList.innerHTML = '<div class="loading">Browsing S3 bucket...</div>';
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<span class="spinner"></span> Loading...';
    
    try {
        const url = new URL('/api/admin/bucket-files', window.location.origin);
        if (path) url.searchParams.set('prefix', path);
        if (filter) url.searchParams.set('filter', filter);
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to browse bucket');
        }
        
        bucketData = await response.json();
        currentPath = bucketData.currentPath || '';
        allBucketFiles = bucketData.files || [];
        filteredBucketFiles = [...allBucketFiles];
        selectedBucketFiles = [];
        
        updateBreadcrumb();
        updateStats();
        renderBucketFiles();
        
    } catch (error) {
        console.error('Error browsing bucket:', error);
        bucketList.innerHTML = '<div class="error-message">Error browsing bucket. Please try again.</div>';
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = 'Refresh';
    }
}

function updateBreadcrumb() {
    const breadcrumb = document.getElementById('current-path');
    const pathDisplay = currentPath || '/';
    
    if (currentPath) {
        // Create clickable breadcrumb
        const parts = currentPath.split('/').filter(p => p);
        let breadcrumbHTML = '<a href="#" onclick="navigateToPath(\'\')">Root</a>';
        
        let currentPathBuild = '';
        parts.forEach((part, index) => {
            currentPathBuild += part + '/';
            breadcrumbHTML += ` / <a href="#" onclick="navigateToPath('${currentPathBuild}')">${part}</a>`;
        });
        
        breadcrumb.innerHTML = breadcrumbHTML;
    } else {
        breadcrumb.textContent = '/';
    }
}

function updateStats() {
    document.getElementById('file-count').textContent = `${filteredBucketFiles.length} files`;
    document.getElementById('selected-count').textContent = `${selectedBucketFiles.length} selected`;
    document.getElementById('import-ready-count').textContent = `${filteredBucketFiles.filter(f => f.canImport).length} can be imported`;
}

function navigateToPath(path) {
    currentPath = path;
    loadBucketFiles(path);
}

function renderBucketFiles() {
    const bucketList = document.getElementById('bucket-list');
    
    if (bucketData.folders.length === 0 && filteredBucketFiles.length === 0) {
        bucketList.innerHTML = `
            <div class="loading">
                <p>No files found in this directory.</p>
                <p>Try navigating to a different folder or changing the filter.</p>
            </div>
        `;
        return;
    }
    
    let itemsHTML = '';
    
    // Add parent directory link if not at root
    if (currentPath) {
        const parentPath = currentPath.split('/').slice(0, -2).join('/');
        const parentPathWithSlash = parentPath ? parentPath + '/' : '';
        
        itemsHTML += `
            <div class="gallery-admin-item folder-item" onclick="navigateToPath('${parentPathWithSlash}')">
                <div class="gallery-admin-image" style="display: flex; align-items: center; justify-content: center; background: #e9ecef;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#666">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                        <path d="M15 13l-4-4v3H7v2h4v3l4-4z"/>
                    </svg>
                </div>
                <div class="gallery-admin-info">
                    <h3>.. (Parent Directory)</h3>
                    <p class="gallery-admin-description">Go up one level</p>
                </div>
            </div>
        `;
    }
    
    // Add folders
    bucketData.folders.forEach(folder => {
        itemsHTML += `
            <div class="gallery-admin-item folder-item" onclick="navigateToPath('${folder.path}')">
                <div class="gallery-admin-image" style="display: flex; align-items: center; justify-content: center; background: #e9ecef;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#666">
                        <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                    </svg>
                </div>
                <div class="gallery-admin-info">
                    <h3>📁 ${folder.name}</h3>
                    <p class="gallery-admin-description">Folder</p>
                </div>
            </div>
        `;
    });
    
    // Add files
    filteredBucketFiles.forEach(file => {
        const uploadDate = new Date(file.uploadTimestamp).toLocaleDateString();
        const fileSize = formatFileSize(file.contentLength || 0);
        const statusClass = file.isImported ? 'imported' : file.canImport ? 'importable' : 'non-image';
        const statusText = file.isImported ? 'Already imported' : file.canImport ? 'Ready to import' : 'Not an image';
        const statusColor = file.isImported ? '#666' : file.canImport ? '#28a745' : '#dc3545';
        
        itemsHTML += `
            <div class="gallery-admin-item bucket-file-item ${statusClass}" data-file-id="${file.fileId}">
                <div class="gallery-admin-image">
                    ${file.isImage ? 
                        `<img src="${file.url}" alt="${file.displayName}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div style="display: none; align-items: center; justify-content: center; background: #f0f0f0; width: 100%; height: 100%;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#999">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                         </div>` :
                        `<div style="display: flex; align-items: center; justify-content: center; background: #f0f0f0; width: 100%; height: 100%;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#999">
                                <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z"/>
                            </svg>
                         </div>`
                    }
                    ${file.canImport ? '<input type="checkbox" class="bucket-file-checkbox" style="position: absolute; top: 0.5rem; left: 0.5rem; width: 20px; height: 20px;">' : ''}
                </div>
                <div class="gallery-admin-info">
                    <h3>${file.displayName}</h3>
                    <p class="gallery-admin-description" style="color: ${statusColor};">${statusText}</p>
                    <div class="gallery-admin-meta">
                        Uploaded: ${uploadDate} • ${fileSize}
                        ${file.contentType ? ` • ${file.contentType}` : ''}
                    </div>
                </div>
                <div class="gallery-admin-actions">
                    ${file.isImage ? `<button class="btn btn-small btn-outline" onclick="previewBucketFile('${file.url}')">Preview</button>` : ''}
                    ${file.canImport ? `<button class="btn btn-small btn-secondary" onclick="importSingleFile('${file.fileId}')">Import</button>` : ''}
                </div>
            </div>
        `;
    });
    
    bucketList.innerHTML = `<div class="gallery-admin-grid">${itemsHTML}</div>`;
    
    // Add event listeners for checkboxes
    setupBucketFileListeners();
    updateImportButton();
}

function setupBucketFileListeners() {
    const fileItems = document.querySelectorAll('.bucket-file-item');
    
    fileItems.forEach((item) => {
        const checkbox = item.querySelector('.bucket-file-checkbox');
        if (!checkbox) return; // Skip items without checkboxes (already imported, etc.)
        
        const fileId = item.dataset.fileId;
        
        // Click on item to toggle checkbox
        item.addEventListener('click', (e) => {
            if (e.target === checkbox) return;
            if (e.target.tagName === 'BUTTON') return; // Skip button clicks
            checkbox.checked = !checkbox.checked;
            toggleBucketFileSelection(fileId, checkbox.checked);
        });
        
        // Checkbox change
        checkbox.addEventListener('change', (e) => {
            toggleBucketFileSelection(fileId, e.target.checked);
        });
    });
}

function toggleBucketFileSelection(fileId, selected) {
    if (selected) {
        if (!selectedBucketFiles.includes(fileId)) {
            selectedBucketFiles.push(fileId);
        }
    } else {
        selectedBucketFiles = selectedBucketFiles.filter(id => id !== fileId);
    }
    
    updateImportButton();
}

function updateImportButton() {
    const importBtn = document.getElementById('import-selected-btn');
    
    if (selectedBucketFiles.length > 0) {
        importBtn.style.display = 'inline-block';
        importBtn.textContent = `Import ${selectedBucketFiles.length} Selected`;
    } else {
        importBtn.style.display = 'none';
    }
    
    updateStats();
}

// Debounced search function for bucket files
let bucketSearchTimeout;
function filterBucketFiles() {
    clearTimeout(bucketSearchTimeout);
    bucketSearchTimeout = setTimeout(() => {
        const searchTerm = document.getElementById('bucket-search').value.toLowerCase();
        
        if (searchTerm.trim()) {
            filteredBucketFiles = allBucketFiles.filter(file => 
                file.displayName.toLowerCase().includes(searchTerm) ||
                file.contentType.toLowerCase().includes(searchTerm)
            );
        } else {
            filteredBucketFiles = [...allBucketFiles];
        }
        
        selectedBucketFiles = []; // Clear selections when filtering
        renderBucketFiles();
    }, 300);
}

async function importSingleFile(fileId) {
    if (!confirm('Import this file into your Image Library with EXIF extraction?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/import-files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ fileIds: [fileId] })
        });
        
        if (!response.ok) {
            throw new Error('Failed to import file');
        }
        
        const result = await response.json();
        
        if (result.success && result.imported > 0) {
            showMessage('File imported successfully!');
            // Refresh the current view to update status
            loadBucketFiles();
        } else {
            throw new Error(result.error || 'Import failed');
        }
        
    } catch (error) {
        console.error('Error importing file:', error);
        alert('Failed to import file: ' + error.message);
    }
}

async function importSelectedFiles() {
    if (selectedBucketFiles.length === 0) {
        alert('Please select files to import');
        return;
    }
    
    const confirmMsg = `Import ${selectedBucketFiles.length} selected file(s) into your Image Library? EXIF data will be extracted during import.`;
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    const importBtn = document.getElementById('import-selected-btn');
    const originalText = importBtn.textContent;
    importBtn.disabled = true;
    importBtn.innerHTML = '<span class="spinner"></span> Importing...';
    
    try {
        const response = await fetch('/api/admin/import-files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ fileIds: selectedBucketFiles })
        });
        
        if (!response.ok) {
            throw new Error('Failed to import files');
        }
        
        const result = await response.json();
        
        if (result.success) {
            const message = `Import completed!\n\nImported: ${result.imported}\nFailed: ${result.failed}\nTotal: ${result.total}`;
            alert(message);
            
            // Clear selections and refresh the bucket list
            selectedBucketFiles = [];
            loadBucketFiles();
            
        } else {
            throw new Error(result.error || 'Import failed');
        }
        
    } catch (error) {
        console.error('Error importing files:', error);
        alert('Failed to import files: ' + error.message);
    } finally {
        importBtn.disabled = false;
        importBtn.textContent = originalText;
        updateImportButton();
    }
}

function previewBucketFile(url) {
    window.open(url, '_blank');
}

// Utility functions
function showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `${type}-message`;
    messageEl.textContent = message;
    
    // Find a good place to show the message
    const header = document.querySelector('.section-header');
    if (header) {
        header.appendChild(messageEl);
        setTimeout(() => messageEl.remove(), 3000);
    }
}

// AI Writing Assistant Functionality
let currentAIMode = 'story';
let aiAssistantInitialized = false;

function initializeAIAssistant() {
    if (aiAssistantInitialized) return;
    
    // Initialize AI mode buttons
    const aiModeButtons = document.querySelectorAll('.ai-mode-btn');
    aiModeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            aiModeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAIMode = btn.dataset.mode;
        });
    });
    
    // Initialize AI action buttons
    document.getElementById('ai-describe-images')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAIAction('describe-images');
    });
    document.getElementById('ai-exif-story')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAIAction('exif-story');
    });
    document.getElementById('ai-improve-text')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAIAction('improve-text');
    });
    document.getElementById('ai-expand-content')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAIAction('expand-content');
    });
    
    // Initialize AI toggle
    document.getElementById('ai-toggle')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleAIAssistant();
    });
    
    aiAssistantInitialized = true;
}

function toggleAIAssistant() {
    const aiContent = document.getElementById('ai-content');
    const aiToggle = document.getElementById('ai-toggle');
    
    if (aiContent.style.display === 'none') {
        aiContent.style.display = 'flex';
        aiToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>';
    } else {
        aiContent.style.display = 'none';
        aiToggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>';
    }
}

async function handleAIAction(action) {
    try {
        showAILoading(true);
        
        let requestData = {
            action: action,
            mode: currentAIMode
        };
        
        // Get content based on action type
        if (action === 'improve-text' || action === 'expand-content') {
            const content = await getEditorContent();
            if (!content || content.trim().length === 0) {
                showAIResponse('Please write some content first, then try to improve or expand it.');
                return;
            }
            requestData.content = content;
        } else if (action === 'describe-images') {
            const images = await getSelectedImagesForAI();
            if (images.length === 0) {
                showAIResponse('Please add some images to your post first, then try describing them.');
                return;
            }
            requestData.images = images;
        } else if (action === 'exif-story') {
            const images = await getSelectedImagesForAI();
            if (images.length === 0) {
                showAIResponse('Please add some images to your post first to generate an EXIF-based story.');
                return;
            }
            
            // Get EXIF data for the images
            const exifData = await getEXIFDataForImages(images);
            requestData.exifData = exifData;
            requestData.images = images;
        }
        
        // Call AI API
        const response = await fetch('/api/admin/ai-assist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'AI request failed');
        }
        
        const result = await response.json();
        showAIResponse(result.content, action);
        
    } catch (error) {
        showAIResponse(`Error: ${error.message}`, null, true);
    } finally {
        showAILoading(false);
    }
}

function showAILoading(show) {
    const loading = document.getElementById('ai-loading');
    const response = document.getElementById('ai-response');
    
    if (show) {
        loading.style.display = 'flex';
        response.style.display = 'none';
    } else {
        loading.style.display = 'none';
        response.style.display = 'block';
    }
}

function showAIResponse(content, action = null, isError = false) {
    const responseDiv = document.getElementById('ai-response');
    
    if (isError) {
        responseDiv.innerHTML = `
            <div class="ai-error">
                <h4>⚠️ Error</h4>
                <p>${content}</p>
            </div>
        `;
        return;
    }
    
    const actionTitle = {
        'describe-images': '📸 Image Descriptions',
        'exif-story': '⭐ EXIF Story',
        'improve-text': '✨ Improved Content',
        'expand-content': '📝 Expanded Content'
    };
    
    // Create the response container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'ai-generated-content';
    
    contentDiv.innerHTML = `
        <h4>${actionTitle[action] || '🤖 AI Response'}</h4>
        <div class="ai-content-text">${content.replace(/\n/g, '<br>')}</div>
    `;
    
    // Create the insert button separately and add proper event handling
    const insertBtn = document.createElement('button');
    insertBtn.type = 'button';
    insertBtn.className = 'ai-insert-btn';
    insertBtn.textContent = 'Insert into Editor';
    
    // Add robust event handling to prevent any form submission
    insertBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        try {
            await insertAIContentIntoEditor(action, content);
        } catch (error) {
            // Error handled silently
        }
        
        return false;
    });
    
    contentDiv.appendChild(insertBtn);
    responseDiv.innerHTML = '';
    responseDiv.appendChild(contentDiv);
}

async function insertAIContentIntoEditor(action, content) {
    if (!blockEditor) {
        alert('Editor not available');
        return;
    }
    
    try {
        // Split content into paragraphs for better formatting
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        
        // Insert each paragraph as a separate block
        for (const paragraph of paragraphs) {
            await blockEditor.blocks.insert('paragraph', {
                text: paragraph.trim()
            });
        }
        
        const insertCount = paragraphs.length;
        showMessage(`AI content inserted into editor! (${insertCount} paragraph${insertCount > 1 ? 's' : ''})`);
    } catch (error) {
        alert('Failed to insert content into editor');
    }
}

async function getEditorContent() {
    if (!blockEditor) return '';
    
    try {
        const outputData = await blockEditor.save();
        // Convert EditorJS blocks to plain text
        let content = '';
        outputData.blocks.forEach(block => {
            if (block.type === 'paragraph') {
                content += block.data.text + '\n\n';
            } else if (block.type === 'header') {
                content += block.data.text + '\n\n';
            }
            // Add more block types as needed
        });
        return content.trim();
    } catch (error) {
        return '';
    }
}

async function getSelectedImagesForAI() {
    const images = [];
    
    try {
        // First, try to get images from the current editor content
        if (blockEditor) {
            const outputData = await blockEditor.save();
            
            // Look for images in editor blocks
            outputData.blocks.forEach(block => {
                if (block.type === 'image' && block.data.file && block.data.file.url) {
                    images.push({
                        title: block.data.caption || 'Image from editor',
                        description: block.data.caption || '',
                        url: block.data.file.url,
                        id: null // We'll try to find the ID from the URL
                    });
                } else if (block.type === 'imageLibrary' && block.data.url) {
                    // Custom image library tool
                    images.push({
                        title: block.data.caption || block.data.originalFilename || 'Library image',
                        description: block.data.caption || '',
                        url: block.data.url,
                        id: null
                    });
                }
            });
        }
        
        // Also check uploadedImages array for additional images
        if (uploadedImages && uploadedImages.length > 0) {
            uploadedImages.forEach(img => {
                // Avoid duplicates
                const exists = images.find(existingImg => existingImg.url === img.b2_url);
                if (!exists) {
                    images.push({
                        title: img.title || img.original_filename,
                        description: img.description || img.alt_text,
                        url: img.b2_url,
                        id: img.id
                    });
                }
            });
        }
        
        // Try to find database IDs and enrich image data
        for (const image of images) {
            if (!image.id && image.url) {
                try {
                    const filename = image.url.split('/').pop();
                    const response = await fetch(`/api/images/by-filename?filename=${encodeURIComponent(filename)}`);
                    if (response.ok) {
                        const dbImage = await response.json();
                        image.id = dbImage.id;
                        image.title = image.title || dbImage.title || dbImage.original_filename;
                        image.description = image.description || dbImage.description || dbImage.alt_text;
                        
                        // Add technical details to help AI generate unique descriptions
                        image.filename = dbImage.original_filename;
                        image.dimensions = dbImage.width && dbImage.height ? `${dbImage.width}x${dbImage.height}` : null;
                        image.fileSize = dbImage.file_size;
                    } else {
                        // Try looking up by URL instead
                        const urlResponse = await fetch(`/api/images/by-url?url=${encodeURIComponent(image.url)}`);
                        if (urlResponse.ok) {
                            const dbImage = await urlResponse.json();
                            image.id = dbImage.id;
                            image.title = image.title || dbImage.title || dbImage.original_filename;
                            image.description = image.description || dbImage.description || dbImage.alt_text;
                            image.filename = dbImage.original_filename;
                            image.dimensions = dbImage.width && dbImage.height ? `${dbImage.width}x${dbImage.height}` : null;
                            image.fileSize = dbImage.file_size;
                        }
                    }
                } catch (error) {
                    // Silently fail - image will just have less metadata
                }
            }
        }
        
    } catch (error) {
        // Error getting images from editor
    }
    
    return images;
}

async function getEXIFDataForImages(images) {
    const exifData = {};
    
    for (const image of images) {
        try {
            const response = await fetch(`/api/images/${image.id}/exif`);
            if (response.ok) {
                exifData[image.id] = await response.json();
            }
        } catch (error) {
            // Failed to load EXIF data
        }
    }
    
    return exifData;
}

// Theme Management
const availableThemes = [
    {
        id: 'default',
        name: 'Current Dark',
        description: 'The current dark design with orange accents'
    },
    {
        id: 'classic',
        name: 'Classic Light',
        description: 'Clean and professional with blue accents'
    },
    {
        id: 'dark',
        name: 'Pure Dark',
        description: 'Deep dark mode with red accents'
    },
    {
        id: 'ocean',
        name: 'Ocean Breeze',
        description: 'Calming blues and sea-inspired colors'
    },
    {
        id: 'forest',
        name: 'Forest Green',
        description: 'Natural greens for an earthy feel'
    },
    {
        id: 'sunset',
        name: 'Warm Sunset',
        description: 'Warm oranges and golden tones'
    },
    {
        id: 'monochrome',
        name: 'Monochrome',
        description: 'Elegant black, white, and gray palette'
    },
    {
        id: 'solarized-light',
        name: 'Solarized Light',
        description: 'Gentle light theme with carefully chosen colors'
    },
    {
        id: 'solarized-dark',
        name: 'Solarized Dark',
        description: 'Dark theme with soothing color palette'
    },
    {
        id: 'leica',
        name: 'Leica Classic',
        description: 'Inspired by classic Leica cameras with signature red accents'
    }
];

let selectedTheme = 'default';

function loadThemesInterface() {
    const grid = document.getElementById('theme-preview-grid');
    
    // Load current theme from backend
    getCurrentTheme().then(currentTheme => {
        selectedTheme = currentTheme;
        renderThemeCards();
    });
    
    function renderThemeCards() {
        const cardsHTML = availableThemes.map(theme => `
            <div class="theme-card theme-${theme.id} ${selectedTheme === theme.id ? 'selected' : ''}" 
                 data-theme="${theme.id}" onclick="selectTheme('${theme.id}')">
                <div class="theme-header">
                    <div class="theme-title">${theme.name}</div>
                    <div class="theme-description">${theme.description}</div>
                </div>
                <div class="theme-preview">
                    <div class="theme-navbar">
                        <div>jonsson.io</div>
                        <div>Stories • Gallery • About</div>
                    </div>
                    <div class="theme-content">
                        <div class="theme-hero">Photography Portfolio</div>
                        <div class="theme-cards">
                            <div class="theme-mini-card">Story Post</div>
                            <div class="theme-mini-card">Gallery</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        grid.innerHTML = cardsHTML;
    }
    
    // Setup save button
    const saveBtn = document.getElementById('save-theme-btn');
    if (saveBtn) {
        saveBtn.onclick = () => saveSelectedTheme();
    }
}

function selectTheme(themeId) {
    selectedTheme = themeId;
    
    // Update UI
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.theme === themeId) {
            card.classList.add('selected');
        }
    });
}

async function getCurrentTheme() {
    try {
        const response = await fetch('/api/admin/theme', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.theme || 'default';
        }
    } catch (error) {
        // Error loading current theme
    }
    
    return 'default';
}

async function saveSelectedTheme() {
    const saveBtn = document.getElementById('save-theme-btn');
    const originalText = saveBtn.textContent;
    
    saveBtn.textContent = 'Applying...';
    saveBtn.disabled = true;
    
    try {
        const response = await fetch('/api/admin/theme', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ theme: selectedTheme })
        });
        
        if (response.ok) {
            saveBtn.textContent = 'Applied!';
            showMessage(`Theme "${availableThemes.find(t => t.id === selectedTheme)?.name}" applied successfully!`);
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            }, 2000);
        } else {
            throw new Error('Failed to save theme');
        }
    } catch (error) {
        saveBtn.textContent = 'Error - Try Again';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 3000);
    }
}

// Slug management
let originalSlug = '';
let isEditingSlug = false;

function enableSlugEditing() {
    const slugInput = document.getElementById('post-slug');
    const editBtn = document.getElementById('edit-slug-btn');
    const regenerateBtn = document.getElementById('regenerate-slug-btn');
    const cancelBtn = document.getElementById('cancel-slug-btn');
    
    originalSlug = slugInput.value;
    isEditingSlug = true;
    
    slugInput.readOnly = false;
    slugInput.focus();
    
    editBtn.style.display = 'none';
    regenerateBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
}

function regenerateSlugFromTitle() {
    const titleInput = document.getElementById('post-title');
    const slugInput = document.getElementById('post-slug');
    
    if (titleInput.value.trim()) {
        const newSlug = createSlugFromTitle(titleInput.value);
        slugInput.value = newSlug;
    }
}

function cancelSlugEditing() {
    const slugInput = document.getElementById('post-slug');
    const editBtn = document.getElementById('edit-slug-btn');
    const regenerateBtn = document.getElementById('regenerate-slug-btn');
    const cancelBtn = document.getElementById('cancel-slug-btn');
    
    slugInput.value = originalSlug;
    slugInput.readOnly = true;
    isEditingSlug = false;
    
    editBtn.style.display = 'inline-block';
    regenerateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

function createSlugFromTitle(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Initialize AI Assistant when editor is shown
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the editor to be ready, then initialize AI
    setTimeout(() => {
        if (document.getElementById('ai-assistant')) {
            initializeAIAssistant();
        }
    }, 1000);
});

// Icon Library
const iconLibrary = {
    instagram: {
        name: 'Instagram',
        path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z'
    },
    email: {
        name: 'Email',
        path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
    },
    twitter: {
        name: 'Twitter',
        path: 'M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z'
    },
    linkedin: {
        name: 'LinkedIn',
        path: 'M20.447,20.452H16.893V14.883C16.893,13.555 16.866,11.846 15.041,11.846C13.188,11.846 12.905,13.291 12.905,14.785V20.452H9.351V9H12.765V10.561H12.811C13.288,9.661 14.448,8.711 16.181,8.711C19.782,8.711 20.447,11.081 20.447,14.166V20.452ZM5.337,7.433A2.062,2.062 0 0,1 3.275,5.371A2.062,2.062 0 0,1 5.337,3.309A2.062,2.062 0 0,1 7.399,5.371A2.062,2.062 0 0,1 5.337,7.433ZM7.119,20.452H3.555V9H7.119V20.452ZM22.225,0H1.771C0.792,0 0,0.774 0,1.729V22.271C0,23.227 0.792,24 1.771,24H22.222C23.2,24 24,23.227 24,22.271V1.729C24,0.774 23.2,0 22.222,0H22.225Z'
    },
    facebook: {
        name: 'Facebook',
        path: 'M24,12.073C24,5.405 18.627,0 12,0S0,5.405 0,12.073C0,18.1 4.388,23.094 10.125,24V15.563H7.078V12.073H10.125V9.404C10.125,6.369 11.917,4.725 14.658,4.725C15.97,4.725 17.344,4.954 17.344,4.954V7.922H15.83C14.34,7.922 13.875,8.853 13.875,9.808V12.073H17.203L16.671,15.563H13.875V24C19.612,23.094 24,18.1 24,12.073Z'
    },
    youtube: {
        name: 'YouTube',
        path: 'M23.498,6.186A3.016,3.016 0,0 0,21.372 4.063C19.505,3.546 12,3.546 12,3.546S4.495,3.546 2.628,4.063A3.016,3.016 0,0 0,0.502 6.186C0,8.07 0,12 0,12S0,15.93 0.502,17.814A3.016,3.016 0,0 0,2.628 19.937C4.495,20.454 12,20.454 12,20.454S19.505,20.454 21.372,19.937A3.016,3.016 0,0 0,23.498 17.814C24,15.93 24,12 24,12S24,8.07 23.498,6.186ZM9.545,15.568V8.432L15.818,12L9.545,15.568Z'
    },
    github: {
        name: 'GitHub',
        path: 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z'
    },
    tiktok: {
        name: 'TikTok',
        path: 'M12.525 22c-1.193 0-2.374-.197-3.507-.588-.881-.304-1.719-.756-2.49-1.343-.758-.576-1.454-1.263-2.068-2.043-.597-.759-1.09-1.587-1.464-2.465C2.634 14.687 2.447 13.705 2.447 12.713s.187-1.974.549-2.848c.374-.878.867-1.706 1.464-2.465.614-.78 1.31-1.467 2.068-2.043.771-.587 1.609-1.039 2.49-1.343C10.151 3.623 11.332 3.426 12.525 3.426c.85 0 1.694.117 2.509.349.795.226 1.569.558 2.299.986.714.418 1.383.924 1.991 1.503.594.565 1.128 1.203 1.588 1.896.448.677.824 1.408 1.117 2.173.285.744.43 1.525.43 2.321s-.145 1.577-.43 2.321c-.293.765-.669 1.496-1.117 2.173-.46.693-.994 1.331-1.588 1.896-.608.579-1.277 1.085-1.991 1.503-.73.428-1.504.76-2.299.986-.815.232-1.659.349-2.509.349zm6.084-12.637l-2.5-1.35v6.188c0 .86-.698 1.558-1.558 1.558s-1.558-.698-1.558-1.558.698-1.558 1.558-1.558c.172 0 .337.028.489.08V11.56c-.152-.023-.309-.034-.489-.034-1.72 0-3.115 1.395-3.115 3.115 0 1.72 1.395 3.115 3.115 3.115 1.72 0 3.115-1.395 3.115-3.115V8.823l2.442 1.317V9.363z'
    },
    snapchat: {
        name: 'Snapchat',
        path: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1.54 15.45c.05-.4.1-.85.15-1.3l.37-3.54c.03-.3-.12-.57-.38-.67-.26-.1-.56-.03-.75.17l-1.65 1.72c-.4.42-.95.65-1.52.65h-.01c-.89 0-1.62-.73-1.62-1.62 0-.44.18-.85.47-1.15l3.22-3.22c.3-.3.47-.71.47-1.15v-.92c0-.89.73-1.62 1.62-1.62h.92c.44 0 .85.17 1.15.47l3.22 3.22c.29.3.47.71.47 1.15 0 .89-.73 1.62-1.62 1.62h-.01c-.57 0-1.12-.23-1.52-.65l-1.65-1.72c-.19-.2-.49-.27-.75-.17-.26.1-.41.37-.38.67l.37 3.54c.05.45.1.9.15 1.3.02.18-.04.36-.16.49-.12.13-.3.21-.49.21h-3.92c-.19 0-.37-.08-.49-.21-.12-.13-.18-.31-.16-.49z'
    },
    discord: {
        name: 'Discord',
        path: 'M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.928 1.761 8.18 1.761 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.201 0 2.176 1.068 2.157 2.38 0 1.311-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.2 0 2.175 1.068 2.156 2.38 0 1.311-.956 2.38-2.156 2.38z'
    },
    website: {
        name: 'Website',
        path: 'M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
    },
    phone: {
        name: 'Phone',
        path: 'M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z'
    },
    whatsapp: {
        name: 'WhatsApp',
        path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488'
    },
    mastodon: {
        name: 'Mastodon',
        path: 'M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792.18 11.813.18h-.03c-3.98 0-4.835.062-5.288.129C3.882.7 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z'
    }
};

// Social Links Management Functions
let currentSocialLinkId = null;
let selectedIconPath = '';

async function loadSocialLinks() {
    const socialLinksList = document.getElementById('social-links-list');
    
    socialLinksList.innerHTML = '<div class="loading">Loading social links...</div>';
    
    try {
        const response = await fetch('/api/admin/social-links', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load social links');
        }
        
        const socialLinks = await response.json();
        renderSocialLinks(socialLinks);
        
    } catch (error) {
        console.error('Error loading social links:', error);
        socialLinksList.innerHTML = '<div class="error-message">Error loading social links. Please try again.</div>';
    }
}

function renderSocialLinks(socialLinks) {
    const socialLinksList = document.getElementById('social-links-list');
    
    if (socialLinks.length === 0) {
        socialLinksList.innerHTML = `
            <div class="loading">
                <p>No social links configured yet.</p>
                <p>Click "Add Link" to get started.</p>
            </div>
        `;
        return;
    }
    
    const linksHTML = socialLinks.map(link => `
        <div class="gallery-admin-item" data-link-id="${link.id}">
            <div class="gallery-admin-image" style="display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#666">
                    <path d="${link.icon_svg || 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z'}"/>
                </svg>
            </div>
            <div class="gallery-admin-info">
                <h3>${link.label}</h3>
                <p class="gallery-admin-description">${link.platform} • ${link.url}</p>
                <div class="gallery-admin-meta">
                    Order: ${link.sort_order}
                    ${!link.visible ? ' • <span class="hidden-badge">Hidden</span>' : ''}
                </div>
            </div>
            <div class="gallery-admin-actions">
                <button class="btn btn-small btn-outline" onclick="editSocialLink(${link.id})">Edit</button>
                <button class="btn btn-small btn-secondary" onclick="toggleSocialLinkVisibility(${link.id}, ${link.visible})">${link.visible ? 'Hide' : 'Show'}</button>
                <button class="btn btn-small btn-danger" onclick="deleteSocialLink(${link.id})">Delete</button>
            </div>
        </div>
    `).join('');
    
    socialLinksList.innerHTML = `<div class="gallery-admin-grid">${linksHTML}</div>`;
}

function openSocialLinkModal(linkId = null) {
    currentSocialLinkId = linkId;
    const modal = document.getElementById('social-link-modal');
    const title = document.getElementById('social-link-modal-title');
    
    if (linkId) {
        title.textContent = 'Edit Social Link';
        // Load existing link data
        loadSocialLinkData(linkId);
    } else {
        title.textContent = 'Add Social Link';
        resetSocialLinkForm();
    }
    
    modal.classList.add('active');
}

function closeSocialLinkModal() {
    const modal = document.getElementById('social-link-modal');
    modal.classList.remove('active');
    currentSocialLinkId = null;
    resetSocialLinkForm();
}

function resetSocialLinkForm() {
    document.getElementById('social-link-form').reset();
    document.getElementById('social-visible').checked = true;
    document.getElementById('social-sort-order').value = 0;
    selectedIconPath = '';
    
    // Reset icon preview to default
    const preview = document.getElementById('selected-icon-preview');
    if (preview) {
        preview.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
        `;
    }
}

async function loadSocialLinkData(linkId) {
    try {
        const response = await fetch('/api/admin/social-links', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load social links');
        }
        
        const socialLinks = await response.json();
        const link = socialLinks.find(l => l.id === linkId);
        
        if (link) {
            document.getElementById('social-platform').value = link.platform;
            document.getElementById('social-label').value = link.label;
            document.getElementById('social-url').value = link.url;
            document.getElementById('social-icon-svg').value = link.icon_svg || '';
            document.getElementById('social-sort-order').value = link.sort_order;
            document.getElementById('social-visible').checked = link.visible;
            
            // Update icon preview and selected path
            selectedIconPath = link.icon_svg || '';
            if (selectedIconPath) {
                updateIconPreview(selectedIconPath);
            } else {
                // Try to auto-detect based on platform
                autoDetectIcon();
            }
        }
    } catch (error) {
        console.error('Error loading social link data:', error);
        alert('Failed to load social link data');
    }
}

async function saveSocialLink(e) {
    e.preventDefault();
    
    const linkData = {
        platform: document.getElementById('social-platform').value,
        label: document.getElementById('social-label').value,
        url: document.getElementById('social-url').value,
        icon_svg: document.getElementById('social-icon-svg').value,
        sort_order: parseInt(document.getElementById('social-sort-order').value) || 0,
        visible: document.getElementById('social-visible').checked
    };
    
    try {
        const url = currentSocialLinkId 
            ? `/api/admin/social-links/${currentSocialLinkId}`
            : '/api/admin/social-links';
        const method = currentSocialLinkId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(linkData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save social link');
        }
        
        closeSocialLinkModal();
        loadSocialLinks();
        showMessage(`Social link ${currentSocialLinkId ? 'updated' : 'created'} successfully!`);
        
    } catch (error) {
        console.error('Error saving social link:', error);
        alert('Failed to save social link: ' + error.message);
    }
}

async function editSocialLink(linkId) {
    openSocialLinkModal(linkId);
}

async function toggleSocialLinkVisibility(linkId, currentVisibility) {
    try {
        const response = await fetch(`/api/admin/social-links/${linkId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ visible: !currentVisibility })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update social link visibility');
        }
        
        loadSocialLinks();
        showMessage(`Social link ${!currentVisibility ? 'shown' : 'hidden'} successfully!`);
        
    } catch (error) {
        console.error('Error updating social link visibility:', error);
        alert('Failed to update social link visibility: ' + error.message);
    }
}

async function deleteSocialLink(linkId) {
    if (!confirm('Are you sure you want to delete this social link?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/social-links/${linkId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete social link');
        }
        
        loadSocialLinks();
        showMessage('Social link deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting social link:', error);
        alert('Failed to delete social link: ' + error.message);
    }
}

// Icon Picker Functions
function openIconPicker() {
    const modal = document.getElementById('icon-picker-modal');
    const grid = document.getElementById('icon-picker-grid');
    
    // Generate icon grid
    const iconsHTML = Object.entries(iconLibrary).map(([key, icon]) => `
        <div class="icon-option" data-icon-key="${key}" onclick="selectIcon('${key}')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="${icon.path}"/>
            </svg>
            <span class="icon-option-label">${icon.name}</span>
        </div>
    `).join('');
    
    grid.innerHTML = iconsHTML;
    
    // Highlight currently selected icon
    if (selectedIconPath) {
        const currentIcon = Object.entries(iconLibrary).find(([key, icon]) => icon.path === selectedIconPath);
        if (currentIcon) {
            const iconElement = grid.querySelector(`[data-icon-key="${currentIcon[0]}"]`);
            if (iconElement) {
                iconElement.classList.add('selected');
            }
        }
    }
    
    modal.classList.add('active');
}

function closeIconPicker() {
    const modal = document.getElementById('icon-picker-modal');
    modal.classList.remove('active');
}

function selectIcon(iconKey) {
    const icon = iconLibrary[iconKey];
    if (!icon) return;
    
    selectedIconPath = icon.path;
    
    // Update the preview
    updateIconPreview(icon.path);
    
    // Update the hidden input
    document.getElementById('social-icon-svg').value = icon.path;
    
    // Close the picker
    closeIconPicker();
}

function updateIconPreview(iconPath) {
    const preview = document.getElementById('selected-icon-preview');
    if (preview && iconPath) {
        preview.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="${iconPath}"/>
            </svg>
        `;
    }
}

function autoDetectIcon() {
    const platform = document.getElementById('social-platform').value.toLowerCase().trim();
    
    if (platform && iconLibrary[platform]) {
        selectedIconPath = iconLibrary[platform].path;
        updateIconPreview(selectedIconPath);
        document.getElementById('social-icon-svg').value = selectedIconPath;
    }
}

// Make functions globally accessible for onclick handlers
window.editSocialLink = editSocialLink;
window.toggleSocialLinkVisibility = toggleSocialLinkVisibility;
window.deleteSocialLink = deleteSocialLink;
window.selectIcon = selectIcon;

// Navigation Reordering Functionality
let isDragging = false;
let draggedElement = null;
let placeholder = null;

function initializeNavigationReordering() {
    const navigationContainer = document.getElementById('admin-navigation');
    if (!navigationContainer) return;
    
    // Load saved navigation order first
    loadNavigationOrder();
    
    // Make navigation items draggable after loading order
    setTimeout(() => {
        const navItems = navigationContainer.querySelectorAll('.nav-item');
        
        // Add drop listeners to the container as well
        navigationContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        navigationContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            handleDrop(e);
        });
        
        navItems.forEach((item, index) => {
            item.draggable = true;
            item.style.cursor = 'move';
            
            // Add visual indicator that items are draggable
            item.title = 'Drag to reorder';
            
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);
        });
    }, 50);
}

function handleDragStart(e) {
    isDragging = true;
    draggedElement = e.target;
    
    // Create placeholder element
    placeholder = document.createElement('div');
    placeholder.className = 'nav-item nav-placeholder';
    placeholder.innerHTML = '<span>Drop here</span>';
    placeholder.style.opacity = '0.5';
    placeholder.style.border = '2px dashed #007bff';
    placeholder.style.background = '#f8f9fa';
    placeholder.style.minHeight = '40px';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    
    // Add visual feedback
    draggedElement.style.opacity = '0.5';
    draggedElement.classList.add('dragging');
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
    isDragging = false;
    
    // Remove visual feedback
    if (draggedElement) {
        draggedElement.style.opacity = '1';
        draggedElement.classList.remove('dragging');
    }
    
    // Remove placeholder
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    
    draggedElement = null;
    placeholder = null;
    
    // Save new order with a small delay to ensure DOM is updated
    setTimeout(() => {
        saveNavigationOrder();
    }, 100);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!isDragging || !draggedElement) return;
    
    const afterElement = getDragAfterElement(e.currentTarget.parentNode, e.clientX);
    const container = e.currentTarget.parentNode;
    
    if (afterElement == null) {
        container.appendChild(placeholder);
    } else {
        container.insertBefore(placeholder, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    if (!isDragging || !draggedElement || !placeholder) return;
    
    // Replace placeholder with dragged element
    placeholder.parentNode.replaceChild(draggedElement, placeholder);
    
    // Remove visual feedback immediately
    draggedElement.style.opacity = '1';
    draggedElement.classList.remove('dragging');
}

function handleDragEnter(e) {
    if (!isDragging) return;
    e.preventDefault();
}

function handleDragLeave(e) {
    if (!isDragging) return;
    // Don't remove placeholder here as it causes flickering
}

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.nav-item:not(.dragging):not(.nav-placeholder)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveNavigationOrder() {
    const navigationContainer = document.getElementById('admin-navigation');
    if (!navigationContainer) return;
    
    const navItems = navigationContainer.querySelectorAll('.nav-item:not(.nav-placeholder)');
    const order = [];
    
    navItems.forEach((item, index) => {
        const section = item.dataset.section;
        if (section) {
            order.push({
                section: section,
                order: index + 1
            });
        }
    });
    
    // Save to localStorage
    localStorage.setItem('adminNavigationOrder', JSON.stringify(order));
    
    // Also update the data-order attributes to reflect the new order
    navItems.forEach((item, index) => {
        item.dataset.order = index + 1;
    });
}

function loadNavigationOrder() {
    const saved = localStorage.getItem('adminNavigationOrder');
    if (!saved) return;
    
    try {
        const order = JSON.parse(saved);
        const navigationContainer = document.getElementById('admin-navigation');
        if (!navigationContainer) return;
        
        // Sort navigation items according to saved order
        const navItems = [...navigationContainer.querySelectorAll('.nav-item')];
        const sortedItems = [];
        
        // Create a map for easier lookup
        const orderMap = {};
        order.forEach(orderItem => {
            orderMap[orderItem.section] = orderItem.order;
        });
        
        // Sort items by their saved order
        const sortedByOrder = navItems.sort((a, b) => {
            const aOrder = orderMap[a.dataset.section] || 999;
            const bOrder = orderMap[b.dataset.section] || 999;
            return aOrder - bOrder;
        });
        
        // Clear container and re-add in order
        navigationContainer.innerHTML = '';
        sortedByOrder.forEach((item, index) => {
            item.dataset.order = index + 1;
            navigationContainer.appendChild(item);
        });
        
        
    } catch (error) {
        // Error loading navigation order
    }
}