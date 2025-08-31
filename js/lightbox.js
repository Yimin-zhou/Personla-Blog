// Simple Lightbox for Images with Navigation
(function() {
    'use strict';
    
    let currentImageIndex = 0;
    let images = [];
    
    // Create lightbox HTML
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <button class="lightbox-prev" title="Previous image">&#10094;</button>
                <button class="lightbox-next" title="Next image">&#10095;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }
    
    // Show image at specific index
    function showImage(index) {
        if (index < 0 || index >= images.length) return;
        
        currentImageIndex = index;
        const img = images[index];
        const lightboxImg = document.querySelector('.lightbox-image');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        const lightboxCounter = document.querySelector('.lightbox-counter');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt || img.title || '';
        lightboxCounter.textContent = `${index + 1} / ${images.length}`;
        
        // Show/hide navigation buttons
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        
        prevBtn.style.display = images.length > 1 ? 'block' : 'none';
        nextBtn.style.display = images.length > 1 ? 'block' : 'none';
    }
    
    // Navigate to previous image
    function prevImage() {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        showImage(newIndex);
    }
    
    // Navigate to next image
    function nextImage() {
        const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        showImage(newIndex);
    }
    
    // Initialize lightbox
    function initLightbox() {
        const lightbox = createLightbox();
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        
        // Find all images in post content
        const postImages = document.querySelectorAll('.post-content img');
        
        // Filter images that are not in links and store them
        images = Array.from(postImages).filter(img => !img.closest('a'));
        
        // Add click event to each image
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                currentImageIndex = index;
                showImage(index);
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Navigation events
        prevBtn.addEventListener('click', prevImage);
        nextBtn.addEventListener('click', nextImage);
        
        // Close lightbox events
        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        prevImage();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                }
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }
})();
