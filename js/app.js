/**
 * ==========================================================================
 * USER CONFIGURATION: Page Transition & Motion Speeds
 * Easily adjust timing (in milliseconds) below:
 * ==========================================================================
 */
window.TRANSITION_CONFIG = {
  coverDuration: 1100,    // Milliseconds for curtain to drag UP and cover
  revealDuration: 1200,   // Milliseconds for curtain to continue UP and reveal
  easeCover: 'cubic-bezier(0.65, 0, 0.15, 1)',
  easeReveal: 'cubic-bezier(0.16, 1, 0.3, 1)'
};

document.addEventListener('DOMContentLoaded', () => {

  // 1. First-Time Access Check & Intro Loader
  const loader = document.getElementById('site-loader');
  const slash = document.getElementById('loader-slash');
  const lockup = document.querySelector('.loader-brand-lockup');
  const hasSeenIntro = sessionStorage.getItem('np_has_seen_intro');

  // Defensive fallback: ensure loader-r exists in loader lockup
  const loaderP = document.getElementById('loader-p');
  let loaderR = document.getElementById('loader-r');
  if (!loaderR && loaderP) {
    loaderR = document.createElement('sup');
    loaderR.className = 'loader-r';
    loaderR.id = 'loader-r';
    loaderR.setAttribute('aria-hidden', 'true');
    loaderR.textContent = '®';
    loaderP.appendChild(loaderR);
  }

  let loaderFinished = !!hasSeenIntro;

  if (!hasSeenIntro && loader && slash && lockup) {
    document.body.classList.add('is-loading');

    // Blink 1
    setTimeout(() => { slash.style.opacity = '1'; }, 100);
    setTimeout(() => { slash.style.opacity = '0'; }, 380);

    // Blink 2
    setTimeout(() => { slash.style.opacity = '1'; }, 580);
    setTimeout(() => { slash.style.opacity = '0'; }, 860);

    // Blink 3
    setTimeout(() => { slash.style.opacity = '1'; }, 1060);
    setTimeout(() => { slash.style.opacity = '0'; }, 1340);

    // 4th Beat: Slash emerges solid & N/P slide out from behind /
    setTimeout(() => {
      slash.style.opacity = '1';
      lockup.classList.add('popped');
    }, 1540);

    // 5th Beat: Copyright R (®) pops up right as letters settle
    setTimeout(() => {
      lockup.classList.add('r-popped');
    }, 1980);

    // 6th Beat: Fullscreen loader slides up, revealing the page
    setTimeout(() => {
      loader.classList.add('slide-up');
      document.body.classList.remove('is-loading');
      document.body.classList.add('loader-revealed');
      loaderFinished = true;
      sessionStorage.setItem('np_has_seen_intro', 'true');
      initHeroTvInteraction();
      if (window.location.hash === '#f3-portfolio') {
        setTimeout(() => scrollToPortfolioSection(true), 400);
      }
    }, 2520);

    // 7th Beat: Loader completely leaves viewport
    setTimeout(() => {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }, 3420);
  } else {
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
    document.body.classList.remove('is-loading');
    document.body.classList.add('loader-revealed');
    initHeroTvInteraction();
    if (window.location.hash === '#f3-portfolio') {
      setTimeout(() => scrollToPortfolioSection(true), 250);
    }
  }

  // Helper: Smooth scroll to the Portfolio / Works section on the hero site
  function scrollToPortfolioSection(smooth = true) {
    const portfolio = document.getElementById('f3-portfolio');
    if (!portfolio) {
      const curPath = window.location.pathname;
      const isHome = curPath === '/' || curPath.endsWith('/') || curPath.endsWith('/index.html') || curPath.endsWith('index.html');
      if (!isHome) {
        navigateTo('index.html#f3-portfolio');
      }
      return;
    }
    if (window.motionStack && window.motionStack.lenis) {
      window.motionStack.lenis.resize();
      window.motionStack.lenis.scrollTo(portfolio, { offset: -20, immediate: !smooth, duration: smooth ? 1.2 : 0 });
    } else if (window.lenis) {
      window.lenis.scrollTo(portfolio, { offset: -20, immediate: !smooth, duration: smooth ? 1.2 : 0 });
    } else {
      portfolio.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }
  window.scrollToPortfolioSection = scrollToPortfolioSection;

  // 1b. Hero TV Setup (Hover & Tilt disabled per user instruction)
  function initHeroTvInteraction() {
    const tvWrapper = document.getElementById('hero-tv-wrapper');
    if (tvWrapper) {
      tvWrapper.style.transform = 'none';
    }
  }

  // 2. Pure Upward SPA Page Transition Engine
  let curtain = document.querySelector('.page-transition-curtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'page-transition-curtain';
    document.body.appendChild(curtain);
  }

  let isTransitioning = false;

  async function navigateTo(url, push = true) {
    if (isTransitioning) return;
    isTransitioning = true;

    const config = window.TRANSITION_CONFIG || { coverDuration: 480, revealDuration: 520, easeCover: 'cubic-bezier(0.65, 0, 0.15, 1)', easeReveal: 'cubic-bezier(0.16, 1, 0.3, 1)' };

    try {
      let fetchUrl = url.split('#')[0] || 'index.html';
      if (fetchUrl === '' || fetchUrl === '/' || fetchUrl === './') {
        fetchUrl = 'index.html';
      }
      const fetchPromise = fetch(fetchUrl).then(res => res.text());

      // 1. Animate curtain smoothly UP to cover screen
      curtain.style.transition = `transform ${config.coverDuration}ms ${config.easeCover}`;
      curtain.style.transform = 'translateY(0)';

      const [htmlText] = await Promise.all([
        fetchPromise,
        new Promise(resolve => setTimeout(resolve, config.coverDuration))
      ]);

      // 2. Parse fetched HTML and swap main content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      document.title = doc.title;

      const currentMain = document.querySelector('main');
      const newMain = doc.querySelector('main');

      if (currentMain && newMain) {
        currentMain.parentNode.replaceChild(newMain, currentMain);
      }

      if (push) {
        window.history.pushState({ url }, '', url);
      }

      window.scrollTo(0, 0);
      if (window.motionStack && window.motionStack.lenis) {
        window.motionStack.lenis.scrollTo(0, { immediate: true });
      }

      updateActiveNavLinks(url);
      rehydratePage(url, newMain);

      // 3. Animate curtain continuing UPWARD to reveal new page
      curtain.style.transition = `transform ${config.revealDuration}ms ${config.easeReveal}`;
      curtain.style.transform = 'translateY(-100%)';

      setTimeout(() => {
        curtain.style.transition = 'none';
        curtain.style.transform = 'translateY(100%)';
        isTransitioning = false;

        if (url.includes('#f3-portfolio') || window.location.hash === '#f3-portfolio') {
          setTimeout(() => scrollToPortfolioSection(true), 60);
        }
      }, config.revealDuration + 40);

    } catch (err) {
      console.error('SPA Navigation fallback:', err && err.stack ? err.stack : err);
      window.location.href = url;
    }
  }

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

    function checkPosition() {
      const rect = portfolio.getBoundingClientRect();
      const isInView = rect.top <= 200 && rect.bottom >= 150;
      if (isInView) {
        worksLink.classList.add('active');
      } else {
        worksLink.classList.remove('active');
      }
    }

    window.addEventListener('scroll', checkPosition, { passive: true });
    if (window.motionStack && window.motionStack.lenis) {
      window.motionStack.lenis.on('scroll', checkPosition);
    }
    checkPosition();
  }

  function rehydratePage(url, mainElement) {
    // Re-initialize Lucide Icons
    if (window.initIcons) window.initIcons();

    // Route-specific initializers
    if (url.includes('works.html')) {
      if (window.initWorksPage) window.initWorksPage();
    } else if (url.includes('project.html')) {
      if (window.initProjectPage) window.initProjectPage();
    } else if (url.includes('contact.html')) {
      if (window.initContactPage) window.initContactPage();
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
    }

    // Refresh GSAP ScrollTrigger & Motion Stack
    if (window.motionStack) {
      window.motionStack.initScrollReveals();
      window.motionStack.initMagneticButtons();
      window.motionStack.refresh();
    }
  }

    // Intercept internal page link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http://') || href.startsWith('https://') || target === '_blank' || e.metaKey || e.ctrlKey) {
      return;
    }

    // Direct click on N/P brand logo / Home link when already on home page
    const isBrandHomeClick = link.classList.contains('hero-nav-brand') || link.classList.contains('nav-box-brand');
    const curNavPath = window.location.pathname;
    const isHomePage = curNavPath === '/' || curNavPath.endsWith('/') || curNavPath.endsWith('/index.html') || curNavPath.endsWith('index.html');
    const cleanHref = href.split('?')[0].split('#')[0];
    const isHomeHref = cleanHref === '' || cleanHref === '/' || cleanHref === 'index.html' || cleanHref === '/index.html' || cleanHref === './' || cleanHref === './index.html';

    if (isBrandHomeClick && isHomePage && isHomeHref) {
      e.preventDefault();
      if (window.motionStack && window.motionStack.lenis) {
        window.motionStack.lenis.scrollTo(0, { immediate: false, duration: 1.0 });
      } else if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: false, duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (window.location.hash) {
        if (window.history.pushState) {
          window.history.pushState(null, '', window.location.pathname);
        }
      }
      return;
    }

    // Direct click on Works / #f3-portfolio
    if (href === '#f3-portfolio' || href === 'index.html#f3-portfolio' || href === '/#f3-portfolio') {
      if (isHomePage) {
        e.preventDefault();
        scrollToPortfolioSection(true);
        if (window.history.pushState) {
          window.history.pushState(null, '', '#f3-portfolio');
        }
        return;
      } else {
        e.preventDefault();
        navigateTo('index.html#f3-portfolio');
        return;
      }
    }

    if (href.startsWith('#')) {
      return;
    }

    e.preventDefault();
    navigateTo(href);
  });

  // Handle browser back/forward buttons seamlessly
  window.addEventListener('popstate', (e) => {
    if (window.location.hash === '#f3-portfolio') {
      scrollToPortfolioSection(true);
      return;
    }
    navigateTo(window.location.href, false);
  });

  
  // 3. Smart Taskbar Hide on Scroll Down / Reveal on Scroll Up
  let lastScrollY = window.scrollY || 0;
  const navElements = document.querySelectorAll('.hero-top-nav, .site-nav-top');

  function handleNavScroll(currentY) {
    if (currentY <= 15) {
      navElements.forEach(el => el.classList.remove('nav-hidden'));
      lastScrollY = currentY;
      return;
    }

    const delta = currentY - lastScrollY;
    if (Math.abs(delta) < 6) return;

    if (delta > 0) {
      // Scrolling down -> Hide taskbar
      navElements.forEach(el => el.classList.add('nav-hidden'));
    } else {
      // Scrolling up -> Reveal taskbar
      navElements.forEach(el => el.classList.remove('nav-hidden'));
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', () => {
    handleNavScroll(window.scrollY || window.pageYOffset || 0);
  }, { passive: true });

  // Hook into Lenis smooth scroll updates
  setTimeout(() => {
    if (window.motionStack && window.motionStack.lenis) {
      window.motionStack.lenis.on('scroll', (e) => {
        handleNavScroll(e.scroll);
      });
    }
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
    if (!isLoaderActive) {
      cursor.style.opacity = '1';
    }
  });

  const CURSOR_SPEED = 0.13;

  function animateCursor() {
    if (userHasInteracted) {
      cursorX += (mouseX - cursorX) * CURSOR_SPEED;
      cursorY += (mouseY - cursorY) * CURSOR_SPEED;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (userHasInteracted && loaderFinished && !document.body.classList.contains('is-loading')) {
      cursor.style.opacity = '1';
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

      clockElements.forEach(el => {
        el.textContent = formatted;
      });
    } catch (e) {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const gmt7 = new Date(utc + (3600000 * 7));
      const hours = String(gmt7.getHours()).padStart(2, '0');
      const minutes = String(gmt7.getMinutes()).padStart(2, '0');
      const seconds = String(gmt7.getSeconds()).padStart(2, '0');
      const formatted = `${hours}:${minutes}:${seconds} (GMT+7)`;
      clockElements.forEach(el => {
        el.textContent = formatted;
      });
    }
  }

  setInterval(updateLiveClockGMT7, 1000);
  updateLiveClockGMT7();

  // 8. Description Anchor Sync for Top Navigation (Group B left edge === Description left edge)
  function syncNavAnchorToDescription() {
    const desc = document.querySelector('.hero-bottom-desc');
    const anchor = document.getElementById('nav-anchor-container');
    if (!desc || !anchor) return;

    const descRect = desc.getBoundingClientRect();
    if (descRect && descRect.left > 0) {
      document.documentElement.style.setProperty('--nav-desc-left', `${descRect.left}px`);
    }
  }

  window.syncNavAnchorToDescription = syncNavAnchorToDescription;

  // Run on load, resize, and layout changes
  window.addEventListener('resize', syncNavAnchorToDescription);
  if (window.ResizeObserver) {
    const bottomBar = document.querySelector('.hero-bottom-bar');
    if (bottomBar) {
      const ro = new ResizeObserver(() => syncNavAnchorToDescription());
      ro.observe(bottomBar);
    }
  }
  setTimeout(syncNavAnchorToDescription, 60);
  setTimeout(syncNavAnchorToDescription, 300);
  setTimeout(syncNavAnchorToDescription, 1000);
});
