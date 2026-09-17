#!/usr/bin/env node

/**
 * Automated Video-to-WebP Image Sequence Extractor & Manifest Generator
 * Extracts crisp keyframes from Video_scroll.MOV into public/frames/
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const videoPath = path.join(rootDir, 'Video_scroll.MOV');
const outputDir = path.join(rootDir, 'public', 'frames');

console.log('🎬 [Asset Pipeline] Starting Image Sequence Extraction...');

if (!fs.existsSync(videoPath)) {
  console.error(`❌ Error: Video file not found at ${videoPath}`);
  process.exit(1);
}

// Ensure output folder exists and is clean
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Probe video metadata
console.log('🔍 Probing video details...');
let duration = 5.9;
let originalFps = 60;
try {
  const probeOutput = execSync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=duration,r_frame_rate -of json "${videoPath}"`,
    { encoding: 'utf-8' }
  );
  const probeData = JSON.parse(probeOutput);
  if (probeData.streams && probeData.streams[0]) {
    duration = parseFloat(probeData.streams[0].duration) || 5.9;
    const rateParts = (probeData.streams[0].r_frame_rate || '60/1').split('/');
    originalFps = Math.round(parseInt(rateParts[0], 10) / parseInt(rateParts[1] || '1', 10));
  }
} catch (e) {
  console.warn('⚠️ ffprobe check skipped or failed, using defaults (duration ~5.9s, fps=60)');
}

console.log(`📹 Video length: ${duration.toFixed(2)}s | Source FPS: ${originalFps}`);

// Target extraction FPS: 30 fps produces ~177 frames (perfect balance of smoothness and network payload)
const targetFps = 30;
const outputPattern = path.join(outputDir, 'frame_%04d.webp');

console.log(`⚙️ Extracting at ${targetFps} FPS (WebP, q=78, lanczos scaling)...`);

const ffmpegCmd = `ffmpeg -y -i "${videoPath}" -vf "fps=${targetFps},scale=1920:1080:flags=lanczos" -c:v libwebp -lossless 0 -q:v 82 -compression_level 6 -preset photo "${outputPattern}"`;

try {
  execSync(ffmpegCmd, { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Failed running ffmpeg:', err.message);
  process.exit(1);
}

// 2. Count generated frames & calculate total size
const frameFiles = fs
  .readdirSync(outputDir)
  .filter((f) => f.startsWith('frame_') && f.endsWith('.webp'))
  .sort();

const totalFrames = frameFiles.length;
let totalSizeBytes = 0;
for (const file of frameFiles) {
  totalSizeBytes += fs.statSync(path.join(outputDir, file)).size;
}
const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

console.log(`✅ Extracted ${totalFrames} frames. Total sequence payload: ${totalSizeMB} MB`);

// 3. Write manifest.json
const manifest = {
  totalFrames,
  fps: targetFps,
  originalDuration: duration,
  width: 1920,
  height: 1080,
  aspectRatio: '16:9',
  format: 'webp',
  pattern: 'frames/frame_{index}.webp',
  padding: 4,
  firstFrame: frameFiles[0] ? `frames/${frameFiles[0]}` : null,
  lastFrame: frameFiles[totalFrames - 1] ? `frames/${frameFiles[totalFrames - 1]}` : null,
  finalShot: {
    src: 'Final_shot.png',
    width: 1672,
    height: 941,
  },
  generatedAt: new Date().toISOString(),
};

const manifestPath = path.join(outputDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`📄 Manifest saved to: ${manifestPath}`);
console.log('🎉 Image Sequence Pipeline Completed Successfully!\n');
