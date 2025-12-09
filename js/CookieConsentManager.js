// GDPR-compliant Cookie Consent Manager
// Handles cookie consent and Google Analytics integration

(function() {
    'use strict';

    const COOKIE_CONSENT_NAME = 'cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;
    const GA_MEASUREMENT_ID = 'G-SR788XPCHG'; // Replace with your Google Analytics ID

    // Cookie utility functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    // Google Analytics functions
    function loadGoogleAnalytics() {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            'anonymize_ip': true, // GDPR compliance - anonymize IP addresses
            'cookie_flags': 'SameSite=Lax;Secure'
        });
        
        console.log('Google Analytics loaded');
    }

    function disableGoogleAnalytics() {
        // Disable Google Analytics by setting opt-out property
        window['ga-disable-' + GA_MEASUREMENT_ID] = true;
        
        // Delete Google Analytics cookies
        const gaCookies = ['_ga', '_gat', '_gid'];
        gaCookies.forEach(function(cookieName) {
            deleteCookie(cookieName);
            // Also try to delete with domain prefix
            document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.' + window.location.hostname;
        });
        
        console.log('Google Analytics disabled');
    }

    // Consent management
    function saveConsent(analyticsEnabled) {
        const consent = {
            essential: true,
            analytics: analyticsEnabled,
            timestamp: new Date().toISOString()
        };
        setCookie(COOKIE_CONSENT_NAME, JSON.stringify(consent), COOKIE_EXPIRY_DAYS);
        
        if (analyticsEnabled) {
            loadGoogleAnalytics();
        } else {
            disableGoogleAnalytics();
        }
    }

    function getConsent() {
        const consentCookie = getCookie(COOKIE_CONSENT_NAME);
        if (consentCookie) {
            try {
                return JSON.parse(consentCookie);
            } catch (e) {
                console.error('Error parsing consent cookie:', e);
                return null;
            }
        }
        return null;
    }

    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    function showModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.add('show');
            
            // Set current preferences
            const consent = getConsent();
            if (consent) {
                document.getElementById('analytics-cookies').checked = consent.analytics;
            }
        }
    }

    function hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Event handlers
    function handleAcceptAll() {
        saveConsent(true);
        hideBanner();
    }

    function handleRejectNonEssential() {
        saveConsent(false);
        hideBanner();
    }

    function handleManagePreferences() {
        showModal();
    }

    function handleSavePreferences() {
        const analyticsEnabled = document.getElementById('analytics-cookies').checked;
        saveConsent(analyticsEnabled);
        hideModal();
        hideBanner();
    }

    function handleCloseModal() {
        hideModal();
    }

    // Initialize
    function init() {
        // Check if consent has been given
        const consent = getConsent();
        
        if (!consent) {
            // No consent yet, show banner
            showBanner();
        } else {
            // Consent already given, apply preferences
            if (consent.analytics) {
                loadGoogleAnalytics();
            }
        }

        // Set up event listeners
        const acceptBtn = document.getElementById('accept-cookies');
        const rejectBtn = document.getElementById('reject-cookies');
        const manageBtn = document.getElementById('manage-cookies');
        const saveBtn = document.getElementById('save-preferences');
        const closeBtn = document.getElementById('close-modal');
        const footerSettingsBtn = document.getElementById('footer-cookie-settings');

        if (acceptBtn) acceptBtn.addEventListener('click', handleAcceptAll);
        if (rejectBtn) rejectBtn.addEventListener('click', handleRejectNonEssential);
        if (manageBtn) manageBtn.addEventListener('click', handleManagePreferences);
        if (saveBtn) saveBtn.addEventListener('click', handleSavePreferences);
        if (closeBtn) closeBtn.addEventListener('click', handleCloseModal);
        if (footerSettingsBtn) footerSettingsBtn.addEventListener('click', showModal);

        // Close modal when clicking outside
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    hideModal();
                }
            });
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
