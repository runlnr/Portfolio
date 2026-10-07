/**
 * Nam Pham — About Page Interactive & Motion Controller
 * Implements Future Three® staggered line mask text reveal on transition completion,
 * contact modal triggers, and shared controllers.
 */

(() => {
  'use strict';

  let hasRevealedAboutParagraphs = false;

  /**
   * Splits .about-paragraphs <p> tags into Future Three® line masks (.f3-line-mask > .f3-line-inner)
   * with continuous cascading --line-idx values across all paragraphs.
   */
  function prepareAboutParagraphLineSplits() {
    const container = document.querySelector('.about-paragraphs');
    if (!container || container.dataset.lineRevealReady === 'true') return;

    const paragraphs = Array.from(container.querySelectorAll('p'));
    if (!paragraphs.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let globalLineIndex = 0;

    paragraphs.forEach((p) => {
      const originalText = p.textContent.trim().replace(/\s+/g, ' ');
      if (!originalText) return;

      if (!p.getAttribute('aria-label')) {
        p.setAttribute('aria-label', originalText);
      }

      if (prefersReducedMotion) {
        return;
      }

      // Temporarily wrap words in inline spans to measure natural offsetTop line wrapping
      const words = originalText.split(' ');
      p.innerHTML = words
        .map((w) => `<span class="f3-temp-word" style="display:inline-block; margin-right:0.25em;">${w}</span>`)
        .join('');

      const wordSpans = Array.from(p.querySelectorAll('.f3-temp-word'));
      let lines = [];
      let currentLine = [];
      let currentTop = null;

      wordSpans.forEach((span) => {
        const top = span.offsetTop;
        if (currentTop === null || Math.abs(top - currentTop) > 6) {
          if (currentLine.length) lines.push(currentLine.join(' '));
          currentLine = [span.textContent];
          currentTop = top;
        } else {
          currentLine.push(span.textContent);
        }
      });
      if (currentLine.length) lines.push(currentLine.join(' '));

      p.innerHTML = '';
      lines.forEach((lineText) => {
        const mask = document.createElement('span');
        mask.className = 'f3-line-mask';
        mask.setAttribute('aria-hidden', 'true');

        const inner = document.createElement('span');
        inner.className = 'f3-line-inner';
        inner.style.setProperty('--line-idx', globalLineIndex);
        inner.textContent = lineText;

        mask.appendChild(inner);
        p.appendChild(mask);
        globalLineIndex++;
      });
    });

    container.dataset.lineRevealReady = 'true';
  }

  /**
   * Triggers the Future Three® staggered line mask animation on the About page narrative
   * when page transition finishes
   */
  function triggerAboutParagraphReveal() {
    if (hasRevealedAboutParagraphs) return;
    hasRevealedAboutParagraphs = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    prepareAboutParagraphLineSplits();

    const container = document.querySelector('.about-paragraphs');
    if (!container) return;

    requestAnimationFrame(() => {
      const inners = container.querySelectorAll('.f3-line-inner');
      inners.forEach((inner) => {
        inner.classList.add('is-visible');
      });
      container.classList.add('is-revealed');
    });
  }

  window.triggerAboutParagraphReveal = triggerAboutParagraphReveal;
  window.triggerAboutAsciiAppear = triggerAboutParagraphReveal; // Fallback alias

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
          window.location.href = '/#f3-contact';
        }
      });
    }
  }

  function syncPortraitHeight() {
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      const portraitWrap = document.querySelector('.about-portrait-wrap');
      if (portraitWrap) {
        portraitWrap.style.height = '';
        portraitWrap.style.width = '';
      }
      return;
    }

    const paragraphs = document.querySelector('.about-paragraphs');
    const portraitWrap = document.querySelector('.about-portrait-wrap');
    if (!paragraphs || !portraitWrap) return;

    const h = paragraphs.offsetHeight;
    if (h > 150) {
      portraitWrap.style.height = `${h}px`;
      portraitWrap.style.width = `${Math.round(h * (5 / 6))}px`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    initAboutContactTriggers();

    // Prepare line splits once layout / fonts are ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        prepareAboutParagraphLineSplits();
        syncPortraitHeight();
      });
    } else {
      prepareAboutParagraphLineSplits();
      syncPortraitHeight();
    }

    window.addEventListener('resize', () => {
      syncPortraitHeight();
    }, { passive: true });

    // If loaded directly without transition, trigger line reveal immediately
    const isNavigatingIn = sessionStorage.getItem('np_is_navigating') === 'true';
    if (!isNavigatingIn) {
      setTimeout(() => {
        syncPortraitHeight();
        triggerAboutParagraphReveal();
      }, 100);
    }
  });

})();

