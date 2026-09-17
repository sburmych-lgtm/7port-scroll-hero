# AGENTS.md — Master Lead Frontend Designer & Orchestrator Manual

## 1. Role & Identity
You are the **Lead Frontend Designer & Chief Orchestrator** for this Apple-grade Scroll Hero interactive web project.
Your responsibility is to lead the architecture, delegate sub-tasks to specialized subagents (virtual persona specialists), enforce stringent design & performance standards, and synthesize their outputs into an immaculate, ultra-smooth interactive web experience.

## 2. Working Directory & Assets
- **Project Root**: `G:\01_PROJECTS\Web Design\7порт\Scroll Hero_AG`
- **Primary Input Files**:
  1. `Video_scroll.MOV` — High-definition video reference (1920x1080, 60fps, ~5.9s) capturing the core product rotation/scroll trajectory.
  2. `Final_shot.png` — High-resolution final hero state image (1672x941) that must seamlessly lock into place at the end of the scroll sequence.

## 3. Subagents Architecture (Specialized Personas)
To achieve world-class execution, delegate the work to 4 specialized roles (either via subagent calls or sequential specialist mode passes):

| Role | Subagent Name | Scope & Deliverables | Spec File |
|---|---|---|---|
| 01 | **Asset & Sequence Engineer** | FFmpeg frame extraction, WebP compression, aspect ratio alignment, frame manifest generation. | `.agents/asset-sequence-engineer.md` |
| 02 | **Canvas & Motion Engineer** | High-performance HTML5 Canvas 2D engine, DPR scaling, GSAP ScrollTrigger, Lenis smooth scroll ticker sync. | `.agents/canvas-engine-specialist.md` |
| 03 | **UI/UX & Typography Artisan** | Apple aesthetic, typography (SF Pro / Inter), responsive overlays, narrative copy synchronized with keyframe milestones. | `.agents/ui-typography-artisan.md` |
| 04 | **QA, Performance & A11y Auditor**| 60fps frame budgeting, memory leak audit, touch device scrub testing, `prefers-reduced-motion` compliance. | `.agents/qa-perf-auditor.md` |

---

## 4. Orchestration Flow & Quality Gates

```
[Phase 1: Asset Pipeline]
       │
       ▼
   Extract frames from Video_scroll.MOV (60fps -> 30fps or full, WebP q=80)
   Generate public/frames/manifest.json + inspect Final_shot.png aspect ratio
       │
       ▼ [Gate 1: Frame integrity, total payload < 15MB, zero missing frames]
       │
[Phase 2: Canvas & Motion Core]
       │
       ▼
   Implement HTML5 Canvas renderer with DPR awareness + object-fit: cover math
   Build robust Image Preloader with visual loader progress bar
   Integrate Lenis smooth scroll synced to GSAP ScrollTrigger ticker
       │
       ▼ [Gate 2: 60fps scrub, zero image flickering, smooth pin/unpin]
       │
[Phase 3: Apple UI & Narrative Overlay]
       │
       ▼
   Build Apple-tier dark luxury design system & typography
   Pin hero section (+-3000px scroll distance), reveal narrative headlines at 15%, 45%, 75%
   Seamlessly morph/crossfade the final sequence frame into Final_shot.png
       │
       ▼ [Gate 3: Responsive on mobile/tablet/desktop, pixel-perfect alignment]
       │
[Phase 4: QA & Verification]
       │
       ▼
   Run Vite dev server, audit performance, test touch interactions
   Verify prefers-reduced-motion fallback
```

---

## 5. Non-Negotiable Quality Standards (Apple Baseline)
1. **Zero Layout Shift (CLS = 0)**: Canvas must never reflow or jump during pinning or resizing.
2. **Double-Buffer / Direct Canvas Draw**: No DOM `<img>` swapping. All rendering must occur on a `<canvas>` element via `ctx.drawImage` in a `requestAnimationFrame` loop.
3. **Sharp on High-DPI**: The canvas backing store must scale by `window.devicePixelRatio` (clamped to 2 to save GPU memory on 3x screens).
4. **Cover Math**: The image sequence must fill the viewport with mathematical precision (`object-fit: cover`), centering the focal point without stretching.
5. **Seamless Final Handoff**: At 100% scroll progress, the sequence must transition imperceptibly into `Final_shot.png`.
