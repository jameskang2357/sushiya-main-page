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

// Contact Form Handling with EmailJS
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Initialize EmailJS when the page loads
window.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for EmailJS library to load
    setTimeout(function() {
        if (typeof emailjs !== 'undefined') {
            // Initialize EmailJS with your public key
            emailjs.init('EMZzJc2STeSrosYUF');
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS library not loaded. Check that the script is included in index.html');
        }
    }, 100);
});

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous status messages
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Get form data
        const formData = {
            from_name: contactForm.querySelector('#name').value,
            from_email: contactForm.querySelector('#email').value,
            phone: contactForm.querySelector('#phone').value || 'Not provided',
            message: contactForm.querySelector('#message').value,
            to_email: 'k1218dj@gmail.com'
        };
        
        try {
            // Check if EmailJS is initialized
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS library not loaded. Please refresh the page.');
            }
            
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_by0uekf',    // Your EmailJS service ID
                'template_rp3pcg6',   // Your EmailJS template ID
                {
                    to_email: 'k1218dj@gmail.com',
                    from_name: formData.from_name,
                    from_email: formData.from_email,
                    phone: formData.phone,
                    message: formData.message
                }
            );
            
            console.log('EmailJS Response:', response);
            
            // Success
            formStatus.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Scroll to status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            // Error - log detailed error for debugging
            console.error('EmailJS Error Details:', error);
            console.error('Error Status:', error.status);
            console.error('Error Text:', error.text);
            
            let errorMessage = 'There was an error sending your message. ';
            
            // Provide more specific error messages
            if (error.status === 400) {
                errorMessage += 'Please check that all required fields are filled correctly.';
            } else if (error.status === 401) {
                errorMessage += 'Email service configuration error. Please contact the website administrator.';
            } else if (error.status === 0) {
                errorMessage += 'Network error. Please check your internet connection and try again.';
            } else {
                errorMessage += `Error code: ${error.status}. Please try again or call us at (541) 686-3464.`;
            }
            
            formStatus.textContent = errorMessage;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            
            // Scroll to status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

