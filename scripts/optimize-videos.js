const fs = require('node:fs/promises');
const path = require('node:path');
const { spawn } = require('node:child_process');

const INPUT_DIR = path.resolve(process.cwd(), 'originals');
const OUTPUT_DIR = path.resolve(process.cwd(), 'src', 'assets', 'media');
const LARGE_FILE_WARNING_BYTES = 50 * 1024 * 1024;

const supportedExtensions = new Set(['.mp4', '.mov', '.webm', '.mkv', '.avi']);

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr.trim() || `${command} exited with code ${code}`));
    });
  });
}

async function ensureFfmpeg() {
  try {
    await runCommand('ffmpeg', ['-version']);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('FFmpeg is required. Please install FFmpeg and make sure it is available in PATH.');
      return false;
    }

    throw error;
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
  return path.join(OUTPUT_DIR, parsedPath.dir, `${parsedPath.name}.mp4`);
}

async function optimizeVideo(inputPath) {
  const outputPath = getOutputPath(inputPath);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await runCommand('ffmpeg', [
    '-y',
    '-i',
    inputPath,
    '-vf',
    "scale='min(1920,iw)':-2",
    '-c:v',
    'libx264',
    '-crf',
    '26',
    '-preset',
    'medium',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-movflags',
    '+faststart',
    outputPath,
  ]);

  return outputPath;
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  if (!(await pathExists(INPUT_DIR))) {
    console.log('No originals/ directory found. Create it and add source videos before running this script.');
    return;
  }

  if (!(await ensureFfmpeg())) {
    process.exitCode = 1;
    return;
  }

  const files = await walk(INPUT_DIR);
  let processed = 0;
  let ignored = 0;
  let failed = 0;
  let warned = 0;

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(INPUT_DIR, filePath);

    if (!supportedExtensions.has(extension)) {
      ignored += 1;
      continue;
    }

    try {
      const outputPath = await optimizeVideo(filePath);
      const outputStats = await fs.stat(outputPath);
      processed += 1;

      console.log(`Optimized: ${relativePath} -> ${path.relative(process.cwd(), outputPath)} (${formatBytes(outputStats.size)})`);

      if (outputStats.size > LARGE_FILE_WARNING_BYTES) {
        warned += 1;
        console.warn('Warning: optimized video is still larger than 50 MB. Consider lowering quality, trimming duration, or hosting externally.');
      }
    } catch (error) {
      failed += 1;
      console.error(`Failed: ${relativePath}`);
      console.error(error.message);
    }
  }

  console.log('');
  console.log('Video optimization summary');
  console.log(`Processed: ${processed}`);
  console.log(`Ignored: ${ignored}`);
  console.log(`Failed: ${failed}`);
  console.log(`Warnings: ${warned}`);
  console.log(`Output: ${path.relative(process.cwd(), OUTPUT_DIR)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
