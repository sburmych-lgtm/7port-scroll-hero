import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  // WCAG Accessibility: Support prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('♿ Reduced motion active: Locking directly to Final Shot');
    if (finalShot) finalShot.style.opacity = '1';
    if (headlights) headlights.style.opacity = '0.85';
    if (routeRadar) routeRadar.style.opacity = '1';
    if (lockupCtas) lockupCtas.style.opacity = '1';
    if (heroContent) heroContent.style.opacity = window.innerWidth <= 1024 ? '1' : '0';
    scrubber.setFrame(totalFrames - 1);
    return null;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: '+=3000',
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const isMobile = window.innerWidth <= 1024;
        
        // 1. Scrub frames from 0 to totalFrames - 1
        const targetFrame = Math.round(animState.frame);
        scrubber.setFrame(targetFrame);

        // 2. Near the end of scroll (progress > 0.80), seamlessly crossfade to the crystal-clear Final_shot.png
        if (p > 0.80) {
          const crossfadeProgress = Math.min(1, Math.max(0, (p - 0.80) / 0.20));
          if (finalShot) finalShot.style.opacity = crossfadeProgress.toFixed(3);
          if (headlights) headlights.style.opacity = (crossfadeProgress * 0.9).toFixed(3);
          if (routeRadar) routeRadar.style.opacity = crossfadeProgress.toFixed(3);
          if (lockupCtas) lockupCtas.style.opacity = crossfadeProgress.toFixed(3);
          
          if (heroContent) {
            // On mobile, keep the accessible glass card visible; on desktop Final_shot.png provides razor-sharp typography
            heroContent.style.opacity = isMobile ? '1' : '0';
          }
        } else {
          if (finalShot) finalShot.style.opacity = '0';
          if (headlights) headlights.style.opacity = '0';
          if (routeRadar) routeRadar.style.opacity = '0';
          if (lockupCtas) lockupCtas.style.opacity = '0';
          
          if (heroContent) {
            if (isMobile) {
              heroContent.style.opacity = '1';
            } else {
              // Smooth initial fadeout on desktop as the truck starts driving
              heroContent.style.opacity = p < 0.12 ? (1 - p * 8).toFixed(3) : '0';
            }
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
