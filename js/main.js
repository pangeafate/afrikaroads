/* ===== MAIN APPLICATION SCRIPT ===== */

class AfricanRoadsApp {
    constructor() {
        this.isInitialized = false;
        this.currentTestimonial = 0;
        this.testimonialInterval = null;
        this.mobileMenuOpen = false;
        
        // Bind methods
        this.handleScroll = throttle(this.onScroll.bind(this), 16);
        this.handleResize = debounce(this.onResize.bind(this), 250);
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Initialize all components
        this.setupNavigation();
        this.setupHero();
        this.setupServices();
        this.setupProjects();
        this.setupTestimonials();
        this.setupContact();
        this.setupEventListeners();
        this.setupAOS();
        
        this.isInitialized = true;
        console.log('African Roads website initialized successfully');
    }
    
    // Navigation setup
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Mobile menu toggle
        if (mobileMenu) {
            mobileMenu.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.mobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // Update active navigation link based on scroll position
        this.updateActiveNavLink();
    }
    
    // Hero section setup
    setupHero() {
        // Animated statistics counters
        this.setupStatCounters();
        
        // Scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    smoothScrollTo(aboutSection, 1000, 80);
                }
            });
        }
        
        // Add parallax effect to hero background
        this.setupHeroParallax();
    }
    
    // Services section setup
    setupServices() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            // Add hover animations
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
            
            // Add ripple effect on click
            card.addEventListener('click', (e) => {
                createRipple(e, card);
            });
        });
    }
    
    // Projects section setup
    setupProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                // You can add modal functionality here
                console.log('Project card clicked');
            });
        });
    }
    
    // Testimonials setup
    setupTestimonials() {
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.dot');
        
        if (testimonialItems.length === 0) return;
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTestimonial());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTestimonial());
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToTestimonial(index));
        });
        
        // Auto-rotation
        this.startTestimonialRotation();
        
        // Pause on hover
        const testimonialSlider = document.querySelector('.testimonials-slider');
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', () => {
                this.stopTestimonialRotation();
            });
            
            testimonialSlider.addEventListener('mouseleave', () => {
                this.startTestimonialRotation();
            });
        }
    }
    
    // Contact form setup
    setupContact() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(contactForm);
            });
            
            // Add form field animations
            this.setupFormAnimations();
        }
    }
    
    // Event listeners setup
    setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.toggleMobileMenu();
            }
        });
        
        // Click outside to close mobile menu
        document.addEventListener('click', (e) => {
            const navbar = document.querySelector('.navbar');
            if (this.mobileMenuOpen && !navbar.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });
    }
    
    // AOS (Animate On Scroll) setup
    setupAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true,
                offset: 100,
                delay: 0
            });
        }
    }
    
    // Mobile menu toggle
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
        }
        
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }
    
    // Scroll event handler
    onScroll() {
        const scrollPosition = window.pageYOffset;
        const navbar = document.getElementById('navbar');
        
        // Add/remove scrolled class to navbar
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
        
        // Update hero parallax
        this.updateHeroParallax(scrollPosition);
    }
    
    // Window resize handler
    onResize() {
        // Close mobile menu if screen becomes larger
        if (window.innerWidth > 1023 && this.mobileMenuOpen) {
            this.toggleMobileMenu();
        }
        
        // Update AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    // Update active navigation link
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Setup statistics counters
    setupStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateNumberEasing(entry.target, target, 2500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    // Hero parallax setup
    setupHeroParallax() {
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.willChange = 'transform';
        }
    }
    
    // Update hero parallax
    updateHeroParallax(scrollPosition) {
        const heroBackground = document.querySelector('.hero-background');
        const hero = document.querySelector('.hero');
        
        if (heroBackground && hero) {
            const heroHeight = hero.offsetHeight;
            const parallaxSpeed = 0.5;
            
            if (scrollPosition < heroHeight) {
                const yPos = scrollPosition * parallaxSpeed;
                heroBackground.style.transform = `translateY(${yPos}px)`;
            }
        }
    }
    
    // Testimonials navigation
    nextTestimonial() {
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const dots = document.querySelectorAll('.dot');
        
        testimonialItems[this.currentTestimonial].classList.remove('active');
        dots[this.currentTestimonial].classList.remove('active');
        
        this.currentTestimonial = (this.currentTestimonial + 1) % testimonialItems.length;
        
        testimonialItems[this.currentTestimonial].classList.add('active');
        dots[this.currentTestimonial].classList.add('active');
    }
    
    previousTestimonial() {
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const dots = document.querySelectorAll('.dot');
        
        testimonialItems[this.currentTestimonial].classList.remove('active');
        dots[this.currentTestimonial].classList.remove('active');
        
        this.currentTestimonial = this.currentTestimonial === 0 
            ? testimonialItems.length - 1 
            : this.currentTestimonial - 1;
        
        testimonialItems[this.currentTestimonial].classList.add('active');
        dots[this.currentTestimonial].classList.add('active');
    }
    
    goToTestimonial(index) {
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const dots = document.querySelectorAll('.dot');
        
        testimonialItems[this.currentTestimonial].classList.remove('active');
        dots[this.currentTestimonial].classList.remove('active');
        
        this.currentTestimonial = index;
        
        testimonialItems[this.currentTestimonial].classList.add('active');
        dots[this.currentTestimonial].classList.add('active');
    }
    
    startTestimonialRotation() {
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000);
    }
    
    stopTestimonialRotation() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
            this.testimonialInterval = null;
        }
    }
    
    // Form animations
    setupFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Initial state check
                if (input.value) {
                    label.classList.add('active');
                }
                
                // Focus events
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('active');
                    }
                    group.classList.remove('focused');
                });
                
                // Input events
                input.addEventListener('input', () => {
                    if (input.value) {
                        label.classList.add('active');
                    } else {
                        label.classList.remove('active');
                    }
                    
                    // Real-time validation
                    this.validateField(input);
                });
            }
        });
    }
    
    // Form validation
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (type === 'email' && value && !FormValidator.email(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Phone validation
        if (type === 'tel' && value && !FormValidator.phone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        // Display error
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    // Handle contact form submission
    handleContactSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showNotification('Please correct the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            console.log('Form submitted:', data);
            
            // Reset form
            form.reset();
            
            // Reset labels
            const labels = form.querySelectorAll('.form-group label');
            labels.forEach(label => label.classList.remove('active'));
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        }, 2000);
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        const styles = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification-success { border-left: 4px solid #27ae60; }
            .notification-error { border-left: 4px solid #e74c3c; }
            .notification-info { border-left: 4px solid #3498db; }
            .notification-content {
                padding: 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #7f8c8d;
                margin-left: 1rem;
            }
        `;
        
        // Add styles to head if not already added
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Public API methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            smoothScrollTo(section, 1000, 80);
        }
    }
    
    openMobileMenu() {
        if (!this.mobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }
    
    closeMobileMenu() {
        if (this.mobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }
    
    // Cleanup
    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        this.stopTestimonialRotation();
        
        if (this.mobileMenuOpen) {
            document.body.style.overflow = '';
        }
    }
}

// Initialize the application
let app;

function initializeApp() {
    app = new AfricanRoadsApp();
    
    // Make app globally accessible for debugging
    window.AfricanRoadsApp = app;
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AfricanRoadsApp;
}