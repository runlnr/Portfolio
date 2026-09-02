/**
 * N/P® Hero Corner Statement ASCII Morph Effect
 * Cycles between:
 *   State 0: "Nothing here/" (Left)  |  "/by accident." (Right)
 *   State 1: "Nothing out/"  (Left)  |  "/of place."     (Right)
 *
 * Scrambles with authentic rapid ASCII glyph decoding over 800ms - 1100ms
 * Randomized interval between 5 and 8 seconds (5000ms - 8000ms).
 */

(() => {
  'use strict';

  const PHRASES = [
    {
      left: 'Nothing here/',
      right: '/by accident.'
    },
    {
      left: 'Nothing out/',
      right: '/of place.'
    }
  ];

  const ASCII_GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~\\X#0123456789ABCDEF!?:;';

  function getRandomGlyph() {
    return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
  }

  let currentIndex = 0;
  let swapTimeoutId = null;
  let isScrambling = false;
  let isInitialized = false;

  /**
   * Random interval between 5,000ms (5s) and 8,000ms (8s)
   */
  function getRandomInterval() {
    return Math.floor(5000 + Math.random() * 3000);
  }

  /**
   * Scrambles an individual element's text to targetText using an ASCII appearing mixing effect.
   */
  function scrambleElement(el, targetText, duration = 900, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!el) {
          resolve();
          return;
        }

        const targetSpan = el.querySelector('span') || el;
        const startText = targetSpan.textContent.trim();
        const maxLen = Math.max(startText.length, targetText.length);
        const fps = 36;
        const totalFrames = Math.max(24, Math.floor((duration / 1000) * fps));
        let frame = 0;

        // Progressive stagger: characters resolve left-to-right
        const resolveFrames = [];
        for (let i = 0; i < maxLen; i++) {
          const staggerRatio = i / Math.max(1, maxLen);
          // Characters start resolving between 30% and 85% of the total animation duration
          const startResolve = Math.floor(totalFrames * (0.30 + staggerRatio * 0.55));
          resolveFrames.push(startResolve);
        }

        const interval = setInterval(() => {
          frame++;
          let result = '';

          for (let i = 0; i < maxLen; i++) {
            if (i >= targetText.length) {
              // Shrinking word: trailing characters cycle then dissolve
              if (frame < totalFrames * 0.5) {
                result += getRandomGlyph();
              }
            } else {
              const targetChar = targetText[i];
              if (targetChar === ' ') {
                result += ' ';
              } else if (frame >= resolveFrames[i]) {
                result += targetChar;
              } else {
                result += getRandomGlyph();
              }
            }
          }

          targetSpan.textContent = result;

          if (frame >= totalFrames) {
            clearInterval(interval);
            targetSpan.textContent = targetText;
            resolve();
          }
        }, 1000 / fps);
      }, delay);
    });
  }

  /**
   * Performs the ASCII scramble transition to target index
   */
  async function performScramble(targetIdx) {
    const leftEl = document.getElementById('hero-text-left') || document.querySelector('.hero-text-left');
    const rightEl = document.getElementById('hero-text-right') || document.querySelector('.hero-text-right');

    const target = PHRASES[targetIdx];
    isScrambling = true;

    const promises = [];
    if (leftEl) {
      promises.push(scrambleElement(leftEl, target.left, 850, 0));
    }
    if (rightEl) {
      promises.push(scrambleElement(rightEl, target.right, 950, 60));
    }

    await Promise.all(promises);

    currentIndex = targetIdx;
    isScrambling = false;
  }

  /**
   * Schedules the next swap at a randomized interval between 5s and 8s
   */
  function scheduleNextSwap() {
    if (swapTimeoutId) {
      clearTimeout(swapTimeoutId);
      swapTimeoutId = null;
    }

    const nextDelay = getRandomInterval();

    swapTimeoutId = setTimeout(async () => {
      if (document.hidden) {
        const onVisible = () => {
          if (!document.hidden) {
            document.removeEventListener('visibilitychange', onVisible);
            scheduleNextSwap();
          }
        };
        document.addEventListener('visibilitychange', onVisible);
        return;
      }

      const nextIndex = (currentIndex + 1) % PHRASES.length;
      await performScramble(nextIndex);
      scheduleNextSwap();
    }, nextDelay);
  }

  /**
   * Initializes headline scramble effect on page load
   */
  function initHeroStatementScramble(force = false) {
    if (isInitialized && !force) return;
    const leftEl = document.getElementById('hero-text-left');
    const rightEl = document.getElementById('hero-text-right');
    if (!leftEl && !rightEl) return;

    isInitialized = true;
    scheduleNextSwap();
  }

  function destroyHeroStatementScramble() {
    if (swapTimeoutId) {
      clearTimeout(swapTimeoutId);
      swapTimeoutId = null;
    }
    isInitialized = false;
    isScrambling = false;
  }

  // Expose API for external control
  window.initHeroStatementScramble = initHeroStatementScramble;
  window.destroyHeroStatementScramble = destroyHeroStatementScramble;
  window.heroStatementScramble = {
    performScramble,
    scheduleNextSwap,
    destroyHeroStatementScramble,
    get currentIndex() { return currentIndex; },
    get isScrambling() { return isScrambling; },
    PHRASES
  };

  window.addEventListener('pagehide', destroyHeroStatementScramble, { once: true });

  // Immediate initialize on DOMContentLoaded or if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroStatementScramble(false);
    });
  } else {
    initHeroStatementScramble(false);
  }
})();
