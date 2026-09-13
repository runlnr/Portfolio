/**
 * Project Detail / Case Study Dynamic Page Logic
 * Implements 3-column editorial typography layout with AT Aero Type E context
 * and AT Aero Type A title / year header row.
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

  // 2. Populate Project Main Title & Right-Aligned Behance Link Button
  const titleEl = document.getElementById('project-title');
  if (titleEl) {
    titleEl.textContent = project.title;
  }

  const behanceBtn = document.getElementById('project-behance-btn');
  if (behanceBtn) {
    behanceBtn.href = project.behanceUrl || 'https://www.behance.net/pxly';
  }

  // 3. Populate Column 1: Metadata (Medium, Year, Type) in AT Aero Type E
  const mediumEl = document.getElementById('project-medium');
  if (mediumEl) {
    mediumEl.textContent = project.medium || project.category || 'Social Media Identity';
  }

  const yearEl = document.getElementById('project-year');
  if (yearEl) {
    yearEl.textContent = project.year || '2024';
  }

  const typeEl = document.getElementById('project-type');
  if (typeEl) {
    typeEl.textContent = project.type || (Array.isArray(project.disciplines) ? project.disciplines.join(', ') : 'Art Direction');
  }

  // 4. Populate Column 2: Credits in AT Aero Type F
  const creditsListEl = document.getElementById('project-credits-list');
  if (creditsListEl) {
    if (project.credits && Array.isArray(project.credits) && project.credits.length > 0) {
      creditsListEl.innerHTML = project.credits.map(c => `
        <div class="project-credit-item type-aero-f">
          <span class="project-credit-role">${c.role}:</span>
          <span class="project-credit-name">${c.name}</span>
        </div>
      `).join('');
    } else {
      creditsListEl.innerHTML = `
        <div class="project-credit-item type-aero-f">
          <span class="project-credit-role">Creative Direction:</span>
          <span class="project-credit-name">Nam Pham</span>
        </div>
      `;
    }
  }

  // 5. Populate Column 3: Project Description in AT Aero Regular
  const descEl = document.getElementById('project-description');
  if (descEl && project.description) {
    if (Array.isArray(project.description)) {
      descEl.innerHTML = project.description.map(p => `<p class="project-desc-text">${p}</p>`).join('');
    } else {
      const paragraphs = project.description.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      descEl.innerHTML = paragraphs.map(p => `<p class="project-desc-text">${p}</p>`).join('');
    }
  }

  // 6. Populate Project Gallery / Hero Image Placeholder
  const galleryWrap = document.getElementById('project-gallery-wrap');
  const heroPlaceholder = document.getElementById('project-hero-placeholder');

  if (galleryWrap && project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
    galleryWrap.innerHTML = project.gallery.map((block, idx) => {
      if (block.type === 'grid-2' && Array.isArray(block.items) && block.items.length >= 2) {
        const item0 = block.items[0];
        const item1 = block.items[1];
        const flex0 = item0.aspectRatio || (item0.width && item0.height ? (item0.width / item0.height) : 1);
        const flex1 = item1.aspectRatio || (item1.width && item1.height ? (item1.width / item1.height) : 1);
        return `
          <div class="project-gallery-row type-grid-2">
            <div class="gallery-col" style="flex: ${flex0} 1 0%;">
              <img src="${item0.src}" alt="${item0.alt || project.title}" ${item0.width ? `width="${item0.width}"` : ''} ${item0.height ? `height="${item0.height}"` : ''} loading="lazy" onload="if(this.naturalWidth&&this.naturalHeight){this.parentElement.style.flex=(this.naturalWidth/this.naturalHeight)+' 1 0%';}" />
            </div>
            <div class="gallery-col" style="flex: ${flex1} 1 0%;">
              <img src="${item1.src}" alt="${item1.alt || project.title}" ${item1.width ? `width="${item1.width}"` : ''} ${item1.height ? `height="${item1.height}"` : ''} loading="lazy" onload="if(this.naturalWidth&&this.naturalHeight){this.parentElement.style.flex=(this.naturalWidth/this.naturalHeight)+' 1 0%';}" />
            </div>
          </div>
        `;
      } else {
        // Default: type-full (1 full bleed image)
        const item = (block.items && block.items[0]) || block;
        const src = item.src;
        const alt = item.alt || project.title;
        return `
          <div class="project-gallery-row type-full">
            <img src="${src}" alt="${alt}" ${item.width ? `width="${item.width}"` : ''} ${item.height ? `height="${item.height}"` : ''} loading="${idx < 2 ? 'eager' : 'lazy'}" />
          </div>
        `;
      }
    }).join('');
  } else if (heroPlaceholder) {
    if (project.placeholderColor) {
      heroPlaceholder.style.backgroundColor = project.placeholderColor;
    }
    if (heroPlaceholder.dataset.useImage === 'true' && project.image) {
      heroPlaceholder.style.backgroundImage = `url('${project.image}')`;
      heroPlaceholder.style.backgroundSize = 'cover';
      heroPlaceholder.style.backgroundPosition = 'center';
    }
  }
};

/**
 * Simultaneous Terminal Matrix: In-Place ASCII Shuffle Appear
 * Decodes all project context content (title, metadata, credits, description)
 * concurrently over ~800ms with zero vertical translation.
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
    '.project-label',
    '#project-medium',
    '#project-year',
    '#project-type',
    '.project-credit-role',
    '.project-credit-name',
    '.project-desc-text'
  ];

  const elements = Array.from(document.querySelectorAll(selectors.join(', ')));
  if (!elements.length) return;

  if (prefersReducedMotion) return;

  const duration = (window.PROJECT_SCRAMBLE_DURATION && typeof window.PROJECT_SCRAMBLE_DURATION === 'number')
    ? window.PROJECT_SCRAMBLE_DURATION
    : 1350; // Calibrated from 800ms to 1350ms for a relaxed, cinematic decode
  const fps = 30;
  const totalFrames = Math.max(28, Math.floor((duration / 1000) * fps));

  elements.forEach(el => {
    const targetText = el.textContent;
    if (!targetText || !targetText.trim()) return;

    const len = targetText.length;
    const resolveFrames = [];
    for (let i = 0; i < len; i++) {
      const ratio = i / Math.max(1, len);
      // Resolves progressively from left to right between 25% and 88% of totalFrames
      resolveFrames.push(Math.floor(totalFrames * (0.25 + ratio * 0.63)));
    }

    // Immediately pre-populate with random ASCII glyphs of exact matching length
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
