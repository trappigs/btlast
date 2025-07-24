// Hero Slider JavaScript
(function() {
    'use strict';

    console.log('Hero slider script loaded');

    // Configuration
    const config = {
        autoPlayDelay: 5000,
        transitionDuration: 800,
        pauseOnHover: true,
        swipeThreshold: 50,
        progressBarAnimation: true
    };

    // DOM Elements
    let slider = null;
    let slides = null;
    let currentSlide = 0;
    let totalSlides = 0;
    let isTransitioning = false;
    let autoPlayTimer = null;
    let progressTimer = null;

    // Navigation elements
    let prevBtn = null;
    let nextBtn = null;
    let paginationDots = null;
    let progressBar = null;
    let prevPreview = null;
    let nextPreview = null;

    // Touch/Swipe variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSlider);
    } else {
        initializeSlider();
    }

    function initializeSlider() {
        console.log('Initializing hero slider');

        // Get DOM elements
        slider = document.getElementById('heroSlider');
        if (!slider) {
            console.log('Hero slider container not found');
            return;
        }

        slides = slider.querySelectorAll('.slide');
        prevBtn = document.getElementById('prevBtn');
        nextBtn = document.getElementById('nextBtn');
        paginationDots = slider.querySelectorAll('.pagination-dot');
        progressBar = document.getElementById('progressBar');
        prevPreview = document.getElementById('prevPreview');
        nextPreview = document.getElementById('nextPreview');

        if (!slides.length) {
            console.log('No slides found');
            return;
        }

        totalSlides = slides.length;
        console.log(`Found ${totalSlides} slides`);

        // Set up slides
        setupSlides();

        // Setup navigation previews
        setupNavigationPreviews();

        // Setup event listeners
        setupEventListeners();

        // Start autoplay
        startAutoPlay();

        // Set initial progress
        resetProgress();

        console.log('Hero slider initialization complete');
    }

    function setupSlides() {
        console.log('Setting up slides');

        slides.forEach((slide, index) => {
            // Set background images
            const bgImage = slide.getAttribute('data-bg');
            if (bgImage) {
                slide.style.backgroundImage = `url(${bgImage})`;
            }

            // Ensure only first slide is active
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }

            // Add slide animations
            setupSlideAnimations(slide, index);
        });

        // Update pagination
        updatePagination();
    }

    function setupSlideAnimations(slide, index) {
        const elements = slide.querySelectorAll('.slide-title, .slide-actions, .location-pin, .floating-card');

        elements.forEach((element, i) => {
            element.style.animationDelay = `${0.3 + (i * 0.3)}s`;
        });
    }

    function setupEventListeners() {
        console.log('Setting up event listeners');

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('Previous button clicked');
            previousSlide();
            
            // Tıklamadan hemen sonra önizlemeyi güncellemek için
            // küçük bir gecikme ile fonksiyonu çağırıyoruz.
            // Bu, slayt durumunun güncellenmesine zaman tanır.
            setTimeout(() => {
                updatePreview('prev');
                updatePreview('next');
            }, 100); // 100 milisaniye gecikme
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Next button clicked');
            nextSlide();
            
            // Tıklamadan hemen sonra önizlemeyi güncellemek için
            // küçük bir gecikme ile fonksiyonu çağırıyoruz.
            setTimeout(() => {
                updatePreview('prev');
                updatePreview('next');
            }, 100); // 100 milisaniye gecikme
        });
    }

        // Pagination dots
        paginationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log(`Pagination dot ${index} clicked`);
                goToSlide(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Touch/Swipe events
        slider.addEventListener('touchstart', handleTouchStart, {
            passive: true
        });
        slider.addEventListener('touchmove', handleTouchMove, {
            passive: true
        });
        slider.addEventListener('touchend', handleTouchEnd);

        // Mouse events for desktop swipe simulation
        slider.addEventListener('mousedown', handleMouseDown);
        slider.addEventListener('mousemove', handleMouseMove);
        slider.addEventListener('mouseup', handleMouseUp);
        slider.addEventListener('mouseleave', handleMouseUp);

        // Pause on hover (if enabled)
        if (config.pauseOnHover) {
            slider.addEventListener('mouseenter', pauseAutoPlay);
            slider.addEventListener('mouseleave', resumeAutoPlay);
        }

        // Window resize
        window.addEventListener('resize', handleResize);

        // Visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function nextSlide() {
        if (isTransitioning) return;

        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    function previousSlide() {
        if (isTransitioning) return;

        const prevIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
        goToSlide(prevIndex);
    }
    
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide || index < 0 || index >= totalSlides) {
            return;
        }

        console.log(`Going to slide ${index}`);

        isTransitioning = true;

        // Update current slide
        const previousSlide = currentSlide;
        currentSlide = index;

        // Remove active class from current slide
        slides[previousSlide].classList.remove('active');

        // Add active class to new slide
        setTimeout(() => {
            slides[currentSlide].classList.add('active');

            // Reset animations
            resetSlideAnimations(slides[currentSlide]);

            setTimeout(() => {
                isTransitioning = false;
            }, config.transitionDuration);

        }, 50);

        // Update pagination
        updatePagination();


        // Reset autoplay
        resetAutoPlay();

        // Reset progress
        resetProgress();
    }

    function setupNavigationPreviews() {
        console.log('Setting up navigation previews');

        if (!prevPreview || !nextPreview) {
            console.log('Preview elements not found');
            return;
        }

        // Setup hover events for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('mouseenter', () => {
                updatePreview('prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('mouseenter', () => {
                updatePreview('next');
            });
        }
    }

    function updatePreview(direction) {
        const previewElement = direction === 'prev' ? prevPreview : nextPreview;
        const targetSlideIndex = direction === 'prev' ?
            (currentSlide === 0 ? totalSlides - 1 : currentSlide - 1) :
            (currentSlide + 1) % totalSlides;

        const targetSlide = slides[targetSlideIndex];

        if (!targetSlide || !previewElement) return;

        // Get slide data
        const bgImage = targetSlide.getAttribute('data-bg');
        const title = targetSlide.getAttribute('data-title');
        const subtitle = targetSlide.getAttribute('data-subtitle');

        // Update preview image
        const previewImage = previewElement.querySelector('.preview-image');
        if (previewImage && bgImage) {
            previewImage.style.backgroundImage = `url(${bgImage})`;
        }

        // Update preview content
        const previewTitle = previewElement.querySelector('.preview-title');
        const previewSubtitle = previewElement.querySelector('.preview-subtitle');

        if (previewTitle) {
            previewTitle.textContent = title || `Slide ${targetSlideIndex + 1}`;
        }

        if (previewSubtitle) {
            previewSubtitle.textContent = subtitle || 'Nova Arsa Projesi';
        }

        console.log(`Updated ${direction} preview for slide ${targetSlideIndex}`);
    }

    function resetSlideAnimations(slide) {
        const animatedElements = slide.querySelectorAll('.slide-title, .slide-actions, .location-pin, .floating-card');

        animatedElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = null;
        });
    }

    function updatePagination() {
        paginationDots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startAutoPlay() {
        if (totalSlides <= 1) return;

        console.log('Starting autoplay');

        autoPlayTimer = setInterval(() => {
            if (!isTransitioning && !document.hidden) {
                nextSlide();
            }
        }, config.autoPlayDelay);

        // Start progress bar
        if (config.progressBarAnimation) {
            startProgress();
        }
    }

    function pauseAutoPlay() {
        console.log('Pausing autoplay');
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
        pauseProgress();
    }

    function resumeAutoPlay() {
        console.log('Resuming autoplay');
        if (!autoPlayTimer && totalSlides > 1) {
            startAutoPlay();
        }
    }

    function resetAutoPlay() {
        pauseAutoPlay();
        if (totalSlides > 1) {
            setTimeout(startAutoPlay, 100);
        }
    }

    function startProgress() {
        if (!progressBar) return;

        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        setTimeout(() => {
            progressBar.style.transition = `width ${config.autoPlayDelay}ms linear`;
            progressBar.style.width = '100%';
        }, 50);
    }

    function pauseProgress() {
        if (!progressBar) return;

        const currentWidth = progressBar.offsetWidth;
        const containerWidth = progressBar.parentElement.offsetWidth;
        const currentPercentage = (currentWidth / containerWidth) * 100;

        progressBar.style.transition = 'none';
        progressBar.style.width = currentPercentage + '%';
    }

    function resetProgress() {
        if (!progressBar) return;

        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        if (config.progressBarAnimation && totalSlides > 1) {
            setTimeout(startProgress, 100);
        }
    }

    // Touch/Swipe Handlers
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        pauseAutoPlay();
    }

    function handleTouchMove(e) {
        if (!touchStartX || !touchStartY) return;

        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        if (!touchStartX || !touchEndX) return;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Check if horizontal swipe is more prominent than vertical
        if (absDeltaX > absDeltaY && absDeltaX > config.swipeThreshold) {
            if (deltaX > 0) {
                console.log('Swipe right detected');
                previousSlide();
            } else {
                console.log('Swipe left detected');
                nextSlide();
            }
        }

        // Reset touch coordinates
        touchStartX = 0;
        touchEndX = 0;
        touchStartY = 0;
        touchEndY = 0;

        resumeAutoPlay();
    }

    // Mouse events for desktop swipe simulation
    let mouseStartX = 0;
    let isMouseDown = false;

    function handleMouseDown(e) {
        mouseStartX = e.clientX;
        isMouseDown = true;
        slider.style.cursor = 'grabbing';
        pauseAutoPlay();
    }

    function handleMouseMove(e) {
        if (!isMouseDown) return;

        const deltaX = e.clientX - mouseStartX;
        const absDeltaX = Math.abs(deltaX);

        if (absDeltaX > config.swipeThreshold) {
            if (deltaX > 0) {
                previousSlide();
            } else {
                nextSlide();
            }
            handleMouseUp();
        }
    }

    function handleMouseUp() {
        isMouseDown = false;
        mouseStartX = 0;
        slider.style.cursor = '';
        resumeAutoPlay();
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
            case ' ':
                e.preventDefault();
                if (autoPlayTimer) {
                    pauseAutoPlay();
                } else {
                    resumeAutoPlay();
                }
                break;
            case 'Escape':
                pauseAutoPlay();
                break;
        }
    }

    // Window resize handler
    function handleResize() {
        // Debounce resize events
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            console.log('Window resized, updating slider');
            resetSlideAnimations(slides[currentSlide]);
        }, 250);
    }

    // Visibility change handler
    function handleVisibilityChange() {
        if (document.hidden) {
            console.log('Tab hidden, pausing slider');
            pauseAutoPlay();
        } else {
            console.log('Tab visible, resuming slider');
            resumeAutoPlay();
        }
    }

    // Intersection Observer for performance optimization
    function setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Slider is visible, resuming autoplay');
                    resumeAutoPlay();
                } else {
                    console.log('Slider is not visible, pausing autoplay');
                    pauseAutoPlay();
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(slider);
    }

    // Preload images for better performance
    function preloadImages() {
        console.log('Preloading slide images');

        slides.forEach((slide, index) => {
            const bgImage = slide.getAttribute('data-bg');
            if (bgImage) {
                const img = new Image();
                img.onload = () => {
                    console.log(`Image ${index + 1} preloaded: ${bgImage}`);
                };
                img.onerror = () => {
                    console.warn(`Failed to preload image ${index + 1}: ${bgImage}`);
                };
                img.src = bgImage;
            }
        });
    }

    // Public API
    window.HeroSlider = {
        goToSlide: goToSlide,
        nextSlide: nextSlide,
        previousSlide: previousSlide,
        pauseAutoPlay: pauseAutoPlay,
        resumeAutoPlay: resumeAutoPlay,
        getCurrentSlide: () => currentSlide,
        getTotalSlides: () => totalSlides,
        isTransitioning: () => isTransitioning,

        // Configuration methods
        setAutoPlayDelay: (delay) => {
            config.autoPlayDelay = delay;
            resetAutoPlay();
        },

        // Event listeners for external control
        on: (event, callback) => {
            slider.addEventListener(`heroSlider:${event}`, callback);
        },

        // Trigger custom events
        trigger: (event, data) => {
            const customEvent = new CustomEvent(`heroSlider:${event}`, {
                detail: data
            });
            slider.dispatchEvent(customEvent);
        }
    };

    // Enhanced initialization with all features
    function initializeEnhancedFeatures() {
        if (slider) {
            setupIntersectionObserver();
            preloadImages();

            console.log('Enhanced hero slider features initialized');

            // Trigger initialization complete event
            window.HeroSlider.trigger('initialized', {
                totalSlides: totalSlides,
                currentSlide: currentSlide
            });
        }
    }

    // Call enhanced initialization after main initialization
    if (slider) {
        setTimeout(initializeEnhancedFeatures, 100);
    }

    // Accessibility improvements
    function setupAccessibility() {
        if (!slider) return;

        // Add ARIA attributes
        slider.setAttribute('role', 'region');
        slider.setAttribute('aria-label', 'Image carousel');
        slider.setAttribute('aria-live', 'polite');

        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Previous slide');
        }
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Next slide');
        }

        // Pagination dots
        paginationDots.forEach((dot, index) => {
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('tabindex', '0');

            // Keyboard support for pagination
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                }
            });
        });

        console.log('Accessibility features initialized');
    }

    // Error handling and fallbacks
    function handleErrors() {
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('Image failed to load:', e.target.src);
                // Could implement fallback image here
            }
        });

        // Fallback for browsers without CSS animations
        if (!window.CSS || !CSS.supports('animation', 'slideInUp 1s ease')) {
            console.warn('CSS animations not supported, disabling transitions');
            config.transitionDuration = 0;
        }
    }

    // Performance monitoring
    function setupPerformanceMonitoring() {
        if (!window.performance || !performance.mark) return;

        // Mark performance points
        const originalGoToSlide = goToSlide;
        window.HeroSlider.goToSlide = function(index) {
            performance.mark('slide-transition-start');

            const result = originalGoToSlide.call(this, index);

            setTimeout(() => {
                performance.mark('slide-transition-end');
                performance.measure('slide-transition', 'slide-transition-start', 'slide-transition-end');

                const measures = performance.getEntriesByName('slide-transition');
                if (measures.length > 0) {
                    const duration = measures[measures.length - 1].duration;
                    console.log(`Slide transition took ${duration.toFixed(2)}ms`);
                }
            }, config.transitionDuration + 100);

            return result;
        };
    }

    // Initialize additional features
    setTimeout(() => {
        setupAccessibility();
        handleErrors();
        setupPerformanceMonitoring();
    }, 200);

    console.log('Hero slider script fully loaded and ready');

})();