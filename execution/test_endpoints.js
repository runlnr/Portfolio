/**
 * Execution Script: Test Endpoints
 * Verifies that all HTML pages, CSS files, and JS modules return HTTP 200/302 OK.
 */

const http = require('http');

const endpoints = [
  '/',
  '/works',
  '/works.html',
  '/project.html',
  '/project.html?id=memphis-grizzlies',
  '/project.html?id=us-ski-snowboard',
  '/project.html?id=nk-hoops',
  '/project.html?id=audi-revolut-f1',
  '/css/main.css',
  '/css/typography.css',
  '/css/components.css',
  '/css/glassmorphism.css',
  '/css/hero-3d.css',
  '/css/scherre-scroll.css',
  '/css/project-modal.css',
  '/css/pages.css',
  '/css/responsive.css',
  '/js/motion-stack.js',
  '/js/scherre-scroll.js',
  '/js/vendor/motion.min.js',
  '/js/text-flip.js',
  '/js/hero-ascii-tv.js',
  '/js/hero-scroll-transition.js',
  '/js/hero-statement-scramble.js',
  '/js/works.js',
  '/js/service-showcase.js',
  '/js/contact.js',
  '/js/project.js',
  '/js/projects-data.js',
  '/js/project-modal.js',
  '/js/utils.js',
  '/js/app.js',
  '/data/projects.json',
  '/assets/videos/Static.mp4',
  '/assets/fonts/NeueHaasDisplayRoman.ttf',
  '/assets/fonts/AtAero-Regular.otf',
  '/assets/fonts/AtAero-Retina.otf',
  '/assets/fonts/PPSupplyMono-Regular.otf',
  '/assets/logo/logo.svg',
  '/assets/logo/favicon.svg'
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
  if (!allOk) process.exit(1);
}

run();
