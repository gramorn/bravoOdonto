/* ============================================================
   CAROUSELS — initCarousel, initTreatmentsCarousel, initTestimonialsCarousel
   ============================================================ */

// === Before/After Carousel ===
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const progressBar = document.getElementById('carouselProgressBar');
    const counterEl = document.getElementById('carouselCounter');
    const pauseBtn = document.getElementById('carouselPauseBtn');
    if (!track) return;

    const totalSlides = document.querySelectorAll('.carousel-slide').length;
    let currentIndex = 0;
    let autoSlide;
    let isPaused = false;
    const INTERVAL = 5000;
    let dots;

    // Dynamically create dots based on slide count
    function createDots() {
        const dotsContainer = document.getElementById('carouselDots');
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        dots = document.querySelectorAll('.carousel-dot');
    }
    createDots();

    function goToSlide(index, restartTimer = true) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
        if (restartTimer) restartProgress();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function restartProgress() {
        if (!progressBar) return;
        progressBar.style.animation = 'none';
        void progressBar.offsetWidth;
        progressBar.style.animation = `progressPause ${INTERVAL}ms linear forwards`;
        if (isPaused) progressBar.classList.add('paused');
        else progressBar.classList.remove('paused');
    }

    function pauseProgress() { if (progressBar) progressBar.classList.add('paused'); }
    function resumeProgress() { if (progressBar) progressBar.classList.remove('paused'); }

    function startAutoSlide() {
        stopAutoSlide();
        if (isPaused) return;
        restartProgress();
        autoSlide = setInterval(() => { if (!isPaused) nextSlide(); }, INTERVAL);
    }

    function stopAutoSlide() { if (autoSlide) clearInterval(autoSlide); }

    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            stopAutoSlide(); pauseProgress();
            if (pauseBtn) {
                pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
                pauseBtn.setAttribute('aria-label', 'Reproduzir');
            }
        } else {
            startAutoSlide(); resumeProgress();
            if (pauseBtn) {
                pauseBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
                pauseBtn.setAttribute('aria-label', 'Pausar');
            }
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => nextSlide());
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);

    document.addEventListener('keydown', (e) => {
        const el = document.querySelector('.carousel-container');
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
            if (e.key === 'ArrowLeft') { prevSlide(); e.preventDefault(); }
            if (e.key === 'ArrowRight') { nextSlide(); e.preventDefault(); }
        }
    });

    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('mouseenter', () => { stopAutoSlide(); pauseProgress(); });
        container.addEventListener('mouseleave', () => { if (!isPaused) startAutoSlide(); });
    }

    let touchStartX = 0, touchEndX = 0;
    if (track) {
        track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; stopAutoSlide(); pauseProgress(); }, { passive: true });
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) { if (diff > 0) nextSlide(); else prevSlide(); }
            else if (!isPaused) startAutoSlide();
        }, { passive: true });
    }
    goToSlide(0);
    startAutoSlide();
}

// === Treatments Carousel ===
function initTreatmentsCarousel() {
    const track = document.getElementById('treatmentsTrack');
    const prevBtn = document.getElementById('treatPrev');
    const nextBtn = document.getElementById('treatNext');
    const dotsContainer = document.getElementById('treatDots');
    if (!track) return;

    const cards = track.querySelectorAll('.treatment-card');
    const total = cards.length;
    let current = 0;
    let direction = 1;

    function isMobile() { return window.innerWidth < 640; }

    function getScrollStep() {
        if (isMobile()) {
            const card = cards[0];
            const style = getComputedStyle(card);
            const marginLeft = parseFloat(style.marginLeft) || 0;
            return card.offsetWidth + marginLeft;
        }
        return cards[0].offsetWidth + 20;
    }

    function getMax() { return Math.max(0, total - (isMobile() ? 1 : 3)); }

    function update() {
        const visible = isMobile() ? 1 : 3;
        const max = getMax();
        if (current > max) current = max;
        const step = getScrollStep();
        track.style.transform = `translateX(-${current * step}px)`;

        const dotCount = isMobile() ? total : Math.max(1, total - visible + 1);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'treat-dot' + (i === current ? ' active' : '');
            dot.addEventListener('click', () => { current = i; update(); });
            dotsContainer.appendChild(dot);
        }
        cards.forEach((c, i) => c.classList.toggle('active-shine', i >= current && i < current + visible));
    }

    function next() {
        const max = getMax();
        current += direction;
        if (current >= max) { current = max; direction = -1; }
        else if (current <= 0) { current = 0; direction = 1; }
        update();
    }
    function prev() { if (current > 0) { current--; update(); } }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    window.addEventListener('resize', update);
    update();

    let auto = setInterval(next, 4000);
    const wrapper = document.querySelector('.treatments-carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(auto));
        wrapper.addEventListener('mouseleave', () => { clearInterval(auto); auto = setInterval(next, 4000); });
    }
}

// === Testimonials Carousel ===
function initTestimonialsCarousel() {
    const track = document.getElementById('testiTrack');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');
    const dotsContainer = document.getElementById('testiDots');
    if (!track) return;

    const slides = track.querySelectorAll('.testi-slide');
    const total = slides.length;
    let current = 0;

    function update() {
        const w = window.innerWidth;
        const visible = w < 500 ? 1 : 2;
        const max = Math.max(0, total - visible);
        if (current > max) current = max;
        const step = slides[0].offsetWidth + 20;
        track.style.transform = `translateX(-${current * step}px)`;

        const dotCount = Math.ceil(total / Math.max(1, visible - 0.5));
        dotsContainer.innerHTML = '';
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'testi-dot';
            dot.addEventListener('click', () => { current = Math.min(i * Math.max(1, Math.floor(visible)), max); update(); });
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.testi-dot');
        const step2 = Math.max(1, visible - 0.5);
        const activeIdx = Math.min(Math.floor(current / step2), dots.length - 1);
        dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
        slides.forEach((s, i) => s.classList.toggle('active-shine', i >= current && i < current + visible));
    }

    function next() { const max = Math.max(0, total - (window.innerWidth < 500 ? 1 : 2)); if (current < max) { current++; update(); } }
    function prev() { if (current > 0) { current--; update(); } }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    window.addEventListener('resize', update);
    update();

    let auto = setInterval(next, 5000);
    const wrap = document.querySelector('.testi-carousel-wrapper');
    if (wrap) {
        wrap.addEventListener('mouseenter', () => clearInterval(auto));
        wrap.addEventListener('mouseleave', () => { clearInterval(auto); auto = setInterval(next, 5000); });
    }
}
