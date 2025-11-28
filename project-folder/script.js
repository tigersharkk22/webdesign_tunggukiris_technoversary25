// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Read More Functionality for Articles
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const articleCard = this.closest('.article-card');
            articleCard.classList.toggle('expanded');
            
            if (articleCard.classList.contains('expanded')) {
                this.textContent = 'Tutup';
            } else {
                this.textContent = 'Baca Selengkapnya';
            }
        });
    });

    // Load Statistics from localStorage
    loadStatistics();

    // Animate numbers on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
});

// Load statistics from localStorage
function loadStatistics() {
    const treesPlanted = localStorage.getItem('treesPlanted') || 0;
    const energySaved = localStorage.getItem('energySaved') || 0;
    const wasteRecycled = localStorage.getItem('wasteRecycled') || 0;

    const treesElement = document.getElementById('trees-planted');
    const energyElement = document.getElementById('energy-saved');
    const wasteElement = document.getElementById('waste-recycled');

    if (treesElement) treesElement.textContent = treesPlanted;
    if (energyElement) energyElement.textContent = energySaved;
    if (wasteElement) wasteElement.textContent = wasteRecycled;
}

// Animate number counting
function animateValue(element) {
    const targetValue = parseInt(element.textContent) || 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(progress * targetValue);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(update);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});