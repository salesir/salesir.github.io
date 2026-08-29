/* ============================================
   Particle Network Background
   ============================================ */

class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.width = 0;
        this.height = 0;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.config = {
            maxParticles: 80,
            minParticles: 30,
            color: [212, 165, 116],
            maxDist: 150,
            speed: 0.3,
            sizeMin: 1,
            sizeMax: 2.5,
            lineOpacity: 0.15,
        };

        this.onResize = () => {
            this._resize();
            this._spawn();
            this._draw();
        };
        this.onPointerMove = event => this._updatePointer(event);
        this.onPointerLeave = () => {
            this.mouse.x = null;
            this.mouse.y = null;
        };
        this.onVisibilityChange = () => {
            if (document.hidden) {
                this._stopLoop();
            } else if (!this.reducedMotion) {
                this._startLoop();
            }
        };

        this._init();
    }

    _init() {
        this._resize();
        this._spawn();
        this._listen();
        this._draw();
        if (!this.reducedMotion) this._startLoop();
    }

    _resize() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.canvas.width = Math.round(this.width * pixelRatio);
        this.canvas.height = Math.round(this.height * pixelRatio);
        this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    _spawn() {
        this.particles = [];
        const { speed, sizeMin, sizeMax } = this.config;
        const count = this._particleCount();

        for (let index = 0; index < count; index++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                size: Math.random() * (sizeMax - sizeMin) + sizeMin,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    _particleCount() {
        const target = Math.round((this.width * this.height) / 18000);
        return Math.max(this.config.minParticles, Math.min(this.config.maxParticles, target));
    }

    _listen() {
        window.addEventListener('resize', this.onResize, { passive: true });
        document.addEventListener('visibilitychange', this.onVisibilityChange);

        if (!this.reducedMotion) {
            this.canvas.addEventListener('pointermove', this.onPointerMove, { passive: true });
            this.canvas.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
        }
    }

    _updatePointer(event) {
        const rect = this.canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        this.mouse.x = (event.clientX - rect.left) * (this.width / rect.width);
        this.mouse.y = (event.clientY - rect.top) * (this.height / rect.height);
    }

    _startLoop() {
        if (this.animationId !== null || document.hidden) return;

        const render = () => {
            this.animationId = null;
            this._draw();
            if (!document.hidden) this.animationId = requestAnimationFrame(render);
        };

        this.animationId = requestAnimationFrame(render);
    }

    _stopLoop() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    _draw() {
        const { ctx, particles, mouse, config } = this;
        ctx.clearRect(0, 0, this.width, this.height);

        for (let index = 0; index < particles.length; index++) {
            const particle = particles[index];

            if (!this.reducedMotion) this._moveParticle(particle, mouse, config);

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = this._color(particle.opacity);
            ctx.fill();

            for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex++) {
                const nextParticle = particles[nextIndex];
                const dx = particle.x - nextParticle.x;
                const dy = particle.y - nextParticle.y;
                const distance = Math.hypot(dx, dy);

                if (distance < config.maxDist) {
                    const alpha = (1 - distance / config.maxDist) * config.lineOpacity;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(nextParticle.x, nextParticle.y);
                    ctx.strokeStyle = this._color(alpha);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    _moveParticle(particle, mouse, config) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = this.width;
        if (particle.x > this.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.height;
        if (particle.y > this.height) particle.y = 0;

        if (mouse.x === null) return;

        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0.001 && distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            particle.x += (dx / distance) * force * 0.5;
            particle.y += (dy / distance) * force * 0.5;
        }
    }

    _color(alpha) {
        const [red, green, blue] = this.config.color;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    destroy() {
        this._stopLoop();
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        this.canvas.removeEventListener('pointermove', this.onPointerMove);
        this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    }
}
