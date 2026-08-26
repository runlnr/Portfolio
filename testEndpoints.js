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
  '/js/motion-stack.js',
  '/js/futurethree-scroll.js',
  '/js/hero-ascii-tv.js',
  '/js/hero-scroll-transition.js',
  '/js/works.js',
  '/js/contact.js',
  '/js/project.js',
  '/js/projects-data.js',
  '/js/utils.js',
  '/js/app.js',
  '/assets/videos/Yellow%20Waves.mp4',
  '/assets/fonts/NeueHaasDisplayRoman.ttf'
];

async function checkEndpoint(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${path} (${data.length} bytes)`);
        const isOk = (path === '/works' || path === '/works.html' ? res.statusCode === 302 : res.statusCode === 200);
        resolve(isOk);
      });
    }).on('error', (err) => {
      console.error(`Error on ${path}:`, err.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log('=== TESTING ALL ENDPOINTS ===');
  let allOk = true;
  for (const ep of endpoints) {
    const ok = await checkEndpoint(ep);
    if (!ok) allOk = false;
  }
  console.log('All tests passed:', allOk);
}
main();
