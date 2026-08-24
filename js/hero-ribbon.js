/**
 * Hero Scrolling Design Image Ribbon Component (Blacklead Studio Engine)
 * Synchronizes horizontal infinite ribbon scrolling with dynamic full-bleed backdrop & featured project headline.
 */

class HeroRibbon {
  constructor(options = {}) {
    this.wrapper = document.getElementById('hero-ribbon-wrapper');
    this.track = document.getElementById('hero-ribbon-track');
    this.backdropImg = document.getElementById('hero-backdrop-img');
    this.featuredTitle = document.getElementById('hero-featured-title');
    this.featuredMeta = document.getElementById('hero-featured-meta');

    if (!this.wrapper || !this.track) return;

    this.options = Object.assign({
      ambientSpeed: 0.6,     // Ambient auto-scroll speed (pixels per frame)
      scrollFactor: 1.35,    // Wheel scroll sensitivity multiplier
      lerpFactor: 0.09,      // Inertia damping interpolation
      initialOffsetFactor: 0.25 // Start offset
    }, options);

    this.projects = window.SWAG_PROJECTS || [];
    this.currentX = 0;
    this.targetX = 0;
    this.halfWidth = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragCurrentX = 0;
    this.rafId = null;
    this.isPaused = false;
    this.activeProjectIndex = -1;

    this.init();
  }

  init() {
    this.renderCards();
    this.calculateBounds();
    this.bindEvents();
    this.startLoop();

    // Set initial project as featured
    if (this.projects.length > 0) {
      this.setActiveProject(0);
    }
  }

  renderCards() {
    if (!this.projects.length) return;

    // Duplicate project list 3x for a seamless infinite loop
    const displayList = [...this.projects, ...this.projects, ...this.projects];

    let html = '';
    displayList.forEach((proj, idx) => {
      const origIdx = idx % this.projects.length;
      const num = proj.number || String(origIdx + 1).padStart(2, '0');
      html += `
        <a href="project.html?id=${encodeURIComponent(proj.id)}" class="hero-ribbon-card" data-project-index="${origIdx}" data-card-index="${idx}" aria-label="View project ${proj.title}">
          <img src="${proj.image}" alt="${proj.title}" class="hero-ribbon-media" loading="lazy" />
          <div class="hero-ribbon-info">
            <span class="hero-ribbon-title">${proj.title}</span>
            <span class="hero-ribbon-meta">${num} / ${proj.year || '2026'}</span>
          </div>
        </a>
      `;
    });

    this.track.innerHTML = html;
  }

  calculateBounds() {
    const totalCards = this.track.children.length;
    if (totalCards === 0) return;

    this.halfWidth = this.track.scrollWidth / 3;

    if (this.currentX === 0 && this.targetX === 0) {
      const windowWidth = window.innerWidth;
      const initialOffset = -(windowWidth * this.options.initialOffsetFactor);
      this.currentX = initialOffset;
      this.targetX = initialOffset;
    }
  }

  setActiveProject(index) {
    if (this.activeProjectIndex === index) return;
    this.activeProjectIndex = index;
    const proj = this.projects[index];
    if (!proj) return;

    // 1. Update Backdrop image with smooth crossfade
    if (this.backdropImg) {
      this.backdropImg.style.opacity = '0.35';
      setTimeout(() => {
        this.backdropImg.src = proj.image;
        this.backdropImg.style.opacity = '1';
      }, 150);
    }

    // 2. Update Featured Title
    if (this.featuredTitle) {
      this.featuredTitle.style.opacity = '0';
      this.featuredTitle.style.transform = 'translateY(8px)';
      setTimeout(() => {
        // Format title with line break for editorial look
        const words = proj.title.split(' ');
        if (words.length >= 2) {
          this.featuredTitle.innerHTML = `${words[0]}<br>${words.slice(1).join(' ')}`;
        } else {
          this.featuredTitle.textContent = proj.title;
        }
        this.featuredTitle.style.opacity = '1';
        this.featuredTitle.style.transform = 'translateY(0)';
      }, 180);
    }

    // 3. Highlight active card class
    const cards = this.track.querySelectorAll('.hero-ribbon-card');
    cards.forEach(card => {
      const cardProjIdx = parseInt(card.getAttribute('data-project-index'), 10);
      if (cardProjIdx === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  bindEvents() {
    // 1. Wheel scroll listener (Scroll down/up moves ribbon left/right)
    const onWheel = (e) => {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      this.targetX -= delta * this.options.scrollFactor;
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const heroViewport = document.getElementById('hero-viewport') || window;
    heroViewport.addEventListener('wheel', onWheel, { passive: false });

    // 2. Mouse Drag / Touch Swipe Interaction
    const onPointerDown = (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      this.dragCurrentX = this.dragStartX;
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const delta = x - this.dragCurrentX;
      this.dragCurrentX = x;
      this.targetX += delta * 1.5;
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    this.wrapper.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.wrapper.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 3. Hovering over a card syncs the active project
    this.track.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.hero-ribbon-card');
      if (card) {
        const projIdx = parseInt(card.getAttribute('data-project-index'), 10);
        if (!isNaN(projIdx)) {
          this.setActiveProject(projIdx);
        }
      }
    });

    this.wrapper.addEventListener('mouseenter', () => {
      this.isPaused = true;
    });
    this.wrapper.addEventListener('mouseleave', () => {
      this.isPaused = false;
    });

    // 4. Window Resize
    window.addEventListener('resize', () => {
      this.calculateBounds();
    });
  }

  startLoop() {
    const tick = () => {
      if (!this.isPaused && !this.isDragging) {
        this.targetX -= this.options.ambientSpeed;
      }

      this.currentX += (this.targetX - this.currentX) * this.options.lerpFactor;

      // Infinite wrapping logic
      if (this.halfWidth > 0) {
        while (this.currentX <= -this.halfWidth) {
          this.currentX += this.halfWidth;
          this.targetX += this.halfWidth;
        }
        while (this.currentX > 0) {
          this.currentX -= this.halfWidth;
          this.targetX -= this.halfWidth;
        }
      }

      this.track.style.transform = `translate3d(${this.currentX.toFixed(2)}px, 0, 0)`;

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

// Global factory helper
window.HeroRibbon = HeroRibbon;

window.initHeroRibbon = function() {
  if (document.getElementById('hero-ribbon-track')) {
    if (window.heroRibbonInstance) {
      window.heroRibbonInstance.destroy();
    }
    window.heroRibbonInstance = new HeroRibbon();
    return window.heroRibbonInstance;
  }
  return null;
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.initHeroRibbon();
});
