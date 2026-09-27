const fs = require('fs');
const report = JSON.parse(fs.readFileSync('execution/final_audit_report.json', 'utf8'));

console.log("=== Category 1: Linked Elements ===");
report.linkedGrouped.forEach(item => {
  console.log(`[${item.typeClass}] ${item.pattern}`);
  console.log(`  Example text: "${item.examples.join(' | ')}"`);
  if (item.sources.length) {
    item.sources.forEach(s => console.log(`  Source: ${s.file}:${s.line} -> ${s.selector}`));
  }
});

console.log("\n=== Category 2: Matching Unlinked Elements ===");
report.unlinkedGrouped.forEach(item => {
  console.log(`[Matches ${item.matchedPreset}] ${item.pattern}`);
  console.log(`  Computed: font-size: ${item.styles.fontSize}, line-height: ${item.styles.lineHeight}, letter-spacing: ${item.styles.letterSpacing}`);
  console.log(`  Example text: "${item.examples.join(' | ')}"`);
  if (item.sources.length) {
    item.sources.forEach(s => console.log(`  Source: ${s.file}:${s.line} -> ${s.selector}`));
  }
});

console.log("\n=== Category 3: Custom / Divergent Elements ===");
report.customGrouped.forEach(item => {
  console.log(`[Custom] ${item.pattern}`);
  console.log(`  Computed: font-size: ${item.styles.fontSize}, font-family: ${item.styles.fontFam.split(',')[0]}, line-height: ${item.styles.lineHeight}, letter-spacing: ${item.styles.letterSpacing}, weight: ${item.styles.fontWeight}`);
  console.log(`  Example text: "${item.examples.join(' | ')}"`);
  if (item.sources.length) {
    item.sources.forEach(s => console.log(`  Source: ${s.file}:${s.line} -> ${s.selector}`));
  }
});
