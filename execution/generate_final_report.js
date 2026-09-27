const fs = require('fs');

const summary = JSON.parse(fs.readFileSync('execution/audit_summary.json', 'utf8'));
const cssRules = JSON.parse(fs.readFileSync('execution/css_typography_index.json', 'utf8'));

// Helper to find relevant CSS rule for a selector / class
function findCssSource(selectorStr, elementClasses) {
  const matches = [];
  const classes = (elementClasses || []).filter(c => c && !c.startsWith('tab-') && c !== 'active');

  for (const rule of cssRules) {
    // Check if rule.selector matches element classes
    for (const c of classes) {
      if (rule.selector.includes(`.${c}`) || rule.selector === `.${c}`) {
        matches.push(rule);
        break;
      }
    }
  }
  return matches;
}

// Group summary items by logical component/UI block
function processCategory(items) {
  const map = new Map();

  items.forEach(item => {
    // Extract base selector pattern without ID / pseudo / specific index
    let pattern = item.element
      .replace(/\[data-tab=".*?"\]/g, '')
      .replace(/\[data-view=".*?"\]/g, '')
      .replace(/:nth-child\(\d+\)/g, '')
      .replace(/#[\w-]+/g, '');

    const key = pattern.trim();
    if (!map.has(key)) {
      map.set(key, {
        pattern: key,
        typeClass: item.typeClass,
        matchedPreset: item.matchedPreset,
        styles: item.styles,
        examples: [],
        sources: []
      });
    }

    const entry = map.get(key);
    if (entry.examples.length < 3 && item.textSnippet) {
      entry.examples.push(item.textSnippet);
    }
  });

  return Array.from(map.values()).map(entry => {
    // find CSS rules for this pattern
    const classes = entry.pattern.match(/\.[\w-]+/g) || [];
    const cleanClasses = classes.map(c => c.substring(1));
    const matchedRules = [];

    for (const rule of cssRules) {
      for (const cls of cleanClasses) {
        if (rule.selector.includes(`.${cls}`)) {
          matchedRules.push({
            file: rule.file,
            line: rule.line,
            selector: rule.selector,
            props: rule.props
          });
          break;
        }
      }
    }

    entry.sources = matchedRules.slice(0, 3); // top 3 rules
    return entry;
  });
}

const linkedGrouped = processCategory(summary.linked);
const unlinkedGrouped = processCategory(summary.matchingUnlinked);
const customGrouped = processCategory(summary.customDivergent);

fs.writeFileSync('execution/final_audit_report.json', JSON.stringify({
  linkedCount: summary.linked.length,
  unlinkedCount: summary.matchingUnlinked.length,
  customCount: summary.customDivergent.length,
  linkedGrouped,
  unlinkedGrouped,
  customGrouped
}, null, 2));

console.log(`Report generated successfully:`);
console.log(`- Linked unique UI components: ${linkedGrouped.length}`);
console.log(`- Unlinked matching unique UI components: ${unlinkedGrouped.length}`);
console.log(`- Custom divergent unique UI components: ${customGrouped.length}`);
