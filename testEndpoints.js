const http = require('http');
const server = require('./serve');

const endpoints = [
  '/',
  '/about.html',
  '/project.html',
  '/privacy.html',
  '/css/main.css',
  '/css/typography.css',
  '/css/components.css',
  '/css/glassmorphism.css',
  '/css/hero-3d.css',
  '/css/futurethree-scroll.css',
  '/css/project-modal.css',
  '/css/pages.css',
  '/css/responsive.css',
  '/js/motion-stack.js',
  '/js/futurethree-scroll.js',
  '/js/vendor/motion.min.js',
  '/js/text-flip.js',
  '/js/hero-ascii-tv.js',
  '/js/hero-scroll-transition.js',
  '/js/hero-statement-scramble.js',
  '/js/works.js',
  '/js/service-showcase.js',
  '/js/contact.js',
  '/js/about.js',
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

async function checkEndpoint(port, path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isOk = (path === '/works' || path === '/works.html' ? res.statusCode === 302 : res.statusCode === 200);
        console.log(`[${res.statusCode}] ${path} (${data.length} bytes) - ${isOk ? 'OK' : 'FAIL'}`);
        resolve(isOk);
      });
    }).on('error', (err) => {
      console.error(`[ERR] ${path}:`, err.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log('=== RUNNING STATIC ASSET & ENDPOINT VERIFICATION ===');
  
  // Start server on an ephemeral port for testing
  const testPort = 3199;
  let testServer = null;

  try {
    await new Promise((resolve, reject) => {
      testServer = server.listen(testPort, () => {
        resolve();
      });
      testServer.on('error', (err) => {
        // If already in use, test against the existing server on testPort or 3000
        resolve();
      });
    });

    let allOk = true;
    for (const ep of endpoints) {
      const ok = await checkEndpoint(testPort, ep);
      if (!ok) allOk = false;
    }

    console.log('\n--- VERIFICATION RESULT ---');
    console.log(`All ${endpoints.length} endpoints verified: ${allOk ? 'SUCCESS (PASS)' : 'FAILED'}`);
    
    if (testServer && testServer.listening) {
      testServer.close();
    }

    if (!allOk) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (e) {
    console.error('Test suite exception:', e);
    if (testServer && testServer.listening) testServer.close();
    process.exit(1);
  }
}

main();
