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
        <span class="project-meta-label type-mono-a">${item.label}</span>
        <span class="project-meta-value type-aero-e">${item.value}</span>
      </div>
    `).join('');
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

function handleProjectPageResponsive() {
  if (window.matchMedia('(min-width: 1024px)').matches) {
    window.initProjectPage();
  } else {
    clearActiveProjectScrambles();
    if (projectGalleryMatchMedia) {
      projectGalleryMatchMedia.revert();
      projectGalleryMatchMedia = null;
    }
  }
}

const projectDesktopQuery = window.matchMedia('(min-width: 1024px)');
if (projectDesktopQuery.addEventListener) {
  projectDesktopQuery.addEventListener('change', handleProjectPageResponsive);
} else {
  projectDesktopQuery.addListener(handleProjectPageResponsive);
}

document.addEventListener('DOMContentLoaded', () => {
  handleProjectPageResponsive();
});
