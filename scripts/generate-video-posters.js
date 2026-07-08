const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const PHOTOS_FILE = path.resolve(process.cwd(), 'src', 'app', 'data', 'photos.ts');
const OUTPUT_DIR = path.resolve(process.cwd(), 'src', 'assets', 'media', 'performance', 'video-posters');

function getOptimizedVideoSrc(src) {
  if (src.startsWith('assets/images/brands/')) {
    return src.replace('assets/images/brands/', 'assets/media/');
  }

  if (src.startsWith('assets/images/shows-night/')) {
    return src.replace('assets/images/shows-night/', 'assets/media/');
  }

  if (src.startsWith('assets/images/events/')) {
    return src.replace('assets/images/events/', 'assets/media/events/');
  }

  if (src.startsWith('assets/images/architecture-interiors/')) {
    return src.replace('assets/images/architecture-interiors/', 'assets/media/architecture-interiors/');
  }

  return src;
}

function getVideoItems() {
  const source = fs.readFileSync(PHOTOS_FILE, 'utf8');
  const matches = source.matchAll(/createMediaItem\(\{([^}]+)\}\)/g);

  return Array.from(matches)
    .map(([, body]) => {
      const id = body.match(/id: '([^']+)'/)?.[1];
      const src = body.match(/src: '([^']+\.mp4)'/)?.[1];

      return id && src ? { id, src: getOptimizedVideoSrc(src) } : undefined;
    })
    .filter(Boolean);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let generated = 0;
let skipped = 0;
let failed = 0;

for (const item of getVideoItems()) {
  const inputPath = path.resolve(process.cwd(), item.src.replace(/^assets\//, 'src/assets/'));
  const outputPath = path.join(OUTPUT_DIR, `${item.id}.webp`);

  if (fs.existsSync(outputPath)) {
    skipped += 1;
    continue;
  }

  if (!fs.existsSync(inputPath)) {
    failed += 1;
    console.error(`Missing video: ${path.relative(process.cwd(), inputPath)}`);
    continue;
  }

  const result = spawnSync('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-ss',
    '00:00:02',
    '-i',
    inputPath,
    '-frames:v',
    '1',
    '-vf',
    'scale=1200:-2',
    '-c:v',
    'libwebp',
    '-quality',
    '82',
    outputPath,
    '-y'
  ], { stdio: 'pipe' });

  if (result.status !== 0) {
    failed += 1;
    console.error(`Failed poster: ${path.relative(process.cwd(), inputPath)}`);
    console.error(result.stderr.toString());
    continue;
  }

  generated += 1;
  console.log(`Generated: ${path.relative(process.cwd(), outputPath)}`);
}

console.log('');
console.log('Video poster summary');
console.log(`Generated: ${generated}`);
console.log(`Skipped: ${skipped}`);
console.log(`Failed: ${failed}`);
