const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('execution/audit_output.json', 'utf8'));
const cssRules = JSON.parse(fs.readFileSync('execution/css_typography_index.json', 'utf8'));

// Strict text tags and component leaf selectors
const nonTextTags = new Set(['script', 'style', 'noscript', 'title', 'meta', 'head', 'html', 'body', 'svg', 'path', 'g', 'rect', 'circle', 'section', 'main', 'aside', 'header', 'footer', 'nav', 'ul', 'ol', 'form']);
const containerClasses = new Set(['project-main-curtain', 'project-main-wrap', 'project-split-container', 'project-info-col', 'project-title-wrap', 'project-meta-wrap', 'project-accordion-wrap', 'project-action-row', 'project-stack-card', 'project-next-wrap', 'project-next-container', 'f3-footer-reveal-wrap', 'f3-editorial-footer', 'f3-footer-top-row', 'f3-footer-col-left', 'f3-footer-col-right', 'f3-footer-contact-block', 'f3-footer-socials-block', 'f3-footer-socials-list', 'f3-footer-emblem-block', 'f3-intro-left-col', 'f3-intro-right-col', 'f3-featured-tag-row', 'f3-featured-col-left', 'f3-featured-col-right', 'f3-works-staggered-grid', 'f3-works-col', 'f3-contact-grid', 'f3-contact-left-col', 'f3-contact-right-col', 'f3-form-col', 'f3-form-row', 'f3-form-group', 'f3-form-actions', 'f3-intro-divider-row', 'f3-footer-divider-row', 'nav-row-roll-inner', 'nav-row-roll-wrap', 'nav-col', 'nav-dropdown-menu', 'nav-dropdown-content', 'nav-dropdown-grid', 'about-container', 'about-content', 'about-grid', 'about-statement-wrap']);

const filtered = raw.filter(item => {
  const parts = item.selector.split('.');
  const tag = parts[0].toLowerCase();
  if (nonTextTags.has(tag)) return false;

  const text = item.textSnippet ? item.textSnippet.trim() : '';
  if (!text) return false;

  // Check if any class is a pure layout container
  const isPureContainer = item.classes.some(c => containerClasses.has(c));
  if (isPureContainer && tag === 'div') return false;

  return true;
});

// Group by unique CSS component selector / role
const componentMap = new Map();

filtered.forEach(item => {
  const parts = item.selector.split('.');
  const tag = parts[0].toLowerCase();
  let selectorKey = item.classes.filter(c => c).length > 0 
    ? item.classes.filter(c => c).map(c => `.${c}`).join('')
    : `${tag}`;

  const key = `${item.page} | ${tag}${selectorKey}`;
  if (!componentMap.has(key)) {
    componentMap.set(key, {
      page: item.page,
      tag,
      classes: item.classes.filter(c => c),
      selector: item.selector,
      key,
      textSnippet: item.textSnippet,
      styles: item.styles
    });
  }
});

const categorized = {
  linked: [],
  matchingUnlinked: [],
  customDivergent: []
};

componentMap.forEach(item => {
  const hasTypeClass = item.classes.some(c => c.startsWith('type-aero-') || c.startsWith('type-mono-'));
  
  // Find source CSS rules
  const matchedRules = [];
  for (const rule of cssRules) {
    for (const cls of item.classes) {
      if (rule.selector.includes(`.${cls}`) && !matchedRules.some(r => r.file === rule.file && r.line === rule.line)) {
        matchedRules.push(rule);
      }
    }
  }

  const resultItem = {
    page: item.page,
    selector: item.selector,
    classes: item.classes,
    textSnippet: item.textSnippet,
    styles: item.styles,
    sources: matchedRules.slice(0, 3)
  };

  if (hasTypeClass) {
    const typeClass = item.classes.find(c => c.startsWith('type-aero-') || c.startsWith('type-mono-'));
    resultItem.typeClass = typeClass;
    categorized.linked.push(resultItem);
    return;
  }

  // Check matching presets
  const size = item.styles.fontSize;
  const isMono = item.styles.fontFam.toLowerCase().includes('mono');
  let matched = null;

  if (size === '43px') matched = 'type-aero-a';
  else if (size === '30px') matched = 'type-aero-b';
  else if (size === '20px' && !isMono) matched = 'type-aero-c';
  else if (size === '230px') matched = 'type-aero-d';
  else if (size === '14.5px' && !isMono) matched = 'type-aero-e';
  else if (size === '16px' && !isMono) matched = 'type-aero-f';
  else if ((size === '11px' || size === '10.5px' || size === '12px' || size === '11.5px') && isMono) matched = 'type-mono-a';

  if (matched) {
    resultItem.matchedPreset = matched;
    categorized.matchingUnlinked.push(resultItem);
  } else {
    categorized.customDivergent.push(resultItem);
  }
});

fs.writeFileSync('execution/clean_filtered_report.json', JSON.stringify(categorized, null, 2));

console.log(`Clean Leaf Report Summary:`);
console.log(`1. Linked elements: ${categorized.linked.length}`);
console.log(`2. Matching unlinked elements: ${categorized.matchingUnlinked.length}`);
console.log(`3. Custom divergent elements: ${categorized.customDivergent.length}`);
