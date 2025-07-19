// Global variables for gallery
let galleryItems = [];
let galleryImages = []; 
let currentItemIndex = 0;
let currentImageIndex = 0; 
let thumbnailScrollPosition = 0;

// Initialize gallery data from DOM - Video'ları önce sırala
function initializeGalleryData() {
    galleryItems = [];
    galleryImages = [];
    
    let videoItems = [];
    let imageItems = [];
    
    // Get all gallery items (both images and videos) - DOM'daki sırayı kullan
    const galleryItemElements = document.querySelectorAll('.gallery-item');
    
    galleryItemElements.forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        const video = item.querySelector('.gallery-video');
        
        if (video) {
            // Video item
            const source = video.querySelector('source');
            const itemData = {
                url: source ? source.src : video.src,
                alt: 'Gallery video',
                isVideo: true,
                domIndex: index,
                sortIndex: videoItems.length // Video sırası
            };
            videoItems.push(itemData);
        } else if (img) {
            // Image item
            const itemData = {
                url: img.src,
                alt: img.alt || 'Gallery image',
                isVideo: false,
                domIndex: index,
                sortIndex: imageItems.length // Resim sırası
            };
            imageItems.push(itemData);
        }
    });
    
    // Video'ları önce, resimleri sonra ekle (server-side sırasıyla uyumlu)
    galleryItems = [...videoItems, ...imageItems];
    galleryImages = [...videoItems, ...imageItems];
    
    // Final index'leri ayarla
    galleryItems.forEach((item, index) => {
        item.finalIndex = index;
    });
    galleryImages.forEach((item, index) => {
        item.finalIndex = index;
    });
    
    console.log('Gallery initialized with', galleryItems.length, 'items');
    console.log('Video items:', videoItems.length, 'Image items:', imageItems.length);
    console.log('First item is video:', galleryItems[0]?.isVideo);
    return galleryItems;
}

// Gallery media change function
function changeMainMedia(mediaUrl, altText, itemIndex, isVideo) {
    console.log('changeMainMedia called with:', mediaUrl, 'index:', itemIndex, 'isVideo:', isVideo);
    
    const mainMedia = document.getElementById('mainProjectMedia');
    
    if (mainMedia) {
        console.log('Main media found, changing...');
        
        // Update current indices
        currentItemIndex = itemIndex;
        currentImageIndex = itemIndex;
        
        // Fade out effect
        mainMedia.style.opacity = '0.3';
        
        setTimeout(function() {
            if (isVideo) {
                // If current element is not video, replace with video
                if (mainMedia.tagName !== 'VIDEO') {
                    const videoElement = document.createElement('video');
                    videoElement.src = mediaUrl;
                    videoElement.className = 'main-project-media';
                    videoElement.id = 'mainProjectMedia';
                    videoElement.onclick = function() { openLightbox(); };
                    videoElement.controls = true;
                    videoElement.autoplay = true;
                    videoElement.muted = true;
                    videoElement.playsInline = true;
                    mainMedia.parentNode.replaceChild(videoElement, mainMedia);
                } else {
                    mainMedia.src = mediaUrl;
                    // Video değiştiğinde otomatik oynat
                    setTimeout(() => {
                        const playPromise = mainMedia.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('Video autoplay failed:', error);
                            });
                        }
                    }, 100);
                }
            } else {
                // If current element is not img, replace with img
                if (mainMedia.tagName !== 'IMG') {
                    const imgElement = document.createElement('img');
                    imgElement.src = mediaUrl;
                    imgElement.alt = altText;
                    imgElement.className = 'main-project-media';
                    imgElement.id = 'mainProjectMedia';
                    imgElement.onclick = function() { openLightbox(); };
                    mainMedia.parentNode.replaceChild(imgElement, mainMedia);
                } else {
                    mainMedia.src = mediaUrl;
                    mainMedia.alt = altText;
                }
            }
            
            // Fade in effect
            document.getElementById('mainProjectMedia').style.opacity = '1';
            console.log('Media changed successfully, currentItemIndex:', currentItemIndex);
        }, 200);
    } else {
        console.error('Main media element not found!');
    }
}

// Ensure video autoplay on page load
function ensureVideoAutoplay() {
    const mainMedia = document.getElementById('mainProjectMedia');
    if (mainMedia && mainMedia.tagName === 'VIDEO') {
        console.log('Ensuring video autoplay...');
        
        // Video attributes'larını kontrol et ve ayarla
        mainMedia.autoplay = true;
        mainMedia.muted = true;
        mainMedia.playsInline = true;
        
        // Video yüklendiğinde oynat
        const attemptPlay = () => {
            const playPromise = mainMedia.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video autoplay successful!');
                }).catch(error => {
                    console.log('Video autoplay failed, will try on user interaction:', error);
                });
            }
        };
        
        if (mainMedia.readyState >= 3) {
            // Video zaten yüklenmiş
            attemptPlay();
        } else {
            // Video yüklenmeyi bekle
            mainMedia.addEventListener('loadeddata', attemptPlay, { once: true });
            mainMedia.addEventListener('canplay', attemptPlay, { once: true });
        }
    }
}

// Open lightbox
function openLightbox(startIndex) {
    if (galleryImages.length === 0) {
        initializeGalleryData();
    }
    
    if (startIndex === undefined || startIndex === null) {
        startIndex = currentImageIndex;
    }
    
    currentImageIndex = startIndex;
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        updateLightboxImage();
        generateThumbnails();
    }
}

// Close lightbox
function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Change slide
function changeSlide(direction) {
    if (galleryImages.length === 0) return;
    
    currentImageIndex += direction;
    
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    updateLightboxImage();
}

// Update lightbox image
function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const currentSlideElement = document.getElementById('currentSlide');
    
    if (galleryImages[currentImageIndex] && lightboxImage && currentSlideElement) {
        const currentItem = galleryImages[currentImageIndex];
        
        if (currentItem.isVideo && lightboxVideo) {
            lightboxVideo.style.display = 'block';
            lightboxImage.style.display = 'none';
            
            const source = lightboxVideo.querySelector('source');
            if (source) {
                source.src = currentItem.url;
            } else {
                lightboxVideo.src = currentItem.url;
            }
            lightboxVideo.load();
        } else {
            lightboxImage.style.display = 'block';
            if (lightboxVideo) {
                lightboxVideo.style.display = 'none';
            }
            lightboxImage.src = currentItem.url;
            lightboxImage.alt = currentItem.alt;
        }
        
        currentSlideElement.textContent = currentImageIndex + 1;
        updateActiveThumbnail();
        scrollToActiveThumbnail();
    }
}

// Generate thumbnails
function generateThumbnails() {
    const thumbnailContainer = document.getElementById('lightboxThumbnails');
    if (!thumbnailContainer) return;
    
    thumbnailContainer.innerHTML = '';
    thumbnailScrollPosition = 0;
    
    galleryImages.forEach((item, index) => {
        if (item.isVideo) {
            const video = document.createElement('video');
            video.className = 'lightbox-thumbnail';
            video.muted = true;
            video.onclick = () => {
                currentImageIndex = index;
                updateLightboxImage();
            };
            
            const source = document.createElement('source');
            source.src = item.url;
            source.type = 'video/mp4';
            video.appendChild(source);
            
            thumbnailContainer.appendChild(video);
        } else {
            const thumbnail = document.createElement('img');
            thumbnail.src = item.url;
            thumbnail.alt = item.alt;
            thumbnail.className = 'lightbox-thumbnail';
            thumbnail.onclick = () => {
                currentImageIndex = index;
                updateLightboxImage();
            };
            
            thumbnailContainer.appendChild(thumbnail);
        }
    });
    
    updateActiveThumbnail();
    setTimeout(updateThumbnailNavButtons, 100);
}

// Update active thumbnail
function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.lightbox-thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Scroll to active thumbnail
function scrollToActiveThumbnail() {
    const thumbnailContainer = document.getElementById('lightboxThumbnails');
    const thumbnails = document.querySelectorAll('.lightbox-thumbnail');
    const activeThumbnail = thumbnails[currentImageIndex];
    
    if (activeThumbnail && thumbnailContainer) {
        const containerWidth = thumbnailContainer.offsetWidth;
        const thumbnailWidth = 240 + 15;
        const thumbnailPosition = currentImageIndex * thumbnailWidth;
        const containerCenter = containerWidth / 2;
        const thumbnailCenter = thumbnailWidth / 2;
        
        let scrollPosition = thumbnailPosition - containerCenter + thumbnailCenter;
        
        const maxScroll = thumbnailContainer.scrollWidth - containerWidth;
        if (scrollPosition < 0) scrollPosition = 0;
        if (scrollPosition > maxScroll) scrollPosition = maxScroll;
        
        thumbnailContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        thumbnailScrollPosition = scrollPosition;
        setTimeout(updateThumbnailNavButtons, 300);
    }
}

// Scroll thumbnails
function scrollThumbnails(direction) {
    const thumbnailContainer = document.getElementById('lightboxThumbnails');
    if (!thumbnailContainer) return;
    
    const thumbnailWidth = 240 + 15;
    const containerWidth = thumbnailContainer.offsetWidth;
    const maxScroll = thumbnailContainer.scrollWidth - containerWidth;
    
    thumbnailScrollPosition += direction * thumbnailWidth * 3;
    
    if (thumbnailScrollPosition < 0) {
        thumbnailScrollPosition = 0;
    } else if (thumbnailScrollPosition > maxScroll) {
        thumbnailScrollPosition = maxScroll;
    }
    
    thumbnailContainer.scrollTo({
        left: thumbnailScrollPosition,
        behavior: 'smooth'
    });
    
    setTimeout(updateThumbnailNavButtons, 300);
}

// Update thumbnail navigation button states
function updateThumbnailNavButtons() {
    const thumbnailContainer = document.getElementById('lightboxThumbnails');
    const prevBtn = document.querySelector('.thumbnail-prev');
    const nextBtn = document.querySelector('.thumbnail-next');
    
    if (thumbnailContainer && prevBtn && nextBtn) {
        const maxScroll = thumbnailContainer.scrollWidth - thumbnailContainer.offsetWidth;
        const currentScroll = thumbnailContainer.scrollLeft;
        
        prevBtn.disabled = currentScroll <= 5;
        nextBtn.disabled = currentScroll >= maxScroll - 5;
        
        prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
    }
}

// Initialize gallery
function initializeGallery() {
    initializeGalleryData();
    
    currentImageIndex = 0;
    currentItemIndex = 0;
    
    const totalSlidesElement = document.getElementById('totalSlides');
    if (totalSlidesElement) {
        totalSlidesElement.textContent = galleryImages.length;
    }
    
    // Video autoplay'i kontrol et
    ensureVideoAutoplay();
    
    console.log('Gallery initialized with', galleryImages.length, 'items');
    console.log('Current index:', currentImageIndex);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('lightboxModal');
    if (modal && modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});




// Document ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery script loaded');
    
    // Close lightbox when clicking outside image
    const lightboxModal = document.getElementById('lightboxModal');
    if (lightboxModal) {
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
    
    // Initialize gallery
    setTimeout(function() {
        initializeGallery();
        
        const mainMedia = document.getElementById('mainProjectMedia');
        if (mainMedia) {
            console.log('Main media found:', mainMedia.tagName, mainMedia.src);
        }
        
        const modal = document.getElementById('lightboxModal');
        if (modal) {
            console.log('Lightbox modal found');
        }
    }, 500); // Daha kısa delay
});


    const items = document.querySelectorAll(".expandable-item");

    items.forEach(item => {
        const header = item.querySelector(".expandable-header");
        
        header.addEventListener("click", () => {
            // Tıklanan item'a "active" class'ını ekle/kaldır
            item.classList.toggle("active");

            // Diğer açık olanları kapatmak isterseniz aşağıdaki bölümü aktif edin
            /*
            items.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains("active")) {
                    otherItem.classList.remove("active");
                }
            });
            */
        });
    });
