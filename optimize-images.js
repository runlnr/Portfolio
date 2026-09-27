const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, 'assets');
const MAX_WIDTH = 2560;
const WEBP_QUALITY = 85;
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

/**
 * Recursively find all files in a directory matching supported extensions.
 */
function findImageFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findImageFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

/**
 * Find all HTML files in a directory.
 */
function findHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        findHtmlFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Format bytes to human readable format.
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Convert an image file to WebP with max width boundary and quality 85.
 */
async function processImage(imagePath) {
  const dir = path.dirname(imagePath);
  const ext = path.extname(imagePath);
  const baseName = path.basename(imagePath, ext);
  const outputPath = path.join(dir, `${baseName}.webp`);

  const originalStats = fs.statSync(imagePath);
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  let transform = image;
  if (metadata.width && metadata.width > MAX_WIDTH) {
    transform = transform.resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
      fit: 'inside'
    });
  }

  await transform
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const newStats = fs.statSync(outputPath);
  const savedPercent = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);

  console.log(
    `✔ Converted: ${path.relative(__dirname, imagePath)} -> ${path.relative(__dirname, outputPath)} ` +
    `(${formatBytes(originalStats.size)} -> ${formatBytes(newStats.size)}, -${savedPercent}%)`
  );

  return {
    originalPath: imagePath,
    outputPath: outputPath,
    originalRelative: path.relative(__dirname, imagePath).replace(/\\/g, '/'),
    outputRelative: path.relative(__dirname, outputPath).replace(/\\/g, '/'),
    originalName: path.basename(imagePath),
    newName: `${baseName}.webp`
  };
}

/**
 * Update HTML files to reference the new .webp files.
 */
function updateHtmlReferences(conversions, htmlFiles) {
  console.log('\n--- Updating HTML Image References ---');

  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    let updated = false;

    for (const item of conversions) {
      // Plain path and filename
      const oldRel = item.originalRelative;
      const newRel = item.outputRelative;
      const oldName = item.originalName;
      const newName = item.newName;

      // URL-encoded variations (e.g., spaces to %20)
      const oldRelEncoded = encodeURI(oldRel);
      const newRelEncoded = encodeURI(newRel);
      const oldNameEncoded = encodeURIComponent(oldName);
      const newNameEncoded = encodeURIComponent(newName);

      // Replace relative paths
      if (content.includes(oldRel)) {
        content = content.split(oldRel).join(newRel);
        updated = true;
      }
      if (content.includes(oldRelEncoded)) {
        content = content.split(oldRelEncoded).join(newRelEncoded);
        updated = true;
      }

      // Replace individual file names in src or href attributes
      if (content.includes(oldName)) {
        content = content.split(oldName).join(newName);
        updated = true;
      }
      if (content.includes(oldNameEncoded)) {
        content = content.split(oldNameEncoded).join(newNameEncoded);
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(htmlFile, content, 'utf8');
      console.log(`✔ Updated references in: ${path.relative(__dirname, htmlFile)}`);
    } else {
      console.log(`- No matching image references in: ${path.relative(__dirname, htmlFile)}`);
    }
  }
}

async function main() {
  console.log('=== Image Optimization Pipeline (Sharp -> WebP) ===\n');
  console.log(`Assets Directory: ${ASSETS_DIR}`);
  console.log(`Max Width: ${MAX_WIDTH}px | WebP Quality: ${WEBP_QUALITY}%\n`);

  const imageFiles = findImageFiles(ASSETS_DIR);
  console.log(`Found ${imageFiles.length} image(s) to process.\n`);

  if (imageFiles.length === 0) {
    console.log('No .png, .jpg, or .jpeg files found.');
    return;
  }

  const conversions = [];
  for (const file of imageFiles) {
    try {
      const result = await processImage(file);
      conversions.push(result);
    } catch (err) {
      console.error(`✖ Failed to process ${file}:`, err.message);
    }
  }

  const htmlFiles = findHtmlFiles(__dirname);
  console.log(`\nFound ${htmlFiles.length} HTML file(s) to inspect.`);
  updateHtmlReferences(conversions, htmlFiles);

  console.log('\n=== Optimization Complete ===');
}

main().catch((err) => {
  console.error('Fatal error during image optimization:', err);
  process.exit(1);
});
