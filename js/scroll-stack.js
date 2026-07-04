// ===== SCROLL STACK EFFECT (Mobile Only) =====
(function() {
    const wrapper = document.getElementById('scrollStackWrapper');
    if (!wrapper) return;

    const container = document.getElementById('scrollStackContainer');
    const track = document.getElementById('scrollStackTrack');
    const items = track.querySelectorAll('.scroll-stack-item');
    const spacer = track.querySelector('.stack-spacer');

    let isMobile = window.innerWidth <= 768;
    let isAnimating = false;
    let lastScrollY = 0;
    let rafId = null;

    // Item heights and positions
    let itemHeights = [];
    let totalHeight = 0;
    let itemPositions = [];

    function updateIsMobile() {
        isMobile = window.innerWidth <= 768;
        if (isMobile) {
            initStack();
        } else {
            resetStack();
        }
    }

    function calculateLayout() {
        const containerRect = container.getBoundingClientRect();
        const containerHeight = containerRect.height || window.innerHeight;
        const itemCount = items.length;

        itemHeights = [];
        itemPositions = [];
        let cumulativeHeight = 0;

        items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const height = rect.height || 300;
            itemHeights.push(height);
            itemPositions.push(cumulativeHeight);
            cumulativeHeight += height - 40; // gap between items
        });

        totalHeight = cumulativeHeight + (spacer ? spacer.offsetHeight || 200 : 200);
        track.style.minHeight = totalHeight + 'px';
    }

    function initStack() {
        if (!isMobile) return;

        // Reset all items
        items.forEach((item, index) => {
            item.style.position = 'sticky';
            item.style.top = '20px';
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
            item.style.zIndex = items.length - index;
            item.style.marginBottom = '16px';
            item.style.willChange = 'transform, opacity';
        });

        calculateLayout();

        // Apply initial transform based on scroll
        updateStack();
    }

    function resetStack() {
        items.forEach((item) => {
            item.style.position = 'relative';
            item.style.top = '0';
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
            item.style.zIndex = '1';
            item.style.marginBottom = '16px';
            item.style.willChange = 'auto';
        });
        track.style.minHeight = 'auto';
    }

    function updateStack() {
        if (!isMobile || isAnimating) return;

        const scrollY = container.scrollTop;
        const containerHeight = container.clientHeight || window.innerHeight;

        // Calculate progress for each item
        items.forEach((item, index) => {
            const itemHeight = itemHeights[index] || 300;
            const startPos = itemPositions[index] || 0;

            // When this item should start stacking
            const stackStart = startPos;
            const stackEnd = startPos + itemHeight - 100;

            // Progress through the stack
            let progress = 0;
            if (scrollY > stackStart) {
                progress = Math.min(1, (scrollY - stackStart) / (itemHeight));
            }

            // Scale: from 1 to 0.85
            const scale = 1 - (1 - 0.85) * progress;
            // Opacity: from 1 to 0.7
            const opacity = 1 - 0.3 * progress;
            // Y offset: slight upward movement
            const translateY = -progress * 20;

            // Apply transforms
            item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            item.style.opacity = opacity;

            // Z-index: higher for items on top
            const zIndex = items.length - index + Math.floor(progress * 10);
            item.style.zIndex = zIndex;

            // Border radius subtle change
            const radius = 18 - progress * 6;
            item.style.borderRadius = Math.max(12, radius) + 'px';
        });

        lastScrollY = scrollY;
    }

    // Throttled scroll handler
    function handleScroll() {
        if (!isMobile) return;
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
            updateStack();
            rafId = null;
        });
    }

    // Resize handler
    function handleResize() {
        updateIsMobile();
        if (isMobile) {
            setTimeout(() => {
                calculateLayout();
                updateStack();
            }, 100);
        }
    }

    // Touch end - snap to nearest item
    function handleTouchEnd() {
        if (!isMobile) return;
        // Smooth snap to nearest item
        const scrollY = container.scrollTop;
        let nearestIndex = 0;
        let nearestDist = Infinity;

        itemPositions.forEach((pos, index) => {
            const dist = Math.abs(scrollY - pos);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestIndex = index;
            }
        });

        // Snap to nearest item position
        const targetPos = itemPositions[nearestIndex] || 0;
        container.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });
    }

    // Event listeners
    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial setup
    setTimeout(() => {
        updateIsMobile();
        if (isMobile) {
            calculateLayout();
            updateStack();
        }
    }, 200);

    // Also handle on load
    window.addEventListener('load', function() {
        setTimeout(() => {
            updateIsMobile();
            if (isMobile) {
                calculateLayout();
                updateStack();
            }
        }, 300);
    });

    // Cleanup
    return function cleanup() {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);
    };
})();