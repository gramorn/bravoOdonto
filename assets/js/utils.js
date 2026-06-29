/* ============================================================
   UTILS — WhatsApp, Smooth Scroll, Counters, Particles, Parallax
   ============================================================ */

// === WhatsApp ===
function openWhatsApp(msg, phone) {
    const tel = phone || '5513996253681';
    const text = msg || 'Olá! Gostaria de agendar uma avaliação.';
    const message = encodeURIComponent(text);
    window.open(`https://wa.me/${tel}?text=${message}`, '_blank');
}

// === Particles ===
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['rgba(32,62,67,0.6)', 'rgba(32,62,67,0.4)', 'rgba(255,255,255,0.2)'];
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 3 + 1;
        p.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${Math.random()*20+10}s;animation-delay:${Math.random()*20}s`;
        container.appendChild(p);
    }
}

// === Scroll Animations ===
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up').forEach(el => observer.observe(el));
}

// === Counters ===
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let current = 0;
                const increment = Math.max(1, Math.floor(target / 60));
                const stepTime = Math.floor(1500 / (target / increment));
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) { current = target; clearInterval(timer); }
                    entry.target.textContent = current;
                }, stepTime);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

// === Smooth Scroll ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// === Parallax ===
function initParallax() {
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (!heroImage) return;
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        if (scrollY < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;
            heroImage.style.opacity = Math.max(0, 1 - scrollY / 600);
        }
    }, { passive: true });
}
