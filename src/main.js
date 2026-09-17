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
  const heroSection = document.getElementById('hero-scroll');
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
      if (loaderText) loaderText.textContent = `Завантаження 3D сцени ${rounded}%`;
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

  // 6. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const desktopMenu = document.querySelector('.desktop-menu');
  if (mobileToggle && desktopMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = desktopMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileToggle.classList.toggle('active', isOpen);
    });

    // Close menu when clicking nav link
    desktopMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        desktopMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 7. Disciplined Calculator Form Handler (Audit F-03)
  const calcForm = document.getElementById('lead-calc-form');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = calcForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Обробка запиту...
        `;
      }

      setTimeout(() => {
        const formParent = calcForm.parentElement;
        calcForm.reset();
        
        const successBanner = document.createElement('div');
        successBanner.className = 'calc-success-banner';
        successBanner.setAttribute('role', 'alert');
        successBanner.innerHTML = `
          <div class="success-icon">✅</div>
          <h3>Запит на розрахунок успішно прийнято!</h3>
          <p>Провідний логіст 7PORT вже аналізує ваш маршрут. Ми зв'яжемося з вами з детальним кошторисом найближчим часом.</p>
          <button type="button" class="btn-reset-calc">Розрахувати інший вантаж</button>
        `;

        calcForm.style.display = 'none';
        formParent.appendChild(successBanner);

        successBanner.querySelector('.btn-reset-calc').addEventListener('click', () => {
          successBanner.remove();
          calcForm.style.display = 'grid';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        });
      }, 700);
    });
  }

  // 8. Refresh ScrollTrigger calculations
  ScrollTrigger.refresh();
  console.log('✅ 7PORT Master Scroll Hero Experience Successfully Mounted!');
}

window.addEventListener('DOMContentLoaded', bootstrap);
