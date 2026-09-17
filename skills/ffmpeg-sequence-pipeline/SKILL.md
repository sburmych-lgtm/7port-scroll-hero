---
name: ffmpeg-sequence-pipeline
description: Recipes and scripts for converting video references (MOV/MP4) into high-efficiency WebP image sequences for web scroll scrubbing.
version: 1.0.0
---

# FFmpeg Image Sequence Pipeline Skill

This skill documents high-efficiency video extraction commands for Apple-style web hero scrubbing.

---

## 1. Golden FFmpeg WebP Command

Extracting directly to WebP using `libwebp` produces 40-60% smaller file sizes compared to standard JPEG while preserving crisp high-frequency edge details.

```bash
ffmpeg -i "Video_scroll.MOV" \
  -vf "fps=30,scale=1920:1080:flags=lanczos" \
  -c:v libwebp \
  -lossless 0 \
  -q:v 78 \
  -compression_level 6 \
  -preset photo \
  "public/frames/frame_%04d.webp"
```

### Parameter Breakdown:
- `-vf "fps=30"`: Halves 60fps video down to 30fps. Since human scrolling occurs over 2-4 seconds, 177 frames produce silky interpolation with zero visual stepping while cutting memory weight in half.
- `-vf scale=1920:1080:flags=lanczos`: Ensures sharp downscaling and eliminates blur.
- `-c:v libwebp -lossless 0`: Lossy WebP encoding (ideal for photo-realistic renders).
- `-q:v 78`: Sweet spot between perceptual perfection and low payload (~40-70KB per frame).
- `-compression_level 6`: Maximum CPU compression effort for the smallest output file size.

---

## 2. Windows PowerShell One-Liner

If running directly in PowerShell:
```powershell
ffmpeg -y -i "Video_scroll.MOV" -vf "fps=30,scale=1920:1080:flags=lanczos" -c:v libwebp -lossless 0 -q:v 78 -compression_level 6 "public\frames\frame_%04d.webp"
```

---

## 3. Extracting Keyframe Metadata

To inspect video length, dimensions, and total frames before extraction:
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration,nb_frames -of json "Video_scroll.MOV"
```

---

## 4. Manifest JSON Structure

Every sequence pipeline should generate a `manifest.json` placed alongside frames in `public/frames/manifest.json`:

```json
{
  "totalFrames": 177,
  "fps": 30,
  "originalDuration": 5.9,
  "sourceWidth": 1920,
  "sourceHeight": 1080,
  "format": "webp",
  "pattern": "frames/frame_{index}.webp",
  "padding": 4,
  "finalShot": {
    "src": "Final_shot.png",
    "width": 1672,
    "height": 941
  }
}
```
