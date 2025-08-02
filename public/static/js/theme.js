/**
 * Theme Management JavaScript
 * Handles theme switching and persistence across the site
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'leica'; // Default theme
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeToggle();
        this.applyTheme(this.currentTheme);
    }

    loadSavedTheme() {
        // Try to load theme from localStorage
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Fallback to checking for theme stylesheet in DOM
            const themeStylesheet = document.getElementById('theme-stylesheet');
            if (themeStylesheet && themeStylesheet.href) {
                const themeName = this.extractThemeFromUrl(themeStylesheet.href);
                if (themeName) {
                    this.currentTheme = themeName;
                }
            }
        }
    }

    extractThemeFromUrl(url) {
        const match = url.match(/themes\/([^\.]+)\.css/);
        return match ? match[1] : null;
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        // Simple toggle between light and dark modes
        // You can extend this for more themes
        const themes = ['leica', 'modern', 'monochrome', 'vintage'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    setTheme(themeName) {
        this.currentTheme = themeName;
        this.applyTheme(themeName);
        this.saveTheme(themeName);
    }

    applyTheme(themeName) {
        // Update theme stylesheet if it exists
        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = `/static/css/themes/${themeName}.css`;
        }

        // Update theme toggle icon if it exists
        this.updateThemeToggleIcon(themeName);

        // Add theme class to body for additional styling
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
    }

    updateThemeToggleIcon(themeName) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        if (sunIcon && moonIcon) {
            // Simple light/dark toggle logic
            const isDark = ['modern', 'monochrome'].includes(themeName);
            sunIcon.style.display = isDark ? 'none' : 'block';
            moonIcon.style.display = isDark ? 'block' : 'none';
        }
    }

    saveTheme(themeName) {
        try {
            localStorage.setItem('selectedTheme', themeName);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Method to be called by admin panel or theme selector
    static setGlobalTheme(themeName) {
        if (window.themeManager) {
            window.themeManager.setTheme(themeName);
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Mark body as theme-loaded to prevent FOUC
    document.body.classList.add('theme-loaded');
});

// Export for global access
window.ThemeManager = ThemeManager;