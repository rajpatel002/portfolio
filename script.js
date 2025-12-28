// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

// Remove hash to prevent Android auto-scroll
if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
}


// 🔒 Prevent Android auto-scroll on load
window.addEventListener("load", () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
});


// 🚫 Android auto-scroll FIX — remove URL hash immediately
if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
}

// Lock scroll position on load (Android-safe)
window.addEventListener("load", () => {
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });
});


// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active navigation link on scroll - Optimized with throttling
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

// Throttle function for better performance
function throttle(func, limit) {
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

function updateActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        // Check if section is in viewport (with offset for better UX)
        if (scrollY >= sectionTop - 250 && scrollY < sectionTop + sectionHeight - 100) {
            current = sectionId;
        }
    });

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.remove('active');
        
        // Check if this link matches the current section
        if (href === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// Throttled scroll handler (runs max once per 100ms)
const throttledUpdateNav = throttle(updateActiveNav, 100);

// Use passive event listener for better scroll performance
window.addEventListener('scroll', throttledUpdateNav, { passive: true });
window.addEventListener('load', updateActiveNav);

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// HERO STATS ANIMATION
// ============================================

function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateStat = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target;
            }
        };
        
        updateStat();
    });
}

// Trigger stats animation when hero section is in view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('#hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ============================================
// SECTION REVEAL ANIMATIONS
// ============================================

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Add fade-in class to sections
const sectionsToReveal = document.querySelectorAll('section');
sectionsToReveal.forEach((section, index) => {
    if (section.id !== 'hero') {
        section.classList.add('fade-in');
        revealObserver.observe(section);
    }
});

// Animate skill items individually - Consolidated observer
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
});

// Single observer for all skill items
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

skillItems.forEach(item => skillObserver.observe(item));

// ============================================
// SKILL RPM METER ANIMATION
// ============================================

function animateRPMBars() {
    const rpmBars = document.querySelectorAll('.rpm-bar');
    
    rpmBars.forEach(bar => {
        const skillLevel = parseInt(bar.getAttribute('data-skill'));
        const fill = bar.querySelector('.rpm-fill');
        const value = bar.parentElement.querySelector('.rpm-value');
        
        const rpmObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fill.style.width = `${skillLevel}%`;
                    if (value) {
                        let current = 0;
                        const increment = skillLevel / 30;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= skillLevel) {
                                current = skillLevel;
                                clearInterval(timer);
                            }
                            value.textContent = `${Math.floor(current)}%`;
                        }, 50);
                    }
                    rpmObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        rpmObserver.observe(bar);
    });
}

// Initialize RPM bar animations
animateRPMBars();

// ============================================
// PROJECT CAR CARD INTERACTIONS
// ============================================

const carHoodButtons = document.querySelectorAll('.car-hood-btn');
carHoodButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const githubUrl = this.getAttribute('data-github');
        
        // Open GitHub repository in new tab if URL is valid
        if (githubUrl && githubUrl.startsWith('https://github.com/')) {
            window.open(githubUrl, '_blank', 'noopener,noreferrer');
        } else {
            // If GitHub URL is not set or invalid, show alert
            console.log('GitHub URL not configured. Please update the data-github attribute with your repository URL.');
            alert('GitHub repository link will be available soon!');
        }
    });
});

// Animate car cards on scroll - Consolidated observer
const carCards = document.querySelectorAll('.car-card');
carCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
});

// Single observer for all car cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

carCards.forEach(card => cardObserver.observe(card));

// ============================================
// TRACK ITEM ANIMATIONS - Consolidated observer
// ============================================

const trackItems = document.querySelectorAll('.track-item');
trackItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.8s ease ${index * 0.3}s, transform 0.8s ease ${index * 0.3}s`;
});

// Single observer for all track items
const trackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            trackObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

trackItems.forEach(item => trackObserver.observe(item));

// ============================================
// CHECKPOINT ANIMATIONS - Consolidated observer
// ============================================

const checkpointItems = document.querySelectorAll('.checkpoint-item');
checkpointItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.8s ease ${index * 0.3}s, transform 0.8s ease ${index * 0.3}s`;
});

// Single observer for all checkpoint items
const checkpointObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            checkpointObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

checkpointItems.forEach(item => checkpointObserver.observe(item));

// ============================================
// CONSOLE CONTACT ANIMATION
// ============================================

const consolePanel = document.querySelector('.console-panel');
if (consolePanel) {
    consolePanel.style.opacity = '0';
    consolePanel.style.transform = 'scale(0.9)';
    consolePanel.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    const consoleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                consoleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    consoleObserver.observe(consolePanel);
}

// ============================================
// PARALLAX EFFECT FOR HERO - Optimized
// ============================================

const heroBackground = document.querySelector('.hero-background');
if (heroBackground) {
    // Use requestAnimationFrame for smoother animations
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        ticking = false;
    }
    
    const throttledParallax = throttle(() => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledParallax, { passive: true });
}

// ============================================
// CODE LINES - Optimized (deferred, uses DocumentFragment)
// ============================================

// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback, options) {
        const timeout = options?.timeout || 0;
        const start = Date.now();
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
            });
        }, 1);
    };
}

function createCodeLines() {
    const codeLinesContainer = document.querySelector('.code-lines');
    if (!codeLinesContainer) return;
    
    const codeSnippets = [
        'SELECT * FROM performance WHERE efficiency > 100;',
        'function optimizeDatabase() { return speed; }',
        'const backend = { power: "maximum", reliability: true };',
        'mysql_query("SELECT * FROM engines WHERE tuned = 1");',
        'class DatabaseEngine { constructor() { this.rpm = 10000; } }'
    ];
    
    // Use DocumentFragment for better performance (single DOM update)
    const fragment = document.createDocumentFragment();
    
    codeSnippets.forEach((snippet, index) => {
        const codeElement = document.createElement('div');
        codeElement.textContent = snippet;
        // Use CSS classes instead of inline styles
        codeElement.className = 'code-snippet';
        codeElement.setAttribute('data-index', index);
        fragment.appendChild(codeElement);
    });
    
    codeLinesContainer.appendChild(fragment);
}

// Defer code lines creation until after initial render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        requestIdleCallback(createCodeLines, { timeout: 2000 });
    });
} else {
    requestIdleCallback(createCodeLines, { timeout: 2000 });
}

// ============================================
// NAVBAR SCROLL EFFECT - Optimized
// ============================================

const navbar = document.querySelector('.navbar');
if (navbar) {
    // Use CSS classes instead of inline styles for better performance
    const updateNavbar = throttle(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 50);
    
    window.addEventListener('scroll', updateNavbar, { passive: true });
}

// ============================================
// RESUME DOWNLOAD FUNCTIONALITY
// ============================================

const resumeButton = document.querySelector('a[href="#contact"]');
if (resumeButton && resumeButton.textContent.includes('Resume')) {
    resumeButton.addEventListener('click', (e) => {
        // In a real implementation, this would trigger a download
        // For now, it will scroll to contact section
        console.log('Resume download would be triggered here');
    });
}

// ============================================
// INITIALIZATION - Optimized
// ============================================

// Use DOMContentLoaded for faster initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Set initial states
    updateActiveNav();
    
    // Use requestAnimationFrame for smooth fade-in
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
}
// === GEAR MECHANICAL ROTATION (REALISTIC) ===

// wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const driver = document.querySelector(".gear-driver");
    const driven = document.querySelector(".gear-driven");

    if (!driver || !driven) {
        console.error("Gear elements not found");
        return;
    }

    let angle = 0;
    const ratio = 12 / 10; // driver teeth / driven teeth

    function animateGears() {
        angle += 2.2; // rotation speed (adjust if needed)

        driver.setAttribute(
            "transform",
            `translate(150 99) rotate(${angle})`
        );

        driven.setAttribute(
            "transform",
            `translate(295 100) rotate(${-angle * ratio})`
        );

        requestAnimationFrame(animateGears);
    }

    animateGears();
});


// ✅ Android-safe manual scrolling (no hash)
document.querySelectorAll("[data-scroll]").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        const targetId = link.getAttribute("data-scroll");
        const target = document.getElementById(targetId);

        if (!target) return;

        const yOffset = -80; // navbar height
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth"
        });
    });
});
