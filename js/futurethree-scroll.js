/**
 * FUTURE THREE® Editorial Scroll Interactions
 * Live Seconds Clock, GSAP ScrollTriggers & Parallax Watermarks
 */

(function () {
  'use strict';

  function initFutureThreeScroll() {
    // 1. Scroll-Driven Editorial Cascade Reveal System
    function initScrollReveal() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const targets = document.querySelectorAll(
        '.f3-intro-lockup, .f3-intro-divider-row, .f3-featured-tag-row, .f3-work-card, .f3-service-showcase, .f3-showcase-footer-quote, .f3-single-divider-row, .f3-contact-hero-stage, .f3-contact-corners-bar, .f3-colophon-grid'
      );

      if (!targets.length) return;
      if (!('IntersectionObserver' in window)) return;

      targets.forEach(el => {
        el.classList.add('f3-scroll-reveal');
      });

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      });

      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    }

    initScrollReveal();

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

    // 4. Portfolio Grid vs List View Switcher
    const viewGridBtn = document.getElementById('f3-view-grid');
    const viewListBtn = document.getElementById('f3-view-list');
    const gridViewContainer = document.getElementById('f3-works-grid');
    const listViewContainer = document.getElementById('f3-works-list');
    const expandWrap = document.querySelector('.f3-works-expand-wrap');

    if (viewGridBtn && viewListBtn && gridViewContainer && listViewContainer) {
      function setView(mode) {
        if (mode === 'list') {
          viewListBtn.classList.add('is-active');
          viewListBtn.setAttribute('aria-checked', 'true');
          viewGridBtn.classList.remove('is-active');
          viewGridBtn.setAttribute('aria-checked', 'false');

          gridViewContainer.style.display = 'none';
          if (expandWrap) expandWrap.style.display = 'none';
          if (viewCursorTag) viewCursorTag.classList.remove('is-visible');
          listViewContainer.style.display = 'flex';
        } else {
          viewGridBtn.classList.add('is-active');
          viewGridBtn.setAttribute('aria-checked', 'true');
          viewListBtn.classList.remove('is-active');
          viewListBtn.setAttribute('aria-checked', 'false');

          listViewContainer.style.display = 'none';
          gridViewContainer.style.display = 'flex';
          if (expandWrap) expandWrap.style.display = '';
        }

        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }

      viewGridBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setView('grid');
      });

      viewListBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setView('list');
      });
    }

    // 5. Floating /view/ Cursor Follower Tag for Work Cards
    let viewCursorTag = document.getElementById('f3-cursor-view-tag');
    if (!viewCursorTag) {
      viewCursorTag = document.createElement('div');
      viewCursorTag.id = 'f3-cursor-view-tag';
      viewCursorTag.className = 'f3-cursor-view-tag';
      viewCursorTag.textContent = '/view/';
      viewCursorTag.setAttribute('aria-hidden', 'true');
      document.body.appendChild(viewCursorTag);
    }

    const f3WorkCards = document.querySelectorAll('.f3-work-card');
    if (f3WorkCards.length > 0 && viewCursorTag) {
      let mouseX = -9999, mouseY = -9999;
      let currentX = -9999, currentY = -9999;
      let isHoveringCard = false;

      f3WorkCards.forEach(card => {
        card.addEventListener('mouseenter', e => {
          isHoveringCard = true;
          const href = (card.getAttribute('href') || '').toLowerCase();
          const cardText = (card.textContent || '').toLowerCase();
          const ariaLabel = (card.getAttribute('aria-label') || '').toLowerCase();
          const customTag = card.getAttribute('data-cursor');
          const isAudi = href.includes('audi') || cardText.includes('audi') || ariaLabel.includes('audi') || cardText.includes('revolut');
          viewCursorTag.textContent = customTag || (isAudi ? '/coming soon/' : '/view/');
          viewCursorTag.classList.add('is-visible');
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (currentX === -9999) {
            currentX = mouseX;
            currentY = mouseY;
            viewCursorTag.style.transform = `translate3d(${currentX + 12}px, ${currentY - 15}px, 0)`;
          }
        });

        card.addEventListener('mouseleave', () => {
          isHoveringCard = false;
          viewCursorTag.classList.remove('is-visible');
        });

        card.addEventListener('mousemove', e => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (!isHoveringCard) {
            isHoveringCard = true;
            const href = (card.getAttribute('href') || '').toLowerCase();
            const cardText = (card.textContent || '').toLowerCase();
            const ariaLabel = (card.getAttribute('aria-label') || '').toLowerCase();
            const customTag = card.getAttribute('data-cursor');
            const isAudi = href.includes('audi') || cardText.includes('audi') || ariaLabel.includes('audi') || cardText.includes('revolut');
            viewCursorTag.textContent = customTag || (isAudi ? '/coming soon/' : '/view/');
            viewCursorTag.classList.add('is-visible');
          }
        });
      });

      document.addEventListener('mouseleave', () => {
        isHoveringCard = false;
        viewCursorTag.classList.remove('is-visible');
      });

      let viewRafId = null;
      function startViewCursorAnim() {
        if (viewRafId) return;
        function step() {
          if (isHoveringCard) {
            if (currentX === -9999) {
              currentX = mouseX;
              currentY = mouseY;
            }
            currentX += (mouseX - currentX) * 0.22;
            currentY += (mouseY - currentY) * 0.22;
            viewCursorTag.style.transform = `translate3d(${currentX + 12}px, ${currentY - 15}px, 0)`;
            viewRafId = requestAnimationFrame(step);
          } else {
            viewRafId = null;
          }
        }
        viewRafId = requestAnimationFrame(step);
      }

      f3WorkCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          startViewCursorAnim();
        });
        card.addEventListener('mousemove', () => {
          startViewCursorAnim();
        });
      });
    }

    // 7. Footer Social Hover Handle Switcher (@pxly -> @phnm08, @_phnm._, etc.)
    function initFooterSignatureHandleSwitcher() {
      const signatureContainer = document.querySelector('.f3-footer-brand-signature');
      const signatureTextEl = signatureContainer ? signatureContainer.querySelector('.f3-signature-text') : null;
      const socialLinks = document.querySelectorAll('.f3-footer-social-link[data-handle]');

      if (!signatureTextEl || socialLinks.length === 0) return;

      const DEFAULT_HANDLE = '@pxly';
      const ASCII_POOL = 'abcdefghijklmnopqrstuvwxyz0123456789_.-';

      function formatHandleToHTML(str) {
        let uIndex = 0;
        return str.split('').map(ch => {
          if (ch === '_') {
            uIndex++;
            return `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
          }
          return ch;
        }).join('');
      }

      function getRandomChar() {
        return ASCII_POOL[Math.floor(Math.random() * ASCII_POOL.length)];
      }

      let currentDisplayed = DEFAULT_HANDLE;
      let animRafId = null;

      function scrambleTo(targetText, duration = 280) {
        if (!targetText || targetText === currentDisplayed) return;

        if (animRafId) {
          cancelAnimationFrame(animRafId);
          animRafId = null;
        }

        if (signatureContainer) {
          signatureContainer.setAttribute('aria-label', targetText);
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          currentDisplayed = targetText;
          signatureTextEl.innerHTML = formatHandleToHTML(targetText);
          return;
        }

        const startText = currentDisplayed;
        currentDisplayed = targetText;
        const maxLen = Math.max(startText.length, targetText.length);
        const startTime = performance.now();

        function frame(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Progressive resolve left to right
          let resultHTML = '';
          let uIndex = 0;

          for (let i = 0; i < maxLen; i++) {
            const charResolveThreshold = 0.15 + (i / Math.max(1, maxLen)) * 0.75;

            if (i >= targetText.length) {
              // Extra trailing characters fade/dissolve out
              if (progress < 0.45) {
                const randCh = getRandomChar();
                if (randCh === '_') {
                  uIndex++;
                  resultHTML += `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
                } else {
                  resultHTML += randCh;
                }
              }
            } else {
              const targetChar = targetText[i];
              if (targetChar === '@' || targetChar === '.' || progress >= charResolveThreshold) {
                if (targetChar === '_') {
                  uIndex++;
                  resultHTML += `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
                } else {
                  resultHTML += targetChar;
                }
              } else {
                const randCh = getRandomChar();
                if (randCh === '_') {
                  uIndex++;
                  resultHTML += `<span class="neue-haas-underscore underscore-${uIndex}">_</span>`;
                } else {
                  resultHTML += randCh;
                }
              }
            }
          }

          signatureTextEl.innerHTML = resultHTML;

          if (progress < 1) {
            animRafId = requestAnimationFrame(frame);
          } else {
            signatureTextEl.innerHTML = formatHandleToHTML(targetText);
            animRafId = null;
          }
        }

        animRafId = requestAnimationFrame(frame);
      }

      socialLinks.forEach(link => {
        const handle = link.getAttribute('data-handle');
        if (!handle) return;

        // Hover & touch interactions: update to handle and retain as active
        link.addEventListener('mouseenter', () => scrambleTo(handle));
        link.addEventListener('focus', () => scrambleTo(handle));
        link.addEventListener('touchstart', () => scrambleTo(handle), { passive: true });
      });
    }

    initFooterSignatureHandleSwitcher();

    // 4. Interactive Hover Letter Shuffle on Ho Chi Minh City Status Text
    function initCityLetterShuffle() {
      const cityElements = document.querySelectorAll('.f3-intro-city');
      if (!cityElements.length) return;

      const MONO_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      function getRandomMonoChar() {
        return MONO_CHARS[Math.floor(Math.random() * MONO_CHARS.length)];
      }

      cityElements.forEach(cityEl => {
        if (cityEl.dataset.shuffleInit === 'true') return;
        cityEl.dataset.shuffleInit = 'true';

        const originalText = cityEl.textContent;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < originalText.length; i++) {
          const char = originalText[i];
          if (/\s/.test(char)) {
            fragment.appendChild(document.createTextNode(char));
          } else {
            const span = document.createElement('span');
            span.className = 'f3-mono-shuffle-letter';
            span.textContent = char;
            span.dataset.original = char;
            fragment.appendChild(span);
          }
        }

        cityEl.innerHTML = '';
        cityEl.appendChild(fragment);

        const letters = cityEl.querySelectorAll('.f3-mono-shuffle-letter');
        letters.forEach(letter => {
          const originalChar = letter.dataset.original;
          let intervalId = null;
          let timeoutId = null;
          let isHovered = false;

          function startShuffling() {
            if (!intervalId) {
              intervalId = setInterval(() => {
                letter.textContent = getRandomMonoChar();
              }, 35);
            }
          }

          function stopShuffling() {
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
            letter.textContent = originalChar;
          }

          letter.addEventListener('pointerenter', () => {
            isHovered = true;
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            startShuffling();
          });

          letter.addEventListener('pointerleave', () => {
            isHovered = false;
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
              if (!isHovered) {
                stopShuffling();
              }
              timeoutId = null;
            }, 2000);
          });
        });
      });
    }

    initCityLetterShuffle();
  }

  window.initFutureThreeScroll = initFutureThreeScroll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFutureThreeScroll);
  } else {
    initFutureThreeScroll();
  }
})();
