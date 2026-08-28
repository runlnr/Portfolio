/**
 * Hero Headline ASCII Scramble & Auto-Rotation
 * Alternates between (ALL CAPS):
 *   1) "NOTHING HERE" / "BY ACCIDENT."
 *   2) "NOTHING OUT" / "OF PLACE."
 * ASCII appearing mixing effect with random interval between 4 and 6 seconds.
 */

(() => {
  const HEADLINES = [
    {
      line1: 'NOTHING HERE',
      line2: 'BY ACCIDENT.'
    },
    {
      line1: 'NOTHING OUT',
      line2: 'OF PLACE.'
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
   * Random duration between 5,000ms (5s) and 9,000ms (9s)
   */
  function getRandomInterval() {
    return Math.floor(5000 + Math.random() * 4000);
  }

  /**
   * Scrambles an individual element's text to targetText using an ASCII appearing mixing effect.
   */
  function scrambleElement(el, targetText, duration = 1000, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!el) {
          resolve();
          return;
        }

        const startText = el.textContent || '';
        const maxLen = Math.max(startText.length, targetText.length);
        const fps = 30;
        const totalFrames = Math.max(20, Math.floor((duration / 1000) * fps));
        let frame = 0;

        // Progressive stagger per character
        const resolveFrames = [];
        for (let i = 0; i < maxLen; i++) {
          const staggerRatio = i / Math.max(1, maxLen);
          const startResolve = Math.floor(totalFrames * (0.35 + staggerRatio * 0.55));
          resolveFrames.push(startResolve);
        }

        const interval = setInterval(() => {
          frame++;
          let result = '';

          for (let i = 0; i < maxLen; i++) {
            if (i >= targetText.length) {
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

          el.textContent = result;

          if (frame >= totalFrames) {
            clearInterval(interval);
            el.textContent = targetText;
            resolve();
          }
        }, 1000 / fps);
      }, delay);
    });
  }

  /**
   * Performs the ASCII scramble transition to target headline index
   */
  async function performScramble(targetIdx) {
    const l1 = document.querySelector('.hero-bottom-headline .line-1');
    const l2 = document.querySelector('.hero-bottom-headline .line-2');
    const headline = document.querySelector('.hero-bottom-headline');

    const target = HEADLINES[targetIdx];
    isScrambling = true;

    if (l1 && l2) {
      await Promise.all([
        scrambleElement(l1, target.line1, 1000, 0),
        scrambleElement(l2, target.line2, 1100, 60)
      ]);
    } else if (headline) {
      await scrambleElement(headline, `${target.line1}\n${target.line2}`, 1100, 0);
    }

    currentIndex = targetIdx;
    isScrambling = false;
  }

  /**
   * Schedules the next swap at a randomized interval between 4s and 6s
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

      const nextIndex = (currentIndex + 1) % HEADLINES.length;
      await performScramble(nextIndex);
      scheduleNextSwap();
    }, nextDelay);
  }

  /**
   * Initializes headline scramble effect on page reveal / load
   */
  function initHeroHeadlineScramble(force = false) {
    if (isInitialized && !force) return;
    const headline = document.querySelector('.hero-bottom-headline');
    if (!headline) return;

    isInitialized = true;

    // Trigger initial ASCII decode reveal
    performScramble(currentIndex).then(() => {
      scheduleNextSwap();
    });
  }

  // Expose API for external control
  window.initHeroHeadlineScramble = initHeroHeadlineScramble;
  window.heroStatementScramble = {
    performScramble,
    scheduleNextSwap,
    get currentIndex() { return currentIndex; },
    get isScrambling() { return isScrambling; },
    HEADLINES
  };

  // Immediate initialize on DOMContentLoaded if intro loader has already run
  document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('np_has_seen_intro')) {
      initHeroHeadlineScramble(false);
    }
  });
})();
