/* ============================================================
   MAIN — Entry point. Inicializa todos os módulos.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createParticles('particlesTreatments');
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initParallax();
    initCarousel();
    initTreatmentsCarousel();
    initTestimonialsCarousel();
    console.log('✅ Bravo Odontologia — Landing page initialized');
});
