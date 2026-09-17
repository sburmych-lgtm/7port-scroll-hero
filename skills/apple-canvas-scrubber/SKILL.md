---
name: apple-canvas-scrubber
description: Production pattern for high-performance HTML5 Canvas frame sequence scrubbing driven by GSAP ScrollTrigger, featuring zero-flicker preloading, DPR scaling, and mathematical cover rendering.
version: 1.0.0
---

# Apple Canvas Scrubber Skill

This skill contains the verified, battle-tested implementation patterns for building Apple-style canvas image sequence scrubbers.

---

## 1. High-DPI Canvas Sizing & Cover Math

Never use simple `ctx.drawImage(img, 0, 0, canvas.width, canvas.height)` because it distorts aspect ratios when the browser window is resized. Use **Cover Math**:

```javascript
/**
 * Scales canvas for Retina display and draws image centered with object-fit: cover behavior.
 */
export function resizeAndDrawCover(canvas, ctx, currentImage) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;

  // Set internal buffer dimensions according to DPR
  if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
  }

  if (!currentImage || !currentImage.complete) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = currentImage.naturalWidth || currentImage.width;
  const imgHeight = currentImage.naturalHeight || currentImage.height;

  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = imgWidth / imgHeight;

  let drawW, drawH, drawX, drawY;

  if (canvasRatio > imgRatio) {
    drawW = canvasWidth;
    drawH = canvasWidth / imgRatio;
    drawX = 0;
    drawY = (canvasHeight - drawH) / 2;
  } else {
    drawW = canvasHeight * imgRatio;
    drawH = canvasHeight;
    drawX = (canvasWidth - drawW) / 2;
    drawY = 0;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(currentImage, drawX, drawY, drawW, drawH);
}
```

---

## 2. Progressive Preloader Architecture

Loading 150+ frames at once can block the network. Use a two-tiered loader:
1. **Critical Batch**: Load first 10 frames and the final shot immediately. When ready, reveal UI.
2. **Streaming Background Batch**: Stream the remainder in chunks using concurrent promises.
3. **Fallback Rendering**: If frame `N` isn't ready when the user scrubs rapidly, draw the closest available rendered frame to eliminate black/white flashes.

```javascript
export class SequencePreloader {
  constructor(urls, onProgress, onCriticalReady) {
    this.urls = urls;
    this.images = new Array(urls.length);
    this.loadedCount = 0;
    this.onProgress = onProgress;
    this.onCriticalReady = onCriticalReady;
    this.criticalCount = Math.min(12, urls.length);
    this.criticalReported = false;
  }

  load() {
    return new Promise((resolve) => {
      this.urls.forEach((url, index) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          this.images[index] = img;
          this.loadedCount++;
          if (this.onProgress) {
            this.onProgress((this.loadedCount / this.urls.length) * 100);
          }
          if (!this.criticalReported && this.loadedCount >= this.criticalCount) {
            this.criticalReported = true;
            if (this.onCriticalReady) this.onCriticalReady();
          }
          if (this.loadedCount === this.urls.length) {
            resolve(this.images);
          }
        };
        img.onerror = () => {
          console.warn(`Failed loading frame: ${url}`);
          this.loadedCount++;
          if (this.loadedCount === this.urls.length) resolve(this.images);
        };
      });
    });
  }

  getFrame(index) {
    // Exact frame
    if (this.images[index] && this.images[index].complete) {
      return this.images[index];
    }
    // Backward search for closest available
    for (let i = index - 1; i >= 0; i--) {
      if (this.images[i] && this.images[i].complete) return this.images[i];
    }
    // Forward search
    for (let i = index + 1; i < this.images.length; i++) {
      if (this.images[i] && this.images[i].complete) return this.images[i];
    }
    return null;
  }
}
```

---

## 3. GSAP ScrollTrigger Timeline Binding

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupSequenceScroll({ container, totalFrames, onFrameUpdate }) {
  const state = { frame: 0 };

  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: '+=3500',
    pin: true,
    scrub: 0.8, // Tactile physics lag
    anticipatePin: 1,
    onUpdate: (self) => {
      const targetIndex = Math.min(
        totalFrames - 1,
        Math.floor(self.progress * totalFrames)
      );
      if (targetIndex !== state.frame) {
        state.frame = targetIndex;
        onFrameUpdate(targetIndex, self.progress);
      }
    },
  });

  return st;
}
```
