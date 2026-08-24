/**
 * Execution Script: Test Endpoints
 * Verifies that all HTML pages, CSS files, and JS modules return HTTP 200 OK.
 */

const http = require('http');

const endpoints = [
  '/',
  '/works',
  '/about',
  '/contact',
  '/project?id=wide-angle',
  '/policies',
  '/css/main.css',
  '/css/typography.css',
  '/css/components.css',
  '/css/pages.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/works.js',
  '/js/contact.js',
  '/js/project.js',
  '/js/projects-data.js'
];

async function checkEndpoint(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: urlPath,
          status: res.statusCode,
          length: data.length,
          ok: res.statusCode === 200
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
