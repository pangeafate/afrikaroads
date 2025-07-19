/* ===== ANIMATION CONTROLLER ===== */

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.counters = new Set();
        this.parallaxElements = [];
        this.init();
    }
    
    init() {
        this.setupScrollReveal();
        this.setupCounterAnimations();
        this.setupParallax();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
        
        // Initialize on DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startAnimations());
        } else {
            this.startAnimations();
        }
    }
    
    // Scroll reveal animations
    setupScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger stagger animations
                    if (entry.target.classList.contains('stagger-animation')) {
                        this.triggerStaggerAnimation(entry.target);
                    }
                    
                    // Trigger counter animations
                    if (entry.target.classList.contains('counter-trigger')) {
                        this.triggerCounterAnimations(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.observers.set('scrollReveal', observer);
    }
    
    // Counter animations for statistics
    setupCounterAnimations() {
        const counterElements = document.querySelectorAll('[data-target]');
        counterElements.forEach(element => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = parseInt(element.getAttribute('data-duration')) || 2000;
            
            this.counters.add({
                element,
                target,
                duration,
                hasAnimated: false
            });
        });
    }
    
    // Parallax scrolling effect
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            this.parallaxElements.push({ element, speed });
        });
        
        if (this.parallaxElements.length > 0) {
            this.handleParallax = throttle(this.updateParallax.bind(this), 16);
            window.addEventListener('scroll', this.handleParallax);
        }
    }
    
    // Hover effects and interactions
    setupHoverEffects() {
        // Ripple effect on buttons
        const rippleButtons = document.querySelectorAll('.btn-ripple, .btn');
        rippleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                createRipple(e, button);
            });
        });
        
        // Magnetic effect on cards
        const magneticCards = document.querySelectorAll('.service-card, .project-card');
        magneticCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
        
        // Tilt effect on hover
        const tiltElements = document.querySelectorAll('.tilt-effect');
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.createTiltEffect(e, element);
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
    
    // Loading animations
    setupLoadingAnimations() {
        // Simulate loading for images
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.lazyLoadImage(img);
        });
        
        // Text typing animation
        const typingElements = document.querySelectorAll('.text-typing');
        typingElements.forEach(element => {
            this.createTypingAnimation(element);
        });
    }
    
    // Start all animations
    startAnimations() {
        // Observe elements for scroll reveal
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
        revealElements.forEach(element => {
            this.observers.get('scrollReveal').observe(element);
        });
        
        // Observe counter triggers
        const counterTriggers = document.querySelectorAll('.hero-stats, .stats-section');
        counterTriggers.forEach(element => {
            element.classList.add('counter-trigger');
            this.observers.get('scrollReveal').observe(element);
        });
        
        // Start entrance animations
        this.triggerEntranceAnimations();
    }
    
    // Trigger stagger animation
    triggerStaggerAnimation(container) {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-fade-in-up');
            }, index * 100);
        });
    }
    
    // Trigger counter animations
    triggerCounterAnimations(container) {
        this.counters.forEach(counter => {
            if (container.contains(counter.element) && !counter.hasAnimated) {
                counter.hasAnimated = true;
                this.animateCounter(counter);
            }
        });
    }
    
    // Animate individual counter
    animateCounter(counter) {
        const { element, target, duration } = counter;
        
        // Use easing animation for better visual effect
        animateNumberEasing(element, target, duration);
        
        // Add animation class
        element.classList.add('animate');
    }
    
    // Update parallax elements
    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(({ element, speed }) => {
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Create magnetic effect
    createMagneticEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) * 0.1;
        const deltaY = (event.clientY - centerY) * 0.1;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
    
    // Create tilt effect
    createTiltEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) / rect.width;
        const deltaY = (event.clientY - centerY) / rect.height;
        
        const rotateX = deltaY * -10;
        const rotateY = deltaX * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Lazy load images
    lazyLoadImage(img) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImage.classList.add('loaded');
                    observer.unobserve(lazyImage);
                }
            });
        });
        
        imageObserver.observe(img);
    }
    
    // Create typing animation
    createTypingAnimation(element) {
        const text = element.textContent;
        const speed = parseInt(element.getAttribute('data-speed')) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid currentColor';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Blink cursor
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '2px solid currentColor' 
                        : 'none';
                }, 530);
            }
        };
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    }
    
    // Trigger entrance animations
    triggerEntranceAnimations() {
        // Animate navigation
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('animate-slide-in-top');
        }
        
        // Animate hero content
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .hero-stats');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-fade-in-up');
            }, index * 200 + 500);
        });
    }
    
    // Public methods for manual trigger
    revealElement(element, animationType = 'fade-up') {
        element.classList.add(`animate-${animationType}`);
    }
    
    hideElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    }
    
    resetAnimations() {
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(element => {
            element.classList.remove(...Array.from(element.classList).filter(cls => cls.startsWith('animate-')));
        });
    }
    
    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        if (this.handleParallax) {
            window.removeEventListener('scroll', this.handleParallax);
        }
        
        this.counters.clear();
        this.parallaxElements = [];
    }
}

// Scroll progress indicator
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.updateProgress = throttle(this.updateProgress.bind(this), 16);
        window.addEventListener('scroll', this.updateProgress);
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        
        const styles = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                z-index: 9999;
            }
            .scroll-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #e67e22, #f39c12);
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(progressBar);
        
        this.progressFill = progressBar.querySelector('.scroll-progress-fill');
    }
    
    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        this.progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
}

// Intersection Observer for various animations
class IntersectionAnimator {
    constructor() {
        this.setupObservers();
    }
    
    setupObservers() {
        // Fade in animation
        this.createObserver('.fade-in-on-scroll', 'fade-in');
        
        // Slide up animation
        this.createObserver('.slide-up-on-scroll', 'slide-up');
        
        // Scale animation
        this.createObserver('.scale-on-scroll', 'scale-in');
        
        // Rotate animation
        this.createObserver('.rotate-on-scroll', 'rotate-in');
    }
    
    createObserver(selector, animationClass) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => observer.observe(element));
    }
}

// Initialize animation system
let animationController;
let scrollProgress;
let intersectionAnimator;

// Initialize when DOM is ready
function initializeAnimations() {
    animationController = new AnimationController();
    scrollProgress = new ScrollProgress();
    intersectionAnimator = new IntersectionAnimator();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollTo(target, 1000, 80);
            }
        });
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationController,
        ScrollProgress,
        IntersectionAnimator,
        initializeAnimations
    };
}

// Auto-initialize if not in module environment
if (typeof module === 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnimations);
    } else {
        initializeAnimations();
    }
}