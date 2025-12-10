// Component Loader - Dynamically loads reusable HTML components
(function() {
    'use strict';

    // Load a component and insert it into the specified container
    async function loadComponent(componentPath, containerId) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentPath}: ${response.status}`);
            }
            const html = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    // Load all components when DOM is ready
    async function loadAllComponents() {
        await Promise.all([
            loadComponent('components/navigation.html', 'navigation-container'),
            loadComponent('components/footer.html', 'footer-container')
        ]);

        // Dispatch custom event when components are loaded
        document.dispatchEvent(new Event('componentsLoaded'));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }
})();
