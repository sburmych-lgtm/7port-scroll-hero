import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling and flawlessly coordinates with GSAP ScrollTrigger ticker.
 */
export function initSmoothScroll() {
  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('♿ Prefers reduced motion active: Skipping smooth momentum scroll');
    return null;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // Let mobile touch scroll remain 100% responsive and native
  });

  // Synchronize ScrollTrigger on Lenis scroll events
  lenis.on('scroll', ScrollTrigger.update);

  // Drive Lenis directly via GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP lag smoothing to eliminate micro-stutters during heavy canvas rendering
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
