/* ============================================
   PATH CONFIGURATION
   Handles different path structures for local development vs Vercel production
   ============================================ */

// Detect environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const isDevelopment = !isProduction;

// Base path configuration
const PATH_CONFIG = {
    // Determine the base path
    baseUrl: (() => {
        if (isDevelopment) {
            // Local development
            return '/';
        } else {
            // Production (Vercel)
            return '/';
        }
    })(),

    // Get full path for assets
    getAssetPath: function(relativePath) {
        return this.baseUrl + relativePath.replace(/^\.\//, '').replace(/^\//, '');
    },

    // Get full path for scripts
    getScriptPath: function(relativePath) {
        return this.baseUrl + relativePath.replace(/^\.\//, '').replace(/^\//, '');
    },

    // Get full path for stylesheets
    getStylePath: function(relativePath) {
        return this.baseUrl + relativePath.replace(/^\.\//, '').replace(/^\//, '');
    },

    // Navigate to pages
    navigateTo: function(page) {
        const pageMap = {
            'admin': isDevelopment ? './admin/index.html' : '/admin',
            'home': isDevelopment ? './index.html' : '/',
        };
        window.location.href = pageMap[page] || page;
    }
};

// Make it available globally
window.PATH_CONFIG = PATH_CONFIG;
