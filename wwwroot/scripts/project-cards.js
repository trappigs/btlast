// Project Cards JavaScript
(function() {
    'use strict';

    console.log('Project cards script loaded');

    // DOM Elements
    let projectCards = null;
    let projectButtons = null;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProjectCards);
    } else {
        initializeProjectCards();
    }

    function initializeProjectCards() {
        console.log('Initializing project cards');

        // Get DOM elements
        projectCards = document.querySelectorAll('.project-card');
        projectButtons = document.querySelectorAll('.project-card .btn');

        if (!projectCards.length) {
            console.log('No project cards found');
            return;
        }

        console.log(`Found ${projectCards.length} project cards`);

        // Setup event listeners
        setupEventListeners();

        // Setup intersection observer for animations
        setupIntersectionObserver();

        console.log('Project cards initialization complete');
    }

    function setupEventListeners() {
        console.log('Setting up project cards event listeners');

        // Card hover events
        projectCards.forEach((card, index) => {
            const location = card.getAttribute('data-location');
            
            // Mouse enter
            card.addEventListener('mouseenter', () => {
                console.log(`Card hover: ${location}`);
                handleCardHover(card, true);
            });

            // Mouse leave
            card.addEventListener('mouseleave', () => {
                console.log(`Card unhover: ${location}`);
                handleCardHover(card, false);
            });

            // Card click (mobile fallback)
            card.addEventListener('click', (e) => {
                // Only handle card click if it's not a button click
                if (!e.target.closest('.btn')) {
                    console.log(`Card clicked: ${location}`);
                    handleCardClick(card);
                }
            });
        });

        // Button events
        projectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const card = button.closest('.project-card');
                const location = card.getAttribute('data-location');
                const buttonType = button.classList.contains('btn-primary') ? 'explore' : 'form';
                
                console.log(`Button clicked: ${buttonType} for ${location}`);
                handleButtonClick(button, buttonType, location);
            });
        });

        // Keyboard accessibility
        projectCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(card);
                }
            });
        });
    }

    function handleCardHover(card, isHovering) {
        const overlay = card.querySelector('.card-overlay');
        const image = card.querySelector('.card-image img');
        
        if (isHovering) {
            // Add custom hover effects if needed
            card.style.zIndex = '10';
        } else {
            // Remove custom effects
            card.style.zIndex = '1';
        }
    }

    function handleCardClick(card) {
        const location = card.getAttribute('data-location');
        
        // Mobile: Toggle overlay visibility
        if (window.innerWidth <= 768) {
            const overlay = card.querySelector('.card-overlay');
            const isVisible = overlay.style.opacity === '1';
            
            if (isVisible) {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            } else {
                // Hide other overlays first
                projectCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherOverlay = otherCard.querySelector('.card-overlay');
                        otherOverlay.style.opacity = '0';
                        otherOverlay.style.visibility = 'hidden';
                    }
                });
                
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            }
        }
    }

    function handleButtonClick(button, buttonType, location) {
        // Add loading state
        const originalText = button.textContent;
        button.style.pointerEvents = 'none';
        button.innerHTML = '<span style="opacity: 0.7;">Yükleniyor...</span>';

        setTimeout(() => {
            button.style.pointerEvents = '';
            button.textContent = originalText;
        }, 1500);

        // Handle different button types
        if (buttonType === 'explore') {
            console.log(`Exploring project: ${location}`);
            // Redirect to project detail page
            // window.location.href = `/projeler/${encodeURIComponent(location.toLowerCase().replace(/\s+/g, '-'))}`;
            
            // For demo purposes, show alert
            showNotification(`${location} projesi detayları yükleniyor...`, 'info');
            
        } else if (buttonType === 'form') {
            console.log(`Opening form for: ${location}`);
            // Open contact form or redirect to form page
            openProjectForm(location);
        }

        // Track event (for analytics)
        trackEvent('project_card_click', {
            action: buttonType,
            location: location,
            timestamp: new Date().toISOString()
        });
    }

    function openProjectForm(location) {
        // Option 1: Open modal form
        showNotification(`${location} için iletişim formu açılıyor...`, 'success');
        
        // Option 2: Scroll to contact form and pre-fill location
        const contactForm = document.querySelector('#contactFormContainer');
        if (contactForm) {
            // Pre-fill form with project location
            const projectField = contactForm.querySelector('[name="Subject"]');
            if (projectField) {
                projectField.value = `${location} Projesi Hakkında Bilgi`;
            }
            
            // Scroll to form
            contactForm.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Option 3: Redirect to dedicated form page
        // window.location.href = `/iletisim?proje=${encodeURIComponent(location)}`;
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : '#FF9800'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    function setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        projectCards.forEach(card => {
            observer.observe(card);
        });
    }

    function trackEvent(eventName, data) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Custom analytics
        console.log('Event tracked:', eventName, data);
        
        // Send to analytics service
        // analyticsService.track(eventName, data);
    }

    // Public API
    window.ProjectCards = {
        // Method to programmatically trigger card actions
        openProject: function(location) {
            const card = Array.from(projectCards).find(card => 
                card.getAttribute('data-location') === location
            );
            if (card) {
                handleCardClick(card);
            }
        },
        
        // Method to show specific project form
        showProjectForm: function(location) {
            openProjectForm(location);
        },
        
        // Method to get all project locations
        getProjects: function() {
            return Array.from(projectCards).map(card => 
                card.getAttribute('data-location')
            );
        }
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);

    console.log('Project cards script fully loaded and ready');

})();