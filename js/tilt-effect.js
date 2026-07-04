// ===== TILTED CARD EFFECT =====
(function() {
    const card = document.getElementById('profileCard');
    if (!card) return;

    let isMobile = window.innerWidth <= 768;

    function updateIsMobile() {
        isMobile = window.innerWidth <= 768;
    }

    window.addEventListener('resize', updateIsMobile);

    card.addEventListener('mousemove', function(e) {
        if (isMobile) return;
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -12;
        const rotateY = (x - centerX) / centerX * 12;
        
        this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function() {
        if (isMobile) return;
        this.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    // Touch support for mobile
    card.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;
        
        this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('touchend', function() {
        this.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
})();