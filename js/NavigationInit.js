// Navigation functionality
(function() {
    'use strict';

    function initNavigation() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            // Remove any existing listeners to prevent duplicates
            const newNavToggle = navToggle.cloneNode(true);
            navToggle.parentNode.replaceChild(newNavToggle, navToggle);

            newNavToggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Toggle clicked!');
                const menu = document.querySelector('.nav-menu');
                if (menu) {
                    menu.classList.toggle('active');
                    console.log('Menu classes:', menu.className);
                }
            });
            console.log('Mobile navigation toggle initialized');
        } else {
            console.warn('Navigation elements not found:', { navToggle, navMenu });
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
    document.addEventListener('componentsLoaded', function() {
        console.log('Components loaded event received');
        initNavigation();
    });

    // Fallback: also try to initialize after a delay
    window.addEventListener('load', function() {
        setTimeout(function() {
            console.log('Fallback: Initializing navigation after window load');
            initNavigation();
        }, 200);
    });
})();