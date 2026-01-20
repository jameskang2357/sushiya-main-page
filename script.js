// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Skip empty anchors
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const offsetTop = target.offsetTop - navbarHeight - 20; // Account for fixed navbar + padding
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        navbar.style.boxShadow = scrollY > 100 
            ? '0 2px 20px rgba(0, 0, 0, 0.15)' 
            : '0 2px 10px rgba(0, 0, 0, 0.1)';
    });
}

/**
 * Input sanitization to prevent XSS attacks
 * @param {string} str - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.trim();
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate and sanitize phone number
 * @param {string} phone - Phone number to validate
 * @returns {string} - Sanitized phone or empty string
 */
function sanitizePhone(phone) {
    if (!phone) return '';
    // Remove all non-digit characters except +, -, (, ), and spaces
    const cleaned = phone.replace(/[^\d+\-() ]/g, '');
    // Limit length to prevent abuse
    return cleaned.substring(0, 20);
}

// Contact Form Handling with EmailJS
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Initialize EmailJS when the page loads
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('EMZzJc2STeSrosYUF');
        }
    }, 100);
});

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous status messages
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
        
        // Get form elements
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const phoneInput = contactForm.querySelector('#phone');
        const messageInput = contactForm.querySelector('#message');
        const submitBtn = contactForm.querySelector('.btn-submit');
        
        if (!nameInput || !emailInput || !messageInput || !submitBtn) {
            return;
        }
        
        // Get and sanitize form data
        const rawName = nameInput.value.trim();
        const rawEmail = emailInput.value.trim();
        const rawPhone = phoneInput.value.trim();
        const rawMessage = messageInput.value.trim();
        
        // Validate required fields
        if (!rawName || !rawEmail || !rawMessage) {
            formStatus.textContent = 'Please fill in all required fields.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }
        
        // Validate email format
        if (!isValidEmail(rawEmail)) {
            formStatus.textContent = 'Please enter a valid email address.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }
        
        // Validate input lengths to prevent abuse
        if (rawName.length > 100) {
            formStatus.textContent = 'Name is too long. Please keep it under 100 characters.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }
        
        if (rawMessage.length > 2000) {
            formStatus.textContent = 'Message is too long. Please keep it under 2000 characters.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }
        
        // Sanitize all inputs
        const sanitizedData = {
            from_name: sanitizeInput(rawName),
            from_email: sanitizeInput(rawEmail),
            phone: rawPhone ? sanitizePhone(rawPhone) : 'Not provided',
            message: sanitizeInput(rawMessage)
        };
        
        // Disable submit button
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Check if EmailJS is initialized
            if (typeof emailjs === 'undefined') {
                throw new Error('Email service is not available. Please refresh the page and try again.');
            }
            
            // Send email using EmailJS
            await emailjs.send(
                'service_by0uekf',
                'template_rp3pcg6',
                {
                    to_email: 'k1218dj@gmail.com',
                    from_name: sanitizedData.from_name,
                    from_email: sanitizedData.from_email,
                    phone: sanitizedData.phone,
                    message: sanitizedData.message
                }
            );
            
            // Success
            formStatus.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Scroll to status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            // Error handling - don't expose sensitive details to users
            let errorMessage = 'There was an error sending your message. ';
            
            if (error.status === 400) {
                errorMessage += 'Please check that all required fields are filled correctly.';
            } else if (error.status === 401) {
                errorMessage += 'Service configuration error. Please contact us directly at (541) 686-3464.';
            } else if (error.status === 0 || !navigator.onLine) {
                errorMessage += 'Network error. Please check your internet connection and try again.';
            } else {
                errorMessage += 'Please try again later or call us at (541) 686-3464.';
            }
            
            formStatus.textContent = errorMessage;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            
            // Scroll to status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// Image Gallery with Lightbox
const lightboxModal = document.getElementById('lightboxModal');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let galleryImages = [];
let currentImageIndex = 0;

/**
 * Load and render gallery images dynamically from images.json
 */
async function loadGalleryImages() {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryLoading = document.getElementById('galleryLoading');
    
    if (!galleryGrid) return;
    
    try {
        // Try absolute path first (for production), then relative (for local dev)
        // Add cache-busting query param to prevent Chrome caching issues
        const cacheBuster = `?v=${Date.now()}`;
        let response;
        let imagesJsonPath;
        let basePath = '';
        
        // Production path first
        try {
            imagesJsonPath = '/images.json' + cacheBuster;
            response = await fetch(imagesJsonPath, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            basePath = '/img/';
        } catch (e) {
            // Fallback to relative path for local development
            try {
                imagesJsonPath = './images.json' + cacheBuster;
                response = await fetch(imagesJsonPath, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                basePath = './img/';
            } catch (e2) {
                throw new Error(`Failed to load images.json: ${e.message || e2.message}`);
            }
        }
        
        const data = await response.json();
        const images = data.images || [];
        
        if (!Array.isArray(images) || images.length === 0) {
            throw new Error('No images found in images.json');
        }
        
        // Store images for lightbox navigation - use consistent path
        galleryImages = images.map(img => ({
            src: basePath + img.file,
            name: img.name || img.file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/[-_]/g, ' ')
        }));
        
        // Hide loading message
        if (galleryLoading) {
            galleryLoading.style.display = 'none';
        }
        
        // Generate gallery items
        galleryGrid.innerHTML = galleryImages.map((img, index) => `
            <div class="gallery-item" data-index="${index}">
                <img src="${img.src}" alt="${img.name}" loading="lazy">
                <div class="gallery-item-overlay">
                    <p class="gallery-item-name">${img.name}</p>
                </div>
            </div>
        `).join('');
        
        // Attach click handlers
        galleryGrid.querySelectorAll('.gallery-item[data-index]').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'), 10);
                openLightbox(index);
            });
        });
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        if (galleryLoading) {
            galleryLoading.innerHTML = `
                <div style="color: #721c24; padding: 20px;">
                    <strong>Unable to load gallery.</strong><br>
                    ${error.message || 'Please refresh the page.'}<br>
                    <small>Check browser console (F12) for details.</small>
                </div>
            `;
        }
    }
}

/**
 * Open lightbox at specific index
 */
function openLightbox(index) {
    if (!lightboxModal || galleryImages.length === 0) return;
    
    currentImageIndex = Math.max(0, Math.min(index, galleryImages.length - 1));
    updateLightboxImage();
    
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Update lightbox image and caption
 */
function updateLightboxImage() {
    if (!lightboxImage || !galleryImages[currentImageIndex]) return;
    
    const img = galleryImages[currentImageIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.name;
    
    if (lightboxCaption) {
        lightboxCaption.textContent = img.name;
    }
    
    // Update nav button visibility
    if (lightboxPrev) {
        lightboxPrev.style.display = currentImageIndex > 0 ? 'flex' : 'none';
    }
    if (lightboxNext) {
        lightboxNext.style.display = currentImageIndex < galleryImages.length - 1 ? 'flex' : 'none';
    }
}

/**
 * Navigate to previous image
 */
function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxImage();
    }
}

/**
 * Navigate to next image
 */
function nextImage() {
    if (currentImageIndex < galleryImages.length - 1) {
        currentImageIndex++;
        updateLightboxImage();
    }
}

/**
 * Close lightbox
 */
function closeLightbox() {
    if (!lightboxModal) return;
    
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Initialize lightbox event listeners
 */
function initLightboxListeners() {
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            prevImage();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });
    }

    if (lightboxModal) {
        const overlay = lightboxModal.querySelector('.lightbox-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeLightbox);
        }
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        
        switch (e.key) {
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
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadGalleryImages();
    initLightboxListeners();
});
