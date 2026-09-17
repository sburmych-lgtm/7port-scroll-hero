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
  const routeOverlay = document.getElementById('route-singapore-kyiv');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: '+=2800',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        
        // 1. Scrub frames from 0 to totalFrames - 1
        scrubber.setFrame(animState.frame);

        // 2. Near the end of scroll (progress > 0.85), seamlessly crossfade to the crystal-clear Final_shot.png
        if (p > 0.82) {
          const crossfadeProgress = (p - 0.82) / 0.18;
          if (finalShot) finalShot.style.opacity = crossfadeProgress.toFixed(3);
          if (headlights) headlights.style.opacity = (crossfadeProgress * 0.85).toFixed(3);
          if (routeOverlay) routeOverlay.style.opacity = crossfadeProgress.toFixed(3);
        } else {
          if (finalShot) finalShot.style.opacity = '0';
          if (headlights) headlights.style.opacity = '0';
          if (routeOverlay) routeOverlay.style.opacity = '0';
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

  // Subtle breathing animation for the hero content while scrolling
  tl.fromTo(
    '.hero-main-content',
    { opacity: 0.7, y: 30 },
    { opacity: 1, y: 0, ease: 'power2.out', duration: 3 },
    7
  );

  return tl;
}
