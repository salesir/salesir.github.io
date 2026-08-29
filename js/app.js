/* ============================================
   Main Application Entry Point
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    /* 1. Particle background */
    new ParticleNetwork('particles');

    /* 2. Project codex */
    window.codex = new ProjectCodex();

    /* Load initial projects if available in portfolioProjects */
    if (typeof portfolioProjects !== 'undefined' && Array.isArray(portfolioProjects)) {
        portfolioProjects.forEach(p => window.codex.addProject(p));
    }

    /* 3. Hero CTA: Open first project and scroll to codex panel */
    _initHeroCTA();

    /* 4. Typewriter hero title */
    _initTypewriter();

    /* 5. Sticky-nav background on scroll */
    _initNavScroll();

    /* 6. Compact navigation on small screens */
    _initNavMenu();

    /* 7. Scroll-triggered reveals */
    _initScrollReveal();
});

/* ============================================
   Hero CTA Interceptor
   ============================================ */

function _initHeroCTA() {
    const viewWorkBtn = document.querySelector('[data-open-first-project]');
    if (!viewWorkBtn) return;

    viewWorkBtn.addEventListener('click', (event) => {
        event.preventDefault();

        /* 1. Select the first project (the panel is already open by default,
              but the CTA should always land on the lead case study). */
        if (window.codex && typeof portfolioProjects !== 'undefined' && portfolioProjects.length > 0) {
            window.codex.openProject(portfolioProjects[0].id);
        }

        /* 2. Scroll to the codex panel itself, not the section heading. */
        const targetPanel = document.getElementById('projectCodex') || document.getElementById('projectBook');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetPanel?.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start',
        });

        /* 3. Move focus into the case study once the scroll has settled. */
        window.setTimeout(() => window.codex?.focusActiveTitle(), 350);
    });
}

/* ============================================
   Typewriter
   ============================================ */

function _initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Software Engineer',
        'Desktop & Systems Developer',
        'AI Workflow Builder',
        'Interactive Systems Creator',
    ];

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        el.textContent = phrases[0];
        return;
    }

    let phraseIdx  = 0;
    let charIdx    = 0;
    let deleting   = false;

    function tick() {
        const phrase = phrases[phraseIdx];
        let delay;

        if (deleting) {
            charIdx--;
            el.textContent = phrase.substring(0, charIdx);
            delay = 35;
        } else {
            charIdx++;
            el.textContent = phrase.substring(0, charIdx);
            delay = 75;
        }

        if (!deleting && charIdx === phrase.length) {
            delay    = 2200;   // pause at full phrase
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting  = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay     = 450;   // pause before next phrase
        }

        setTimeout(tick, delay);
    }

    /* Start after the intro animations settle */
    setTimeout(tick, 1500);
}

/* ============================================
   Navigation Scroll Effect
   ============================================ */

function _initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 50);
    }, { passive: true });
}

/* ============================================
   Small-Screen Navigation
   ============================================ */

function _initNavMenu() {
    const toggle = document.getElementById('navMenuToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    const close = () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') close();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 640) close();
    }, { passive: true });
}

/* ============================================
   Scroll Reveal (IntersectionObserver)
   ============================================ */

function _initScrollReveal() {
    const selectors = [
        '.projects__header',
        '.codex__index',
        '.codex__panel',
        '.resume__block',
    ];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.closest('.hero')) el.classList.add('reveal');
        });
    });

    /* Stagger the resume grid children */
    document.querySelectorAll('.resume__grid').forEach(g =>
        g.classList.add('reveal-stagger'));

    const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach(el => el.classList.remove('reveal', 'reveal-stagger'));
        return;
    }

    /* Reveal, then retire the classes entirely.
       The hidden state lives in CSS, so an element that never finishes its
       transition would stay at opacity 0 forever — which is exactly what
       happens when the document timeline is throttled (an occluded or
       background tab). Stripping the classes afterwards returns the element
       to its natural, fully visible styling, so the effect is decorative
       rather than load-bearing. */
    const retire = (el, delay) => window.setTimeout(() => {
        el.classList.remove('reveal', 'reveal-stagger', 'is-visible');
    }, delay);

    const observer = new IntersectionObserver(
        (entries, self) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('is-visible');
                self.unobserve(el);
                retire(el, el.classList.contains('reveal-stagger') ? 1500 : 1000);
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    revealTargets.forEach(el => observer.observe(el));

    /* Watchdog on an independent code path.
       IntersectionObserver callbacks are delivered by the rendering pipeline,
       so a tab that is throttled or never composited can leave elements
       observed but never revealed — and the hidden state lives in CSS, so they
       would stay invisible. This scroll/resize check reveals anything that has
       reached the viewport regardless of whether the observer ever ran, and
       unhooks itself once every target is done. */
    let pending = new Set(revealTargets);

    const sweep = () => {
        pending.forEach(el => {
            if (!el.isConnected || !el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
                pending.delete(el);
                return;
            }
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('is-visible');
                retire(el, el.classList.contains('reveal-stagger') ? 1500 : 1000);
                pending.delete(el);
            }
        });

        if (!pending.size) {
            window.removeEventListener('scroll', onSweep);
            window.removeEventListener('resize', onSweep);
        }
    };

    let sweepScheduled = false;
    const onSweep = () => {
        if (sweepScheduled) return;
        sweepScheduled = true;
        window.setTimeout(() => { sweepScheduled = false; sweep(); }, 250);
    };

    window.addEventListener('scroll', onSweep, { passive: true });
    window.addEventListener('resize', onSweep, { passive: true });
}
