const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4'
};

const root = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(3245, async () => {
  console.log('Server started on port 3245');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('np_has_seen_intro', 'true');
    document.documentElement.classList.add('skip-intro');
  });

  await page.goto('http://localhost:3245/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const unirosBlock = page.locator('.f3-gallery-project-block[data-project-id="uniros"]');
  await unirosBlock.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const outPath = path.join(__dirname, 'uniros_row_preview.png');
  await unirosBlock.screenshot({ path: outPath });
  console.log('Uniros screenshot saved at:', outPath);

  await browser.close();
  server.close();
  process.exit(0);
});
