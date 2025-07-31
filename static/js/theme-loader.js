// Theme Loading Script
(function() {
    'use strict';
    
    let currentThemeLink = null;
    
    // Load theme CSS dynamically
    function loadTheme(themeName) {
        // Remove existing theme link if it exists
        if (currentThemeLink) {
            currentThemeLink.remove();
        }
        
        // Only load theme CSS if it's not the default (which is built into style.css)
        if (themeName && themeName !== 'default') {
            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = `/static/css/theme-${themeName}.css`;
            themeLink.id = 'theme-css';
            
            // Insert after the main style.css
            const mainStylesheet = document.querySelector('link[href*="style.css"]');
            if (mainStylesheet) {
                mainStylesheet.parentNode.insertBefore(themeLink, mainStylesheet.nextSibling);
            } else {
                document.head.appendChild(themeLink);
            }
            
            currentThemeLink = themeLink;
            
            // Add error handling
            themeLink.onerror = function() {
                console.warn(`Failed to load theme: ${themeName}, falling back to default`);
                this.remove();
                currentThemeLink = null;
            };
        }
    }
    
    // Initialize theme loading
    function initTheme() {
        // Try to load current theme from API
        fetch('/api/theme')
            .then(response => response.json())
            .then(data => {
                const theme = data.theme || 'default';
                loadTheme(theme);
                
                // Store theme preference for faster loading on subsequent visits
                localStorage.setItem('selectedTheme', theme);
            })
            .catch(error => {
                console.warn('Failed to load theme from API:', error);
                
                // Try to use cached theme preference
                const cachedTheme = localStorage.getItem('selectedTheme');
                if (cachedTheme) {
                    loadTheme(cachedTheme);
                }
            });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Expose loadTheme function globally for admin interface
    window.loadTheme = loadTheme;
})();