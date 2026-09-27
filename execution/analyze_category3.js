const fs = require('fs');

const data = JSON.parse(fs.readFileSync('execution/clean_filtered_report.json', 'utf8'));
const customItems = data.customDivergent;

const PRESETS = [
  { id: 'type-aero-a', name: 'AT Aero Type A', font: 'aero', size: 43, line: 49, spacing: -2.0, weight: 350 },
  { id: 'type-aero-b', name: 'AT Aero Type B', font: 'aero', size: 30, line: 35, spacing: -1.0, weight: 400 },
  { id: 'type-aero-c', name: 'AT Aero Type C', font: 'aero', size: 20, line: 27.5, spacing: -1.2, weight: 400 },
  { id: 'type-aero-d', name: 'AT Aero Type D', font: 'aero', size: 230, line: 230, spacing: -17.0, weight: 500 },
  { id: 'type-aero-e', name: 'AT Aero Type E', font: 'aero', size: 14.5, line: 20, spacing: -0.3, weight: 350 },
  { id: 'type-aero-f', name: 'AT Aero Type F', font: 'aero', size: 16, line: 22, spacing: -0.3, weight: 400 },
  { id: 'type-mono-a', name: 'PP Supply Mono Type A', font: 'mono', size: 11, line: 13, spacing: 0.5, weight: 400 }
];

function parsePx(val) {
  if (!val || val === 'normal') return null;
  const match = val.toString().match(/([-\d.]+)px/);
  return match ? parseFloat(match[1]) : null;
}

function parseWeight(val) {
  if (!val) return 400;
  if (val === 'bold') return 700;
  if (val === 'normal') return 400;
  return parseInt(val, 10) || 400;
}

function analyzeItem(item) {
  const styles = item.styles;
  const isMono = styles.fontFam.toLowerCase().includes('mono');
  const fontCategory = isMono ? 'mono' : 'aero';

  const size = parsePx(styles.fontSize);
  const line = parsePx(styles.lineHeight);
  const spacing = parsePx(styles.letterSpacing);
  const weight = parseWeight(styles.fontWeight);

  let bestMatch = null;
  let minDiffs = 999;
  let bestDetails = [];

  for (const preset of PRESETS) {
    if (preset.font !== fontCategory) continue;

    const diffs = [];

    // Check size
    const sizeDiff = size !== null ? Math.abs(size - preset.size) : 99;
    if (sizeDiff > 0.5) {
      diffs.push(`Font size is ${styles.fontSize} (preset has ${preset.size}px)`);
    }

    // Check line height
    const lineDiff = line !== null ? Math.abs(line - preset.line) : 99;
    if (line !== null && lineDiff > 3) {
      diffs.push(`Line height is ${styles.lineHeight} (preset has ${preset.line}px)`);
    }

    // Check letter spacing
    const spacingDiff = spacing !== null ? Math.abs(spacing - preset.spacing) : 99;
    if (spacing !== null && spacingDiff > 0.4) {
      diffs.push(`Letter spacing is ${styles.letterSpacing} (preset has ${preset.spacing}px)`);
    }

    // Check weight
    if (Math.abs(weight - preset.weight) >= 100) {
      diffs.push(`Font weight is ${weight} (preset has ${preset.weight})`);
    }

    if (diffs.length < minDiffs) {
      minDiffs = diffs.length;
      bestMatch = preset;
      bestDetails = diffs;
    }
  }

  // Also check if size is very close (e.g. 15px vs 14.5px/16px, 29.6px vs 30px, 25px vs 30px/20px)
  return {
    item,
    bestMatch,
    diffCount: minDiffs,
    diffDetails: bestDetails,
    isSimilar: minDiffs === 1 || (minDiffs === 2 && bestDetails.every(d => !d.includes('weight')) && (size && (Math.abs(size - (bestMatch?.size || 0)) <= 1.5)))
  };
}

const classified = customItems.map(analyzeItem);

const similarList = classified.filter(c => c.isSimilar);
const differentList = classified.filter(c => !c.isSimilar);

console.log(`Classification complete:`);
console.log(`- Similar elements (1 property differing from closest preset): ${similarList.length}`);
console.log(`- Different elements (completely custom / multi-property divergence): ${differentList.length}`);

fs.writeFileSync('execution/category3_breakdown.json', JSON.stringify({
  similarCount: similarList.length,
  differentCount: differentList.length,
  similarList,
  differentList
}, null, 2));
