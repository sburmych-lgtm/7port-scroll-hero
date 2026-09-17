import { initSmoothScroll } from './smoothScroll.js';
import { CanvasScrubber } from './canvasScrubber.js';
import { createNarrativeTimeline } from './narrativeTimeline.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

async function bootstrap() {
  console.log('🚀 Initializing Apple-grade Scroll Hero Experience...');

  // 1. Initialize Smooth Scroll Engine
  const lenis = initSmoothScroll();

  // 2. Fetch Sequence Manifest
  const canvas = document.getElementById('hero-canvas');
  const heroSection = document.getElementById('hero-section');
  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');

  let manifest;
  try {
    const res = await fetch('frames/manifest.json');
    if (!res.ok) throw new Error(`Manifest not found: ${res.statusText}`);
    manifest = await res.json();
  } catch (err) {
    console.warn('⚠️ Could not load frames/manifest.json. Falling back to default configuration:', err.message);
    manifest = {
      totalFrames: 177,
      format: 'webp',
      padding: 4,
      finalShot: { src: 'Final_shot.png', width: 1672, height: 941 },
    };
  }

  // 3. Initialize Canvas Scrubber Engine
  const scrubber = new CanvasScrubber({
    canvas,
    manifest,
    onProgress: (percent) => {
      const rounded = Math.round(percent);
      if (loaderBar) loaderBar.style.width = `${rounded}%`;
      if (loaderText) loaderText.textContent = `Loading Experience ${rounded}%`;
    },
    onCriticalReady: () => {
      console.log('⚡ Critical frames ready. Dismissing preloader.');
      if (preloader) preloader.classList.add('loaded');
      ScrollTrigger.refresh();
    },
  });

  // 4. Start preloading assets
  await scrubber.preload();
  if (preloader && !preloader.classList.contains('loaded')) {
    preloader.classList.add('loaded');
  }

  // 5. Connect GSAP Narrative Timeline
  createNarrativeTimeline({
    container: heroSection,
    scrubber,
    totalFrames: manifest.totalFrames,
  });

  // 6. Refresh ScrollTrigger calculations
  ScrollTrigger.refresh();
  console.log('✅ Apple Scroll Hero Successfully Mounted!');
}

window.addEventListener('DOMContentLoaded', bootstrap);
