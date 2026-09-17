---
name: lenis-gsap-coordination
description: Flawless synchronization between Lenis smooth inertial scrolling and GSAP ScrollTrigger ticker to prevent jitter and pin drift.
version: 1.0.0
---

# Lenis + GSAP ScrollTrigger Coordination Skill

This skill documents how to bind Lenis momentum scrolling with GSAP ScrollTrigger without ticker drift or pin jitter.

---

## The Synchronization Pattern

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // Let mobile touch scroll remain native & responsive
  });

  // 1. Notify ScrollTrigger whenever Lenis updates scroll position
  lenis.on('scroll', ScrollTrigger.update);

  // 2. Drive Lenis updates directly from GSAP Ticker (sec -> ms conversion)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // 3. Disable lag smoothing to prevent visual jumps on sudden heavy frames
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

---

## Critical Rules
1. **Never use double rAF**: Do not call `requestAnimationFrame(raf)` manually for Lenis if GSAP ticker is already driving it. This causes race conditions and micro-stutters.
2. **Handle Pin Jumps**: Always set `anticipatePin: 1` on pinned ScrollTrigger instances.
3. **Resize Re-sync**: Call `ScrollTrigger.refresh()` after layout or image dimensions change.
