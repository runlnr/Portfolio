/**
 * ==========================================================================
 * USER CONFIGURATION: Loading Screen & Page Transitions
 * Easily adjust timing (in milliseconds) below:
 * ==========================================================================
 */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/index.html' || window.location.hash === '#f3-portfolio') {
  if (window.location.hash === '#f3-portfolio' || window.location.hash === '#works' || window.location.hash === '#projects') {
    sessionStorage.setItem('np_scroll_to_works', 'true');
  }
  const cleanHash = (window.location.hash === '#f3-portfolio' || window.location.hash === '#works' || window.location.hash === '#projects') ? '' : (window.location.hash || '');
  const cleanPath = window.location.pathname.replace(/\/index\.html$/, '/') + cleanHash;
  if (window.history.replaceState) {
    window.history.replaceState(null, '', cleanPath);
  }
}

// 1. Loading Screen Fill & Reveal Speeds (in milliseconds)
window.LOADER_CONFIG = {
  // Fill duration: Time (ms) for logo to fill from grey to solid white (2400ms = 2.4s)
  fillDuration: 2400,
  // Fill easing: 'easeInOutQuint' from https://easings.net/#easeInOutQuint
  // (Slow lower start, rapid mid surge, ultra-smooth quintic top deceleration)
  fillEasing: 'easeInOutQuint',
  fillEasingExp: 3.3,
  // Brief hold once 100% white is reached before exiting (300ms = 0.3s)
  settleHold: 300,
  // Duration for the logo to slide up through its tight solid mask aperture and vanish
  slideUpDuration: 480,
  // Additional solid black screen hold time (100ms = 0.1s) after logo slides up before overlay fades
  blackHoldDuration: 100,
  // Duration for black loader overlay to fade into hero page
  overlayFadeDuration: 600
};

// 2. Page Transition Speed (Silk-Smooth Cross-Fade: 1100ms fade + 800ms black screen wait + 1100ms reveal)
window.TRANSITION_CONFIG = {
  coverDuration: 1100,   // 1100ms to fade out to black on click
  holdDuration: 800,     // 800ms black screen wait in the middle
  revealDuration: 1100,  // 1100ms to fade in the new page on arrival
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

// 3. ASCII Decode Durations (in milliseconds) — relaxed cinematic decode speed
window.PROJECT_SCRAMBLE_DURATION = 1350; // Total duration for project page context ASCII decode
window.HERO_SCRAMBLE_DURATION = 1250;    // Total duration for hero bottom text ASCII decode

// Helper: Replay loader anytime in Console using `replayIntroLoader()`
window.replayIntroLoader = function () {
  sessionStorage.removeItem('np_has_seen_intro');
  window.location.reload();
};

/**
 * 3. Viewport Text Reveal Engine (Authentic In-Place ASCII Shuffle Appear)
 * Runs strictly once after the page fade-in transition finishes
 */
let hasRevealedViewportText = false;

// Global Scroll-Lock State Controller
function isSiteBusyWithLoaderOrTransition() {
  return document.documentElement.classList.contains('is-loading') ||
    document.body.classList.contains('is-loading') ||
    document.documentElement.classList.contains('is-navigating-in') ||
    document.body.classList.contains('is-navigating-in') ||
    document.documentElement.classList.contains('is-navigating-out') ||
    document.body.classList.contains('is-navigating-out') ||
    document.documentElement.classList.contains('page-transitioning') ||
    document.body.classList.contains('page-transitioning') ||
    (typeof loaderFinished !== 'undefined' && !loaderFinished && document.getElementById('site-loader') && !sessionStorage.getItem('np_has_seen_intro'));
}

function lockSiteScroll() {
  const lenis = (window.motionStack && window.motionStack.lenis) || window.lenis;
  if (lenis && typeof lenis.stop === 'function') {
    lenis.stop();
  }
}

function unlockSiteScroll() {
  if (isSiteBusyWithLoaderOrTransition()) return;
  if (document.body.classList.contains('pm-modal-active') || document.body.classList.contains('nav-dropdown-active')) {
    return;
  }
  const lenis = (window.motionStack && window.motionStack.lenis) || window.lenis;
  if (lenis && typeof lenis.start === 'function') {
    lenis.start();
  }
}

window.lockSiteScroll = lockSiteScroll;
window.unlockSiteScroll = unlockSiteScroll;
window.isSiteBusyWithLoaderOrTransition = isSiteBusyWithLoaderOrTransition;

// Hard block for wheel, touch, and scroll keys while loading screen or transition is active
const SCROLL_LOCK_KEYS = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space', ' '];
window.addEventListener('wheel', (e) => {
  if (isSiteBusyWithLoaderOrTransition()) {
    e.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (e) => {
  if (isSiteBusyWithLoaderOrTransition()) {
    e.preventDefault();
  }
}, { passive: false });

window.addEventListener('keydown', (e) => {
  if (isSiteBusyWithLoaderOrTransition() && SCROLL_LOCK_KEYS.includes(e.key)) {
    e.preventDefault();
  }
});

window.triggerViewportTextReveal = function () {
  if (hasRevealedViewportText) return;
  hasRevealedViewportText = true;

  const isProjectPage = !!document.querySelector('.project-main-wrap');
  const isAboutPage = !!document.querySelector('.about-main-wrap');

  if (isAboutPage) {
    // 1. About Page: Future Three® Staggered Line Mask Reveal across bio paragraphs
    const triggerFn = window.triggerAboutParagraphReveal || window.triggerAboutAsciiAppear;
    if (typeof triggerFn === 'function') {
      triggerFn();
    } else {
      let retries = 0;
      const checkAboutReveal = setInterval(() => {
        retries++;
        const fn = window.triggerAboutParagraphReveal || window.triggerAboutAsciiAppear;
        if (typeof fn === 'function' || retries > 12) {
          clearInterval(checkAboutReveal);
          if (typeof fn === 'function') {
            fn();
          }
        }
      }, 25);
    }
  } else if (isProjectPage) {
    // 2. Project Page: Simultaneous Terminal Matrix ASCII appear across all context content
    if (typeof window.triggerProjectAsciiAppear === 'function') {
      window.triggerProjectAsciiAppear();
    } else {
      let retries = 0;
      const checkProjectAscii = setInterval(() => {
        retries++;
        if (typeof window.triggerProjectAsciiAppear === 'function' || retries > 12) {
          clearInterval(checkProjectAscii);
          if (typeof window.triggerProjectAsciiAppear === 'function') {
            window.triggerProjectAsciiAppear();
          }
        }
      }, 25);
    }
  } else {
    // 3. Hero Page: Authentic ASCII appear animation on "Nothing here/" and "/by accident."
    if (typeof window.triggerHeroAsciiAppear === 'function') {
      window.triggerHeroAsciiAppear();
    } else {
      let retry = 0;
      const checkHeroAscii = setInterval(() => {
        retry++;
        if (typeof window.triggerHeroAsciiAppear === 'function' || retry > 12) {
          clearInterval(checkHeroAscii);
          if (typeof window.triggerHeroAsciiAppear === 'function') {
            window.triggerHeroAsciiAppear();
          }
        }
      }, 25);
    }
  }
};

/**
 * Developer Helpers to inspect & calibrate loading screen logo:
 * - previewLoader('play')   : Plays the full fill -> masked slide-up exit -> hero reveal sequence
 * - previewLoader('grey')   : Freezes loader in initial grey state
 * - previewLoader('half')   : Freezes loader 50% filled with white
 * - previewLoader('white')  : Freezes loader 100% filled with white
 * - previewLoader('exit')   : Triggers the masked slide-up exit immediately
 * - previewLoader('close')  : Hides loader and resumes normal view
 */
window.previewLoader = function (state = 'play') {
  const loader = document.getElementById('site-loader');
  const fillWrap = document.getElementById('loader-logo-fill-wrap');
  const logoCenter = document.getElementById('loader-logo-center');
  if (!loader) return;
  if (state === 'close' || state === false) {
    loader.style.display = 'none';
    loader.style.pointerEvents = 'none';
    loader.style.opacity = '';
    document.body.classList.remove('is-loading');
    document.documentElement.classList.remove('is-loading');
    if (logoCenter) {
      logoCenter.classList.remove('slide-up-exit', 'fade-out');
    }
    unlockSiteScroll();
    return;
  }

  loader.style.display = 'block';
  loader.style.pointerEvents = 'all';
  loader.style.opacity = '1';
  loader.classList.remove('slide-up', 'fade-out');
  if (logoCenter) {
    logoCenter.classList.remove('slide-up-exit', 'fade-out');
  }
  document.body.classList.add('is-loading');
  document.documentElement.classList.add('is-loading');
  lockSiteScroll();

  if (state === 'grey' || state === 'start') {
    if (fillWrap) fillWrap.style.clipPath = 'inset(100% 0 0 0)';
  } else if (state === '50' || state === 'half') {
    if (fillWrap) fillWrap.style.clipPath = 'inset(50% 0 0 0)';
  } else if (state === 'exit') {
    if (fillWrap) fillWrap.style.clipPath = 'inset(0% 0 0 0)';
    if (logoCenter) logoCenter.classList.add('slide-up-exit');
  } else if (state === 'play' || state === 'fill') {
    if (fillWrap) {
      fillWrap.style.clipPath = 'inset(100% 0 0 0)';
      let start = null;
      const duration = (window.LOADER_CONFIG && window.LOADER_CONFIG.fillDuration) || 2400;
      function step(now) {
        if (!start) start = now;
        const p = Math.min((now - start) / duration, 1);
        // easeInOutQuint: https://easings.net/#easeInOutQuint
        const visualEased = p < 0.5 ? 16 * Math.pow(p, 5) : 1 - Math.pow(-2 * p + 2, 5) / 2;
        // Map directly to visual logo artwork bounds (66.16% span from 83.08% bottom to 16.92% top)
        const clipBottom = p >= 1 ? 0 : 83.08 - (visualEased * 66.16);
        fillWrap.style.clipPath = `inset(${clipBottom}% 0 0 0)`;
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          fillWrap.style.clipPath = 'inset(0% 0 0 0)';
          // Settle briefly (0.3s) then slide up through mask without fading
          const settleTime = window.LOADER_CONFIG?.settleHold || 300;
          setTimeout(() => {
            if (logoCenter) logoCenter.classList.add('slide-up-exit');
            const totalBlackHold = (window.LOADER_CONFIG?.slideUpDuration || 480) + (window.LOADER_CONFIG?.blackHoldDuration || 100);
            setTimeout(() => {
              loader.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
              loader.classList.add('fade-out');
              setTimeout(() => {
                loader.style.display = 'none';
                loader.style.pointerEvents = 'none';
                document.body.classList.remove('is-loading');
                document.documentElement.classList.remove('is-loading');
                unlockSiteScroll();
              }, 600);
            }, totalBlackHold);
          }, settleTime);
        }
      }
      requestAnimationFrame(step);
    }
  } else {
    // default: 'white'
    if (fillWrap) fillWrap.style.clipPath = 'inset(0% 0 0 0)';
  }
};
window.freezeIntroLoader = window.previewLoader;

let appInitialized = false;

function initDesktopApp() {
  if (appInitialized) return;
  if (!window.matchMedia('(min-width: 1024px)').matches) return;
  appInitialized = true;

  // 1. First-Time Access Check & Intro Loader (Logo fill, masked slide-up exit, hero reveal)
  const loader = document.getElementById('site-loader');
  const fillWrap = document.getElementById('loader-logo-fill-wrap');
  const logoCenter = document.getElementById('loader-logo-center');
  const hasSeenIntro = sessionStorage.getItem('np_has_seen_intro');

  let loaderFinished = !!hasSeenIntro;

  if (!hasSeenIntro && loader) {
    document.documentElement.classList.add('is-loading');
    document.body.classList.add('is-loading');
    window.scrollTo(0, 0);
    lockSiteScroll();

    const cfg = Object.assign({
      fillDuration: 2400,
      fillEasing: 'easeInOutQuint',
      fillEasingExp: 3.3,
      settleHold: 300,
      slideUpDuration: 480,
      blackHoldDuration: 100,
      overlayFadeDuration: 600
    }, window.LOADER_CONFIG || {});

    let startTime = null;

    function animateFill(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / cfg.fillDuration, 1);
      // easeInOutQuint: https://easings.net/#easeInOutQuint
      const visualEased = progress < 0.5 ? 16 * Math.pow(progress, 5) : 1 - Math.pow(-2 * progress + 2, 5) / 2;
      // Map directly to visual logo artwork bounds (66.16% span from 83.08% bottom to 16.92% top)
      const clipBottom = progress >= 1 ? 0 : 83.08 - (visualEased * 66.16);
      fillWrap.style.clipPath = `inset(${clipBottom}% 0 0 0)`;

      if (fillWrap) {
        fillWrap.style.clipPath = `inset(${clipBottom}% 0 0 0)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateFill);
      } else {
        if (fillWrap) {
          fillWrap.style.clipPath = 'inset(0% 0 0 0)';
        }
        onFillComplete();
      }
    }

    requestAnimationFrame(animateFill);

    function onFillComplete() {
      // 1. Brief pause after 100% white is reached (300ms = 0.3s)
      setTimeout(() => {
        // 2. Slide the solid white logo UP through its mask aperture (no fade)
        if (logoCenter) {
          logoCenter.classList.add('slide-up-exit');
        }

        // 3. Keep solid black screen until logo finishes sliding up (480ms) + additional 0.1s (100ms) black hold
        const slideUpTime = cfg.slideUpDuration || 480;
        const blackHoldTime = typeof cfg.blackHoldDuration === 'number' ? cfg.blackHoldDuration : 100;
        const totalWaitBeforeFade = slideUpTime + blackHoldTime;

        setTimeout(() => {
          loader.style.transition = `opacity ${cfg.overlayFadeDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          loader.classList.add('slide-up', 'fade-out');
          document.body.classList.remove('is-loading');
          document.documentElement.classList.remove('is-loading');
          document.body.classList.add('loader-revealed');
          loaderFinished = true;
          sessionStorage.setItem('np_has_seen_intro', 'true');
          initHeroTvInteraction();

          // Start ASCII appear decoding immediately as hero fade begins (zero delay)
          if (window.triggerHeroAsciiAppear) {
            window.triggerHeroAsciiAppear();
          }

          const shouldScrollToWorks = sessionStorage.getItem('np_scroll_to_works') === 'true' || window.location.hash === '#f3-portfolio' || window.location.hash === '#works' || window.location.hash === '#projects';
          if (shouldScrollToWorks) {
            sessionStorage.removeItem('np_scroll_to_works');
            if (window.location.hash && window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname);
            }
            setTimeout(() => scrollToPortfolioSection(true), 400);
          }

          // Remove loader once page fade completes and unlock scroll
          setTimeout(() => {
            loader.style.display = 'none';
            loader.style.pointerEvents = 'none';
            unlockSiteScroll();
          }, cfg.overlayFadeDuration);
        }, totalWaitBeforeFade);
      }, cfg.settleHold);
    }
  } else {
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
    document.body.classList.add('loader-revealed');
    unlockSiteScroll();
    initHeroTvInteraction();
    if (window.initHeroHeadlineScramble) {
      window.initHeroHeadlineScramble(false);
    }
    const isNavIn = sessionStorage.getItem('np_is_navigating') === 'true';
    const shouldScrollToWorks = sessionStorage.getItem('np_scroll_to_works') === 'true' || window.location.hash === '#f3-portfolio' || window.location.hash === '#works' || window.location.hash === '#projects';
    if (shouldScrollToWorks && !isNavIn) {
      sessionStorage.removeItem('np_scroll_to_works');
      if (window.location.hash && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setTimeout(() => scrollToPortfolioSection(true), 250);
    }
  }

  // Helper: Smooth scroll to the Portfolio / Works section on the hero site
  function scrollToPortfolioSection(smooth = true) {
    const portfolio = document.querySelector('.f3-intro-divider-row') || document.querySelector('.f3-featured-tag-row') || document.getElementById('f3-portfolio');
    if (!portfolio) {
      const curPath = window.location.pathname;
      const isHome = curPath === '/' || curPath.endsWith('/') || curPath.endsWith('/index.html') || curPath.endsWith('index.html');
      if (!isHome) {
        sessionStorage.setItem('np_scroll_to_works', 'true');
        navigateTo('/');
      }
      return;
    }
    const offset = 0;
    const lenis = (window.motionStack && window.motionStack.lenis) || window.lenis;
    if (lenis) {
      if (typeof lenis.start === 'function') {
        lenis.start();
      }
      if (typeof lenis.resize === 'function') {
        lenis.resize();
      }
      lenis.scrollTo(portfolio, { offset: offset, immediate: !smooth, duration: smooth ? 1.0 : 0 });
    } else {
      const top = portfolio.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0) + offset;
      window.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'auto' });
    }
  }
  window.scrollToPortfolioSection = scrollToPortfolioSection;

  // 1b. Theme Management & Hero Bottom Switch (Obsidian Dark Art Direction)
  function setTheme(theme) {
    document.documentElement.removeAttribute('data-theme');
    try { localStorage.removeItem('np_theme'); } catch (e) {}
    const heroSwitch = document.getElementById('hero-bottom-switch');
    const switchTooltip = document.getElementById('hero-switch-tooltip');
    if (heroSwitch) {
      heroSwitch.setAttribute('aria-checked', 'false');
      heroSwitch.setAttribute('disabled', 'true');
      heroSwitch.setAttribute('aria-disabled', 'true');
      heroSwitch.classList.remove('is-checked');
      heroSwitch.classList.add('is-disabled');
    }
    if (switchTooltip) {
      switchTooltip.textContent = 'Light mode (In development)';
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: 'dark' } }));
  }
  window.setTheme = setTheme;

  function initTheme() {
    try { localStorage.removeItem('np_theme'); } catch (e) {}
    document.documentElement.removeAttribute('data-theme');
    setTheme('dark');
  }
  window.initTheme = initTheme;

  function initHeroTvInteraction() {
    const tvWrapper = document.getElementById('hero-tv-wrapper');
    if (tvWrapper) {
      tvWrapper.style.transform = 'none';
    }
    initTheme();
    initHeroSwitch();
  }

  function initHeroSwitch() {
    const heroSwitch = document.getElementById('hero-bottom-switch');
    if (!heroSwitch) return;

    heroSwitch.setAttribute('disabled', 'true');
    heroSwitch.setAttribute('aria-disabled', 'true');
    heroSwitch.setAttribute('aria-checked', 'false');
    heroSwitch.classList.add('is-disabled');
    heroSwitch.classList.remove('is-checked');

    const switchTooltip = document.getElementById('hero-switch-tooltip');
    if (switchTooltip) {
      switchTooltip.textContent = 'Light mode (In development)';
    }
  }
  window.initHeroSwitch = initHeroSwitch;

  // 2. Multi-Page Navigation Helper with Smooth Fade Transition
  let isNavigating = false;

  function navigateTo(url) {
    if (!url) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const curtain = document.getElementById('page-transition-curtain');

    if (prefersReducedMotion || !curtain || isNavigating) {
      window.location.href = url;
      return;
    }

    isNavigating = true;
    sessionStorage.setItem('np_is_navigating', 'true');
    document.documentElement.classList.add('is-navigating-out', 'page-transitioning');
    document.body.classList.add('is-navigating-out', 'page-transitioning');
    lockSiteScroll();

    // Phase 1: Smoothly fade dark overlay in (opacity 0 -> 1)
    curtain.classList.remove('is-revealing');
    curtain.classList.add('is-covering');

    const duration = (window.TRANSITION_CONFIG && window.TRANSITION_CONFIG.coverDuration) || 1100;
    setTimeout(() => {
      window.location.href = url;
    }, duration);
  }
  window.navigateTo = navigateTo;

  // Reveal incoming page smoothly (dark overlay fades out: opacity 1 -> 0)
  function initPageTransitions() {
    const curtain = document.getElementById('page-transition-curtain');
    const isNavigatingIn = sessionStorage.getItem('np_is_navigating') === 'true';

    if (curtain && isNavigatingIn) {
      document.documentElement.classList.add('is-navigating-in', 'page-transitioning');
      document.body.classList.add('is-navigating-in', 'page-transitioning');
      window.scrollTo(0, 0);
      lockSiteScroll();

      const holdDuration = (window.TRANSITION_CONFIG && window.TRANSITION_CONFIG.holdDuration) || 800;
      const revealDuration = (window.TRANSITION_CONFIG && window.TRANSITION_CONFIG.revealDuration) || 1100;

      // Force layout reflow so opacity: 1 is guaranteed painted before fade-out starts
      void curtain.offsetHeight;

      // Wait 800ms on solid black screen before fading in the new page
      setTimeout(() => {
        requestAnimationFrame(() => {
          // Phase 3: Smoothly fade dark overlay out (opacity 1 -> 0)
          curtain.classList.remove('is-covering');
          curtain.classList.add('is-revealing');
          document.documentElement.classList.remove('is-navigating-in');
          document.body.classList.remove('is-navigating-in');

          // Trigger appearing animation IMMEDIATELY as fade begins (ZERO DELAY):
          if (window.triggerViewportTextReveal) {
            window.triggerViewportTextReveal();
          }

          setTimeout(() => {
            curtain.classList.remove('is-revealing');
            document.documentElement.classList.remove('page-transitioning');
            document.body.classList.remove('page-transitioning');
            sessionStorage.removeItem('np_is_navigating');
            isNavigating = false;
            unlockSiteScroll();

            if (sessionStorage.getItem('np_scroll_to_works') === 'true') {
              sessionStorage.removeItem('np_scroll_to_works');
              setTimeout(() => {
                if (window.scrollToPortfolioSection) {
                  window.scrollToPortfolioSection(true);
                }
              }, 50);
            }
          }, revealDuration);
        });
      }, holdDuration);
    } else if (!isNavigatingIn) {
      document.documentElement.classList.remove('is-navigating-in', 'is-navigating-out', 'page-transitioning');
      document.body.classList.remove('is-navigating-in', 'is-navigating-out', 'page-transitioning');
      unlockSiteScroll();
    }

    // Reset on browser back/forward history navigation (bfcache)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        sessionStorage.removeItem('np_is_navigating');
        document.documentElement.classList.remove('is-navigating-in', 'is-navigating-out', 'page-transitioning');
        document.body.classList.remove('is-navigating-in', 'is-navigating-out', 'page-transitioning');
        if (curtain) {
          curtain.classList.remove('is-covering', 'is-revealing');
        }
        isNavigating = false;
        unlockSiteScroll();
      }
    });
  }

  initPageTransitions();

  function updateActiveNavLinks(url) {
    const cleanUrl = (url || window.location.pathname).split('?')[0].split('#')[0];
    const isHomePage = cleanUrl === '/' || cleanUrl.endsWith('index.html') || cleanUrl === '';

    document.querySelectorAll('.nav-link, .hero-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const cleanHref = href.split('?')[0].split('#')[0];

      // Pure hash anchors (like #f3-portfolio) should not match full page URLs; handled by scroll-spy
      if (!cleanHref) {
        link.classList.remove('active');
        return;
      }

      if (isHomePage) {
        if (cleanHref === 'index.html' || cleanHref === '/') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      } else {
        if (cleanHref !== 'index.html' && cleanHref !== '/' && cleanUrl.endsWith(cleanHref)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // Portfolio Section Scroll-Spy (activates "Works" square only when portfolio is in view)
  function initPortfolioScrollSpy() {
    const portfolio = document.getElementById('f3-portfolio');
    const worksLink = document.getElementById('nav-works-link') || document.querySelector('a[href="#f3-portfolio"]');
    if (!portfolio || !worksLink) return;

    let portfolioTop = 0;
    let portfolioBottom = 0;

    function updatePortfolioMetrics() {
      const rect = portfolio.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      portfolioTop = rect.top + scrollY;
      portfolioBottom = rect.bottom + scrollY;
    }

    updatePortfolioMetrics();
    window.addEventListener('resize', updatePortfolioMetrics, { passive: true });

    function checkPosition(currentY) {
      const y = typeof currentY === 'number' ? currentY : (window.scrollY || window.pageYOffset || 0);
      const topInView = portfolioTop - y;
      const bottomInView = portfolioBottom - y;
      const isInView = topInView <= 200 && bottomInView >= 150;
      if (isInView) {
        worksLink.classList.add('active');
      } else {
        worksLink.classList.remove('active');
      }
    }

    let spyLenisHooked = false;
    function hookSpyLenis() {
      if (window.motionStack && window.motionStack.lenis && !spyLenisHooked) {
        spyLenisHooked = true;
        window.motionStack.lenis.on('scroll', (e) => checkPosition(e.scroll));
        return true;
      }
      return false;
    }

    window.addEventListener('scroll', () => {
      if (!spyLenisHooked) {
        if (!hookSpyLenis()) {
          checkPosition();
        }
      }
    }, { passive: true });

    setTimeout(() => {
      hookSpyLenis();
      updatePortfolioMetrics();
    }, 100);

    checkPosition();
  }

  // 3c. Nav Bar Status Line ASCII Scramble Transition on Scroll
  // Cycles between:
  //   State 'sharp': "Looking sharp today" (Hero Viewport)
  //   State 'works': "What stood out"       (Manifesto / Featured Works / Services)
  //   State 'shy':   "Dont be shy"          (Near Bottom Footer / Contact Section)
  function initNavStatusScramble() {
    const statusEl = document.getElementById('nav-status-line');
    const introSection = document.getElementById('f3-intro') || document.querySelector('.f3-section-intro');
    const footerSection = document.getElementById('f3-contact') || document.getElementById('f3-footer-curtain') || document.getElementById('f3-footer') || document.querySelector('.f3-editorial-footer');
    if (!statusEl || (!introSection && !footerSection)) return;

    const TEXT_HERO = 'Looking sharp today';
    const TEXT_WORKS = 'What stood out';
    const TEXT_SHY = 'Dont be shy';
    const ASCII_GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~\\X#0123456789ABCDEF!?:;';

    function getRandomGlyph() {
      return ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
    }

    let currentState = 'sharp'; // 'sharp' | 'works' | 'shy'
    let isScrambling = false;
    let queuedState = null;
    let activeIntervalId = null;

    let introTop = 0;
    let footerTop = 0;
    function updateNavMetrics() {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (introSection) {
        const rect = introSection.getBoundingClientRect();
        introTop = rect.top + scrollY;
      }
      if (footerSection) {
        const fRect = footerSection.getBoundingClientRect();
        footerTop = fRect.top + scrollY;
      }
    }

    updateNavMetrics();
    window.addEventListener('resize', updateNavMetrics, { passive: true });

    function scrambleNavText(targetText, duration = 700) {
      return new Promise((resolve) => {
        if (activeIntervalId) {
          clearInterval(activeIntervalId);
          activeIntervalId = null;
        }

        const startText = statusEl.textContent.trim() || TEXT_HERO;
        const maxLen = Math.max(startText.length, targetText.length);
        const fps = 36;
        const totalFrames = Math.max(20, Math.floor((duration / 1000) * fps));
        let frame = 0;

        // Shuffled resolution order (randomized indices, NOT progressive left-to-right)
        const indices = Array.from({ length: maxLen }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const resolveFrames = new Array(maxLen);
        for (let k = 0; k < maxLen; k++) {
          const charIndex = indices[k];
          const staggerRatio = k / Math.max(1, maxLen);
          resolveFrames[charIndex] = Math.floor(totalFrames * (0.30 + staggerRatio * 0.55));
        }

        activeIntervalId = setInterval(() => {
          frame++;
          let result = '';

          for (let i = 0; i < maxLen; i++) {
            if (i >= targetText.length) {
              // Trailing character dissolve
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

          statusEl.textContent = result;

          if (frame >= totalFrames) {
            clearInterval(activeIntervalId);
            activeIntervalId = null;
            statusEl.textContent = targetText;
            if (typeof window.initMonoLetterShuffle === 'function') {
              window.initMonoLetterShuffle(statusEl);
            }
            resolve();
          }
        }, 1000 / fps);
      });
    }

    async function transitionTo(targetState) {
      if (currentState === targetState && !isScrambling) return;

      if (isScrambling) {
        queuedState = targetState;
        return;
      }

      currentState = targetState;
      isScrambling = true;

      let targetText = TEXT_HERO;
      if (targetState === 'shy') {
        targetText = TEXT_SHY;
      } else if (targetState === 'works') {
        targetText = TEXT_WORKS;
      }

      await scrambleNavText(targetText, 550);
      isScrambling = false;

      if (queuedState && queuedState !== currentState) {
        const next = queuedState;
        queuedState = null;
        transitionTo(next);
      } else {
        queuedState = null;
      }
    }

    function checkNavScroll(currentY) {
      const y = typeof currentY === 'number' ? currentY : (window.scrollY || window.pageYOffset || 0);
      const viewportHeight = window.innerHeight || 800;
      const threshold = viewportHeight * 0.70;

      if (footerSection && (footerTop - y) <= threshold) {
        transitionTo('shy');
      } else if (introSection && (introTop - y) <= threshold) {
        transitionTo('works');
      } else {
        transitionTo('sharp');
      }
    }

    let scrambleLenisHooked = false;
    function hookScrambleLenis() {
      if (window.motionStack && window.motionStack.lenis && !scrambleLenisHooked) {
        scrambleLenisHooked = true;
        window.motionStack.lenis.on('scroll', (e) => checkNavScroll(e.scroll));
        return true;
      }
      return false;
    }

    window.addEventListener('scroll', () => {
      if (!scrambleLenisHooked) {
        if (!hookScrambleLenis()) {
          checkNavScroll();
        }
      }
    }, { passive: true });

    setTimeout(() => {
      hookScrambleLenis();
      updateNavMetrics();
      checkNavScroll();
    }, 100);

    setTimeout(() => {
      updateNavMetrics();
      checkNavScroll();
    }, 600);

    checkNavScroll();
  }

  window.initNavStatusScramble = initNavStatusScramble;
  initPortfolioScrollSpy();
  initNavStatusScramble();

  function rehydratePage(url, mainElement) {
    // Re-initialize Lucide Icons
    if (window.initIcons) window.initIcons();

    // Route-specific initializers
    if (url.includes('works.html')) {
      if (window.initWorksPage) window.initWorksPage();
    } else if (url.includes('project.html')) {
      if (window.initProjectPage) window.initProjectPage();
    } else if (url.includes('index.html') || url.split('#')[0].endsWith('/') || url.includes('#f3-portfolio')) {
      if (window.initHeroTvAscii) {
        window.initHeroTvAscii();
      }
      if (window.initHeroScrollTransition) {
        setTimeout(() => window.initHeroScrollTransition(), 50);
      }
      if (window.initFutureThreeScroll) {
        window.initFutureThreeScroll();
      }
      initHeroTvInteraction();
      initPortfolioScrollSpy();
      initNavStatusScramble();
      if (window.initModularDropdown) {
        window.initModularDropdown();
      }
      if (window.initTextFlip) {
        window.initTextFlip();
      }
      if (window.initHeroHeadlineScramble) {
        window.initHeroHeadlineScramble(true);
      }
      if (window.initLavaSparks) {
        window.initLavaSparks();
      }
    }

    // Refresh GSAP ScrollTrigger & Motion Stack
    if (window.motionStack) {
      window.motionStack.initScrollReveals();
      window.motionStack.initMagneticButtons();
      window.motionStack.refresh();
    }

    if (typeof updateNavbarTheme === 'function') {
      updateNavbarTheme();
    }
  }

  // Single Unified Internal Link & Brand Navigation Click Interceptor
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || target === '_blank' || e.metaKey || e.ctrlKey) {
      return;
    }

    if (link.getAttribute('aria-disabled') === 'true' || link.dataset.cursor === 'In development') {
      e.preventDefault();
      return;
    }

    // Ignore project modal triggers and in-situ overlay links
    if (link.closest('.f3-work-card, .f3-list-item-row') || link.hasAttribute('data-project-id') || link.closest('#pm-modal-overlay')) {
      return;
    }

    // Check external vs internal domain
    try {
      const targetUrl = new URL(href, window.location.href);
      if (targetUrl.origin !== window.location.origin) return;
    } catch (err) {
      // Relative path is internal
    }

    const curNavPath = window.location.pathname;
    const isHomePage = curNavPath === '/' || curNavPath.endsWith('/') || curNavPath.endsWith('/index.html') || curNavPath.endsWith('index.html');

    // Direct click on N/P brand logo / Home link
    const isBrandHomeClick = link.classList.contains('hero-nav-brand') ||
      link.classList.contains('nav-box-brand') ||
      link.id === 'nav-home-link' ||
      link.getAttribute('aria-label')?.includes('Home') ||
      link.querySelector('.nav-brand-logo');

    if (isBrandHomeClick) {
      if (typeof closeNavDropdown === 'function') {
        closeNavDropdown();
      }

      sessionStorage.removeItem('np_scroll_to_works');

      if (isHomePage) {
        e.preventDefault();
        if (window.location.hash && window.history.pushState) {
          window.history.pushState(null, '', '/');
        }
        if (window.motionStack && window.motionStack.lenis) {
          window.motionStack.lenis.scrollTo(0, { immediate: false, duration: 0.8 });
        } else if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: false, duration: 0.8 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      } else {
        // When on a subpage (e.g. project.html), smoothly cross-fade to home root
        e.preventDefault();
        navigateTo('/');
        return;
      }
    }

    // Direct click on Projects / Works link (e.g. #nav-works-link in dropdown)
    const isProjectsClick = link.id === 'nav-works-link' ||
      link.dataset.scrollTarget === 'works' ||
      link.dataset.scrollTarget === 'portfolio' ||
      href === '#f3-portfolio' ||
      href === '/#f3-portfolio' ||
      href === '#works' ||
      href === '/#works' ||
      href === '#projects' ||
      href === '/#projects';

    if (isProjectsClick) {
      if (typeof closeNavDropdown === 'function') {
        closeNavDropdown();
      }

      if (isHomePage) {
        e.preventDefault();
        // Clean URL if any hash exists - keep URL clean without #f3-portfolio
        if (window.location.hash && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        scrollToPortfolioSection(true);
        return;
      } else {
        // When on a subpage (e.g. project.html, about.html, privacy.html),
        // smoothly transition to home root and trigger scroll on arrival
        e.preventDefault();
        sessionStorage.setItem('np_scroll_to_works', 'true');
        navigateTo('/');
        return;
      }
    }

    // In-page hash anchor clicks on the home page (e.g. #f3-portfolio, #f3-intro, #f3-footer)
    if (href.startsWith('#') || (isHomePage && (href.startsWith('index.html#') || href.startsWith('/#')))) {
      const hash = href.includes('#') ? '#' + href.split('#')[1] : href;
      let targetElem = document.querySelector(hash);
      if (hash === '#f3-portfolio' || hash === '#works' || hash === '#projects') {
        targetElem = document.querySelector('.f3-intro-divider-row') || document.querySelector('.f3-featured-tag-row') || targetElem;
      }
      if (targetElem) {
        e.preventDefault();
        if (typeof closeNavDropdown === 'function') {
          closeNavDropdown();
        }
        const offset = (hash === '#f3-portfolio' || hash === '#works' || hash === '#projects') ? 0 : -20;
        if (window.motionStack && window.motionStack.lenis) {
          window.motionStack.lenis.scrollTo(targetElem, { offset: offset, duration: 1.0 });
        } else if (window.lenis) {
          window.lenis.scrollTo(targetElem, { offset: offset, duration: 1.0 });
        } else {
          const top = targetElem.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0) + offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
        return;
      }
    }

    // Cross-page navigation with transition
    e.preventDefault();
    navigateTo(href);
  });

  // Handle browser back/forward buttons smoothly
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      if (window.location.hash === '#f3-portfolio' || window.location.hash === '#works' || window.location.hash === '#projects') {
        scrollToPortfolioSection(true);
        if (window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        return;
      }
      let targetElem = document.querySelector(window.location.hash);
      if (targetElem) {
        const offset = -20;
        if (window.motionStack && window.motionStack.lenis) {
          window.motionStack.lenis.scrollTo(targetElem, { offset: offset, duration: 0.8 });
        } else {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });


  // 3. Permanent Navbar Dark Theme (User specified: never turns white)
  function updateNavbarTheme() {
    const navs = document.querySelectorAll('.hero-top-nav, .site-nav-top');
    if (!navs.length) return;

    navs.forEach(nav => {
      nav.classList.add('nav-theme-dark');
      nav.classList.remove('nav-theme-light');
    });
  }

  window.updateNavbarTheme = updateNavbarTheme;

  // 3b. Permanent Navigation Bar Visibility on Scroll (Never hides on scroll down)
  const navElements = document.querySelectorAll('.hero-top-nav, .site-nav-top');
  let heroBottomCache = 0;

  function updateHeroMetrics() {
    const heroViewport = document.getElementById('hero-viewport');
    if (heroViewport) {
      const rect = heroViewport.getBoundingClientRect();
      heroBottomCache = rect.top + (window.scrollY || window.pageYOffset || 0) + heroViewport.offsetHeight;
    } else {
      heroBottomCache = 0;
    }
  }

  function handleNavScroll(currentY) {
    updateNavbarTheme();
    // Navbar stays permanently visible across all scroll positions
    navElements.forEach(el => el.classList.remove('nav-hidden'));
  }

  let lenisNavHooked = false;
  function hookLenisNav() {
    if (window.motionStack && window.motionStack.lenis && !lenisNavHooked) {
      lenisNavHooked = true;
      window.motionStack.lenis.on('scroll', (e) => {
        handleNavScroll(e.scroll);
      });
      return true;
    }
    return false;
  }

  window.addEventListener('scroll', () => {
    if (!lenisNavHooked) {
      if (!hookLenisNav()) {
        handleNavScroll(window.scrollY || window.pageYOffset || 0);
      }
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateNavbarTheme();
    updateHeroMetrics();
  }, { passive: true });

  // Initial call on page boot
  updateHeroMetrics();
  updateNavbarTheme();

  // Hook into Lenis smooth scroll updates
  setTimeout(() => {
    hookLenisNav();
    updateHeroMetrics();
  }, 100);

  // 4. Live Ho Chi Minh City / GMT+7 Clock & Date
  function updateLiveClock() {
    const clockElements = document.querySelectorAll('.live-clock');
    const dateElements = document.querySelectorAll('.live-date');
    const now = new Date();

    try {
      const clockOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', clockOptions).format(now).toUpperCase();
      clockElements.forEach(el => {
        if (el.classList.contains('header-clock')) {
          el.textContent = `${timeStr} (GMT+7)`;
        } else {
          el.textContent = timeStr;
        }
      });
    } catch (e) {
      const hours = String((now.getUTCHours() + 7) % 24).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      clockElements.forEach(el => {
        el.textContent = `${hours}:${minutes}`;
      });
    }

    if (dateElements.length) {
      try {
        const dateOptions = {
          timeZone: 'Asia/Ho_Chi_Minh',
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        };
        const dateStr = new Intl.DateTimeFormat('en-US', dateOptions).format(now).toUpperCase().replace(',', '');
        dateElements.forEach(el => {
          el.textContent = dateStr;
        });
      } catch (e) {
        dateElements.forEach(el => {
          el.textContent = 'SAT NOV 15';
        });
      }
    }
  }

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // 4. Smooth Weighted Difference Circle Cursor
  let cursor = document.querySelector('.custom-cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  }

  let mouseX = -9999;
  let mouseY = -9999;
  let cursorX = -9999;
  let cursorY = -9999;
  let userHasInteracted = false;
  const CURSOR_SPEED = 0.13;

  let cursorRafId = null;
  let cursorIdleTimer = null;
  let cursorAnimRunning = false;

  function animateCursor() {
    if (userHasInteracted) {
      cursorX += (mouseX - cursorX) * CURSOR_SPEED;
      cursorY += (mouseY - cursorY) * CURSOR_SPEED;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }

    cursorRafId = requestAnimationFrame(animateCursor);
  }

  function startCursorAnim() {
    if (cursorAnimRunning) return;
    cursorAnimRunning = true;
    animateCursor();
  }

  function stopCursorAnim() {
    if (!cursorAnimRunning) return;
    cursorAnimRunning = false;
    if (cursorRafId) {
      cancelAnimationFrame(cursorRafId);
      cursorRafId = null;
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!userHasInteracted) {
      cursorX = mouseX;
      cursorY = mouseY;
      userHasInteracted = true;
    }

    const isLoaderActive = document.body.classList.contains('is-loading') ||
      (typeof loaderFinished !== 'undefined' && !loaderFinished);
    if (!isLoaderActive) cursor.style.opacity = '1';

    // Keep cursor loop alive while moving; idle-stop after 150ms of no movement
    startCursorAnim();
    clearTimeout(cursorIdleTimer);
    cursorIdleTimer = setTimeout(stopCursorAnim, 150);
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (userHasInteracted && loaderFinished && !document.body.classList.contains('is-loading')) {
      cursor.style.opacity = '1';
    }
  });

  // Hide custom cursor over delicate icon buttons (phone CTA, modal close) if desired
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest && e.target.closest('.nav-floating-cta, .pm-close-btn')) {
      cursor.classList.add('is-hidden');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.closest && e.target.closest('.nav-floating-cta, .pm-close-btn')) {
      cursor.classList.remove('is-hidden');
    }
  });

  // 5. Mobile Navigation Menu
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.mobile-close-btn');

  if (menuBtn && mobileOverlay) {
    menuBtn.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
      });
    }

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
      });
    });
  }

  // 5b. Modular Navbar Hamburger Dropdown Menu
  function closeNavDropdown() {
    const menu = document.getElementById('nav-dropdown-menu');
    const btn = document.getElementById('nav-hamburger-btn');
    const backdrop = document.getElementById('nav-dropdown-backdrop');
    if (!menu) return;
    menu.classList.remove('is-open');
    if (btn) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-expanded', 'false');
    }
    menu.setAttribute('aria-hidden', 'true');
    if (backdrop) {
      backdrop.classList.remove('is-active');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('nav-dropdown-active');
    document.documentElement.classList.remove('nav-dropdown-active');

    // Resume Lenis smooth scroll if not inside project modal
    const lenis = (window.motionStack && window.motionStack.lenis) || window.lenis;
    if (lenis && typeof lenis.start === 'function' && !document.body.classList.contains('pm-modal-active')) {
      lenis.start();
    }
  }

  function openNavDropdown() {
    const menu = document.getElementById('nav-dropdown-menu');
    const btn = document.getElementById('nav-hamburger-btn');
    const backdrop = document.getElementById('nav-dropdown-backdrop');
    if (!menu) return;
    menu.classList.add('is-open');
    if (btn) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');
    }
    menu.setAttribute('aria-hidden', 'false');
    if (backdrop) {
      backdrop.classList.add('is-active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('nav-dropdown-active');
    document.documentElement.classList.add('nav-dropdown-active');

    // Pause Lenis smooth scroll while dropdown menu is active
    const lenis = (window.motionStack && window.motionStack.lenis) || window.lenis;
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }
  }

  function initModularDropdown() {
    const navHamburgerBtn = document.getElementById('nav-hamburger-btn');
    const navDropdownMenu = document.getElementById('nav-dropdown-menu');
    const navDropdownBackdrop = document.getElementById('nav-dropdown-backdrop');

    if (!navHamburgerBtn || !navDropdownMenu) return;
    if (navHamburgerBtn._hasDropdownInit) return;
    navHamburgerBtn._hasDropdownInit = true;

    let isCooldown = false;
    const COOLDOWN_DURATION_MS = 280;

    navHamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Prevent spamming when animation hasn't finished yet
      if (isCooldown) return;
      isCooldown = true;
      setTimeout(() => {
        isCooldown = false;
      }, COOLDOWN_DURATION_MS);

      const isOpen = navDropdownMenu.classList.contains('is-open');
      if (isOpen) {
        closeNavDropdown();
      } else {
        openNavDropdown();
      }
    });

    if (navDropdownBackdrop && !navDropdownBackdrop._hasDropdownInit) {
      navDropdownBackdrop._hasDropdownInit = true;
      navDropdownBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeNavDropdown();
      });
    }

    if (!window._dropdownDocListenersInit) {
      window._dropdownDocListenersInit = true;

      // Close on click outside
      document.addEventListener('click', (e) => {
        const curMenu = document.getElementById('nav-dropdown-menu');
        const curBtn = document.getElementById('nav-hamburger-btn');
        if (curMenu && curMenu.classList.contains('is-open')) {
          if (!curMenu.contains(e.target) && (!curBtn || !curBtn.contains(e.target))) {
            closeNavDropdown();
          }
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        const curMenu = document.getElementById('nav-dropdown-menu');
        if (e.key === 'Escape' && curMenu && curMenu.classList.contains('is-open')) {
          closeNavDropdown();
        }
      });
    }

    // Close on dropdown link click
    navDropdownMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('aria-disabled') === 'true' || link.getAttribute('href') === 'javascript:void(0)') {
          e.preventDefault();
          return;
        }
        closeNavDropdown();
      });
    });

    const navFloatingCta = document.getElementById('nav-floating-cta');
    if (navFloatingCta) {
      navFloatingCta.addEventListener('click', () => {
        closeNavDropdown();
      });
    }
  }

  window.initModularDropdown = initModularDropdown;
  initModularDropdown();

  // 6. Highlight Active Navigation Item Initial
  updateActiveNavLinks(window.location.pathname);
  initPortfolioScrollSpy();

  // 7. Live GMT+7 Clock Engine
  function updateLiveClockGMT7() {
    const clockElements = document.querySelectorAll('.live-clock-gmt, .live-clock');
    if (!clockElements.length) return;

    try {
      const now = new Date();
      // Format 24-hour time with seconds in GMT+7 (Asia/Ho_Chi_Minh)
      const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      const formatted = `${timeStr} (GMT+7)`;
      const formattedUTC7 = `${timeStr} UTC+7`;

      clockElements.forEach(el => {
        if (el.classList.contains('nav-dropdown-clock') || el.closest('.nav-dropdown-menu') || el.classList.contains('f3-footer-clock') || el.closest('.f3-footer-colophon-bar')) {
          el.textContent = formattedUTC7;
        } else {
          el.textContent = formatted;
        }
      });

      const introTimeElements = document.querySelectorAll('.f3-intro-live-time');
      if (introTimeElements.length) {
        introTimeElements.forEach(el => {
          el.textContent = timeStr;
        });
      }
    } catch (e) {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const gmt7 = new Date(utc + (3600000 * 7));
      const hours = String(gmt7.getHours()).padStart(2, '0');
      const minutes = String(gmt7.getMinutes()).padStart(2, '0');
      const seconds = String(gmt7.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;
      const formatted = `${timeStr} (GMT+7)`;
      const formattedUTC7 = `${timeStr} UTC+7`;
      clockElements.forEach(el => {
        if (el.classList.contains('nav-dropdown-clock') || el.closest('.nav-dropdown-menu') || el.classList.contains('f3-footer-clock') || el.closest('.f3-footer-colophon-bar')) {
          el.textContent = formattedUTC7;
        } else {
          el.textContent = formatted;
        }
      });

      const introTimeElements = document.querySelectorAll('.f3-intro-live-time');
      if (introTimeElements.length) {
        introTimeElements.forEach(el => {
          el.textContent = timeStr;
        });
      }
    }
  }

  const clockIntervalId = setInterval(updateLiveClockGMT7, 1000);
  updateLiveClockGMT7();

  // 8. Description Anchor Sync for Top Navigation (Group B left edge === Description left edge)
  let syncRafId = null;
  function syncNavAnchorToDescription() {
    if (syncRafId) cancelAnimationFrame(syncRafId);
    syncRafId = requestAnimationFrame(() => {
      const desc = document.querySelector('.hero-bottom-desc');
      const anchor = document.getElementById('nav-anchor-container');
      if (!desc || !anchor) return;

      const descRect = desc.getBoundingClientRect();
      if (descRect && descRect.left > 0) {
        document.documentElement.style.setProperty('--nav-desc-left', `${descRect.left}px`);
      }
    });
  }

  window.syncNavAnchorToDescription = syncNavAnchorToDescription;

  // Run on load, resize, and layout changes
  window.addEventListener('resize', syncNavAnchorToDescription, { passive: true });
  let bottomBarRo = null;
  if (window.ResizeObserver) {
    const bottomBar = document.querySelector('.hero-bottom-bar');
    if (bottomBar) {
      bottomBarRo = new ResizeObserver(() => syncNavAnchorToDescription());
      bottomBarRo.observe(bottomBar);
    }
  }
  setTimeout(syncNavAnchorToDescription, 60);
  setTimeout(syncNavAnchorToDescription, 300);
  setTimeout(syncNavAnchorToDescription, 1000);

  // Lifecycle Cleanup on page navigation
  window.addEventListener('pagehide', () => {
    clearInterval(clockIntervalId);
    if (syncRafId) cancelAnimationFrame(syncRafId);
    if (bottomBarRo) bottomBarRo.disconnect();
  }, { once: true });
}

function handleAppResponsive() {
  if (window.matchMedia('(min-width: 1024px)').matches) {
    initDesktopApp();
  } else {
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
    const loader = document.getElementById('site-loader');
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
  }
}

const appDesktopQuery = window.matchMedia('(min-width: 1024px)');
if (appDesktopQuery.addEventListener) {
  appDesktopQuery.addEventListener('change', handleAppResponsive);
} else {
  appDesktopQuery.addListener(handleAppResponsive);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleAppResponsive);
} else {
  handleAppResponsive();
}
