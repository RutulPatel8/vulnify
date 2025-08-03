// Animation and Intersection Observer utilities
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupProgressCircle();
        this.setupParticles();
        this.setupTypewriter();
    }

    // Intersection Observer for scroll-triggered animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Special handling for different animation types
                    if (entry.target.classList.contains('service-card')) {
                        this.animateServiceCard(entry.target);
                    }
                    
                    if (entry.target.classList.contains('contact-item')) {
                        this.animateContactItem(entry.target);
                    }
                    
                    if (entry.target.classList.contains('feature-item')) {
                        this.animateFeatureItem(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll([
            '.section-header',
            '.service-card',
            '.feature-item',
            '.contact-item',
            '.contact-form-container',
            '.fade-in',
            '.slide-in-left',
            '.slide-in-right',
            '.scale-in'
        ].join(','));

        elementsToObserve.forEach(el => observer.observe(el));
    }

    // Scroll-based animations
    setupScrollAnimations() {
        let ticking = false;

        const updateAnimations = () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.parallax');
            
            parallax.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            // Navbar scroll effect
            const navbar = document.getElementById('navbar');
            if (scrolled > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // Animated counters
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Progress circle animation
    setupProgressCircle() {
        const progressCircle = document.querySelector('.progress-circle');
        if (!progressCircle) return;

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressCircle(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressObserver.observe(progressCircle);
    }

    animateProgressCircle(element) {
        const progressBar = element.querySelector('.progress-bar');
        const progressValue = parseInt(element.dataset.progress);
        const circumference = 2 * Math.PI * 90; // radius = 90
        const offset = circumference - (progressValue / 100) * circumference;

        // Create gradient definition
        const svg = element.querySelector('.progress-ring');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.id = 'gradient';
        gradient.innerHTML = `
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#ec4899"/>
        `;
        defs.appendChild(gradient);
        svg.appendChild(defs);

        // Animate the progress
        setTimeout(() => {
            progressBar.style.strokeDashoffset = offset;
        }, 500);
    }

    // Floating particles animation
    setupParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            particlesContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 5000);
        };

        // Create particles periodically
        setInterval(createParticle, 300);
    }

    // Typewriter effect for hero title
    setupTypewriter() {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            line.style.opacity = '1';
            
            setTimeout(() => {
                this.typeWriter(line, text, 50);
            }, 1200 + (index * 200));
        });
    }

    typeWriter(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Service card animation
    animateServiceCard(card) {
        const icon = card.querySelector('.service-icon');
        const features = card.querySelectorAll('.service-features li');
        
        setTimeout(() => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, 200);

        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateX(0)';
            }, 300 + (index * 100));
        });
    }

    // Contact item animation
    animateContactItem(item) {
        const icon = item.querySelector('.contact-icon');
        
        setTimeout(() => {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, 200);
    }

    // Feature item animation
    animateFeatureItem(item) {
        const icon = item.querySelector('.feature-icon');
        
        setTimeout(() => {
            icon.style.transform = 'scale(1.1) rotateY(180deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotateY(0deg)';
            }, 400);
        }, 200);
    }

    // Button hover animations
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Magnetic effect for floating cards
    setupMagneticEffect() {
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                card.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) rotateX(${y * 0.1}deg) rotateY(${x * 0.1}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translate(0, 0) rotateX(0) rotateY(0)';
            });
        });
    }

    // Smooth reveal animations for text
    setupTextReveal() {
        const textElements = document.querySelectorAll('h1, h2, h3, p');
        
        textElements.forEach(element => {
            const text = element.textContent;
            const words = text.split(' ');
            element.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
            
            const wordSpans = element.querySelectorAll('.word');
            wordSpans.forEach((span, index) => {
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px)';
                span.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
            });
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.word');
                    words.forEach(word => {
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    });
                }
            });
        }, { threshold: 0.1 });

        textElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // Parallax scrolling for background elements
    setupParallaxScrolling() {
        const parallaxElements = document.querySelectorAll('.geometric-shapes .shape');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.2;
                element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});

// Export for use in other files
window.AnimationController = AnimationController;
