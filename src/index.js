/**
 * Cloudflare Workers entry point for jonsson.io photography blog
 */

// Static file contents will be injected here during build
const STATIC_FILES = {
  "/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>jonsson.io - Visual Stories</title>\n    <link rel=\"icon\" type=\"image/x-icon\" href=\"/static/favicon.ico\">\n    <link rel=\"stylesheet\" href=\"/static/css/style.css\">\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap\" rel=\"stylesheet\">\n    <script src=\"/static/js/theme-loader.js\"></script>\n</head>\n<body>\n    <!-- Hero Section -->\n    <section class=\"hero\">\n        <div class=\"hero-content\">\n            <div class=\"hero-text\">\n                <h1 class=\"hero-title\">\n                    <span class=\"title-main\">Visual</span>\n                    <span class=\"title-accent\">Stories</span>\n                </h1>\n                <p class=\"hero-subtitle\">Capturing life through the lens</p>\n                <div class=\"hero-nav\">\n                    <button class=\"nav-btn active\" data-section=\"gallery\">Gallery</button>\n                    <button class=\"nav-btn\" data-section=\"stories\">Stories</button>\n                    <button class=\"nav-btn\" data-section=\"about\">About</button>\n                </div>\n            </div>\n            <div class=\"hero-social\">\n                <a href=\"https://instagram.com/jonsson\" target=\"_blank\" class=\"social-link\">\n                    <span>Instagram</span>\n                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                        <path d=\"M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z\"/>\n                    </svg>\n                </a>\n                <a href=\"mailto:hello@jonsson.io\" class=\"social-link\">\n                    <span>Email</span>\n                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                        <path d=\"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z\"/>\n                    </svg>\n                </a>\n            </div>\n        </div>\n    </section>\n\n    <!-- Main Content -->\n    <main class=\"main\">\n        <!-- Gallery Section -->\n        <section id=\"gallery\" class=\"content-section active\">\n            <div class=\"section-header\">\n                <h2>Recent Work</h2>\n            </div>\n            \n            <div class=\"gallery-container\">\n                <div class=\"gallery masonry\" id=\"photo-gallery\">\n                    <div class=\"gallery-loading\">\n                        <div class=\"loading-animation\">\n                            <div class=\"loading-dot\"></div>\n                            <div class=\"loading-dot\"></div>\n                            <div class=\"loading-dot\"></div>\n                        </div>\n                        <p>Loading visual stories...</p>\n                    </div>\n                </div>\n            </div>\n        </section>\n\n        <!-- Stories Section -->\n        <section id=\"stories\" class=\"content-section\">\n            <div class=\"section-header\">\n                <h2>Stories</h2>\n                <p class=\"section-subtitle\">Behind the lens narratives</p>\n            </div>\n            \n            <div class=\"stories-container\" id=\"stories-list\">\n                <div class=\"gallery-loading\">\n                    <div class=\"loading-animation\">\n                        <div class=\"loading-dot\"></div>\n                        <div class=\"loading-dot\"></div>\n                        <div class=\"loading-dot\"></div>\n                    </div>\n                    <p>Loading stories...</p>\n                </div>\n            </div>\n        </section>\n\n        <!-- About Section -->\n        <section id=\"about\" class=\"content-section\">\n            <div class=\"about-container\">\n                <div class=\"about-text\">\n                    <h2>About</h2>\n                    <div class=\"about-content\">\n                        <p class=\"lead\">I'm a photographer passionate about capturing authentic moments and telling visual stories through my lens.</p>\n                        \n                        <p>My work focuses on the intersection of light, emotion, and time – freezing fleeting moments that might otherwise be forgotten. Each photograph is an invitation to see the world through my eyes, to discover beauty in the ordinary and extraordinary alike.</p>\n                        \n                        <p>Based between urban landscapes and natural environments, I find inspiration in the contrast between human-made and organic forms, always seeking to capture the essence of a moment rather than just its appearance.</p>\n                        \n                        <div class=\"about-stats\">\n                            <div class=\"stat\">\n                                <span class=\"stat-number\" id=\"photo-count\">0</span>\n                                <span class=\"stat-label\">Photos</span>\n                            </div>\n                            <div class=\"stat\">\n                                <span class=\"stat-number\" id=\"story-count\">0</span>\n                                <span class=\"stat-label\">Stories</span>\n                            </div>\n                            <div class=\"stat\">\n                                <span class=\"stat-number\">2024</span>\n                                <span class=\"stat-label\">Since</span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"about-image\">\n                    <div class=\"image-placeholder\">\n                        <svg width=\"120\" height=\"120\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M9 2l3 3h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3zm3 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z\"/>\n                        </svg>\n                        <p>Your portrait here</p>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </main>\n\n    <!-- Lightbox -->\n    <div class=\"lightbox\" id=\"lightbox\">\n        <div class=\"lightbox-content\">\n            <button class=\"lightbox-close\">&times;</button>\n            <div class=\"lightbox-image-container\">\n                <img class=\"lightbox-image\" alt=\"\">\n                <div class=\"lightbox-camera-overlay\" id=\"lightbox-camera-overlay\">\n                    <div class=\"camera-info\">\n                        <span class=\"camera-icon\">📷</span>\n                        <div class=\"camera-details\" id=\"camera-details\"></div>\n                    </div>\n                </div>\n                <div class=\"lightbox-nav\">\n                    <button class=\"lightbox-prev\">&#8249;</button>\n                    <button class=\"lightbox-next\">&#8250;</button>\n                </div>\n            </div>\n            <div class=\"lightbox-info\">\n                <h3 class=\"lightbox-title\"></h3>\n                <p class=\"lightbox-description\"></p>\n                <div class=\"lightbox-meta\">\n                    <span class=\"lightbox-date\"></span>\n                </div>\n                <div class=\"lightbox-exif\" id=\"lightbox-exif\">\n                    <button class=\"exif-toggle\" id=\"exif-toggle\">📷 Show EXIF Data</button>\n                    <div class=\"exif-panel\" id=\"exif-panel\" style=\"display: none;\">\n                        <div class=\"exif-content\" id=\"exif-content\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <script src=\"/static/js/social-links.js\"></script>\n    <script src=\"/static/js/main.js\"></script>\n</body>\n</html>",
  "/post.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Visual Stories</title>\n    <link rel=\"icon\" type=\"image/x-icon\" href=\"/static/favicon.ico\">\n    <link rel=\"stylesheet\" href=\"/static/css/style.css\">\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap\" rel=\"stylesheet\">\n    <script src=\"/static/js/theme-loader.js\"></script>\n</head>\n<body>\n    <nav class=\"navbar\">\n        <div class=\"nav-container\">\n            <div class=\"nav-brand\">\n                <a href=\"/\">Visual Stories</a>\n            </div>\n            <div class=\"nav-links\">\n                <a href=\"/\">Home</a>\n                <a href=\"/#gallery\">Gallery</a>\n                <a href=\"/#stories\">Stories</a>\n            </div>\n        </div>\n    </nav>\n\n    <main class=\"main-content\">\n        <div class=\"post-container\">\n            <div id=\"post-loading\" class=\"loading-state\">\n                <div class=\"loading-spinner\"></div>\n                <p>Loading story...</p>\n            </div>\n            \n            <div id=\"post-error\" class=\"error-state\" style=\"display: none;\">\n                <h2>Story Not Found</h2>\n                <p>The story you're looking for doesn't exist or has been removed.</p>\n                <a href=\"/\" class=\"btn-primary\">← Back to Home</a>\n            </div>\n            \n            <article id=\"post-content\" class=\"post-article\" style=\"display: none;\">\n                <header class=\"post-header\">\n                    <h1 id=\"post-title\"></h1>\n                    <div class=\"post-meta\">\n                        <time id=\"post-date\"></time>\n                    </div>\n                </header>\n                \n                <div id=\"post-featured-image\" class=\"post-featured-image\" style=\"display: none;\"></div>\n                \n                <div id=\"post-body\" class=\"post-body\"></div>\n                \n                <div id=\"post-gallery\" class=\"post-gallery\" style=\"display: none;\"></div>\n                \n                <footer class=\"post-footer\">\n                    <a href=\"/\" class=\"btn-secondary\">← Back to Stories</a>\n                </footer>\n            </article>\n        </div>\n    </main>\n\n    <!-- Lightbox -->\n    <div class=\"lightbox\" id=\"lightbox\">\n        <div class=\"lightbox-content-simple\">\n            <button class=\"lightbox-close\">&times;</button>\n            <div class=\"lightbox-image-container\">\n                <img class=\"lightbox-image\" alt=\"\">\n                <div class=\"lightbox-camera-overlay\" id=\"lightbox-camera-overlay\">\n                    <div class=\"camera-info\">\n                        <span class=\"camera-icon\">📷</span>\n                        <div class=\"camera-details\" id=\"camera-details\"></div>\n                    </div>\n                </div>\n                <div class=\"lightbox-nav\">\n                    <button class=\"lightbox-prev\">&#8249;</button>\n                    <button class=\"lightbox-next\">&#8250;</button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <script src=\"/static/js/post.js\"></script>\n</body>\n</html>",
  "/admin/index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Admin - jonsson.io</title>\n    <link rel=\"icon\" type=\"image/x-icon\" href=\"/static/favicon.ico\">\n    <link rel=\"stylesheet\" href=\"/static/css/admin.css\">\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap\" rel=\"stylesheet\">\n    <!-- EditorJS - Modern Block Editor -->\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.28.2/dist/editorjs.umd.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/header@2.7.0/dist/bundle.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/list@1.8.0/dist/bundle.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/quote@2.5.0/dist/bundle.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/image@2.8.1/dist/bundle.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/embed@2.5.3/dist/bundle.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/table@2.2.2/dist/table.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/code@2.8.0/dist/bundle.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/raw@2.4.0/dist/bundle.js\"></script>\n    <script src=\"https://cdn.jsdelivr.net/npm/@editorjs/delimiter@1.3.0/dist/bundle.js\"></script>\n</head>\n<body>\n    <!-- Login Modal -->\n    <div id=\"login-modal\" class=\"modal active\">\n        <div class=\"modal-content\">\n            <h2>Admin Login</h2>\n            <form id=\"login-form\">\n                <div class=\"form-group\">\n                    <label for=\"password\">Password:</label>\n                    <input type=\"password\" id=\"password\" name=\"password\" required>\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\">Login</button>\n            </form>\n            <div id=\"login-error\" class=\"error-message\"></div>\n        </div>\n    </div>\n\n    <!-- Admin Interface -->\n    <div id=\"admin-interface\" class=\"admin-interface\">\n        <header class=\"admin-header\">\n            <div class=\"admin-nav\">\n                <div class=\"admin-brand\">\n                    <h1>jonsson.io</h1>\n                    <span class=\"admin-badge\">Admin</span>\n                </div>\n                \n                <nav class=\"admin-navigation\" id=\"admin-navigation\">\n                    <button id=\"posts-nav-btn\" class=\"nav-item\" data-section=\"posts\" data-order=\"1\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z\"/>\n                        </svg>\n                        <span>Posts</span>\n                    </button>\n                    \n                    <button id=\"gallery-nav-btn\" class=\"nav-item\" data-section=\"gallery\" data-order=\"2\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\"/>\n                        </svg>\n                        <span>Gallery</span>\n                    </button>\n                    \n                    <button id=\"about-nav-btn\" class=\"nav-item\" data-section=\"about\" data-order=\"3\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z\"/>\n                        </svg>\n                        <span>About</span>\n                    </button>\n                    \n                    <button id=\"themes-nav-btn\" class=\"nav-item\" data-section=\"themes\" data-order=\"4\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z\"/>\n                        </svg>\n                        <span>Themes</span>\n                    </button>\n                    \n                    <button id=\"images-nav-btn\" class=\"nav-item\" data-section=\"images\" data-order=\"5\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z\"/>\n                        </svg>\n                        <span>Library</span>\n                    </button>\n                    \n                    <button id=\"social-nav-btn\" class=\"nav-item\" data-section=\"social\" data-order=\"6\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z\"/>\n                        </svg>\n                        <span>Social Links</span>\n                    </button>\n                    \n                    <button id=\"bucket-nav-btn\" class=\"nav-item\" data-section=\"bucket\" data-order=\"7\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z\"/>\n                        </svg>\n                        <span>S3 Import</span>\n                    </button>\n                </nav>\n                \n                <div class=\"admin-actions\">\n                    <button id=\"new-post-btn\" class=\"action-btn primary\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/>\n                        </svg>\n                        <span>New Post</span>\n                    </button>\n                    \n                    <button id=\"logout-btn\" class=\"action-btn secondary\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z\"/>\n                        </svg>\n                        <span>Logout</span>\n                    </button>\n                </div>\n            </div>\n        </header>\n\n        <main class=\"admin-main\">\n            <div class=\"admin-content\">\n                <!-- Posts List -->\n                <section id=\"posts-section\" class=\"admin-section active\">\n                    <div class=\"section-header\">\n                        <h2>Posts</h2>\n                        <div class=\"section-actions\">\n                            <input type=\"search\" id=\"posts-search\" placeholder=\"Search posts...\" class=\"search-input\">\n                        </div>\n                    </div>\n                    <div id=\"posts-list\" class=\"posts-list\">\n                        <div class=\"loading\">Loading posts...</div>\n                    </div>\n                </section>\n\n                <!-- Gallery Management -->\n                <section id=\"gallery-section\" class=\"admin-section\">\n                    <div class=\"section-header\">\n                        <h2>Homepage Gallery</h2>\n                        <div class=\"section-actions\">\n                            <button id=\"add-to-gallery-btn\" class=\"btn btn-primary\">Add Images to Gallery</button>\n                        </div>\n                    </div>\n                    <div id=\"gallery-list\" class=\"gallery-admin-list\">\n                        <div class=\"loading\">Loading gallery...</div>\n                    </div>\n                </section>\n\n                <!-- About Page Management -->\n                <section id=\"about-section\" class=\"admin-section\">\n                    <div class=\"section-header\">\n                        <h2>About Page</h2>\n                        <div class=\"section-actions\">\n                            <button id=\"save-about-btn\" class=\"btn btn-primary\">Save Changes</button>\n                        </div>\n                    </div>\n                    <div id=\"about-form\" class=\"about-form\">\n                        <div class=\"loading\">Loading about page...</div>\n                    </div>\n                </section>\n\n                <!-- Theme Management -->\n                <section id=\"themes-section\" class=\"admin-section\">\n                    <div class=\"section-header\">\n                        <h2>Website Themes</h2>\n                        <div class=\"section-actions\">\n                            <button id=\"save-theme-btn\" class=\"btn btn-primary\">Apply Selected Theme</button>\n                        </div>\n                    </div>\n                    <div class=\"themes-container\">\n                        <p class=\"themes-description\">Choose a theme to customize the look and feel of your website. Changes will be applied immediately after saving.</p>\n                        \n                        <div class=\"theme-preview-grid\" id=\"theme-preview-grid\">\n                            <!-- Theme cards will be populated by JavaScript -->\n                        </div>\n                    </div>\n                </section>\n\n                <!-- Image Library Management -->\n                <section id=\"images-section\" class=\"admin-section\">\n                    <div class=\"section-header\">\n                        <h2>Image Library</h2>\n                        <div class=\"section-actions\">\n                            <input type=\"search\" id=\"images-search\" placeholder=\"Search by filename, camera, lens, or EXIF data...\" class=\"search-input\">\n                            <button id=\"migrate-images-btn\" class=\"btn btn-outline\">Organize Files</button>\n                            <button id=\"update-exif-btn\" class=\"btn btn-outline\">Update EXIF Data</button>\n                            <button id=\"upload-images-btn\" class=\"btn btn-primary\">Upload Images</button>\n                        </div>\n                    </div>\n                    <div id=\"images-list\" class=\"gallery-admin-list\">\n                        <div class=\"loading\">Loading images...</div>\n                    </div>\n                </section>\n\n                <!-- Social Links Management -->\n                <section id=\"social-section\" class=\"admin-section\">\n                    <div class=\"section-header\">\n                        <h2>Social Media Links</h2>\n                        <div class=\"section-actions\">\n                            <button id=\"add-social-link-btn\" class=\"btn btn-primary\">\n                                <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                    <path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/>\n                                </svg>\n                                Add Link\n                            </button>\n                        </div>\n                    </div>\n                    \n                    <div class=\"social-links-container\">\n                        <div id=\"social-links-list\" class=\"social-links-list\">\n                            <div class=\"loading\">Loading social links...</div>\n                        </div>\n                    </div>\n                </section>\n\n                <!-- S3 Bucket Import -->\n                <section id=\"bucket-section\" class=\"admin-section\">\n                    <div class=\"section-header\">\n                        <h2>S3 Bucket Browser</h2>\n                        <div class=\"section-actions\">\n                            <input type=\"search\" id=\"bucket-search\" placeholder=\"Filter files...\" class=\"search-input\" style=\"margin-right: 0.5rem;\">\n                            <select id=\"file-type-filter\" class=\"btn btn-outline\" style=\"margin-right: 0.5rem;\">\n                                <option value=\"all\">All Files</option>\n                                <option value=\"images\">Images Only</option>\n                                <option value=\"new-images\">New Images</option>\n                            </select>\n                            <button id=\"test-b2-btn\" class=\"btn btn-secondary\" style=\"margin-right: 0.5rem;\">Test B2</button>\n                            <button id=\"refresh-bucket-btn\" class=\"btn btn-outline\">Refresh</button>\n                            <button id=\"import-selected-btn\" class=\"btn btn-primary\" style=\"display: none;\">Import Selected</button>\n                        </div>\n                    </div>\n                    \n                    <!-- Breadcrumb Navigation -->\n                    <div class=\"bucket-breadcrumb\" id=\"bucket-breadcrumb\" style=\"margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; font-size: 0.9rem;\">\n                        <span style=\"color: #666;\">Path:</span> <span id=\"current-path\">/</span>\n                    </div>\n                    \n                    <!-- File Stats -->\n                    <div class=\"bucket-stats\" id=\"bucket-stats\" style=\"margin-bottom: 1rem; font-size: 0.85rem; color: #666;\">\n                        <span id=\"file-count\">0 files</span> • \n                        <span id=\"selected-count\">0 selected</span> • \n                        <span id=\"import-ready-count\">0 can be imported</span>\n                    </div>\n                    \n                    <div id=\"bucket-list\" class=\"gallery-admin-list\">\n                        <div class=\"loading\">Click \"Refresh\" to browse your S3 bucket...</div>\n                    </div>\n                </section>\n\n                <!-- Post Editor -->\n                <section id=\"editor-section\" class=\"admin-section\">\n                    <div class=\"section-header\">\n                        <h2 id=\"editor-title\">New Post</h2>\n                        <div class=\"section-actions\">\n                            <button id=\"save-post-btn\" class=\"btn btn-primary\">Save</button>\n                            <button id=\"cancel-edit-btn\" class=\"btn btn-secondary\">Cancel</button>\n                        </div>\n                    </div>\n                    <form id=\"post-form\" class=\"post-form\">\n                        <!-- Sidebar: Meta Data -->\n                        <div class=\"post-form-sidebar\">\n                            <!-- Publish Status -->\n                            <div class=\"post-form-header\">\n                                <div class=\"form-group\">\n                                    <label for=\"post-published\">Publish Status</label>\n                                    <div style=\"display: flex; align-items: center; gap: 0.5rem; margin-top: 0.375rem;\">\n                                        <input type=\"checkbox\" id=\"post-published\" name=\"published\">\n                                        <span style=\"font-size: 0.875rem; color: #4a5568; font-weight: 500;\">Published</span>\n                                    </div>\n                                    <div class=\"content-help\" style=\"margin-top: 0.5rem;\">\n                                        <small style=\"color: #718096;\">Check to make this post visible to visitors</small>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <!-- URL Slug -->\n                            <div class=\"post-form-meta\">\n                                <div class=\"form-group\">\n                                    <label for=\"post-slug\">URL Slug</label>\n                                    <div class=\"slug-section\">\n                                        <input type=\"text\" id=\"post-slug\" name=\"slug\" readonly style=\"width: 100%;\">\n                                        <button type=\"button\" id=\"edit-slug-btn\" class=\"btn btn-outline btn-small\">Edit</button>\n                                        <button type=\"button\" id=\"regenerate-slug-btn\" class=\"btn btn-outline btn-small\" style=\"display: none;\">Update</button>\n                                        <button type=\"button\" id=\"cancel-slug-btn\" class=\"btn btn-secondary btn-small\" style=\"display: none;\">Cancel</button>\n                                    </div>\n                                    <div class=\"content-help\" style=\"margin-top: 0.5rem;\">\n                                        <small style=\"color: #e53e3e;\">⚠️ Changing URL breaks existing links</small>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <!-- Featured Image -->\n                            <div class=\"post-form-meta\">\n                                <div class=\"form-group\">\n                                    <label>Featured Image</label>\n                                    <div id=\"featured-image-preview\" class=\"featured-image-preview-sidebar\">\n                                        <div class=\"featured-image-placeholder\">\n                                            <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                                <path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\"/>\n                                            </svg>\n                                        </div>\n                                    </div>\n                                    <div class=\"featured-image-actions-sidebar\">\n                                        <button type=\"button\" id=\"select-featured-btn\" class=\"btn btn-outline btn-small\" style=\"width: 100%;\">Select Image</button>\n                                        <button type=\"button\" id=\"remove-featured-btn\" class=\"btn btn-secondary btn-small\" style=\"display: none; width: 100%;\">Remove Image</button>\n                                    </div>\n                                    <input type=\"hidden\" id=\"featured-image-id\" name=\"featured_image_id\">\n                                </div>\n                            </div>\n\n                            <!-- AI Writing Assistant -->\n                            <div class=\"post-form-meta\">\n                                <div id=\"ai-assistant\" class=\"ai-assistant-sidebar\">\n                                    <div class=\"ai-header\">\n                                        <div class=\"ai-title\">\n                                            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                                <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\"/>\n                                            </svg>\n                                            <span>AI Assistant</span>\n                                        </div>\n                                        <button type=\"button\" id=\"ai-toggle\" class=\"ai-toggle\" title=\"Toggle AI Assistant\">\n                                            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                                <path d=\"M7 10l5 5 5-5z\"/>\n                                            </svg>\n                                        </button>\n                                    </div>\n                                    \n                                    <div id=\"ai-content\" class=\"ai-content\" style=\"display: none;\">\n                                        <!-- AI Mode Selection -->\n                                        <div class=\"ai-section\">\n                                            <label class=\"ai-section-label\">Writing Mode</label>\n                                            <div class=\"ai-modes\">\n                                                <button type=\"button\" class=\"ai-mode-btn active\" data-mode=\"story\">Story</button>\n                                                <button type=\"button\" class=\"ai-mode-btn\" data-mode=\"technical\">Technical</button>\n                                            </div>\n                                        </div>\n                                        \n                                        <!-- AI Actions -->\n                                        <div class=\"ai-section\">\n                                            <label class=\"ai-section-label\">AI Actions</label>\n                                            <div class=\"ai-actions\">\n                                                <button type=\"button\" id=\"ai-describe-images\" class=\"ai-action-btn\">\n                                                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                                        <path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\"/>\n                                                    </svg>\n                                                    Describe Images\n                                                </button>\n                                                <button type=\"button\" id=\"ai-exif-story\" class=\"ai-action-btn\">\n                                                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                                        <path d=\"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\"/>\n                                                    </svg>\n                                                    EXIF Story\n                                                </button>\n                                                <button type=\"button\" id=\"ai-improve-text\" class=\"ai-action-btn\">\n                                                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                                        <path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\n                                                    </svg>\n                                                    Improve Text\n                                                </button>\n                                                <button type=\"button\" id=\"ai-expand-content\" class=\"ai-action-btn\">\n                                                    <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                                        <path d=\"M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-2V2c0-.55-.45-1-1-1s-1 .45-1 1v2H9V2c0-.55-.45-1-1-1s-1 .45-1 1v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z\"/>\n                                                    </svg>\n                                                    Expand Content\n                                                </button>\n                                            </div>\n                                        </div>\n                                        \n                                        <!-- AI Loading -->\n                                        <div id=\"ai-loading\" class=\"ai-loading\" style=\"display: none;\">\n                                            <div class=\"ai-loading-dots\">\n                                                <div class=\"dot\"></div>\n                                                <div class=\"dot\"></div>\n                                                <div class=\"dot\"></div>\n                                            </div>\n                                            <p>AI is thinking...</p>\n                                        </div>\n                                        \n                                        <!-- AI Response -->\n                                        <div id=\"ai-response\" class=\"ai-response\">\n                                            <div class=\"ai-placeholder\">\n                                                <p><strong>💡 AI Writing Tips:</strong></p>\n                                                <ul>\n                                                    <li><strong>Describe Images:</strong> Generate captions based on your photos</li>\n                                                    <li><strong>EXIF Story:</strong> Create stories from camera metadata</li>\n                                                    <li><strong>Improve Text:</strong> Enhance existing content</li>\n                                                    <li><strong>Expand Content:</strong> Add more detail to your writing</li>\n                                                </ul>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        \n                        <!-- Main Content Area -->\n                        <div class=\"post-form-main\">\n                            <!-- Title -->\n                            <div class=\"post-form-title\">\n                                <div class=\"form-group\" style=\"margin-bottom: 0;\">\n                                    <label for=\"post-title\">Post Title</label>\n                                    <input type=\"text\" id=\"post-title\" name=\"title\" required placeholder=\"Enter your post title...\" style=\"font-size: 1.125rem; font-weight: 600;\">\n                                </div>\n                            </div>\n\n                            <!-- Content Editor -->\n                            <div class=\"post-form-content\">\n                                <div class=\"form-group\">\n                                    <label for=\"post-content\">Post Content</label>\n                                    <div id=\"post-content\" class=\"editorjs-editor\"></div>\n                                </div>\n                                <textarea id=\"post-content-hidden\" name=\"content\" style=\"display: none;\"></textarea>\n                                <div class=\"content-help\">\n                                    <small style=\"color: #718096;\">💡 Tip: Start writing and use \"/\" to see available blocks. Add headers, lists, quotes, images, and more!</small>\n                                </div>\n                            </div>\n                        </div>\n                    </form>\n                </section>\n            </div>\n        </main>\n    </div>\n\n    <!-- File Manager Modal -->\n    <div id=\"file-manager-modal\" class=\"modal\">\n        <div class=\"modal-content file-manager-content\">\n            <div class=\"modal-header\">\n                <h2 id=\"file-manager-title\">Browse Image Library</h2>\n                <button class=\"modal-close\" id=\"file-manager-close\">&times;</button>\n            </div>\n            \n            <div class=\"file-manager-toolbar\">\n                <div class=\"file-manager-actions\">\n                    <button id=\"select-mode-btn\" class=\"btn btn-small btn-primary\">Select Images</button>\n                    <button id=\"manage-mode-btn\" class=\"btn btn-small btn-secondary\">Manage Files</button>\n                </div>\n                <div class=\"file-manager-search\">\n                    <input type=\"search\" id=\"image-search\" placeholder=\"Search images...\" class=\"search-input\">\n                </div>\n            </div>\n            \n            <div class=\"file-manager-grid\" id=\"file-manager-grid\">\n                <div class=\"loading\">Loading images...</div>\n            </div>\n            \n            <div class=\"file-manager-footer\">\n                <div class=\"selected-count\">\n                    <span id=\"selected-count\">0 selected</span>\n                </div>\n                <div class=\"file-manager-buttons\">\n                    <button id=\"select-images-btn\" class=\"btn btn-primary\" style=\"display: none;\">Add Selected</button>\n                    <button id=\"delete-selected-btn\" class=\"btn btn-danger\" style=\"display: none;\">Delete Selected</button>\n                    <button id=\"cancel-file-manager-btn\" class=\"btn btn-secondary\">Cancel</button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Social Links Modal -->\n    <div id=\"social-link-modal\" class=\"modal\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <h2 id=\"social-link-modal-title\">Add Social Link</h2>\n                <button class=\"modal-close\" id=\"social-link-modal-close\">&times;</button>\n            </div>\n            \n            <form id=\"social-link-form\" class=\"form\">\n                <div class=\"form-group\">\n                    <label for=\"social-platform\">Platform:</label>\n                    <input type=\"text\" id=\"social-platform\" placeholder=\"e.g., instagram, twitter, linkedin\" required>\n                </div>\n                \n                <div class=\"form-group\">\n                    <label for=\"social-label\">Label:</label>\n                    <input type=\"text\" id=\"social-label\" placeholder=\"e.g., Instagram, Twitter, LinkedIn\" required>\n                </div>\n                \n                <div class=\"form-group\">\n                    <label for=\"social-url\">URL:</label>\n                    <input type=\"url\" id=\"social-url\" placeholder=\"https://...\" required>\n                </div>\n                \n                <div class=\"form-group\">\n                    <label for=\"social-icon-picker\">Icon:</label>\n                    <div class=\"icon-picker-container\">\n                        <div class=\"selected-icon-preview\" id=\"selected-icon-preview\">\n                            <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                <path d=\"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z\"/>\n                            </svg>\n                        </div>\n                        <button type=\"button\" id=\"icon-picker-btn\" class=\"btn btn-outline\">Choose Icon</button>\n                    </div>\n                    <input type=\"hidden\" id=\"social-icon-svg\" name=\"icon_svg\">\n                    <small class=\"form-help\">Click \"Choose Icon\" to select from available icons or auto-detect based on platform.</small>\n                </div>\n                \n                <div class=\"form-group\">\n                    <label for=\"social-sort-order\">Sort Order:</label>\n                    <input type=\"number\" id=\"social-sort-order\" min=\"0\" value=\"0\">\n                </div>\n                \n                <div class=\"form-group\">\n                    <label class=\"checkbox-label\">\n                        <input type=\"checkbox\" id=\"social-visible\" checked>\n                        <span>Visible on website</span>\n                    </label>\n                </div>\n                \n                <div class=\"modal-actions\">\n                    <button type=\"submit\" class=\"btn btn-primary\">Save Link</button>\n                    <button type=\"button\" id=\"cancel-social-link-btn\" class=\"btn btn-secondary\">Cancel</button>\n                </div>\n            </form>\n        </div>\n    </div>\n\n    <!-- Icon Picker Modal -->\n    <div id=\"icon-picker-modal\" class=\"modal\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <h2>Choose an Icon</h2>\n                <button class=\"modal-close\" id=\"icon-picker-modal-close\">&times;</button>\n            </div>\n            \n            <div class=\"icon-picker-grid\" id=\"icon-picker-grid\">\n                <!-- Icons will be populated by JavaScript -->\n            </div>\n            \n            <div class=\"modal-actions\">\n                <button type=\"button\" id=\"cancel-icon-picker-btn\" class=\"btn btn-secondary\">Cancel</button>\n            </div>\n        </div>\n    </div>\n\n    <!-- Hidden file input for bulk uploads -->\n    <input type=\"file\" id=\"bulk-upload-input\" multiple accept=\"image/*\" style=\"display: none;\">\n\n    <script src=\"/static/js/admin.js\"></script>\n</body>\n</html>",
  "/static/css/admin.css": "/* Admin styles */\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    line-height: 1.6;\n    color: #333;\n    background-color: #f8f9fa;\n}\n\n/* Modal */\n.modal {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, 0.5);\n    display: none;\n    justify-content: center;\n    align-items: center;\n    z-index: 1000;\n}\n\n.modal.active {\n    display: flex;\n}\n\n.modal-content {\n    background: white;\n    padding: 2rem;\n    border-radius: 8px;\n    width: 100%;\n    max-width: 400px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);\n}\n\n.image-selection-options {\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    margin-top: 1.5rem;\n}\n\n/* Icon Picker Styles */\n.icon-picker-container {\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n}\n\n.selected-icon-preview {\n    width: 48px;\n    height: 48px;\n    border: 2px solid #e0e6ed;\n    border-radius: 8px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: #f8f9fa;\n    color: #4a5568;\n}\n\n.icon-picker-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));\n    gap: 0.5rem;\n    padding: 1rem 0;\n    max-height: 400px;\n    overflow-y: auto;\n}\n\n.icon-option {\n    width: 60px;\n    height: 60px;\n    border: 2px solid #e0e6ed;\n    border-radius: 8px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: #f8f9fa;\n    color: #4a5568;\n    cursor: pointer;\n    transition: all 0.2s ease;\n    flex-direction: column;\n    gap: 0.25rem;\n    padding: 0.5rem;\n}\n\n.icon-option:hover {\n    border-color: #007bff;\n    background: #e3f2fd;\n    color: #007bff;\n}\n\n.icon-option.selected {\n    border-color: #007bff;\n    background: #007bff;\n    color: white;\n}\n\n.icon-option svg {\n    width: 24px;\n    height: 24px;\n}\n\n.icon-option-label {\n    font-size: 0.7rem;\n    font-weight: 500;\n    text-align: center;\n    line-height: 1;\n}\n\n.btn-large {\n    padding: 1rem 1.5rem;\n    font-size: 1rem;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 0.5rem;\n}\n\n.modal-content h2 {\n    margin-bottom: 1.5rem;\n    text-align: center;\n    color: #333;\n}\n\n/* Admin Interface */\n.admin-interface {\n    display: none;\n    min-height: 100vh;\n}\n\n.admin-interface.active {\n    display: block;\n}\n\n.admin-header {\n    background: white;\n    border-bottom: 1px solid #e9ecef;\n    padding: 1rem 0;\n    position: sticky;\n    top: 0;\n    z-index: 100;\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n}\n\n.admin-nav {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 0 2rem;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 2rem;\n}\n\n/* Admin Brand */\n.admin-brand {\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n    flex-shrink: 0;\n}\n\n.admin-brand h1 {\n    font-size: 1.5rem;\n    font-weight: 600;\n    color: #333;\n    margin: 0;\n}\n\n.admin-badge {\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    padding: 0.25rem 0.75rem;\n    border-radius: 12px;\n    font-size: 0.75rem;\n    font-weight: 500;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n\n/* Admin Navigation */\n.admin-navigation {\n    display: flex;\n    gap: 0.5rem;\n    align-items: center;\n    flex: 1;\n    justify-content: center;\n}\n\n.nav-item {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    padding: 0.75rem 1rem;\n    border: 1px solid #e9ecef;\n    background: white;\n    color: #495057;\n    border-radius: 8px;\n    font-size: 0.9rem;\n    font-weight: 500;\n    cursor: pointer;\n    transition: all 0.2s ease;\n    text-decoration: none;\n    min-width: 0;\n    position: relative;\n}\n\n.nav-item:hover {\n    background: #f8f9fa;\n    border-color: #007bff;\n    color: #007bff;\n    transform: translateY(-1px);\n    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);\n}\n\n.nav-item.btn-primary {\n    background: #007bff;\n    color: white;\n    border-color: #007bff;\n}\n\n.nav-item.btn-primary:hover {\n    background: #0056b3;\n    border-color: #0056b3;\n    color: white;\n}\n\n.nav-item svg {\n    flex-shrink: 0;\n    width: 16px;\n    height: 16px;\n}\n\n.nav-item span {\n    white-space: nowrap;\n}\n\n/* Drag and Drop States */\n.nav-item.dragging {\n    opacity: 0.5 !important;\n    transform: rotate(2deg);\n    z-index: 1000;\n}\n\n.nav-placeholder {\n    border: 2px dashed #007bff !important;\n    background: #f8f9fa !important;\n    opacity: 0.7;\n    color: #007bff;\n}\n\n.nav-item[draggable=\"true\"] {\n    cursor: grab;\n}\n\n.nav-item[draggable=\"true\"]:active {\n    cursor: grabbing;\n}\n\n/* Admin Actions */\n.admin-actions {\n    display: flex;\n    gap: 0.75rem;\n    align-items: center;\n    flex-shrink: 0;\n}\n\n.action-btn {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    padding: 0.75rem 1rem;\n    border: none;\n    border-radius: 8px;\n    font-size: 0.9rem;\n    font-weight: 500;\n    cursor: pointer;\n    transition: all 0.2s ease;\n    text-decoration: none;\n    min-width: 0;\n}\n\n.action-btn.primary {\n    background: #007bff;\n    color: white;\n}\n\n.action-btn.primary:hover {\n    background: #0056b3;\n    transform: translateY(-1px);\n    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);\n}\n\n.action-btn.secondary {\n    background: #6c757d;\n    color: white;\n}\n\n.action-btn.secondary:hover {\n    background: #545b62;\n    transform: translateY(-1px);\n    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.25);\n}\n\n.action-btn svg {\n    flex-shrink: 0;\n    width: 16px;\n    height: 16px;\n}\n\n.action-btn span {\n    white-space: nowrap;\n}\n\n.nav-actions {\n    display: flex;\n    gap: 1rem;\n}\n\n.admin-main {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 2rem;\n}\n\n/* Sections */\n.admin-section {\n    display: none;\n}\n\n.admin-section.active {\n    display: block;\n}\n\n.section-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    margin-bottom: 2rem;\n    padding-bottom: 1rem;\n    border-bottom: 1px solid #e9ecef;\n}\n\n.section-header h2 {\n    font-size: 1.75rem;\n    font-weight: 500;\n    color: #333;\n}\n\n.section-actions {\n    display: flex;\n    gap: 1rem;\n    align-items: center;\n}\n\n/* Forms */\n.form-group {\n    margin-bottom: 1rem;\n}\n\n.form-row {\n    display: grid;\n    grid-template-columns: 1fr auto auto;\n    gap: 1.5rem;\n    align-items: end;\n    margin-bottom: 1rem;\n}\n\n.form-group label {\n    display: block;\n    margin-bottom: 0.375rem;\n    font-weight: 500;\n    color: #4a5568;\n    font-size: 0.875rem;\n}\n\n.form-group input,\n.form-group textarea {\n    width: 100%;\n    padding: 0.75rem;\n    border: 1px solid #e2e8f0;\n    border-radius: 8px;\n    font-size: 0.9rem;\n    transition: all 0.2s ease;\n    background: white;\n}\n\n.form-group input:focus,\n.form-group textarea:focus {\n    outline: none;\n    border-color: #007bff;\n    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);\n    transform: translateY(-1px);\n}\n\n.form-group input[type=\"checkbox\"] {\n    width: auto;\n    margin-top: 0.5rem;\n    transform: scale(1.2);\n    accent-color: #007bff;\n}\n\n/* Compact Post Form Layout */\n.post-form {\n    display: grid;\n    grid-template-columns: 1fr 300px;\n    gap: 2rem;\n    align-items: start;\n}\n\n.post-form-sidebar {\n    display: grid;\n    gap: 1.5rem;\n    order: 2;\n}\n\n.post-form-header {\n    background: white;\n    padding: 1.5rem;\n    border-radius: 12px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n    border: 1px solid #e2e8f0;\n}\n\n.post-form-meta {\n    display: grid;\n    gap: 1.5rem;\n    background: white;\n    padding: 1.5rem;\n    border-radius: 12px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n    border: 1px solid #e2e8f0;\n}\n\n.post-form-main {\n    display: grid;\n    gap: 1.5rem;\n    order: 1;\n}\n\n.post-form-title {\n    background: white;\n    padding: 1.5rem;\n    border-radius: 12px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n    border: 1px solid #e2e8f0;\n}\n\n.post-form-content {\n    background: white;\n    padding: 1.5rem;\n    border-radius: 12px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n    border: 1px solid #e2e8f0;\n}\n\n/* Buttons */\n.btn {\n    display: inline-block;\n    padding: 0.75rem 1.5rem;\n    font-size: 0.9rem;\n    font-weight: 500;\n    text-decoration: none;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: all 0.2s ease;\n}\n\n.btn-primary {\n    background: #007bff;\n    color: white;\n}\n\n.btn-primary:hover {\n    background: #0056b3;\n}\n\n.btn-secondary {\n    background: #6c757d;\n    color: white;\n}\n\n.btn-secondary:hover {\n    background: #545b62;\n}\n\n.btn-outline {\n    background: transparent;\n    color: #007bff;\n    border: 1px solid #007bff;\n}\n\n.btn-outline:hover {\n    background: #007bff;\n    color: white;\n}\n\n.btn-danger {\n    background: #dc3545;\n    color: white;\n}\n\n.btn-danger:hover {\n    background: #c82333;\n}\n\n/* Posts List */\n.posts-list {\n    display: grid;\n    gap: 1.5rem;\n    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));\n    max-width: 100%;\n}\n\n.post-item {\n    background: white;\n    border-radius: 12px;\n    padding: 1.5rem;\n    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n    border: 1px solid #f1f3f4;\n    transition: all 0.3s ease;\n    position: relative;\n    overflow: hidden;\n    height: fit-content;\n}\n\n.post-item::before {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 4px;\n    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);\n    opacity: 0;\n    transition: opacity 0.3s ease;\n}\n\n.post-item:hover {\n    transform: translateY(-4px);\n    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n}\n\n.post-item:hover::before {\n    opacity: 1;\n}\n\n.post-item-content {\n    display: flex;\n    gap: 1rem;\n    align-items: flex-start;\n}\n\n.post-thumbnail {\n    width: 80px;\n    height: 80px;\n    border-radius: 8px;\n    overflow: hidden;\n    background: #f7fafc;\n    border: 2px solid #e2e8f0;\n    flex-shrink: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.post-thumbnail img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n}\n\n.post-thumbnail-placeholder {\n    color: #a0aec0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n}\n\n.post-thumbnail-placeholder svg {\n    width: 32px;\n    height: 32px;\n    opacity: 0.4;\n}\n\n.post-item-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    margin-bottom: 1rem;\n    gap: 1rem;\n    flex: 1;\n}\n\n.post-info {\n    flex: 1;\n    min-width: 0;\n}\n\n.post-info h3 {\n    font-size: 1.25rem;\n    font-weight: 600;\n    margin-bottom: 0.5rem;\n    color: #2d3748;\n    line-height: 1.3;\n    word-wrap: break-word;\n}\n\n.post-meta {\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n    font-size: 0.875rem;\n    color: #718096;\n    margin-bottom: 0.75rem;\n    flex-wrap: wrap;\n}\n\n.post-meta-item {\n    display: flex;\n    align-items: center;\n    gap: 0.25rem;\n}\n\n.post-meta-item svg {\n    width: 14px;\n    height: 14px;\n    opacity: 0.7;\n}\n\n.post-status {\n    display: inline-flex;\n    align-items: center;\n    gap: 0.375rem;\n    padding: 0.375rem 0.875rem;\n    font-size: 0.8rem;\n    font-weight: 600;\n    border-radius: 20px;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    border: 2px solid;\n}\n\n.post-status.published {\n    background: #f0fff4;\n    color: #22543d;\n    border-color: #9ae6b4;\n}\n\n.post-status.published::before {\n    content: '●';\n    color: #48bb78;\n}\n\n.post-status.draft {\n    background: #fffbf0;\n    color: #744210;\n    border-color: #fbd38d;\n}\n\n.post-status.draft::before {\n    content: '●';\n    color: #ed8936;\n}\n\n.post-preview {\n    color: #4a5568;\n    font-size: 0.9rem;\n    line-height: 1.5;\n    margin: 0.75rem 0 0 0;\n    padding: 0.75rem;\n    background: #f8fafc;\n    border-radius: 6px;\n    border-left: 3px solid #cbd5e0;\n    font-style: normal;\n    max-width: 100%;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    display: -webkit-box;\n    -webkit-line-clamp: 3;\n    -webkit-box-orient: vertical;\n}\n\n.post-actions {\n    display: flex;\n    gap: 0.75rem;\n    align-self: flex-start;\n    flex-shrink: 0;\n}\n\n.post-actions .btn {\n    display: flex;\n    align-items: center;\n    gap: 0.375rem;\n    padding: 0.5rem 1rem;\n    font-size: 0.875rem;\n    font-weight: 500;\n    border-radius: 8px;\n    transition: all 0.2s ease;\n    min-width: auto;\n    white-space: nowrap;\n}\n\n.post-actions .btn svg {\n    width: 14px;\n    height: 14px;\n}\n\n.post-actions .btn-outline {\n    background: #f7fafc;\n    color: #4a5568;\n    border: 1px solid #e2e8f0;\n}\n\n.post-actions .btn-outline:hover {\n    background: #007bff;\n    color: white;\n    border-color: #007bff;\n    transform: translateY(-1px);\n    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);\n}\n\n.post-actions .btn-danger {\n    background: #fed7d7;\n    color: #c53030;\n    border: 1px solid #feb2b2;\n}\n\n.post-actions .btn-danger:hover {\n    background: #dc3545;\n    color: white;\n    border-color: #dc3545;\n    transform: translateY(-1px);\n    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.25);\n}\n\n.btn-small {\n    padding: 0.5rem 1rem;\n    font-size: 0.8rem;\n}\n\n/* Search */\n.search-input {\n    padding: 0.5rem 1rem;\n    border: 1px solid #ddd;\n    border-radius: 20px;\n    font-size: 0.9rem;\n    width: 250px;\n}\n\n/* Image Upload */\n.image-upload-area {\n    border: 2px dashed #ddd;\n    border-radius: 8px;\n    padding: 2rem;\n    text-align: center;\n    transition: border-color 0.2s ease;\n}\n\n.image-upload-area:hover {\n    border-color: #007bff;\n}\n\n.image-preview {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 1rem;\n    margin-top: 1rem;\n}\n\n.image-preview-item {\n    position: relative;\n    width: 150px;\n    height: 150px;\n    border-radius: 8px;\n    overflow: hidden;\n    background: #f8f9fa;\n}\n\n.image-preview-item img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n}\n\n.image-preview-item .remove-btn {\n    position: absolute;\n    top: 0.5rem;\n    right: 0.5rem;\n    background: rgba(220, 53, 69, 0.9);\n    color: white;\n    border: none;\n    border-radius: 50%;\n    width: 24px;\n    height: 24px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 12px;\n}\n\n/* Loading states */\n.loading {\n    text-align: center;\n    padding: 3rem;\n    color: #666;\n}\n\n.spinner {\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    border: 2px solid #f3f3f3;\n    border-top: 2px solid #007bff;\n    border-radius: 50%;\n    animation: spin 1s linear infinite;\n    margin-right: 0.5rem;\n}\n\n@keyframes spin {\n    0% { transform: rotate(0deg); }\n    100% { transform: rotate(360deg); }\n}\n\n/* Sidebar AI Assistant */\n.ai-assistant-sidebar {\n    background: white;\n    border-radius: 12px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n    border: 1px solid #e2e8f0;\n    overflow: hidden;\n}\n\n.ai-assistant-sidebar .ai-header {\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    padding: 0.75rem 1rem;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n\n.ai-assistant-sidebar .ai-title {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    font-weight: 600;\n    font-size: 0.85rem;\n}\n\n.ai-assistant-sidebar .ai-toggle {\n    background: rgba(255, 255, 255, 0.2);\n    border: none;\n    color: white;\n    padding: 0.25rem;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: background-color 0.2s;\n}\n\n.ai-assistant-sidebar .ai-toggle:hover {\n    background: rgba(255, 255, 255, 0.3);\n}\n\n.ai-assistant-sidebar .ai-content {\n    padding: 1rem;\n    max-height: 400px;\n    overflow-y: auto;\n}\n\n.ai-section {\n    margin-bottom: 1rem;\n}\n\n.ai-section:last-child {\n    margin-bottom: 0;\n}\n\n.ai-section-label {\n    display: block;\n    font-size: 0.75rem;\n    font-weight: 600;\n    color: #4a5568;\n    margin-bottom: 0.5rem;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n\n.ai-assistant-sidebar .ai-modes {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 0.25rem;\n}\n\n.ai-assistant-sidebar .ai-mode-btn {\n    background: #f7fafc;\n    border: 1px solid #e2e8f0;\n    padding: 0.375rem 0.5rem;\n    border-radius: 4px;\n    font-size: 0.75rem;\n    cursor: pointer;\n    transition: all 0.2s;\n    color: #4a5568;\n    font-weight: 500;\n}\n\n.ai-assistant-sidebar .ai-mode-btn.active,\n.ai-assistant-sidebar .ai-mode-btn:hover {\n    background: #667eea;\n    color: white;\n    border-color: #667eea;\n}\n\n.ai-assistant-sidebar .ai-actions {\n    display: grid;\n    gap: 0.25rem;\n}\n\n.ai-assistant-sidebar .ai-action-btn {\n    background: #f7fafc;\n    border: 1px solid #e2e8f0;\n    padding: 0.5rem;\n    border-radius: 4px;\n    display: flex;\n    align-items: center;\n    gap: 0.375rem;\n    cursor: pointer;\n    transition: all 0.2s;\n    color: #4a5568;\n    font-size: 0.75rem;\n    font-weight: 500;\n    text-align: left;\n}\n\n.ai-assistant-sidebar .ai-action-btn:hover {\n    background: #edf2f7;\n    border-color: #cbd5e0;\n}\n\n.ai-assistant-sidebar .ai-action-btn:disabled {\n    opacity: 0.5;\n    cursor: not-allowed;\n}\n\n.ai-assistant-sidebar .ai-response {\n    background: #f7fafc;\n    border: 1px solid #e2e8f0;\n    border-radius: 4px;\n    padding: 0.75rem;\n    min-height: 100px;\n    max-height: 200px;\n    overflow-y: auto;\n    font-size: 0.8rem;\n    line-height: 1.4;\n}\n\n.ai-assistant-sidebar .ai-placeholder {\n    color: #718096;\n    text-align: center;\n}\n\n.ai-assistant-sidebar .ai-placeholder p {\n    margin-bottom: 0.5rem;\n    font-weight: 500;\n}\n\n.ai-assistant-sidebar .ai-placeholder ul {\n    text-align: left;\n    font-size: 0.75rem;\n    margin: 0;\n    padding-left: 1rem;\n}\n\n.ai-assistant-sidebar .ai-placeholder li {\n    margin-bottom: 0.25rem;\n}\n\n.ai-assistant-sidebar .ai-loading {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 1rem;\n    color: #718096;\n}\n\n.ai-assistant-sidebar .ai-loading-dots {\n    display: flex;\n    gap: 0.25rem;\n    margin-bottom: 0.5rem;\n}\n\n.ai-assistant-sidebar .ai-loading-dots .dot {\n    width: 6px;\n    height: 6px;\n    border-radius: 50%;\n    background: #667eea;\n    animation: ai-loading-pulse 1.4s infinite;\n}\n\n.ai-assistant-sidebar .ai-loading p {\n    font-size: 0.75rem;\n    margin: 0;\n}\n\n/* Rich Text Editor - EditorJS */\n.editorjs-editor {\n    border: 1px solid #ddd;\n    border-radius: 8px;\n    background: white;\n    min-height: 400px;\n}\n\n.codex-editor {\n    border: none !important;\n}\n\n/* AI Assistant Panel */\n.ai-assistant {\n    background: white;\n    border: 1px solid #ddd;\n    border-radius: 8px;\n    display: flex;\n    flex-direction: column;\n    max-height: 600px;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n\n.ai-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem;\n    border-bottom: 1px solid #eee;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    border-radius: 8px 8px 0 0;\n}\n\n.ai-title {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    font-weight: 600;\n    font-size: 0.9rem;\n}\n\n.ai-toggle {\n    background: rgba(255, 255, 255, 0.2);\n    border: none;\n    color: white;\n    padding: 0.5rem;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: background-color 0.2s;\n}\n\n.ai-toggle:hover {\n    background: rgba(255, 255, 255, 0.3);\n}\n\n.ai-content {\n    padding: 1rem;\n    flex: 1;\n    overflow-y: auto;\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n}\n\n/* AI Modes */\n.ai-modes {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 0.5rem;\n}\n\n.ai-mode-btn {\n    background: #f8f9fa;\n    border: 1px solid #ddd;\n    padding: 0.5rem;\n    border-radius: 4px;\n    font-size: 0.8rem;\n    cursor: pointer;\n    transition: all 0.2s;\n    color: #666;\n}\n\n.ai-mode-btn.active,\n.ai-mode-btn:hover {\n    background: #007bff;\n    color: white;\n    border-color: #007bff;\n}\n\n/* AI Actions */\n.ai-actions {\n    display: flex;\n    flex-direction: column;\n    gap: 0.5rem;\n}\n\n.ai-action-btn {\n    background: #f8f9fa;\n    border: 1px solid #ddd;\n    padding: 0.75rem;\n    border-radius: 4px;\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n    cursor: pointer;\n    transition: all 0.2s;\n    color: #333;\n    font-size: 0.9rem;\n    text-align: left;\n}\n\n.ai-action-btn:hover {\n    background: #e9ecef;\n    border-color: #007bff;\n}\n\n.ai-action-btn:disabled {\n    opacity: 0.5;\n    cursor: not-allowed;\n}\n\n/* AI Response Area */\n.ai-response {\n    background: #f8f9fa;\n    border: 1px solid #ddd;\n    border-radius: 4px;\n    padding: 1rem;\n    min-height: 150px;\n    max-height: 300px;\n    overflow-y: auto;\n    flex: 1;\n}\n\n.ai-placeholder {\n    color: #666;\n    text-align: center;\n}\n\n.ai-placeholder ul {\n    text-align: left;\n    margin-top: 1rem;\n    font-size: 0.85rem;\n}\n\n.ai-placeholder li {\n    margin-bottom: 0.5rem;\n}\n\n/* AI Loading Animation */\n.ai-loading {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 2rem;\n    color: #666;\n}\n\n.ai-loading-dots {\n    display: flex;\n    gap: 0.5rem;\n    margin-bottom: 1rem;\n}\n\n.ai-loading-dots .dot {\n    width: 8px;\n    height: 8px;\n    border-radius: 50%;\n    background: #007bff;\n    animation: ai-loading-pulse 1.4s infinite;\n}\n\n.ai-loading-dots .dot:nth-child(2) {\n    animation-delay: 0.2s;\n}\n\n.ai-loading-dots .dot:nth-child(3) {\n    animation-delay: 0.4s;\n}\n\n@keyframes ai-loading-pulse {\n    0%, 80%, 100% {\n        opacity: 0.3;\n        transform: scale(0.8);\n    }\n    40% {\n        opacity: 1;\n        transform: scale(1);\n    }\n}\n\n/* AI Response Content */\n.ai-generated-content {\n    background: white;\n    border: 1px solid #007bff;\n    border-radius: 4px;\n    padding: 1rem;\n    margin-bottom: 1rem;\n}\n\n.ai-generated-content h4 {\n    color: #007bff;\n    margin-bottom: 0.5rem;\n    font-size: 0.9rem;\n}\n\n.ai-insert-btn {\n    background: #007bff;\n    color: white;\n    border: none;\n    padding: 0.5rem 1rem;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 0.8rem;\n    margin-top: 0.5rem;\n}\n\n.ai-insert-btn:hover {\n    background: #0056b3;\n}\n\n/* Responsive */\n@media (max-width: 1200px) {\n    .editor-with-ai {\n        grid-template-columns: 1fr;\n        gap: 1rem;\n    }\n    \n    .ai-assistant {\n        max-height: 400px;\n    }\n}\n\n.codex-editor__redactor {\n    padding: 1rem !important;\n}\n\n.ce-block__content {\n    max-width: none !important;\n}\n\n.ce-toolbar__content {\n    max-width: none !important;\n}\n\n.ce-popover {\n    z-index: 1100 !important;\n}\n\n.ce-inline-toolbar {\n    z-index: 1100 !important;\n}\n\n.ce-conversion-toolbar {\n    z-index: 1100 !important;\n}\n\n.ce-settings {\n    z-index: 1100 !important;\n}\n\n.ql-toolbar {\n    border-bottom: 1px solid #ddd;\n    border-radius: 4px 4px 0 0;\n}\n\n.ql-container {\n    border-radius: 0 0 4px 4px;\n    font-size: 14px;\n    line-height: 1.6;\n}\n\n.ql-editor {\n    min-height: 250px;\n    padding: 1rem;\n}\n\n.ql-editor.ql-blank::before {\n    color: #999;\n    font-style: normal;\n}\n\n/* Custom Quill styles for better integration */\n.ql-toolbar.ql-snow {\n    border-top: none;\n    border-left: none;\n    border-right: none;\n    padding: 0.75rem 1rem;\n}\n\n.ql-container.ql-snow {\n    border-bottom: none;\n    border-left: none;\n    border-right: none;\n}\n\n.ql-tooltip {\n    z-index: 1100;\n}\n\n/* Featured Image Section */\n.featured-image-section {\n    border: 1px solid #ddd;\n    border-radius: 8px;\n    padding: 1.5rem;\n    background: #f8f9fa;\n}\n\n.featured-image-preview {\n    width: 200px;\n    height: 150px;\n    border-radius: 8px;\n    overflow: hidden;\n    margin-bottom: 1rem;\n    border: 2px dashed #ddd;\n    background: white;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.featured-image-preview img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n}\n\n.featured-image-placeholder {\n    text-align: center;\n    color: #666;\n}\n\n.featured-image-placeholder svg {\n    margin-bottom: 0.5rem;\n    opacity: 0.5;\n}\n\n.featured-image-placeholder p {\n    font-size: 0.9rem;\n    margin: 0;\n}\n\n.featured-image-actions {\n    display: flex;\n    gap: 0.5rem;\n}\n\n.content-help {\n    margin-top: 0.5rem;\n}\n\n.content-help small {\n    color: #666;\n    font-style: italic;\n}\n\n.file-management-actions {\n    display: flex;\n    gap: 0.5rem;\n}\n\n.file-management-actions .btn {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n}\n\n/* File Manager Modal */\n.file-manager-content {\n    width: 90vw;\n    max-width: 1000px;\n    height: 80vh;\n    max-height: 800px;\n    display: flex;\n    flex-direction: column;\n}\n\n.modal-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem 1.5rem;\n    border-bottom: 1px solid #e9ecef;\n}\n\n.modal-header h2 {\n    margin: 0;\n    font-size: 1.25rem;\n}\n\n.modal-close {\n    background: none;\n    border: none;\n    font-size: 1.5rem;\n    cursor: pointer;\n    padding: 0.25rem;\n    color: #666;\n    line-height: 1;\n}\n\n.modal-close:hover {\n    color: #333;\n}\n\n.file-manager-toolbar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem 1.5rem;\n    border-bottom: 1px solid #e9ecef;\n    gap: 1rem;\n}\n\n.file-manager-actions {\n    display: flex;\n    gap: 0.5rem;\n}\n\n.file-manager-search {\n    flex: 1;\n    max-width: 300px;\n}\n\n.file-manager-grid {\n    flex: 1;\n    padding: 1.5rem;\n    overflow-y: auto;\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\n    gap: 1rem;\n    align-content: start;\n}\n\n.file-item {\n    position: relative;\n    border-radius: 8px;\n    overflow: hidden;\n    background: #f8f9fa;\n    cursor: pointer;\n    transition: all 0.2s ease;\n    border: 2px solid transparent;\n}\n\n.file-item:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n\n.file-item.selected {\n    border-color: #007bff;\n    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n\n.file-item.delete-mode {\n    border-color: #dc3545;\n}\n\n.file-item.delete-mode.selected {\n    border-color: #dc3545;\n    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);\n}\n\n.file-item img {\n    width: 100%;\n    height: 120px;\n    object-fit: cover;\n}\n\n.file-item-info {\n    padding: 0.75rem;\n    font-size: 0.8rem;\n}\n\n.file-item-name {\n    font-weight: 500;\n    color: #333;\n    margin-bottom: 0.25rem;\n    word-break: break-word;\n}\n\n.file-item-meta {\n    color: #666;\n    font-size: 0.75rem;\n}\n\n.file-item-checkbox {\n    position: absolute;\n    top: 0.5rem;\n    right: 0.5rem;\n    width: 20px;\n    height: 20px;\n    accent-color: #007bff;\n}\n\n.file-item-delete {\n    position: absolute;\n    top: 0.5rem;\n    right: 0.5rem;\n    background: #dc3545;\n    color: white;\n    border: none;\n    border-radius: 50%;\n    width: 24px;\n    height: 24px;\n    cursor: pointer;\n    display: none;\n    align-items: center;\n    justify-content: center;\n    font-size: 12px;\n}\n\n.file-item.delete-mode .file-item-delete {\n    display: flex;\n}\n\n.file-manager-footer {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem 1.5rem;\n    border-top: 1px solid #e9ecef;\n    background: #f8f9fa;\n}\n\n.selected-count {\n    font-size: 0.9rem;\n    color: #666;\n}\n\n.file-manager-buttons {\n    display: flex;\n    gap: 0.5rem;\n}\n\n/* Error messages */\n.error-message {\n    color: #dc3545;\n    font-size: 0.9rem;\n    margin-top: 0.5rem;\n}\n\n.success-message {\n    color: #28a745;\n    font-size: 0.9rem;\n    margin-top: 0.5rem;\n}\n\n/* Gallery Management */\n.gallery-management-section {\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  padding: 1.5rem;\n  background: #f8f9fa;\n}\n\n.post-gallery-preview {\n  min-height: 150px;\n  border: 2px dashed #ddd;\n  border-radius: 8px;\n  background: white;\n  margin-bottom: 1rem;\n  position: relative;\n}\n\n.gallery-placeholder {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 150px;\n  text-align: center;\n  color: #666;\n}\n\n.gallery-placeholder svg {\n  margin-bottom: 0.5rem;\n  opacity: 0.5;\n}\n\n.gallery-placeholder p {\n  font-weight: 500;\n  margin-bottom: 0.25rem;\n}\n\n.gallery-placeholder small {\n  font-style: italic;\n  opacity: 0.8;\n}\n\n.gallery-preview-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 0.75rem;\n  padding: 1rem;\n  min-height: 150px;\n}\n\n.gallery-preview-item {\n  position: relative;\n  aspect-ratio: 1;\n  border-radius: 6px;\n  overflow: hidden;\n  background: #f0f0f0;\n  cursor: move;\n  transition: transform 0.2s ease;\n}\n\n.gallery-preview-item:hover {\n  transform: scale(1.02);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n\n.gallery-preview-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.gallery-preview-item .remove-gallery-item {\n  position: absolute;\n  top: 0.25rem;\n  right: 0.25rem;\n  background: rgba(220, 53, 69, 0.9);\n  color: white;\n  border: none;\n  border-radius: 50%;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 10px;\n  font-weight: bold;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n\n.gallery-preview-item:hover .remove-gallery-item {\n  opacity: 1;\n}\n\n.gallery-preview-item .gallery-item-handle {\n  position: absolute;\n  bottom: 0.25rem;\n  left: 0.25rem;\n  background: rgba(0, 0, 0, 0.7);\n  color: white;\n  border: none;\n  border-radius: 3px;\n  width: 20px;\n  height: 20px;\n  cursor: move;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 10px;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n\n.gallery-preview-item:hover .gallery-item-handle {\n  opacity: 1;\n}\n\n.gallery-actions {\n  display: flex;\n  gap: 0.5rem;\n  justify-content: flex-start;\n}\n\n/* Dynamic Masonry Gallery Styles for Posts */\n.post-masonry-gallery {\n  margin: 2rem 0;\n}\n\n.post-masonry-gallery h3 {\n  text-align: center;\n  margin-bottom: 1.5rem;\n  font-size: 1.5rem;\n  color: var(--color-text);\n}\n\n.masonry-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n  grid-auto-rows: 10px;\n  gap: 1rem;\n  padding: 0;\n}\n\n.masonry-item {\n  position: relative;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n  cursor: pointer;\n  transition: var(--transition);\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);\n}\n\n.masonry-item:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);\n}\n\n.masonry-item img {\n  width: 100%;\n  height: auto;\n  display: block;\n  transition: var(--transition);\n}\n\n.masonry-item:hover img {\n  transform: scale(1.03);\n}\n\n/* Dynamic grid item sizing based on aspect ratio */\n.masonry-item.portrait {\n  grid-row-end: span 40;\n}\n\n.masonry-item.landscape {\n  grid-row-end: span 25;\n}\n\n.masonry-item.square {\n  grid-row-end: span 30;\n}\n\n.masonry-item.panorama {\n  grid-row-end: span 20;\n}\n\n/* Responsive masonry */\n@media (max-width: 1200px) {\n  .masonry-grid {\n    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  }\n}\n\n@media (max-width: 768px) {\n  .masonry-grid {\n    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\n    gap: 0.5rem;\n  }\n  \n  .masonry-item.portrait {\n    grid-row-end: span 35;\n  }\n  \n  .masonry-item.landscape {\n    grid-row-end: span 20;\n  }\n  \n  .masonry-item.square {\n    grid-row-end: span 25;\n  }\n  \n  .masonry-item.panorama {\n    grid-row-end: span 15;\n  }\n}\n\n@media (max-width: 480px) {\n  .masonry-grid {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n\n/* Gallery Admin */\n.gallery-admin-list {\n  background: white;\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.gallery-admin-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 0;\n}\n\n.gallery-admin-item {\n  display: grid;\n  grid-template-columns: 120px 1fr auto;\n  gap: 1rem;\n  padding: 1rem;\n  border-bottom: 1px solid #e9ecef;\n  align-items: center;\n  transition: background-color 0.2s ease;\n}\n\n.gallery-admin-item:last-child {\n  border-bottom: none;\n}\n\n.gallery-admin-item:hover {\n  background-color: #f8f9fa;\n}\n\n.gallery-admin-image {\n  width: 120px;\n  height: 80px;\n  border-radius: 6px;\n  overflow: hidden;\n  background: #f0f0f0;\n}\n\n.gallery-admin-image img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.gallery-admin-info h3 {\n  font-size: 1rem;\n  font-weight: 500;\n  margin-bottom: 0.25rem;\n  color: #333;\n}\n\n.gallery-admin-description {\n  font-size: 0.85rem;\n  color: #666;\n  margin-bottom: 0.25rem;\n  line-height: 1.4;\n}\n\n.gallery-admin-meta {\n  font-size: 0.75rem;\n  color: #999;\n}\n\n.hidden-badge {\n  background: #ffc107;\n  color: #856404;\n  padding: 0.125rem 0.375rem;\n  border-radius: 3px;\n  font-weight: 500;\n}\n\n.gallery-admin-actions {\n  display: flex;\n  gap: 0.25rem;\n  flex-wrap: wrap;\n}\n\n.gallery-admin-actions .btn {\n  white-space: nowrap;\n}\n\n/* EXIF Modal */\n.exif-modal-content {\n  max-width: 600px;\n  max-height: 80vh;\n  overflow-y: auto;\n}\n\n.exif-content {\n  padding: 1rem 0;\n}\n\n.exif-section {\n  margin-bottom: 1.5rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid #e9ecef;\n}\n\n.exif-section:last-child {\n  border-bottom: none;\n  margin-bottom: 0;\n}\n\n.exif-section h3 {\n  font-size: 1.1rem;\n  font-weight: 600;\n  margin-bottom: 0.75rem;\n  color: #007bff;\n}\n\n.exif-section p {\n  margin-bottom: 0.5rem;\n  font-size: 0.9rem;\n  line-height: 1.4;\n}\n\n.exif-section strong {\n  color: #333;\n  font-weight: 500;\n  min-width: 120px;\n  display: inline-block;\n}\n\n.exif-section a {\n  color: #007bff;\n  text-decoration: none;\n}\n\n.exif-section a:hover {\n  text-decoration: underline;\n}\n\n/* Navigation Active States */\n.nav-actions .btn.btn-primary {\n  background: #007bff;\n  color: white;\n  border-color: #007bff;\n}\n\n.nav-actions .btn.btn-outline {\n  background: transparent;\n  color: #007bff;\n  border-color: #007bff;\n}\n\n.nav-actions .btn.btn-outline:hover {\n  background: #007bff;\n  color: white;\n}\n\n/* Responsive */\n@media (max-width: 1024px) {\n    .admin-navigation {\n        gap: 0.25rem;\n    }\n    \n    .nav-item {\n        padding: 0.5rem 0.75rem;\n        font-size: 0.85rem;\n    }\n    \n    .nav-item span {\n        display: none;\n    }\n    \n    .action-btn {\n        padding: 0.5rem 0.75rem;\n        font-size: 0.85rem;\n    }\n    \n    .action-btn span {\n        display: none;\n    }\n}\n\n@media (max-width: 768px) {\n    .admin-nav {\n        flex-direction: column;\n        gap: 1rem;\n        padding: 0 1rem;\n    }\n    \n    .admin-brand {\n        align-self: flex-start;\n    }\n    \n    .admin-navigation {\n        justify-content: flex-start;\n        overflow-x: auto;\n        padding: 0.5rem 0;\n        gap: 0.5rem;\n    }\n    \n    .nav-item span {\n        display: inline;\n    }\n    \n    .admin-actions {\n        align-self: flex-end;\n    }\n    \n    .action-btn span {\n        display: inline;\n    }\n    \n    .admin-main {\n        padding: 1rem;\n    }\n    \n    .section-header {\n        flex-direction: column;\n        align-items: flex-start;\n        gap: 1rem;\n    }\n    \n    .post-form {\n        grid-template-columns: 1fr;\n        gap: 1.5rem;\n    }\n    \n    .post-form-sidebar {\n        order: 2;\n    }\n    \n    .post-form-main {\n        order: 1;\n    }\n    \n    .featured-image-preview-sidebar {\n        height: 120px;\n    }\n    \n    .search-input {\n        width: 100%;\n    }\n    \n    .posts-list {\n        grid-template-columns: 1fr;\n    }\n    \n    .post-item-content {\n        flex-direction: column;\n        align-items: center;\n        text-align: center;\n    }\n    \n    .post-thumbnail {\n        width: 120px;\n        height: 120px;\n        margin-bottom: 1rem;\n    }\n    \n    .post-item-header {\n        flex-direction: column;\n        align-items: center;\n        text-align: center;\n        width: 100%;\n    }\n    \n    .post-actions {\n        width: 100%;\n        justify-content: center;\n        margin-top: 1rem;\n    }\n    \n    .gallery-admin-item {\n        grid-template-columns: 80px 1fr;\n        gap: 0.75rem;\n    }\n    \n    .gallery-admin-actions {\n        grid-column: 2;\n        margin-top: 0.5rem;\n        justify-content: flex-start;\n    }\n    \n    .gallery-admin-image {\n        width: 80px;\n        height: 60px;\n    }\n}\n\n/* Post Preview in Admin List */\n.post-preview {\n    color: #888;\n    font-size: 0.9rem;\n    line-height: 1.4;\n    margin-top: 0.5rem;\n    padding-top: 0.5rem;\n    border-top: 1px solid #333;\n}\n\n/* Slug Section */\n.slug-section {\n    display: flex;\n    gap: 0.5rem;\n    align-items: center;\n    flex-wrap: wrap;\n}\n\n.slug-section input {\n    flex: 1;\n    min-width: 200px;\n}\n\n.slug-section input[readonly] {\n    background-color: #f8f9fa;\n    color: #6c757d;\n    cursor: not-allowed;\n}\n\n.slug-section input:not([readonly]) {\n    background-color: white;\n    color: #333;\n}\n\n/* Compact Featured Image */\n.featured-image-compact {\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n}\n\n.featured-image-preview-compact {\n    width: 80px;\n    height: 80px;\n    border-radius: 8px;\n    overflow: hidden;\n    border: 2px dashed #e2e8f0;\n    background: #f7fafc;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n}\n\n.featured-image-preview-compact img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n}\n\n.featured-image-preview-compact .featured-image-placeholder {\n    text-align: center;\n    color: #a0aec0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n}\n\n.featured-image-actions-compact {\n    display: flex;\n    flex-direction: column;\n    gap: 0.5rem;\n}\n\n/* Sidebar Featured Image */\n.featured-image-preview-sidebar {\n    width: 100%;\n    height: 150px;\n    border-radius: 8px;\n    overflow: hidden;\n    border: 2px dashed #e2e8f0;\n    background: #f7fafc;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin-bottom: 1rem;\n}\n\n.featured-image-preview-sidebar img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n}\n\n.featured-image-preview-sidebar .featured-image-placeholder {\n    text-align: center;\n    color: #a0aec0;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: 0.5rem;\n}\n\n.featured-image-actions-sidebar {\n    display: flex;\n    flex-direction: column;\n    gap: 0.5rem;\n}\n\n/* Theme Management */\n.themes-container {\n    padding: 1.5rem;\n}\n\n.themes-description {\n    font-size: 1rem;\n    color: #666;\n    margin-bottom: 2rem;\n    text-align: center;\n}\n\n.theme-preview-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n    gap: 2rem;\n    max-width: 1200px;\n    margin: 0 auto;\n}\n\n.theme-card {\n    background: white;\n    border-radius: 12px;\n    padding: 1.5rem;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n    transition: all 0.3s ease;\n    cursor: pointer;\n    border: 3px solid transparent;\n    position: relative;\n    overflow: hidden;\n}\n\n.theme-card:hover {\n    transform: translateY(-4px);\n    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\n}\n\n.theme-card.selected {\n    border-color: #007cba;\n    box-shadow: 0 8px 25px rgba(0, 124, 186, 0.2);\n}\n\n.theme-card.selected::before {\n    content: \"✓\";\n    position: absolute;\n    top: 1rem;\n    right: 1rem;\n    width: 32px;\n    height: 32px;\n    background: #007cba;\n    color: white;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-weight: bold;\n    font-size: 16px;\n}\n\n.theme-header {\n    text-align: center;\n    margin-bottom: 1.5rem;\n}\n\n.theme-title {\n    font-size: 1.25rem;\n    font-weight: 600;\n    color: #2c3e50;\n    margin-bottom: 0.5rem;\n}\n\n.theme-description {\n    font-size: 0.9rem;\n    color: #7f8c8d;\n    line-height: 1.4;\n}\n\n.theme-preview {\n    border-radius: 8px;\n    overflow: hidden;\n    margin-bottom: 1rem;\n    position: relative;\n    min-height: 200px;\n    display: flex;\n    flex-direction: column;\n}\n\n.theme-navbar {\n    height: 60px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0 1.5rem;\n    font-size: 0.85rem;\n    font-weight: 500;\n}\n\n.theme-content {\n    flex: 1;\n    padding: 1.5rem;\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n}\n\n.theme-hero {\n    height: 80px;\n    border-radius: 6px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 0.8rem;\n    font-weight: 600;\n    color: white;\n    margin-bottom: 1rem;\n}\n\n.theme-cards {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 0.75rem;\n}\n\n.theme-mini-card {\n    height: 40px;\n    border-radius: 4px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 0.7rem;\n    font-weight: 500;\n}\n\n.theme-footer {\n    text-align: center;\n    padding: 1rem 0;\n    border-top: 1px solid rgba(255, 255, 255, 0.1);\n    font-size: 0.8rem;\n    opacity: 0.8;\n}\n\n/* Default Theme - Current Dark */\n.theme-default .theme-navbar {\n    background: #0a0a0a;\n    color: white;\n}\n\n.theme-default .theme-content {\n    background: #1a1a1a;\n    color: #ffffff;\n}\n\n.theme-default .theme-hero {\n    background: linear-gradient(135deg, #ff6b35, #ff8c61);\n}\n\n.theme-default .theme-mini-card {\n    background: #2d3748;\n    color: #ffffff;\n}\n\n/* Classic Theme */\n.theme-classic .theme-navbar {\n    background: #2c3e50;\n    color: white;\n}\n\n.theme-classic .theme-content {\n    background: #ecf0f1;\n    color: #2c3e50;\n}\n\n.theme-classic .theme-hero {\n    background: linear-gradient(135deg, #3498db, #2980b9);\n}\n\n.theme-classic .theme-mini-card {\n    background: white;\n    color: #2c3e50;\n    border: 1px solid #bdc3c7;\n}\n\n/* Dark Theme */\n.theme-dark .theme-navbar {\n    background: #1a1a1a;\n    color: white;\n}\n\n.theme-dark .theme-content {\n    background: #2d3748;\n    color: #e2e8f0;\n}\n\n.theme-dark .theme-hero {\n    background: linear-gradient(135deg, #4a5568, #2d3748);\n}\n\n.theme-dark .theme-mini-card {\n    background: #4a5568;\n    color: #e2e8f0;\n}\n\n/* Ocean Theme */\n.theme-ocean .theme-navbar {\n    background: #006494;\n    color: white;\n}\n\n.theme-ocean .theme-content {\n    background: #e8f4f8;\n    color: #2c5530;\n}\n\n.theme-ocean .theme-hero {\n    background: linear-gradient(135deg, #0077be, #006494);\n}\n\n.theme-ocean .theme-mini-card {\n    background: #b3e5fc;\n    color: #006494;\n    border: 1px solid #81d4fa;\n}\n\n/* Forest Theme */\n.theme-forest .theme-navbar {\n    background: #2d5016;\n    color: white;\n}\n\n.theme-forest .theme-content {\n    background: #f1f8e9;\n    color: #2d5016;\n}\n\n.theme-forest .theme-hero {\n    background: linear-gradient(135deg, #4caf50, #388e3c);\n}\n\n.theme-forest .theme-mini-card {\n    background: #c8e6c9;\n    color: #2d5016;\n    border: 1px solid #a5d6a7;\n}\n\n/* Sunset Theme */\n.theme-sunset .theme-navbar {\n    background: #d84315;\n    color: white;\n}\n\n.theme-sunset .theme-content {\n    background: #fff3e0;\n    color: #bf360c;\n}\n\n.theme-sunset .theme-hero {\n    background: linear-gradient(135deg, #ff9800, #f57c00);\n}\n\n.theme-sunset .theme-mini-card {\n    background: #ffcc80;\n    color: #e65100;\n    border: 1px solid #ffb74d;\n}\n\n/* Monochrome Theme */\n.theme-monochrome .theme-navbar {\n    background: #424242;\n    color: white;\n}\n\n.theme-monochrome .theme-content {\n    background: #fafafa;\n    color: #212121;\n}\n\n.theme-monochrome .theme-hero {\n    background: linear-gradient(135deg, #616161, #424242);\n}\n\n.theme-monochrome .theme-mini-card {\n    background: #f5f5f5;\n    color: #424242;\n    border: 1px solid #e0e0e0;\n}\n\n/* Leica Theme Preview */\n.theme-leica .theme-navbar {\n    background: linear-gradient(135deg, #fdfcfb, #f8f7f6);\n    color: #1a1a1a;\n    border-bottom: 1px solid #e60012;\n}\n\n.theme-leica .theme-content {\n    background: #fdfcfb;\n    color: #1a1a1a;\n}\n\n.theme-leica .theme-hero {\n    background: linear-gradient(135deg, #e60012, #b8000e);\n    color: white;\n    font-weight: 300;\n}\n\n.theme-leica .theme-mini-card {\n    background: #faf9f7;\n    color: #404040;\n    border: 1px solid #e8e6e4;\n}\n\n/* Solarized Light Theme */\n.theme-solarized-light .theme-navbar {\n    background: #fdf6e3;\n    color: #657b83;\n}\n\n.theme-solarized-light .theme-content {\n    background: #eee8d5;\n    color: #657b83;\n}\n\n.theme-solarized-light .theme-hero {\n    background: linear-gradient(135deg, #268bd2, #2aa198);\n}\n\n.theme-solarized-light .theme-mini-card {\n    background: #fdf6e3;\n    color: #657b83;\n    border: 1px solid #93a1a1;\n}\n\n/* Solarized Dark Theme */\n.theme-solarized-dark .theme-navbar {\n    background: #002b36;\n    color: #839496;\n}\n\n.theme-solarized-dark .theme-content {\n    background: #073642;\n    color: #839496;\n}\n\n.theme-solarized-dark .theme-hero {\n    background: linear-gradient(135deg, #268bd2, #6c71c4);\n}\n\n.theme-solarized-dark .theme-mini-card {\n    background: #586e75;\n    color: #839496;\n}\n\n@media (max-width: 768px) {\n    .theme-preview-grid {\n        grid-template-columns: 1fr;\n        gap: 1.5rem;\n    }\n    \n    .theme-cards {\n        grid-template-columns: 1fr;\n    }\n}",
  "/static/css/style.css": "/* Modern Photoblog Design */\n:root {\n  --color-bg: #0a0a0a;\n  --color-bg-secondary: #1a1a1a;\n  --color-text: #ffffff;\n  --color-text-secondary: #a8a8a8;\n  --color-accent: #ff6b35;\n  --color-accent-light: #ff8c61;\n  --color-border: #333333;\n  --font-primary: 'Space Grotesk', sans-serif;\n  --font-secondary: 'Crimson Text', serif;\n  --spacing-xs: 0.5rem;\n  --spacing-sm: 1rem;\n  --spacing-md: 2rem;\n  --spacing-lg: 4rem;\n  --spacing-xl: 6rem;\n  --border-radius: 8px;\n  --shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  scroll-behavior: smooth;\n}\n\nbody {\n  font-family: var(--font-primary);\n  background: var(--color-bg);\n  color: var(--color-text);\n  line-height: 1.6;\n  overflow-x: hidden;\n}\n\n/* Navigation Bar */\n.navbar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  background: rgba(10, 10, 10, 0.95);\n  backdrop-filter: blur(10px);\n  border-bottom: 1px solid var(--color-border);\n  z-index: 1000;\n  transition: var(--transition);\n}\n\n.nav-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 var(--spacing-md);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 70px;\n}\n\n.nav-brand a {\n  font-family: var(--font-secondary);\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: var(--color-text);\n  text-decoration: none;\n  transition: var(--transition);\n}\n\n.nav-brand a:hover {\n  color: var(--color-accent);\n}\n\n.nav-links {\n  display: flex;\n  gap: var(--spacing-md);\n  align-items: center;\n}\n\n.nav-links a {\n  color: var(--color-text-secondary);\n  text-decoration: none;\n  font-family: var(--font-primary);\n  font-weight: 500;\n  padding: 0.5rem 1rem;\n  border-radius: 20px;\n  transition: var(--transition);\n}\n\n.nav-links a:hover {\n  color: var(--color-accent);\n  background: rgba(255, 107, 53, 0.1);\n}\n\n/* Hero Section */\n.hero {\n  height: 70vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);\n  will-change: transform;\n}\n\n.hero-content {\n  text-align: center;\n  z-index: 2;\n}\n\n.hero-title {\n  font-size: clamp(2.5rem, 6vw, 6rem);\n  font-weight: 700;\n  margin-bottom: var(--spacing-sm);\n  line-height: 0.9;\n  letter-spacing: -0.02em;\n}\n\n.title-main {\n  display: block;\n  color: var(--color-text);\n}\n\n.title-accent {\n  display: block;\n  color: var(--color-accent);\n  font-style: italic;\n  font-family: var(--font-secondary);\n  font-weight: 400;\n}\n\n.hero-subtitle {\n  font-size: 1.1rem;\n  color: var(--color-text-secondary);\n  margin-bottom: var(--spacing-md);\n  font-weight: 300;\n}\n\n.hero-nav {\n  display: flex;\n  gap: var(--spacing-md);\n  justify-content: center;\n  margin-bottom: var(--spacing-md);\n}\n\n.nav-btn {\n  background: transparent;\n  border: 1px solid var(--color-border);\n  color: var(--color-text-secondary);\n  padding: 0.75rem 1.5rem;\n  border-radius: 50px;\n  font-family: var(--font-primary);\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: var(--transition);\n  position: relative;\n  overflow: hidden;\n}\n\n.nav-btn:before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);\n  transition: left 0.5s;\n}\n\n.nav-btn:hover:before {\n  left: 100%;\n}\n\n.nav-btn:hover,\n.nav-btn.active {\n  border-color: var(--color-accent);\n  color: var(--color-accent);\n  transform: translateY(-2px);\n}\n\n.hero-social {\n  display: flex;\n  gap: var(--spacing-md);\n  justify-content: center;\n}\n\n.social-link {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--color-text-secondary);\n  text-decoration: none;\n  font-size: 0.9rem;\n  transition: var(--transition);\n  padding: 0.5rem 1rem;\n  border-radius: var(--border-radius);\n}\n\n.social-link:hover {\n  color: var(--color-accent);\n  background: rgba(255, 107, 53, 0.1);\n}\n\n\n/* Main Content */\n.main {\n  padding: var(--spacing-xl) var(--spacing-md);\n  max-width: 1400px;\n  margin: 0 auto;\n}\n\n.content-section {\n  display: none;\n  margin-bottom: var(--spacing-xl);\n}\n\n.content-section.active {\n  display: block;\n}\n\n.section-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: var(--spacing-lg);\n  padding-bottom: var(--spacing-md);\n  border-bottom: 1px solid var(--color-border);\n}\n\n.section-header h2 {\n  font-size: 2.5rem;\n  font-weight: 600;\n  color: var(--color-text);\n}\n\n.section-subtitle {\n  color: var(--color-text-secondary);\n  font-style: italic;\n  font-family: var(--font-secondary);\n  margin-top: 0.5rem;\n}\n\n/* Gallery uses masonry layout only */\n\n/* Gallery */\n.gallery-container {\n  margin-top: var(--spacing-md);\n}\n\n.gallery {\n  display: grid;\n  gap: var(--spacing-md);\n}\n\n.gallery.masonry {\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  grid-auto-rows: auto;\n  align-items: start;\n}\n\n.gallery-item {\n  position: relative;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n  cursor: pointer;\n  transition: var(--transition);\n  background: var(--color-bg-secondary);\n  aspect-ratio: 4/3;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);\n}\n\n/* Remove the problematic row spanning rules\n.gallery-item:nth-child(3n) {\n  grid-row: span 2;\n}\n\n.gallery-item:nth-child(5n) {\n  grid-row: span 3;\n} */\n\n.gallery-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: var(--transition);\n}\n\n.gallery-item:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);\n}\n\n.gallery-item:hover img {\n  transform: scale(1.05);\n}\n\n.gallery-overlay {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));\n  color: white;\n  padding: var(--spacing-md);\n  transform: translateY(100%);\n  transition: var(--transition);\n}\n\n.gallery-item:hover .gallery-overlay {\n  transform: translateY(0);\n}\n\n.gallery-overlay h3 {\n  font-size: 1.1rem;\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n}\n\n.gallery-overlay p {\n  font-size: 0.9rem;\n  opacity: 0.9;\n  line-height: 1.4;\n}\n\n.gallery-overlay .exif-info {\n  font-size: 0.8rem;\n  opacity: 0.8;\n  margin-top: 0.5rem;\n  font-family: var(--font-primary);\n  font-weight: 400;\n}\n\n/* Stories Section */\n.stories-container {\n  display: grid;\n  gap: var(--spacing-lg);\n}\n\n.story-item {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: var(--spacing-lg);\n  align-items: center;\n  padding: var(--spacing-lg);\n  border-radius: var(--border-radius);\n  background: var(--color-bg-secondary);\n  transition: var(--transition);\n}\n\n.story-item:nth-child(even) {\n  direction: rtl;\n}\n\n.story-item:nth-child(even) > * {\n  direction: ltr;\n}\n\n.story-item:hover {\n  transform: translateY(-4px);\n  box-shadow: var(--shadow);\n}\n\n.story-content h3 {\n  font-size: 1.5rem;\n  margin-bottom: var(--spacing-sm);\n  color: var(--color-accent);\n}\n\n.story-content .story-meta {\n  color: var(--color-text-secondary);\n  font-size: 0.9rem;\n  margin-bottom: var(--spacing-sm);\n}\n\n.story-content p {\n  color: var(--color-text-secondary);\n  line-height: 1.6;\n}\n\n.story-image {\n  border-radius: var(--border-radius);\n  overflow: hidden;\n}\n\n.story-image img {\n  width: 100%;\n  height: 300px;\n  object-fit: cover;\n  transition: var(--transition);\n}\n\n.story-item:hover .story-image img {\n  transform: scale(1.05);\n}\n\n/* About Section */\n.about-container {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: var(--spacing-xl);\n  align-items: start;\n  max-width: 1000px;\n  margin: 0 auto;\n}\n\n.about-text h2 {\n  font-size: 2.5rem;\n  margin-bottom: var(--spacing-md);\n  color: var(--color-accent);\n}\n\n.about-content .lead {\n  font-size: 1.25rem;\n  font-family: var(--font-secondary);\n  font-style: italic;\n  color: var(--color-text);\n  margin-bottom: var(--spacing-md);\n  line-height: 1.5;\n}\n\n.about-content p {\n  color: var(--color-text-secondary);\n  margin-bottom: var(--spacing-md);\n  line-height: 1.7;\n}\n\n.about-stats {\n  display: flex;\n  gap: var(--spacing-lg);\n  margin-top: var(--spacing-lg);\n  padding-top: var(--spacing-md);\n  border-top: 1px solid var(--color-border);\n}\n\n.stat {\n  text-align: center;\n}\n\n.stat-number {\n  display: block;\n  font-size: 2rem;\n  font-weight: 700;\n  color: var(--color-accent);\n  line-height: 1;\n}\n\n.stat-label {\n  font-size: 0.9rem;\n  color: var(--color-text-secondary);\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n\n.about-image {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.image-placeholder {\n  width: 250px;\n  height: 250px;\n  border-radius: 50%;\n  background: var(--color-bg-secondary);\n  border: 2px dashed var(--color-border);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: var(--color-text-secondary);\n  text-align: center;\n}\n\n.image-placeholder svg {\n  margin-bottom: var(--spacing-sm);\n  opacity: 0.5;\n}\n\n/* Loading States */\n.gallery-loading {\n  grid-column: 1 / -1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: var(--spacing-xl);\n  text-align: center;\n}\n\n.loading-animation {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: var(--spacing-md);\n}\n\n.loading-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--color-accent);\n  animation: loading-pulse 1.5s infinite;\n}\n\n.loading-dot:nth-child(2) {\n  animation-delay: 0.2s;\n}\n\n.loading-dot:nth-child(3) {\n  animation-delay: 0.4s;\n}\n\n@keyframes loading-pulse {\n  0%, 80%, 100% { opacity: 0.3; }\n  40% { opacity: 1; }\n}\n\n/* Lightbox */\n.lightbox {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.95);\n  display: none;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n  backdrop-filter: blur(10px);\n}\n\n.lightbox.active {\n  display: flex;\n}\n\n.lightbox-content {\n  position: relative;\n  max-width: 90vw;\n  max-height: 90vh;\n  display: flex;\n  gap: var(--spacing-md);\n}\n\n.lightbox-content-simple {\n  position: relative;\n  max-width: 90vw;\n  max-height: 90vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.lightbox-image-container {\n  position: relative;\n  flex: 1;\n}\n\n.lightbox-camera-overlay {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));\n  color: white;\n  padding: var(--spacing-sm) var(--spacing-md);\n  border-radius: 0 0 var(--border-radius) var(--border-radius);\n  font-size: 0.9rem;\n  opacity: 0;\n  transition: var(--transition);\n}\n\n.lightbox-image-container:hover .lightbox-camera-overlay {\n  opacity: 1;\n}\n\n.camera-info {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n\n.camera-icon {\n  font-size: 1.1rem;\n}\n\n.camera-details {\n  line-height: 1.3;\n}\n\n.lightbox-image {\n  max-width: 100%;\n  max-height: 80vh;\n  width: auto;\n  height: auto;\n  object-fit: contain;\n  border-radius: var(--border-radius);\n}\n\n.lightbox-close {\n  position: absolute;\n  top: -50px;\n  right: 0;\n  background: none;\n  border: none;\n  color: white;\n  font-size: 2rem;\n  cursor: pointer;\n  padding: 0.5rem;\n  border-radius: 50%;\n  transition: var(--transition);\n}\n\n.lightbox-close:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n\n.lightbox-nav {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  pointer-events: none;\n}\n\n.lightbox-prev,\n.lightbox-next {\n  background: rgba(0, 0, 0, 0.5);\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  padding: 1rem;\n  cursor: pointer;\n  border-radius: 50%;\n  transition: var(--transition);\n  pointer-events: all;\n}\n\n.lightbox-prev:hover,\n.lightbox-next:hover {\n  background: rgba(0, 0, 0, 0.8);\n}\n\n.lightbox-info {\n  width: 300px;\n  padding: var(--spacing-md);\n  color: var(--color-text);\n  background: var(--color-bg-secondary);\n  border-radius: 8px;\n}\n\n.lightbox-title {\n  font-size: 1.5rem;\n  margin-bottom: var(--spacing-sm);\n  color: var(--color-accent);\n}\n\n.lightbox-description {\n  color: var(--color-text-secondary);\n  line-height: 1.6;\n  margin-bottom: var(--spacing-md);\n}\n\n.lightbox-meta {\n  font-size: 0.9rem;\n  color: var(--color-text-muted);\n  border-top: 1px solid var(--color-border);\n  padding-top: var(--spacing-sm);\n}\n\n.lightbox-exif {\n  margin-top: var(--spacing-md);\n}\n\n.exif-toggle {\n  background: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  color: var(--color-text);\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: var(--transition);\n  width: 100%;\n}\n\n.exif-toggle:hover {\n  background: var(--color-accent);\n  border-color: var(--color-accent);\n  color: var(--color-bg-secondary);\n}\n\n.exif-panel {\n  margin-top: var(--spacing-sm);\n  background: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  border-radius: 4px;\n  padding: var(--spacing-md);\n  max-height: 500px;\n  overflow-y: auto;\n}\n\n.exif-content {\n  font-size: 0.85rem;\n  line-height: 1.6;\n}\n\n.exif-section {\n  margin-bottom: var(--spacing-md);\n}\n\n.exif-section:last-child {\n  margin-bottom: 0;\n}\n\n.exif-section h4 {\n  color: var(--color-accent);\n  font-size: 0.9rem;\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n\n.exif-row {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 0.25rem;\n  padding: 0.25rem 0;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n.exif-row:last-child {\n  border-bottom: none;\n}\n\n.exif-label {\n  color: var(--color-text-secondary);\n  font-weight: 500;\n}\n\n.exif-value {\n  color: var(--color-text);\n  text-align: right;\n}\n\n/* Individual Post Page Styles */\n.main-content {\n  padding-top: 70px; /* Account for fixed navbar */\n}\n\n.post-container {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: var(--spacing-lg) var(--spacing-md);\n}\n\n.loading-state,\n.error-state {\n  text-align: center;\n  padding: var(--spacing-xl) var(--spacing-md);\n}\n\n.loading-spinner {\n  width: 40px;\n  height: 40px;\n  border: 3px solid var(--color-border);\n  border-top: 3px solid var(--color-accent);\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin: 0 auto var(--spacing-sm);\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.error-state h2 {\n  color: var(--color-accent);\n  margin-bottom: var(--spacing-sm);\n}\n\n.error-state p {\n  color: var(--color-text-secondary);\n  margin-bottom: var(--spacing-md);\n}\n\n.post-article {\n  animation: fadeIn 0.6s ease-out;\n}\n\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.post-header {\n  text-align: center;\n  margin-bottom: var(--spacing-lg);\n  padding-bottom: var(--spacing-md);\n  border-bottom: 1px solid var(--color-border);\n}\n\n.post-header h1 {\n  font-family: var(--font-secondary);\n  font-size: 3rem;\n  font-weight: 400;\n  line-height: 1.2;\n  margin-bottom: var(--spacing-sm);\n  color: var(--color-text);\n}\n\n.post-meta {\n  color: var(--color-text-secondary);\n  font-size: 0.9rem;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n\n.post-featured-image {\n  margin-bottom: var(--spacing-lg);\n  border-radius: var(--border-radius);\n  overflow: hidden;\n  box-shadow: var(--shadow);\n}\n\n.post-featured-image .featured-image {\n  width: 100%;\n  height: auto;\n  display: block;\n  transition: var(--transition);\n}\n\n.post-featured-image .featured-image:hover {\n  transform: scale(1.02);\n}\n\n.post-body {\n  font-family: var(--font-secondary);\n  font-size: 1.1rem;\n  line-height: 1.8;\n  color: var(--color-text);\n  margin-bottom: var(--spacing-lg);\n}\n\n.post-body h2,\n.post-body h3,\n.post-body h4 {\n  font-family: var(--font-primary);\n  margin: var(--spacing-lg) 0 var(--spacing-md) 0;\n  color: var(--color-text);\n}\n\n.post-body h2 {\n  font-size: 2rem;\n  border-bottom: 1px solid var(--color-border);\n  padding-bottom: var(--spacing-sm);\n}\n\n.post-body h3 {\n  font-size: 1.5rem;\n}\n\n.post-body p {\n  margin-bottom: var(--spacing-md);\n}\n\n.post-body img {\n  max-width: 100%;\n  height: auto;\n  border-radius: var(--border-radius);\n  margin: var(--spacing-md) 0;\n  cursor: pointer;\n  transition: var(--transition);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);\n}\n\n/* Override max-width for images with custom width styling */\n.post-body img[style*=\"width\"] {\n  max-width: none;\n}\n\n.post-body img:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n}\n\n.post-body blockquote {\n  border-left: 4px solid var(--color-accent);\n  padding-left: var(--spacing-md);\n  margin: var(--spacing-md) 0;\n  font-style: italic;\n  color: var(--color-text-secondary);\n}\n\n.post-body ul,\n.post-body ol {\n  margin: var(--spacing-md) 0;\n  padding-left: var(--spacing-md);\n}\n\n.post-body li {\n  margin-bottom: var(--spacing-xs);\n}\n\n.post-gallery {\n  margin-bottom: var(--spacing-lg);\n}\n\n.post-gallery h3 {\n  font-family: var(--font-primary);\n  font-size: 1.5rem;\n  margin-bottom: var(--spacing-md);\n  color: var(--color-text);\n  text-align: center;\n}\n\n.gallery-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: var(--spacing-md);\n}\n\n.gallery-item {\n  aspect-ratio: 4/3;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n  cursor: pointer;\n  transition: var(--transition);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);\n}\n\n.gallery-item:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);\n}\n\n.gallery-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: var(--transition);\n}\n\n.gallery-item:hover img {\n  transform: scale(1.05);\n}\n\n.post-footer {\n  text-align: center;\n  padding-top: var(--spacing-lg);\n  border-top: 1px solid var(--color-border);\n}\n\n.btn-secondary {\n  display: inline-block;\n  padding: var(--spacing-sm) var(--spacing-md);\n  background: transparent;\n  color: var(--color-text-secondary);\n  text-decoration: none;\n  border: 1px solid var(--color-border);\n  border-radius: var(--border-radius);\n  transition: var(--transition);\n  font-family: var(--font-primary);\n  font-weight: 500;\n}\n\n.btn-secondary:hover {\n  background: var(--color-border);\n  color: var(--color-text);\n  transform: translateY(-2px);\n}\n\n/* Responsive Design */\n@media (max-width: 768px) {\n  .hero {\n    height: 80vh;\n    padding: var(--spacing-md);\n    text-align: center;\n  }\n  \n  .hero-content {\n    width: 100%;\n    max-width: 100%;\n    padding: 0 var(--spacing-sm);\n  }\n  \n  .hero-nav {\n    flex-direction: column;\n    gap: var(--spacing-sm);\n    align-items: center;\n    width: 100%;\n  }\n  \n  .nav-btn {\n    width: 200px;\n    max-width: 90%;\n  }\n  \n  .hero-social {\n    flex-direction: column;\n    gap: var(--spacing-sm);\n    align-items: center;\n    width: 100%;\n  }\n  \n  .social-link {\n    justify-content: center;\n    width: 200px;\n    max-width: 90%;\n  }\n  \n  \n  .main {\n    padding: var(--spacing-md) var(--spacing-sm);\n  }\n  \n  .section-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: var(--spacing-sm);\n  }\n  \n  .gallery.masonry {\n    grid-template-columns: 1fr;\n  }\n  \n  .story-item {\n    grid-template-columns: 1fr;\n    text-align: center;\n  }\n  \n  .story-item:nth-child(even) {\n    direction: ltr;\n  }\n  \n  .about-container {\n    grid-template-columns: 1fr;\n    gap: var(--spacing-md);\n    text-align: center;\n  }\n  \n  .about-stats {\n    justify-content: center;\n    gap: var(--spacing-md);\n  }\n  \n  .lightbox-content {\n    flex-direction: column;\n    align-items: center;\n  }\n  \n  .lightbox-info {\n    width: 100%;\n    max-width: 400px;\n  }\n  \n  .nav-container {\n    padding: 0 var(--spacing-sm);\n  }\n  \n  .nav-links {\n    gap: var(--spacing-sm);\n  }\n  \n  .nav-links a {\n    padding: 0.4rem 0.8rem;\n    font-size: 0.9rem;\n  }\n  \n  .post-container {\n    padding: var(--spacing-md) var(--spacing-sm);\n  }\n  \n  .post-header h1 {\n    font-size: 2.2rem;\n  }\n  \n  .post-body {\n    font-size: 1rem;\n  }\n  \n  .gallery-grid {\n    grid-template-columns: 1fr;\n    gap: var(--spacing-sm);\n  }\n}\n\n@media (max-width: 480px) {\n  .hero {\n    height: 85vh;\n    padding: var(--spacing-sm);\n  }\n  \n  .hero-content {\n    padding: 0;\n  }\n  \n  .hero-title {\n    font-size: 3rem;\n    text-align: center;\n  }\n  \n  .hero-subtitle {\n    text-align: center;\n    margin-bottom: var(--spacing-lg);\n  }\n  \n  .nav-btn {\n    width: 180px;\n    max-width: 85%;\n    margin: 0 auto;\n  }\n  \n  .social-link {\n    width: 180px;\n    max-width: 85%;\n    margin: 0 auto;\n  }\n  \n  .gallery.masonry {\n    grid-template-columns: 1fr;\n    gap: var(--spacing-sm);\n  }\n  \n  .about-stats {\n    flex-direction: column;\n    gap: var(--spacing-sm);\n  }\n}\n\n/* Stories Grid Layout */\n.stories-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: var(--spacing-md);\n  padding: var(--spacing-md) 0;\n}\n\n/* Story images should preserve aspect ratio */\n.stories-grid .gallery-item {\n  position: relative;\n  background: var(--color-bg-secondary);\n  border-radius: var(--border-radius);\n  overflow: hidden;\n  cursor: pointer;\n  transition: var(--transition);\n  min-height: 200px;\n}\n\n.stories-grid .gallery-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain; /* Preserve aspect ratio instead of cropping */\n  background: var(--color-bg-secondary);\n}\n\n/* Story Cards (text-only posts) */\n.story-card {\n  background: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  border-radius: var(--border-radius);\n  padding: var(--spacing-md);\n  transition: var(--transition);\n  cursor: pointer;\n}\n\n.story-card:hover {\n  transform: translateY(-5px);\n  box-shadow: var(--shadow);\n  border-color: var(--color-accent);\n}\n\n.story-card-content h3 {\n  color: var(--color-text);\n  font-size: 1.4rem;\n  margin-bottom: var(--spacing-sm);\n  font-weight: 600;\n}\n\n.story-date {\n  color: var(--color-text-secondary);\n  font-size: 0.9rem;\n  margin-bottom: var(--spacing-sm);\n  font-style: italic;\n}\n\n.story-card-content p {\n  color: var(--color-text-secondary);\n  line-height: 1.6;\n  margin: 0;\n}\n\n/* Mixed stories layout responsive */\n@media (max-width: 768px) {\n  .stories-grid {\n    grid-template-columns: 1fr;\n    gap: var(--spacing-sm);\n    padding: var(--spacing-sm) 0;\n  }\n  \n  .story-card {\n    padding: var(--spacing-sm);\n  }\n}",
  "/static/css/theme-classic.css": "/* Classic Theme - Clean Blue */\n:root {\n  /* Background Colors */\n  --color-bg: #f8f9fa;\n  --color-bg-secondary: #ffffff;\n  --color-bg-tertiary: #e9ecef;\n  \n  /* Text Colors */\n  --color-text: #2c3e50;\n  --color-text-secondary: #6c757d;\n  --color-text-muted: #868e96;\n  \n  /* Accent Colors */\n  --color-accent: #3498db;\n  --color-accent-light: #5dade2;\n  --color-accent-dark: #2980b9;\n  \n  /* Border Colors */\n  --color-border: #dee2e6;\n  --color-border-light: #f1f3f4;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(248, 249, 250, 0.95);\n  --color-card-bg: #ffffff;\n  --color-overlay: rgba(44, 62, 80, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n  --shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.15);\n}",
  "/static/css/theme-dark.css": "/* Dark Theme */\n:root {\n  /* Background Colors */\n  --color-bg: #0a0a0a;\n  --color-bg-secondary: #1a1a1a;\n  --color-bg-tertiary: #2d3748;\n  \n  /* Text Colors */\n  --color-text: #ffffff;\n  --color-text-secondary: #a8a8a8;\n  --color-text-muted: #718096;\n  \n  /* Accent Colors */\n  --color-accent: #ff6b35;\n  --color-accent-light: #ff8c61;\n  --color-accent-dark: #e53e3e;\n  \n  /* Border Colors */\n  --color-border: #333333;\n  --color-border-light: #4a5568;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(10, 10, 10, 0.95);\n  --color-card-bg: #1a1a1a;\n  --color-overlay: rgba(0, 0, 0, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n  --shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.5);\n}",
  "/static/css/theme-default.css": "/* Default Theme - Current Dark Design */\n:root {\n  /* Background Colors */\n  --color-bg: #0a0a0a;\n  --color-bg-secondary: #1a1a1a;\n  --color-bg-tertiary: #2d3748;\n  \n  /* Text Colors */\n  --color-text: #ffffff;\n  --color-text-secondary: #a8a8a8;\n  --color-text-muted: #718096;\n  \n  /* Accent Colors */\n  --color-accent: #ff6b35;\n  --color-accent-light: #ff8c61;\n  --color-accent-dark: #e53e3e;\n  \n  /* Border Colors */\n  --color-border: #333333;\n  --color-border-light: #4a5568;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(10, 10, 10, 0.95);\n  --color-card-bg: #1a1a1a;\n  --color-overlay: rgba(0, 0, 0, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\n  --shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.5);\n}",
  "/static/css/theme-forest.css": "/* Forest Theme - Natural Greens */\n:root {\n  /* Background Colors */\n  --color-bg: #f1f8e9;\n  --color-bg-secondary: #ffffff;\n  --color-bg-tertiary: #c8e6c9;\n  \n  /* Text Colors */\n  --color-text: #1b5e20;\n  --color-text-secondary: #2e7d32;\n  --color-text-muted: #4caf50;\n  \n  /* Accent Colors */\n  --color-accent: #4caf50;\n  --color-accent-light: #66bb6a;\n  --color-accent-dark: #388e3c;\n  \n  /* Border Colors */\n  --color-border: #a5d6a7;\n  --color-border-light: #c8e6c9;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(241, 248, 233, 0.95);\n  --color-card-bg: #ffffff;\n  --color-overlay: rgba(27, 94, 32, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 4px 12px rgba(76, 175, 80, 0.2);\n  --shadow-hover: 0 8px 25px rgba(76, 175, 80, 0.3);\n}",
  "/static/css/theme-leica.css": "/* Leica Theme - Classic Camera Aesthetics with Signature Red */\n:root {\n  /* Background Colors - Clean whites and warm grays */\n  --color-bg: #fdfcfb;\n  --color-bg-secondary: #ffffff;\n  --color-bg-tertiary: #f8f7f6;\n  \n  /* Text Colors - Rich blacks and warm grays */\n  --color-text: #1a1a1a;\n  --color-text-secondary: #404040;\n  --color-text-muted: #707070;\n  \n  /* Accent Colors - Leica's signature red and supporting tones */\n  --color-accent: #e60012;\n  --color-accent-light: #ff1a2e;\n  --color-accent-dark: #b8000e;\n  \n  /* Border Colors - Subtle and refined */\n  --color-border: #e8e6e4;\n  --color-border-light: #f2f1f0;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(253, 252, 251, 0.95);\n  --color-card-bg: #ffffff;\n  --color-overlay: rgba(26, 26, 26, 0.85);\n  \n  /* Shadows - Soft and sophisticated */\n  --shadow: 0 2px 12px rgba(26, 26, 26, 0.08);\n  --shadow-hover: 0 8px 24px rgba(26, 26, 26, 0.12);\n  \n  /* Leica-specific elements */\n  --leica-silver: #c4c4c4;\n  --leica-black: #2c2c2c;\n  --leica-cream: #faf9f7;\n}\n\n/* Typography overrides for Leica aesthetic */\nbody {\n  font-family: 'Helvetica Neue', 'Arial', sans-serif;\n  letter-spacing: -0.01em;\n}\n\n.hero-title .title-main {\n  font-weight: 300;\n  letter-spacing: 0.02em;\n}\n\n.hero-title .title-accent {\n  color: var(--color-accent);\n  font-weight: 400;\n}\n\n/* Navigation enhancements */\n.nav-btn.active {\n  background: var(--color-accent);\n  color: white;\n  border-color: var(--color-accent);\n}\n\n.nav-btn:hover {\n  border-color: var(--color-accent);\n  color: var(--color-accent);\n}\n\n/* Social links styling */\n.social-link:hover {\n  color: var(--color-accent);\n  transform: translateY(-1px);\n}\n\n/* Gallery enhancements */\n.gallery-item {\n  border: 1px solid var(--color-border);\n  transition: all 0.3s ease;\n}\n\n.gallery-item:hover {\n  transform: translateY(-2px);\n  box-shadow: var(--shadow-hover);\n  border-color: var(--color-accent);\n}\n\n/* Lightbox styling */\n.lightbox {\n  background: rgba(26, 26, 26, 0.92);\n}\n\n.lightbox-info {\n  background: var(--leica-cream);\n  border: 1px solid var(--color-border);\n  box-shadow: var(--shadow);\n}\n\n.lightbox-title {\n  color: var(--color-accent);\n  font-weight: 300;\n  letter-spacing: 0.01em;\n}\n\n.exif-toggle {\n  background: var(--color-accent);\n  color: white;\n  border: none;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n}\n\n.exif-toggle:hover {\n  background: var(--color-accent-dark);\n  color: white;\n}\n\n/* Story cards */\n.story-card {\n  border: 1px solid var(--color-border);\n  background: var(--leica-cream);\n}\n\n.story-card:hover {\n  border-color: var(--color-accent);\n  transform: translateY(-1px);\n}\n\n.story-meta {\n  color: var(--color-accent);\n  font-weight: 500;\n}\n\n/* About section enhancements */\n.about-stats .stat-number {\n  color: var(--color-accent);\n  font-weight: 300;\n}\n\n/* Button styling */\n.btn-primary {\n  background: var(--color-accent);\n  border-color: var(--color-accent);\n}\n\n.btn-primary:hover {\n  background: var(--color-accent-dark);\n  border-color: var(--color-accent-dark);\n}\n\n.btn-outline {\n  border-color: var(--color-accent);\n  color: var(--color-accent);\n}\n\n.btn-outline:hover {\n  background: var(--color-accent);\n  color: white;\n}\n\n/* Loading animation */\n.loading-dot {\n  background: var(--color-accent);\n}\n\n/* Scrollbar styling for webkit browsers */\n::-webkit-scrollbar {\n  width: 8px;\n}\n\n::-webkit-scrollbar-track {\n  background: var(--color-bg-tertiary);\n}\n\n::-webkit-scrollbar-thumb {\n  background: var(--color-accent);\n  border-radius: 4px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: var(--color-accent-dark);\n}\n\n/* Special Leica camera-inspired elements */\n.hero::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%);\n  opacity: 0.8;\n}\n\n/* Refined focus states */\n.nav-btn:focus,\n.social-link:focus,\nbutton:focus {\n  outline: 2px solid var(--color-accent);\n  outline-offset: 2px;\n}\n\n/* Enhanced image gallery hover effects */\n.masonry-item img {\n  transition: all 0.3s ease;\n}\n\n.masonry-item:hover img {\n  transform: scale(1.02);\n}\n\n/* Typography refinements */\nh1, h2, h3, h4, h5, h6 {\n  letter-spacing: -0.01em;\n  font-weight: 300;\n}\n\n.hero-subtitle {\n  color: var(--color-text-secondary);\n  font-weight: 300;\n  letter-spacing: 0.01em;\n}",
  "/static/css/theme-monochrome.css": "/* Monochrome Theme - Black, White, and Gray */\n:root {\n  /* Background Colors */\n  --color-bg: #fafafa;\n  --color-bg-secondary: #ffffff;\n  --color-bg-tertiary: #f5f5f5;\n  \n  /* Text Colors */\n  --color-text: #212121;\n  --color-text-secondary: #424242;\n  --color-text-muted: #757575;\n  \n  /* Accent Colors */\n  --color-accent: #616161;\n  --color-accent-light: #757575;\n  --color-accent-dark: #424242;\n  \n  /* Border Colors */\n  --color-border: #e0e0e0;\n  --color-border-light: #f5f5f5;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(250, 250, 250, 0.95);\n  --color-card-bg: #ffffff;\n  --color-overlay: rgba(33, 33, 33, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n  --shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.15);\n}",
  "/static/css/theme-ocean.css": "/* Ocean Theme - Calming Blues */\n:root {\n  /* Background Colors */\n  --color-bg: #e8f4f8;\n  --color-bg-secondary: #ffffff;\n  --color-bg-tertiary: #b3e5fc;\n  \n  /* Text Colors */\n  --color-text: #0d47a1;\n  --color-text-secondary: #1565c0;\n  --color-text-muted: #42a5f5;\n  \n  /* Accent Colors */\n  --color-accent: #0077be;\n  --color-accent-light: #29b6f6;\n  --color-accent-dark: #006494;\n  \n  /* Border Colors */\n  --color-border: #81d4fa;\n  --color-border-light: #b3e5fc;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(232, 244, 248, 0.95);\n  --color-card-bg: #ffffff;\n  --color-overlay: rgba(13, 71, 161, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 4px 12px rgba(0, 119, 190, 0.2);\n  --shadow-hover: 0 8px 25px rgba(0, 119, 190, 0.3);\n}",
  "/static/css/theme-solarized-dark.css": "/* Solarized Dark Theme */\n:root {\n  /* Background Colors */\n  --color-bg: #002b36;\n  --color-bg-secondary: #073642;\n  --color-bg-tertiary: #586e75;\n  \n  /* Text Colors */\n  --color-text: #839496;\n  --color-text-secondary: #93a1a1;\n  --color-text-muted: #657b83;\n  \n  /* Accent Colors */\n  --color-accent: #268bd2;\n  --color-accent-light: #2aa198;\n  --color-accent-dark: #6c71c4;\n  \n  /* Border Colors */\n  --color-border: #586e75;\n  --color-border-light: #073642;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(0, 43, 54, 0.95);\n  --color-card-bg: #073642;\n  --color-overlay: rgba(131, 148, 150, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  --shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.5);\n}",
  "/static/css/theme-solarized-light.css": "/* Solarized Light Theme */\n:root {\n  /* Background Colors */\n  --color-bg: #fdf6e3;\n  --color-bg-secondary: #eee8d5;\n  --color-bg-tertiary: #93a1a1;\n  \n  /* Text Colors */\n  --color-text: #657b83;\n  --color-text-secondary: #839496;\n  --color-text-muted: #93a1a1;\n  \n  /* Accent Colors */\n  --color-accent: #268bd2;\n  --color-accent-light: #2aa198;\n  --color-accent-dark: #6c71c4;\n  \n  /* Border Colors */\n  --color-border: #93a1a1;\n  --color-border-light: #eee8d5;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(253, 246, 227, 0.95);\n  --color-card-bg: #eee8d5;\n  --color-overlay: rgba(101, 123, 131, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 4px 12px rgba(147, 161, 161, 0.2);\n  --shadow-hover: 0 8px 25px rgba(147, 161, 161, 0.3);\n}",
  "/static/css/theme-sunset.css": "/* Sunset Theme - Warm Oranges */\n:root {\n  /* Background Colors */\n  --color-bg: #fff3e0;\n  --color-bg-secondary: #ffffff;\n  --color-bg-tertiary: #ffcc80;\n  \n  /* Text Colors */\n  --color-text: #bf360c;\n  --color-text-secondary: #d84315;\n  --color-text-muted: #ff5722;\n  \n  /* Accent Colors */\n  --color-accent: #ff9800;\n  --color-accent-light: #ffb74d;\n  --color-accent-dark: #f57c00;\n  \n  /* Border Colors */\n  --color-border: #ffb74d;\n  --color-border-light: #ffcc80;\n  \n  /* Component Colors */\n  --color-navbar-bg: rgba(255, 243, 224, 0.95);\n  --color-card-bg: #ffffff;\n  --color-overlay: rgba(191, 54, 12, 0.8);\n  \n  /* Shadows */\n  --shadow: 0 4px 12px rgba(255, 152, 0, 0.2);\n  --shadow-hover: 0 8px 25px rgba(255, 152, 0, 0.3);\n}",
  "/static/favicon.ico": "�PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000 \u0000\u0000\u0000 \b\u0006\u0000\u0000\u0000szz�\u0000\u0000\u0000\u0004sBIT\b\b\b\b|\bd�\u0000\u0000\u0000\tpHYs\u0000\u0000\u0000�\u0000\u0000\u0000�\u0001kH��\u0000\u0000\u0000\u0019tEXtSoftware\u0000www.inkscape.org��<\u001a\u0000\u0000\u0001�IDATX�헽J\u0003Q\u0010��Q��\u0010l��--,�\u0002��`� Z�U\u0010|\u0001� A�h�XZ\bB�Q��\t\u0002*���Xi�\" Ap,vV67�e�&F�\u000b\u0007��;g��=\u0019nDU����h�� �'i���\u0003��uOUϝ�\f0\u0017\b}\u0000k�Z�!Rզ\u0001,\u0002U@\rU`�ٳ\u001f��Ⱥ\\M\u001d��t��&�\u0003�\u0006R�����E�)�؛E�\u000f(\u0002+���_�����b+���\u0007�\u000bj_�\u00150b�rr%��\u0018G\u0010�y\u0006xt���40iH[�m�=\u0001ԛM�\u0002�\r�\u0002o�Y�\u0015Z\"\u0000�\u001b\u001bN�;�d��\u0010�u�-��d\u0002�>��)|\u0006�-W�x¢홶��\u0004D�m\u0014\u0018\nɅ�������\u0012\u0018\f\u0015��l'f�)�)Fs\u001fOV�6�`�\u0011��\b\u0000\u0016�7�\u0016ި�:�(���1�`�kr\u0002�B\n��p;Ac\u0017�Ƶ\u001c� 9���k�~�\u0005�}�\u001a�k�\u0012�0P\u0006��1�m\u000b����3��*\u0003þ\u0007\u0006��}ζ�����H\u0001\u0003���\u0007T��\u001f\\�Z\u0001*�\u000bnDI\u0005��V\u0010�$DI�d/�z\u001f\f��K\u0012�?{\u0004�\u0002�*്���~\u0005\u0007�\u0004��l��\u001aĎ#jn��f����N\u000b�\u0004m\u0015<�:7\u0010S\u0000\u0000\u0000\u0000IEND�B`�",
  "/static/js/admin.js": "// Admin interface JavaScript\nlet authToken = localStorage.getItem('adminToken');\nlet currentPosts = [];\nlet currentPostId = null;\nlet uploadedImages = [];\nlet blockEditor = null;\n\ndocument.addEventListener('DOMContentLoaded', function() {\n    checkAuth();\n    setupEventListeners();\n    // Editor will be initialized when needed\n});\n\nfunction checkAuth() {\n    const loginModal = document.getElementById('login-modal');\n    const adminInterface = document.getElementById('admin-interface');\n    \n    if (authToken) {\n        // Verify token by making a request\n        fetch('/api/admin/posts', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        })\n        .then(response => {\n            if (response.ok) {\n                showAdminInterface();\n                showPostsSection(); // Start with posts section active\n            } else {\n                showLoginModal();\n            }\n        })\n        .catch(() => {\n            showLoginModal();\n        });\n    } else {\n        showLoginModal();\n    }\n    \n    function showLoginModal() {\n        loginModal.classList.add('active');\n        adminInterface.classList.remove('active');\n    }\n    \n    function showAdminInterface() {\n        loginModal.classList.remove('active');\n        adminInterface.classList.add('active');\n    }\n}\n\nasync function initializeRichTextEditor() {\n    // Check if editor is already initialized\n    if (blockEditor) {\n        return blockEditor;\n    }\n    \n    // Check if the container exists\n    const container = document.getElementById('post-content');\n    if (!container) {\n        console.error('Editor container not found!');\n        return null;\n    }\n    \n    // Wait for EditorJS to be available\n    if (typeof EditorJS === 'undefined') {\n        await new Promise(resolve => setTimeout(resolve, 100));\n        return initializeRichTextEditor();\n    }\n    \n    try {\n        // Initialize EditorJS with Gutenberg-like blocks\n        blockEditor = new EditorJS({\n            holder: 'post-content',\n            placeholder: 'Tell your story...',\n            autofocus: true,\n            tools: {\n                header: {\n                    class: window.Header,\n                    config: {\n                        placeholder: 'Enter a header',\n                        levels: [1, 2, 3, 4, 5, 6],\n                        defaultLevel: 2\n                    }\n                },\n                list: {\n                    class: window.List,\n                    inlineToolbar: true,\n                    config: {\n                        defaultStyle: 'unordered'\n                    }\n                },\n                quote: {\n                    class: window.Quote,\n                    inlineToolbar: true,\n                    config: {\n                        quotePlaceholder: 'Enter a quote',\n                        captionPlaceholder: 'Quote\\'s author'\n                    }\n                },\n                image: {\n                    class: window.ImageTool,\n                    config: {\n                        uploader: {\n                            uploadByFile: async (file) => {\n                                return await uploadImageForEditor(file);\n                            }\n                        }\n                    }\n                },\n                imageLibrary: {\n                    class: createImageLibraryTool(),\n                    config: {}\n                },\n                embed: {\n                    class: window.Embed,\n                    config: {\n                        services: {\n                            youtube: true,\n                            twitter: true,\n                            instagram: true,\n                            vimeo: true,\n                            coub: true\n                        }\n                    }\n                },\n                table: {\n                    class: window.Table,\n                    inlineToolbar: true\n                },\n                code: {\n                    class: window.CodeTool,\n                    config: {\n                        placeholder: 'Enter code here...'\n                    }\n                },\n                raw: {\n                    class: window.RawTool,\n                    config: {\n                        placeholder: 'Enter raw HTML...'\n                    }\n                },\n                delimiter: window.Delimiter\n            },\n            onChange: () => {\n                // Content changed\n            },\n            onReady: () => {\n                // Editor ready\n            }\n        });\n        \n        return blockEditor;\n    } catch (error) {\n        console.error('Failed to initialize EditorJS:', error);\n        return null;\n    }\n}\n\nfunction setupEventListeners() {\n    // Login form\n    document.getElementById('login-form').addEventListener('submit', handleLogin);\n    \n    // Navigation\n    document.getElementById('logout-btn').addEventListener('click', handleLogout);\n    document.getElementById('posts-nav-btn').addEventListener('click', showPostsSection);\n    document.getElementById('gallery-nav-btn').addEventListener('click', showGallerySection);\n    document.getElementById('about-nav-btn').addEventListener('click', showAboutSection);\n    document.getElementById('themes-nav-btn').addEventListener('click', showThemesSection);\n    document.getElementById('images-nav-btn').addEventListener('click', showImagesSection);\n    document.getElementById('social-nav-btn').addEventListener('click', showSocialSection);\n    document.getElementById('bucket-nav-btn').addEventListener('click', showBucketSection);\n    document.getElementById('new-post-btn').addEventListener('click', showNewPostEditor);\n    document.getElementById('cancel-edit-btn').addEventListener('click', showPostsList);\n    \n    // Initialize navigation reordering\n    initializeNavigationReordering();\n    \n    // Post form\n    const savePostBtn = document.getElementById('save-post-btn');\n    if (savePostBtn) savePostBtn.addEventListener('click', savePost);\n    \n    // Slug editing\n    const editSlugBtn = document.getElementById('edit-slug-btn');\n    const regenerateSlugBtn = document.getElementById('regenerate-slug-btn');\n    const cancelSlugBtn = document.getElementById('cancel-slug-btn');\n    if (editSlugBtn) editSlugBtn.addEventListener('click', enableSlugEditing);\n    if (regenerateSlugBtn) regenerateSlugBtn.addEventListener('click', regenerateSlugFromTitle);\n    if (cancelSlugBtn) cancelSlugBtn.addEventListener('click', cancelSlugEditing);\n    \n    // Featured image\n    const selectFeaturedBtn = document.getElementById('select-featured-btn');\n    const removeFeaturedBtn = document.getElementById('remove-featured-btn');\n    if (selectFeaturedBtn) selectFeaturedBtn.addEventListener('click', () => openFileManager('featured'));\n    if (removeFeaturedBtn) removeFeaturedBtn.addEventListener('click', removeFeaturedImage);\n    \n    // File manager\n    const manageImagesBtn = document.getElementById('manage-images-btn');\n    const fileManagerClose = document.getElementById('file-manager-close');\n    const cancelFileManagerBtn = document.getElementById('cancel-file-manager-btn');\n    \n    if (manageImagesBtn) manageImagesBtn.addEventListener('click', () => openFileManager('manage'));\n    if (fileManagerClose) fileManagerClose.addEventListener('click', closeFileManager);\n    if (cancelFileManagerBtn) cancelFileManagerBtn.addEventListener('click', closeFileManager);\n    \n    // File manager mode buttons\n    const selectModeBtn = document.getElementById('select-mode-btn');\n    const manageModeBtn = document.getElementById('manage-mode-btn');\n    \n    if (selectModeBtn) selectModeBtn.addEventListener('click', () => switchFileManagerMode('select'));\n    if (manageModeBtn) manageModeBtn.addEventListener('click', () => switchFileManagerMode('manage'));\n    \n    // File manager action buttons\n    const selectImagesBtn = document.getElementById('select-images-btn');\n    const deleteSelectedBtn = document.getElementById('delete-selected-btn');\n    \n    if (selectImagesBtn) selectImagesBtn.addEventListener('click', selectImages);\n    if (deleteSelectedBtn) deleteSelectedBtn.addEventListener('click', deleteSelectedImages);\n    \n    // Gallery management\n    const addToGalleryBtn = document.getElementById('add-to-gallery-btn');\n    \n    if (addToGalleryBtn) addToGalleryBtn.addEventListener('click', () => openFileManager('homepage-gallery'));\n    \n    // Image library management\n    const uploadImagesBtn = document.getElementById('upload-images-btn');\n    const bulkUploadInput = document.getElementById('bulk-upload-input');\n    const updateExifBtn = document.getElementById('update-exif-btn');\n    const migrateImagesBtn = document.getElementById('migrate-images-btn');\n    const imagesSearch = document.getElementById('images-search');\n    \n    if (uploadImagesBtn) uploadImagesBtn.addEventListener('click', () => bulkUploadInput.click());\n    if (bulkUploadInput) bulkUploadInput.addEventListener('change', handleBulkImageUpload);\n    if (updateExifBtn) updateExifBtn.addEventListener('click', updateExifForAllImages);\n    if (migrateImagesBtn) migrateImagesBtn.addEventListener('click', migrateImagesToFolder);\n    if (imagesSearch) imagesSearch.addEventListener('input', filterImages);\n    \n    // S3 bucket import\n    const testB2Btn = document.getElementById('test-b2-btn');\n    const refreshBucketBtn = document.getElementById('refresh-bucket-btn');\n    const importSelectedBtn = document.getElementById('import-selected-btn');\n    const bucketSearch = document.getElementById('bucket-search');\n    const fileTypeFilter = document.getElementById('file-type-filter');\n    \n    if (testB2Btn) testB2Btn.addEventListener('click', testB2Connection);\n    if (refreshBucketBtn) refreshBucketBtn.addEventListener('click', () => loadBucketFiles());\n    if (importSelectedBtn) importSelectedBtn.addEventListener('click', importSelectedFiles);\n    if (bucketSearch) bucketSearch.addEventListener('input', filterBucketFiles);\n    if (fileTypeFilter) fileTypeFilter.addEventListener('change', () => loadBucketFiles());\n    \n    // Social links management\n    const addSocialLinkBtn = document.getElementById('add-social-link-btn');\n    const socialLinkModal = document.getElementById('social-link-modal');\n    const socialLinkModalClose = document.getElementById('social-link-modal-close');\n    const cancelSocialLinkBtn = document.getElementById('cancel-social-link-btn');\n    const socialLinkForm = document.getElementById('social-link-form');\n    \n    if (addSocialLinkBtn) addSocialLinkBtn.addEventListener('click', () => openSocialLinkModal());\n    if (socialLinkModalClose) socialLinkModalClose.addEventListener('click', closeSocialLinkModal);\n    if (cancelSocialLinkBtn) cancelSocialLinkBtn.addEventListener('click', closeSocialLinkModal);\n    if (socialLinkForm) socialLinkForm.addEventListener('submit', saveSocialLink);\n    \n    // Icon picker management\n    const iconPickerBtn = document.getElementById('icon-picker-btn');\n    const iconPickerModalClose = document.getElementById('icon-picker-modal-close');\n    const cancelIconPickerBtn = document.getElementById('cancel-icon-picker-btn');\n    const platformInput = document.getElementById('social-platform');\n    \n    if (iconPickerBtn) iconPickerBtn.addEventListener('click', openIconPicker);\n    if (iconPickerModalClose) iconPickerModalClose.addEventListener('click', closeIconPicker);\n    if (cancelIconPickerBtn) cancelIconPickerBtn.addEventListener('click', closeIconPicker);\n    if (platformInput) platformInput.addEventListener('input', autoDetectIcon);\n    \n    // Search\n    document.getElementById('posts-search').addEventListener('input', filterPosts);\n}\n\nfunction showImageSelectionModal() {\n    const modalHtml = `\n        <div id=\"image-selection-modal\" class=\"modal active\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <h2>Add Image</h2>\n                    <button class=\"modal-close\" onclick=\"closeImageSelectionModal()\">&times;</button>\n                </div>\n                <div class=\"image-selection-options\">\n                    <button class=\"btn btn-primary btn-large\" onclick=\"selectFromLibrary()\">\n                        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z\"/>\n                        </svg>\n                        Select from Image Library\n                    </button>\n                    <button class=\"btn btn-outline btn-large\" onclick=\"uploadNewImage()\">\n                        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z\"/>\n                        </svg>\n                        Upload New Image\n                    </button>\n                </div>\n            </div>\n        </div>\n    `;\n    \n    document.body.insertAdjacentHTML('beforeend', modalHtml);\n}\n\nfunction closeImageSelectionModal() {\n    const modal = document.getElementById('image-selection-modal');\n    if (modal) {\n        modal.remove();\n    }\n}\n\nasync function uploadImageForEditor(file) {\n    const formData = new FormData();\n    formData.append('image', file);\n    \n    try {\n        const response = await fetch('/api/admin/upload', {\n            method: 'POST',\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: formData\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to upload image');\n        }\n        \n        const imageData = await response.json();\n        \n        return {\n            success: 1,\n            file: {\n                url: imageData.b2_url,\n                size: imageData.file_size,\n                name: imageData.original_filename,\n                extension: imageData.original_filename.split('.').pop()\n            }\n        };\n        \n    } catch (error) {\n        console.error('Error uploading image:', error);\n        return {\n            success: 0,\n            error: error.message\n        };\n    }\n}\n\nfunction selectFromLibrary() {\n    closeImageSelectionModal();\n    openFileManager('editor-image');\n}\n\nfunction uploadNewImage() {\n    closeImageSelectionModal();\n    selectLocalImage();\n}\n\nfunction selectLocalImage() {\n    const input = document.createElement('input');\n    input.setAttribute('type', 'file');\n    input.setAttribute('accept', 'image/*');\n    input.click();\n    \n    input.onchange = async () => {\n        const file = input.files[0];\n        if (file) {\n            await insertImageIntoEditor(file);\n        }\n    };\n}\n\nasync function insertImageIntoEditor(file) {\n    try {\n        const uploadResult = await uploadImageForEditor(file);\n        \n        if (uploadResult.success && blockEditor) {\n            // Insert image block at the end\n            const blocksCount = await blockEditor.blocks.getBlocksCount();\n            blockEditor.blocks.insert('image', {\n                file: uploadResult.file,\n                caption: '',\n                withBorder: false,\n                withBackground: false,\n                stretched: false\n            }, {}, blocksCount);\n        } else {\n            throw new Error(uploadResult.error || 'Failed to upload image');\n        }\n        \n    } catch (error) {\n        console.error('Error uploading image:', error);\n        alert('Failed to upload image: ' + error.message);\n    }\n}\n\nasync function handleLogin(e) {\n    e.preventDefault();\n    \n    const password = document.getElementById('password').value;\n    const errorElement = document.getElementById('login-error');\n    \n    try {\n        const response = await fetch('/api/admin/login', {\n            method: 'POST',\n            headers: {\n                'Content-Type': 'application/json'\n            },\n            body: JSON.stringify({ password })\n        });\n        \n        const data = await response.json();\n        \n        if (response.ok) {\n            authToken = data.token;\n            localStorage.setItem('adminToken', authToken);\n            checkAuth();\n        } else {\n            errorElement.textContent = data.error || 'Login failed';\n        }\n    } catch (error) {\n        errorElement.textContent = 'Connection error. Please try again.';\n    }\n}\n\nfunction handleLogout() {\n    authToken = null;\n    localStorage.removeItem('adminToken');\n    checkAuth();\n}\n\nasync function loadPosts() {\n    const postsListElement = document.getElementById('posts-list');\n    postsListElement.innerHTML = '<div class=\"loading\">Loading posts...</div>';\n    \n    try {\n        const response = await fetch('/api/admin/posts', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to load posts');\n        }\n        \n        currentPosts = await response.json();\n        renderPosts(currentPosts);\n    } catch (error) {\n        postsListElement.innerHTML = '<div class=\"error-message\">Error loading posts. Please try again.</div>';\n    }\n}\n\nfunction renderPosts(posts) {\n    const postsListElement = document.getElementById('posts-list');\n    \n    if (posts.length === 0) {\n        postsListElement.innerHTML = `\n            <div class=\"loading\" style=\"text-align: center; padding: 4rem; color: #718096;\">\n                <svg width=\"64\" height=\"64\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"margin-bottom: 1rem; opacity: 0.5;\">\n                    <path d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z\"/>\n                </svg>\n                <h3 style=\"margin-bottom: 0.5rem; color: #4a5568;\">No posts found</h3>\n                <p>Create your first post to get started.</p>\n            </div>\n        `;\n        return;\n    }\n    \n    const postsHTML = posts.map(post => {\n        const createdDate = new Date(post.created_at);\n        const updatedDate = new Date(post.updated_at);\n        const isUpdated = updatedDate > createdDate;\n        const displayDate = isUpdated ? updatedDate : createdDate;\n        const dateText = isUpdated ? 'Updated' : 'Created';\n        \n        const status = post.published ? 'published' : 'draft';\n        const statusText = post.published ? 'Published' : 'Draft';\n        \n        // Create content preview (strip HTML and truncate)\n        let contentPreview = '';\n        if (post.content) {\n            const tempDiv = document.createElement('div');\n            tempDiv.innerHTML = post.content;\n            const textContent = tempDiv.textContent || tempDiv.innerText || '';\n            contentPreview = textContent.length > 300 ? \n                textContent.substring(0, 300) + '...' : \n                textContent;\n        }\n        \n        // Create thumbnail HTML\n        const thumbnailHtml = post.featured_image_url ? \n            `<div class=\"post-thumbnail\">\n                <img src=\"${post.featured_image_url}\" alt=\"${post.title}\" loading=\"lazy\">\n            </div>` : \n            `<div class=\"post-thumbnail\">\n                <div class=\"post-thumbnail-placeholder\">\n                    <svg viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                        <path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\"/>\n                    </svg>\n                </div>\n            </div>`;\n\n        return `\n            <div class=\"post-item\">\n                <div class=\"post-item-content\">\n                    ${thumbnailHtml}\n                    <div class=\"post-item-header\">\n                        <div class=\"post-info\">\n                            <h3>${post.title}</h3>\n                            <div class=\"post-meta\">\n                                <div class=\"post-meta-item\">\n                                    <svg viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                        <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n                                    </svg>\n                                    <span>${dateText}: ${displayDate.toLocaleDateString()}</span>\n                                </div>\n                                ${post.slug ? `\n                                    <div class=\"post-meta-item\">\n                                        <svg viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                            <path d=\"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z\"/>\n                                        </svg>\n                                        <span>/${post.slug}</span>\n                                    </div>\n                                ` : ''}\n                            </div>\n                            <span class=\"post-status ${status}\">${statusText}</span>\n                        </div>\n                        <div class=\"post-actions\">\n                            <button class=\"btn btn-outline\" onclick=\"editPost(${post.id})\">\n                                <svg viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                    <path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\n                                </svg>\n                                Edit\n                            </button>\n                            <button class=\"btn btn-danger\" onclick=\"deletePost(${post.id})\">\n                                <svg viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                                    <path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/>\n                                </svg>\n                                Delete\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                ${contentPreview ? `<div class=\"post-preview\">${contentPreview}</div>` : ''}\n            </div>\n        `;\n    }).join('');\n    \n    postsListElement.innerHTML = postsHTML;\n}\n\nfunction filterPosts() {\n    const searchTerm = document.getElementById('posts-search').value.toLowerCase();\n    const filteredPosts = currentPosts.filter(post => \n        post.title.toLowerCase().includes(searchTerm) ||\n        (post.content && post.content.toLowerCase().includes(searchTerm))\n    );\n    renderPosts(filteredPosts);\n}\n\nfunction showPostsSection() {\n    // Hide all sections\n    document.getElementById('posts-section').classList.add('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('themes-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.remove('active');\n    \n    // Update nav buttons\n    updateNavButtons('posts');\n    \n    loadPosts();\n}\n\nfunction showGallerySection() {\n    // Hide all sections\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.add('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('themes-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.remove('active');\n    \n    // Update nav buttons\n    updateNavButtons('gallery');\n    \n    loadGalleryAdmin();\n}\n\nfunction showAboutSection() {\n    // Hide all sections\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.add('active');\n    document.getElementById('themes-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.remove('active');\n    \n    // Update nav buttons\n    updateNavButtons('about');\n    \n    loadAboutAdmin();\n}\n\nfunction showImagesSection() {\n    // Hide all sections\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('themes-section').classList.remove('active');\n    document.getElementById('images-section').classList.add('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.remove('active');\n    \n    // Update nav buttons\n    updateNavButtons('images');\n    \n    loadImagesLibrary();\n}\n\nfunction showThemesSection() {\n    // Hide all sections\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('themes-section').classList.add('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.remove('active');\n    \n    // Update nav buttons\n    updateNavButtons('themes');\n    \n    loadThemesInterface();\n}\n\nfunction showSocialSection() {\n    // Hide all sections\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('themes-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('social-section').classList.add('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.remove('active');\n    \n    // Update nav buttons\n    updateNavButtons('social');\n    \n    loadSocialLinks();\n}\n\nfunction showBucketSection() {\n    // Hide all sections\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('themes-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('social-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.add('active');\n    document.getElementById('editor-section').classList.remove('active');\n    \n    // Update nav buttons\n    updateNavButtons('bucket');\n    \n    // Don't auto-load bucket files - wait for user to click refresh\n}\n\nfunction updateNavButtons(activeSection) {\n    const navButtons = ['posts-nav-btn', 'gallery-nav-btn', 'about-nav-btn', 'themes-nav-btn', 'images-nav-btn', 'social-nav-btn', 'bucket-nav-btn'];\n    \n    navButtons.forEach(btnId => {\n        const btn = document.getElementById(btnId);\n        if (btn) {\n            btn.classList.remove('btn-primary');\n            btn.classList.add('btn-outline');\n        }\n    });\n    \n    const activeBtn = document.getElementById(`${activeSection}-nav-btn`);\n    if (activeBtn) {\n        activeBtn.classList.add('btn-primary');\n        activeBtn.classList.remove('btn-outline');\n    }\n}\n\nfunction showPostsList() {\n    document.getElementById('posts-section').classList.add('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.remove('active');\n    currentPostId = null;\n    resetPostForm();\n}\n\nasync function showNewPostEditor() {\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.add('active');\n    document.getElementById('editor-title').textContent = 'New Post';\n    resetPostForm();\n    \n    // Initialize editor when showing editor section\n    await initializeRichTextEditor();\n}\n\nfunction resetPostForm() {\n    document.getElementById('post-form').reset();\n    if (blockEditor) {\n        blockEditor.clear();\n    }\n    removeFeaturedImage();\n    uploadedImages = [];\n    currentPostId = null;\n    \n    // Reset slug editing state\n    isEditingSlug = false;\n    document.getElementById('post-slug').value = '';\n    cancelSlugEditing();\n}\n\n// Convert HTML to EditorJS blocks\nasync function convertHtmlToBlocks(html) {\n    if (!html || html.trim() === '') {\n        return [];\n    }\n    \n    const blocks = [];\n    \n    // Create a temporary container to parse HTML\n    const tempDiv = document.createElement('div');\n    tempDiv.innerHTML = html;\n    \n    // Process each child element\n    for (const element of tempDiv.children) {\n        const tagName = element.tagName.toLowerCase();\n        \n        switch (tagName) {\n            case 'h1':\n            case 'h2':\n            case 'h3':\n            case 'h4':\n            case 'h5':\n            case 'h6':\n                blocks.push({\n                    type: 'header',\n                    data: {\n                        text: element.textContent,\n                        level: parseInt(tagName[1])\n                    }\n                });\n                break;\n                \n            case 'p':\n                // Check if paragraph contains an image\n                const img = element.querySelector('img');\n                if (img) {\n                    // Convert image to imageLibrary block\n                    blocks.push({\n                        type: 'imageLibrary',\n                        data: {\n                            url: img.src,\n                            caption: img.alt || '',\n                            width: img.getAttribute('data-width') || 'auto',\n                            maxWidth: img.getAttribute('data-max-width') || '100%',\n                            file: {\n                                url: img.src\n                            }\n                        }\n                    });\n                    \n                    // If there's also text in the paragraph (after image), add it as separate paragraph\n                    const textContent = element.textContent.trim();\n                    if (textContent && textContent !== img.alt) {\n                        blocks.push({\n                            type: 'paragraph',\n                            data: {\n                                text: textContent\n                            }\n                        });\n                    }\n                } else if (element.textContent.trim()) {\n                    blocks.push({\n                        type: 'paragraph',\n                        data: {\n                            text: element.innerHTML\n                        }\n                    });\n                }\n                break;\n                \n            case 'img':\n                // Standalone image\n                blocks.push({\n                    type: 'imageLibrary',\n                    data: {\n                        url: element.src,\n                        caption: element.alt || '',\n                        width: element.getAttribute('data-width') || 'auto',\n                        maxWidth: element.getAttribute('data-max-width') || '100%',\n                        file: {\n                            url: element.src\n                        }\n                    }\n                });\n                break;\n                \n            case 'ul':\n            case 'ol':\n                const items = Array.from(element.querySelectorAll('li')).map(li => li.innerHTML);\n                blocks.push({\n                    type: 'list',\n                    data: {\n                        style: tagName === 'ol' ? 'ordered' : 'unordered',\n                        items: items\n                    }\n                });\n                break;\n                \n            case 'blockquote':\n                blocks.push({\n                    type: 'quote',\n                    data: {\n                        text: element.textContent,\n                        caption: ''\n                    }\n                });\n                break;\n                \n            case 'pre':\n                const code = element.querySelector('code');\n                blocks.push({\n                    type: 'code',\n                    data: {\n                        code: code ? code.textContent : element.textContent\n                    }\n                });\n                break;\n                \n            default:\n                // For any other element, treat as paragraph\n                if (element.textContent.trim()) {\n                    blocks.push({\n                        type: 'paragraph',\n                        data: {\n                            text: element.innerHTML\n                        }\n                    });\n                }\n                break;\n        }\n    }\n    \n    // If no blocks were created but we have content, create a single paragraph\n    if (blocks.length === 0 && html.trim()) {\n        blocks.push({\n            type: 'paragraph',\n            data: {\n                text: html\n            }\n        });\n    }\n    \n    return blocks;\n}\n\n// Convert EditorJS blocks to HTML\nasync function convertBlocksToHtml(blocks) {\n    let html = '';\n    \n    for (const block of blocks) {\n        switch (block.type) {\n            case 'paragraph':\n                html += `<p>${block.data.text}</p>`;\n                break;\n            case 'header':\n                const level = block.data.level || 2;\n                html += `<h${level}>${block.data.text}</h${level}>`;\n                break;\n            case 'list':\n                const listType = block.data.style === 'ordered' ? 'ol' : 'ul';\n                html += `<${listType}>`;\n                block.data.items.forEach(item => {\n                    html += `<li>${item}</li>`;\n                });\n                html += `</${listType}>`;\n                break;\n            case 'quote':\n                html += `<blockquote><p>${block.data.text}</p>`;\n                if (block.data.caption) {\n                    html += `<cite>${block.data.caption}</cite>`;\n                }\n                html += `</blockquote>`;\n                break;\n            case 'image':\n                html += `<img src=\"${block.data.file.url}\" alt=\"${block.data.caption || ''}\"`;\n                if (block.data.caption) {\n                    html += ` title=\"${block.data.caption}\"`;\n                }\n                html += `>`;\n                if (block.data.caption) {\n                    html += `<p><em>${block.data.caption}</em></p>`;\n                }\n                break;\n            case 'imageLibrary':\n                if (block.data.url) {\n                    // Include width styling if specified\n                    const widthStyle = block.data.width && block.data.width !== 'auto' \n                        ? ` style=\"width: ${block.data.width}; max-width: ${block.data.maxWidth || '100%'};\"` \n                        : '';\n                    html += `<img src=\"${block.data.url}\" alt=\"${block.data.caption || ''}\"`;\n                    if (block.data.caption) {\n                        html += ` title=\"${block.data.caption}\"`;\n                    }\n                    // Add width data attributes for restoration\n                    if (block.data.width) {\n                        html += ` data-width=\"${block.data.width}\"`;\n                    }\n                    if (block.data.maxWidth) {\n                        html += ` data-max-width=\"${block.data.maxWidth}\"`;\n                    }\n                    html += `${widthStyle}>`;\n                    if (block.data.caption) {\n                        html += `<p><em>${block.data.caption}</em></p>`;\n                    }\n                }\n                break;\n            case 'code':\n                html += `<pre><code>${block.data.code}</code></pre>`;\n                break;\n            case 'raw':\n                html += block.data.html;\n                break;\n            case 'delimiter':\n                html += `<hr>`;\n                break;\n            case 'table':\n                html += `<table>`;\n                block.data.content.forEach(row => {\n                    html += `<tr>`;\n                    row.forEach(cell => {\n                        html += `<td>${cell}</td>`;\n                    });\n                    html += `</tr>`;\n                });\n                html += `</table>`;\n                break;\n            case 'embed':\n                if (block.data.service === 'youtube') {\n                    html += `<iframe width=\"560\" height=\"315\" src=\"${block.data.embed}\" frameborder=\"0\" allowfullscreen></iframe>`;\n                } else {\n                    html += `<div class=\"embed\" data-service=\"${block.data.service}\">${block.data.embed}</div>`;\n                }\n                break;\n            default:\n                // Fallback for unknown block types\n                if (block.data.text) {\n                    html += `<p>${block.data.text}</p>`;\n                }\n                break;\n        }\n    }\n    \n    return html;\n}\n\nasync function editPost(postId) {\n    currentPostId = postId;\n    const post = currentPosts.find(p => p.id === postId);\n    \n    if (!post) {\n        console.error('Post not found with ID:', postId);\n        return;\n    }\n    \n    // Fill form with post data\n    document.getElementById('post-title').value = post.title;\n    document.getElementById('post-slug').value = post.slug;\n    if (blockEditor) {\n        // Parse HTML content and convert to EditorJS blocks\n        try {\n            const blocks = await convertHtmlToBlocks(post.content || '');\n            blockEditor.render({ blocks });\n        } catch (error) {\n            console.error('Error loading post content:', error);\n            // Fallback: create a single paragraph block with the content\n            blockEditor.render({\n                blocks: [{\n                    type: 'paragraph',\n                    data: {\n                        text: post.content || ''\n                    }\n                }]\n            });\n        }\n    }\n    document.getElementById('post-published').checked = post.published;\n    \n    // Load featured image if exists\n    if (post.featured_image_url && post.featured_image_id) {\n        setFeaturedImage(post.featured_image_id, post.featured_image_url);\n    } else {\n        removeFeaturedImage();\n    }\n    \n    \n    // Show editor\n    document.getElementById('posts-section').classList.remove('active');\n    document.getElementById('gallery-section').classList.remove('active');\n    document.getElementById('about-section').classList.remove('active');\n    document.getElementById('images-section').classList.remove('active');\n    document.getElementById('bucket-section').classList.remove('active');\n    document.getElementById('editor-section').classList.add('active');\n    document.getElementById('editor-title').textContent = 'Edit Post';\n    \n    // Initialize editor when showing editor section\n    await initializeRichTextEditor();\n}\n\n// Make functions globally accessible for onclick handlers\nwindow.editPost = editPost;\nwindow.deletePost = deletePost;\nwindow.openFileManager = openFileManager;\nwindow.closeImageSelectionModal = closeImageSelectionModal;\nwindow.selectFromLibrary = selectFromLibrary;\nwindow.uploadNewImage = uploadNewImage;\n\n// Fallback functions for removed gallery features (to prevent errors)\nwindow.renderGalleryPreview = function() { /* Gallery feature removed */ };\nwindow.loadPostGallery = function() { /* Gallery feature removed */ };\nwindow.clearGallery = function() { /* Gallery feature removed */ };\n\n// Editor-specific functions\nwindow.openImageLibraryForEditor = openImageLibraryForEditor;\n\n// Variable to track current editor block for image insertion\nlet currentEditorImageBlock = null;\n\nfunction createImageLibraryTool() {\n    return class ImageLibraryTool {\n        static get toolbox() {\n            return {\n                title: 'Image Library',\n                icon: '<svg width=\"17\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z\"/></svg>'\n            };\n        }\n\n        constructor({ data, api }) {\n            this.api = api;\n            this.data = data || {\n                width: 'auto',\n                maxWidth: '100%'\n            };\n            this.wrapper = undefined;\n            this.isResizing = false;\n            this.startWidth = 0;\n            this.startHeight = 0;\n            this.aspectRatio = 1;\n            \n            // Store instance reference for data updates\n            window.currentLibraryToolInstance = this;\n        }\n\n        render() {\n            this.wrapper = document.createElement('div');\n            this.wrapper.classList.add('image-library-tool');\n            \n            if (this.data.url) {\n                // If we have data, show the image\n                this._createImage(this.data.url, this.data.caption);\n            } else {\n                // Show button to select from library\n                this._createSelectButton();\n            }\n\n            return this.wrapper;\n        }\n\n        _createSelectButton() {\n            this.wrapper.innerHTML = `\n                <div style=\"\n                    border: 2px dashed #ccc; \n                    border-radius: 8px; \n                    padding: 2rem; \n                    text-align: center; \n                    background: #fafafa;\n                    cursor: pointer;\n                \" onclick=\"window.selectImageFromLibraryForBlock(this)\">\n                    <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"#666\" style=\"margin-bottom: 1rem;\">\n                        <path d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z\"/>\n                    </svg>\n                    <p style=\"margin: 0; color: #666; font-size: 16px;\">Select Image from Library</p>\n                    <p style=\"margin: 0.5rem 0 0 0; color: #999; font-size: 14px;\">Choose from your uploaded images</p>\n                </div>\n            `;\n        }\n\n        _createImage(url, caption) {\n            const imageWidth = this.data.width || 'auto';\n            const maxWidth = this.data.maxWidth || '100%';\n            \n            this.wrapper.innerHTML = `\n                <div class=\"resizable-image-container\" style=\"text-align: center; position: relative; display: inline-block; max-width: 100%;\">\n                    <div class=\"image-wrapper\" style=\"position: relative; display: inline-block; width: ${imageWidth}; max-width: ${maxWidth};\">\n                        <img \n                            src=\"${url}\" \n                            style=\"width: 100%; height: auto; border-radius: 8px; display: block;\" \n                            alt=\"${caption || ''}\"\n                            onload=\"this.parentElement.parentElement.querySelector('.resize-handle').style.display = 'none'\"\n                        >\n                        <div class=\"resize-handle\" style=\"\n                            position: absolute;\n                            bottom: -5px;\n                            right: -5px;\n                            width: 20px;\n                            height: 20px;\n                            background: #007cba;\n                            border: 2px solid white;\n                            border-radius: 50%;\n                            cursor: nw-resize;\n                            display: none;\n                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n                        \"></div>\n                    </div>\n                    ${caption ? `<p style=\"margin: 0.5rem 0 0 0; color: #666; font-style: italic;\">${caption}</p>` : ''}\n                </div>\n            `;\n            \n            // Add resize event listeners\n            this._addResizeListeners();\n        }\n        \n        _addResizeListeners() {\n            const handle = this.wrapper.querySelector('.resize-handle');\n            const imageWrapper = this.wrapper.querySelector('.image-wrapper');\n            const img = this.wrapper.querySelector('img');\n            \n            if (!handle || !imageWrapper || !img) return;\n            \n            // Wait for image to load to get proper dimensions\n            if (img.complete) {\n                this._setupResize(handle, imageWrapper, img);\n            } else {\n                img.onload = () => this._setupResize(handle, imageWrapper, img);\n            }\n        }\n        \n        _setupResize(handle, imageWrapper, img) {\n            this.aspectRatio = img.naturalWidth / img.naturalHeight;\n            \n            const startResize = (e) => {\n                e.preventDefault();\n                this.isResizing = true;\n                \n                const rect = imageWrapper.getBoundingClientRect();\n                this.startWidth = rect.width;\n                this.startX = e.clientX;\n                \n                document.addEventListener('mousemove', doResize);\n                document.addEventListener('mouseup', stopResize);\n                \n                // Add visual feedback\n                imageWrapper.style.outline = '2px solid #007cba';\n            };\n            \n            const doResize = (e) => {\n                if (!this.isResizing) return;\n                \n                const deltaX = e.clientX - this.startX;\n                let newWidth = this.startWidth + deltaX;\n                \n                // Minimum and maximum width constraints\n                const minWidth = 100;\n                const maxWidth = this.wrapper.closest('.ce-block__content').offsetWidth || 800;\n                \n                newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));\n                \n                imageWrapper.style.width = `${newWidth}px`;\n                imageWrapper.style.maxWidth = 'none';\n                \n                // Store the width for saving\n                this.data.width = `${newWidth}px`;\n                this.data.maxWidth = 'none';\n            };\n            \n            const stopResize = () => {\n                this.isResizing = false;\n                imageWrapper.style.outline = 'none';\n                \n                document.removeEventListener('mousemove', doResize);\n                document.removeEventListener('mouseup', stopResize);\n                \n                // Trigger change event\n                if (this.api && this.api.blocks) {\n                    // Mark block as changed\n                }\n            };\n            \n            handle.addEventListener('mousedown', startResize);\n            \n            // Show/hide handle on hover\n            imageWrapper.addEventListener('mouseenter', () => {\n                handle.style.display = 'block';\n            });\n            \n            this.wrapper.addEventListener('mouseleave', () => {\n                if (!this.isResizing) {\n                    handle.style.display = 'none';\n                }\n            });\n        }\n\n        save() {\n            if (this.data.url) {\n                const saveData = {\n                    url: this.data.url,\n                    caption: this.data.caption || '',\n                    width: this.data.width || 'auto',\n                    maxWidth: this.data.maxWidth || '100%',\n                    file: {\n                        url: this.data.url\n                    }\n                };\n                return saveData;\n            }\n            return {};\n        }\n    };\n}\n\n// Global function to handle image selection for the custom tool\nwindow.selectImageFromLibraryForBlock = function(element) {\n    // Store reference to the block element and find the tool instance\n    window.currentLibraryToolElement = element;\n    \n    // Find the EditorJS block that contains this element\n    let blockElement = element;\n    while (blockElement && !blockElement.classList.contains('ce-block')) {\n        blockElement = blockElement.parentElement;\n    }\n    \n    if (blockElement) {\n        // Store a reference to the block so we can update it later\n        window.currentLibraryBlock = blockElement;\n    }\n    \n    openFileManager('editor-library-tool');\n};\n\nasync function openImageLibraryForEditor() {\n    // Store reference to the current block being edited\n    currentEditorImageBlock = 'pending';\n    openFileManager('editor-image-replace');\n}\n\nasync function savePost() {\n    const title = document.getElementById('post-title').value;\n    let content = '';\n    \n    if (blockEditor) {\n        try {\n            const outputData = await blockEditor.save();\n            content = await convertBlocksToHtml(outputData.blocks);\n        } catch (error) {\n            console.error('Error saving editor content:', error);\n            content = '';\n        }\n    }\n    \n    const published = document.getElementById('post-published').checked;\n    const featuredImageId = document.getElementById('featured-image-id').value;\n    \n    if (!title.trim()) {\n        alert('Title is required');\n        return;\n    }\n    \n    const postData = {\n        title: title.trim(),\n        content: content.trim(),\n        published: published,\n        featured_image_id: featuredImageId || null,\n        update_slug: isEditingSlug\n    };\n    \n    try {\n        const url = currentPostId ? `/api/admin/posts/${currentPostId}` : '/api/admin/posts';\n        const method = currentPostId ? 'PUT' : 'POST';\n        \n        const response = await fetch(url, {\n            method: method,\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify(postData)\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to save post');\n        }\n        \n        const savedPost = await response.json();\n        \n        // Refresh posts list and go back to list view\n        await loadPosts();\n        showPostsList();\n        \n    } catch (error) {\n        alert('Error saving post: ' + error.message);\n    }\n}\n\nasync function deletePost(postId) {\n    if (!confirm('Are you sure you want to delete this post?')) {\n        return;\n    }\n    \n    try {\n        const response = await fetch(`/api/admin/posts/${postId}`, {\n            method: 'DELETE',\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to delete post');\n        }\n        \n        await loadPosts();\n    } catch (error) {\n        alert('Error deleting post: ' + error.message);\n    }\n}\n\nasync function handleImageUpload(e) {\n    const files = Array.from(e.target.files);\n    \n    if (files.length === 0) return;\n    \n    const uploadBtn = document.getElementById('upload-btn');\n    uploadBtn.disabled = true;\n    uploadBtn.innerHTML = '<span class=\"spinner\"></span> Uploading...';\n    \n    try {\n        for (const file of files) {\n            const formData = new FormData();\n            formData.append('image', file);\n            \n            const response = await fetch('/api/admin/upload', {\n                method: 'POST',\n                headers: {\n                    'Authorization': `Bearer ${authToken}`\n                },\n                body: formData\n            });\n            \n            if (!response.ok) {\n                throw new Error(`Failed to upload ${file.name}`);\n            }\n            \n            const imageData = await response.json();\n            uploadedImages.push(imageData);\n            addImagePreview(imageData);\n        }\n    } catch (error) {\n        alert('Error uploading images: ' + error.message);\n    } finally {\n        uploadBtn.disabled = false;\n        uploadBtn.textContent = 'Upload Images';\n        e.target.value = ''; // Reset file input\n    }\n}\n\nfunction addImagePreview(imageData) {\n    const previewContainer = document.getElementById('image-preview');\n    \n    const previewItem = document.createElement('div');\n    previewItem.className = 'image-preview-item';\n    previewItem.innerHTML = `\n        <img src=\"${imageData.b2_url}\" alt=\"${imageData.alt_text || imageData.original_filename}\">\n        <button class=\"remove-btn\" onclick=\"removeImagePreview(this, ${imageData.id})\">&times;</button>\n    `;\n    \n    previewContainer.appendChild(previewItem);\n}\n\nfunction removeImagePreview(button, imageId) {\n    button.parentElement.remove();\n    uploadedImages = uploadedImages.filter(img => img.id !== imageId);\n    \n    // TODO: Also delete from server if needed\n}\n\n// File Manager\nlet fileManagerMode = 'select'; // 'select', 'manage', or 'featured'\nlet allImages = [];\nlet selectedImages = [];\nlet featuredImageId = null;\n\nasync function openFileManager(mode = 'select') {\n    fileManagerMode = mode;\n    selectedImages = [];\n    \n    const modal = document.getElementById('file-manager-modal');\n    const title = document.getElementById('file-manager-title');\n    const selectBtn = document.getElementById('select-mode-btn');\n    const manageBtn = document.getElementById('manage-mode-btn');\n    \n    // Update UI based on mode\n    if (mode === 'select' || mode === 'featured' || mode === 'editor-image' || mode === 'editor-image-replace' || mode === 'editor-library-tool' || mode === 'homepage-gallery' || mode === 'about-profile') {\n        let titleText = 'Browse Image Library';\n        if (mode === 'featured') titleText = 'Select Featured Image';\n        if (mode === 'editor-image' || mode === 'editor-image-replace' || mode === 'editor-library-tool') titleText = 'Select Image for Editor';\n        if (mode === 'homepage-gallery') titleText = 'Add Images to Homepage Gallery';\n        if (mode === 'about-profile') titleText = 'Select Profile Image';\n        \n        title.textContent = titleText;\n        selectBtn.classList.add('btn-primary');\n        selectBtn.classList.remove('btn-secondary');\n        manageBtn.classList.add('btn-secondary');\n        manageBtn.classList.remove('btn-primary');\n        \n        // Hide mode switching toolbar for special modes\n        const toolbar = document.querySelector('.file-manager-toolbar');\n        if (mode === 'featured' || mode === 'editor-image' || mode === 'editor-image-replace' || mode === 'editor-library-tool' || mode === 'homepage-gallery' || mode === 'about-profile') {\n            toolbar.style.display = 'none';\n        } else {\n            toolbar.style.display = 'flex';\n        }\n    } else {\n        title.textContent = 'Manage Files';\n        selectBtn.classList.add('btn-secondary');\n        selectBtn.classList.remove('btn-primary');\n        manageBtn.classList.add('btn-primary');\n        manageBtn.classList.remove('btn-secondary');\n        \n        // Show toolbar\n        const toolbar = document.querySelector('.file-manager-toolbar');\n        toolbar.style.display = 'flex';\n    }\n    \n    modal.classList.add('active');\n    await loadImages();\n}\n\nfunction closeFileManager() {\n    document.getElementById('file-manager-modal').classList.remove('active');\n    selectedImages = [];\n    updateSelectedCount();\n}\n\nasync function loadImages() {\n    const grid = document.getElementById('file-manager-grid');\n    grid.innerHTML = '<div class=\"loading\">Loading images...</div>';\n    \n    try {\n        const response = await fetch('/api/admin/images', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to load images');\n        }\n        \n        allImages = await response.json();\n        renderImages(allImages);\n        \n    } catch (error) {\n        console.error('Error loading images:', error);\n        grid.innerHTML = '<div class=\"error-message\">Error loading images. Please try again.</div>';\n    }\n}\n\nfunction renderImages(images) {\n    const grid = document.getElementById('file-manager-grid');\n    \n    if (images.length === 0) {\n        grid.innerHTML = '<div class=\"loading\">No images found. Upload some images first.</div>';\n        return;\n    }\n    \n    const imagesHTML = images.map(image => {\n        const date = new Date(image.created_at).toLocaleDateString();\n        const fileSize = formatFileSize(image.file_size || 0);\n        \n        \n        return `\n            <div class=\"file-item ${fileManagerMode === 'manage' ? 'delete-mode' : ''}\" data-image-id=\"${image.id}\">\n                <img src=\"${image.b2_url}\" alt=\"${image.alt_text || image.original_filename}\" loading=\"lazy\">\n                ${fileManagerMode === 'select' ? \n                    `<input type=\"checkbox\" class=\"file-item-checkbox\">` : \n                    `<button class=\"file-item-delete\">&times;</button>`\n                }\n                <div class=\"file-item-info\">\n                    <div class=\"file-item-name\">${image.original_filename}</div>\n                    <div class=\"file-item-meta\">${date} • ${fileSize}</div>\n                </div>\n            </div>\n        `;\n    }).join('');\n    \n    grid.innerHTML = imagesHTML;\n    \n    // Add event listeners\n    setupFileItemListeners();\n    updateSelectedCount();\n}\n\nfunction setupFileItemListeners() {\n    const fileItems = document.querySelectorAll('.file-item');\n    \n    fileItems.forEach(item => {\n        if (fileManagerMode === 'select') {\n            const checkbox = item.querySelector('.file-item-checkbox');\n            \n            item.addEventListener('click', (e) => {\n                if (e.target === checkbox) return;\n                checkbox.checked = !checkbox.checked;\n                toggleImageSelection(item, checkbox.checked);\n            });\n            \n            checkbox.addEventListener('change', (e) => {\n                toggleImageSelection(item, e.target.checked);\n            });\n        } else {\n            const deleteBtn = item.querySelector('.file-item-delete');\n            \n            item.addEventListener('click', () => {\n                toggleImageSelection(item, !item.classList.contains('selected'));\n            });\n            \n            deleteBtn.addEventListener('click', (e) => {\n                e.stopPropagation();\n                const imageId = parseInt(item.dataset.imageId);\n                deleteImage(imageId);\n            });\n        }\n    });\n}\n\nfunction toggleImageSelection(item, selected) {\n    const imageId = parseInt(item.dataset.imageId);\n    \n    if (selected) {\n        item.classList.add('selected');\n        if (!selectedImages.includes(imageId)) {\n            selectedImages.push(imageId);\n        }\n    } else {\n        item.classList.remove('selected');\n        selectedImages = selectedImages.filter(id => id !== imageId);\n    }\n    \n    updateSelectedCount();\n}\n\nfunction updateSelectedCount() {\n    const countEl = document.getElementById('selected-count');\n    const selectBtn = document.getElementById('select-images-btn');\n    const deleteBtn = document.getElementById('delete-selected-btn');\n    \n    countEl.textContent = `${selectedImages.length} selected`;\n    \n    if (fileManagerMode === 'select' || fileManagerMode === 'featured' || fileManagerMode === 'editor-image' || fileManagerMode === 'editor-image-replace' || fileManagerMode === 'editor-library-tool' || fileManagerMode === 'homepage-gallery' || fileManagerMode === 'about-profile') {\n        selectBtn.style.display = selectedImages.length > 0 ? 'block' : 'none';\n        deleteBtn.style.display = 'none';\n        \n        // Update button text for different modes\n        if (fileManagerMode === 'featured') {\n            selectBtn.textContent = 'Set as Featured';\n        } else if (fileManagerMode === 'editor-image' || fileManagerMode === 'editor-image-replace' || fileManagerMode === 'editor-library-tool') {\n            selectBtn.textContent = 'Insert Image';\n        } else if (fileManagerMode === 'homepage-gallery') {\n            selectBtn.textContent = 'Add to Homepage Gallery';\n        } else if (fileManagerMode === 'about-profile') {\n            selectBtn.textContent = 'Set as Profile Image';\n        } else {\n            selectBtn.textContent = 'Add Selected';\n        }\n    } else {\n        selectBtn.style.display = 'none';\n        deleteBtn.style.display = selectedImages.length > 0 ? 'block' : 'none';\n    }\n}\n\nasync function deleteImage(imageId) {\n    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {\n        return;\n    }\n    \n    try {\n        const response = await fetch(`/api/admin/images/${imageId}`, {\n            method: 'DELETE',\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to delete image');\n        }\n        \n        // Remove from UI\n        const item = document.querySelector(`[data-image-id=\"${imageId}\"]`);\n        if (item) {\n            item.remove();\n        }\n        \n        // Remove from arrays\n        allImages = allImages.filter(img => img.id !== imageId);\n        selectedImages = selectedImages.filter(id => id !== imageId);\n        updateSelectedCount();\n        \n        showMessage('Image deleted successfully');\n        \n    } catch (error) {\n        console.error('Error deleting image:', error);\n        alert('Failed to delete image: ' + error.message);\n    }\n}\n\nfunction formatFileSize(bytes) {\n    if (bytes === 0) return '0 B';\n    const k = 1024;\n    const sizes = ['B', 'KB', 'MB', 'GB'];\n    const i = Math.floor(Math.log(bytes) / Math.log(k));\n    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];\n}\n\n// Featured Image Functions\nfunction setFeaturedImage(imageId, imageUrl) {\n    featuredImageId = imageId;\n    document.getElementById('featured-image-id').value = imageId;\n    \n    const preview = document.getElementById('featured-image-preview');\n    preview.innerHTML = `<img src=\"${imageUrl}\" alt=\"Featured image\">`;\n    \n    document.getElementById('remove-featured-btn').style.display = 'inline-block';\n}\n\nfunction setProfileImage(imageId, imageUrl) {\n    document.getElementById('about-profile-image-id').value = imageId;\n    \n    const preview = document.getElementById('current-profile-image');\n    preview.innerHTML = `<img src=\"${imageUrl}\" alt=\"Profile\" style=\"width: 100px; height: 100px; border-radius: 50%; object-fit: cover;\">`;\n}\n\nfunction removeFeaturedImage() {\n    featuredImageId = null;\n    document.getElementById('featured-image-id').value = '';\n    \n    const preview = document.getElementById('featured-image-preview');\n    preview.innerHTML = `\n        <div class=\"featured-image-placeholder\">\n            <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                <path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\"/>\n            </svg>\n        </div>\n    `;\n    \n    document.getElementById('remove-featured-btn').style.display = 'none';\n}\n\n// File Manager Mode Switching\nfunction switchFileManagerMode(mode) {\n    fileManagerMode = mode;\n    selectedImages = [];\n    \n    const selectBtn = document.getElementById('select-mode-btn');\n    const manageBtn = document.getElementById('manage-mode-btn');\n    const title = document.getElementById('file-manager-title');\n    \n    if (mode === 'select') {\n        title.textContent = 'Browse Image Library';\n        selectBtn.classList.add('btn-primary');\n        selectBtn.classList.remove('btn-secondary');\n        manageBtn.classList.add('btn-secondary');\n        manageBtn.classList.remove('btn-primary');\n    } else {\n        title.textContent = 'Manage Files';\n        selectBtn.classList.add('btn-secondary');\n        selectBtn.classList.remove('btn-primary');\n        manageBtn.classList.add('btn-primary');\n        manageBtn.classList.remove('btn-secondary');\n    }\n    \n    renderImages(allImages);\n}\n\n// File Manager Actions\nasync function selectImages() {\n    if (fileManagerMode === 'featured' && selectedImages.length > 0) {\n        // For featured image, only select the first one\n        const imageId = selectedImages[0];\n        const image = allImages.find(img => img.id === imageId);\n        if (image) {\n            setFeaturedImage(image.id, image.b2_url);\n        }\n        closeFileManager();\n    } else if (fileManagerMode === 'about-profile' && selectedImages.length > 0) {\n        // For profile image, only select the first one\n        const imageId = selectedImages[0];\n        const image = allImages.find(img => img.id === imageId);\n        if (image) {\n            setProfileImage(image.id, image.b2_url);\n        }\n        closeFileManager();\n    } else if ((fileManagerMode === 'editor-image' || fileManagerMode === 'editor-image-replace') && selectedImages.length > 0) {\n        // For editor image insertion, insert all selected images into editor\n        if (blockEditor) {\n            try {\n                if (fileManagerMode === 'editor-image-replace') {\n                    // For replacement mode, we need to replace the current image block\n                    // This is a simplified approach - in a full implementation you'd track the specific block\n                    alert('Image replacement functionality needs more complex implementation. For now, the images will be added as new blocks.');\n                }\n                \n                let blocksCount = await blockEditor.blocks.getBlocksCount();\n                \n                // Insert all selected images\n                for (const imageId of selectedImages) {\n                    const image = allImages.find(img => img.id === imageId);\n                    if (image) {\n                        blockEditor.blocks.insert('imageLibrary', {\n                            url: image.b2_url,\n                            caption: image.alt_text || '',\n                            file: {\n                                url: image.b2_url,\n                                size: image.file_size,\n                                name: image.original_filename,\n                                extension: image.original_filename.split('.').pop()\n                            },\n                            width: 'auto',\n                            maxWidth: '100%'\n                        }, {}, blocksCount);\n                        blocksCount++; // Increment for next insertion\n                    }\n                }\n            } catch (error) {\n                // Error handled silently\n            }\n        }\n        currentEditorImageBlock = null;\n        closeFileManager();\n    } else if (fileManagerMode === 'editor-library-tool' && selectedImages.length > 0) {\n        // For custom image library tool\n        const imageId = selectedImages[0];\n        const image = allImages.find(img => img.id === imageId);\n        if (image && window.currentLibraryToolInstance) {\n            // Update the tool instance data\n            window.currentLibraryToolInstance.data = {\n                url: image.b2_url,\n                caption: image.alt_text || '',\n                originalFilename: image.original_filename,\n                width: 'auto',\n                maxWidth: '100%'\n            };\n            \n            // Recreate the image with resizable functionality\n            window.currentLibraryToolInstance._createImage(image.b2_url, image.alt_text || '');\n            \n            // Trigger the EditorJS onChange event to mark the content as changed\n            if (blockEditor) {\n                try {\n                    // Trigger onChange by calling it directly\n                    const changeEvent = new Event('change');\n                    window.currentLibraryToolInstance.wrapper.dispatchEvent(changeEvent);\n                } catch (error) {\n                    // Could not trigger change event\n                }\n            }\n            \n        }\n        window.currentLibraryToolElement = null;\n        window.currentLibraryBlock = null;\n        closeFileManager();\n    } else if (fileManagerMode === 'homepage-gallery') {\n        // For homepage gallery, add images to the homepage gallery\n        await addImagesToHomepageGallery(selectedImages);\n        closeFileManager();\n    } else {\n        // For regular selection, add to post images\n        selectedImages.forEach(imageId => {\n            const image = allImages.find(img => img.id === imageId);\n            if (image) {\n                addImagePreview(image);\n            }\n        });\n        closeFileManager();\n    }\n}\n\nasync function deleteSelectedImages() {\n    if (selectedImages.length === 0) return;\n    \n    const confirmMsg = `Are you sure you want to delete ${selectedImages.length} image(s)? This action cannot be undone.`;\n    if (!confirm(confirmMsg)) return;\n    \n    try {\n        // Delete each selected image\n        for (const imageId of selectedImages) {\n            await fetch(`/api/admin/images/${imageId}`, {\n                method: 'DELETE',\n                headers: {\n                    'Authorization': `Bearer ${authToken}`\n                }\n            });\n            \n            // Remove from UI\n            const item = document.querySelector(`[data-image-id=\"${imageId}\"]`);\n            if (item) {\n                item.remove();\n            }\n        }\n        \n        // Update arrays\n        allImages = allImages.filter(img => !selectedImages.includes(img.id));\n        selectedImages = [];\n        updateSelectedCount();\n        \n        showMessage(`${selectedImages.length} image(s) deleted successfully`);\n        \n    } catch (error) {\n        console.error('Error deleting images:', error);\n        alert('Failed to delete some images: ' + error.message);\n    }\n}\n\n// Gallery Management Functions\n\n// Homepage Gallery Management Functions\nasync function loadGalleryAdmin() {\n    const galleryList = document.getElementById('gallery-list');\n    \n    galleryList.innerHTML = '<div class=\"loading\">Loading gallery...</div>';\n    \n    try {\n        const response = await fetch('/api/admin/gallery', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to load gallery');\n        }\n        \n        const galleryImages = await response.json();\n        renderGalleryAdmin(galleryImages);\n        \n    } catch (error) {\n        console.error('Error loading gallery:', error);\n        galleryList.innerHTML = '<div class=\"error-message\">Error loading gallery. Please try again.</div>';\n    }\n}\n\nfunction renderGalleryAdmin(images) {\n    const galleryList = document.getElementById('gallery-list');\n    \n    if (images.length === 0) {\n        galleryList.innerHTML = `\n            <div class=\"loading\">\n                <p>No images in gallery yet.</p>\n                <p>Click \"Add Images to Gallery\" to get started.</p>\n            </div>\n        `;\n        return;\n    }\n    \n    const imagesHTML = images.map(image => {\n        const date = new Date(image.created_at).toLocaleDateString();\n        \n        return `\n            <div class=\"gallery-admin-item\" data-gallery-id=\"${image.id}\">\n                <div class=\"gallery-admin-image\">\n                    <img src=\"${image.b2_url}\" alt=\"${image.alt_text || image.title || image.original_filename}\" loading=\"lazy\">\n                </div>\n                <div class=\"gallery-admin-info\">\n                    <h3>${image.title || image.original_filename}</h3>\n                    <p class=\"gallery-admin-description\">${image.description || 'No description'}</p>\n                    <div class=\"gallery-admin-meta\">\n                        Added: ${date} • Order: ${image.sort_order}\n                        ${!image.visible ? ' • <span class=\"hidden-badge\">Hidden</span>' : ''}\n                    </div>\n                </div>\n                <div class=\"gallery-admin-actions\">\n                    <button class=\"btn btn-small btn-outline\" onclick=\"viewExifData(${image.image_id})\">EXIF</button>\n                    <button class=\"btn btn-small btn-outline\" onclick=\"editGalleryItem(${image.id})\">Edit</button>\n                    <button class=\"btn btn-small btn-secondary\" onclick=\"toggleGalleryVisibility(${image.id}, ${image.visible})\">${image.visible ? 'Hide' : 'Show'}</button>\n                    <button class=\"btn btn-small btn-danger\" onclick=\"removeFromGallery(${image.id})\">Remove</button>\n                </div>\n            </div>\n        `;\n    }).join('');\n    \n    galleryList.innerHTML = `<div class=\"gallery-admin-grid\">${imagesHTML}</div>`;\n}\n\nasync function addImagesToHomepageGallery(imageIds) {\n    try {\n        for (const imageId of imageIds) {\n            await fetch('/api/admin/gallery', {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json',\n                    'Authorization': `Bearer ${authToken}`\n                },\n                body: JSON.stringify({ image_id: imageId })\n            });\n        }\n        \n        showMessage(`${imageIds.length} image(s) added to gallery`);\n        loadGalleryAdmin(); // Refresh the gallery view\n        \n    } catch (error) {\n        console.error('Error adding to gallery:', error);\n        alert('Failed to add some images to gallery: ' + error.message);\n    }\n}\n\nasync function removeFromGallery(galleryId) {\n    if (!confirm('Are you sure you want to remove this image from the gallery?')) {\n        return;\n    }\n    \n    try {\n        const response = await fetch(`/api/admin/gallery/${galleryId}`, {\n            method: 'DELETE',\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to remove from gallery');\n        }\n        \n        showMessage('Image removed from gallery');\n        loadGalleryAdmin(); // Refresh the gallery view\n        \n    } catch (error) {\n        console.error('Error removing from gallery:', error);\n        alert('Failed to remove image from gallery: ' + error.message);\n    }\n}\n\nasync function toggleGalleryVisibility(galleryId, currentVisibility) {\n    try {\n        const response = await fetch(`/api/admin/gallery/${galleryId}`, {\n            method: 'PUT',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify({ visible: !currentVisibility })\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to update visibility');\n        }\n        \n        showMessage(`Image ${!currentVisibility ? 'shown' : 'hidden'} in gallery`);\n        loadGalleryAdmin(); // Refresh the gallery view\n        \n    } catch (error) {\n        console.error('Error updating visibility:', error);\n        alert('Failed to update image visibility: ' + error.message);\n    }\n}\n\nfunction editGalleryItem(galleryId) {\n    // TODO: Implement edit functionality with modal\n    alert('Edit functionality coming soon!');\n}\n\nasync function viewExifData(imageId) {\n    try {\n        const response = await fetch(`/api/images/${imageId}/exif`);\n        \n        if (!response.ok) {\n            if (response.status === 404) {\n                alert('No EXIF data found for this image.');\n                return;\n            }\n            throw new Error('Failed to fetch EXIF data');\n        }\n        \n        const exifData = await response.json();\n        displayExifModal(exifData);\n        \n    } catch (error) {\n        console.error('Error fetching EXIF data:', error);\n        alert('Failed to load EXIF data: ' + error.message);\n    }\n}\n\nfunction displayExifModal(exifData) {\n    const modalHtml = `\n        <div id=\"exif-modal\" class=\"modal active\">\n            <div class=\"modal-content exif-modal-content\">\n                <div class=\"modal-header\">\n                    <h2>EXIF Data</h2>\n                    <button class=\"modal-close\" onclick=\"closeExifModal()\">&times;</button>\n                </div>\n                <div class=\"exif-content\">\n                    ${formatExifData(exifData)}\n                </div>\n            </div>\n        </div>\n    `;\n    \n    document.body.insertAdjacentHTML('beforeend', modalHtml);\n}\n\nfunction formatExifData(exif) {\n    const sections = [];\n    \n    // Camera Information\n    if (exif.camera_make || exif.camera_model) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h3>Camera</h3>\n                ${exif.camera_make ? `<p><strong>Make:</strong> ${exif.camera_make}</p>` : ''}\n                ${exif.camera_model ? `<p><strong>Model:</strong> ${exif.camera_model}</p>` : ''}\n            </div>\n        `);\n    }\n    \n    // Lens Information\n    if (exif.lens_make || exif.lens_model) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h3>Lens</h3>\n                ${exif.lens_make ? `<p><strong>Make:</strong> ${exif.lens_make}</p>` : ''}\n                ${exif.lens_model ? `<p><strong>Model:</strong> ${exif.lens_model}</p>` : ''}\n            </div>\n        `);\n    }\n    \n    // Photography Settings\n    const settings = [];\n    if (exif.focal_length) settings.push(`<p><strong>Focal Length:</strong> ${exif.focal_length}mm</p>`);\n    if (exif.focal_length_35mm) settings.push(`<p><strong>35mm Equivalent:</strong> ${exif.focal_length_35mm}mm</p>`);\n    if (exif.aperture) settings.push(`<p><strong>Aperture:</strong> f/${exif.aperture}</p>`);\n    if (exif.shutter_speed) settings.push(`<p><strong>Shutter Speed:</strong> ${exif.shutter_speed}</p>`);\n    if (exif.iso) settings.push(`<p><strong>ISO:</strong> ${exif.iso}</p>`);\n    if (exif.flash) settings.push(`<p><strong>Flash:</strong> ${exif.flash}</p>`);\n    \n    if (settings.length > 0) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h3>Camera Settings</h3>\n                ${settings.join('')}\n            </div>\n        `);\n    }\n    \n    // Location (GPS)\n    if (exif.gps_latitude && exif.gps_longitude) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h3>Location</h3>\n                <p><strong>Coordinates:</strong> ${exif.gps_latitude.toFixed(6)}, ${exif.gps_longitude.toFixed(6)}</p>\n                ${exif.gps_altitude ? `<p><strong>Altitude:</strong> ${exif.gps_altitude}m</p>` : ''}\n                <p><a href=\"https://www.google.com/maps?q=${exif.gps_latitude},${exif.gps_longitude}\" target=\"_blank\">View on Google Maps</a></p>\n            </div>\n        `);\n    }\n    \n    // Date and Other Info\n    const otherInfo = [];\n    if (exif.date_taken) {\n        const date = new Date(exif.date_taken).toLocaleString();\n        otherInfo.push(`<p><strong>Date Taken:</strong> ${date}</p>`);\n    }\n    if (exif.software) otherInfo.push(`<p><strong>Software:</strong> ${exif.software}</p>`);\n    if (exif.artist) otherInfo.push(`<p><strong>Artist:</strong> ${exif.artist}</p>`);\n    if (exif.copyright) otherInfo.push(`<p><strong>Copyright:</strong> ${exif.copyright}</p>`);\n    \n    if (otherInfo.length > 0) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h3>Other Information</h3>\n                ${otherInfo.join('')}\n            </div>\n        `);\n    }\n    \n    if (sections.length === 0) {\n        return '<p>No EXIF data available.</p>';\n    }\n    \n    return sections.join('');\n}\n\nfunction closeExifModal() {\n    const modal = document.getElementById('exif-modal');\n    if (modal) {\n        modal.remove();\n    }\n}\n\n// About Page Management Functions\nasync function loadAboutAdmin() {\n    const aboutForm = document.getElementById('about-form');\n    const saveAboutBtn = document.getElementById('save-about-btn');\n    \n    aboutForm.innerHTML = '<div class=\"loading\">Loading about page...</div>';\n    \n    try {\n        const response = await fetch('/api/admin/about', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to load about page');\n        }\n        \n        const aboutData = await response.json();\n        renderAboutForm(aboutData);\n        \n        // Setup save button listener\n        saveAboutBtn.onclick = () => saveAboutPage();\n        \n    } catch (error) {\n        console.error('Error loading about page:', error);\n        aboutForm.innerHTML = '<div class=\"error\">Failed to load about page. Please try again.</div>';\n    }\n}\n\nfunction renderAboutForm(aboutData) {\n    const aboutForm = document.getElementById('about-form');\n    \n    aboutForm.innerHTML = `\n        <div class=\"form-grid\">\n            <div class=\"form-group\">\n                <label for=\"about-title\">Title:</label>\n                <input type=\"text\" id=\"about-title\" value=\"${aboutData.title || ''}\" required>\n            </div>\n            \n            <div class=\"form-group\">\n                <label for=\"about-lead\">Lead Text:</label>\n                <textarea id=\"about-lead\" rows=\"3\" placeholder=\"A brief introduction or tagline...\">${aboutData.lead_text || ''}</textarea>\n            </div>\n            \n            <div class=\"form-group\">\n                <label for=\"about-content\">Content:</label>\n                <textarea id=\"about-content\" rows=\"10\" placeholder=\"Main about content...\">${aboutData.content || ''}</textarea>\n            </div>\n            \n            <div class=\"form-group\">\n                <label for=\"about-profile-image\">Profile Image:</label>\n                <div class=\"profile-image-section\">\n                    <div id=\"current-profile-image\" class=\"current-image\">\n                        ${aboutData.profile_image_url ? \n                            `<img src=\"${aboutData.profile_image_url}\" alt=\"Profile\" style=\"width: 100px; height: 100px; border-radius: 50%; object-fit: cover;\">` \n                            : '<div class=\"no-image\">No profile image selected</div>'\n                        }\n                    </div>\n                    <div class=\"image-actions\">\n                        <button type=\"button\" id=\"select-profile-btn\" class=\"btn btn-outline\">Select Image</button>\n                        <button type=\"button\" id=\"remove-profile-btn\" class=\"btn btn-outline\">Remove</button>\n                        <input type=\"hidden\" id=\"about-profile-image-id\" value=\"${aboutData.profile_image_id || ''}\">\n                    </div>\n                </div>\n            </div>\n        </div>\n    `;\n    \n    // Setup profile image selection\n    document.getElementById('select-profile-btn').onclick = () => openFileManager('about-profile');\n    document.getElementById('remove-profile-btn').onclick = () => removeProfileImage();\n}\n\nasync function saveAboutPage() {\n    const saveBtn = document.getElementById('save-about-btn');\n    const originalText = saveBtn.textContent;\n    \n    saveBtn.textContent = 'Saving...';\n    saveBtn.disabled = true;\n    \n    try {\n        const aboutData = {\n            title: document.getElementById('about-title').value,\n            lead_text: document.getElementById('about-lead').value,\n            content: document.getElementById('about-content').value,\n            profile_image_id: document.getElementById('about-profile-image-id').value || null\n        };\n        \n        const response = await fetch('/api/admin/about', {\n            method: 'PUT',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify(aboutData)\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to save about page');\n        }\n        \n        saveBtn.textContent = 'Saved!';\n        setTimeout(() => {\n            saveBtn.textContent = originalText;\n            saveBtn.disabled = false;\n        }, 2000);\n        \n    } catch (error) {\n        console.error('Error saving about page:', error);\n        saveBtn.textContent = 'Error - Try Again';\n        saveBtn.disabled = false;\n        setTimeout(() => {\n            saveBtn.textContent = originalText;\n        }, 3000);\n    }\n}\n\nfunction removeProfileImage() {\n    document.getElementById('current-profile-image').innerHTML = '<div class=\"no-image\">No profile image selected</div>';\n    document.getElementById('about-profile-image-id').value = '';\n}\n\n// Image Library Management Functions\nasync function loadImagesLibrary(searchQuery = '') {\n    const imagesList = document.getElementById('images-list');\n    \n    imagesList.innerHTML = '<div class=\"loading\">Loading images...</div>';\n    \n    try {\n        const url = new URL('/api/admin/images', window.location.origin);\n        if (searchQuery.trim()) {\n            url.searchParams.set('search', searchQuery.trim());\n        }\n        \n        const response = await fetch(url, {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to load images');\n        }\n        \n        const images = await response.json();\n        renderImagesLibrary(images);\n        \n    } catch (error) {\n        console.error('Error loading images:', error);\n        imagesList.innerHTML = '<div class=\"error-message\">Error loading images. Please try again.</div>';\n    }\n}\n\n// Debounced search function\nlet searchTimeout;\nfunction filterImages() {\n    clearTimeout(searchTimeout);\n    searchTimeout = setTimeout(() => {\n        const searchTerm = document.getElementById('images-search').value;\n        loadImagesLibrary(searchTerm);\n    }, 300); // Wait 300ms after user stops typing\n}\n\nasync function renderImagesLibrary(images) {\n    const imagesList = document.getElementById('images-list');\n    \n    if (images.length === 0) {\n        imagesList.innerHTML = `\n            <div class=\"loading\">\n                <p>No images found.</p>\n                <p>Try adjusting your search or upload new images.</p>\n            </div>\n        `;\n        return;\n    }\n    \n    const imagesHTML = images.map(image => {\n        const date = new Date(image.created_at).toLocaleDateString();\n        const fileSize = formatFileSize(image.file_size || 0);\n        const hasExif = image.camera_make || image.camera_model || image.lens_make || image.lens_model;\n        \n        // Build EXIF info display\n        const exifInfo = [];\n        if (image.camera_make && image.camera_model) {\n            exifInfo.push(`${image.camera_make} ${image.camera_model}`);\n        } else if (image.camera_model) {\n            exifInfo.push(image.camera_model);\n        }\n        \n        if (image.lens_make && image.lens_model) {\n            exifInfo.push(`${image.lens_make} ${image.lens_model}`);\n        } else if (image.lens_model) {\n            exifInfo.push(image.lens_model);\n        }\n        \n        if (image.focal_length) {\n            exifInfo.push(`${image.focal_length}mm`);\n        }\n        \n        if (image.aperture) {\n            exifInfo.push(`f/${image.aperture}`);\n        }\n        \n        if (image.iso) {\n            exifInfo.push(`ISO ${image.iso}`);\n        }\n        \n        const exifDisplay = exifInfo.length > 0 ? exifInfo.join(' • ') : '';\n        \n        return `\n            <div class=\"gallery-admin-item\" data-image-id=\"${image.id}\">\n                <div class=\"gallery-admin-image\">\n                    <img src=\"${image.b2_url}\" alt=\"${image.alt_text || image.original_filename}\" loading=\"lazy\">\n                </div>\n                <div class=\"gallery-admin-info\">\n                    <h3>${image.original_filename}</h3>\n                    <p class=\"gallery-admin-description\">${image.alt_text || 'No description'}</p>\n                    ${exifDisplay ? `<p class=\"gallery-admin-exif\" style=\"font-size: 0.8rem; color: #666; margin: 0.25rem 0;\">${exifDisplay}</p>` : ''}\n                    <div class=\"gallery-admin-meta\">\n                        Uploaded: ${date} • ${fileSize}\n                        ${image.width && image.height ? ` • ${image.width}×${image.height}` : ''}\n                        ${hasExif ? ' • <span style=\"color: #28a745;\">Has EXIF</span>' : ' • <span style=\"color: #dc3545;\">No EXIF</span>'}\n                    </div>\n                </div>\n                <div class=\"gallery-admin-actions\">\n                    <button class=\"btn btn-small btn-outline\" onclick=\"viewExifData(${image.id})\">EXIF</button>\n                    <button class=\"btn btn-small btn-outline\" onclick=\"editImageDetails(${image.id})\">Edit</button>\n                    <button class=\"btn btn-small btn-danger\" onclick=\"deleteImageFromLibrary(${image.id})\">Delete</button>\n                </div>\n            </div>\n        `;\n    }).join('');\n    \n    imagesList.innerHTML = `<div class=\"gallery-admin-grid\">${imagesHTML}</div>`;\n}\n\nasync function handleBulkImageUpload(e) {\n    const files = Array.from(e.target.files);\n    \n    if (files.length === 0) return;\n    \n    const uploadBtn = document.getElementById('upload-images-btn');\n    const originalText = uploadBtn.textContent;\n    uploadBtn.disabled = true;\n    uploadBtn.innerHTML = '<span class=\"spinner\"></span> Uploading...';\n    \n    try {\n        let successCount = 0;\n        let failCount = 0;\n        \n        for (const file of files) {\n            try {\n                const formData = new FormData();\n                formData.append('image', file);\n                \n                const response = await fetch('/api/admin/upload', {\n                    method: 'POST',\n                    headers: {\n                        'Authorization': `Bearer ${authToken}`\n                    },\n                    body: formData\n                });\n                \n                if (response.ok) {\n                    successCount++;\n                } else {\n                    failCount++;\n                    console.error(`Failed to upload ${file.name}`);\n                }\n            } catch (error) {\n                failCount++;\n                console.error(`Error uploading ${file.name}:`, error);\n            }\n        }\n        \n        showMessage(`Uploaded ${successCount} image(s)${failCount > 0 ? `, ${failCount} failed` : ''}`);\n        loadImagesLibrary(); // Refresh the images list\n        \n    } catch (error) {\n        console.error('Error in bulk upload:', error);\n        showMessage('Error uploading images', 'error');\n    } finally {\n        uploadBtn.disabled = false;\n        uploadBtn.textContent = originalText;\n        e.target.value = ''; // Reset file input\n    }\n}\n\nasync function deleteImageFromLibrary(imageId) {\n    if (!confirm('Are you sure you want to delete this image? This action cannot be undone and will remove it from all posts and galleries.')) {\n        return;\n    }\n    \n    try {\n        const response = await fetch(`/api/admin/images/${imageId}`, {\n            method: 'DELETE',\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to delete image');\n        }\n        \n        showMessage('Image deleted successfully');\n        loadImagesLibrary(); // Refresh the images list\n        \n    } catch (error) {\n        console.error('Error deleting image:', error);\n        alert('Failed to delete image: ' + error.message);\n    }\n}\n\nfunction editImageDetails(imageId) {\n    // TODO: Implement edit functionality with modal\n    alert('Edit functionality coming soon!');\n}\n\nasync function updateExifForAllImages() {\n    const confirmMsg = 'This will scan all images in your library and extract EXIF data for any images that don\\'t have it yet. This may take several minutes depending on the number of images. Continue?';\n    \n    if (!confirm(confirmMsg)) {\n        return;\n    }\n    \n    const updateBtn = document.getElementById('update-exif-btn');\n    const originalText = updateBtn.textContent;\n    updateBtn.disabled = true;\n    updateBtn.innerHTML = '<span class=\"spinner\"></span> Processing...';\n    \n    try {\n        const response = await fetch('/api/admin/update-exif', {\n            method: 'POST',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to update EXIF data');\n        }\n        \n        const result = await response.json();\n        \n        if (result.success) {\n            const message = result.total === 0 \n                ? 'All images already have EXIF data!'\n                : `EXIF update completed!\\n\\nProcessed: ${result.processed}\\nFailed: ${result.failed}\\nTotal checked: ${result.total}`;\n            \n            alert(message);\n            \n            // Refresh the images library to show any updated data\n            if (document.getElementById('images-section').classList.contains('active')) {\n                loadImagesLibrary();\n            }\n        } else {\n            throw new Error(result.error || 'Unknown error occurred');\n        }\n        \n    } catch (error) {\n        console.error('Error updating EXIF data:', error);\n        alert('Failed to update EXIF data: ' + error.message);\n    } finally {\n        updateBtn.disabled = false;\n        updateBtn.textContent = originalText;\n    }\n}\n\nasync function migrateImagesToFolder() {\n    const confirmMsg = 'This will organize all your existing images into a proper folder structure (blog/images/year/month/) in your S3 bucket and update all references. This may take several minutes. Continue?';\n    \n    if (!confirm(confirmMsg)) {\n        return;\n    }\n    \n    const migrateBtn = document.getElementById('migrate-images-btn');\n    const originalText = migrateBtn.textContent;\n    migrateBtn.disabled = true;\n    migrateBtn.innerHTML = '<span class=\"spinner\"></span> Organizing...';\n    \n    try {\n        const response = await fetch('/api/admin/migrate-images', {\n            method: 'POST',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to migrate images');\n        }\n        \n        const result = await response.json();\n        \n        if (result.success) {\n            const message = result.total === 0 \n                ? 'All images are already organized!'\n                : `File organization completed!\\n\\nMigrated: ${result.migrated}\\nFailed: ${result.failed}\\nTotal: ${result.total}\\n\\nYour images are now organized by date in the blog/images/ folder.`;\n            \n            alert(message);\n            \n            // Refresh the images library to show updated file paths\n            if (document.getElementById('images-section').classList.contains('active')) {\n                loadImagesLibrary();\n            }\n        } else {\n            throw new Error(result.error || 'Migration failed');\n        }\n        \n    } catch (error) {\n        console.error('Error migrating images:', error);\n        alert('Failed to organize images: ' + error.message);\n    } finally {\n        migrateBtn.disabled = false;\n        migrateBtn.textContent = originalText;\n    }\n}\n\n// S3 Bucket Browser Functions\nlet bucketData = { files: [], folders: [], currentPath: '', stats: {} };\nlet allBucketFiles = [];\nlet filteredBucketFiles = [];\nlet selectedBucketFiles = [];\nlet currentPath = '';\n\nasync function testB2Connection() {\n    const testBtn = document.getElementById('test-b2-btn');\n    const originalText = testBtn.textContent;\n    \n    testBtn.disabled = true;\n    testBtn.textContent = 'Testing...';\n    \n    // First, test if the server is responding at all\n    try {\n        const basicTest = await fetch('/api/admin/posts', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!basicTest.ok && basicTest.status === 404) {\n            alert('❌ Server Error: API endpoints not responding. Is the server running?');\n            return;\n        }\n    } catch (networkError) {\n        alert(`❌ Network Error: ${networkError.message}\\n\\nIs the server running?`);\n        return;\n    }\n    \n    try {\n        const response = await fetch('/api/admin/bucket-files?test=true', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        // Get the raw response text first\n        const responseText = await response.text();\n        \n        // Try to parse as JSON\n        let result;\n        try {\n            result = JSON.parse(responseText);\n        } catch (parseError) {\n            alert(`❌ Server Response Error:\n            \nStatus: ${response.status}\nResponse: ${responseText.substring(0, 500)}...\n\nThis suggests a server-side error. Check the server logs.`);\n            return;\n        }\n        \n        if (response.ok && result.success) {\n            const message = `✅ B2 Connection Successful!\n            \nAccount ID: ${result.accountId}\nConfigured Bucket: ${result.configuredBucket}\nAllowed Bucket: ${result.allowedBucket}\nBucket Match: ${result.bucketMatch ? '✅ Yes' : '❌ No'}\n\nAPI URL: ${result.apiUrl}\nDownload URL: ${result.downloadUrl}`;\n            \n            alert(message);\n            \n            if (!result.bucketMatch) {\n                alert('⚠️ Warning: Your B2 Application Key is not authorized for the configured bucket ID. This is likely the cause of the 401 error.');\n            }\n        } else {\n            const errorMsg = `❌ B2 Connection Failed:\n            \nError: ${result.error}\nDetails: ${JSON.stringify(result.details, null, 2)}`;\n            alert(errorMsg);\n        }\n        \n    } catch (error) {\n        alert(`❌ B2 Test Failed: ${error.message}`);\n    } finally {\n        testBtn.disabled = false;\n        testBtn.textContent = originalText;\n    }\n}\n\nasync function loadBucketFiles(path = currentPath) {\n    const bucketList = document.getElementById('bucket-list');\n    const refreshBtn = document.getElementById('refresh-bucket-btn');\n    const filter = document.getElementById('file-type-filter').value;\n    \n    bucketList.innerHTML = '<div class=\"loading\">Browsing S3 bucket...</div>';\n    refreshBtn.disabled = true;\n    refreshBtn.innerHTML = '<span class=\"spinner\"></span> Loading...';\n    \n    try {\n        const url = new URL('/api/admin/bucket-files', window.location.origin);\n        if (path) url.searchParams.set('prefix', path);\n        if (filter) url.searchParams.set('filter', filter);\n        \n        const response = await fetch(url, {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to browse bucket');\n        }\n        \n        bucketData = await response.json();\n        currentPath = bucketData.currentPath || '';\n        allBucketFiles = bucketData.files || [];\n        filteredBucketFiles = [...allBucketFiles];\n        selectedBucketFiles = [];\n        \n        updateBreadcrumb();\n        updateStats();\n        renderBucketFiles();\n        \n    } catch (error) {\n        console.error('Error browsing bucket:', error);\n        bucketList.innerHTML = '<div class=\"error-message\">Error browsing bucket. Please try again.</div>';\n    } finally {\n        refreshBtn.disabled = false;\n        refreshBtn.textContent = 'Refresh';\n    }\n}\n\nfunction updateBreadcrumb() {\n    const breadcrumb = document.getElementById('current-path');\n    const pathDisplay = currentPath || '/';\n    \n    if (currentPath) {\n        // Create clickable breadcrumb\n        const parts = currentPath.split('/').filter(p => p);\n        let breadcrumbHTML = '<a href=\"#\" onclick=\"navigateToPath(\\'\\')\">Root</a>';\n        \n        let currentPathBuild = '';\n        parts.forEach((part, index) => {\n            currentPathBuild += part + '/';\n            breadcrumbHTML += ` / <a href=\"#\" onclick=\"navigateToPath('${currentPathBuild}')\">${part}</a>`;\n        });\n        \n        breadcrumb.innerHTML = breadcrumbHTML;\n    } else {\n        breadcrumb.textContent = '/';\n    }\n}\n\nfunction updateStats() {\n    document.getElementById('file-count').textContent = `${filteredBucketFiles.length} files`;\n    document.getElementById('selected-count').textContent = `${selectedBucketFiles.length} selected`;\n    document.getElementById('import-ready-count').textContent = `${filteredBucketFiles.filter(f => f.canImport).length} can be imported`;\n}\n\nfunction navigateToPath(path) {\n    currentPath = path;\n    loadBucketFiles(path);\n}\n\nfunction renderBucketFiles() {\n    const bucketList = document.getElementById('bucket-list');\n    \n    if (bucketData.folders.length === 0 && filteredBucketFiles.length === 0) {\n        bucketList.innerHTML = `\n            <div class=\"loading\">\n                <p>No files found in this directory.</p>\n                <p>Try navigating to a different folder or changing the filter.</p>\n            </div>\n        `;\n        return;\n    }\n    \n    let itemsHTML = '';\n    \n    // Add parent directory link if not at root\n    if (currentPath) {\n        const parentPath = currentPath.split('/').slice(0, -2).join('/');\n        const parentPathWithSlash = parentPath ? parentPath + '/' : '';\n        \n        itemsHTML += `\n            <div class=\"gallery-admin-item folder-item\" onclick=\"navigateToPath('${parentPathWithSlash}')\">\n                <div class=\"gallery-admin-image\" style=\"display: flex; align-items: center; justify-content: center; background: #e9ecef;\">\n                    <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"#666\">\n                        <path d=\"M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z\"/>\n                        <path d=\"M15 13l-4-4v3H7v2h4v3l4-4z\"/>\n                    </svg>\n                </div>\n                <div class=\"gallery-admin-info\">\n                    <h3>.. (Parent Directory)</h3>\n                    <p class=\"gallery-admin-description\">Go up one level</p>\n                </div>\n            </div>\n        `;\n    }\n    \n    // Add folders\n    bucketData.folders.forEach(folder => {\n        itemsHTML += `\n            <div class=\"gallery-admin-item folder-item\" onclick=\"navigateToPath('${folder.path}')\">\n                <div class=\"gallery-admin-image\" style=\"display: flex; align-items: center; justify-content: center; background: #e9ecef;\">\n                    <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"#666\">\n                        <path d=\"M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z\"/>\n                    </svg>\n                </div>\n                <div class=\"gallery-admin-info\">\n                    <h3>📁 ${folder.name}</h3>\n                    <p class=\"gallery-admin-description\">Folder</p>\n                </div>\n            </div>\n        `;\n    });\n    \n    // Add files\n    filteredBucketFiles.forEach(file => {\n        const uploadDate = new Date(file.uploadTimestamp).toLocaleDateString();\n        const fileSize = formatFileSize(file.contentLength || 0);\n        const statusClass = file.isImported ? 'imported' : file.canImport ? 'importable' : 'non-image';\n        const statusText = file.isImported ? 'Already imported' : file.canImport ? 'Ready to import' : 'Not an image';\n        const statusColor = file.isImported ? '#666' : file.canImport ? '#28a745' : '#dc3545';\n        \n        itemsHTML += `\n            <div class=\"gallery-admin-item bucket-file-item ${statusClass}\" data-file-id=\"${file.fileId}\">\n                <div class=\"gallery-admin-image\">\n                    ${file.isImage ? \n                        `<img src=\"${file.url}\" alt=\"${file.displayName}\" loading=\"lazy\" onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\">\n                         <div style=\"display: none; align-items: center; justify-content: center; background: #f0f0f0; width: 100%; height: 100%;\">\n                            <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"#999\">\n                                <path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\"/>\n                            </svg>\n                         </div>` :\n                        `<div style=\"display: flex; align-items: center; justify-content: center; background: #f0f0f0; width: 100%; height: 100%;\">\n                            <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"#999\">\n                                <path d=\"M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z\"/>\n                            </svg>\n                         </div>`\n                    }\n                    ${file.canImport ? '<input type=\"checkbox\" class=\"bucket-file-checkbox\" style=\"position: absolute; top: 0.5rem; left: 0.5rem; width: 20px; height: 20px;\">' : ''}\n                </div>\n                <div class=\"gallery-admin-info\">\n                    <h3>${file.displayName}</h3>\n                    <p class=\"gallery-admin-description\" style=\"color: ${statusColor};\">${statusText}</p>\n                    <div class=\"gallery-admin-meta\">\n                        Uploaded: ${uploadDate} • ${fileSize}\n                        ${file.contentType ? ` • ${file.contentType}` : ''}\n                    </div>\n                </div>\n                <div class=\"gallery-admin-actions\">\n                    ${file.isImage ? `<button class=\"btn btn-small btn-outline\" onclick=\"previewBucketFile('${file.url}')\">Preview</button>` : ''}\n                    ${file.canImport ? `<button class=\"btn btn-small btn-secondary\" onclick=\"importSingleFile('${file.fileId}')\">Import</button>` : ''}\n                </div>\n            </div>\n        `;\n    });\n    \n    bucketList.innerHTML = `<div class=\"gallery-admin-grid\">${itemsHTML}</div>`;\n    \n    // Add event listeners for checkboxes\n    setupBucketFileListeners();\n    updateImportButton();\n}\n\nfunction setupBucketFileListeners() {\n    const fileItems = document.querySelectorAll('.bucket-file-item');\n    \n    fileItems.forEach((item) => {\n        const checkbox = item.querySelector('.bucket-file-checkbox');\n        if (!checkbox) return; // Skip items without checkboxes (already imported, etc.)\n        \n        const fileId = item.dataset.fileId;\n        \n        // Click on item to toggle checkbox\n        item.addEventListener('click', (e) => {\n            if (e.target === checkbox) return;\n            if (e.target.tagName === 'BUTTON') return; // Skip button clicks\n            checkbox.checked = !checkbox.checked;\n            toggleBucketFileSelection(fileId, checkbox.checked);\n        });\n        \n        // Checkbox change\n        checkbox.addEventListener('change', (e) => {\n            toggleBucketFileSelection(fileId, e.target.checked);\n        });\n    });\n}\n\nfunction toggleBucketFileSelection(fileId, selected) {\n    if (selected) {\n        if (!selectedBucketFiles.includes(fileId)) {\n            selectedBucketFiles.push(fileId);\n        }\n    } else {\n        selectedBucketFiles = selectedBucketFiles.filter(id => id !== fileId);\n    }\n    \n    updateImportButton();\n}\n\nfunction updateImportButton() {\n    const importBtn = document.getElementById('import-selected-btn');\n    \n    if (selectedBucketFiles.length > 0) {\n        importBtn.style.display = 'inline-block';\n        importBtn.textContent = `Import ${selectedBucketFiles.length} Selected`;\n    } else {\n        importBtn.style.display = 'none';\n    }\n    \n    updateStats();\n}\n\n// Debounced search function for bucket files\nlet bucketSearchTimeout;\nfunction filterBucketFiles() {\n    clearTimeout(bucketSearchTimeout);\n    bucketSearchTimeout = setTimeout(() => {\n        const searchTerm = document.getElementById('bucket-search').value.toLowerCase();\n        \n        if (searchTerm.trim()) {\n            filteredBucketFiles = allBucketFiles.filter(file => \n                file.displayName.toLowerCase().includes(searchTerm) ||\n                file.contentType.toLowerCase().includes(searchTerm)\n            );\n        } else {\n            filteredBucketFiles = [...allBucketFiles];\n        }\n        \n        selectedBucketFiles = []; // Clear selections when filtering\n        renderBucketFiles();\n    }, 300);\n}\n\nasync function importSingleFile(fileId) {\n    if (!confirm('Import this file into your Image Library with EXIF extraction?')) {\n        return;\n    }\n    \n    try {\n        const response = await fetch('/api/admin/import-files', {\n            method: 'POST',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify({ fileIds: [fileId] })\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to import file');\n        }\n        \n        const result = await response.json();\n        \n        if (result.success && result.imported > 0) {\n            showMessage('File imported successfully!');\n            // Refresh the current view to update status\n            loadBucketFiles();\n        } else {\n            throw new Error(result.error || 'Import failed');\n        }\n        \n    } catch (error) {\n        console.error('Error importing file:', error);\n        alert('Failed to import file: ' + error.message);\n    }\n}\n\nasync function importSelectedFiles() {\n    if (selectedBucketFiles.length === 0) {\n        alert('Please select files to import');\n        return;\n    }\n    \n    const confirmMsg = `Import ${selectedBucketFiles.length} selected file(s) into your Image Library? EXIF data will be extracted during import.`;\n    \n    if (!confirm(confirmMsg)) {\n        return;\n    }\n    \n    const importBtn = document.getElementById('import-selected-btn');\n    const originalText = importBtn.textContent;\n    importBtn.disabled = true;\n    importBtn.innerHTML = '<span class=\"spinner\"></span> Importing...';\n    \n    try {\n        const response = await fetch('/api/admin/import-files', {\n            method: 'POST',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify({ fileIds: selectedBucketFiles })\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to import files');\n        }\n        \n        const result = await response.json();\n        \n        if (result.success) {\n            const message = `Import completed!\\n\\nImported: ${result.imported}\\nFailed: ${result.failed}\\nTotal: ${result.total}`;\n            alert(message);\n            \n            // Clear selections and refresh the bucket list\n            selectedBucketFiles = [];\n            loadBucketFiles();\n            \n        } else {\n            throw new Error(result.error || 'Import failed');\n        }\n        \n    } catch (error) {\n        console.error('Error importing files:', error);\n        alert('Failed to import files: ' + error.message);\n    } finally {\n        importBtn.disabled = false;\n        importBtn.textContent = originalText;\n        updateImportButton();\n    }\n}\n\nfunction previewBucketFile(url) {\n    window.open(url, '_blank');\n}\n\n// Utility functions\nfunction showMessage(message, type = 'success') {\n    const messageEl = document.createElement('div');\n    messageEl.className = `${type}-message`;\n    messageEl.textContent = message;\n    \n    // Find a good place to show the message\n    const header = document.querySelector('.section-header');\n    if (header) {\n        header.appendChild(messageEl);\n        setTimeout(() => messageEl.remove(), 3000);\n    }\n}\n\n// AI Writing Assistant Functionality\nlet currentAIMode = 'story';\nlet aiAssistantInitialized = false;\n\nfunction initializeAIAssistant() {\n    if (aiAssistantInitialized) return;\n    \n    // Initialize AI mode buttons\n    const aiModeButtons = document.querySelectorAll('.ai-mode-btn');\n    aiModeButtons.forEach(btn => {\n        btn.addEventListener('click', (e) => {\n            e.preventDefault();\n            e.stopPropagation();\n            aiModeButtons.forEach(b => b.classList.remove('active'));\n            btn.classList.add('active');\n            currentAIMode = btn.dataset.mode;\n        });\n    });\n    \n    // Initialize AI action buttons\n    document.getElementById('ai-describe-images')?.addEventListener('click', (e) => {\n        e.preventDefault();\n        e.stopPropagation();\n        handleAIAction('describe-images');\n    });\n    document.getElementById('ai-exif-story')?.addEventListener('click', (e) => {\n        e.preventDefault();\n        e.stopPropagation();\n        handleAIAction('exif-story');\n    });\n    document.getElementById('ai-improve-text')?.addEventListener('click', (e) => {\n        e.preventDefault();\n        e.stopPropagation();\n        handleAIAction('improve-text');\n    });\n    document.getElementById('ai-expand-content')?.addEventListener('click', (e) => {\n        e.preventDefault();\n        e.stopPropagation();\n        handleAIAction('expand-content');\n    });\n    \n    // Initialize AI toggle\n    document.getElementById('ai-toggle')?.addEventListener('click', (e) => {\n        e.preventDefault();\n        e.stopPropagation();\n        toggleAIAssistant();\n    });\n    \n    aiAssistantInitialized = true;\n}\n\nfunction toggleAIAssistant() {\n    const aiContent = document.getElementById('ai-content');\n    const aiToggle = document.getElementById('ai-toggle');\n    \n    if (aiContent.style.display === 'none') {\n        aiContent.style.display = 'flex';\n        aiToggle.innerHTML = '<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z\"/></svg>';\n    } else {\n        aiContent.style.display = 'none';\n        aiToggle.innerHTML = '<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M7 10l5 5 5-5z\"/></svg>';\n    }\n}\n\nasync function handleAIAction(action) {\n    try {\n        showAILoading(true);\n        \n        let requestData = {\n            action: action,\n            mode: currentAIMode\n        };\n        \n        // Get content based on action type\n        if (action === 'improve-text' || action === 'expand-content') {\n            const content = await getEditorContent();\n            if (!content || content.trim().length === 0) {\n                showAIResponse('Please write some content first, then try to improve or expand it.');\n                return;\n            }\n            requestData.content = content;\n        } else if (action === 'describe-images') {\n            const images = await getSelectedImagesForAI();\n            if (images.length === 0) {\n                showAIResponse('Please add some images to your post first, then try describing them.');\n                return;\n            }\n            requestData.images = images;\n        } else if (action === 'exif-story') {\n            const images = await getSelectedImagesForAI();\n            if (images.length === 0) {\n                showAIResponse('Please add some images to your post first to generate an EXIF-based story.');\n                return;\n            }\n            \n            // Get EXIF data for the images\n            const exifData = await getEXIFDataForImages(images);\n            requestData.exifData = exifData;\n            requestData.images = images;\n        }\n        \n        // Call AI API\n        const response = await fetch('/api/admin/ai-assist', {\n            method: 'POST',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify(requestData)\n        });\n        \n        if (!response.ok) {\n            const errorData = await response.json();\n            throw new Error(errorData.error || 'AI request failed');\n        }\n        \n        const result = await response.json();\n        showAIResponse(result.content, action);\n        \n    } catch (error) {\n        showAIResponse(`Error: ${error.message}`, null, true);\n    } finally {\n        showAILoading(false);\n    }\n}\n\nfunction showAILoading(show) {\n    const loading = document.getElementById('ai-loading');\n    const response = document.getElementById('ai-response');\n    \n    if (show) {\n        loading.style.display = 'flex';\n        response.style.display = 'none';\n    } else {\n        loading.style.display = 'none';\n        response.style.display = 'block';\n    }\n}\n\nfunction showAIResponse(content, action = null, isError = false) {\n    const responseDiv = document.getElementById('ai-response');\n    \n    if (isError) {\n        responseDiv.innerHTML = `\n            <div class=\"ai-error\">\n                <h4>⚠️ Error</h4>\n                <p>${content}</p>\n            </div>\n        `;\n        return;\n    }\n    \n    const actionTitle = {\n        'describe-images': '📸 Image Descriptions',\n        'exif-story': '⭐ EXIF Story',\n        'improve-text': '✨ Improved Content',\n        'expand-content': '📝 Expanded Content'\n    };\n    \n    // Create the response container\n    const contentDiv = document.createElement('div');\n    contentDiv.className = 'ai-generated-content';\n    \n    contentDiv.innerHTML = `\n        <h4>${actionTitle[action] || '🤖 AI Response'}</h4>\n        <div class=\"ai-content-text\">${content.replace(/\\n/g, '<br>')}</div>\n    `;\n    \n    // Create the insert button separately and add proper event handling\n    const insertBtn = document.createElement('button');\n    insertBtn.type = 'button';\n    insertBtn.className = 'ai-insert-btn';\n    insertBtn.textContent = 'Insert into Editor';\n    \n    // Add robust event handling to prevent any form submission\n    insertBtn.addEventListener('click', async (e) => {\n        e.preventDefault();\n        e.stopPropagation();\n        e.stopImmediatePropagation();\n        \n        try {\n            await insertAIContentIntoEditor(action, content);\n        } catch (error) {\n            // Error handled silently\n        }\n        \n        return false;\n    });\n    \n    contentDiv.appendChild(insertBtn);\n    responseDiv.innerHTML = '';\n    responseDiv.appendChild(contentDiv);\n}\n\nasync function insertAIContentIntoEditor(action, content) {\n    if (!blockEditor) {\n        alert('Editor not available');\n        return;\n    }\n    \n    try {\n        // Split content into paragraphs for better formatting\n        const paragraphs = content.split('\\n\\n').filter(p => p.trim().length > 0);\n        \n        // Insert each paragraph as a separate block\n        for (const paragraph of paragraphs) {\n            await blockEditor.blocks.insert('paragraph', {\n                text: paragraph.trim()\n            });\n        }\n        \n        const insertCount = paragraphs.length;\n        showMessage(`AI content inserted into editor! (${insertCount} paragraph${insertCount > 1 ? 's' : ''})`);\n    } catch (error) {\n        alert('Failed to insert content into editor');\n    }\n}\n\nasync function getEditorContent() {\n    if (!blockEditor) return '';\n    \n    try {\n        const outputData = await blockEditor.save();\n        // Convert EditorJS blocks to plain text\n        let content = '';\n        outputData.blocks.forEach(block => {\n            if (block.type === 'paragraph') {\n                content += block.data.text + '\\n\\n';\n            } else if (block.type === 'header') {\n                content += block.data.text + '\\n\\n';\n            }\n            // Add more block types as needed\n        });\n        return content.trim();\n    } catch (error) {\n        return '';\n    }\n}\n\nasync function getSelectedImagesForAI() {\n    const images = [];\n    \n    try {\n        // First, try to get images from the current editor content\n        if (blockEditor) {\n            const outputData = await blockEditor.save();\n            \n            // Look for images in editor blocks\n            outputData.blocks.forEach(block => {\n                if (block.type === 'image' && block.data.file && block.data.file.url) {\n                    images.push({\n                        title: block.data.caption || 'Image from editor',\n                        description: block.data.caption || '',\n                        url: block.data.file.url,\n                        id: null // We'll try to find the ID from the URL\n                    });\n                } else if (block.type === 'imageLibrary' && block.data.url) {\n                    // Custom image library tool\n                    images.push({\n                        title: block.data.caption || block.data.originalFilename || 'Library image',\n                        description: block.data.caption || '',\n                        url: block.data.url,\n                        id: null\n                    });\n                }\n            });\n        }\n        \n        // Also check uploadedImages array for additional images\n        if (uploadedImages && uploadedImages.length > 0) {\n            uploadedImages.forEach(img => {\n                // Avoid duplicates\n                const exists = images.find(existingImg => existingImg.url === img.b2_url);\n                if (!exists) {\n                    images.push({\n                        title: img.title || img.original_filename,\n                        description: img.description || img.alt_text,\n                        url: img.b2_url,\n                        id: img.id\n                    });\n                }\n            });\n        }\n        \n        // Try to find database IDs and enrich image data\n        for (const image of images) {\n            if (!image.id && image.url) {\n                try {\n                    const filename = image.url.split('/').pop();\n                    const response = await fetch(`/api/images/by-filename?filename=${encodeURIComponent(filename)}`);\n                    if (response.ok) {\n                        const dbImage = await response.json();\n                        image.id = dbImage.id;\n                        image.title = image.title || dbImage.title || dbImage.original_filename;\n                        image.description = image.description || dbImage.description || dbImage.alt_text;\n                        \n                        // Add technical details to help AI generate unique descriptions\n                        image.filename = dbImage.original_filename;\n                        image.dimensions = dbImage.width && dbImage.height ? `${dbImage.width}x${dbImage.height}` : null;\n                        image.fileSize = dbImage.file_size;\n                    } else {\n                        // Try looking up by URL instead\n                        const urlResponse = await fetch(`/api/images/by-url?url=${encodeURIComponent(image.url)}`);\n                        if (urlResponse.ok) {\n                            const dbImage = await urlResponse.json();\n                            image.id = dbImage.id;\n                            image.title = image.title || dbImage.title || dbImage.original_filename;\n                            image.description = image.description || dbImage.description || dbImage.alt_text;\n                            image.filename = dbImage.original_filename;\n                            image.dimensions = dbImage.width && dbImage.height ? `${dbImage.width}x${dbImage.height}` : null;\n                            image.fileSize = dbImage.file_size;\n                        }\n                    }\n                } catch (error) {\n                    // Silently fail - image will just have less metadata\n                }\n            }\n        }\n        \n    } catch (error) {\n        // Error getting images from editor\n    }\n    \n    return images;\n}\n\nasync function getEXIFDataForImages(images) {\n    const exifData = {};\n    \n    for (const image of images) {\n        try {\n            const response = await fetch(`/api/images/${image.id}/exif`);\n            if (response.ok) {\n                exifData[image.id] = await response.json();\n            }\n        } catch (error) {\n            // Failed to load EXIF data\n        }\n    }\n    \n    return exifData;\n}\n\n// Theme Management\nconst availableThemes = [\n    {\n        id: 'default',\n        name: 'Current Dark',\n        description: 'The current dark design with orange accents'\n    },\n    {\n        id: 'classic',\n        name: 'Classic Light',\n        description: 'Clean and professional with blue accents'\n    },\n    {\n        id: 'dark',\n        name: 'Pure Dark',\n        description: 'Deep dark mode with red accents'\n    },\n    {\n        id: 'ocean',\n        name: 'Ocean Breeze',\n        description: 'Calming blues and sea-inspired colors'\n    },\n    {\n        id: 'forest',\n        name: 'Forest Green',\n        description: 'Natural greens for an earthy feel'\n    },\n    {\n        id: 'sunset',\n        name: 'Warm Sunset',\n        description: 'Warm oranges and golden tones'\n    },\n    {\n        id: 'monochrome',\n        name: 'Monochrome',\n        description: 'Elegant black, white, and gray palette'\n    },\n    {\n        id: 'solarized-light',\n        name: 'Solarized Light',\n        description: 'Gentle light theme with carefully chosen colors'\n    },\n    {\n        id: 'solarized-dark',\n        name: 'Solarized Dark',\n        description: 'Dark theme with soothing color palette'\n    },\n    {\n        id: 'leica',\n        name: 'Leica Classic',\n        description: 'Inspired by classic Leica cameras with signature red accents'\n    }\n];\n\nlet selectedTheme = 'default';\n\nfunction loadThemesInterface() {\n    const grid = document.getElementById('theme-preview-grid');\n    \n    // Load current theme from backend\n    getCurrentTheme().then(currentTheme => {\n        selectedTheme = currentTheme;\n        renderThemeCards();\n    });\n    \n    function renderThemeCards() {\n        const cardsHTML = availableThemes.map(theme => `\n            <div class=\"theme-card theme-${theme.id} ${selectedTheme === theme.id ? 'selected' : ''}\" \n                 data-theme=\"${theme.id}\" onclick=\"selectTheme('${theme.id}')\">\n                <div class=\"theme-header\">\n                    <div class=\"theme-title\">${theme.name}</div>\n                    <div class=\"theme-description\">${theme.description}</div>\n                </div>\n                <div class=\"theme-preview\">\n                    <div class=\"theme-navbar\">\n                        <div>jonsson.io</div>\n                        <div>Stories • Gallery • About</div>\n                    </div>\n                    <div class=\"theme-content\">\n                        <div class=\"theme-hero\">Photography Portfolio</div>\n                        <div class=\"theme-cards\">\n                            <div class=\"theme-mini-card\">Story Post</div>\n                            <div class=\"theme-mini-card\">Gallery</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        `).join('');\n        \n        grid.innerHTML = cardsHTML;\n    }\n    \n    // Setup save button\n    const saveBtn = document.getElementById('save-theme-btn');\n    if (saveBtn) {\n        saveBtn.onclick = () => saveSelectedTheme();\n    }\n}\n\nfunction selectTheme(themeId) {\n    selectedTheme = themeId;\n    \n    // Update UI\n    document.querySelectorAll('.theme-card').forEach(card => {\n        card.classList.remove('selected');\n        if (card.dataset.theme === themeId) {\n            card.classList.add('selected');\n        }\n    });\n}\n\nasync function getCurrentTheme() {\n    try {\n        const response = await fetch('/api/admin/theme', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (response.ok) {\n            const data = await response.json();\n            return data.theme || 'default';\n        }\n    } catch (error) {\n        // Error loading current theme\n    }\n    \n    return 'default';\n}\n\nasync function saveSelectedTheme() {\n    const saveBtn = document.getElementById('save-theme-btn');\n    const originalText = saveBtn.textContent;\n    \n    saveBtn.textContent = 'Applying...';\n    saveBtn.disabled = true;\n    \n    try {\n        const response = await fetch('/api/admin/theme', {\n            method: 'PUT',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify({ theme: selectedTheme })\n        });\n        \n        if (response.ok) {\n            saveBtn.textContent = 'Applied!';\n            showMessage(`Theme \"${availableThemes.find(t => t.id === selectedTheme)?.name}\" applied successfully!`);\n            \n            setTimeout(() => {\n                saveBtn.textContent = originalText;\n                saveBtn.disabled = false;\n            }, 2000);\n        } else {\n            throw new Error('Failed to save theme');\n        }\n    } catch (error) {\n        saveBtn.textContent = 'Error - Try Again';\n        \n        setTimeout(() => {\n            saveBtn.textContent = originalText;\n            saveBtn.disabled = false;\n        }, 3000);\n    }\n}\n\n// Slug management\nlet originalSlug = '';\nlet isEditingSlug = false;\n\nfunction enableSlugEditing() {\n    const slugInput = document.getElementById('post-slug');\n    const editBtn = document.getElementById('edit-slug-btn');\n    const regenerateBtn = document.getElementById('regenerate-slug-btn');\n    const cancelBtn = document.getElementById('cancel-slug-btn');\n    \n    originalSlug = slugInput.value;\n    isEditingSlug = true;\n    \n    slugInput.readOnly = false;\n    slugInput.focus();\n    \n    editBtn.style.display = 'none';\n    regenerateBtn.style.display = 'inline-block';\n    cancelBtn.style.display = 'inline-block';\n}\n\nfunction regenerateSlugFromTitle() {\n    const titleInput = document.getElementById('post-title');\n    const slugInput = document.getElementById('post-slug');\n    \n    if (titleInput.value.trim()) {\n        const newSlug = createSlugFromTitle(titleInput.value);\n        slugInput.value = newSlug;\n    }\n}\n\nfunction cancelSlugEditing() {\n    const slugInput = document.getElementById('post-slug');\n    const editBtn = document.getElementById('edit-slug-btn');\n    const regenerateBtn = document.getElementById('regenerate-slug-btn');\n    const cancelBtn = document.getElementById('cancel-slug-btn');\n    \n    slugInput.value = originalSlug;\n    slugInput.readOnly = true;\n    isEditingSlug = false;\n    \n    editBtn.style.display = 'inline-block';\n    regenerateBtn.style.display = 'none';\n    cancelBtn.style.display = 'none';\n}\n\nfunction createSlugFromTitle(title) {\n    return title\n        .toLowerCase()\n        .replace(/[^a-z0-9]+/g, '-')\n        .replace(/(^-|-$)/g, '');\n}\n\n// Initialize AI Assistant when editor is shown\ndocument.addEventListener('DOMContentLoaded', function() {\n    // Wait a bit for the editor to be ready, then initialize AI\n    setTimeout(() => {\n        if (document.getElementById('ai-assistant')) {\n            initializeAIAssistant();\n        }\n    }, 1000);\n});\n\n// Icon Library\nconst iconLibrary = {\n    instagram: {\n        name: 'Instagram',\n        path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z'\n    },\n    email: {\n        name: 'Email',\n        path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'\n    },\n    twitter: {\n        name: 'Twitter',\n        path: 'M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z'\n    },\n    linkedin: {\n        name: 'LinkedIn',\n        path: 'M20.447,20.452H16.893V14.883C16.893,13.555 16.866,11.846 15.041,11.846C13.188,11.846 12.905,13.291 12.905,14.785V20.452H9.351V9H12.765V10.561H12.811C13.288,9.661 14.448,8.711 16.181,8.711C19.782,8.711 20.447,11.081 20.447,14.166V20.452ZM5.337,7.433A2.062,2.062 0 0,1 3.275,5.371A2.062,2.062 0 0,1 5.337,3.309A2.062,2.062 0 0,1 7.399,5.371A2.062,2.062 0 0,1 5.337,7.433ZM7.119,20.452H3.555V9H7.119V20.452ZM22.225,0H1.771C0.792,0 0,0.774 0,1.729V22.271C0,23.227 0.792,24 1.771,24H22.222C23.2,24 24,23.227 24,22.271V1.729C24,0.774 23.2,0 22.222,0H22.225Z'\n    },\n    facebook: {\n        name: 'Facebook',\n        path: 'M24,12.073C24,5.405 18.627,0 12,0S0,5.405 0,12.073C0,18.1 4.388,23.094 10.125,24V15.563H7.078V12.073H10.125V9.404C10.125,6.369 11.917,4.725 14.658,4.725C15.97,4.725 17.344,4.954 17.344,4.954V7.922H15.83C14.34,7.922 13.875,8.853 13.875,9.808V12.073H17.203L16.671,15.563H13.875V24C19.612,23.094 24,18.1 24,12.073Z'\n    },\n    youtube: {\n        name: 'YouTube',\n        path: 'M23.498,6.186A3.016,3.016 0,0 0,21.372 4.063C19.505,3.546 12,3.546 12,3.546S4.495,3.546 2.628,4.063A3.016,3.016 0,0 0,0.502 6.186C0,8.07 0,12 0,12S0,15.93 0.502,17.814A3.016,3.016 0,0 0,2.628 19.937C4.495,20.454 12,20.454 12,20.454S19.505,20.454 21.372,19.937A3.016,3.016 0,0 0,23.498 17.814C24,15.93 24,12 24,12S24,8.07 23.498,6.186ZM9.545,15.568V8.432L15.818,12L9.545,15.568Z'\n    },\n    github: {\n        name: 'GitHub',\n        path: 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z'\n    },\n    tiktok: {\n        name: 'TikTok',\n        path: 'M12.525 22c-1.193 0-2.374-.197-3.507-.588-.881-.304-1.719-.756-2.49-1.343-.758-.576-1.454-1.263-2.068-2.043-.597-.759-1.09-1.587-1.464-2.465C2.634 14.687 2.447 13.705 2.447 12.713s.187-1.974.549-2.848c.374-.878.867-1.706 1.464-2.465.614-.78 1.31-1.467 2.068-2.043.771-.587 1.609-1.039 2.49-1.343C10.151 3.623 11.332 3.426 12.525 3.426c.85 0 1.694.117 2.509.349.795.226 1.569.558 2.299.986.714.418 1.383.924 1.991 1.503.594.565 1.128 1.203 1.588 1.896.448.677.824 1.408 1.117 2.173.285.744.43 1.525.43 2.321s-.145 1.577-.43 2.321c-.293.765-.669 1.496-1.117 2.173-.46.693-.994 1.331-1.588 1.896-.608.579-1.277 1.085-1.991 1.503-.73.428-1.504.76-2.299.986-.815.232-1.659.349-2.509.349zm6.084-12.637l-2.5-1.35v6.188c0 .86-.698 1.558-1.558 1.558s-1.558-.698-1.558-1.558.698-1.558 1.558-1.558c.172 0 .337.028.489.08V11.56c-.152-.023-.309-.034-.489-.034-1.72 0-3.115 1.395-3.115 3.115 0 1.72 1.395 3.115 3.115 3.115 1.72 0 3.115-1.395 3.115-3.115V8.823l2.442 1.317V9.363z'\n    },\n    snapchat: {\n        name: 'Snapchat',\n        path: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1.54 15.45c.05-.4.1-.85.15-1.3l.37-3.54c.03-.3-.12-.57-.38-.67-.26-.1-.56-.03-.75.17l-1.65 1.72c-.4.42-.95.65-1.52.65h-.01c-.89 0-1.62-.73-1.62-1.62 0-.44.18-.85.47-1.15l3.22-3.22c.3-.3.47-.71.47-1.15v-.92c0-.89.73-1.62 1.62-1.62h.92c.44 0 .85.17 1.15.47l3.22 3.22c.29.3.47.71.47 1.15 0 .89-.73 1.62-1.62 1.62h-.01c-.57 0-1.12-.23-1.52-.65l-1.65-1.72c-.19-.2-.49-.27-.75-.17-.26.1-.41.37-.38.67l.37 3.54c.05.45.1.9.15 1.3.02.18-.04.36-.16.49-.12.13-.3.21-.49.21h-3.92c-.19 0-.37-.08-.49-.21-.12-.13-.18-.31-.16-.49z'\n    },\n    discord: {\n        name: 'Discord',\n        path: 'M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.928 1.761 8.18 1.761 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.201 0 2.176 1.068 2.157 2.38 0 1.311-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.2 0 2.175 1.068 2.156 2.38 0 1.311-.956 2.38-2.156 2.38z'\n    },\n    website: {\n        name: 'Website',\n        path: 'M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'\n    },\n    phone: {\n        name: 'Phone',\n        path: 'M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z'\n    },\n    whatsapp: {\n        name: 'WhatsApp',\n        path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488'\n    },\n    mastodon: {\n        name: 'Mastodon',\n        path: 'M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792.18 11.813.18h-.03c-3.98 0-4.835.062-5.288.129C3.882.7 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z'\n    }\n};\n\n// Social Links Management Functions\nlet currentSocialLinkId = null;\nlet selectedIconPath = '';\n\nasync function loadSocialLinks() {\n    const socialLinksList = document.getElementById('social-links-list');\n    \n    socialLinksList.innerHTML = '<div class=\"loading\">Loading social links...</div>';\n    \n    try {\n        const response = await fetch('/api/admin/social-links', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to load social links');\n        }\n        \n        const socialLinks = await response.json();\n        renderSocialLinks(socialLinks);\n        \n    } catch (error) {\n        console.error('Error loading social links:', error);\n        socialLinksList.innerHTML = '<div class=\"error-message\">Error loading social links. Please try again.</div>';\n    }\n}\n\nfunction renderSocialLinks(socialLinks) {\n    const socialLinksList = document.getElementById('social-links-list');\n    \n    if (socialLinks.length === 0) {\n        socialLinksList.innerHTML = `\n            <div class=\"loading\">\n                <p>No social links configured yet.</p>\n                <p>Click \"Add Link\" to get started.</p>\n            </div>\n        `;\n        return;\n    }\n    \n    const linksHTML = socialLinks.map(link => `\n        <div class=\"gallery-admin-item\" data-link-id=\"${link.id}\">\n            <div class=\"gallery-admin-image\" style=\"display: flex; align-items: center; justify-content: center; background: #f0f0f0;\">\n                <svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"#666\">\n                    <path d=\"${link.icon_svg || 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z'}\"/>\n                </svg>\n            </div>\n            <div class=\"gallery-admin-info\">\n                <h3>${link.label}</h3>\n                <p class=\"gallery-admin-description\">${link.platform} • ${link.url}</p>\n                <div class=\"gallery-admin-meta\">\n                    Order: ${link.sort_order}\n                    ${!link.visible ? ' • <span class=\"hidden-badge\">Hidden</span>' : ''}\n                </div>\n            </div>\n            <div class=\"gallery-admin-actions\">\n                <button class=\"btn btn-small btn-outline\" onclick=\"editSocialLink(${link.id})\">Edit</button>\n                <button class=\"btn btn-small btn-secondary\" onclick=\"toggleSocialLinkVisibility(${link.id}, ${link.visible})\">${link.visible ? 'Hide' : 'Show'}</button>\n                <button class=\"btn btn-small btn-danger\" onclick=\"deleteSocialLink(${link.id})\">Delete</button>\n            </div>\n        </div>\n    `).join('');\n    \n    socialLinksList.innerHTML = `<div class=\"gallery-admin-grid\">${linksHTML}</div>`;\n}\n\nfunction openSocialLinkModal(linkId = null) {\n    currentSocialLinkId = linkId;\n    const modal = document.getElementById('social-link-modal');\n    const title = document.getElementById('social-link-modal-title');\n    \n    if (linkId) {\n        title.textContent = 'Edit Social Link';\n        // Load existing link data\n        loadSocialLinkData(linkId);\n    } else {\n        title.textContent = 'Add Social Link';\n        resetSocialLinkForm();\n    }\n    \n    modal.classList.add('active');\n}\n\nfunction closeSocialLinkModal() {\n    const modal = document.getElementById('social-link-modal');\n    modal.classList.remove('active');\n    currentSocialLinkId = null;\n    resetSocialLinkForm();\n}\n\nfunction resetSocialLinkForm() {\n    document.getElementById('social-link-form').reset();\n    document.getElementById('social-visible').checked = true;\n    document.getElementById('social-sort-order').value = 0;\n    selectedIconPath = '';\n    \n    // Reset icon preview to default\n    const preview = document.getElementById('selected-icon-preview');\n    if (preview) {\n        preview.innerHTML = `\n            <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                <path d=\"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z\"/>\n            </svg>\n        `;\n    }\n}\n\nasync function loadSocialLinkData(linkId) {\n    try {\n        const response = await fetch('/api/admin/social-links', {\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to load social links');\n        }\n        \n        const socialLinks = await response.json();\n        const link = socialLinks.find(l => l.id === linkId);\n        \n        if (link) {\n            document.getElementById('social-platform').value = link.platform;\n            document.getElementById('social-label').value = link.label;\n            document.getElementById('social-url').value = link.url;\n            document.getElementById('social-icon-svg').value = link.icon_svg || '';\n            document.getElementById('social-sort-order').value = link.sort_order;\n            document.getElementById('social-visible').checked = link.visible;\n            \n            // Update icon preview and selected path\n            selectedIconPath = link.icon_svg || '';\n            if (selectedIconPath) {\n                updateIconPreview(selectedIconPath);\n            } else {\n                // Try to auto-detect based on platform\n                autoDetectIcon();\n            }\n        }\n    } catch (error) {\n        console.error('Error loading social link data:', error);\n        alert('Failed to load social link data');\n    }\n}\n\nasync function saveSocialLink(e) {\n    e.preventDefault();\n    \n    const linkData = {\n        platform: document.getElementById('social-platform').value,\n        label: document.getElementById('social-label').value,\n        url: document.getElementById('social-url').value,\n        icon_svg: document.getElementById('social-icon-svg').value,\n        sort_order: parseInt(document.getElementById('social-sort-order').value) || 0,\n        visible: document.getElementById('social-visible').checked\n    };\n    \n    try {\n        const url = currentSocialLinkId \n            ? `/api/admin/social-links/${currentSocialLinkId}`\n            : '/api/admin/social-links';\n        const method = currentSocialLinkId ? 'PUT' : 'POST';\n        \n        const response = await fetch(url, {\n            method: method,\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify(linkData)\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to save social link');\n        }\n        \n        closeSocialLinkModal();\n        loadSocialLinks();\n        showMessage(`Social link ${currentSocialLinkId ? 'updated' : 'created'} successfully!`);\n        \n    } catch (error) {\n        console.error('Error saving social link:', error);\n        alert('Failed to save social link: ' + error.message);\n    }\n}\n\nasync function editSocialLink(linkId) {\n    openSocialLinkModal(linkId);\n}\n\nasync function toggleSocialLinkVisibility(linkId, currentVisibility) {\n    try {\n        const response = await fetch(`/api/admin/social-links/${linkId}`, {\n            method: 'PUT',\n            headers: {\n                'Content-Type': 'application/json',\n                'Authorization': `Bearer ${authToken}`\n            },\n            body: JSON.stringify({ visible: !currentVisibility })\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to update social link visibility');\n        }\n        \n        loadSocialLinks();\n        showMessage(`Social link ${!currentVisibility ? 'shown' : 'hidden'} successfully!`);\n        \n    } catch (error) {\n        console.error('Error updating social link visibility:', error);\n        alert('Failed to update social link visibility: ' + error.message);\n    }\n}\n\nasync function deleteSocialLink(linkId) {\n    if (!confirm('Are you sure you want to delete this social link?')) {\n        return;\n    }\n    \n    try {\n        const response = await fetch(`/api/admin/social-links/${linkId}`, {\n            method: 'DELETE',\n            headers: {\n                'Authorization': `Bearer ${authToken}`\n            }\n        });\n        \n        if (!response.ok) {\n            throw new Error('Failed to delete social link');\n        }\n        \n        loadSocialLinks();\n        showMessage('Social link deleted successfully!');\n        \n    } catch (error) {\n        console.error('Error deleting social link:', error);\n        alert('Failed to delete social link: ' + error.message);\n    }\n}\n\n// Icon Picker Functions\nfunction openIconPicker() {\n    const modal = document.getElementById('icon-picker-modal');\n    const grid = document.getElementById('icon-picker-grid');\n    \n    // Generate icon grid\n    const iconsHTML = Object.entries(iconLibrary).map(([key, icon]) => `\n        <div class=\"icon-option\" data-icon-key=\"${key}\" onclick=\"selectIcon('${key}')\">\n            <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                <path d=\"${icon.path}\"/>\n            </svg>\n            <span class=\"icon-option-label\">${icon.name}</span>\n        </div>\n    `).join('');\n    \n    grid.innerHTML = iconsHTML;\n    \n    // Highlight currently selected icon\n    if (selectedIconPath) {\n        const currentIcon = Object.entries(iconLibrary).find(([key, icon]) => icon.path === selectedIconPath);\n        if (currentIcon) {\n            const iconElement = grid.querySelector(`[data-icon-key=\"${currentIcon[0]}\"]`);\n            if (iconElement) {\n                iconElement.classList.add('selected');\n            }\n        }\n    }\n    \n    modal.classList.add('active');\n}\n\nfunction closeIconPicker() {\n    const modal = document.getElementById('icon-picker-modal');\n    modal.classList.remove('active');\n}\n\nfunction selectIcon(iconKey) {\n    const icon = iconLibrary[iconKey];\n    if (!icon) return;\n    \n    selectedIconPath = icon.path;\n    \n    // Update the preview\n    updateIconPreview(icon.path);\n    \n    // Update the hidden input\n    document.getElementById('social-icon-svg').value = icon.path;\n    \n    // Close the picker\n    closeIconPicker();\n}\n\nfunction updateIconPreview(iconPath) {\n    const preview = document.getElementById('selected-icon-preview');\n    if (preview && iconPath) {\n        preview.innerHTML = `\n            <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                <path d=\"${iconPath}\"/>\n            </svg>\n        `;\n    }\n}\n\nfunction autoDetectIcon() {\n    const platform = document.getElementById('social-platform').value.toLowerCase().trim();\n    \n    if (platform && iconLibrary[platform]) {\n        selectedIconPath = iconLibrary[platform].path;\n        updateIconPreview(selectedIconPath);\n        document.getElementById('social-icon-svg').value = selectedIconPath;\n    }\n}\n\n// Make functions globally accessible for onclick handlers\nwindow.editSocialLink = editSocialLink;\nwindow.toggleSocialLinkVisibility = toggleSocialLinkVisibility;\nwindow.deleteSocialLink = deleteSocialLink;\nwindow.selectIcon = selectIcon;\n\n// Navigation Reordering Functionality\nlet isDragging = false;\nlet draggedElement = null;\nlet placeholder = null;\n\nfunction initializeNavigationReordering() {\n    const navigationContainer = document.getElementById('admin-navigation');\n    if (!navigationContainer) return;\n    \n    // Load saved navigation order first\n    loadNavigationOrder();\n    \n    // Make navigation items draggable after loading order\n    setTimeout(() => {\n        const navItems = navigationContainer.querySelectorAll('.nav-item');\n        \n        // Add drop listeners to the container as well\n        navigationContainer.addEventListener('dragover', (e) => {\n            e.preventDefault();\n        });\n        navigationContainer.addEventListener('drop', (e) => {\n            e.preventDefault();\n            handleDrop(e);\n        });\n        \n        navItems.forEach((item, index) => {\n            item.draggable = true;\n            item.style.cursor = 'move';\n            \n            // Add visual indicator that items are draggable\n            item.title = 'Drag to reorder';\n            \n            item.addEventListener('dragstart', handleDragStart);\n            item.addEventListener('dragend', handleDragEnd);\n            item.addEventListener('dragover', handleDragOver);\n            item.addEventListener('drop', handleDrop);\n            item.addEventListener('dragenter', handleDragEnter);\n            item.addEventListener('dragleave', handleDragLeave);\n        });\n    }, 50);\n}\n\nfunction handleDragStart(e) {\n    isDragging = true;\n    draggedElement = e.target;\n    \n    // Create placeholder element\n    placeholder = document.createElement('div');\n    placeholder.className = 'nav-item nav-placeholder';\n    placeholder.innerHTML = '<span>Drop here</span>';\n    placeholder.style.opacity = '0.5';\n    placeholder.style.border = '2px dashed #007bff';\n    placeholder.style.background = '#f8f9fa';\n    placeholder.style.minHeight = '40px';\n    placeholder.style.display = 'flex';\n    placeholder.style.alignItems = 'center';\n    placeholder.style.justifyContent = 'center';\n    \n    // Add visual feedback\n    draggedElement.style.opacity = '0.5';\n    draggedElement.classList.add('dragging');\n    \n    e.dataTransfer.effectAllowed = 'move';\n    e.dataTransfer.setData('text/html', e.target.outerHTML);\n}\n\nfunction handleDragEnd(e) {\n    isDragging = false;\n    \n    // Remove visual feedback\n    if (draggedElement) {\n        draggedElement.style.opacity = '1';\n        draggedElement.classList.remove('dragging');\n    }\n    \n    // Remove placeholder\n    if (placeholder && placeholder.parentNode) {\n        placeholder.parentNode.removeChild(placeholder);\n    }\n    \n    draggedElement = null;\n    placeholder = null;\n    \n    // Save new order with a small delay to ensure DOM is updated\n    setTimeout(() => {\n        saveNavigationOrder();\n    }, 100);\n}\n\nfunction handleDragOver(e) {\n    e.preventDefault();\n    e.dataTransfer.dropEffect = 'move';\n    \n    if (!isDragging || !draggedElement) return;\n    \n    const afterElement = getDragAfterElement(e.currentTarget.parentNode, e.clientX);\n    const container = e.currentTarget.parentNode;\n    \n    if (afterElement == null) {\n        container.appendChild(placeholder);\n    } else {\n        container.insertBefore(placeholder, afterElement);\n    }\n}\n\nfunction handleDrop(e) {\n    e.preventDefault();\n    \n    if (!isDragging || !draggedElement || !placeholder) return;\n    \n    // Replace placeholder with dragged element\n    placeholder.parentNode.replaceChild(draggedElement, placeholder);\n    \n    // Remove visual feedback immediately\n    draggedElement.style.opacity = '1';\n    draggedElement.classList.remove('dragging');\n}\n\nfunction handleDragEnter(e) {\n    if (!isDragging) return;\n    e.preventDefault();\n}\n\nfunction handleDragLeave(e) {\n    if (!isDragging) return;\n    // Don't remove placeholder here as it causes flickering\n}\n\nfunction getDragAfterElement(container, x) {\n    const draggableElements = [...container.querySelectorAll('.nav-item:not(.dragging):not(.nav-placeholder)')];\n    \n    return draggableElements.reduce((closest, child) => {\n        const box = child.getBoundingClientRect();\n        const offset = x - box.left - box.width / 2;\n        \n        if (offset < 0 && offset > closest.offset) {\n            return { offset: offset, element: child };\n        } else {\n            return closest;\n        }\n    }, { offset: Number.NEGATIVE_INFINITY }).element;\n}\n\nfunction saveNavigationOrder() {\n    const navigationContainer = document.getElementById('admin-navigation');\n    if (!navigationContainer) return;\n    \n    const navItems = navigationContainer.querySelectorAll('.nav-item:not(.nav-placeholder)');\n    const order = [];\n    \n    navItems.forEach((item, index) => {\n        const section = item.dataset.section;\n        if (section) {\n            order.push({\n                section: section,\n                order: index + 1\n            });\n        }\n    });\n    \n    // Save to localStorage\n    localStorage.setItem('adminNavigationOrder', JSON.stringify(order));\n    \n    // Also update the data-order attributes to reflect the new order\n    navItems.forEach((item, index) => {\n        item.dataset.order = index + 1;\n    });\n}\n\nfunction loadNavigationOrder() {\n    const saved = localStorage.getItem('adminNavigationOrder');\n    if (!saved) return;\n    \n    try {\n        const order = JSON.parse(saved);\n        const navigationContainer = document.getElementById('admin-navigation');\n        if (!navigationContainer) return;\n        \n        // Sort navigation items according to saved order\n        const navItems = [...navigationContainer.querySelectorAll('.nav-item')];\n        const sortedItems = [];\n        \n        // Create a map for easier lookup\n        const orderMap = {};\n        order.forEach(orderItem => {\n            orderMap[orderItem.section] = orderItem.order;\n        });\n        \n        // Sort items by their saved order\n        const sortedByOrder = navItems.sort((a, b) => {\n            const aOrder = orderMap[a.dataset.section] || 999;\n            const bOrder = orderMap[b.dataset.section] || 999;\n            return aOrder - bOrder;\n        });\n        \n        // Clear container and re-add in order\n        navigationContainer.innerHTML = '';\n        sortedByOrder.forEach((item, index) => {\n            item.dataset.order = index + 1;\n            navigationContainer.appendChild(item);\n        });\n        \n        \n    } catch (error) {\n        // Error loading navigation order\n    }\n}",
  "/static/js/main.js": "// Modern Photoblog JavaScript\nlet currentPosts = [];\nlet currentImageIndex = 0;\nlet isLightboxOpen = false;\nlet currentGalleryImages = []; // Store gallery images with EXIF data\n\ndocument.addEventListener('DOMContentLoaded', function() {\n    initializeNavigation();\n    initializeLightbox();\n    loadInitialContent();\n    updateStats();\n    loadAboutContent();\n    \n    // Listen for hash changes (browser back/forward buttons)\n    window.addEventListener('hashchange', function() {\n        loadInitialContent();\n    });\n});\n\n// Helper function to reverse geocode GPS coordinates\nasync function reverseGeocode(lat, lon) {\n    try {\n        // Using OpenStreetMap Nominatim API (free, no API key required)\n        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);\n        const data = await response.json();\n        \n        if (data && data.address) {\n            const parts = [];\n            if (data.address.city) parts.push(data.address.city);\n            else if (data.address.town) parts.push(data.address.town);\n            else if (data.address.village) parts.push(data.address.village);\n            \n            if (data.address.state) parts.push(data.address.state);\n            if (data.address.country) parts.push(data.address.country);\n            \n            return parts.length > 0 ? parts.join(', ') : null;\n        }\n    } catch (error) {\n        console.log('Geocoding failed:', error);\n    }\n    return null;\n}\n\n// Helper function to format date\nfunction formatExifDate(dateString) {\n    if (!dateString) return null;\n    \n    try {\n        const date = new Date(dateString);\n        return date.toLocaleDateString('en-US', {\n            year: 'numeric',\n            month: 'long',\n            day: 'numeric'\n        });\n    } catch (error) {\n        return null;\n    }\n}\n\n// Navigation\nfunction initializeNavigation() {\n    const navButtons = document.querySelectorAll('.nav-btn');\n    const sections = document.querySelectorAll('.content-section');\n    \n    navButtons.forEach(button => {\n        button.addEventListener('click', () => {\n            const targetSection = button.dataset.section;\n            \n            // Update URL hash\n            window.location.hash = targetSection;\n            \n            // Show the section\n            showSection(targetSection);\n            \n            // Load content based on section\n            if (targetSection === 'gallery') {\n                loadGallery();\n            } else if (targetSection === 'stories') {\n                loadStories();\n            } else if (targetSection === 'about') {\n                // About section doesn't need special loading\n            }\n        });\n    });\n    \n    // Gallery is always masonry view\n}\n\n// Lightbox functionality\nfunction initializeLightbox() {\n    const lightbox = document.getElementById('lightbox');\n    const closeBtn = lightbox.querySelector('.lightbox-close');\n    const prevBtn = lightbox.querySelector('.lightbox-prev');\n    const nextBtn = lightbox.querySelector('.lightbox-next');\n    \n    closeBtn.addEventListener('click', closeLightbox);\n    prevBtn.addEventListener('click', () => navigateLightbox(-1));\n    nextBtn.addEventListener('click', () => navigateLightbox(1));\n    \n    // Close lightbox on escape key\n    document.addEventListener('keydown', (e) => {\n        if (e.key === 'Escape' && isLightboxOpen) {\n            closeLightbox();\n        } else if (e.key === 'ArrowLeft' && isLightboxOpen) {\n            navigateLightbox(-1);\n        } else if (e.key === 'ArrowRight' && isLightboxOpen) {\n            navigateLightbox(1);\n        }\n    });\n    \n    // Close lightbox on background click\n    lightbox.addEventListener('click', (e) => {\n        if (e.target === lightbox) {\n            closeLightbox();\n        }\n    });\n}\n\nasync function openLightbox(imageIndex) {\n    if (!currentPosts.length) return;\n    \n    currentImageIndex = imageIndex;\n    isLightboxOpen = true;\n    \n    const lightbox = document.getElementById('lightbox');\n    const galleryImage = currentPosts[imageIndex];\n    \n    // Update lightbox content\n    const image = lightbox.querySelector('.lightbox-image');\n    const title = lightbox.querySelector('.lightbox-title');\n    const description = lightbox.querySelector('.lightbox-description');\n    const date = lightbox.querySelector('.lightbox-date');\n    \n    if (galleryImage.b2_url) {\n        image.src = galleryImage.b2_url;\n        image.alt = galleryImage.alt_text || galleryImage.title || 'Gallery image';\n        if (galleryImage.title && galleryImage.title.trim()) {\n            title.textContent = galleryImage.title;\n            title.style.display = 'block';\n        } else {\n            title.textContent = '';\n            title.style.display = 'none';\n        }\n        description.textContent = galleryImage.description || '';\n        \n        const galleryDate = new Date(galleryImage.created_at).toLocaleDateString('en-US', {\n            year: 'numeric',\n            month: 'long',\n            day: 'numeric'\n        });\n        date.textContent = galleryDate;\n        \n        // Setup camera overlay\n        await setupCameraOverlay(galleryImage);\n        \n        // Setup EXIF panel\n        await setupExifPanel(galleryImage);\n        \n        lightbox.classList.add('active');\n        document.body.style.overflow = 'hidden';\n    }\n}\n\nasync function setupExifPanel(galleryImage) {\n    const exifToggle = document.getElementById('exif-toggle');\n    const exifPanel = document.getElementById('exif-panel');\n    const exifContent = document.getElementById('exif-content');\n    \n    // Load and show EXIF data by default\n    const exifData = await loadFullExifData(galleryImage.image_id);\n    if (exifData) {\n        exifContent.innerHTML = formatFullExifData(exifData, galleryImage);\n        exifPanel.style.display = 'block';\n        exifToggle.textContent = '📷 Hide EXIF Data';\n    } else {\n        exifContent.innerHTML = '<p>No EXIF data available for this image.</p>';\n        exifPanel.style.display = 'none';\n        exifToggle.textContent = 'No EXIF data available for this image.';\n    }\n    \n    // Remove old event listeners and add new one\n    const newToggle = exifToggle.cloneNode(true);\n    exifToggle.parentNode.replaceChild(newToggle, exifToggle);\n    \n    // Only add click handler if EXIF data exists\n    if (exifData) {\n        newToggle.addEventListener('click', async () => {\n            if (exifPanel.style.display === 'none') {\n                // Show EXIF data\n                if (!exifContent.innerHTML || exifContent.innerHTML.trim() === '') {\n                    const exifData = await loadFullExifData(galleryImage.image_id);\n                    if (exifData) {\n                        exifContent.innerHTML = formatFullExifData(exifData, galleryImage);\n                    } else {\n                        exifContent.innerHTML = '<p>No EXIF data available for this image.</p>';\n                    }\n                }\n                exifPanel.style.display = 'block';\n                newToggle.textContent = '📷 Hide EXIF Data';\n            } else {\n                // Hide EXIF data\n                exifPanel.style.display = 'none';\n                newToggle.textContent = '📷 Show EXIF Data';\n            }\n        });\n        \n        // Make button look clickable\n        newToggle.style.cursor = 'pointer';\n    } else {\n        // Make button look disabled when no EXIF data\n        newToggle.style.cursor = 'default';\n        newToggle.style.opacity = '0.6';\n    }\n}\n\nasync function setupCameraOverlay(galleryImage) {\n    const cameraOverlay = document.getElementById('lightbox-camera-overlay');\n    const cameraDetails = document.getElementById('camera-details');\n    \n    // Load EXIF data to get camera and lens info\n    const exifData = await loadFullExifData(galleryImage.image_id);\n    \n    if (exifData && (exifData.camera_make || exifData.lens_model)) {\n        let cameraInfo = [];\n        \n        // Add camera info\n        if (exifData.camera_make && exifData.camera_model) {\n            cameraInfo.push(`${exifData.camera_make} ${exifData.camera_model}`);\n        }\n        \n        // Add lens info\n        if (exifData.lens_model) {\n            cameraInfo.push(exifData.lens_model);\n        } else if (exifData.lens_make) {\n            cameraInfo.push(exifData.lens_make);\n        }\n        \n        if (cameraInfo.length > 0) {\n            cameraDetails.innerHTML = cameraInfo.join('<br>');\n            cameraOverlay.style.display = 'block';\n        } else {\n            cameraOverlay.style.display = 'none';\n        }\n    } else {\n        cameraOverlay.style.display = 'none';\n    }\n}\n\nasync function loadFullExifData(imageId) {\n    try {\n        const response = await fetch(`/api/images/${imageId}/exif`);\n        if (response.ok) {\n            return await response.json();\n        }\n    } catch (error) {\n        console.log('Failed to load EXIF data:', error);\n    }\n    return null;\n}\n\nfunction formatFullExifData(exifData, galleryImage) {\n    const sections = [];\n    \n    // Camera Information\n    if (exifData.camera_make || exifData.camera_model) {\n        const cameraRows = [];\n        if (exifData.camera_make) cameraRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Make:</span><span class=\"exif-value\">${exifData.camera_make}</span></div>`);\n        if (exifData.camera_model) cameraRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Model:</span><span class=\"exif-value\">${exifData.camera_model}</span></div>`);\n        \n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>📷 Camera</h4>\n                ${cameraRows.join('')}\n            </div>\n        `);\n    }\n    \n    // Lens Information\n    if (exifData.lens_make || exifData.lens_model) {\n        const lensRows = [];\n        if (exifData.lens_make) lensRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Make:</span><span class=\"exif-value\">${exifData.lens_make}</span></div>`);\n        if (exifData.lens_model) lensRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Model:</span><span class=\"exif-value\">${exifData.lens_model}</span></div>`);\n        \n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>🔍 Lens</h4>\n                ${lensRows.join('')}\n            </div>\n        `);\n    }\n    \n    // Camera Settings\n    const settingsRows = [];\n    if (exifData.focal_length) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Focal Length:</span><span class=\"exif-value\">${exifData.focal_length}mm</span></div>`);\n    if (exifData.focal_length_35mm) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">35mm Equivalent:</span><span class=\"exif-value\">${exifData.focal_length_35mm}mm</span></div>`);\n    if (exifData.aperture) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Aperture:</span><span class=\"exif-value\">f/${exifData.aperture}</span></div>`);\n    if (exifData.shutter_speed) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Shutter Speed:</span><span class=\"exif-value\">${exifData.shutter_speed}</span></div>`);\n    if (exifData.iso) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">ISO:</span><span class=\"exif-value\">${exifData.iso}</span></div>`);\n    if (exifData.flash) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Flash:</span><span class=\"exif-value\">${exifData.flash}</span></div>`);\n    \n    if (settingsRows.length > 0) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>⚙️ Camera Settings</h4>\n                ${settingsRows.join('')}\n            </div>\n        `);\n    }\n    \n    // Location\n    if (exifData.gps_latitude && exifData.gps_longitude) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>📍 Location</h4>\n                <div class=\"exif-row\"><span class=\"exif-label\">Coordinates:</span><span class=\"exif-value\">${exifData.gps_latitude.toFixed(6)}, ${exifData.gps_longitude.toFixed(6)}</span></div>\n                ${exifData.gps_altitude ? `<div class=\"exif-row\"><span class=\"exif-label\">Altitude:</span><span class=\"exif-value\">${exifData.gps_altitude}m</span></div>` : ''}\n                <div style=\"margin-top: 0.5rem;\">\n                    <a href=\"https://www.google.com/maps?q=${exifData.gps_latitude},${exifData.gps_longitude}\" target=\"_blank\" style=\"color: var(--color-accent); text-decoration: none;\">🗺️ View on Google Maps</a>\n                </div>\n            </div>\n        `);\n    }\n    \n    // Date and Other Info\n    const otherRows = [];\n    if (exifData.date_taken) {\n        const date = new Date(exifData.date_taken).toLocaleString();\n        otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Date Taken:</span><span class=\"exif-value\">${date}</span></div>`);\n    }\n    if (exifData.software) otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Software:</span><span class=\"exif-value\">${exifData.software}</span></div>`);\n    if (exifData.artist) otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Artist:</span><span class=\"exif-value\">${exifData.artist}</span></div>`);\n    if (exifData.copyright) otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Copyright:</span><span class=\"exif-value\">${exifData.copyright}</span></div>`);\n    \n    if (otherRows.length > 0) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>ℹ️ Other Information</h4>\n                ${otherRows.join('')}\n            </div>\n        `);\n    }\n    \n    return sections.length > 0 ? sections.join('') : '<p>No detailed EXIF data available.</p>';\n}\n\nfunction closeLightbox() {\n    const lightbox = document.getElementById('lightbox');\n    lightbox.classList.remove('active');\n    document.body.style.overflow = '';\n    isLightboxOpen = false;\n}\n\nfunction navigateLightbox(direction) {\n    const newIndex = currentImageIndex + direction;\n    \n    if (newIndex >= 0 && newIndex < currentPosts.length) {\n        openLightbox(newIndex);\n    }\n}\n\n// Load initial content\nfunction loadInitialContent() {\n    // Check URL hash to determine which section to show\n    const hash = window.location.hash.substring(1); // Remove the # symbol\n    \n    if (hash === 'stories') {\n        // Show stories section\n        showSection('stories');\n        loadStories();\n    } else if (hash === 'gallery') {\n        // Show gallery section\n        showSection('gallery');\n        loadGallery();\n    } else if (hash === 'about') {\n        // Show about section\n        showSection('about');\n    } else {\n        // Default to gallery\n        showSection('gallery');\n        loadGallery();\n    }\n}\n\nfunction showSection(sectionName) {\n    const navButtons = document.querySelectorAll('.nav-btn');\n    const sections = document.querySelectorAll('.content-section');\n    \n    // Update active nav button\n    navButtons.forEach(btn => {\n        btn.classList.remove('active');\n        if (btn.dataset.section === sectionName) {\n            btn.classList.add('active');\n        }\n    });\n    \n    // Update active section\n    sections.forEach(section => section.classList.remove('active'));\n    const target = document.getElementById(sectionName);\n    if (target) {\n        target.classList.add('active');\n    }\n}\n\n// Load gallery\nasync function loadGallery() {\n    const gallery = document.getElementById('photo-gallery');\n    \n    // Show loading state\n    gallery.innerHTML = `\n        <div class=\"gallery-loading\">\n            <div class=\"loading-animation\">\n                <div class=\"loading-dot\"></div>\n                <div class=\"loading-dot\"></div>\n                <div class=\"loading-dot\"></div>\n            </div>\n            <p>Loading gallery...</p>\n        </div>\n    `;\n    \n    try {\n        const response = await fetch('/api/gallery');\n        const galleryImages = await response.json();\n        \n        if (galleryImages.length === 0) {\n            gallery.innerHTML = `\n                <div class=\"gallery-loading\">\n                    <p>No photos in gallery yet.</p>\n                    <p>Add some through the admin interface to get started.</p>\n                </div>\n            `;\n            return;\n        }\n        \n        renderGalleryImages(galleryImages);\n        \n    } catch (error) {\n        console.error('Error loading gallery:', error);\n        gallery.innerHTML = `\n            <div class=\"gallery-loading\">\n                <p>Error loading gallery. Please try again later.</p>\n            </div>\n        `;\n    }\n}\n\nasync function renderGalleryImages(galleryImages) {\n    const gallery = document.getElementById('photo-gallery');\n    \n    // Store gallery images for lightbox\n    currentPosts = galleryImages;\n    currentGalleryImages = galleryImages;\n    \n    const galleryItems = await Promise.all(galleryImages.map(async (image, index) => {\n        const aspectRatio = image.width && image.height ? image.width / image.height : 1;\n        let orientationClass = 'square';\n        \n        if (aspectRatio > 1.5) orientationClass = 'panorama';\n        else if (aspectRatio > 1.1) orientationClass = 'landscape';\n        else if (aspectRatio < 0.9) orientationClass = 'portrait';\n        \n        // Build EXIF metadata for overlay\n        const exifInfo = [];\n        \n        // Add date if available\n        if (image.date_taken) {\n            const formattedDate = formatExifDate(image.date_taken);\n            if (formattedDate) {\n                exifInfo.push(`📅 ${formattedDate}`);\n            }\n        }\n        \n        // Add camera settings if available\n        const cameraSettings = [];\n        if (image.aperture) cameraSettings.push(`f/${image.aperture}`);\n        if (image.shutter_speed) cameraSettings.push(`${image.shutter_speed}`);\n        if (image.iso) cameraSettings.push(`ISO ${image.iso}`);\n        if (image.focal_length) cameraSettings.push(`${image.focal_length}mm`);\n        \n        if (cameraSettings.length > 0) {\n            exifInfo.push(`📷 ${cameraSettings.join(' • ')}`);\n        }\n        \n        // Add location if GPS coordinates are available\n        if (image.gps_latitude && image.gps_longitude) {\n            try {\n                const location = await reverseGeocode(image.gps_latitude, image.gps_longitude);\n                if (location) {\n                    exifInfo.push(`📍 ${location}`);\n                }\n            } catch (error) {\n                console.log('Location lookup failed for image', index);\n            }\n        }\n        \n        return `\n            <div class=\"gallery-item ${orientationClass}\" data-index=\"${index}\">\n                <img src=\"${image.b2_url}\" \n                     alt=\"${image.alt_text || image.title || 'Gallery image'}\" \n                     loading=\"lazy\">\n                <div class=\"gallery-overlay\">\n                    ${image.title ? `<h3>${image.title}</h3>` : ''}\n                    ${image.description ? `<p>${truncateText(image.description, 100)}</p>` : ''}\n                    ${exifInfo.length > 0 ? `<div class=\"exif-info\">${exifInfo.join(' • ')}</div>` : ''}\n                </div>\n            </div>\n        `;\n    }));\n    \n    gallery.innerHTML = galleryItems.join('');\n    \n    // Add click handlers for gallery items to open lightbox\n    gallery.querySelectorAll('.gallery-item').forEach(item => {\n        item.addEventListener('click', () => {\n            const index = parseInt(item.dataset.index);\n            openLightbox(index);\n        });\n    });\n}\n\n// Load stories\nasync function loadStories() {\n    const storiesContainer = document.getElementById('stories-list');\n    \n    // Show loading state\n    storiesContainer.innerHTML = `\n        <div class=\"gallery-loading\">\n            <div class=\"loading-animation\">\n                <div class=\"loading-dot\"></div>\n                <div class=\"loading-dot\"></div>\n                <div class=\"loading-dot\"></div>\n            </div>\n            <p>Loading stories...</p>\n        </div>\n    `;\n    \n    try {\n        const response = await fetch('/api/posts');\n        const posts = await response.json();\n        \n        // Filter posts that have content (stories vs just photos)\n        const stories = posts.filter(post => post.content && post.content.trim().length > 0);\n        \n        if (stories.length === 0) {\n            storiesContainer.innerHTML = `\n                <div class=\"gallery-loading\">\n                    <p>No stories available yet.</p>\n                    <p>Create some through the admin interface to share your narratives.</p>\n                </div>\n            `;\n            return;\n        }\n        \n        renderStories(stories);\n        \n    } catch (error) {\n        console.error('Error loading stories:', error);\n        storiesContainer.innerHTML = `\n            <div class=\"gallery-loading\">\n                <p>Error loading stories. Please try again later.</p>\n            </div>\n        `;\n    }\n}\n\nfunction renderStories(stories) {\n    const storiesContainer = document.getElementById('stories-list');\n    \n    // Render stories - support both with and without images\n    const storiesHTML = stories.map((story, index) => {\n        const imageUrl = story.featured_image_url || (story.images && story.images[0]?.b2_url);\n        const formattedDate = new Date(story.created_at).toLocaleDateString('en-US', { \n            year: 'numeric', \n            month: 'long', \n            day: 'numeric' \n        });\n        \n        if (imageUrl) {\n            // Story with image - use gallery-style layout\n            const aspectRatio = story.featured_image_width && story.featured_image_height ? \n                story.featured_image_width / story.featured_image_height : 1;\n            let orientationClass = 'square';\n            \n            if (aspectRatio > 1.5) orientationClass = 'panorama';\n            else if (aspectRatio > 1.1) orientationClass = 'landscape';\n            else if (aspectRatio < 0.9) orientationClass = 'portrait';\n            \n            return `\n                <div class=\"gallery-item ${orientationClass}\" data-slug=\"${story.slug}\" style=\"cursor: pointer;\">\n                    <img src=\"${imageUrl}\" \n                         alt=\"${story.featured_image_alt || story.title}\" \n                         loading=\"lazy\">\n                    <div class=\"gallery-overlay\">\n                        <h3>${story.title}</h3>\n                        ${story.content ? `<p>${truncateText(story.content, 100)}</p>` : ''}\n                    </div>\n                </div>\n            `;\n        } else {\n            // Text-only story - use card layout\n            return `\n                <div class=\"story-card\" data-slug=\"${story.slug}\" style=\"cursor: pointer;\">\n                    <div class=\"story-card-content\">\n                        <h3>${story.title}</h3>\n                        <div class=\"story-date\">${formattedDate}</div>\n                        ${story.content ? `<p>${truncateText(story.content, 200)}</p>` : ''}\n                    </div>\n                </div>\n            `;\n        }\n    }).join('');\n    \n    // Use mixed layout for stories\n    storiesContainer.innerHTML = `<div class=\"stories-grid\">${storiesHTML}</div>`;\n    \n    // Add click handlers for story items to navigate to post\n    storiesContainer.querySelectorAll('.gallery-item, .story-card').forEach(item => {\n        item.addEventListener('click', () => {\n            const slug = item.dataset.slug;\n            if (slug) {\n                window.location.href = `/post/${slug}`;\n            }\n        });\n    });\n}\n\n// Load about page content\nasync function loadAboutContent() {\n    try {\n        const response = await fetch('/api/about');\n        const about = await response.json();\n        \n        // Update about section content\n        const aboutTitle = document.querySelector('.about-text h2');\n        const aboutLead = document.querySelector('.about-content .lead');\n        const aboutContentParagraphs = document.querySelectorAll('.about-content p:not(.lead)');\n        const profileImage = document.querySelector('.about-image .image-placeholder');\n        \n        if (aboutTitle) aboutTitle.textContent = about.title || 'About';\n        if (aboutLead) aboutLead.textContent = about.lead_text || '';\n        \n        // Update content paragraphs\n        if (about.content && aboutContentParagraphs.length > 0) {\n            const contentParagraphs = about.content.split('\\n\\n');\n            aboutContentParagraphs.forEach((p, index) => {\n                if (contentParagraphs[index]) {\n                    p.textContent = contentParagraphs[index];\n                } else {\n                    p.style.display = 'none';\n                }\n            });\n        }\n        \n        // Update profile image if available\n        if (about.profile_image_url && profileImage) {\n            profileImage.innerHTML = `<img src=\"${about.profile_image_url}\" alt=\"${about.profile_image_alt || 'Profile'}\" style=\"width: 250px; height: 250px; border-radius: 50%; object-fit: cover;\">`;\n        }\n        \n    } catch (error) {\n        console.error('Error loading about content:', error);\n    }\n}\n\n// Update stats in about section\nasync function updateStats() {\n    try {\n        const response = await fetch('/api/posts');\n        const posts = await response.json();\n        \n        const photoCount = posts.length;\n        const storyCount = posts.filter(post => post.content && post.content.trim().length > 0).length;\n        \n        // Animate counters\n        animateCounter('photo-count', photoCount);\n        animateCounter('story-count', storyCount);\n        \n    } catch (error) {\n        console.error('Error updating stats:', error);\n    }\n}\n\nfunction animateCounter(elementId, targetValue) {\n    const element = document.getElementById(elementId);\n    if (!element) return;\n    \n    const duration = 1000; // 1 second\n    const start = 0;\n    const increment = targetValue / (duration / 16); // 60fps\n    \n    let current = start;\n    \n    const timer = setInterval(() => {\n        current += increment;\n        if (current >= targetValue) {\n            current = targetValue;\n            clearInterval(timer);\n        }\n        element.textContent = Math.floor(current);\n    }, 16);\n}\n\n// Utility functions\nfunction truncateText(text, maxLength) {\n    if (!text) return '';\n    \n    // Strip HTML tags first to avoid breaking HTML structure\n    const tempDiv = document.createElement('div');\n    tempDiv.innerHTML = text;\n    const plainText = tempDiv.textContent || tempDiv.innerText || '';\n    \n    if (plainText.length <= maxLength) return plainText;\n    return plainText.substring(0, maxLength).trim() + '...';\n}\n\nfunction formatDate(dateString) {\n    const date = new Date(dateString);\n    return date.toLocaleDateString('en-US', {\n        year: 'numeric',\n        month: 'long',\n        day: 'numeric'\n    });\n}\n\n// Smooth scrolling for hero scroll indicator\ndocument.addEventListener('DOMContentLoaded', function() {\n    const heroScrollIndicator = document.querySelector('.hero-scroll');\n    if (heroScrollIndicator) {\n        heroScrollIndicator.addEventListener('click', () => {\n            const main = document.querySelector('.main');\n            if (main) {\n                main.scrollIntoView({ behavior: 'smooth' });\n            }\n        });\n    }\n});\n\n// Handle image loading errors\ndocument.addEventListener('error', function(e) {\n    if (e.target.tagName === 'IMG') {\n        e.target.style.display = 'none';\n        console.warn('Image failed to load:', e.target.src);\n        \n        // Add a placeholder or retry logic here if needed\n        const parent = e.target.closest('.gallery-item, .story-image');\n        if (parent) {\n            parent.style.display = 'none';\n        }\n    }\n}, true);\n\n// Add scroll animations and effects\nlet ticking = false;\n\nfunction updateScrollEffects() {\n    const scrolled = window.pageYOffset;\n    const hero = document.querySelector('.hero');\n    \n    if (hero) {\n        // Parallax effect for hero\n        hero.style.transform = `translateY(${scrolled * 0.5}px)`;\n    }\n    \n    ticking = false;\n}\n\nwindow.addEventListener('scroll', () => {\n    if (!ticking) {\n        requestAnimationFrame(updateScrollEffects);\n        ticking = true;\n    }\n});\n\n// Initialize intersection observer for animations\nconst observerOptions = {\n    threshold: 0.1,\n    rootMargin: '0px 0px -50px 0px'\n};\n\nconst observer = new IntersectionObserver((entries) => {\n    entries.forEach(entry => {\n        if (entry.isIntersecting) {\n            entry.target.style.opacity = '1';\n            entry.target.style.transform = 'translateY(0)';\n        }\n    });\n}, observerOptions);\n\n// Observe elements for animation\ndocument.addEventListener('DOMContentLoaded', () => {\n    const animatedElements = document.querySelectorAll('.gallery-item, .story-item, .about-container');\n    animatedElements.forEach(el => {\n        el.style.opacity = '0';\n        el.style.transform = 'translateY(20px)';\n        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';\n        observer.observe(el);\n    });\n});",
  "/static/js/post.js": "// Individual post page JavaScript\nlet currentPost = null;\nlet currentImages = [];\nlet currentImageIndex = 0;\n\ndocument.addEventListener('DOMContentLoaded', function() {\n    loadPost();\n    setupLightbox();\n});\n\nasync function loadPost() {\n    const pathParts = window.location.pathname.split('/');\n    const slug = pathParts[pathParts.length - 1];\n    \n    if (!slug || slug === 'post') {\n        showError();\n        return;\n    }\n    \n    try {\n        const response = await fetch(`/api/posts/${slug}`);\n        \n        if (!response.ok) {\n            throw new Error('Post not found');\n        }\n        \n        currentPost = await response.json();\n        renderPost(currentPost);\n        \n    } catch (error) {\n        console.error('Error loading post:', error);\n        showError();\n    }\n}\n\nfunction renderPost(post) {\n    // Update page title\n    document.title = `${post.title} - Visual Stories`;\n    \n    // Show post content\n    document.getElementById('post-loading').style.display = 'none';\n    document.getElementById('post-content').style.display = 'block';\n    \n    // Fill in post data\n    document.getElementById('post-title').textContent = post.title;\n    \n    // Format and display date\n    const date = new Date(post.created_at);\n    document.getElementById('post-date').textContent = date.toLocaleDateString('en-US', {\n        year: 'numeric',\n        month: 'long',\n        day: 'numeric'\n    });\n    \n    // Display post content\n    const postBody = document.getElementById('post-body');\n    postBody.innerHTML = post.content || '';\n    \n    // Hide featured image section completely - featured images are only for promotion/thumbnails\n    document.getElementById('post-featured-image').style.display = 'none';\n    \n    // For gallery, filter out images that are already in the post content\n    let galleryImages = [];\n    if (post.images && post.images.length > 0) {\n        galleryImages = post.images.filter(image => {\n            // Don't include if it's already in the post content\n            if (post.content && post.content.includes(image.b2_url)) {\n                return false;\n            }\n            return true;\n        });\n    }\n    \n    // Set up images for lightbox (all images from content + any remaining gallery images)\n    currentImages = [];\n    \n    // Add images from content first\n    const contentImages = extractImagesFromContent(post.content);\n    currentImages = [...contentImages];\n    \n    // Add any remaining gallery images\n    currentImages = [...currentImages, ...galleryImages];\n    \n    // Display gallery only if there are unused images\n    if (galleryImages.length > 0) {\n        renderPostGallery(galleryImages);\n    }\n    \n    // Make images in content clickable for lightbox\n    setupContentImages();\n}\n\nfunction renderPostGallery(images) {\n    const gallery = document.getElementById('post-gallery');\n    \n    if (images.length === 0) {\n        gallery.style.display = 'none';\n        return;\n    }\n    \n    gallery.innerHTML = `\n        <div class=\"post-masonry-gallery\">\n            <h3>Gallery</h3>\n            <div class=\"masonry-grid\" id=\"masonry-grid\">\n                <!-- Images will be added dynamically -->\n            </div>\n        </div>\n    `;\n    gallery.style.display = 'block';\n    \n    // Add images to masonry grid after DOM is ready\n    setTimeout(() => {\n        const masonryGrid = document.getElementById('masonry-grid');\n        \n        images.forEach((image, index) => {\n            const aspectRatio = image.width && image.height ? image.width / image.height : 1;\n            let orientationClass = 'square';\n            \n            if (aspectRatio > 1.5) orientationClass = 'panorama';\n            else if (aspectRatio > 1.1) orientationClass = 'landscape';\n            else if (aspectRatio < 0.9) orientationClass = 'portrait';\n            \n            const imageElement = document.createElement('div');\n            imageElement.className = `masonry-item ${orientationClass}`;\n            imageElement.setAttribute('data-index', index);\n            imageElement.innerHTML = `\n                <img src=\"${image.b2_url}\" \n                     alt=\"${image.alt_text || image.original_filename}\"\n                     loading=\"lazy\">\n            `;\n            \n            // Add click handler\n            imageElement.addEventListener('click', () => openLightbox(index));\n            \n            masonryGrid.appendChild(imageElement);\n        });\n        \n        // Adjust grid after images load\n        adjustMasonryGrid();\n    }, 50);\n}\n\nasync function setupContentImages() {\n    // Make all images in post content clickable for lightbox\n    const contentImages = document.querySelectorAll('#post-body img');\n    contentImages.forEach(async (img, index) => {\n        img.style.cursor = 'pointer';\n        img.addEventListener('click', async () => {\n            // Find this image in currentImages or create a temporary image object\n            let imageData = {\n                b2_url: img.src,\n                alt_text: img.alt,\n                original_filename: img.alt || 'Image'\n            };\n            \n            // Check if this image is already in currentImages (from post.images)\n            const existingImageFromPost = currentPost?.images?.find(image => image.b2_url === img.src);\n            if (existingImageFromPost) {\n                imageData = { ...imageData, ...existingImageFromPost };\n            }\n            \n            // Add to currentImages if not already there\n            const existingIndex = currentImages.findIndex(image => image.b2_url === img.src);\n            if (existingIndex !== -1) {\n                // Update existing entry with any new data\n                currentImages[existingIndex] = { ...currentImages[existingIndex], ...imageData };\n                openLightbox(existingIndex);\n            } else {\n                // Add as new image and open\n                currentImages.push(imageData);\n                openLightbox(currentImages.length - 1);\n            }\n        });\n    });\n}\n\nfunction showError() {\n    document.getElementById('post-loading').style.display = 'none';\n    document.getElementById('post-error').style.display = 'block';\n}\n\n// Lightbox functionality\nfunction setupLightbox() {\n    const lightbox = document.getElementById('lightbox');\n    const closeBtn = lightbox.querySelector('.lightbox-close');\n    const prevBtn = lightbox.querySelector('.lightbox-prev');\n    const nextBtn = lightbox.querySelector('.lightbox-next');\n    \n    closeBtn.addEventListener('click', closeLightbox);\n    prevBtn.addEventListener('click', () => navigateLightbox(-1));\n    nextBtn.addEventListener('click', () => navigateLightbox(1));\n    \n    // Close lightbox on escape key\n    document.addEventListener('keydown', (e) => {\n        if (e.key === 'Escape' && isLightboxOpen()) {\n            closeLightbox();\n        } else if (e.key === 'ArrowLeft' && isLightboxOpen()) {\n            navigateLightbox(-1);\n        } else if (e.key === 'ArrowRight' && isLightboxOpen()) {\n            navigateLightbox(1);\n        }\n    });\n    \n    // Close lightbox on background click\n    lightbox.addEventListener('click', (e) => {\n        if (e.target === lightbox) {\n            closeLightbox();\n        }\n    });\n}\n\nfunction isLightboxOpen() {\n    return document.getElementById('lightbox').classList.contains('active');\n}\n\nasync function openLightbox(index) {\n    if (!currentImages || currentImages.length === 0) return;\n    \n    currentImageIndex = index;\n    const galleryImage = currentImages[currentImageIndex];\n    \n    const lightbox = document.getElementById('lightbox');\n    \n    // Update lightbox content\n    const image = lightbox.querySelector('.lightbox-image');\n    \n    if (galleryImage.b2_url) {\n        image.src = galleryImage.b2_url;\n        image.alt = galleryImage.alt_text || galleryImage.original_filename || 'Gallery image';\n        \n        // Setup camera overlay only\n        await setupCameraOverlay(galleryImage);\n        \n        lightbox.classList.add('active');\n        document.body.style.overflow = 'hidden';\n        \n        // Update navigation buttons\n        updateLightboxNavigation();\n    }\n}\n\nfunction closeLightbox() {\n    document.getElementById('lightbox').classList.remove('active');\n    document.body.style.overflow = '';\n}\n\nfunction navigateLightbox(direction) {\n    const newIndex = currentImageIndex + direction;\n    \n    if (newIndex >= 0 && newIndex < currentImages.length) {\n        openLightbox(newIndex);\n    }\n}\n\nfunction updateLightboxNavigation() {\n    const prevBtn = document.querySelector('.lightbox-prev');\n    const nextBtn = document.querySelector('.lightbox-next');\n    \n    if (currentImages.length <= 1) {\n        prevBtn.style.display = 'none';\n        nextBtn.style.display = 'none';\n    } else {\n        prevBtn.style.display = 'block';\n        nextBtn.style.display = 'block';\n    }\n}\n\nasync function setupCameraOverlay(galleryImage) {\n    const cameraOverlay = document.getElementById('lightbox-camera-overlay');\n    const cameraDetails = document.getElementById('camera-details');\n    \n    // Try to get image ID from the image data\n    let imageId = galleryImage.image_id || galleryImage.id;\n    \n    // If we don't have an ID, try to find it by filename\n    if (!imageId && galleryImage.b2_url) {\n        try {\n            // Extract filename from URL\n            const urlParts = galleryImage.b2_url.split('/');\n            const filename = urlParts[urlParts.length - 1];\n            const response = await fetch(`/api/images/by-filename?filename=${encodeURIComponent(filename)}`);\n            if (response.ok) {\n                const imageData = await response.json();\n                imageId = imageData.id;\n            }\n        } catch (error) {\n            console.log('Could not find image ID:', error);\n        }\n    }\n    \n    console.log('Found imageId:', imageId);\n    \n    if (imageId) {\n        // Load EXIF data to get camera and lens info\n        const exifData = await loadFullExifData(imageId);\n        \n        console.log('EXIF data loaded:', exifData);\n        \n        if (exifData && (exifData.camera_make || exifData.lens_model)) {\n            let cameraInfo = [];\n            \n            // Add camera info\n            if (exifData.camera_make && exifData.camera_model) {\n                cameraInfo.push(`${exifData.camera_make} ${exifData.camera_model}`);\n            }\n            \n            // Add lens info\n            if (exifData.lens_model) {\n                cameraInfo.push(exifData.lens_model);\n            } else if (exifData.lens_make) {\n                cameraInfo.push(exifData.lens_make);\n            }\n            \n            if (cameraInfo.length > 0) {\n                cameraDetails.innerHTML = cameraInfo.join('<br>');\n                cameraOverlay.style.display = 'block';\n            } else {\n                cameraOverlay.style.display = 'none';\n            }\n        } else {\n            cameraOverlay.style.display = 'none';\n        }\n    } else {\n        cameraOverlay.style.display = 'none';\n    }\n}\n\n// Story posts don't need EXIF panel - only camera overlay\n\nasync function loadFullExifData(imageId) {\n    try {\n        const response = await fetch(`/api/images/${imageId}/exif`);\n        if (response.ok) {\n            return await response.json();\n        }\n    } catch (error) {\n        console.log('Failed to load EXIF data:', error);\n    }\n    return null;\n}\n\nfunction formatFullExifData(exifData, galleryImage) {\n    const sections = [];\n    \n    // Camera Information\n    if (exifData.camera_make || exifData.camera_model) {\n        const cameraRows = [];\n        if (exifData.camera_make) cameraRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Make:</span><span class=\"exif-value\">${exifData.camera_make}</span></div>`);\n        if (exifData.camera_model) cameraRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Model:</span><span class=\"exif-value\">${exifData.camera_model}</span></div>`);\n        \n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>📷 Camera</h4>\n                ${cameraRows.join('')}\n            </div>\n        `);\n    }\n    \n    // Lens Information\n    if (exifData.lens_make || exifData.lens_model) {\n        const lensRows = [];\n        if (exifData.lens_make) lensRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Make:</span><span class=\"exif-value\">${exifData.lens_make}</span></div>`);\n        if (exifData.lens_model) lensRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Model:</span><span class=\"exif-value\">${exifData.lens_model}</span></div>`);\n        \n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>🔍 Lens</h4>\n                ${lensRows.join('')}\n            </div>\n        `);\n    }\n    \n    // Camera Settings\n    const settingsRows = [];\n    if (exifData.focal_length) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Focal Length:</span><span class=\"exif-value\">${exifData.focal_length}mm</span></div>`);\n    if (exifData.focal_length_35mm) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">35mm Equivalent:</span><span class=\"exif-value\">${exifData.focal_length_35mm}mm</span></div>`);\n    if (exifData.aperture) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Aperture:</span><span class=\"exif-value\">f/${exifData.aperture}</span></div>`);\n    if (exifData.shutter_speed) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Shutter Speed:</span><span class=\"exif-value\">${exifData.shutter_speed}</span></div>`);\n    if (exifData.iso) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">ISO:</span><span class=\"exif-value\">${exifData.iso}</span></div>`);\n    if (exifData.flash) settingsRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Flash:</span><span class=\"exif-value\">${exifData.flash}</span></div>`);\n    \n    if (settingsRows.length > 0) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>⚙️ Camera Settings</h4>\n                ${settingsRows.join('')}\n            </div>\n        `);\n    }\n    \n    // Location\n    if (exifData.gps_latitude && exifData.gps_longitude) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>📍 Location</h4>\n                <div class=\"exif-row\"><span class=\"exif-label\">Coordinates:</span><span class=\"exif-value\">${exifData.gps_latitude.toFixed(6)}, ${exifData.gps_longitude.toFixed(6)}</span></div>\n                ${exifData.gps_altitude ? `<div class=\"exif-row\"><span class=\"exif-label\">Altitude:</span><span class=\"exif-value\">${exifData.gps_altitude}m</span></div>` : ''}\n                <div style=\"margin-top: 0.5rem;\">\n                    <a href=\"https://www.google.com/maps?q=${exifData.gps_latitude},${exifData.gps_longitude}\" target=\"_blank\" style=\"color: var(--color-accent); text-decoration: none;\">🗺️ View on Google Maps</a>\n                </div>\n            </div>\n        `);\n    }\n    \n    // Date and Other Info\n    const otherRows = [];\n    if (exifData.date_taken) {\n        const date = new Date(exifData.date_taken).toLocaleString();\n        otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Date Taken:</span><span class=\"exif-value\">${date}</span></div>`);\n    }\n    if (exifData.software) otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Software:</span><span class=\"exif-value\">${exifData.software}</span></div>`);\n    if (exifData.artist) otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Artist:</span><span class=\"exif-value\">${exifData.artist}</span></div>`);\n    if (exifData.copyright) otherRows.push(`<div class=\"exif-row\"><span class=\"exif-label\">Copyright:</span><span class=\"exif-value\">${exifData.copyright}</span></div>`);\n    \n    if (otherRows.length > 0) {\n        sections.push(`\n            <div class=\"exif-section\">\n                <h4>ℹ️ Other Information</h4>\n                ${otherRows.join('')}\n            </div>\n        `);\n    }\n    \n    return sections.length > 0 ? sections.join('') : '<p>No detailed EXIF data available.</p>';\n}\n\nfunction adjustMasonryGrid() {\n    const grid = document.getElementById('masonry-grid');\n    if (!grid) return;\n    \n    const items = grid.querySelectorAll('.masonry-item');\n    \n    items.forEach(item => {\n        const img = item.querySelector('img');\n        if (img && img.complete) {\n            adjustMasonryItem(item, img);\n        } else if (img) {\n            img.addEventListener('load', () => {\n                adjustMasonryItem(item, img);\n            });\n        }\n    });\n}\n\nfunction adjustMasonryItem(item, img) {\n    if (!img.naturalWidth || !img.naturalHeight) return;\n    \n    const aspectRatio = img.naturalWidth / img.naturalHeight;\n    let orientationClass = 'square';\n    \n    if (aspectRatio > 1.5) orientationClass = 'panorama';\n    else if (aspectRatio > 1.1) orientationClass = 'landscape';\n    else if (aspectRatio < 0.9) orientationClass = 'portrait';\n    \n    // Remove existing orientation classes\n    item.classList.remove('portrait', 'landscape', 'square', 'panorama');\n    item.classList.add(orientationClass);\n}\n\nfunction extractImagesFromContent(content) {\n    if (!content) return [];\n    \n    const tempDiv = document.createElement('div');\n    tempDiv.innerHTML = content;\n    const imgElements = tempDiv.querySelectorAll('img');\n    \n    return Array.from(imgElements).map(img => ({\n        b2_url: img.src,\n        alt_text: img.alt,\n        original_filename: img.alt || 'Image from content'\n    }));\n}",
  "/static/js/social-links.js": "// Social Links Dynamic Loading\n\nasync function loadSocialLinks() {\n    try {\n        const response = await fetch('/api/social-links');\n        if (!response.ok) {\n            throw new Error('Failed to load social links');\n        }\n        \n        const socialLinks = await response.json();\n        renderSocialLinks(socialLinks);\n    } catch (error) {\n        console.error('Error loading social links:', error);\n        // Keep existing hardcoded links as fallback\n    }\n}\n\nfunction renderSocialLinks(socialLinks) {\n    const socialContainer = document.querySelector('.hero-social');\n    if (!socialContainer) return;\n    \n    if (socialLinks.length === 0) {\n        // Hide social container if no links\n        socialContainer.style.display = 'none';\n        return;\n    }\n    \n    // Generate social links HTML\n    const socialLinksHTML = socialLinks.map(link => {\n        const iconSvg = link.icon_svg || getDefaultIcon(link.platform);\n        \n        return `\n            <a href=\"${link.url}\" target=\"_blank\" class=\"social-link\" rel=\"noopener noreferrer\">\n                <span>${link.label}</span>\n                <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                    <path d=\"${iconSvg}\"/>\n                </svg>\n            </a>\n        `;\n    }).join('');\n    \n    socialContainer.innerHTML = socialLinksHTML;\n}\n\nfunction getDefaultIcon(platform) {\n    const defaultIcons = {\n        instagram: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z',\n        email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',\n        twitter: 'M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z',\n        linkedin: 'M20.447,20.452H16.893V14.883C16.893,13.555 16.866,11.846 15.041,11.846C13.188,11.846 12.905,13.291 12.905,14.785V20.452H9.351V9H12.765V10.561H12.811C13.288,9.661 14.448,8.711 16.181,8.711C19.782,8.711 20.447,11.081 20.447,14.166V20.452ZM5.337,7.433A2.062,2.062 0 0,1 3.275,5.371A2.062,2.062 0 0,1 5.337,3.309A2.062,2.062 0 0,1 7.399,5.371A2.062,2.062 0 0,1 5.337,7.433ZM7.119,20.452H3.555V9H7.119V20.452ZM22.225,0H1.771C0.792,0 0,0.774 0,1.729V22.271C0,23.227 0.792,24 1.771,24H22.222C23.2,24 24,23.227 24,22.271V1.729C24,0.774 23.2,0 22.222,0H22.225Z',\n        facebook: 'M24,12.073C24,5.405 18.627,0 12,0S0,5.405 0,12.073C0,18.1 4.388,23.094 10.125,24V15.563H7.078V12.073H10.125V9.404C10.125,6.369 11.917,4.725 14.658,4.725C15.97,4.725 17.344,4.954 17.344,4.954V7.922H15.83C14.34,7.922 13.875,8.853 13.875,9.808V12.073H17.203L16.671,15.563H13.875V24C19.612,23.094 24,18.1 24,12.073Z',\n        youtube: 'M23.498,6.186A3.016,3.016 0,0 0,21.372 4.063C19.505,3.546 12,3.546 12,3.546S4.495,3.546 2.628,4.063A3.016,3.016 0,0 0,0.502 6.186C0,8.07 0,12 0,12S0,15.93 0.502,17.814A3.016,3.016 0,0 0,2.628 19.937C4.495,20.454 12,20.454 12,20.454S19.505,20.454 21.372,19.937A3.016,3.016 0,0 0,23.498 17.814C24,15.93 24,12 24,12S24,8.07 23.498,6.186ZM9.545,15.568V8.432L15.818,12L9.545,15.568Z',\n        github: 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z',\n        website: 'M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',\n        mastodon: 'M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792.18 11.813.18h-.03c-3.98 0-4.835.062-5.288.129C3.882.7 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z'\n    };\n    \n    return defaultIcons[platform.toLowerCase()] || defaultIcons.website;\n}\n\n// Load social links when the page loads\ndocument.addEventListener('DOMContentLoaded', loadSocialLinks);",
  "/static/js/theme-loader.js": "// Theme Loading Script\n(function() {\n    'use strict';\n    \n    let currentThemeLink = null;\n    \n    // Load theme CSS dynamically\n    function loadTheme(themeName) {\n        // Remove existing theme link if it exists\n        if (currentThemeLink) {\n            currentThemeLink.remove();\n        }\n        \n        // Only load theme CSS if it's not the default (which is built into style.css)\n        if (themeName && themeName !== 'default') {\n            const themeLink = document.createElement('link');\n            themeLink.rel = 'stylesheet';\n            themeLink.href = `/static/css/theme-${themeName}.css`;\n            themeLink.id = 'theme-css';\n            \n            // Insert after the main style.css\n            const mainStylesheet = document.querySelector('link[href*=\"style.css\"]');\n            if (mainStylesheet) {\n                mainStylesheet.parentNode.insertBefore(themeLink, mainStylesheet.nextSibling);\n            } else {\n                document.head.appendChild(themeLink);\n            }\n            \n            currentThemeLink = themeLink;\n            \n            // Add error handling\n            themeLink.onerror = function() {\n                console.warn(`Failed to load theme: ${themeName}, falling back to default`);\n                this.remove();\n                currentThemeLink = null;\n            };\n        }\n    }\n    \n    // Initialize theme loading\n    function initTheme() {\n        // Try to load current theme from API\n        fetch('/api/theme')\n            .then(response => response.json())\n            .then(data => {\n                const theme = data.theme || 'default';\n                loadTheme(theme);\n                \n                // Store theme preference for faster loading on subsequent visits\n                localStorage.setItem('selectedTheme', theme);\n            })\n            .catch(error => {\n                console.warn('Failed to load theme from API:', error);\n                \n                // Try to use cached theme preference\n                const cachedTheme = localStorage.getItem('selectedTheme');\n                if (cachedTheme) {\n                    loadTheme(cachedTheme);\n                }\n            });\n    }\n    \n    // Initialize when DOM is ready\n    if (document.readyState === 'loading') {\n        document.addEventListener('DOMContentLoaded', initTheme);\n    } else {\n        initTheme();\n    }\n    \n    // Expose loadTheme function globally for admin interface\n    window.loadTheme = loadTheme;\n})();"
};

// Helper function to get MIME type
function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'ico': 'image/x-icon',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject'
  };
  return mimeTypes[ext] || 'text/plain';
}

// Basic HTML template for individual post pages
const postPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="post-title">Tomas Jonsson - Photography</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8f9fa; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .nav { margin-bottom: 2rem; }
        .nav a { color: #007bff; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .post-header { margin-bottom: 2rem; }
        .post-title { font-size: 2.5rem; margin-bottom: 0.5rem; color: #333; }
        .post-meta { color: #666; font-size: 0.9rem; }
        .post-content { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .featured-image { width: 100%; height: auto; border-radius: 8px; margin-bottom: 2rem; }
        .gallery { margin-top: 2rem; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .gallery-item { border-radius: 8px; overflow: hidden; }
        .gallery-item img { width: 100%; height: auto; display: block; }
        .loading { text-align: center; padding: 3rem; color: #666; }
        .error { text-align: center; padding: 3rem; color: #d32f2f; }
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="/">← Back to Blog</a>
        </nav>
        <div id="post-content" class="loading">Loading post...</div>
    </div>
    
    <script>
        async function loadPost() {
            try {
                const slug = window.location.pathname.split('/post/')[1];
                if (!slug) {
                    throw new Error('No post slug found');
                }
                
                const response = await fetch(\`/api/posts/\${slug}\`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Post not found');
                    }
                    throw new Error('Failed to load post');
                }
                
                const post = await response.json();
                
                // Update page title
                document.getElementById('post-title').textContent = \`\${post.title} - Tomas Jonsson Photography\`;
                
                // Build post HTML
                let html = \`
                    <div class="post-header">
                        <h1 class="post-title">\${post.title}</h1>
                        <div class="post-meta">
                            Published: \${new Date(post.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="post-content">
                \`;
                
                // Add featured image if available
                if (post.featured_image_url) {
                    html += \`<img src="\${post.featured_image_url}" alt="\${post.featured_image_alt || post.title}" class="featured-image">\`;
                }
                
                // Add content
                if (post.content) {
                    html += \`<div>\${post.content.replace(/\\n/g, '<br>')}</div>\`;
                }
                
                // Add gallery if images exist
                if (post.images && post.images.length > 0) {
                    html += \`
                        <div class="gallery">
                            <h3>Gallery</h3>
                            <div class="gallery-grid">
                    \`;
                    post.images.forEach(image => {
                        html += \`
                            <div class="gallery-item">
                                <img src="\${image.b2_url}" alt="\${image.alt_text || ''}" loading="lazy">
                            </div>
                        \`;
                    });
                    html += \`
                            </div>
                        </div>
                    \`;
                }
                
                html += '</div>';
                
                document.getElementById('post-content').innerHTML = html;
            } catch (error) {
                document.getElementById('post-content').innerHTML = \`<div class="error">Error: \${error.message}</div>\`;
            }
        }
        
        loadPost();
    </script>
</body>
</html>
`;

// Basic HTML template for the about page
const aboutPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Tomas Jonsson Photography</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8f9fa; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .nav { margin-bottom: 2rem; }
        .nav a { color: #007bff; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .about-content { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .profile-image { width: 200px; height: 200px; border-radius: 50%; object-fit: cover; float: left; margin: 0 2rem 1rem 0; }
        .about-title { font-size: 2.5rem; margin-bottom: 1rem; color: #333; }
        .lead-text { font-size: 1.2rem; color: #666; margin-bottom: 2rem; font-style: italic; }
        .loading { text-align: center; padding: 3rem; color: #666; }
        .error { text-align: center; padding: 3rem; color: #d32f2f; }
        .social-links { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eee; }
        .social-links h3 { margin-bottom: 1rem; }
        .social-link { display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem; }
        .social-link a { color: #007bff; text-decoration: none; }
        .social-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="/">← Back to Blog</a>
        </nav>
        <div id="about-content" class="loading">Loading about page...</div>
    </div>
    
    <script>
        async function loadAbout() {
            try {
                const [aboutResponse, socialResponse] = await Promise.all([
                    fetch('/api/about'),
                    fetch('/api/social-links')
                ]);
                
                if (!aboutResponse.ok) {
                    throw new Error('Failed to load about page');
                }
                
                const about = await aboutResponse.json();
                const socialLinks = socialResponse.ok ? await socialResponse.json() : [];
                
                let html = \`
                    <div class="about-content">
                        <h1 class="about-title">\${about.title || 'About'}</h1>
                \`;
                
                // Add profile image if available
                if (about.profile_image_url) {
                    html += \`<img src="\${about.profile_image_url}" alt="\${about.profile_image_alt || 'Profile'}" class="profile-image">\`;
                }
                
                // Add lead text
                if (about.lead_text) {
                    html += \`<div class="lead-text">\${about.lead_text}</div>\`;
                }
                
                // Add content
                if (about.content) {
                    html += \`<div>\${about.content.replace(/\\n/g, '<br>')}</div>\`;
                }
                
                // Add social links
                if (socialLinks.length > 0) {
                    html += \`
                        <div class="social-links">
                            <h3>Connect</h3>
                    \`;
                    socialLinks.forEach(link => {
                        html += \`
                            <div class="social-link">
                                <a href="\${link.url}" target="_blank" rel="noopener noreferrer">\${link.label}</a>
                            </div>
                        \`;
                    });
                    html += '</div>';
                }
                
                html += '</div>';
                
                document.getElementById('about-content').innerHTML = html;
            } catch (error) {
                document.getElementById('about-content').innerHTML = \`<div class="error">Error: \${error.message}</div>\`;
            }
        }
        
        loadAbout();
    </script>
</body>
</html>
`;

// Basic HTML template for the homepage
const homepageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tomas Jonsson - Photography</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 2rem; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .site-header { text-align: center; margin-bottom: 3rem; }
        .site-header h1 { color: #333; margin-bottom: 1rem; }
        .main-nav { margin-top: 1rem; }
        .main-nav a { color: #007bff; text-decoration: none; margin: 0 1rem; font-size: 1.1rem; }
        .main-nav a:hover { text-decoration: underline; }
        .posts { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .post { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .post h2 { margin-top: 0; }
        .post h2 a { color: #333; text-decoration: none; }
        .post h2 a:hover { color: #007bff; }
        .post-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem; }
        .post-meta { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
        .post-excerpt { margin-bottom: 1rem; line-height: 1.6; }
        .read-more { color: #007bff; text-decoration: none; font-weight: 500; }
        .read-more:hover { text-decoration: underline; }
        .loading { text-align: center; padding: 3rem; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <header class="site-header">
            <h1>Tomas Jonsson - Photography</h1>
            <nav class="main-nav">
                <a href="/">Blog</a>
                <a href="/about">About</a>
            </nav>
        </header>
        <div id="posts" class="loading">Loading posts...</div>
    </div>
    
    <script>
        async function loadPosts() {
            try {
                const response = await fetch('/api/posts');
                const posts = await response.json();
                
                const postsContainer = document.getElementById('posts');
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<p>No posts found.</p>';
                    return;
                }
                
                postsContainer.className = 'posts';
                postsContainer.innerHTML = posts.map(post => \`
                    <div class="post">
                        \${post.featured_image_url ? '<img src="' + post.featured_image_url + '" alt="' + (post.featured_image_alt || post.title) + '" class="post-image">' : ''}
                        <h2><a href="/post/\${post.slug}">\${post.title}</a></h2>
                        <div class="post-meta">
                            Published: \${new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div class="post-excerpt">\${post.content ? post.content.substring(0, 200) + '...' : ''}</div>
                        <a href="/post/\${post.slug}" class="read-more">Read more →</a>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('posts').innerHTML = '<p>Error loading posts.</p>';
                console.error('Error loading posts:', error);
            }
        }
        
        loadPosts();
    </script>
</body>
</html>
`;


  // Authentication helper
  async function isAuthenticated(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.substring(7);
    
    // Simple token validation - in production you'd check against KV/DO storage
    if (!token || token.length < 10) {
      return false;
    }
    
    return { token, authenticated: true };
  }

  // Serve static files
  function serveStaticFile(pathname) {
    const staticFiles = {
      "/static/css/admin.css": `/* Admin CSS styles would go here */`,
      "/static/js/admin.js": `// Admin interface JavaScript
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
                'Authorization': \`Bearer \${authToken}\`
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
    const modalHtml = \`
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
    \`;
    
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
                'Authorization': \`Bearer \${authToken}\`
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
                'Authorization': \`Bearer \${authToken}\`
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
        postsListElement.innerHTML = \`
            <div class="loading" style="text-align: center; padding: 4rem; color: #718096;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 1rem; opacity: 0.5;">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <h3 style="margin-bottom: 0.5rem; color: #4a5568;">No posts found</h3>
                <p>Create your first post to get started.</p>
            </div>
        \`;
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
            \`<div class="post-thumbnail">
                <img src="\${post.featured_image_url}" alt="\${post.title}" loading="lazy">
            </div>\` : 
            \`<div class="post-thumbnail">
                <div class="post-thumbnail-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                </div>
            </div>\`;

        return \`
            <div class="post-item">
                <div class="post-item-content">
                    \${thumbnailHtml}
                    <div class="post-item-header">
                        <div class="post-info">
                            <h3>\${post.title}</h3>
                            <div class="post-meta">
                                <div class="post-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                    </svg>
                                    <span>\${dateText}: \${displayDate.toLocaleDateString()}</span>
                                </div>
                                \${post.slug ? \`
                                    <div class="post-meta-item">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                                        </svg>
                                        <span>/\${post.slug}</span>
                                    </div>
                                \` : ''}
                            </div>
                            <span class="post-status \${status}">\${statusText}</span>
                        </div>
                        <div class="post-actions">
                            <button class="btn btn-outline" onclick="editPost(\${post.id})">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                Edit
                            </button>
                            <button class="btn btn-danger" onclick="deletePost(\${post.id})">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                \${contentPreview ? \`<div class="post-preview">\${contentPreview}</div>\` : ''}
            </div>
        \`;
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
    
    const activeBtn = document.getElementById(\`\${activeSection}-nav-btn\`);
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
                html += \`<p>\${block.data.text}</p>\`;
                break;
            case 'header':
                const level = block.data.level || 2;
                html += \`<h\${level}>\${block.data.text}</h\${level}>\`;
                break;
            case 'list':
                const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
                html += \`<\${listType}>\`;
                block.data.items.forEach(item => {
                    html += \`<li>\${item}</li>\`;
                });
                html += \`</\${listType}>\`;
                break;
            case 'quote':
                html += \`<blockquote><p>\${block.data.text}</p>\`;
                if (block.data.caption) {
                    html += \`<cite>\${block.data.caption}</cite>\`;
                }
                html += \`</blockquote>\`;
                break;
            case 'image':
                html += \`<img src="\${block.data.file.url}" alt="\${block.data.caption || ''}"\`;
                if (block.data.caption) {
                    html += \` title="\${block.data.caption}"\`;
                }
                html += \`>\`;
                if (block.data.caption) {
                    html += \`<p><em>\${block.data.caption}</em></p>\`;
                }
                break;
            case 'imageLibrary':
                if (block.data.url) {
                    // Include width styling if specified
                    const widthStyle = block.data.width && block.data.width !== 'auto' 
                        ? \` style="width: \${block.data.width}; max-width: \${block.data.maxWidth || '100%'};"\` 
                        : '';
                    html += \`<img src="\${block.data.url}" alt="\${block.data.caption || ''}"\`;
                    if (block.data.caption) {
                        html += \` title="\${block.data.caption}"\`;
                    }
                    // Add width data attributes for restoration
                    if (block.data.width) {
                        html += \` data-width="\${block.data.width}"\`;
                    }
                    if (block.data.maxWidth) {
                        html += \` data-max-width="\${block.data.maxWidth}"\`;
                    }
                    html += \`\${widthStyle}>\`;
                    if (block.data.caption) {
                        html += \`<p><em>\${block.data.caption}</em></p>\`;
                    }
                }
                break;
            case 'code':
                html += \`<pre><code>\${block.data.code}</code></pre>\`;
                break;
            case 'raw':
                html += block.data.html;
                break;
            case 'delimiter':
                html += \`<hr>\`;
                break;
            case 'table':
                html += \`<table>\`;
                block.data.content.forEach(row => {
                    html += \`<tr>\`;
                    row.forEach(cell => {
                        html += \`<td>\${cell}</td>\`;
                    });
                    html += \`</tr>\`;
                });
                html += \`</table>\`;
                break;
            case 'embed':
                if (block.data.service === 'youtube') {
                    html += \`<iframe width="560" height="315" src="\${block.data.embed}" frameborder="0" allowfullscreen></iframe>\`;
                } else {
                    html += \`<div class="embed" data-service="\${block.data.service}">\${block.data.embed}</div>\`;
                }
                break;
            default:
                // Fallback for unknown block types
                if (block.data.text) {
                    html += \`<p>\${block.data.text}</p>\`;
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
            this.wrapper.innerHTML = \`
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
            \`;
        }

        _createImage(url, caption) {
            const imageWidth = this.data.width || 'auto';
            const maxWidth = this.data.maxWidth || '100%';
            
            this.wrapper.innerHTML = \`
                <div class="resizable-image-container" style="text-align: center; position: relative; display: inline-block; max-width: 100%;">
                    <div class="image-wrapper" style="position: relative; display: inline-block; width: \${imageWidth}; max-width: \${maxWidth};">
                        <img 
                            src="\${url}" 
                            style="width: 100%; height: auto; border-radius: 8px; display: block;" 
                            alt="\${caption || ''}"
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
                    \${caption ? \`<p style="margin: 0.5rem 0 0 0; color: #666; font-style: italic;">\${caption}</p>\` : ''}
                </div>
            \`;
            
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
                
                imageWrapper.style.width = \`\${newWidth}px\`;
                imageWrapper.style.maxWidth = 'none';
                
                // Store the width for saving
                this.data.width = \`\${newWidth}px\`;
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
        const url = currentPostId ? \`/api/admin/posts/\${currentPostId}\` : '/api/admin/posts';
        const method = currentPostId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${authToken}\`
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
        const response = await fetch(\`/api/admin/posts/\${postId}\`, {
            method: 'DELETE',
            headers: {
                'Authorization': \`Bearer \${authToken}\`
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
                    'Authorization': \`Bearer \${authToken}\`
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(\`Failed to upload \${file.name}\`);
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
    previewItem.innerHTML = \`
        <img src="\${imageData.b2_url}" alt="\${imageData.alt_text || imageData.original_filename}">
        <button class="remove-btn" onclick="removeImagePreview(this, \${imageData.id})">&times;</button>
    \`;
    
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
                'Authorization': \`Bearer \${authToken}\`
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
        
        
        return \`
            <div class="file-item \${fileManagerMode === 'manage' ? 'delete-mode' : ''}" data-image-id="\${image.id}">
                <img src="\${image.b2_url}" alt="\${image.alt_text || image.original_filename}" loading="lazy">
                \${fileManagerMode === 'select' ? 
                    \`<input type="checkbox" class="file-item-checkbox">\` : 
                    \`<button class="file-item-delete">&times;</button>\`
                }
                <div class="file-item-info">
                    <div class="file-item-name">\${image.original_filename}</div>
                    <div class="file-item-meta">\${date} • \${fileSize}</div>
                </div>
            </div>
        \`;
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
    
    countEl.textContent = \`\${selectedImages.length} selected\`;
    
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
        const response = await fetch(\`/api/admin/images/\${imageId}\`, {
            method: 'DELETE',
            headers: {
                'Authorization': \`Bearer \${authToken}\`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        
        // Remove from UI
        const item = document.querySelector(\`[data-image-id="\${imageId}"]\`);
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
    preview.innerHTML = \`<img src="\${imageUrl}" alt="Featured image">\`;
    
    document.getElementById('remove-featured-btn').style.display = 'inline-block';
}

function setProfileImage(imageId, imageUrl) {
    document.getElementById('about-profile-image-id').value = imageId;
    
    const preview = document.getElementById('current-profile-image');
    preview.innerHTML = \`<img src="\${imageUrl}" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">\`;
}

function removeFeaturedImage() {
    featuredImageId = null;
    document.getElementById('featured-image-id').value = '';
    
    const preview = document.getElementById('featured-image-preview');
    preview.innerHTML = \`
        <div class="featured-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
        </div>
    \`;
    
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
    
    const confirmMsg = \`Are you sure you want to delete \${selectedImages.length} image(s)? This action cannot be undone.\`;
    if (!confirm(confirmMsg)) return;
    
    try {
        // Delete each selected image
        for (const imageId of selectedImages) {
            await fetch(\`/api/admin/images/\${imageId}\`, {
                method: 'DELETE',
                headers: {
                    'Authorization': \`Bearer \${authToken}\`
                }
            });
            
            // Remove from UI
            const item = document.querySelector(\`[data-image-id="\${imageId}"]\`);
            if (item) {
                item.remove();
            }
        }
        
        // Update arrays
        allImages = allImages.filter(img => !selectedImages.includes(img.id));
        selectedImages = [];
        updateSelectedCount();
        
        showMessage(\`\${selectedImages.length} image(s) deleted successfully\`);
        
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
                'Authorization': \`Bearer \${authToken}\`
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
        galleryList.innerHTML = \`
            <div class="loading">
                <p>No images in gallery yet.</p>
                <p>Click "Add Images to Gallery" to get started.</p>
            </div>
        \`;
        return;
    }
    
    const imagesHTML = images.map(image => {
        const date = new Date(image.created_at).toLocaleDateString();
        
        return \`
            <div class="gallery-admin-item" data-gallery-id="\${image.id}">
                <div class="gallery-admin-image">
                    <img src="\${image.b2_url}" alt="\${image.alt_text || image.title || image.original_filename}" loading="lazy">
                </div>
                <div class="gallery-admin-info">
                    <h3>\${image.title || image.original_filename}</h3>
                    <p class="gallery-admin-description">\${image.description || 'No description'}</p>
                    <div class="gallery-admin-meta">
                        Added: \${date} • Order: \${image.sort_order}
                        \${!image.visible ? ' • <span class="hidden-badge">Hidden</span>' : ''}
                    </div>
                </div>
                <div class="gallery-admin-actions">
                    <button class="btn btn-small btn-outline" onclick="viewExifData(\${image.image_id})">EXIF</button>
                    <button class="btn btn-small btn-outline" onclick="editGalleryItem(\${image.id})">Edit</button>
                    <button class="btn btn-small btn-secondary" onclick="toggleGalleryVisibility(\${image.id}, \${image.visible})">\${image.visible ? 'Hide' : 'Show'}</button>
                    <button class="btn btn-small btn-danger" onclick="removeFromGallery(\${image.id})">Remove</button>
                </div>
            </div>
        \`;
    }).join('');
    
    galleryList.innerHTML = \`<div class="gallery-admin-grid">\${imagesHTML}</div>\`;
}

async function addImagesToHomepageGallery(imageIds) {
    try {
        for (const imageId of imageIds) {
            await fetch('/api/admin/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${authToken}\`
                },
                body: JSON.stringify({ image_id: imageId })
            });
        }
        
        showMessage(\`\${imageIds.length} image(s) added to gallery\`);
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
        const response = await fetch(\`/api/admin/gallery/\${galleryId}\`, {
            method: 'DELETE',
            headers: {
                'Authorization': \`Bearer \${authToken}\`
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
        const response = await fetch(\`/api/admin/gallery/\${galleryId}\`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify({ visible: !currentVisibility })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update visibility');
        }
        
        showMessage(\`Image \${!currentVisibility ? 'shown' : 'hidden'} in gallery\`);
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
        const response = await fetch(\`/api/images/\${imageId}/exif\`);
        
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
    const modalHtml = \`
        <div id="exif-modal" class="modal active">
            <div class="modal-content exif-modal-content">
                <div class="modal-header">
                    <h2>EXIF Data</h2>
                    <button class="modal-close" onclick="closeExifModal()">&times;</button>
                </div>
                <div class="exif-content">
                    \${formatExifData(exifData)}
                </div>
            </div>
        </div>
    \`;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function formatExifData(exif) {
    const sections = [];
    
    // Camera Information
    if (exif.camera_make || exif.camera_model) {
        sections.push(\`
            <div class="exif-section">
                <h3>Camera</h3>
                \${exif.camera_make ? \`<p><strong>Make:</strong> \${exif.camera_make}</p>\` : ''}
                \${exif.camera_model ? \`<p><strong>Model:</strong> \${exif.camera_model}</p>\` : ''}
            </div>
        \`);
    }
    
    // Lens Information
    if (exif.lens_make || exif.lens_model) {
        sections.push(\`
            <div class="exif-section">
                <h3>Lens</h3>
                \${exif.lens_make ? \`<p><strong>Make:</strong> \${exif.lens_make}</p>\` : ''}
                \${exif.lens_model ? \`<p><strong>Model:</strong> \${exif.lens_model}</p>\` : ''}
            </div>
        \`);
    }
    
    // Photography Settings
    const settings = [];
    if (exif.focal_length) settings.push(\`<p><strong>Focal Length:</strong> \${exif.focal_length}mm</p>\`);
    if (exif.focal_length_35mm) settings.push(\`<p><strong>35mm Equivalent:</strong> \${exif.focal_length_35mm}mm</p>\`);
    if (exif.aperture) settings.push(\`<p><strong>Aperture:</strong> f/\${exif.aperture}</p>\`);
    if (exif.shutter_speed) settings.push(\`<p><strong>Shutter Speed:</strong> \${exif.shutter_speed}</p>\`);
    if (exif.iso) settings.push(\`<p><strong>ISO:</strong> \${exif.iso}</p>\`);
    if (exif.flash) settings.push(\`<p><strong>Flash:</strong> \${exif.flash}</p>\`);
    
    if (settings.length > 0) {
        sections.push(\`
            <div class="exif-section">
                <h3>Camera Settings</h3>
                \${settings.join('')}
            </div>
        \`);
    }
    
    // Location (GPS)
    if (exif.gps_latitude && exif.gps_longitude) {
        sections.push(\`
            <div class="exif-section">
                <h3>Location</h3>
                <p><strong>Coordinates:</strong> \${exif.gps_latitude.toFixed(6)}, \${exif.gps_longitude.toFixed(6)}</p>
                \${exif.gps_altitude ? \`<p><strong>Altitude:</strong> \${exif.gps_altitude}m</p>\` : ''}
                <p><a href="https://www.google.com/maps?q=\${exif.gps_latitude},\${exif.gps_longitude}" target="_blank">View on Google Maps</a></p>
            </div>
        \`);
    }
    
    // Date and Other Info
    const otherInfo = [];
    if (exif.date_taken) {
        const date = new Date(exif.date_taken).toLocaleString();
        otherInfo.push(\`<p><strong>Date Taken:</strong> \${date}</p>\`);
    }
    if (exif.software) otherInfo.push(\`<p><strong>Software:</strong> \${exif.software}</p>\`);
    if (exif.artist) otherInfo.push(\`<p><strong>Artist:</strong> \${exif.artist}</p>\`);
    if (exif.copyright) otherInfo.push(\`<p><strong>Copyright:</strong> \${exif.copyright}</p>\`);
    
    if (otherInfo.length > 0) {
        sections.push(\`
            <div class="exif-section">
                <h3>Other Information</h3>
                \${otherInfo.join('')}
            </div>
        \`);
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
                'Authorization': \`Bearer \${authToken}\`
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
    
    aboutForm.innerHTML = \`
        <div class="form-grid">
            <div class="form-group">
                <label for="about-title">Title:</label>
                <input type="text" id="about-title" value="\${aboutData.title || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="about-lead">Lead Text:</label>
                <textarea id="about-lead" rows="3" placeholder="A brief introduction or tagline...">\${aboutData.lead_text || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="about-content">Content:</label>
                <textarea id="about-content" rows="10" placeholder="Main about content...">\${aboutData.content || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="about-profile-image">Profile Image:</label>
                <div class="profile-image-section">
                    <div id="current-profile-image" class="current-image">
                        \${aboutData.profile_image_url ? 
                            \`<img src="\${aboutData.profile_image_url}" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">\` 
                            : '<div class="no-image">No profile image selected</div>'
                        }
                    </div>
                    <div class="image-actions">
                        <button type="button" id="select-profile-btn" class="btn btn-outline">Select Image</button>
                        <button type="button" id="remove-profile-btn" class="btn btn-outline">Remove</button>
                        <input type="hidden" id="about-profile-image-id" value="\${aboutData.profile_image_id || ''}">
                    </div>
                </div>
            </div>
        </div>
    \`;
    
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
                'Authorization': \`Bearer \${authToken}\`
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
                'Authorization': \`Bearer \${authToken}\`
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
        imagesList.innerHTML = \`
            <div class="loading">
                <p>No images found.</p>
                <p>Try adjusting your search or upload new images.</p>
            </div>
        \`;
        return;
    }
    
    const imagesHTML = images.map(image => {
        const date = new Date(image.created_at).toLocaleDateString();
        const fileSize = formatFileSize(image.file_size || 0);
        const hasExif = image.camera_make || image.camera_model || image.lens_make || image.lens_model;
        
        // Build EXIF info display
        const exifInfo = [];
        if (image.camera_make && image.camera_model) {
            exifInfo.push(\`\${image.camera_make} \${image.camera_model}\`);
        } else if (image.camera_model) {
            exifInfo.push(image.camera_model);
        }
        
        if (image.lens_make && image.lens_model) {
            exifInfo.push(\`\${image.lens_make} \${image.lens_model}\`);
        } else if (image.lens_model) {
            exifInfo.push(image.lens_model);
        }
        
        if (image.focal_length) {
            exifInfo.push(\`\${image.focal_length}mm\`);
        }
        
        if (image.aperture) {
            exifInfo.push(\`f/\${image.aperture}\`);
        }
        
        if (image.iso) {
            exifInfo.push(\`ISO \${image.iso}\`);
        }
        
        const exifDisplay = exifInfo.length > 0 ? exifInfo.join(' • ') : '';
        
        return \`
            <div class="gallery-admin-item" data-image-id="\${image.id}">
                <div class="gallery-admin-image">
                    <img src="\${image.b2_url}" alt="\${image.alt_text || image.original_filename}" loading="lazy">
                </div>
                <div class="gallery-admin-info">
                    <h3>\${image.original_filename}</h3>
                    <p class="gallery-admin-description">\${image.alt_text || 'No description'}</p>
                    \${exifDisplay ? \`<p class="gallery-admin-exif" style="font-size: 0.8rem; color: #666; margin: 0.25rem 0;">\${exifDisplay}</p>\` : ''}
                    <div class="gallery-admin-meta">
                        Uploaded: \${date} • \${fileSize}
                        \${image.width && image.height ? \` • \${image.width}×\${image.height}\` : ''}
                        \${hasExif ? ' • <span style="color: #28a745;">Has EXIF</span>' : ' • <span style="color: #dc3545;">No EXIF</span>'}
                    </div>
                </div>
                <div class="gallery-admin-actions">
                    <button class="btn btn-small btn-outline" onclick="viewExifData(\${image.id})">EXIF</button>
                    <button class="btn btn-small btn-outline" onclick="editImageDetails(\${image.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteImageFromLibrary(\${image.id})">Delete</button>
                </div>
            </div>
        \`;
    }).join('');
    
    imagesList.innerHTML = \`<div class="gallery-admin-grid">\${imagesHTML}</div>\`;
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
                        'Authorization': \`Bearer \${authToken}\`
                    },
                    body: formData
                });
                
                if (response.ok) {
                    successCount++;
                } else {
                    failCount++;
                    console.error(\`Failed to upload \${file.name}\`);
                }
            } catch (error) {
                failCount++;
                console.error(\`Error uploading \${file.name}:\`, error);
            }
        }
        
        showMessage(\`Uploaded \${successCount} image(s)\${failCount > 0 ? \`, \${failCount} failed\` : ''}\`);
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
        const response = await fetch(\`/api/admin/images/\${imageId}\`, {
            method: 'DELETE',
            headers: {
                'Authorization': \`Bearer \${authToken}\`
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
                'Authorization': \`Bearer \${authToken}\`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to update EXIF data');
        }
        
        const result = await response.json();
        
        if (result.success) {
            const message = result.total === 0 
                ? 'All images already have EXIF data!'
                : \`EXIF update completed!\n\nProcessed: \${result.processed}\nFailed: \${result.failed}\nTotal checked: \${result.total}\`;
            
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
                'Authorization': \`Bearer \${authToken}\`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to migrate images');
        }
        
        const result = await response.json();
        
        if (result.success) {
            const message = result.total === 0 
                ? 'All images are already organized!'
                : \`File organization completed!\n\nMigrated: \${result.migrated}\nFailed: \${result.failed}\nTotal: \${result.total}\n\nYour images are now organized by date in the blog/images/ folder.\`;
            
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
                'Authorization': \`Bearer \${authToken}\`
            }
        });
        
        if (!basicTest.ok && basicTest.status === 404) {
            alert('❌ Server Error: API endpoints not responding. Is the server running?');
            return;
        }
    } catch (networkError) {
        alert(\`❌ Network Error: \${networkError.message}\n\nIs the server running?\`);
        return;
    }
    
    try {
        const response = await fetch('/api/admin/bucket-files?test=true', {
            headers: {
                'Authorization': \`Bearer \${authToken}\`
            }
        });
        
        // Get the raw response text first
        const responseText = await response.text();
        
        // Try to parse as JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            alert(\`❌ Server Response Error:
            
Status: \${response.status}
Response: \${responseText.substring(0, 500)}...

This suggests a server-side error. Check the server logs.\`);
            return;
        }
        
        if (response.ok && result.success) {
            const message = \`✅ B2 Connection Successful!
            
Account ID: \${result.accountId}
Configured Bucket: \${result.configuredBucket}
Allowed Bucket: \${result.allowedBucket}
Bucket Match: \${result.bucketMatch ? '✅ Yes' : '❌ No'}

API URL: \${result.apiUrl}
Download URL: \${result.downloadUrl}\`;
            
            alert(message);
            
            if (!result.bucketMatch) {
                alert('⚠️ Warning: Your B2 Application Key is not authorized for the configured bucket ID. This is likely the cause of the 401 error.');
            }
        } else {
            const errorMsg = \`❌ B2 Connection Failed:
            
Error: \${result.error}
Details: \${JSON.stringify(result.details, null, 2)}\`;
            alert(errorMsg);
        }
        
    } catch (error) {
        alert(\`❌ B2 Test Failed: \${error.message}\`);
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
                'Authorization': \`Bearer \${authToken}\`
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
            breadcrumbHTML += \` / <a href="#" onclick="navigateToPath('\${currentPathBuild}')">\${part}</a>\`;
        });
        
        breadcrumb.innerHTML = breadcrumbHTML;
    } else {
        breadcrumb.textContent = '/';
    }
}

function updateStats() {
    document.getElementById('file-count').textContent = \`\${filteredBucketFiles.length} files\`;
    document.getElementById('selected-count').textContent = \`\${selectedBucketFiles.length} selected\`;
    document.getElementById('import-ready-count').textContent = \`\${filteredBucketFiles.filter(f => f.canImport).length} can be imported\`;
}

function navigateToPath(path) {
    currentPath = path;
    loadBucketFiles(path);
}

function renderBucketFiles() {
    const bucketList = document.getElementById('bucket-list');
    
    if (bucketData.folders.length === 0 && filteredBucketFiles.length === 0) {
        bucketList.innerHTML = \`
            <div class="loading">
                <p>No files found in this directory.</p>
                <p>Try navigating to a different folder or changing the filter.</p>
            </div>
        \`;
        return;
    }
    
    let itemsHTML = '';
    
    // Add parent directory link if not at root
    if (currentPath) {
        const parentPath = currentPath.split('/').slice(0, -2).join('/');
        const parentPathWithSlash = parentPath ? parentPath + '/' : '';
        
        itemsHTML += \`
            <div class="gallery-admin-item folder-item" onclick="navigateToPath('\${parentPathWithSlash}')">
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
        \`;
    }
    
    // Add folders
    bucketData.folders.forEach(folder => {
        itemsHTML += \`
            <div class="gallery-admin-item folder-item" onclick="navigateToPath('\${folder.path}')">
                <div class="gallery-admin-image" style="display: flex; align-items: center; justify-content: center; background: #e9ecef;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#666">
                        <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                    </svg>
                </div>
                <div class="gallery-admin-info">
                    <h3>📁 \${folder.name}</h3>
                    <p class="gallery-admin-description">Folder</p>
                </div>
            </div>
        \`;
    });
    
    // Add files
    filteredBucketFiles.forEach(file => {
        const uploadDate = new Date(file.uploadTimestamp).toLocaleDateString();
        const fileSize = formatFileSize(file.contentLength || 0);
        const statusClass = file.isImported ? 'imported' : file.canImport ? 'importable' : 'non-image';
        const statusText = file.isImported ? 'Already imported' : file.canImport ? 'Ready to import' : 'Not an image';
        const statusColor = file.isImported ? '#666' : file.canImport ? '#28a745' : '#dc3545';
        
        itemsHTML += \`
            <div class="gallery-admin-item bucket-file-item \${statusClass}" data-file-id="\${file.fileId}">
                <div class="gallery-admin-image">
                    \${file.isImage ? 
                        \`<img src="\${file.url}" alt="\${file.displayName}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div style="display: none; align-items: center; justify-content: center; background: #f0f0f0; width: 100%; height: 100%;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#999">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                         </div>\` :
                        \`<div style="display: flex; align-items: center; justify-content: center; background: #f0f0f0; width: 100%; height: 100%;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#999">
                                <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z"/>
                            </svg>
                         </div>\`
                    }
                    \${file.canImport ? '<input type="checkbox" class="bucket-file-checkbox" style="position: absolute; top: 0.5rem; left: 0.5rem; width: 20px; height: 20px;">' : ''}
                </div>
                <div class="gallery-admin-info">
                    <h3>\${file.displayName}</h3>
                    <p class="gallery-admin-description" style="color: \${statusColor};">\${statusText}</p>
                    <div class="gallery-admin-meta">
                        Uploaded: \${uploadDate} • \${fileSize}
                        \${file.contentType ? \` • \${file.contentType}\` : ''}
                    </div>
                </div>
                <div class="gallery-admin-actions">
                    \${file.isImage ? \`<button class="btn btn-small btn-outline" onclick="previewBucketFile('\${file.url}')">Preview</button>\` : ''}
                    \${file.canImport ? \`<button class="btn btn-small btn-secondary" onclick="importSingleFile('\${file.fileId}')">Import</button>\` : ''}
                </div>
            </div>
        \`;
    });
    
    bucketList.innerHTML = \`<div class="gallery-admin-grid">\${itemsHTML}</div>\`;
    
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
        importBtn.textContent = \`Import \${selectedBucketFiles.length} Selected\`;
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
                'Authorization': \`Bearer \${authToken}\`
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
    
    const confirmMsg = \`Import \${selectedBucketFiles.length} selected file(s) into your Image Library? EXIF data will be extracted during import.\`;
    
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
                'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify({ fileIds: selectedBucketFiles })
        });
        
        if (!response.ok) {
            throw new Error('Failed to import files');
        }
        
        const result = await response.json();
        
        if (result.success) {
            const message = \`Import completed!\n\nImported: \${result.imported}\nFailed: \${result.failed}\nTotal: \${result.total}\`;
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
    messageEl.className = \`\${type}-message\`;
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
                'Authorization': \`Bearer \${authToken}\`
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
        showAIResponse(\`Error: \${error.message}\`, null, true);
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
        responseDiv.innerHTML = \`
            <div class="ai-error">
                <h4>⚠️ Error</h4>
                <p>\${content}</p>
            </div>
        \`;
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
    
    contentDiv.innerHTML = \`
        <h4>\${actionTitle[action] || '🤖 AI Response'}</h4>
        <div class="ai-content-text">\${content.replace(/\n/g, '<br>')}</div>
    \`;
    
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
        showMessage(\`AI content inserted into editor! (\${insertCount} paragraph\${insertCount > 1 ? 's' : ''})\`);
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
                    const response = await fetch(\`/api/images/by-filename?filename=\${encodeURIComponent(filename)}\`);
                    if (response.ok) {
                        const dbImage = await response.json();
                        image.id = dbImage.id;
                        image.title = image.title || dbImage.title || dbImage.original_filename;
                        image.description = image.description || dbImage.description || dbImage.alt_text;
                        
                        // Add technical details to help AI generate unique descriptions
                        image.filename = dbImage.original_filename;
                        image.dimensions = dbImage.width && dbImage.height ? \`\${dbImage.width}x\${dbImage.height}\` : null;
                        image.fileSize = dbImage.file_size;
                    } else {
                        // Try looking up by URL instead
                        const urlResponse = await fetch(\`/api/images/by-url?url=\${encodeURIComponent(image.url)}\`);
                        if (urlResponse.ok) {
                            const dbImage = await urlResponse.json();
                            image.id = dbImage.id;
                            image.title = image.title || dbImage.title || dbImage.original_filename;
                            image.description = image.description || dbImage.description || dbImage.alt_text;
                            image.filename = dbImage.original_filename;
                            image.dimensions = dbImage.width && dbImage.height ? \`\${dbImage.width}x\${dbImage.height}\` : null;
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
            const response = await fetch(\`/api/images/\${image.id}/exif\`);
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
        const cardsHTML = availableThemes.map(theme => \`
            <div class="theme-card theme-\${theme.id} \${selectedTheme === theme.id ? 'selected' : ''}" 
                 data-theme="\${theme.id}" onclick="selectTheme('\${theme.id}')">
                <div class="theme-header">
                    <div class="theme-title">\${theme.name}</div>
                    <div class="theme-description">\${theme.description}</div>
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
        \`).join('');
        
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
                'Authorization': \`Bearer \${authToken}\`
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
                'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify({ theme: selectedTheme })
        });
        
        if (response.ok) {
            saveBtn.textContent = 'Applied!';
            showMessage(\`Theme "\${availableThemes.find(t => t.id === selectedTheme)?.name}" applied successfully!\`);
            
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
        .replace(/(^-|-\$)/g, '');
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
                'Authorization': \`Bearer \${authToken}\`
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
        socialLinksList.innerHTML = \`
            <div class="loading">
                <p>No social links configured yet.</p>
                <p>Click "Add Link" to get started.</p>
            </div>
        \`;
        return;
    }
    
    const linksHTML = socialLinks.map(link => \`
        <div class="gallery-admin-item" data-link-id="\${link.id}">
            <div class="gallery-admin-image" style="display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#666">
                    <path d="\${link.icon_svg || 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z'}"/>
                </svg>
            </div>
            <div class="gallery-admin-info">
                <h3>\${link.label}</h3>
                <p class="gallery-admin-description">\${link.platform} • \${link.url}</p>
                <div class="gallery-admin-meta">
                    Order: \${link.sort_order}
                    \${!link.visible ? ' • <span class="hidden-badge">Hidden</span>' : ''}
                </div>
            </div>
            <div class="gallery-admin-actions">
                <button class="btn btn-small btn-outline" onclick="editSocialLink(\${link.id})">Edit</button>
                <button class="btn btn-small btn-secondary" onclick="toggleSocialLinkVisibility(\${link.id}, \${link.visible})">\${link.visible ? 'Hide' : 'Show'}</button>
                <button class="btn btn-small btn-danger" onclick="deleteSocialLink(\${link.id})">Delete</button>
            </div>
        </div>
    \`).join('');
    
    socialLinksList.innerHTML = \`<div class="gallery-admin-grid">\${linksHTML}</div>\`;
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
        preview.innerHTML = \`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
        \`;
    }
}

async function loadSocialLinkData(linkId) {
    try {
        const response = await fetch('/api/admin/social-links', {
            headers: {
                'Authorization': \`Bearer \${authToken}\`
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
            ? \`/api/admin/social-links/\${currentSocialLinkId}\`
            : '/api/admin/social-links';
        const method = currentSocialLinkId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify(linkData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save social link');
        }
        
        closeSocialLinkModal();
        loadSocialLinks();
        showMessage(\`Social link \${currentSocialLinkId ? 'updated' : 'created'} successfully!\`);
        
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
        const response = await fetch(\`/api/admin/social-links/\${linkId}\`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify({ visible: !currentVisibility })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update social link visibility');
        }
        
        loadSocialLinks();
        showMessage(\`Social link \${!currentVisibility ? 'shown' : 'hidden'} successfully!\`);
        
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
        const response = await fetch(\`/api/admin/social-links/\${linkId}\`, {
            method: 'DELETE',
            headers: {
                'Authorization': \`Bearer \${authToken}\`
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
    const iconsHTML = Object.entries(iconLibrary).map(([key, icon]) => \`
        <div class="icon-option" data-icon-key="\${key}" onclick="selectIcon('\${key}')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="\${icon.path}"/>
            </svg>
            <span class="icon-option-label">\${icon.name}</span>
        </div>
    \`).join('');
    
    grid.innerHTML = iconsHTML;
    
    // Highlight currently selected icon
    if (selectedIconPath) {
        const currentIcon = Object.entries(iconLibrary).find(([key, icon]) => icon.path === selectedIconPath);
        if (currentIcon) {
            const iconElement = grid.querySelector(\`[data-icon-key="\${currentIcon[0]}"]\`);
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
        preview.innerHTML = \`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="\${iconPath}"/>
            </svg>
        \`;
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
}`,
      "/static/css/editor.css": `/* Editor CSS styles would go here */`,
    };
    
    const content = staticFiles[pathname];
    if (!content) {
      return new Response('File not found', { status: 404 });
    }
    
    const contentType = pathname.endsWith('.css') ? 'text/css' : 
                       pathname.endsWith('.js') ? 'application/javascript' : 
                       'text/plain';
    
    return new Response(content, {
      headers: { 'Content-Type': contentType }
    });
  }

  // Serve admin interface
  function serveAdminInterface() {
    const adminHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - jonsson.io</title>
    <link rel="stylesheet" href="/static/css/admin.css">
    <!-- EditorJS CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/list@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/quote@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/image@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/embed@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/table@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/code@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/raw@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@editorjs/delimiter@latest"></script>
</head>
<body>
    <!-- Login Modal -->
    <div id="login-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Admin Login</h2>
            </div>
            <form id="login-form">
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" required>
                </div>
                <div id="login-error" class="error-message"></div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
        </div>
    </div>

    <!-- Admin Interface -->
    <div id="admin-interface" class="admin-container">
        <header class="admin-header">
            <h1>jonsson.io Admin</h1>
            <div class="admin-actions">
                <button id="logout-btn" class="btn btn-outline">Logout</button>
            </div>
        </header>

        <nav id="admin-navigation" class="admin-nav">
            <div class="nav-item" data-section="posts">
                <button id="posts-nav-btn" class="btn btn-primary">Posts</button>
            </div>
            <div class="nav-item" data-section="gallery">
                <button id="gallery-nav-btn" class="btn btn-outline">Gallery</button>
            </div>
            <div class="nav-item" data-section="about">
                <button id="about-nav-btn" class="btn btn-outline">About</button>
            </div>
            <div class="nav-item" data-section="themes">
                <button id="themes-nav-btn" class="btn btn-outline">Themes</button>
            </div>
            <div class="nav-item" data-section="images">
                <button id="images-nav-btn" class="btn btn-outline">Images</button>
            </div>
            <div class="nav-item" data-section="social">
                <button id="social-nav-btn" class="btn btn-outline">Social</button>
            </div>
            <div class="nav-item" data-section="bucket">
                <button id="bucket-nav-btn" class="btn btn-outline">S3 Import</button>
            </div>
        </nav>

        <main class="admin-main">
            <!-- Posts Section -->
            <section id="posts-section" class="admin-section active">
                <div class="section-header">
                    <h2>Posts</h2>
                    <div class="section-actions">
                        <input type="text" id="posts-search" placeholder="Search posts..." class="search-input">
                        <button id="new-post-btn" class="btn btn-primary">New Post</button>
                    </div>
                </div>
                <div id="posts-list" class="posts-list">
                    <div class="loading">Loading posts...</div>
                </div>
            </section>

            <!-- Editor Section -->
            <section id="editor-section" class="admin-section">
                <div class="section-header">
                    <h2 id="editor-title">New Post</h2>
                    <div class="section-actions">
                        <button id="cancel-edit-btn" class="btn btn-outline">Cancel</button>
                        <button id="save-post-btn" class="btn btn-primary">Save Post</button>
                    </div>
                </div>
                
                <form id="post-form" class="post-form">
                    <div class="form-group">
                        <label for="post-title">Title:</label>
                        <input type="text" id="post-title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="post-slug">Slug:</label>
                        <div class="slug-controls">
                            <input type="text" id="post-slug" readonly>
                            <button type="button" id="edit-slug-btn" class="btn btn-small btn-outline">Edit</button>
                            <button type="button" id="regenerate-slug-btn" class="btn btn-small btn-outline" style="display: none;">Regenerate</button>
                            <button type="button" id="cancel-slug-btn" class="btn btn-small btn-outline" style="display: none;">Cancel</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Content:</label>
                        <div id="post-content" class="editor-container"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="featured-image">Featured Image:</label>
                        <div class="featured-image-section">
                            <div id="featured-image-preview" class="featured-image-preview">
                                <div class="featured-image-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="image-actions">
                                <button type="button" id="select-featured-btn" class="btn btn-outline">Select Image</button>
                                <button type="button" id="remove-featured-btn" class="btn btn-outline" style="display: none;">Remove</button>
                                <input type="hidden" id="featured-image-id">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="post-published">
                            Published
                        </label>
                    </div>
                </form>
            </section>

            <!-- Other sections would be added here -->
            
        </main>
    </div>

    <!-- File Manager Modal -->
    <div id="file-manager-modal" class="modal large-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="file-manager-title">Browse Image Library</h2>
                <button id="file-manager-close" class="modal-close">&times;</button>
            </div>
            
            <div class="file-manager-toolbar">
                <div class="mode-buttons">
                    <button id="select-mode-btn" class="btn btn-primary">Select</button>
                    <button id="manage-mode-btn" class="btn btn-secondary">Manage</button>
                </div>
                <div class="file-manager-stats">
                    <span id="selected-count">0 selected</span>
                </div>
            </div>
            
            <div id="file-manager-grid" class="file-manager-grid">
                <div class="loading">Loading images...</div>
            </div>
            
            <div class="modal-footer">
                <button id="cancel-file-manager-btn" class="btn btn-outline">Cancel</button>
                <button id="select-images-btn" class="btn btn-primary" style="display: none;">Select Images</button>
                <button id="delete-selected-btn" class="btn btn-danger" style="display: none;">Delete Selected</button>
            </div>
        </div>
    </div>

    <script src="/static/js/admin.js"></script>
</body>
</html>`;
    
    return new Response(adminHTML, {
      headers: { 'Content-Type': 'text/html' }
    });
  }


export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Serve static files
      if (STATIC_FILES[pathname]) {
        return new Response(STATIC_FILES[pathname], {
          headers: { 'Content-Type': getMimeType(pathname) }
        });
      }
      
      // Homepage
      if (pathname === '/') {
        const indexHTML = STATIC_FILES['/index.html'];
        if (indexHTML) {
          return new Response(indexHTML, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        // Fallback to embedded template if static file not found
        return new Response(homepageHTML, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // API: Get all published posts
      if (pathname === '/api/posts' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              p.*,
              i.b2_url as featured_image_url,
              i.alt_text as featured_image_alt,
              i.width as featured_image_width,
              i.height as featured_image_height
            FROM posts p
            LEFT JOIN images i ON p.featured_image_id = i.id
            WHERE p.published = 1
            ORDER BY p.created_at DESC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching posts:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get current theme
      if (pathname === '/api/theme' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(
            'SELECT setting_value FROM site_settings WHERE setting_key = ?'
          ).bind('theme').all();
          
          const currentTheme = results.length > 0 ? results[0].setting_value : 'default';
          
          return new Response(JSON.stringify({ theme: currentTheme }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error loading theme:', error);
          return new Response(JSON.stringify({ theme: 'default' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get social links
      if (pathname === '/api/social-links' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
            SELECT id, platform, label, url, icon_svg, sort_order, visible
            FROM social_links 
            WHERE visible = 1
            ORDER BY sort_order ASC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching social links:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch social links' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get single post by slug
      if (pathname.startsWith('/api/posts/') && request.method === 'GET') {
        const slug = pathname.split('/')[3];
        if (!slug) {
          return new Response('Post slug required', { status: 400 });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              p.*,
              i.b2_url as featured_image_url,
              i.alt_text as featured_image_alt,
              i.width as featured_image_width,
              i.height as featured_image_height
            FROM posts p
            LEFT JOIN images i ON p.featured_image_id = i.id
            WHERE p.slug = ? AND p.published = 1
          `).bind(slug).all();
          
          if (results.length === 0) {
            return new Response('Post not found', { status: 404 });
          }
          
          const post = results[0];
          
          // Get gallery images for this post
          const { results: images } = await env.DB.prepare(`
            SELECT i.*, pi.sort_order 
            FROM images i
            JOIN post_images pi ON i.id = pi.image_id
            WHERE pi.post_id = ? AND i.id != COALESCE(?, 0)
            ORDER BY pi.sort_order
          `).bind(post.id, post.featured_image_id).all();
          
          return new Response(JSON.stringify({ ...post, images }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching post:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get about page
      if (pathname === '/api/about' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              a.*,
              i.b2_url as profile_image_url,
              i.alt_text as profile_image_alt
            FROM about_page a
            LEFT JOIN images i ON a.profile_image_id = i.id
            ORDER BY a.id DESC
            LIMIT 1
          `).all();
          
          if (results.length === 0) {
            return new Response('About page not found', { status: 404 });
          }
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching about page:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get gallery images for homepage
      if (pathname === '/api/gallery' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              g.*,
              i.id as image_id,
              i.b2_url,
              i.alt_text,
              i.original_filename,
              i.width,
              i.height,
              i.file_size,
              i.mime_type,
              e.date_taken,
              e.gps_latitude,
              e.gps_longitude,
              e.iso,
              e.aperture,
              e.shutter_speed,
              e.focal_length
            FROM gallery g
            JOIN images i ON g.image_id = i.id
            LEFT JOIN image_exif e ON i.id = e.image_id
            WHERE g.visible = 1
            ORDER BY g.sort_order ASC, g.created_at DESC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get EXIF data for an image
      if (pathname.startsWith('/api/images/') && pathname.endsWith('/exif') && request.method === 'GET') {
        const imageId = pathname.split('/')[3];
        if (!imageId) {
          return new Response('Image ID required', { status: 400 });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT * FROM image_exif WHERE image_id = ?
          `).bind(imageId).all();
          
          if (results.length === 0) {
            return new Response('EXIF data not found', { status: 404 });
          }
          
          const exifData = results[0];
          
          // Parse raw EXIF if needed
          if (exifData.raw_exif) {
            try {
              exifData.raw_exif_parsed = JSON.parse(exifData.raw_exif);
            } catch (e) {
              // Keep as string if parsing fails
            }
          }
          
          return new Response(JSON.stringify(exifData), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching EXIF data:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch EXIF data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // ADMIN ENDPOINTS
      
      // Helper function to check authentication
      async function isAuthenticated(request) {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return null;
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { results } = await env.DB.prepare(`
          SELECT * FROM admin_sessions 
          WHERE token = ? AND expires_at > datetime('now')
        `).bind(token).all();
        
        return results.length > 0 ? results[0] : null;
      }
      
      // Admin: Login
      if (pathname === '/api/admin/login' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { password } = body;
          
          // Check password against environment variable
          if (password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Generate session token
          const token = crypto.randomUUID();
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          
          // Save session to database
          await env.DB.prepare(`
            INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)
          `).bind(token, expiresAt.toISOString()).run();
          
          return new Response(JSON.stringify({ token }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error during admin login:', error);
          return new Response(JSON.stringify({ error: 'Login failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Admin: Get all posts (including unpublished)
      if (pathname === '/api/admin/posts' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              p.*,
              i.b2_url as featured_image_url,
              i.alt_text as featured_image_alt,
              p.featured_image_id
            FROM posts p
            LEFT JOIN images i ON p.featured_image_id = i.id
            ORDER BY p.created_at DESC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching admin posts:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Admin: Create new post
      if (pathname === '/api/admin/posts' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { title, content, published = false, featured_image_id } = body;
          
          if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Create slug from title
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          
          const featuredImageIdValue = featured_image_id && featured_image_id !== '' ? parseInt(featured_image_id) : null;
          
          const result = await env.DB.prepare(`
            INSERT INTO posts (title, content, slug, published, featured_image_id, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(title, content || '', slug, published ? 1 : 0, featuredImageIdValue, new Date().toISOString()).run();
          
          const { results } = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(result.meta.last_row_id).all();
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error creating post:', error);
          return new Response(JSON.stringify({ error: 'Failed to create post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Admin: Update post
      if (pathname.startsWith('/api/admin/posts/') && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const postId = pathname.split('/')[4];
        if (!postId) {
          return new Response('Post ID required', { status: 400 });
        }
        
        try {
          const body = await request.json();
          const { title, content, published = false, featured_image_id, update_slug = false } = body;
          
          if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const featuredImageIdValue = featured_image_id && featured_image_id !== '' ? parseInt(featured_image_id) : null;
          
          // Only update slug if explicitly requested
          if (update_slug) {
            const slug = title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            
            await env.DB.prepare(`
              UPDATE posts 
              SET title = ?, content = ?, slug = ?, published = ?, featured_image_id = ?, updated_at = ?
              WHERE id = ?
            `).bind(title, content || '', slug, published ? 1 : 0, featuredImageIdValue, new Date().toISOString(), postId).run();
          } else {
            // Preserve existing slug
            await env.DB.prepare(`
              UPDATE posts 
              SET title = ?, content = ?, published = ?, featured_image_id = ?, updated_at = ?
              WHERE id = ?
            `).bind(title, content || '', published ? 1 : 0, featuredImageIdValue, new Date().toISOString(), postId).run();
          }
          
          const { results } = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(postId).all();
          
          if (results.length === 0) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating post:', error);
          return new Response(JSON.stringify({ error: 'Failed to update post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Admin: Delete post
      if (pathname.startsWith('/api/admin/posts/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const postId = pathname.split('/')[4];
        if (!postId) {
          return new Response('Post ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(postId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error deleting post:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      

      // Admin: Get all images
      if (pathname === '/api/admin/images' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const url = new URL(request.url);
          const search = url.searchParams.get('search');
          
          let query, params = [];
          
          if (search && search.trim()) {
            query = `
              SELECT DISTINCT i.*, 
                     e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                     e.focal_length, e.aperture, e.iso, e.software, e.artist,
                     e.description as exif_description, e.keywords
              FROM images i
              LEFT JOIN image_exif e ON i.id = e.image_id
              WHERE i.original_filename LIKE ? 
                 OR i.alt_text LIKE ?
                 OR i.caption LIKE ?
              ORDER BY i.created_at DESC
            `;
            const searchTerm = `%${search.trim()}%`;
            params = [searchTerm, searchTerm, searchTerm];
          } else {
            query = `
              SELECT i.*, 
                     e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                     e.focal_length, e.aperture, e.iso, e.software, e.artist,
                     e.description as exif_description, e.keywords
              FROM images i
              LEFT JOIN image_exif e ON i.id = e.image_id
              ORDER BY i.created_at DESC
            `;
          }
          
          const { results } = await env.DB.prepare(query).bind(...params).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching images:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Delete image
      if (pathname.startsWith('/api/admin/images/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const imageId = pathname.split('/')[4];
        if (!imageId) {
          return new Response('Image ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM images WHERE id = ?').bind(imageId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Image not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error deleting image:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get gallery images
      if (pathname === '/api/admin/gallery' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              g.*,
              i.b2_url,
              i.alt_text,
              i.original_filename,
              i.width,
              i.height,
              i.file_size,
              i.mime_type
            FROM gallery g
            JOIN images i ON g.image_id = i.id
            ORDER BY g.sort_order ASC, g.created_at DESC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching admin gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Add image to gallery
      if (pathname === '/api/admin/gallery' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { image_id, title, description, sort_order = 0 } = body;
          
          if (!image_id) {
            return new Response(JSON.stringify({ error: 'Image ID is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(`
            INSERT INTO gallery (image_id, title, description, sort_order)
            VALUES (?, ?, ?, ?)
          `).bind(image_id, title || '', description || '', sort_order).run();
          
          const { results } = await env.DB.prepare(`
            SELECT 
              g.*,
              i.b2_url,
              i.alt_text,
              i.original_filename,
              i.width,
              i.height
            FROM gallery g
            JOIN images i ON g.image_id = i.id
            WHERE g.id = ?
          `).bind(result.meta.last_row_id).all();
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error adding to gallery:', error);
          if (error.message && error.message.includes('UNIQUE')) {
            return new Response(JSON.stringify({ error: 'Image is already in gallery' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to add to gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update gallery item
      if (pathname.startsWith('/api/admin/gallery/') && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const galleryId = pathname.split('/')[4];
        if (!galleryId) {
          return new Response('Gallery ID required', { status: 400 });
        }
        
        try {
          const body = await request.json();
          const { title, description, sort_order, visible } = body;
          
          await env.DB.prepare(`
            UPDATE gallery 
            SET title = ?, description = ?, sort_order = ?, visible = ?
            WHERE id = ?
          `).bind(title || '', description || '', sort_order || 0, visible ? 1 : 0, galleryId).run();
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating gallery item:', error);
          return new Response(JSON.stringify({ error: 'Failed to update gallery item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Remove from gallery
      if (pathname.startsWith('/api/admin/gallery/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const galleryId = pathname.split('/')[4];
        if (!galleryId) {
          return new Response('Gallery ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM gallery WHERE id = ?').bind(galleryId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Gallery item not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error removing from gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to remove from gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get about page
      if (pathname === '/api/admin/about' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              a.*,
              i.b2_url as profile_image_url,
              i.alt_text as profile_image_alt
            FROM about_page a
            LEFT JOIN images i ON a.profile_image_id = i.id
            ORDER BY a.id DESC
            LIMIT 1
          `).all();
          
          if (results.length === 0) {
            return new Response(JSON.stringify({ error: 'About page not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching about page for admin:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update about page
      if (pathname === '/api/admin/about' && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { title, lead_text, content, profile_image_id } = body;
          
          if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const profileImageIdValue = profile_image_id && profile_image_id !== '' ? parseInt(profile_image_id) : null;
          
          // Check if about page exists
          const { results: existing } = await env.DB.prepare('SELECT id FROM about_page ORDER BY id DESC LIMIT 1').all();
          
          if (existing.length > 0) {
            // Update existing
            await env.DB.prepare(`
              UPDATE about_page 
              SET title = ?, lead_text = ?, content = ?, profile_image_id = ?, updated_at = ?
              WHERE id = ?
            `).bind(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString(), existing[0].id).run();
          } else {
            // Create new
            await env.DB.prepare(`
              INSERT INTO about_page (title, lead_text, content, profile_image_id, updated_at)
              VALUES (?, ?, ?, ?, ?)
            `).bind(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString()).run();
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating about page:', error);
          return new Response(JSON.stringify({ error: 'Failed to update about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get all social links
      if (pathname === '/api/admin/social-links' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT id, platform, label, url, icon_svg, sort_order, visible
            FROM social_links 
            ORDER BY sort_order ASC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching social links for admin:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch social links' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Create social link
      if (pathname === '/api/admin/social-links' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { platform, label, url, icon_svg, sort_order, visible } = body;
          
          if (!platform || !label || !url) {
            return new Response(JSON.stringify({ error: 'Platform, label, and URL are required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(`
            INSERT INTO social_links (platform, label, url, icon_svg, sort_order, visible, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString()).run();
          
          const { results } = await env.DB.prepare('SELECT * FROM social_links WHERE id = ?').bind(result.meta.last_row_id).all();
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error creating social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to create social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update social link
      if (pathname.startsWith('/api/admin/social-links/') && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const linkId = pathname.split('/')[4];
        if (!linkId) {
          return new Response('Link ID required', { status: 400 });
        }
        
        try {
          const body = await request.json();
          const { platform, label, url, icon_svg, sort_order, visible } = body;
          
          if (!platform || !label || !url) {
            return new Response(JSON.stringify({ error: 'Platform, label, and URL are required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(`
            UPDATE social_links 
            SET platform = ?, label = ?, url = ?, icon_svg = ?, sort_order = ?, visible = ?, updated_at = ?
            WHERE id = ?
          `).bind(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString(), linkId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Social link not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to update social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Delete social link
      if (pathname.startsWith('/api/admin/social-links/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const linkId = pathname.split('/')[4];
        if (!linkId) {
          return new Response('Link ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM social_links WHERE id = ?').bind(linkId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Social link not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error deleting social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      
      // Admin: Get all images
      if (pathname === '/api/admin/images' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const url = new URL(request.url);
          const search = url.searchParams.get('search');
          
          let query, params = [];
          
          if (search && search.trim()) {
            query = `
              SELECT DISTINCT i.*, 
                     e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                     e.focal_length, e.aperture, e.iso, e.software, e.artist,
                     e.description as exif_description, e.keywords
              FROM images i
              LEFT JOIN image_exif e ON i.id = e.image_id
              WHERE i.original_filename LIKE ? 
                 OR i.alt_text LIKE ?
                 OR i.caption LIKE ?
              ORDER BY i.created_at DESC
            `;
            const searchTerm = `%${search.trim()}%`;
            params = [searchTerm, searchTerm, searchTerm];
          } else {
            query = `
              SELECT i.*, 
                     e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                     e.focal_length, e.aperture, e.iso, e.software, e.artist,
                     e.description as exif_description, e.keywords
              FROM images i
              LEFT JOIN image_exif e ON i.id = e.image_id
              ORDER BY i.created_at DESC
            `;
          }
          
          const { results } = await env.DB.prepare(query).bind(...params).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching images:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Delete image
      if (pathname.startsWith('/api/admin/images/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const imageId = pathname.split('/')[4];
        if (!imageId) {
          return new Response('Image ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM images WHERE id = ?').bind(imageId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Image not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error deleting image:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get gallery images
      if (pathname === '/api/admin/gallery' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              g.*,
              i.b2_url,
              i.alt_text,
              i.original_filename,
              i.width,
              i.height,
              i.file_size,
              i.mime_type
            FROM gallery g
            JOIN images i ON g.image_id = i.id
            ORDER BY g.sort_order ASC, g.created_at DESC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching admin gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Add image to gallery
      if (pathname === '/api/admin/gallery' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { image_id, title, description, sort_order = 0 } = body;
          
          if (!image_id) {
            return new Response(JSON.stringify({ error: 'Image ID is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(`
            INSERT INTO gallery (image_id, title, description, sort_order)
            VALUES (?, ?, ?, ?)
          `).bind(image_id, title || '', description || '', sort_order).run();
          
          const { results } = await env.DB.prepare(`
            SELECT 
              g.*,
              i.b2_url,
              i.alt_text,
              i.original_filename,
              i.width,
              i.height
            FROM gallery g
            JOIN images i ON g.image_id = i.id
            WHERE g.id = ?
          `).bind(result.meta.last_row_id).all();
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error adding to gallery:', error);
          if (error.message && error.message.includes('UNIQUE')) {
            return new Response(JSON.stringify({ error: 'Image is already in gallery' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to add to gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update gallery item
      if (pathname.startsWith('/api/admin/gallery/') && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const galleryId = pathname.split('/')[4];
        if (!galleryId) {
          return new Response('Gallery ID required', { status: 400 });
        }
        
        try {
          const body = await request.json();
          const { title, description, sort_order, visible } = body;
          
          await env.DB.prepare(`
            UPDATE gallery 
            SET title = ?, description = ?, sort_order = ?, visible = ?
            WHERE id = ?
          `).bind(title || '', description || '', sort_order || 0, visible ? 1 : 0, galleryId).run();
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating gallery item:', error);
          return new Response(JSON.stringify({ error: 'Failed to update gallery item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Remove from gallery
      if (pathname.startsWith('/api/admin/gallery/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const galleryId = pathname.split('/')[4];
        if (!galleryId) {
          return new Response('Gallery ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM gallery WHERE id = ?').bind(galleryId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Gallery item not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error removing from gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to remove from gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get about page
      if (pathname === '/api/admin/about' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              a.*,
              i.b2_url as profile_image_url,
              i.alt_text as profile_image_alt
            FROM about_page a
            LEFT JOIN images i ON a.profile_image_id = i.id
            ORDER BY a.id DESC
            LIMIT 1
          `).all();
          
          if (results.length === 0) {
            return new Response(JSON.stringify({ error: 'About page not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching about page for admin:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update about page
      if (pathname === '/api/admin/about' && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { title, lead_text, content, profile_image_id } = body;
          
          if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const profileImageIdValue = profile_image_id && profile_image_id !== '' ? parseInt(profile_image_id) : null;
          
          // Check if about page exists
          const { results: existing } = await env.DB.prepare('SELECT id FROM about_page ORDER BY id DESC LIMIT 1').all();
          
          if (existing.length > 0) {
            // Update existing
            await env.DB.prepare(`
              UPDATE about_page 
              SET title = ?, lead_text = ?, content = ?, profile_image_id = ?, updated_at = ?
              WHERE id = ?
            `).bind(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString(), existing[0].id).run();
          } else {
            // Create new
            await env.DB.prepare(`
              INSERT INTO about_page (title, lead_text, content, profile_image_id, updated_at)
              VALUES (?, ?, ?, ?, ?)
            `).bind(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString()).run();
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating about page:', error);
          return new Response(JSON.stringify({ error: 'Failed to update about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get all social links
      if (pathname === '/api/admin/social-links' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT id, platform, label, url, icon_svg, sort_order, visible
            FROM social_links 
            ORDER BY sort_order ASC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching social links for admin:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch social links' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Create social link
      if (pathname === '/api/admin/social-links' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { platform, label, url, icon_svg, sort_order, visible } = body;
          
          if (!platform || !label || !url) {
            return new Response(JSON.stringify({ error: 'Platform, label, and URL are required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(`
            INSERT INTO social_links (platform, label, url, icon_svg, sort_order, visible, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString()).run();
          
          const { results } = await env.DB.prepare('SELECT * FROM social_links WHERE id = ?').bind(result.meta.last_row_id).all();
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error creating social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to create social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update social link
      if (pathname.startsWith('/api/admin/social-links/') && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const linkId = pathname.split('/')[4];
        if (!linkId) {
          return new Response('Link ID required', { status: 400 });
        }
        
        try {
          const body = await request.json();
          const { platform, label, url, icon_svg, sort_order, visible } = body;
          
          if (!platform || !label || !url) {
            return new Response(JSON.stringify({ error: 'Platform, label, and URL are required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(`
            UPDATE social_links 
            SET platform = ?, label = ?, url = ?, icon_svg = ?, sort_order = ?, visible = ?, updated_at = ?
            WHERE id = ?
          `).bind(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString(), linkId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Social link not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to update social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Delete social link
      if (pathname.startsWith('/api/admin/social-links/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const linkId = pathname.split('/')[4];
        if (!linkId) {
          return new Response('Link ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM social_links WHERE id = ?').bind(linkId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Social link not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error deleting social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      
      // Admin: Login
      if (pathname === '/api/admin/login' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { password } = body;
          
          if (password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Generate session token
          const token = crypto.randomUUID();
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          
          // Store session in environment variable or simple map for demo
          // In production, you'd want to use Durable Objects or KV storage
          const sessionData = {
            token,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString()
          };
          
          return new Response(JSON.stringify({ 
            token,
            expiresAt: expiresAt.toISOString()
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
          
        } catch (error) {
          console.error('Login error:', error);
          return new Response(JSON.stringify({ error: 'Login failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Static file serving
      if (pathname.startsWith('/static/')) {
        return serveStaticFile(pathname);
      }

      // Admin interface
      if (pathname === '/admin' || pathname === '/admin/') {
        return serveAdminInterface();
      }

            // Admin: Get current theme
      if (pathname === '/api/admin/theme' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT setting_value FROM site_settings WHERE setting_key = ?
          `).bind('theme').all();
          
          const currentTheme = results.length > 0 ? results[0].setting_value : 'default';
          
          return new Response(JSON.stringify({ theme: currentTheme }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error loading theme:', error);
          return new Response(JSON.stringify({ theme: 'default' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Admin: Update theme
      if (pathname === '/api/admin/theme' && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { theme } = body;
          
          if (!theme) {
            return new Response(JSON.stringify({ error: 'Theme is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Validate theme
          const validThemes = ['default', 'classic', 'dark', 'ocean', 'forest', 'sunset', 'monochrome', 'solarized-light', 'solarized-dark', 'leica'];
          if (!validThemes.includes(theme)) {
            return new Response(JSON.stringify({ error: 'Invalid theme' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Check if theme setting exists
          const { results: existing } = await env.DB.prepare(`
            SELECT * FROM site_settings WHERE setting_key = ?
          `).bind('theme').all();
          
          if (existing.length > 0) {
            // Update existing theme
            await env.DB.prepare(`
              UPDATE site_settings 
              SET setting_value = ?, updated_at = ?
              WHERE setting_key = ?
            `).bind(theme, new Date().toISOString(), 'theme').run();
          } else {
            // Create new theme setting
            await env.DB.prepare(`
              INSERT INTO site_settings (setting_key, setting_value, updated_at)
              VALUES (?, ?, ?)
            `).bind('theme', theme, new Date().toISOString()).run();
          }
          
          return new Response(JSON.stringify({ success: true, theme }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error saving theme:', error);
          return new Response(JSON.stringify({ error: 'Failed to save theme' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Browse bucket files (placeholder - B2 not available in Workers)
      if (pathname === '/api/admin/bucket-files' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const url = new URL(request.url);
        const test = url.searchParams.get('test');
        
        if (test === 'true') {
          // Return a mock test response since B2 operations aren't available in Workers
          return new Response(JSON.stringify({
            success: false,
            error: 'B2 bucket browsing is not available in the Workers deployment',
            details: 'This feature requires server-side B2 SDK access which is not available in Cloudflare Workers. Use the local development environment for bucket management.'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Return empty bucket data
        return new Response(JSON.stringify({
          files: [],
          folders: [],
          currentPath: '',
          stats: {
            totalFiles: 0,
            imageFiles: 0,
            importableFiles: 0
          },
          message: 'B2 bucket browsing is not available in Workers deployment'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Admin: Import files (placeholder - not available in Workers)
      if (pathname === '/api/admin/import-files' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: 'File import is not available in Workers deployment',
          details: 'This feature requires server-side file processing which is not available in Cloudflare Workers. Use the local development environment for file imports.'
        }), {
          status: 501,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Admin: Upload image (placeholder - not available in Workers)
      if (pathname === '/api/admin/upload' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: 'File upload is not available in Workers deployment',
          details: 'This feature requires server-side file processing and B2 storage access which is not available in Cloudflare Workers. Use the local development environment for file uploads.'
        }), {
          status: 501,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Admin: Update EXIF data (placeholder - not available in Workers)
      if (pathname === '/api/admin/update-exif' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: 'EXIF update is not available in Workers deployment',
          details: 'This feature requires server-side image processing which is not available in Cloudflare Workers. Use the local development environment for EXIF operations.'
        }), {
          status: 501,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Admin: Migrate images (placeholder - not available in Workers)
      if (pathname === '/api/admin/migrate-images' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: 'Image migration is not available in Workers deployment',
          details: 'This feature requires server-side B2 operations which is not available in Cloudflare Workers. Use the local development environment for image migration.'
        }), {
          status: 501,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Admin: AI assist (placeholder - not available in Workers)
      if (pathname === '/api/admin/ai-assist' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: 'AI assist is not available in Workers deployment',
          details: 'This feature requires OpenAI API access which is not configured in the Workers environment. Use the local development environment for AI features.'
        }), {
          status: 501,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Serve individual post pages
      if (pathname.startsWith('/post/')) {
        const postHTML = STATIC_FILES['/post.html'];
        if (postHTML) {
          return new Response(postHTML, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        // Fallback to embedded template
        return new Response(postPageHTML, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // Serve admin pages
      if (pathname.startsWith('/admin')) {
        const adminHTML = STATIC_FILES['/admin/index.html'];
        if (adminHTML) {
          return new Response(adminHTML, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      }

      // Admin: Browse bucket files
      if (pathname === '/api/admin/bucket-files' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const url = new URL(request.url);
        const prefix = url.searchParams.get('prefix') || '';
        const filter = url.searchParams.get('filter') || 'all';
        const test = url.searchParams.get('test');

        // If this is a test request, return diagnostic information
        if (test === 'true') {
          try {
            const keyId = env.B2_APPLICATION_KEY_ID;
            const key = env.B2_APPLICATION_KEY;
            const bucketId = env.B2_BUCKET_ID;
            const bucketName = env.B2_BUCKET_NAME;

            if (!keyId || !key || !bucketId || !bucketName) {
              return new Response(JSON.stringify({ 
                success: false,
                error: 'Missing B2 credentials',
                missing: {
                  keyId: !keyId,
                  key: !key,
                  bucketId: !bucketId,
                  bucketName: !bucketName
                }
              }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              });
            }

            // Test B2 authorization
            const authUrl = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account';
            const authResponse = await fetch(authUrl, {
              method: 'GET',
              headers: {
                'Authorization': 'Basic ' + btoa(keyId + ':' + key)
              }
            });

            if (!authResponse.ok) {
              throw new Error(`B2 authorization failed: ${authResponse.status}`);
            }

            const authData = await authResponse.json();

            return new Response(JSON.stringify({
              success: true,
              accountId: authData.accountId,
              allowedBucket: authData.allowed?.bucketId,
              configuredBucket: bucketId,
              bucketMatch: authData.allowed?.bucketId === bucketId,
              apiUrl: authData.apiUrl,
              downloadUrl: authData.downloadUrl
            }), {
              headers: { 'Content-Type': 'application/json' }
            });

          } catch (error) {
            return new Response(JSON.stringify({ 
              success: false,
              error: error.message
            }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        try {
          // Check environment variables
          const keyId = env.B2_APPLICATION_KEY_ID;
          const key = env.B2_APPLICATION_KEY;
          const bucketId = env.B2_BUCKET_ID;
          const bucketName = env.B2_BUCKET_NAME;

          if (!keyId || !key || !bucketId || !bucketName) {
            return new Response(JSON.stringify({ error: 'B2 credentials not configured' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Authorize with B2
          const authUrl = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account';
          const authResponse = await fetch(authUrl, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + btoa(keyId + ':' + key)
            }
          });

          if (!authResponse.ok) {
            throw new Error(`B2 authorization failed: ${authResponse.status}`);
          }

          const authData = await authResponse.json();

          // List files with optional prefix
          const listParams = new URLSearchParams({
            bucketId: bucketId,
            maxFileCount: '10000'
          });

          if (prefix) {
            listParams.set('startFileName', prefix);
            listParams.set('prefix', prefix);
          }

          const listUrl = `${authData.apiUrl}/b2api/v2/b2_list_file_names?${listParams}`;
          const listResponse = await fetch(listUrl, {
            method: 'GET',
            headers: {
              'Authorization': authData.authorizationToken
            }
          });

          if (!listResponse.ok) {
            throw new Error(`B2 list files failed: ${listResponse.status}`);
          }

          const listData = await listResponse.json();

          if (!listData.files) {
            return new Response(JSON.stringify({ files: [], folders: [] }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Get existing filenames from database
          const { results: existingFiles } = await env.DB.prepare('SELECT filename FROM images').all();
          const existingFileNames = new Set(existingFiles.map(f => f.filename));

          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.tif', '.webp'];
          const allFiles = listData.files;

          // Process files to separate folders and files
          const folders = new Set();
          const files = [];

          for (const file of allFiles) {
            // Skip blog folder files when browsing root
            if (!prefix && file.fileName.startsWith('blog/')) {
              continue;
            }

            const relativePath = file.fileName.startsWith(prefix) 
              ? file.fileName.substring(prefix.length)
              : file.fileName;

            // Check if this is a folder
            const pathParts = relativePath.split('/');
            if (pathParts.length > 1 && pathParts[0]) {
              if (!prefix && pathParts[0] === 'blog') {
                continue;
              }
              folders.add(pathParts[0]);
              continue;
            }

            // Skip if it's empty or not in current directory
            if (!relativePath || relativePath.includes('/')) {
              continue;
            }

            const isImage = imageExtensions.some(ext => 
              file.fileName.toLowerCase().endsWith(ext)
            );
            const isImported = existingFileNames.has(file.fileName);
            const canImport = isImage && !isImported;

            // Apply filter
            if (filter === 'images' && !isImage) continue;
            if (filter === 'new-images' && !canImport) continue;

            files.push({
              fileName: file.fileName,
              displayName: relativePath,
              fileId: file.fileId,
              contentType: file.contentType,
              contentLength: file.contentLength,
              uploadTimestamp: file.uploadTimestamp,
              url: `https://${bucketName}.s3.us-west-001.backblazeb2.com/${file.fileName}`,
              isImage: isImage,
              isImported: isImported,
              canImport: canImport
            });
          }

          // Convert folders Set to Array and sort
          const folderArray = Array.from(folders).sort().map(folderName => ({
            name: folderName,
            path: prefix + folderName + '/'
          }));

          return new Response(JSON.stringify({
            files: files.sort((a, b) => a.displayName.localeCompare(b.displayName)),
            folders: folderArray,
            currentPath: prefix,
            stats: {
              totalFiles: files.length,
              imageFiles: files.filter(f => f.isImage).length,
              importableFiles: files.filter(f => f.canImport).length
            }
          }), {
            headers: { 'Content-Type': 'application/json' }
          });

        } catch (error) {
          console.error('Error browsing bucket files:', error);
          
          let errorMessage = `Failed to browse bucket files: ${error.message}`;
          if (error.message && error.message.includes('authorization')) {
            errorMessage = 'B2 authorization failed. Check your B2 credentials.';
          } else if (error.message && error.message.includes('bucket')) {
            errorMessage = 'Invalid bucket configuration. Check B2_BUCKET_ID and B2_BUCKET_NAME.';
          }

          return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Default response
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};