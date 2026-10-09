const SPARKLE_CONFIG = {
    intensity: 2,
    size: { min: 0.5, max: 1.5 },
    spread: { min: -4, max: 4 },
    gravity: 0.15,
    decay: { min: 0.015, max: 0.025 }
};

function createSparkle(x, y) {
    return {
        x: x,
        y: y,
        size: Math.random() * (SPARKLE_CONFIG.size.max - SPARKLE_CONFIG.size.min) + SPARKLE_CONFIG.size.min,
        speedX: Math.random() * (SPARKLE_CONFIG.spread.max - SPARKLE_CONFIG.spread.min) + SPARKLE_CONFIG.spread.min,
        speedY: Math.random() * (SPARKLE_CONFIG.spread.max - SPARKLE_CONFIG.spread.min) + SPARKLE_CONFIG.spread.min,
        gravity: SPARKLE_CONFIG.gravity,
        opacity: 1,
        decay: Math.random() * (SPARKLE_CONFIG.decay.max - SPARKLE_CONFIG.decay.min) + SPARKLE_CONFIG.decay.min,
        color: 'rgba(251, 191, 36, 1)'
    };
}

function updateSparkle(sparkle) {
    sparkle.x += sparkle.speedX;
    sparkle.y += sparkle.speedY;
    sparkle.speedY += sparkle.gravity;
    sparkle.opacity -= sparkle.decay;
    sparkle.color = 'rgba(251, 191, 36, ' + sparkle.opacity + ')';
}

function drawSparkle(ctx, sparkle) {
    ctx.save();
    ctx.globalAlpha = sparkle.opacity;
    ctx.fillStyle = sparkle.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = sparkle.color;
    ctx.beginPath();
    ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function isSparkleAlive(sparkle) {
    return sparkle.opacity > 0;
}

function initSparkleEffect(element) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sparkles = [];
    let isActive = false;
    let localConfig = {
        intensity: SPARKLE_CONFIG.intensity,
        size: { ...SPARKLE_CONFIG.size },
        spread: { ...SPARKLE_CONFIG.spread },
        gravity: SPARKLE_CONFIG.gravity,
        decay: { ...SPARKLE_CONFIG.decay },
        scale: 1,
        speedScale: 1,
        lifespanScale: 1
    };

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';

    document.body.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    element.addEventListener('mouseenter', function() {
        isActive = true;
    });

    element.addEventListener('mouseleave', function() {
        isActive = false;
    });

    element.addEventListener('mousemove', function(e) {
        if (!isActive) return;

        for (let i = 0; i < localConfig.intensity; i++) {
            const sparkle = createSparkle(e.clientX, e.clientY);
            sparkle.size *= localConfig.scale;
            sparkle.speedX *= localConfig.speedScale;
            sparkle.speedY *= localConfig.speedScale;
            sparkle.decay /= localConfig.lifespanScale;
            sparkles.push(sparkle);
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = sparkles.length - 1; i >= 0; i--) {
            const sparkle = sparkles[i];
            updateSparkle(sparkle);
            drawSparkle(ctx, sparkle);

            if (!isSparkleAlive(sparkle)) {
                sparkles.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    return {
        setConfig(multiplier) {
            localConfig = {
                intensity: SPARKLE_CONFIG.intensity * multiplier,
                size: {
                    min: SPARKLE_CONFIG.size.min * multiplier,
                    max: SPARKLE_CONFIG.size.max * multiplier
                },
                spread: {
                    min: SPARKLE_CONFIG.spread.min * multiplier,
                    max: SPARKLE_CONFIG.spread.max * multiplier
                },
                gravity: SPARKLE_CONFIG.gravity * multiplier,
                decay: {
                    min: SPARKLE_CONFIG.decay.min / multiplier,
                    max: SPARKLE_CONFIG.decay.max / multiplier
                },
                scale: multiplier,
                speedScale: multiplier,
                lifespanScale: multiplier
            };
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const logoLink = document.getElementById('logo-link');
    const heroLogo = document.getElementById('hero-logo');
    if (logoLink) {
        initSparkleEffect(logoLink);
    }
    if (heroLogo) {
        const effect = initSparkleEffect(heroLogo);
        effect.setConfig(2);
    }
});
