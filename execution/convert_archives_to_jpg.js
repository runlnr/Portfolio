const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.resolve(__dirname, '../assets/archives');
const dstDir = path.resolve(srcDir, 'JPG');

if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir, { recursive: true });
}

async function convertAll() {
  const files = fs.readdirSync(srcDir);
  const webpFiles = files.filter(f => f.toLowerCase().endsWith('.webp'));

  console.log(`Found ${webpFiles.length} WebP files in ${srcDir}:`);

  for (const file of webpFiles) {
    const srcPath = path.join(srcDir, file);
    const baseName = path.parse(file).name;
    const dstPath = path.join(dstDir, `${baseName}.jpg`);

    console.log(`Converting "${file}" -> "${baseName}.jpg"...`);
    await sharp(srcPath)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(dstPath);

    const stats = fs.statSync(dstPath);
    console.log(`  Done: ${dstPath} (${stats.size} bytes)`);
  }

  console.log('\nAll WebP images successfully converted to JPG in assets/archives/JPG!');
}

convertAll().catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
