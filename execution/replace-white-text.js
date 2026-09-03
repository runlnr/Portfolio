const fs = require('fs');
const path = require('path');

const filesToProcess = [];

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!['node_modules', '.git', '.tmp', 'vendor'].includes(e.name)) {
        collectFiles(path.join(dir, e.name));
      }
    } else if (['.css', '.html', '.js'].includes(path.extname(e.name))) {
      filesToProcess.push(path.join(dir, e.name));
    }
  }
}

// Target directories and files
collectFiles(path.join(__dirname, '..', 'css'));
collectFiles(path.join(__dirname, '..', 'js'));
fs.readdirSync(path.join(__dirname, '..'))
  .filter(f => f.endsWith('.html'))
  .forEach(f => filesToProcess.push(path.join(__dirname, '..', f)));

let totalReplacements = 0;
const report = [];

filesToProcess.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // 1. CSS text color: match 'color: #ffffff' or 'color:#ffffff' but NOT 'background-color' or 'border-color'
  newContent = newContent.replace(/(?<![-_a-zA-Z0-9])color(\s*:\s*)#ffffff/gi, 'color$1#faf9fc');

  // 2. CSS variables specifically for text color:
  newContent = newContent.replace(/(--(?:f3-)?text(?:-color|-light)?\s*:\s*)#ffffff/gi, '$1#faf9fc');
  newContent = newContent.replace(/(--tagline-color\s*:\s*)#ffffff/gi, '$1#faf9fc');

  // 3. JS canvas font fillStyle and element.style.color:
  newContent = newContent.replace(/(\.fillStyle\s*=\s*['"])#ffffff(['"])/gi, '$1#faf9fc$2');
  newContent = newContent.replace(/(\.style\.color\s*=\s*['"])#ffffff(['"])/gi, '$1#faf9fc$2');

  if (newContent !== content) {
    const origWhiteCount = (content.match(/#ffffff/gi) || []).length;
    const newWhiteCount = (newContent.match(/#ffffff/gi) || []).length;
    const changed = origWhiteCount - newWhiteCount;
    fs.writeFileSync(file, newContent, 'utf8');
    report.push({ file: path.relative(path.join(__dirname, '..'), file), replacements: changed });
    totalReplacements += changed;
  }
});

console.log('Successfully updated white text (#ffffff -> #faf9fc)!');
console.log('Total text color replacements made:', totalReplacements);
console.table(report);
