/**
 * FUTURE THREE® Editorial Scroll Interactions
 * Live Seconds Clock, GSAP ScrollTriggers & Parallax Watermarks
 */

(function () {
  'use strict';

  function initFutureThreeScroll() {
    // 1. GSAP ScrollTrigger Motion

    // 2. GSAP ScrollTrigger Motion
    if (window.gsap && window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) { return; }

      // Intro text reveal
      const introStatement = document.querySelector('.f3-intro-statement');
      if (introStatement) {
        window.gsap.from(
          introStatement,
          {
            opacity: 0,
            y: 25,
            duration: 0.85,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: '.f3-section-intro',
              start: 'top 90%',
              once: true
            }
          }
        );
      }

      // Parallax on giant watermark number 25
      const watermarkNum = document.querySelector('.f3-watermark-number');
      const watermarkWrap = document.querySelector('.f3-card-03-overlap-wrap');
      if (watermarkNum && watermarkWrap) {
        window.gsap.fromTo(
          watermarkNum,
          { y: 40, opacity: 0.5 },
          {
            y: -40,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: watermarkWrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      // Smooth organic reveal for project cards (immediateRender: false ensures elements are never blank)
      const card01 = document.querySelector('.f3-project-card-01');
      const card02 = document.querySelector('.f3-project-card-02');
      const card03 = document.querySelector('.f3-project-card-03');

      if (card01) {
        window.gsap.from(
          card01,
          {
            opacity: 0,
            y: 25,
            duration: 0.85,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card01,
              start: 'top 90%',
              once: true
            }
          }
        );
      }

      if (card02) {
        window.gsap.from(
          card02,
          {
            opacity: 0,
            y: 25,
            duration: 0.85,
            delay: 0.1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card02,
              start: 'top 90%',
              once: true
            }
          }
        );
      }

      if (card03) {
        window.gsap.from(
          card03,
          {
            opacity: 0,
            y: 25,
            duration: 0.85,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card03,
              start: 'top 92%',
              once: true
            }
          }
        );
      }

      // Staggered reveal for service rows
      const serviceRows = document.querySelectorAll('.f3-service-row');
      if (serviceRows.length > 0) {
        window.gsap.fromTo(
          serviceRows,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.f3-services-list',
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Kinetic scale for giant billboard
      const billboardText = document.querySelector('.f3-billboard-text');
      if (billboardText) {
        window.gsap.fromTo(
          billboardText,
          { scale: 0.94, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.f3-section-billboard',
              start: 'top 90%',
              end: 'bottom 40%',
              scrub: 1
            }
          }
        );
      }
    }

    // 3. Language Selector Button Toggle
    const langSelector = document.getElementById('hero-lang-selector');
    if (langSelector) {
      const langBtns = langSelector.querySelectorAll('.hero-lang-btn');
      langBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          langBtns.forEach((b) => b.classList.remove('is-active', 'active'));
          btn.classList.add('is-active');
          const chosenLang = btn.getAttribute('data-lang') || 'en';
          window.__CURRENT_LANG = chosenLang;
          try {
            localStorage.setItem('site_lang', chosenLang);
          } catch (err) {}
        });
      });
    }
  }

  window.initFutureThreeScroll = initFutureThreeScroll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFutureThreeScroll);
  } else {
    initFutureThreeScroll();
  }
})();
