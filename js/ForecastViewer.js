// Forecast Viewer - Handles dynamic loading of forecast images and animations
(function() {
    'use strict';

    const S3_BUCKET_URL = 'https://swxforecastlab.s3.eu-west-2.amazonaws.com';
    
    let ambientSelect;
    let cmeSelect;
    let forecastImage;
    let forecastVideo;
    let forecastVideoSource;
    let loadingIndicator;
    let errorMessage;

    // Initialize the forecast viewer
    function init() {
        // Get DOM elements
        ambientSelect = document.getElementById('ambient-select');
        cmeSelect = document.getElementById('cme-select');
        forecastImage = document.getElementById('forecast-image');
        forecastVideo = document.getElementById('forecast-video');
        forecastVideoSource = document.getElementById('forecast-video-source');
        loadingIndicator = document.getElementById('loading-indicator');
        errorMessage = document.getElementById('error-message');

        if (!ambientSelect || !cmeSelect) {
            console.error('Forecast viewer elements not found');
            return;
        }

        // Add event listeners to dropdowns
        ambientSelect.addEventListener('change', updateForecast);
        cmeSelect.addEventListener('change', updateForecast);

        // Add image error handler
        if (forecastImage) {
            forecastImage.addEventListener('load', handleImageLoad);
            forecastImage.addEventListener('error', handleImageError);
        }

        // Add video error handler
        if (forecastVideo) {
            forecastVideo.addEventListener('loadeddata', handleVideoLoad);
            forecastVideo.addEventListener('error', handleVideoError);
        }

        // Load initial forecast
        updateForecast();
    }

    // Construct URLs based on selected options
    function constructImageURL(ambient, cme) {
        return `${S3_BUCKET_URL}/${ambient}_${cme}_huxt_forecast_latest.png`;
    }

    function constructVideoURL(ambient, cme) {
        return `${S3_BUCKET_URL}/${ambient}_${cme}_huxt_animation_latest.mp4`;
    }

    // Update forecast based on current selections
    function updateForecast() {
        const ambient = ambientSelect.value;
        const cme = cmeSelect.value;

        if (!ambient || !cme) {
            return;
        }

        // Show loading indicator
        showLoading();
        hideError();

        // Construct URLs
        const imageURL = constructImageURL(ambient, cme);
        const videoURL = constructVideoURL(ambient, cme);

        // Update image
        if (forecastImage) {
            forecastImage.src = imageURL;
            forecastImage.alt = `HUXt forecast for ${ambient} ambient conditions and ${cme} CME conditions`;
        }

        // Update video
        if (forecastVideo && forecastVideoSource) {
            // Pause video while changing source
            forecastVideo.pause();
            forecastVideoSource.src = videoURL;
            forecastVideo.load();
        }

        console.log(`Loading forecast: ${ambient} + ${cme}`);
        console.log(`Image URL: ${imageURL}`);
        console.log(`Video URL: ${videoURL}`);
    }

    // Show loading indicator
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
    }

    // Hide loading indicator
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    // Show error message
    function showError() {
        if (errorMessage) {
            errorMessage.style.display = 'block';
        }
    }

    // Hide error message
    function hideError() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }

    // Handle successful image load
    function handleImageLoad() {
        hideLoading();
        console.log('Forecast image loaded successfully');
    }

    // Handle image load error
    function handleImageError() {
        hideLoading();
        showError();
        console.error('Failed to load forecast image');
    }

    // Handle successful video load
    function handleVideoLoad() {
        console.log('Forecast video loaded successfully');
    }

    // Handle video load error
    function handleVideoError() {
        console.error('Failed to load forecast video');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also try to initialize when components are loaded (for navigation)
    document.addEventListener('componentsLoaded', function() {
        setTimeout(init, 50);
    });
})();
