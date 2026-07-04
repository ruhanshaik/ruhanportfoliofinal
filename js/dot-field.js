// ===== DOT FIELD EFFECT =====
(function() {
    const canvas = document.getElementById('dotCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let animationId = null;

    // Configuration
    const config = {
        dotRadius: 1.5,
        dotSpacing: 16,
        cursorRadius: 300,
        bulgeStrength: 40,
    };

    function resize() {
        const container = canvas.parentElement;
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
        generateDots();
    }

    function generateDots() {
        dots = [];
        const step = config.dotRadius + config.dotSpacing;
        const cols = Math.floor(width / step);
        const rows = Math.floor(height / step);
        const padX = (width % step) / 2;
        const padY = (height % step) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                dots.push({
                    x: padX + col * step + step / 2,
                    y: padY + row * step + step / 2,
                    baseX: padX + col * step + step / 2,
                    baseY: padY + row * step + step / 2,
                    vx: 0,
                    vy: 0,
                });
            }
        }
    }

    function updateDots() {
        const cr = config.cursorRadius;
        const crSq = cr * cr;

        for (const dot of dots) {
            const dx = mouseX - dot.baseX;
            const dy = mouseY - dot.baseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < crSq) {
                const dist = Math.sqrt(distSq);
                const t = 1 - dist / cr;
                const push = t * t * config.bulgeStrength;
                const angle = Math.atan2(dy, dx);
                dot.x += (dot.baseX - Math.cos(angle) * push - dot.x) * 0.15;
                dot.y += (dot.baseY - Math.sin(angle) * push - dot.y) * 0.15;
            } else {
                dot.x += (dot.baseX - dot.x) * 0.05;
                dot.y += (dot.baseY - dot.y) * 0.05;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Gradient for dots
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(0, 122, 255, 0.15)');
        grad.addColorStop(0.5, 'rgba(0, 122, 255, 0.08)');
        grad.addColorStop(1, 'rgba(0, 122, 255, 0.04)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        for (const dot of dots) {
            ctx.moveTo(dot.x + config.dotRadius, dot.y);
            ctx.arc(dot.x, dot.y, config.dotRadius, 0, Math.PI * 2);
        }
        ctx.fill();
    }

    function animate() {
        updateDots();
        draw();
        animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    function onMouseLeave() {
        mouseX = -9999;
        mouseY = -9999;
    }

    // Touch support
    function onTouchMove(e) {
        const touch = e.touches[0];
        if (touch) {
            const rect = canvas.getBoundingClientRect();
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        }
    }

    function onTouchEnd() {
        mouseX = -9999;
        mouseY = -9999;
    }

    // Init
    resize();
    animate();

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    // Cleanup
    return function cleanup() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
        canvas.removeEventListener('touchmove', onTouchMove);
        canvas.removeEventListener('touchend', onTouchEnd);
    };
})();