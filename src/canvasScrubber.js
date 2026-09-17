/**
 * Canvas Image Sequence Scrubber Engine
 * High-performance 60fps frame renderer with DPR scaling, object-fit cover math, and double-buffered caching.
 */

export class CanvasScrubber {
  constructor({ canvas, manifest, onProgress, onCriticalReady }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false }); // alpha: false speeds up GPU blitting
    this.manifest = manifest;
    this.totalFrames = manifest.totalFrames;
    this.images = new Array(this.totalFrames);
    this.finalShotImg = null;
    this.currentIndex = 0;
    this.finalShotBlend = 0; // 0 = sequence frame, 1 = Final_shot.png
    this.onProgress = onProgress;
    this.onCriticalReady = onCriticalReady;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isRendering = false;

    this.initCanvasSize();
    window.addEventListener('resize', () => this.handleResize());
  }

  initCanvasSize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = window.innerWidth;
    const displayH = window.innerHeight;

    this.canvas.width = Math.floor(displayW * this.dpr);
    this.canvas.height = Math.floor(displayH * this.dpr);
    this.canvas.style.width = `${displayW}px`;
    this.canvas.style.height = `${displayH}px`;
  }

  handleResize() {
    this.initCanvasSize();
    this.render();
  }

  /**
   * Preloads image sequence with critical batch prioritization
   */
  async preload() {
    // 1. Preload Final_shot.png
    if (this.manifest.finalShot && this.manifest.finalShot.src) {
      this.finalShotImg = new Image();
      this.finalShotImg.src = this.manifest.finalShot.src;
    }

    let loadedCount = 0;
    const criticalThreshold = Math.min(15, this.totalFrames);
    let criticalTriggered = false;

    const framePromises = [];

    for (let i = 0; i < this.totalFrames; i++) {
      const frameNum = String(i + 1).padStart(this.manifest.padding || 4, '0');
      const url = `frames/frame_${frameNum}.${this.manifest.format || 'webp'}`;

      const p = new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          this.images[i] = img;
          loadedCount++;
          
          if (this.onProgress) {
            this.onProgress((loadedCount / this.totalFrames) * 100);
          }

          if (!criticalTriggered && loadedCount >= criticalThreshold) {
            criticalTriggered = true;
            if (this.onCriticalReady) this.onCriticalReady();
            this.render();
          }

          resolve();
        };

        img.onerror = () => {
          console.warn(`[CanvasScrubber] Frame load error: ${url}`);
          loadedCount++;
          resolve();
        };
      });

      framePromises.push(p);
    }

    await Promise.all(framePromises);
    this.render();
  }

  /**
   * Updates frame index and triggers render
   */
  setFrame(index, finalBlend = 0) {
    const clamped = Math.max(0, Math.min(this.totalFrames - 1, Math.floor(index)));
    this.currentIndex = clamped;
    this.finalShotBlend = finalBlend;
    this.requestRender();
  }

  requestRender() {
    if (!this.isRendering) {
      this.isRendering = true;
      requestAnimationFrame(() => {
        this.render();
        this.isRendering = false;
      });
    }
  }

  /**
   * Renders the current frame using object-fit: cover math
   */
  render() {
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    if (canvasW === 0 || canvasH === 0) return;

    let targetImg = this.getImageAt(this.currentIndex);
    if (!targetImg) return;

    // Draw primary sequence image
    this.drawCover(targetImg, 1.0);

    // If finalShot is blending in (at the end of scroll)
    if (this.finalShotBlend > 0 && this.finalShotImg && this.finalShotImg.complete) {
      this.drawCover(this.finalShotImg, this.finalShotBlend);
    }
  }

  drawCover(img, alpha = 1.0) {
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    const canvasRatio = canvasW / canvasH;
    const imgRatio = imgW / imgH;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = canvasW;
      renderH = canvasW / imgRatio;
      offsetX = 0;
      offsetY = (canvasH - renderH) / 2;
    } else {
      renderW = canvasH * imgRatio;
      renderH = canvasH;
      offsetX = (canvasW - renderW) / 2;
      offsetY = 0;
    }

    if (alpha < 1.0) {
      this.ctx.globalAlpha = alpha;
    } else {
      this.ctx.globalAlpha = 1.0;
      this.ctx.clearRect(0, 0, canvasW, canvasH);
    }

    this.ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    this.ctx.globalAlpha = 1.0;
  }

  /**
   * Resilient frame lookup: If exact index isn't ready, searches backwards/forwards for nearest loaded frame
   */
  getImageAt(index) {
    if (this.images[index] && this.images[index].complete) {
      return this.images[index];
    }
    // Search backward
    for (let i = index - 1; i >= 0; i--) {
      if (this.images[i] && this.images[i].complete) return this.images[i];
    }
    // Search forward
    for (let i = index + 1; i < this.totalFrames; i++) {
      if (this.images[i] && this.images[i].complete) return this.images[i];
    }
    return null;
  }
}
