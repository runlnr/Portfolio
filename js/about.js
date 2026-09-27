/**
 * Nam Pham — About Page Interactive & Motion Controller
 * Implements in-place ASCII decode reveal, contact modal triggers, and shared animations.
 */

(() => {
  'use strict';

  const ASCII_GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~\\X#0123456789ABCDEF!?:;';

  function getRandomGlyph() {
    return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
  }

  let activeAboutScrambles = [];

  function clearActiveAboutScrambles() {
    activeAboutScrambles.forEach(id => clearInterval(id));
    activeAboutScrambles = [];
  }

  /**
   * Triggers the authentic in-place ASCII appear animation on the About page hero headline
   */
  function triggerAboutAsciiAppear() {
    clearActiveAboutScrambles();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const heroTitle = document.getElementById('about-hero-title');
    const metaTag = document.getElementById('about-meta-tag');

    const elements = [heroTitle, metaTag].filter(Boolean);
    if (!elements.length) return;

    const duration = (window.HERO_SCRAMBLE_DURATION && typeof window.HERO_SCRAMBLE_DURATION === 'number')
      ? window.HERO_SCRAMBLE_DURATION
      : 1250;
    const fps = 32;
    const totalFrames = Math.max(26, Math.floor((duration / 1000) * fps));

    elements.forEach((el, elIdx) => {
      const targetText = el.textContent.trim();
      if (!targetText) return;

      const len = targetText.length;
      const resolveFrames = [];
      for (let i = 0; i < len; i++) {
        const ratio = i / Math.max(1, len);
        // Stagger left-to-right resolution between 25% and 80% of total frames
        resolveFrames.push(Math.floor(totalFrames * (0.25 + ratio * 0.58)));
      }

      let initialStr = '';
      for (let i = 0; i < len; i++) {
        const char = targetText[i];
        initialStr += (char === ' ' || char === '\n' || char === '\t') ? char : getRandomGlyph();
      }
      el.textContent = initialStr;

      let frame = 0;
      // Stagger start slightly per element
      const startDelay = elIdx * 60;

      setTimeout(() => {
        const intervalId = setInterval(() => {
          frame++;
          let currentStr = '';
          for (let i = 0; i < len; i++) {
            const char = targetText[i];
            if (char === ' ' || char === '\n' || char === '\t') {
              currentStr += char;
            } else if (frame >= resolveFrames[i]) {
              currentStr += char;
            } else {
              currentStr += getRandomGlyph();
            }
          }

          el.textContent = currentStr;

          if (frame >= totalFrames) {
            clearInterval(intervalId);
            el.textContent = targetText;
          }
        }, 1000 / fps);

        activeAboutScrambles.push(intervalId);
      }, startDelay);
    });
  }

  window.triggerAboutAsciiAppear = triggerAboutAsciiAppear;
  window.addEventListener('pagehide', clearActiveAboutScrambles, { once: true });

  /**
   * Initializes contact modal trigger buttons on the About page
   */
  function initAboutContactTriggers() {
    const triggerBtn = document.getElementById('about-open-contact-modal');
    if (triggerBtn && typeof window.openContactModal === 'function') {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openContactModal();
      });
    }

    const floatingCta = document.getElementById('nav-floating-cta');
    if (floatingCta) {
      floatingCta.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.openContactModal === 'function') {
          window.openContactModal();
        } else {
          window.location.href = 'index.html#f3-contact';
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAboutContactTriggers();

    // If loaded directly without page transition, trigger ASCII reveal immediately
    const isNavigatingIn = sessionStorage.getItem('np_is_navigating') === 'true';
    if (!isNavigatingIn) {
      setTimeout(() => {
        triggerAboutAsciiAppear();
      }, 150);
    }
  });

})();
