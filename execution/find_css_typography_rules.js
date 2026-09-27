const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '../css');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

const cssRules = [];

cssFiles.forEach(file => {
  const filePath = path.join(cssDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let currentSelector = '';
  let currentStartLine = 0;
  let inRule = false;
  let ruleProps = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip @keyframes, @media headers (simple parsing)
    if (!inRule) {
      if (trimmed.includes('{') && !trimmed.startsWith('@keyframes') && !trimmed.startsWith('@font-face')) {
        const parts = trimmed.split('{');
        currentSelector = parts[0].trim();
        currentStartLine = i + 1;
        inRule = true;
        ruleProps = {};
        if (parts[1] && parts[1].includes('}')) {
          // single line rule
          parseProps(parts[1].split('}')[0], ruleProps);
          saveRule(file, currentSelector, currentStartLine, ruleProps);
          inRule = false;
        } else if (parts[1]) {
          parseProps(parts[1], ruleProps);
        }
      }
    } else {
      if (trimmed.includes('}')) {
        const parts = trimmed.split('}');
        parseProps(parts[0], ruleProps);
        saveRule(file, currentSelector, currentStartLine, ruleProps);
        inRule = false;
        currentSelector = '';
        ruleProps = {};
      } else {
        parseProps(trimmed, ruleProps);
      }
    }
  }
});

function parseProps(str, obj) {
  const declarations = str.split(';');
  declarations.forEach(d => {
    const [prop, val] = d.split(':').map(s => s.trim());
    if (prop && val) {
      if (prop.startsWith('font') || prop.startsWith('letter-spacing') || prop.startsWith('line-height') || prop.startsWith('text-transform')) {
        obj[prop] = val;
      }
    }
  });
}

function saveRule(file, selector, line, props) {
  if (Object.keys(props).length > 0) {
    cssRules.push({
      file: `css/${file}`,
      line,
      selector,
      props
    });
  }
}

fs.writeFileSync('execution/css_typography_index.json', JSON.stringify(cssRules, null, 2));
console.log(`Found ${cssRules.length} CSS typography rules across ${cssFiles.length} files.`);
