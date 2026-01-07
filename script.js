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
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

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

// PDF Gallery Modal
const pdfModal = document.getElementById('pdfModal');
const pdfModalClose = document.getElementById('pdfModalClose');
const pdfModalFrame = document.getElementById('pdfModalFrame');
const pdfModalTitle = document.getElementById('pdfModalTitle');
const pdfModalDownload = document.getElementById('pdfModalDownload');
const galleryItems = document.querySelectorAll('.gallery-item[data-pdf]');

// Function to open PDF modal
function openPdfModal(pdfPath, pdfName) {
    if (!pdfModal || !pdfModalFrame || !pdfModalTitle) return;
    
    // Set PDF source
    pdfModalFrame.src = pdfPath;
    
    // Set title (remove .pdf extension if present, capitalize)
    const displayName = pdfName.replace(/\.pdf$/i, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    pdfModalTitle.textContent = displayName;
    
    // Set download link
    if (pdfModalDownload) {
        pdfModalDownload.href = pdfPath;
        pdfModalDownload.download = pdfName;
    }
    
    // Show modal
    pdfModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close PDF modal
function closePdfModal() {
    if (!pdfModal) return;
    
    pdfModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Clear iframe src to stop PDF rendering
    if (pdfModalFrame) {
        pdfModalFrame.src = '';
    }
}

// Add click handlers to gallery items
if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
        const pdfPath = item.getAttribute('data-pdf');
        const pdfName = pdfPath.split('/').pop(); // Get filename from path
        
        item.addEventListener('click', () => {
            // Check if PDF exists before opening (optional - you can remove this check)
            openPdfModal(pdfPath, pdfName);
        });
    });
}

// Close modal when clicking close button
if (pdfModalClose) {
    pdfModalClose.addEventListener('click', closePdfModal);
}

// Close modal when clicking overlay
if (pdfModal) {
    const overlay = pdfModal.querySelector('.pdf-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closePdfModal);
    }
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
        closePdfModal();
    }
}); finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

