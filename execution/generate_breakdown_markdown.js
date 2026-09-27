const fs = require('fs');

const data = JSON.parse(fs.readFileSync('execution/category3_breakdown.json', 'utf8'));

// Format markdown
let md = `# Category 3 Breakdown: Similar vs Different\n\n`;

md += `> **Analysis Rule**: \n`;
md += `> - **Similar List**: Text blocks that are close to an existing Aero/Mono type preset with **only 1 property diverging** (e.g., slightly different size like 15px vs 14.5px, or slightly different line-height/spacing).\n`;
md += `> - **Different List**: Text blocks with **multiple diverging properties**, custom clamped viewport calculations, or completely standalone non-standard scales.\n\n`;

function formatSources(sources) {
  if (!sources || sources.length === 0) return '*(Inherited / inline)*';
  return sources.map(s => `[\`${s.file}:${s.line}\`](file:///${s.file.replace(/\\/g, '/')}#L${s.line}) (\`${s.selector}\`)`).join('<br>');
}

function cleanText(t) {
  if (!t) return '';
  return t.replace(/\n/g, ' ').substring(0, 40) + (t.length > 40 ? '...' : '');
}

// 1. Similar List
md += `## 1. "Similar" List (${data.similarCount} components — 1 property diverging)\n\n`;
md += `These elements closely match an established Aero or Mono type preset and only diverge by a single parameter (usually font-size by ~0.5–1px, line-height, or letter-spacing).\n\n`;
md += `| Page / Context | Element / Selector | Closest Preset | Diverging Property (Difference) | Sample Text | Source CSS / Line |\n`;
md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

data.similarList.forEach(entry => {
  const item = entry.item;
  const page = item.page;
  const sel = `\`${item.selector}\``;
  const closest = `\`${entry.bestMatch.id}\` (${entry.bestMatch.name})`;
  const diffStr = entry.diffDetails.join('; ');
  const sample = `"${cleanText(item.textSnippet)}"`;
  const src = formatSources(item.sources);
  md += `| ${page} | ${sel} | ${closest} | ${diffStr} | ${sample} | ${src} |\n`;
});

md += `\n---\n\n`;

// 2. Different List
md += `## 2. "Different" List (${data.differentCount} components — Completely custom / Multi-property divergence)\n\n`;
md += `These elements use standalone styling with multiple custom properties, clamped fluid typography (\`clamp()\`), or special non-standard sizing scales.\n\n`;
md += `| Page / Context | Element / Selector | Computed Typography | Why It's Different | Sample Text | Source CSS / Line |\n`;
md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

data.differentList.forEach(entry => {
  const item = entry.item;
  const page = item.page;
  const sel = `\`${item.selector}\``;
  const specs = `**Font**: ${item.styles.fontFam.split(',')[0]}<br>**Size**: ${item.styles.fontSize} (${item.styles.fontWeight})<br>**Line**: ${item.styles.lineHeight} \| **Track**: ${item.styles.letterSpacing}`;
  const why = entry.diffDetails.length > 0 ? entry.diffDetails.slice(0, 2).join('<br>') : 'Custom scale / layout property';
  const sample = `"${cleanText(item.textSnippet)}"`;
  const src = formatSources(item.sources);
  md += `| ${page} | ${sel} | ${specs} | ${why} | ${sample} | ${src} |\n`;
});

fs.writeFileSync('execution/category3_report.md', md, 'utf8');
console.log('Successfully written execution/category3_report.md');
