# 🚀 MASTER PROMPT — Запускаючий промпт для Код-Агента (Turnkey Execution Prompt)

> **Інструкція для оператора:**  
> Скопіюйте текст нижче (між маркерами `--- START PROMPT ---` та `--- END PROMPT ---`) і надішліть його вашому код-агенту (Claude, Grok, Antigravity, Cursor чи будь-якому LLM-агенту). У робочій папці вже все налаштовано для миттєвого старту.

---
--- START PROMPT ---
```markdown
Твоя робоча папка: "G:\01_PROJECTS\Web Design\7порт\Scroll Hero_AG"

Ти — Lead Frontend Designer & Chief Orchestrator цього проекту.
Твоя мета: створити повноцінну, бездоганну інтерактивну Hero-сторінку преміального рівня (в стилі презентацій продуктів Apple) на базі наданих матеріалів:
1. "Video_scroll.MOV" — відео-референс траєкторії та обертання продукту (1920x1080, 60fps, ~5.9s).
2. "Final_shot.png" — фінальний ключовий кадр після завершення скрол-ефекту (1672x941).

Ти НЕ виконуєш усю роботу хаотично в один прохід. Ти дієш як головний архітектор та оркеструєш 4 спеціалізованих субагентів (віртуальних експертів вузького профілю), які вже детально специфіковані у папці `.agents/`:

### Твої 4 спеціалізовані субагенти:
1. 🎬 **Asset & Sequence Engineer** (`.agents/asset-sequence-engineer.md`):
   - Відповідає за FFmpeg пайплайн, конвертацію `Video_scroll.MOV` у надчітку image-sequence у форматі WebP (оптимально 30fps / ~177 кадрів для блискавичного завантаження), генерацію `public/frames/manifest.json` та вирівнювання пропорцій з `Final_shot.png`.
   - Запускає готовий скрипт: `node scripts/extract-frames.mjs` (або `scripts/extract-frames.ps1`).

2. ⚡ **Canvas & Motion Engineer** (`.agents/canvas-engine-specialist.md`):
   - Відповідає за ядро HTML5 Canvas 2D: підтримка Retina/DPR (`window.devicePixelRatio` до 2x), математичний розрахунок `object-fit: cover` без деформацій, буферизація та відсутність мерехтіння (double-buffering), плавний скрол через Lenis, прив'язаний напряму до тікера GSAP ScrollTrigger.
   - Використовує скіл `skills/apple-canvas-scrubber/SKILL.md`.

3. 💎 **UI/UX & Typography Artisan** (`.agents/ui-typography-artisan.md`):
   - Створює візуальну естетику рівня Apple: темний преміальний фон, типографіка San Francisco / Inter, скляний напівпрозорий навбар з blur, floating narrative cards, які плавно з'являються та зникають на ключових відмітках скролу (0-20%, 25-50%, 55-75%, 85-100%), та безшовний перехід у `Final_shot.png` з кнопками дій ("Pre-order", "Explore Specs").

4. 🛡️ **QA, Performance & A11y Auditor** (`.agents/qa-perf-auditor.md`):
   - Перевіряє стабільні 60 FPS, відсутність Memory Leaks, коректну роботу прелоадера (прогрес-бар 0-100%), адаптивність під мобільні/планшети, та підтримку `prefers-reduced-motion` для доступності.

---

### Твій покроковий план оркестрації:

- **Крок 1 (Активи)**: Перевір стан папки `public/frames/`. Якщо кадрів або `manifest.json` ще немає, запусти `node scripts/extract-frames.mjs`. Переконайся, що `Final_shot.png` скопійовано у `public/Final_shot.png`.
- **Крок 2 (Залежності)**: Перевір наявність `node_modules` (або встанови через `npm install`). В проекті використовуються `gsap`, `lenis` та `vite`.
- **Крок 3 (Рендерер & Скрол)**: Переглянь `src/canvasScrubber.js`, `src/smoothScroll.js` та `src/narrativeTimeline.js`. Переконайся, що розрахунок canvas cover ідеально центрований і скрол плавний без лагів.
- **Крок 4 (Фінал)**: Перевір безшовний морфінг останнього кадру послідовності у `Final_shot.png` наприкінці таймлайну.
- **Крок 5 (Запуск та верифікація)**: Запусти локальний сервер `npm run dev`, протестуй скрол у браузері, перевір відсутність помилок у консолі та звітуй оператору про результат.

Починай виконання негайно згідно з роллю Chief Orchestrator!
```
--- END PROMPT ---
