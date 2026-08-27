/**
 * Core Motion Stack Engine
 * - Global Lenis Smooth Scroll
 * - Synchronized GSAP Ticker & ScrollTrigger Updates (Stutter-Free Inertia Scroll)
 * - Kinetic Reveal Typography, Fade-Ups & Magnetic Elements
 */

class MotionStack {
  constructor() {
    this.lenis = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // 1. Initialize Lenis Smooth Scroll
    if (window.Lenis) {
      this.lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // High-end exponential ease
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.8,
        infinite: false
      });

      // 2. Synchronize Lenis with GSAP ScrollTrigger & Ticker
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);

        // Tell ScrollTrigger to use Lenis's scroll position
        this.lenis.on('scroll', window.ScrollTrigger.update);

        // Hook Lenis into GSAP's requestAnimationFrame ticker
        window.gsap.ticker.add((time) => {
          this.lenis.raf(time * 1000);
        });

        // Turn off lag smoothing for exact 1:1 frame alignment
        window.gsap.ticker.lagSmoothing(0);
      } else {
        // Fallback standalone RAF
        const raf = (time) => {
          this.lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    }

    // 3. Initialize Motion Helpers
    this.initScrollReveals();
    this.initMagneticButtons();
    this.isInitialized = true;
  }

  initScrollReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // A. Fade Up Elements
    const fadeUps = document.querySelectorAll('[data-reveal="fade-up"], .reveal-fade-up');
    fadeUps.forEach((el) => {
      window.gsap.fromTo(el, 
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // B. Kinetic Text Split Reveal
    const kineticTexts = document.querySelectorAll('[data-reveal="kinetic"], .reveal-kinetic');
    kineticTexts.forEach((el) => {
      window.gsap.fromTo(el,
        { opacity: 0, y: 40, skewY: 2 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 1.0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // C. Staggered Card Lists
    const staggerContainers = document.querySelectorAll('[data-reveal="stagger"], .reveal-stagger');
    staggerContainers.forEach((container) => {
      const items = container.children;
      if (!items.length) return;

      window.gsap.fromTo(items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  initMagneticButtons() {
    const magnetics = document.querySelectorAll('[data-magnetic], .btn-magnetic');
    magnetics.forEach((btn) => {
      let isHovered = false;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        if (window.gsap) {
          window.gsap.to(btn, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (window.gsap) {
          window.gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      });
    });
  }

  refresh() {
    if (this.lenis) this.lenis.resize();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.motionStack = new MotionStack();
  if (window.initIcons) window.initIcons();
});
