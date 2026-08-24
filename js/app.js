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

  let loaderFinished = !!hasSeenIntro;

  if (!hasSeenIntro && loader && slash && lockup) {
    document.body.classList.add('is-loading');

    setTimeout(() => { slash.style.opacity = '1'; }, 100);
    setTimeout(() => { slash.style.opacity = '0'; }, 380);

    setTimeout(() => { slash.style.opacity = '1'; }, 580);
    setTimeout(() => { slash.style.opacity = '0'; }, 860);

    setTimeout(() => {
      slash.style.opacity = '1';
      lockup.classList.add('popped');
    }, 1080);

    setTimeout(() => {
      loader.classList.add('slide-up');
      document.body.classList.remove('is-loading');
      loaderFinished = true;
      sessionStorage.setItem('np_has_seen_intro', 'true');
    }, 1680);

    setTimeout(() => {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }, 2580);
  } else {
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
    document.body.classList.remove('is-loading');
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
      const fetchPromise = fetch(url).then(res => res.text());

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
      }, config.revealDuration + 40);

    } catch (err) {
      console.warn('SPA Navigation fallback:', err);
      window.location.href = url;
    }
  }

  function updateActiveNavLinks(url) {
    const cleanUrl = url.split('?')[0].split('#')[0];
    document.querySelectorAll('.nav-link, .hero-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const cleanHref = href.split('?')[0].split('#')[0];
        if (cleanUrl.endsWith(cleanHref) || (cleanHref === 'index.html' && cleanUrl.endsWith('/'))) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
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
    } else if (url.includes('index.html') || url.endsWith('/')) {
      if (window.HeroSlash3D) {
        if (window.heroSlash3D && typeof window.heroSlash3D.dispose === 'function') {
          window.heroSlash3D.dispose();
        }
        window.heroSlash3D = new window.HeroSlash3D('hero-slash-canvas', 'hero-viewport');
      }
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

    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || target === '_blank' || e.metaKey || e.ctrlKey) {
      return;
    }

    e.preventDefault();
    navigateTo(href);
  });

  // Handle browser back/forward buttons seamlessly
  window.addEventListener('popstate', (e) => {
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

  // 4. Live Ho Chi Minh City / GMT+7 Clock
  function updateLiveClock() {
    const clockElements = document.querySelectorAll('.live-clock');
    if (!clockElements.length) return;

    const now = new Date();
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    try {
      const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
      clockElements.forEach(el => {
        el.textContent = `${timeString} (GMT+7)`;
      });
    } catch (e) {
      const hours = String((now.getUTCHours() + 7) % 24).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      clockElements.forEach(el => {
        el.textContent = `${hours}:${minutes}:${seconds} (GMT+7)`;
      });
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

    if (loaderFinished && !document.body.classList.contains('is-loading')) {
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
});
