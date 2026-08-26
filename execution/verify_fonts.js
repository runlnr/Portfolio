const http = require('http');

const fontFiles = [
  '/assets/fonts/NeueHaasDisplayRoman.ttf',
  '/assets/fonts/NeueHaasDisplayMediu.ttf',
  '/assets/fonts/NeueHaasDisplayBold.ttf',
  '/assets/fonts/NeueHaasDisplayBlack.ttf',
  '/assets/fonts/NeueHaasDisplayLight.ttf',
  '/assets/fonts/NeueHaasDisplayThin.ttf',
  '/assets/fonts/NeueHaasDisplayXXThin.ttf',
  '/assets/fonts/NeueHaasDisplayRomanItalic.ttf'
];

async function checkFont(file) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${file}`, (res) => {
      let len = 0;
      res.on('data', chunk => len += chunk.length);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${file} (${len} bytes, type: ${res.headers['content-type']})`);
        resolve(res.statusCode === 200 && len > 50000);
      });
    }).on('error', (err) => {
      console.error(`Error on ${file}:`, err.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log('=== VERIFYING LOCAL TTF FONTS ===');
  let allOk = true;
  for (const f of fontFiles) {
    const ok = await checkFont(f);
    if (!ok) allOk = false;
  }
  console.log('All local fonts loaded successfully:', allOk);
  process.exit(allOk ? 0 : 1);
}
main();
