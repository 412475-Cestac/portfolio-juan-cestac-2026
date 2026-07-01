const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const INPUT_DIR = path.resolve(process.cwd(), 'originals');
const OUTPUT_DIR = path.resolve(process.cwd(), 'src', 'assets', 'media');
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 82;

const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ignoredExtensions = new Set([
  '.cr2',
  '.cr3',
  '.nef',
  '.arw',
  '.tif',
  '.tiff',
  '.heic',
  '.dng',
  '.raw',
]);

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function getOutputPath(inputPath) {
  const relativePath = path.relative(INPUT_DIR, inputPath);
  const parsedPath = path.parse(relativePath);
  return path.join(OUTPUT_DIR, parsedPath.dir, `${parsedPath.name}.webp`);
}

async function optimizeImage(inputPath) {
  const outputPath = getOutputPath(inputPath);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(inputPath)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  return outputPath;
}

async function main() {
  if (!(await pathExists(INPUT_DIR))) {
    console.log('No originals/ directory found. Create it and add source images before running this script.');
    return;
  }

  const files = await walk(INPUT_DIR);
  let processed = 0;
  let ignored = 0;
  let failed = 0;

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(INPUT_DIR, filePath);

    if (!supportedExtensions.has(extension)) {
      ignored += 1;

      if (!ignoredExtensions.has(extension)) {
        console.log(`Ignored unsupported file: ${relativePath}`);
      }

      continue;
    }

    try {
      const outputPath = await optimizeImage(filePath);
      processed += 1;
      console.log(`Optimized: ${relativePath} -> ${path.relative(process.cwd(), outputPath)}`);
    } catch (error) {
      failed += 1;
      console.error(`Failed: ${relativePath}`);
      console.error(error.message);
    }
  }

  console.log('');
  console.log('Optimization summary');
  console.log(`Processed: ${processed}`);
  console.log(`Ignored: ${ignored}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${path.relative(process.cwd(), OUTPUT_DIR)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
