// ===== DOM Elements =====
const loader = document.querySelector('.loader');
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== Loader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
        initAnimations();
    }, 2500);
});


// ===== Navigation =====
// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'visible';
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'visible';
    });
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===== Initialize AOS =====
AOS.init({
    duration: 500,
    easing: 'ease-out',
    once: true,
    offset: 50,
    disable: 'mobile'
});

// ===== GSAP Animations =====
function initAnimations() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero animations - simplified for performance
    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2
    });
    
    gsap.from('.hero-title .title-line', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4
    });
    
    gsap.from('.hero-title .title-highlight', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5
    });
    
    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-row');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Tools level animation
    const toolsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.tool-level').forEach(bar => {
                    bar.style.width = bar.style.getPropertyValue('--level');
                });
            }
        });
    }, { threshold: 0.5 });
    
    const toolsGrid = document.querySelector('.tools-grid');
    if (toolsGrid) {
        // Reset widths initially
        toolsGrid.querySelectorAll('.tool-level').forEach(bar => {
            const level = bar.style.getPropertyValue('--level');
            bar.style.setProperty('--level', level);
            bar.style.width = '0%';
        });
        toolsObserver.observe(toolsGrid);
    }
}

// ===== Counter Animation =====
function animateCounters() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ===== Charts Configuration =====
const chartColors = {
    primary: '#ff9500',
    secondary: '#ff6b00',
    tertiary: '#ff3b30',
    cyan: '#ffb340',
    pink: '#ff6b00',
    gradient: (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 149, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 149, 0, 0.0)');
        return gradient;
    }
};

// Skills Radar Chart
const skillsRadarCtx = document.getElementById('skillsRadar');
if (skillsRadarCtx) {
    new Chart(skillsRadarCtx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['Machine Learning', 'Data Analysis', 'Python', 'Statistics', 'Visualization', 'Deep Learning'],
            datasets: [{
                label: 'Skill Level',
                data: [85, 90, 92, 80, 88, 75],
                backgroundColor: 'rgba(255, 149, 0, 0.2)',
                borderColor: chartColors.primary,
                borderWidth: 2,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: chartColors.primary,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: '#6e6e73',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.08)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.08)'
                    },
                    pointLabels: {
                        color: '#6e6e73',
                        font: {
                            size: 11,
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Languages Chart
const languagesChartCtx = document.getElementById('languagesChart');
if (languagesChartCtx) {
    new Chart(languagesChartCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Python', 'SQL', 'R', 'Java', 'Others'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.tertiary,
                    chartColors.cyan,
                    '#1d1d1f'
                ],
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#6e6e73',
                        padding: 15,
                        font: {
                            size: 11,
                            family: "'Inter', sans-serif"
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });
}

// Visualization Skills Chart
const progressChartCtx = document.getElementById('progressChart');
if (progressChartCtx) {
    const ctx = progressChartCtx.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Power BI', 'Tableau', 'Data Storytelling', 'Dashboard Design', 'ETL/Power Query'],
            datasets: [{
                label: 'Skill Level',
                data: [90, 80, 88, 85, 82],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.tertiary,
                    chartColors.cyan,
                    '#1d1d1f'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6e6e73',
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6e6e73',
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// ===== Magnetic Button Effect - DISABLED FOR PERFORMANCE =====
// Simple hover effect handled by CSS instead

// ===== Tilt Effect for Project Cards - DISABLED FOR PERFORMANCE =====
// Simple hover effect handled by CSS instead

// ===== Text Reveal Animation =====
function revealText(element) {
    const text = element.textContent;
    element.textContent = '';
    
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.display = 'inline-block';
        span.style.transition = `all 0.3s ease ${i * 0.03}s`;
        element.appendChild(span);
        
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, 100);
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    animationObserver.observe(el);
});

// ===== Typing Effect for Code Block =====
function typeCode() {
    const codeBlock = document.querySelector('.code-block code');
    if (!codeBlock) return;
    
    const originalHTML = codeBlock.innerHTML;
    codeBlock.innerHTML = '';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < originalHTML.length) {
            codeBlock.innerHTML = originalHTML.substring(0, i + 1);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 30);
}

// Initialize typing effect after loader
setTimeout(typeCode, 2600);

// ===== Parallax Scroll Effect - DISABLED FOR PERFORMANCE =====
// Smooth scrolling without parallax for better performance

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
    
    // Add confetti effect
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#ff9500', '#ff6b00', '#ff3b30', '#ffb340', '#1d1d1f'][Math.floor(Math.random() * 5)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: 50%;
        z-index: 10000;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
    `;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== Performance: Debounce scroll events =====
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader if page loaded from cache
    if (document.readyState === 'complete') {
        loader.classList.add('hidden');
    }
});

console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%c🚀 Want to connect? Check out my GitHub!', 'font-size: 14px; color: #a0a0b0;');

