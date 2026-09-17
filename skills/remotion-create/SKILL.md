---
name: remotion-create
description: >
  Guide and workflows for scaffolding, creating, and architecting Remotion projects and compositions from scratch.
  Use when initializing a new Remotion project, defining composition schemas with Zod, configuring tailwind/webpack/vite,
  structuring root components, creating dynamic video templates, and organizing assets.
---

# Remotion Project & Composition Creation

How to scaffold, architect, and configure new Remotion video projects.

## 1. Quick Project Initialization

### A. Minimal Project Setup
To add Remotion to an existing workspace or set up a clean lightweight project:

```bash
npm install remotion @remotion/cli react react-dom @types/react @types/react-dom typescript
```

### B. Standard Directory Architecture

```text
my-video-project/
├── public/                 # Video clips, audio tracks, fonts, images
│   ├── assets/
│   └── audio/
├── src/
│   ├── components/         # Reusable video components (LowerThirds, Titles, Overlays)
│   ├── compositions/       # Specific video compositions
│   │   ├── BrandReel.tsx
│   │   └── StoryAd.tsx
│   ├── Root.tsx            # Composition registry (<Composition />, <Still />)
│   └── index.ts            # Entrypoint calling registerRoot(Root)
├── package.json
├── remotion.config.ts      # Webpack, Chromium, and rendering configuration
└── tsconfig.json
```

---

## 2. Configuration Files

### A. `remotion.config.ts`
Configure concurrency, browser behavior, and Webpack overrides:

```ts
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle'); // or 'egl' / 'swiftshader'
```

### B. `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

---

## 3. Registering Compositions

### A. `src/index.ts`
```ts
import { registerRoot } from 'remotion';
import { Root } from './Root';

registerRoot(Root);
```

### B. `src/Root.tsx` with Zod Schema Validation
```tsx
import React from 'react';
import { Composition, Still } from 'remotion';
import { z } from 'zod';
import { BrandReel, BrandReelSchema } from './compositions/BrandReel';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandReelVertical"
        component={BrandReel}
        durationInFrames={450} // 15.0s
        fps={30}
        width={1080}
        height={1920}
        schema={BrandReelSchema}
        defaultProps={{
          titleText: 'ТАМ, ДЕ ТИ — ГОЛОВНИЙ ПРІОРИТЕТ',
          textColor: '#DFBA73',
          audioVolume: 0.8,
        }}
      />
    </>
  );
};
```

---

## 4. Previewing & Development

- **Interactive Studio:** Run `npx remotion preview` or add `"start": "remotion preview"` to `package.json`.
- The Remotion Studio provides real-time timeline scrubbing, audio preview, component tree inspection, and props tweaking via the UI.
