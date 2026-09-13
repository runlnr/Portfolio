const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://oia.ncku.edu.tw/var/file/32/1032/img/4575/763322805.pdf';
const destPath = path.join(__dirname, '..', 'assets', '763322805.pdf');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/pdf',
    'Referer': 'https://oia.ncku.edu.tw/'
  },
  rejectUnauthorized: false
};

console.log('Initiating download from:', url);
const file = fs.createWriteStream(destPath);

https.get(url, options, (res) => {
  console.log('Response status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);

  let downloaded = 0;
  res.on('data', (chunk) => {
    downloaded += chunk.length;
    process.stdout.write(`\rDownloaded ${downloaded} bytes`);
  });

  res.pipe(file);

  file.on('finish', () => {
    file.close(() => {
      console.log(`\nDownload completed successfully: ${destPath} (${fs.statSync(destPath).size} bytes)`);
      process.exit(0);
    });
  });
}).on('error', (err) => {
  fs.unlink(destPath, () => {});
  console.error('Download error:', err.message);
  process.exit(1);
});
