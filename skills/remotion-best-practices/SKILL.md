---
name: remotion-best-practices
description: >
  Best practices and design patterns for building programmatic video in Remotion.
  Covers frame math, deterministic animation, interpolation curves, spring physics,
  sequencing vs layering, audio synchronization, typography, assets management
  (OffthreadVideo, staticFile, preloading), performance optimization, memory leak avoidance,
  and cross-fade/transition patterns.
---

# Remotion Best Practices

High-performance, deterministic programmatic video design with Remotion.

## 1. Core Principles of Programmatic Video

### A. Frame-Based Determinism
- **Never** use `setTimeout`, `setInterval`, `Date.now()`, or CSS `@keyframes` that rely on wall-clock time.
- All visual state must be a pure, deterministic function of `frame` (`useCurrentFrame()`) and `fps` (`useVideoConfig()`).
- The same `frame` must always render the exact same visual output.

### B. Canvas Layout & Aspect Ratios
- Wrap composition root components with `<AbsoluteFill>`.
- Use fixed coordinate systems defined by composition dimensions (`width`, `height` from `useVideoConfig()`).
- Common Standards:
  - **Vertical Reel / TikTok / Shorts:** `1080×1920` (9:16), 30 or 60 fps.
  - **Landscape / YouTube / Desktop:** `1920×1080` (16:9), 30 or 60 fps.
  - **Square / Feed:** `1080×1080` (1:1), 30 fps.

---

## 2. Animation & Interpolation

### A. Linear & Easing Interpolation
Use `interpolate()` from `remotion`:

```tsx
import { interpolate, useCurrentFrame, Easing } from 'remotion';

const frame = useCurrentFrame();

// Fade-in over 15 frames with smooth easing
const opacity = interpolate(frame, [0, 15], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: Easing.bezier(0.16, 1, 0.3, 1), // ease-out-expo
});

// Translation animation
const translateY = interpolate(frame, [10, 30], [50, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: Easing.out(Easing.cubic),
});
```

### B. Spring Physics
Use `spring()` from `remotion` for natural bounce, elastic entrances, and organic motion:

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame: frame - 10, // delay entrance by 10 frames
  fps,
  config: {
    damping: 12,
    mass: 0.8,
    stiffness: 100,
  },
});
```

---

## 3. Sequencing & Layering

### A. `<Sequence>` vs `<Series>`
- Use `<Sequence from={startFrame} durationInFrames={duration}>` when overlapping layers or precisely pinning events along a global timeline.
- Use `<Series>` for contiguous, back-to-back scene cuts without manually computing frame offsets:

```tsx
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={90}>
    <IntroScene />
  </Series.Sequence>
  <Series.Sequence durationInFrames={180}>
    <MainScene />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <OutroScene />
  </Series.Sequence>
</Series>
```

### B. Cross-Dissolves & Scene Transitions
To cross-fade two scenes cleanly:
- Overlap the outgoing sequence and incoming sequence by the transition duration (e.g. 12 frames / 0.4s).
- Fade out the outgoing layer (`interpolate(frame, [end - 12, end], [1, 0])`) while fading in the incoming layer (`interpolate(frame, [0, 12], [0, 1])`).
- Alternatively, use `@remotion/transitions` (`<TransitionSeries>`).

---

## 4. Media Asset Handling

### A. Video Decoding & OffthreadVideo
- **Prefer `<OffthreadVideo>`** over standard `<Video>` for rendering multi-threaded headless video without frame stutter or dropped frames.
- Reference assets placed in `public/` using `staticFile('asset-name.mp4')`.
- Ensure video files are **H.264 MP4 with YUV420p pixel format**. (Transcode HEVC/ProRes/AV1 assets with `ffmpeg -i input.mov -c:v libx264 -pix_fmt yuv420p output.mp4` first).

```tsx
import { OffthreadVideo, staticFile } from 'remotion';

<OffthreadVideo
  src={staticFile('clips/salon-space.mp4')}
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
```

### B. Static Images & SVGs
- Use `<Img src={staticFile('logo.png')} />` instead of standard `<img>` to guarantee Remotion delays frame capture until images are completely decoded.

### C. Audio Synchronization & Fades
- Place `<Audio src={staticFile('music.mp3')} volume={(f) => interpolate(f, [0, 15, 300, 330], [0, 1, 1, 0])} />` inside sequences to automatically sync start/stop points with video cuts.

---

## 5. Typography & Multi-Language Rendering

- Set explicit `fontFamily` fallbacks (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).
- For custom web fonts, load them via `@remotion/google-fonts` or CSS `@font-face` with `continueRender(delayRender())`.
- For Cyrillic or special characters (e.g., `і`, `ї`, `є`, `—`), ensure source code files are saved strictly in **UTF-8 without BOM**.
- Add subtle text-shadows or dark backdrops (`rgba(0, 0, 0, 0.7)`) to ensure legibility across bright video footage.
