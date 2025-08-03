// Main JavaScript functionality
class BrightWayApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupTestimonialCarousel();
        this.setupContactForm();
        this.setupBackToTop();
        this.setupLoadingScreen();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
        });

        window.addEventListener('scroll', () => {
            this.updateBackToTopButton();
            this.updateActiveNavLink();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Loading screen management
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    // Navigation functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    this.closeMobileMenu();
                }
            });
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    scrollToSection(target) {
        const offsetTop = target.offsetTop - 70; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Testimonial carousel
    setupTestimonialCarousel() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialBtns = document.querySelectorAll('.testimonial-btn');
        let currentSlide = 0;
        let testimonialInterval;

        const showSlide = (index) => {
            testimonialCards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
            
            testimonialBtns.forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            showSlide(currentSlide);
        };

        const startAutoplay = () => {
            testimonialInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoplay = () => {
            clearInterval(testimonialInterval);
        };

        // Button event listeners
        testimonialBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                stopAutoplay();
                startAutoplay();
            });
        });

        // Pause autoplay on hover
        const testimonialContainer = document.querySelector('.testimonials-container');
        testimonialContainer.addEventListener('mouseenter', stopAutoplay);
        testimonialContainer.addEventListener('mouseleave', startAutoplay);

        // Start autoplay
        startAutoplay();
    }

    // Contact form functionality
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });

        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Reset previous error state
        this.clearFieldError(field);

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                }
                break;
            
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            
            case 'phone':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
            
            case 'service':
                if (value === '') {
                    errorMessage = 'Please select a service';
                    isValid = false;
                }
                break;
            
            case 'message':
                if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        field.style.borderColor = 'var(--secondary-color)';
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        field.style.borderColor = 'var(--gray-200)';
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const formInputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        // Validate all fields
        formInputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(formData, form);
        } else {
            this.showFormMessage('Please correct the errors above', 'error');
        }
    }

    async submitForm(formData, form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            await this.simulateAPICall(formData);
            
            this.showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    simulateAPICall(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful submission
                Math.random() > 0.1 ? resolve() : reject();
            }, 2000);
        });
    }

    showFormMessage(message, type) {
        // Create or update message element
        let messageElement = document.querySelector('.form-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            document.querySelector('.contact-form').appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            text-align: center;
            background: ${type === 'success' ? 'var(--primary-light)' : 'var(--secondary-light)'};
            color: ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
            border: 1px solid ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;

        // Animate in
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 5000);
    }

    // Back to top functionality
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    updateBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToSection(targetElement);
                }
            });
        });
    }

    // Handle window resize
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    // Utility functions
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrightWayApp();
});

// Export for potential use in other scripts
window.BrightWayApp = BrightWayApp;
