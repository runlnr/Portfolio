/**
 * Execution Script: Test Endpoints
 * Verifies that all HTML pages, CSS files, and JS modules return HTTP 200/302 OK.
 */

const http = require('http');

const endpoints = [
  '/',
  '/works',
  '/works.html',
  '/about',
  '/contact',
  '/project?id=wide-angle',
  '/policies',
  '/css/main.css',
  '/css/typography.css',
  '/css/components.css',
  '/css/glassmorphism.css',
  '/css/hero-3d.css',
  '/css/futurethree-scroll.css',
  '/css/pages.css',
  '/css/responsive.css',
  '/css/visual-designer.css',
  '/js/motion-stack.js',
  '/js/futurethree-scroll.js',
  '/js/hero-ascii-tv.js',
  '/js/hero-scroll-transition.js',
  '/js/hero-statement-scramble.js',
  '/js/visual-designer.js',
  '/js/works.js',
  '/js/contact.js',
  '/js/project.js',
  '/js/projects-data.js',
  '/js/utils.js',
  '/js/app.js',
  '/assets/videos/Static.mp4',
  '/assets/fonts/NeueHaasDisplayRoman.ttf'
];

async function checkEndpoint(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isOk = (urlPath === '/works' || urlPath === '/works.html' ? res.statusCode === 302 : res.statusCode === 200);
        resolve({
          path: urlPath,
          status: res.statusCode,
          length: data.length,
          ok: isOk
        });
      });
    }).on('error', (err) => {
      resolve({ path: urlPath, error: err.message, ok: false });
    });
  });
}

async function run() {
  console.log('=== VERIFYING ALL ENDPOINTS ===');
  let allOk = true;
  for (const ep of endpoints) {
    const res = await checkEndpoint(ep);
    if (!res.ok) {
      console.error(`[FAIL] ${ep}: ${res.error || res.status}`);
      allOk = false;
    } else {
      console.log(`[PASS] ${ep} (Status: ${res.status}, Size: ${res.length}B)`);
    }
  }
  console.log('\nAll endpoints operational:', allOk);
  process.exit(allOk ? 0 : 1);
}

run();
