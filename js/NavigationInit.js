// Navigation functionality
(function() {
    'use strict';

    function initNavigation() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }

        // Set active page in navigation
        const currentPage = getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const pageName = link.getAttribute('data-page');
            if (pageName === currentPage) {
                link.classList.add('active');
            }
        });
    }

    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'index';
    }

    // Wait for components to load before initializing navigation
    document.addEventListener('componentsLoaded', initNavigation);
    
    // Fallback: also try to initialize after short delay if event doesn't fire
    setTimeout(initNavigation, 100);
})();
