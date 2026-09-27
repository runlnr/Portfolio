const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('execution/audit_output.json', 'utf8'));

// Unique components/selectors map
const componentMap = new Map();

raw.forEach(item => {
  const key = `${item.page} > ${item.selector}`;
  if (!componentMap.has(key)) {
    componentMap.set(key, item);
  }
});

const PRESETS = {
  'type-aero-a': { size: '43px', line: '49px', spacing: '-2px', weight: '450', font: 'AT Aero' },
  'type-aero-b': { size: '30px', line: '35px', spacing: '-1px', weight: '400', font: 'AT Aero' },
  'type-aero-c': { size: '20px', line: '27.5px', spacing: '-1.2px', weight: '400', font: 'AT Aero' },
  'type-aero-d': { size: '230px', line: '230px', spacing: '-17px', weight: '500', font: 'AT Aero' },
  'type-aero-e': { size: '14.5px', line: '20px', spacing: '-0.3px', weight: '450', font: 'AT Aero' },
  'type-aero-f': { size: '16px', line: '22px', spacing: '-0.3px', weight: '400', font: 'AT Aero' },
  'type-mono-a': { size: '11px', line: '13px', spacing: '0.5px', weight: '400', font: 'PP Supply Mono' }
};

const categorized = {
  linked: [],      // Using type-aero-* or type-mono-* directly
  matchingUnlinked: [], // Matching specs but standalone in CSS
  customDivergent: []  // Completely custom / divergent fonts or sizes
};

componentMap.forEach((item, key) => {
  const hasTypeClass = item.classes.some(c => c.startsWith('type-aero-') || c.startsWith('type-mono-'));
  
  if (hasTypeClass) {
    const typeClass = item.classes.find(c => c.startsWith('type-aero-') || c.startsWith('type-mono-'));
    categorized.linked.push({
      element: key,
      typeClass,
      textSnippet: item.textSnippet,
      styles: item.styles
    });
    return;
  }

  // Check if styles closely match an Aero or Mono preset
  const size = item.styles.fontSize;
  const isMono = item.styles.fontFam.toLowerCase().includes('mono');
  let matchedPreset = null;

  if (size === '43px') matchedPreset = 'type-aero-a';
  else if (size === '30px') matchedPreset = 'type-aero-b';
  else if (size === '20px' && !isMono) matchedPreset = 'type-aero-c';
  else if (size === '230px') matchedPreset = 'type-aero-d';
  else if (size === '14.5px' && !isMono) matchedPreset = 'type-aero-e';
  else if (size === '16px' && !isMono) matchedPreset = 'type-aero-f';
  else if ((size === '11px' || size === '10.5px' || size === '12px') && isMono) matchedPreset = 'type-mono-a';

  if (matchedPreset) {
    categorized.matchingUnlinked.push({
      element: key,
      matchedPreset,
      textSnippet: item.textSnippet,
      styles: item.styles
    });
  } else {
    categorized.customDivergent.push({
      element: key,
      textSnippet: item.textSnippet,
      styles: item.styles
    });
  }
});

fs.writeFileSync('execution/audit_summary.json', JSON.stringify(categorized, null, 2));
console.log('Linked elements:', categorized.linked.length);
console.log('Matching Unlinked elements:', categorized.matchingUnlinked.length);
console.log('Custom Divergent elements:', categorized.customDivergent.length);
