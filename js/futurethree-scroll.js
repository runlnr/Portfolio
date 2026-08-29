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

      // Staggered Entrance Animation for Horizontal Project Strips
      const workStrips = document.querySelectorAll('.f3-work-strip');
      if (workStrips.length > 0) {
        window.gsap.fromTo(
          workStrips,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.14,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: '.f3-works-strips-container',
              start: 'top 85%',
              once: true
            }
          }
        );

        // Smooth desktop drag-to-scroll for horizontal filmstrip galleries
        const galleries = document.querySelectorAll('.f3-strip-gallery');
        galleries.forEach(gallery => {
          let isDown = false;
          let startX;
          let scrollLeft;

          gallery.addEventListener('mousedown', (e) => {
            if (e.target.closest('a')) {
              // allow clicking links if not dragged
            }
            isDown = true;
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
          });

          gallery.addEventListener('mouseleave', () => {
            isDown = false;
          });

          gallery.addEventListener('mouseup', () => {
            isDown = false;
          });

          gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 1.5;
            gallery.scrollLeft = scrollLeft - walk;
          });
        });
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
