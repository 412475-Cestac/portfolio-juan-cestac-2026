const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const TIMESTAMPS = [2, 4, 6, 8, 10];

const COVERS = [
  {
    group: 'Redbull x La Fabrica',
    input: 'src/assets/media/events/EVENTS/REDBULL X LA FABRICA/REDBULL X LA FABRICA.mp4',
    output: 'src/assets/media/events/EVENTS/REDBULL X LA FABRICA/cover.webp'
  },
  {
    group: 'Mola',
    input: 'src/assets/media/events/EVENTS/MOLA/MOLA AUTO.mp4',
    output: 'src/assets/media/events/EVENTS/MOLA/cover.webp'
  },
  {
    group: 'Meed x Session',
    input: 'src/assets/media/events/EVENTS/MEED X SESSION/B2B.mp4',
    output: 'src/assets/media/events/EVENTS/MEED X SESSION/cover.webp'
  },
  {
    group: 'Mante',
    input: 'src/assets/media/BRANDS/MANTE/MANTE 01.mp4',
    output: 'src/assets/media/BRANDS/MANTE/cover.webp'
  },
  {
    group: 'Victory',
    input: 'src/assets/media/BRANDS/VICTORY/VICTORY R1.mp4',
    output: 'src/assets/media/BRANDS/VICTORY/cover.webp'
  },
  {
    group: 'Amelie Lens',
    input: 'src/assets/media/SHOWS . NIGHT/AMELIE LENS/AMELIE FIN.mp4',
    output: 'src/assets/media/SHOWS . NIGHT/AMELIE LENS/cover.webp'
  },
  {
    group: 'Argy',
    input: 'src/assets/media/SHOWS . NIGHT/ARGY/ARGY 1.mp4',
    output: 'src/assets/media/SHOWS . NIGHT/ARGY/cover.webp'
  },
  {
    group: 'Konstantin Sibold - Adam Sellouk',
    input: 'src/assets/media/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/KONSTANTIN Y ADAM 1.mp4',
    output: 'src/assets/media/SHOWS . NIGHT/KONSTANTIN SIBOLD - ADAM SELLOUK/cover.webp'
  },
  {
    group: 'Mau P',
    input: 'src/assets/media/SHOWS . NIGHT/MAU P/MAUPAPI.mp4',
    output: 'src/assets/media/SHOWS . NIGHT/MAU P/cover.webp'
  },
  {
    group: 'Rufus Du Sol',
    input: 'src/assets/media/SHOWS . NIGHT/RUFUS DU SOL/RUFUS 1.mp4',
    output: 'src/assets/media/SHOWS . NIGHT/RUFUS DU SOL/cover.webp'
  },
  {
    group: 'Tobi Amuchastegui Boat Party',
    input: 'src/assets/media/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/02.mp4',
    output: 'src/assets/media/SHOWS . NIGHT/TOBI AMUCHASTEGUI BOAT PARTY/cover.webp'
  },
  {
    group: 'Pawsa',
    input: 'src/assets/media/SHOWS . NIGHT/PAWSA/PAWSA DROP.mp4',
    output: 'src/assets/media/SHOWS . NIGHT/PAWSA/cover.webp'
  }
];

function runFfmpeg(input, output, second) {
  return spawnSync('ffmpeg', [
    '-ss', `00:00:${String(second).padStart(2, '0')}`,
    '-i', input,
    '-update', '1',
    '-frames:v', '1',
    '-vf', 'scale=1600:1600:force_original_aspect_ratio=decrease',
    output,
    '-y'
  ], { stdio: 'pipe' });
}

async function brightness(filePath) {
  const stats = await sharp(filePath).stats();
  return (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / 3;
}

async function generateCover(config) {
  const input = path.join(ROOT, config.input);
  const output = path.join(ROOT, config.output);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cover-'));

  if (!fs.existsSync(input)) {
    throw new Error(`No existe el video de origen: ${config.input}`);
  }

  let bestFrame = '';
  let bestBrightness = -1;
  let bestSecond = 0;

  for (const second of TIMESTAMPS) {
    const frame = path.join(tmpDir, `${config.group.replace(/[^a-z0-9]+/gi, '-')}-${second}.webp`);
    const result = runFfmpeg(input, frame, second);

    if (result.status !== 0 || !fs.existsSync(frame)) {
      continue;
    }

    const score = await brightness(frame);
    if (score > bestBrightness) {
      bestBrightness = score;
      bestFrame = frame;
      bestSecond = second;
    }
  }

  if (!bestFrame) {
    throw new Error(`No se pudo generar cover para ${config.group}`);
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(bestFrame, output);
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  } catch {
    // Windows can keep ffmpeg outputs locked briefly; stale temp frames are harmless.
  }

  console.log(`${config.group}: ${config.output} desde ${config.input} @ ${bestSecond}s (brillo ${bestBrightness.toFixed(1)})`);
}

(async () => {
  for (const config of COVERS) {
    await generateCover(config);
  }
})();
