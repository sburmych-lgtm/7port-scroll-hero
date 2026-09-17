import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hermite smoothstep interpolation for ultra-fluid cinematic transitions
 */
function smoothstep(min, max, val) {
  const x = Math.max(0, Math.min(1, (val - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Calculates smooth fade-in -> sustain -> fade-out curve
 */
function fadeBetween(val, inStart, inEnd, outStart, outEnd) {
  if (val < inStart || val > outEnd) return 0;
  if (val >= inEnd && val <= outStart) return 1;
  if (val < inEnd) return smoothstep(inStart, inEnd, val);
  return 1 - smoothstep(outStart, outEnd, val);
}

/**
 * 7PORT Master Narrative & 3D Truck Scroll Sequence Timeline
 */
export function createNarrativeTimeline({ container, scrubber, totalFrames }) {
  const animState = {
    frame: 0,
  };

  const finalShot = document.getElementById('final-shot-img');
  const headlights = document.getElementById('truck-headlights-glow');
  const routeRadar = document.getElementById('route-radar-layer');
  const lockupCtas = document.getElementById('hero-lockup-ctas');
  const heroContent = document.querySelector('.hero-main-content');
  const captionTruck = document.getElementById('intro-caption-truck');
  const captionPlane = document.getElementById('intro-caption-plane');

  // State: Once the user completes the intro, lock it permanently so it never scrubs backwards
  let introCompleted = false;

  function applyFinalHeroState() {
    scrubber.setFrame(totalFrames - 1);
    if (finalShot) finalShot.style.opacity = '1';
    if (headlights) headlights.style.opacity = '0.9';
    if (routeRadar) routeRadar.style.opacity = '1';
    if (lockupCtas) lockupCtas.style.opacity = '1';
    if (captionTruck) captionTruck.style.opacity = '0';
    if (captionPlane) captionPlane.style.opacity = '0';

    const isMobile = window.innerWidth <= 1024;
    if (heroContent) {
      heroContent.style.opacity = isMobile ? '1' : '0';
      heroContent.style.transform = 'translateY(0px)';
      heroContent.style.pointerEvents = isMobile ? 'auto' : 'none';
    }
  }

  // WCAG Accessibility: Support prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('♿ Reduced motion active: Locking directly to Final Shot');
    introCompleted = true;
    applyFinalHeroState();
    return null;
  }

  // Initial state on page load: 100% clean screen, 0 text, 0 captions
  if (finalShot) finalShot.style.opacity = '0';
  if (headlights) headlights.style.opacity = '0';
  if (routeRadar) routeRadar.style.opacity = '0';
  if (lockupCtas) lockupCtas.style.opacity = '0';
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(24px)';
    heroContent.style.pointerEvents = 'none';
  }
  if (captionTruck) {
    captionTruck.style.opacity = '0';
    captionTruck.style.transform = 'translateY(16px)';
  }
  if (captionPlane) {
    captionPlane.style.opacity = '0';
    captionPlane.style.transform = 'translateY(16px)';
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: '+=2600',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeave: () => {
        // User has scrolled past the hero section
        introCompleted = true;
        applyFinalHeroState();
      },
      onUpdate: (self) => {
        // If the intro has already played to completion, lock it at the final Hero state
        if (introCompleted) {
          applyFinalHeroState();
          return;
        }

        const p = self.progress;

        // Check if user has reached the end of the intro sequence (97%+)
        if (p >= 0.97) {
          introCompleted = true;
          applyFinalHeroState();
          return;
        }

        // 1. Scrub frames from 0 to totalFrames - 1
        const targetFrame = Math.round(animState.frame);
        scrubber.setFrame(targetFrame);

        // 2. Phase 1: Truck Maneuver Caption (~0.16 to 0.44)
        const truckOpacity = fadeBetween(p, 0.16, 0.24, 0.38, 0.44);
        if (captionTruck) {
          captionTruck.style.opacity = truckOpacity.toFixed(3);
          captionTruck.style.transform = `translateY(${((1 - truckOpacity) * 16).toFixed(1)}px)`;
          captionTruck.style.pointerEvents = truckOpacity > 0.5 ? 'auto' : 'none';
        }

        // 3. Phase 2: Cargo Plane Caption (~0.46 to 0.72)
        const planeOpacity = fadeBetween(p, 0.46, 0.54, 0.66, 0.72);
        if (captionPlane) {
          captionPlane.style.opacity = planeOpacity.toFixed(3);
          captionPlane.style.transform = `translateY(${((1 - planeOpacity) * 16).toFixed(1)}px)`;
          captionPlane.style.pointerEvents = planeOpacity > 0.5 ? 'auto' : 'none';
        }

        // 4. Phase 3: Ultra-smooth Climax into Main Hero (0.74 to 0.97)
        if (p > 0.74) {
          const t = smoothstep(0.74, 0.96, p);
          
          if (finalShot) finalShot.style.opacity = t.toFixed(3);
          if (headlights) headlights.style.opacity = (t * 0.9).toFixed(3);
          if (routeRadar) routeRadar.style.opacity = t.toFixed(3);
          if (lockupCtas) lockupCtas.style.opacity = t.toFixed(3);

          const isMobile = window.innerWidth <= 1024;
          if (heroContent) {
            heroContent.style.opacity = isMobile ? t.toFixed(3) : '0';
            heroContent.style.transform = `translateY(${((1 - t) * 20).toFixed(1)}px)`;
            heroContent.style.pointerEvents = isMobile && t > 0.7 ? 'auto' : 'none';
          }
        } else {
          if (finalShot) finalShot.style.opacity = '0';
          if (headlights) headlights.style.opacity = '0';
          if (routeRadar) routeRadar.style.opacity = '0';
          if (lockupCtas) lockupCtas.style.opacity = '0';
          if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(24px)';
            heroContent.style.pointerEvents = 'none';
          }
        }
      },
    },
  });

  // Animate frame counter across the timeline
  tl.to(animState, {
    frame: totalFrames - 1,
    ease: 'none',
    duration: 10,
  }, 0);

  return tl;
}
