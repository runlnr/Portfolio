/**
 * Project Detail / Case Study Dynamic Page Logic
 * Rebuilt with 4:3 Card Stacking Scroll Physics & Sticky Editorial Layout
 * Matching Jason Bergh / Swiss Brutalist Design Reference
 */

window.initProjectPage = function() {
  const projects = window.SWAG_PROJECTS || [];
  if (!projects.length) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || projects[0].id;

  const currentIndex = projects.findIndex(p => p.id === projectId);
  const project = currentIndex !== -1 ? projects[currentIndex] : projects[0];

  // 1. Update Document Title
  document.title = `${project.title} • Nam Pham`;

  // 2. Populate Project Main Title
  const titleEl = document.getElementById('project-title');
  if (titleEl) {
    titleEl.textContent = project.title;
  }

  // 3. Populate 2-Column Metadata Grid (Positioned UP under Title)
  const metaGridEl = document.getElementById('project-meta-grid');
  if (metaGridEl) {
    const metaItems = [
      { label: 'TYPE', value: project.type || project.medium || project.category || 'Art Direction' },
      { label: 'DATE', value: project.date || project.year || '2024' },
      { label: 'SERVICES', value: project.services || (Array.isArray(project.disciplines) ? project.disciplines.join(', ') : 'Brand Identity, Social, Motion') },
      { label: 'TIMELINE', value: project.timeline || project.duration || (project.client ? project.client : '3 months') }
    ];

    metaGridEl.innerHTML = metaItems.map(item => `
      <div class="project-meta-cell">
        <span class="project-meta-label">${item.label}</span>
        <span class="project-meta-value">${item.value}</span>
      </div>
    `).join('');
  }

  // 4. Populate 5-Tab Dropdown Accordion (Positioned DOWN, Replacing 'About')
  const accordionEl = document.getElementById('project-accordion');
  if (accordionEl) {
    const tabDefs = [
      { key: 'deliverables', title: 'Deliverables' },
      { key: 'context', title: 'Context' },
      { key: 'challengeSolution', title: 'Challenge & Solution' },
      { key: 'credits', title: 'Credits' }
    ];

    const tabsData = project.tabs || {};

    const tabItems = tabDefs.map((tab, idx) => {
      let content = tabsData[tab.key];
      if (!content) {
        if (tab.key === 'deliverables') {
          content = project.services || (Array.isArray(project.disciplines) ? project.disciplines.join(', ') : 'Brand Strategy, Visual Identity, Motion Graphics, Web Design & Development');
        } else if (tab.key === 'context') {
          content = Array.isArray(project.description) ? project.description.join(' ') : (project.description || 'Comprehensive creative direction and brand identity execution.');
        } else if (tab.key === 'challengeSolution') {
          if (tabsData.challenge && tabsData.solution) {
            content = `${tabsData.challenge}\n\n${tabsData.solution}`;
          } else {
            content = tabsData.challenge || tabsData.solution || 'Visual fragmentation and rapid turnaround windows required a cohesive, high-performance modular design system.\n\nRebuilt the identity from the ground up with strict typographic rules, high-contrast dark visual language, and motion templates.';
          }
        } else if (tab.key === 'credits') {
          content = project.credits && project.credits.length > 0
            ? project.credits.map(c => `${c.role}: ${c.name}`).join(' · ')
            : 'Art Direction & Design: Nam Pham';
        }
      }

      const paragraphs = (typeof content === 'string' ? content.split(/\n\s*\n/) : [content])
        .map(p => (typeof p === 'string' ? p.trim() : p))
        .filter(Boolean);

      const renderedParagraphs = paragraphs
        .map(p => `<p class="project-tab-text type-aero-e">${p}</p>`)
        .join('');

      const isOpen = idx === 0; // Deliverables open by default matching screenshot
      const tabId = `project-tab-${tab.key}`;
      const headerId = `project-tab-header-${tab.key}`;

      return `
        <div class="project-tab-item ${isOpen ? 'is-open' : ''}" data-tab-key="${tab.key}">
          <button type="button" class="project-tab-header" id="${headerId}" aria-expanded="${isOpen ? 'true' : 'false'}" aria-controls="${tabId}">
            <span class="project-tab-title type-aero-e">${tab.title}</span>
            <span class="project-tab-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9.5"></circle>
                <line x1="12" y1="7.5" x2="12" y2="16.5"></line>
                <line x1="7.5" y1="12" x2="16.5" y2="12"></line>
              </svg>
            </span>
          </button>
          <div class="project-tab-body" id="${tabId}" role="region" aria-labelledby="${headerId}">
            <div class="project-tab-content">
              ${renderedParagraphs}
            </div>
          </div>
        </div>
      `;
    }).join('');

    accordionEl.innerHTML = tabItems;
    setupProjectAccordion(accordionEl);
  }

  // 5. Populate Action Link (Visit Site → / View on Behance ↗)
  const actionLinkEl = document.getElementById('project-action-link');
  const actionLabelEl = document.getElementById('project-action-label');
  const actionArrowEl = actionLinkEl ? actionLinkEl.querySelector('.action-arrow') : null;

  if (actionLinkEl) {
    const url = project.visitUrl || project.behanceUrl || 'https://www.behance.net/pxly';
    actionLinkEl.href = url;
    const isBehance = url.includes('behance.net');
    if (actionLabelEl) {
      actionLabelEl.textContent = isBehance ? 'View on Behance' : 'Visit Site';
    }
    if (actionArrowEl) {
      actionArrowEl.textContent = isBehance ? '↗' : '→';
    }
  }

  // 6. Populate 4:3 Image Stack
  const stackColEl = document.getElementById('project-stack-col');
  if (stackColEl) {
    // Extract list of images for this project
    let images = [];

    if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
      project.gallery.forEach(item => {
        if (item.type === 'grid-2' && Array.isArray(item.items)) {
          item.items.forEach(subItem => {
            if (subItem.src) images.push({ src: subItem.src, alt: subItem.alt || project.title });
          });
        } else if (item.src) {
          images.push({ src: item.src, alt: item.alt || project.title });
        }
      });
    }

    // Fallback if gallery is empty
    if (!images.length && project.image) {
      images.push({ src: project.image, alt: project.title });
    }

    if (images.length > 0) {
      stackColEl.innerHTML = images.map((img, idx) => `
        <div class="project-stack-card" data-card-index="${idx}">
          <img src="${img.src}" alt="${img.alt}" loading="${idx < 2 ? 'eager' : 'lazy'}" decoding="async" />
        </div>
      `).join('');

      // Initialize GSAP ScrollTrigger Pinned Scrub Gallery
      setupGalleryPinnedScrub();
    }
  }

  // 7. Populate Next Project Transition Anchor
  const nextLinkEl = document.getElementById('project-next-link');
  const nextTitleEl = document.getElementById('project-next-title');
  if (nextLinkEl && projects.length > 1) {
    const nextIndex = (currentIndex + 1) % projects.length;
    const nextProject = projects[nextIndex];
    if (nextProject) {
      nextLinkEl.href = `project.html?id=${nextProject.id}`;
      if (nextTitleEl) {
        nextTitleEl.textContent = nextProject.title;
      }
    }
  }
};

/**
 * Single-Open Interactive Accordion Controller
 * - First tab (Deliverables) open by default
 * - Clicking an open tab collapses it
 * - Clicking a closed tab collapses all other tabs and expands the clicked one
 * - Height animations smoothly handled via scrollHeight
 */
function setupProjectAccordion(accordionEl) {
  const items = Array.from(accordionEl.querySelectorAll('.project-tab-item'));
  if (!items.length) return;

  function refreshHeights() {
    items.forEach(item => {
      const body = item.querySelector('.project-tab-body');
      if (!body) return;
      if (item.classList.contains('is-open')) {
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.opacity = '1';
      } else {
        body.style.maxHeight = '0px';
        body.style.opacity = '0';
      }
    });
  }

  // Set initial height for open tab
  requestAnimationFrame(() => {
    refreshHeights();
  });

  items.forEach(item => {
    const header = item.querySelector('.project-tab-header');
    const body = item.querySelector('.project-tab-body');
    if (!header || !body) return;

    header.addEventListener('click', (e) => {
      e.preventDefault();
      const wasOpen = item.classList.contains('is-open');

      // Single-open accordion: close all tabs first
      items.forEach(otherItem => {
        otherItem.classList.remove('is-open');
        const otherHeader = otherItem.querySelector('.project-tab-header');
        const otherBody = otherItem.querySelector('.project-tab-body');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        if (otherBody) {
          otherBody.style.maxHeight = '0px';
          otherBody.style.opacity = '0';
        }
      });

      // If clicked tab was not already open, expand it
      if (!wasOpen) {
        item.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.opacity = '1';
      }

      // Refresh ScrollTrigger so pinning distances stay in sync
      if (window.ScrollTrigger) {
        setTimeout(() => {
          window.ScrollTrigger.refresh();
        }, 280);
      }
    });
  });

  // Keep height accurate if container resizes or fonts finish loading
  window.addEventListener('resize', () => {
    const openItem = accordionEl.querySelector('.project-tab-item.is-open');
    if (openItem) {
      const openBody = openItem.querySelector('.project-tab-body');
      if (openBody) {
        openBody.style.maxHeight = openBody.scrollHeight + 'px';
      }
    }
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      refreshHeights();
    });
  }
}

/**
 * GSAP ScrollTrigger Pinned Scrub Gallery Engine
 * - Pins the main project container on desktop (min-width: 961px)
 * - Smoothly scrubs the image gallery upward (y: -travelDistance) with 1:1 linear glide
 * - Left text column stays completely static in its centered position
 * - After all images have scrubbed, cleanly releases pin to reveal Next Project & Footer
 * - Automatically degrades gracefully to responsive stacked flow on mobile (<= 960px)
 */
let projectGalleryMatchMedia = null;

function setupGalleryPinnedScrub() {
  if (projectGalleryMatchMedia) {
    projectGalleryMatchMedia.revert();
    projectGalleryMatchMedia = null;
  }

  // Ensure GSAP and ScrollTrigger are loaded and registered
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('[Project] GSAP or ScrollTrigger not detected, falling back to natural scroll.');
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);

  const mainWrap = document.querySelector('.project-main-wrap');
  const stackColEl = document.getElementById('project-stack-col');
  if (!mainWrap || !stackColEl) return;

  const cards = Array.from(stackColEl.querySelectorAll('.project-stack-card'));
  if (cards.length <= 1) return;

  projectGalleryMatchMedia = window.gsap.matchMedia();

  projectGalleryMatchMedia.add('(min-width: 961px)', () => {
    // Reset initial transforms
    window.gsap.set(stackColEl, { y: 0 });

    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];

    // Travel distance so the last image sits precisely in the primary viewing position
    const travelDistance = Math.max(0, lastCard.offsetTop - firstCard.offsetTop);
    if (travelDistance <= 0) return;

    // A comfortable resting buffer on the final image before unpinning
    const holdDistance = 350;

    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: mainWrap,
        start: 'top top',
        end: () => `+=${travelDistance + holdDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // 1:1 Linear Swiss Brutalist Glide (zero distortion, zero dimming)
    tl.to(stackColEl, {
      y: -travelDistance,
      ease: 'none',
      duration: travelDistance
    });

    // Hold resting period on final image
    tl.to({}, { duration: holdDistance });

    return () => {
      window.gsap.set(stackColEl, { clearProps: 'transform' });
    };
  });

  projectGalleryMatchMedia.add('(max-width: 960px)', () => {
    // Mobile responsive fallback: natural stacked scroll
    window.gsap.set(stackColEl, { clearProps: 'transform' });
  });

  // Keep ScrollTrigger measurements synchronized once media and fonts load
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      window.ScrollTrigger.refresh();
    });
  }

  window.addEventListener('load', () => {
    window.ScrollTrigger.refresh();
  }, { once: true });
}

/**
 * In-Place ASCII Shuffle Appear
 * Decodes title, about label, paragraphs, and metadata items
 */
const PROJECT_ASCII_GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~\\X#0123456789ABCDEF!?:;';

function getRandomProjectGlyph() {
  return PROJECT_ASCII_GLYPHS[Math.floor(Math.random() * PROJECT_ASCII_GLYPHS.length)];
}

let activeProjectScrambles = [];

function clearActiveProjectScrambles() {
  activeProjectScrambles.forEach(id => clearInterval(id));
  activeProjectScrambles = [];
}

window.triggerProjectAsciiAppear = function () {
  clearActiveProjectScrambles();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const selectors = [
    '#project-title',
    '.project-meta-label',
    '.project-meta-value',
    '.project-tab-title',
    '.project-tab-item.is-open .project-tab-text',
    '#project-action-label',
    '#project-next-title'
  ];

  const elements = Array.from(document.querySelectorAll(selectors.join(', ')));
  if (!elements.length) return;

  if (prefersReducedMotion) return;

  const duration = (window.PROJECT_SCRAMBLE_DURATION && typeof window.PROJECT_SCRAMBLE_DURATION === 'number')
    ? window.PROJECT_SCRAMBLE_DURATION
    : 1350;
  const fps = 30;
  const totalFrames = Math.max(28, Math.floor((duration / 1000) * fps));

  elements.forEach(el => {
    const targetText = el.textContent;
    if (!targetText || !targetText.trim()) return;

    const len = targetText.length;
    const resolveFrames = [];
    for (let i = 0; i < len; i++) {
      const ratio = i / Math.max(1, len);
      resolveFrames.push(Math.floor(totalFrames * (0.25 + ratio * 0.63)));
    }

    let initialStr = '';
    for (let i = 0; i < len; i++) {
      const char = targetText[i];
      initialStr += (char === ' ' || char === '\n' || char === '\t') ? char : getRandomProjectGlyph();
    }
    el.textContent = initialStr;

    let frame = 0;
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
          currentStr += getRandomProjectGlyph();
        }
      }

      el.textContent = currentStr;

      if (frame >= totalFrames) {
        clearInterval(intervalId);
        el.textContent = targetText;
      }
    }, 1000 / fps);

    activeProjectScrambles.push(intervalId);
  });
};

window.addEventListener('pagehide', clearActiveProjectScrambles, { once: true });

document.addEventListener('DOMContentLoaded', () => {
  window.initProjectPage();
});
