const fs = require('fs');

const data = JSON.parse(fs.readFileSync('execution/clean_filtered_report.json', 'utf8'));

// Format markdown
let md = `# Comprehensive Typography Audit Report\n\n`;

md += `> **Audit Scope**: Complete traversal of Homepage (\`/\`), About page/tab (\`/about.html\`), Project detail page (\`/project.html\`), Contact Modal, and Navigation Dropdown.\n\n`;

md += `## 1. Summary Overview\n\n`;
md += `| Category | Description | Count |\n`;
md += `| :--- | :--- | :--- |\n`;
md += `| **Category 1: Formally Linked** | Elements explicitly assigned a \`.type-aero-*\` or \`.type-mono-*\` utility class in HTML/JS | **${data.linked.length}** component patterns |\n`;
md += `| **Category 2: Matching Unlinked** | Elements styled with properties matching an Aero/Mono preset but defined via standalone CSS rules instead of utility classes | **${data.matchingUnlinked.length}** component patterns |\n`;
md += `| **Category 3: Custom / Divergent** | Elements using custom typography (divergent font-sizes, line-heights, letter-spacings, or font-families) | **${data.customDivergent.length}** component patterns |\n\n`;

md += `---\n\n`;

// Helper to format source
function formatSources(sources) {
  if (!sources || sources.length === 0) return '*(Inherited / inline)*';
  return sources.map(s => `[\`${s.file}:${s.line}\`](file:///${s.file.replace(/\\/g, '/')}#L${s.line}) (\`${s.selector}\`)`).join('<br>');
}

function cleanText(t) {
  if (!t) return '';
  return t.replace(/\n/g, ' ').substring(0, 45) + (t.length > 45 ? '...' : '');
}

// Category 1
md += `## 2. Category 1: Formally Linked to Typography Classes (${data.linked.length})\n\n`;
md += `These elements are directly assigned a typography class (\`.type-aero-*\` or \`.type-mono-*\`) from [\`css/typography.css\`](file:///css/typography.css).\n\n`;
md += `| Page / Context | Element / Selector | Linked Class | Sample Text | Source CSS / Line |\n`;
md += `| :--- | :--- | :--- | :--- | :--- |\n`;

data.linked.forEach(item => {
  const page = item.page;
  const sel = `\`${item.selector}\``;
  const cls = `\`${item.typeClass}\``;
  const sample = `"${cleanText(item.textSnippet)}"`;
  const src = formatSources(item.sources);
  md += `| ${page} | ${sel} | ${cls} | ${sample} | ${src} |\n`;
});

md += `\n---\n\n`;

// Category 2
md += `## 3. Category 2: Matching Properties but Unlinked (${data.matchingUnlinked.length})\n\n`;
md += `These elements have computed typography values matching one of the Aero/Mono presets, but their styles are duplicated inside custom CSS files instead of linking to the typography class.\n\n`;
md += `| Page / Context | Element / Selector | Matched Preset | Computed Specs | Sample Text | Source CSS / Line |\n`;
md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

data.matchingUnlinked.forEach(item => {
  const page = item.page;
  const sel = `\`${item.selector}\``;
  const matched = `\`${item.matchedPreset}\``;
  const specs = `${item.styles.fontSize} / ${item.styles.lineHeight} / ${item.styles.letterSpacing}`;
  const sample = `"${cleanText(item.textSnippet)}"`;
  const src = formatSources(item.sources);
  md += `| ${page} | ${sel} | ${matched} | ${specs} | ${sample} | ${src} |\n`;
});

md += `\n---\n\n`;

// Category 3
md += `## 4. Category 3: Custom / Divergent Properties (${data.customDivergent.length})\n\n`;
md += `These elements use standalone typography properties that diverge from the standard Aero and Mono type scales in [\`css/typography.css\`](file:///css/typography.css).\n\n`;
md += `| Page / Context | Element / Selector | Computed Typography | Sample Text | Source CSS / Line |\n`;
md += `| :--- | :--- | :--- | :--- | :--- |\n`;

data.customDivergent.forEach(item => {
  const page = item.page;
  const sel = `\`${item.selector}\``;
  const specs = `**Font**: ${item.styles.fontFam.split(',')[0]}<br>**Size**: ${item.styles.fontSize} (${item.styles.fontWeight})<br>**Line**: ${item.styles.lineHeight} \| **Track**: ${item.styles.letterSpacing}`;
  const sample = `"${cleanText(item.textSnippet)}"`;
  const src = formatSources(item.sources);
  md += `| ${page} | ${sel} | ${specs} | ${sample} | ${src} |\n`;
});

fs.writeFileSync('execution/audit_report.md', md, 'utf8');
console.log('Successfully written execution/audit_report.md');
