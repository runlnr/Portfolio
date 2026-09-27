const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('execution/audit_output.json', 'utf8'));

// Presets from typography.css and TYPOGRAPHY.txt
const PRESETS = [
  { id: 'type-aero-a', name: 'AT Aero Type A', font: 'aero', size: 43, line: 49, spacing: -2.0, weight: 350 },
  { id: 'type-aero-b', name: 'AT Aero Type B', font: 'aero', size: 30, line: 35, spacing: -1.0, weight: 400 },
  { id: 'type-aero-c', name: 'AT Aero Type C', font: 'aero', size: 20, line: 27.5, spacing: -1.2, weight: 400 },
  { id: 'type-aero-d', name: 'AT Aero Type D', font: 'aero', size: 230, line: 230, spacing: -17.0, weight: 500 },
  { id: 'type-aero-e', name: 'AT Aero Type E', font: 'aero', size: 14.5, line: 20, spacing: -0.3, weight: 350 },
  { id: 'type-aero-f', name: 'AT Aero Type F', font: 'aero', size: 16, line: 22, spacing: -0.3, weight: 400 },
  { id: 'type-mono-a', name: 'PP Supply Mono Type A', font: 'mono', size: 11, line: 13, spacing: 0.5, weight: 400 }
];

// Helper to parse px
function parsePx(val) {
  if (!val || val === 'normal') return null;
  const match = val.toString().match(/([-\d.]+)px/);
  return match ? parseFloat(match[1]) : null;
}

// Helper to parse weight
function parseWeight(val) {
  if (!val) return 400;
  if (val === 'bold') return 700;
  if (val === 'normal') return 400;
  return parseInt(val, 10) || 400;
}

// Strict text leaf tags
const textLeafTags = new Set(['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'label', 'input', 'textarea', 'li', 'time', 'pre']);

// Layout containers to skip
const containerClasses = new Set([
  'hero-top-nav', 'nav-modular-box', 'nav-dropdown-menu', 'nav-dropdown-grid', 'nav-dropdown-col-left', 'nav-dropdown-col-right',
  'nav-dropdown-info-stack', 'nav-dropdown-ongoing', 'nav-dropdown-socials', 'nav-row-roll', 'nav-row-roll-inner',
  'homepage-main', 'hero-center-viewport', 'hero-backdrop-container', 'hero-center-visual', 'hero-tv-wrapper',
  'f3-editorial-wrapper', 'f3-section-intro', 'f3-container', 'f3-intro-lockup', 'f3-intro-left-col', 'f3-intro-right-col',
  'f3-intro-divider-row', 'f3-featured-tag-row', 'f3-featured-col-left', 'f3-featured-col-right', 'f3-works-grid-container',
  'f3-works-staggered-grid', 'f3-works-col', 'f3-work-card', 'f3-work-card-media', 'f3-work-card-info', 'f3-work-card-title-row', 'f3-work-card-tags',
  'f3-works-list-view', 'f3-list-items-wrap', 'f3-list-item-row', 'f3-list-col-left', 'f3-list-col-right', 'f3-list-thumb-slot', 'f3-list-title-row', 'f3-list-action-col',
  'f3-section-bio-services', 'f3-showcase-section', 'f3-showcase-container', 'f3-showcase-header', 'f3-showcase-wrap', 'f3-showcase-grid', 'f3-showcase-item', 'f3-showcase-box',
  'f3-section-contact', 'f3-contact-container', 'f3-single-divider-row', 'f3-contact-hero-stage', 'f3-contact-split-hero', 'f3-contact-left-col', 'f3-contact-right-col',
  'f3-contact-hook-wrap', 'f3-contact-cta-action', 'f3-contact-corners-bar', 'f3-contact-modal-scrim', 'f3-contact-modal-backdrop', 'f3-contact-modal-content-wrap',
  'f3-contact-modal-dialog', 'f3-modal-header', 'f3-contact-form', 'f3-modal-form', 'f3-form-group', 'f3-pill-group', 'f3-form-action-row',
  'f3-footer-reveal-wrap', 'f3-editorial-footer', 'f3-footer-top-row', 'f3-footer-col-left', 'f3-footer-col-right', 'f3-footer-contact-block', 'f3-footer-socials-block',
  'f3-footer-socials-list', 'f3-footer-social-item', 'f3-footer-emblem-block', 'f3-footer-brand-signature', 'f3-footer-colophon-bar', 'f3-colophon-col-left', 'f3-colophon-col-right',
  'about-main-curtain', 'about-main-wrap', 'about-container', 'about-hero-section', 'about-bio-section', 'about-portrait-row', 'about-portrait-col', 'about-bio-col',
  'about-split-row', 'about-bio-split', 'about-col-left', 'about-col-right', 'about-label-lockup', 'about-paragraphs-lockup',
  'project-main-curtain', 'project-main-wrap', 'project-split-container', 'project-info-col', 'project-info-sticky', 'project-title-wrap', 'project-meta-wrap',
  'project-meta-grid', 'project-meta-cell', 'project-accordion-wrap', 'project-accordion', 'project-tab-item', 'project-tab-body', 'project-tab-content',
  'project-action-row', 'project-stack-col', 'project-next-wrap', 'project-next-container', 'f3-colophon-privacy', 'f3-colophon-left', 'f3-colophon-right'
]);

// Track deduplicated unique components
const elements = [];
const seenKeys = new Set();

raw.forEach(item => {
  const parts = item.selector.split('.');
  const tag = parts[0].toLowerCase().split('#')[0];
  if (!textLeafTags.has(tag)) return;

  const hasContainerClass = item.classes.some(c => containerClasses.has(c));
  if (hasContainerClass && (tag === 'div' || tag === 'section' || tag === 'main' || tag === 'header' || tag === 'footer' || tag === 'aside' || tag === 'a')) return;

  const text = item.textSnippet ? item.textSnippet.trim() : '';
  if (!text) return;

  // Filter out elements that ALREADY have an explicit type class
  const hasExplicitTypeClass = item.classes.some(c => c.startsWith('type-aero-') || c.startsWith('type-mono-'));
  if (hasExplicitTypeClass) return;

  // Key by tag + class + text structure
  const cleanClasses = item.classes.filter(c => c && !c.startsWith('is-') && c !== 'active');
  const selectorKey = cleanClasses.length > 0 ? cleanClasses.map(c => `.${c}`).join('') : `${tag}`;
  const key = `${tag}${selectorKey}`;

  if (!seenKeys.has(key)) {
    seenKeys.add(key);
    elements.push({
      key,
      tag,
      selector: item.selector,
      classes: cleanClasses,
      page: item.page,
      textSnippet: text,
      styles: item.styles
    });
  }
});

const similarList = [];
const differentList = [];

elements.forEach(item => {
  const styles = item.styles;
  const isMono = styles.fontFam.toLowerCase().includes('mono');
  const fontCategory = isMono ? 'mono' : 'aero';

  const size = parsePx(styles.fontSize);
  const line = parsePx(styles.lineHeight);
  const spacing = parsePx(styles.letterSpacing);
  const weight = parseWeight(styles.fontWeight);

  let bestMatch = null;
  let minDiffs = 999;
  let bestDiffDetails = [];

  for (const preset of PRESETS) {
    if (preset.font !== fontCategory) continue;

    const diffs = [];

    // Check size tolerance (0.6px)
    if (size !== null && Math.abs(size - preset.size) > 0.6) {
      diffs.push({
        property: 'Font Size',
        actual: styles.fontSize,
        preset: `${preset.size}px`,
        diffStr: `Font size is ${styles.fontSize} (preset has ${preset.size}px)`
      });
    }

    // Check line height tolerance (3px)
    if (line !== null && Math.abs(line - preset.line) > 3) {
      diffs.push({
        property: 'Line Height',
        actual: styles.lineHeight,
        preset: `${preset.line}px`,
        diffStr: `Line height is ${styles.lineHeight} (preset has ${preset.line}px)`
      });
    }

    // Check letter spacing tolerance (0.4px)
    if (spacing !== null && Math.abs(spacing - preset.spacing) > 0.4) {
      diffs.push({
        property: 'Letter Spacing',
        actual: styles.letterSpacing,
        preset: `${preset.spacing}px`,
        diffStr: `Letter spacing is ${styles.letterSpacing} (preset has ${preset.spacing}px)`
      });
    }

    // Check weight tolerance (50)
    if (Math.abs(weight - preset.weight) >= 80) {
      diffs.push({
        property: 'Font Weight',
        actual: `${weight}`,
        preset: `${preset.weight}`,
        diffStr: `Font weight is ${weight} (preset has ${preset.weight})`
      });
    }

    if (diffs.length < minDiffs) {
      minDiffs = diffs.length;
      bestMatch = preset;
      bestDiffDetails = diffs;
    }
  }

  const resultItem = {
    selector: item.selector,
    classes: item.classes,
    page: item.page,
    textSnippet: item.textSnippet,
    styles: item.styles,
    bestMatch,
    diffCount: minDiffs,
    diffDetails: bestDiffDetails
  };

  // If 1 property different -> Similar list
  // If 0 property different (exact match) -> Also Similar list (matches preset)
  // If > 1 property different -> Different list
  if (minDiffs <= 1) {
    similarList.push(resultItem);
  } else {
    differentList.push(resultItem);
  }
});

fs.writeFileSync('execution/category3_similar_different.json', JSON.stringify({
  similarCount: similarList.length,
  differentCount: differentList.length,
  similarList,
  differentList
}, null, 2));

console.log(`Results:`);
console.log(`- Similar: ${similarList.length}`);
console.log(`- Different: ${differentList.length}`);
