// ===== MAIN APPLICATION =====
document.addEventListener('DOMContentLoaded', function() {
    // ===== DOCK ITEM ACTIVE STATE =====
    const dockItems = document.querySelectorAll('.dock-item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    dockItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            item.classList.add('active');
        } else if (currentPage.startsWith('project') && href === 'index.html#projects') {
            if (item.getAttribute('href') === 'index.html#projects') {
                item.classList.add('active');
            }
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===== IMAGE LAZY LOADING =====
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => observer.observe(img));
    }

    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any modals or overlays
        }
    });

    // ===== LOADING COMPLETE =====
    console.log('🚀 Portfolio loaded successfully!');
});