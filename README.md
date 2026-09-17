# 🍎 Apple-Grade Scroll Hero Experience — Робочий Простір

Цей робочий простір повністю налаштований для створення преміальної інтерактивної **Hero-сторінки** з ефектом скролу в стилі презентацій продуктів **Apple** (MacBook Pro, AirPods Max, Apple Watch Ultra).

---

## 📁 Структура Робочої Папки

```
G:\01_PROJECTS\Web Design\7порт\Scroll Hero_AG\
│
├── 📜 MASTER_PROMPT.md            # Готовий запускаючий промпт для LLM/Код-агента
├── 📜 AGENTS.md                   # Мануал головного оркестратора (Lead Frontend Designer)
├── 📜 README.md                   # Повна документація проекту (цей файл)
│
├── 🎥 Video_scroll.MOV            # Вхідне референс-відео (1920x1080, 60fps, ~5.9s)
├── 🖼️ Final_shot.png              # Кінцеве зображення Hero page (1672x941)
│
├── 🤖 .agents/                    # Специфікації 4-х субагентів (вузькопрофільних спеціалістів)
│   ├── asset-sequence-engineer.md # Субагент 1: FFmpeg, WebP-пайплайн, компресія, маніфест
│   ├── canvas-engine-specialist.md# Субагент 2: HTML5 Canvas 2D, DPR, Cover Math, Lenis + GSAP
│   ├── ui-typography-artisan.md   # Субагент 3: Apple естетика, San Francisco, плаваючі тексти
│   └── qa-perf-auditor.md         # Субагент 4: 60 FPS, CLS=0, відсутність leak, accessibility
│
├── 🧠 skills/                     # Бібліотека перевірених скілів та кодових патернів
│   ├── apple-canvas-scrubber/     # Скіл рендерингу послідовності кадрів на Canvas 2D
│   ├── ffmpeg-sequence-pipeline/  # Скіл високоякісної нарізки відео у WebP
│   └── lenis-gsap-coordination/   # Скіл безшовної синхронізації плавного скролу з тікером
│
├── ⚙️ scripts/                    # Автоматизовані скрипти
│   ├── extract-frames.mjs         # Кросплатформний Node.js скрипт екстракції кадрів + маніфест
│   └── extract-frames.ps1         # Швидкий PowerShell скрипт для Windows
│
├── 🌐 public/                     # Публічні статичні активи для веб-сервера
│   ├── Final_shot.png             # Кінцевий кадр, доступний для Vite
│   └── frames/                    # Згенерована послідовність кадрів
│       ├── frame_0001.webp ...
│       └── manifest.json          # Метадані та конфігурація послідовності
│
├── 💻 src/                        # Вихідний код веб-додатку
│   ├── main.js                    # Точка входу: координація модулів та прелоадера
│   ├── canvasScrubber.js          # Високопродуктивний Canvas рушій (DPR, Cover Math, кешування)
│   ├── smoothScroll.js            # Ініціалізація Lenis + зв'язка з GSAP ticker
│   ├── narrativeTimeline.js       # GSAP ScrollTrigger таймлайн: пінінг, скрол, плаваючий текст
│   └── style.css                  # Apple-дизайн система, скло (glassmorphism), адаптивність
│
├── 📄 index.html                  # Головна розмітка з прелоадером, навбаром та секціями
├── 📦 package.json                # Залежності (gsap, lenis, vite) та npm-команди
└── ⚡ vite.config.js              # Конфігурація швидкого локального dev-сервера
```

---

## 👥 Ролі Субагентів (4 Спеціалісти)

Код-агент у ролі **Lead Frontend Designer & Chief Orchestrator** спирається на 4 віртуальні спеціалісти:

1. **Asset & Sequence Engineer** (`.agents/asset-sequence-engineer.md`):
   - Аналізує `Video_scroll.MOV`.
   - Знижує частоту кадрів з 60 до 30 fps (177 надчітких кадрів замість 354 важких), стискає у WebP (`q=78`) за допомогою алгоритму Lanczos.
   - Генерує `manifest.json` для нульової затримки завантаження.

2. **Canvas & Motion Engineer** (`.agents/canvas-engine-specialist.md`):
   - Реалізує `CanvasScrubber`:
     - Підтримка Retina/DPR (обмеження до 2x для запобігання падіння пам'яті на iPhone).
     - Алгоритм `object-fit: cover` — зображення ідеально заповнює екран за будь-яких пропорцій вікна без спотворень.
     - Алгоритм "найближчого доступного кадру" — повна відсутність білих чи чорних мерехтінь при різкому русі скролу.
     - Плавний скрол через **Lenis**, синхронізований з **GSAP Ticker** (`lagSmoothing: 0`).

3. **UI/UX & Typography Artisan** (`.agents/ui-typography-artisan.md`):
   - Створює напівпрозорий розмитий навбар (`backdrop-filter: blur(20px)`).
   - Організовує появу та зникнення текстових блоків (Narrative Steps) у відповідності до обертання продукту (0-20%, 25-50%, 55-75%, 85-100%).
   - Забезпечує плавний морфінг останнього кадру у `Final_shot.png` з кнопками "Pre-order" та "Watch Keynote".

4. **QA, Performance & A11y Auditor** (`.agents/qa-perf-auditor.md`):
   - Гарантує рендеринг у межах **8 мс на кадр** (чисті 60 FPS).
   - Перевіряє відсутність накопичення сміття у пам'яті (zero-allocation у циклі `requestAnimationFrame`).
   - Перевіряє доступність: підтримка `@media (prefers-reduced-motion: reduce)`.

---

## 🚀 Як Запустити Проект

### Крок 1. Запуск за допомогою Master Prompt
Якщо ви хочете, щоб будь-який агент повністю виконав або доопрацював проект:
1. Відкрийте файл [`MASTER_PROMPT.md`](./MASTER_PROMPT.md).
2. Скопіюйте його текст та вставте в чат агента.

### Крок 2. Ручний запуск розробки (Local Dev)
1. Відкрийте термінал у цій папці:
   ```powershell
   cd "G:\01_PROJECTS\Web Design\7порт\Scroll Hero_AG"
   ```
2. Встановіть залежності (якщо ще не встановлені):
   ```bash
   npm install
   ```
3. Витягніть кадри з відео (якщо потрібно перегенерувати):
   ```bash
   npm run extract
   # або через PowerShell:
   npm run extract:ps1
   ```
4. Запустіть сервер розробки:
   ```bash
   npm run dev
   ```
5. Відкрийте посилання у браузері (за замовчуванням `http://localhost:3000`).

---

## 💡 Ключові Архітектурні Рішення
- **Чому Canvas, а не `<img>`?**  
  Швидка зміна DOM-елементів `<img>` спричиняє перемальовування (Reflow/Repaint) та лаги на мобільних пристроях. Використання єдиного `<canvas>` з перемальовуванням у буфер через `requestAnimationFrame` гарантує залізобетонні 60 FPS.
- **Чому 30 FPS замість 60 FPS для послідовності?**  
  При скролі довжиною в 3-4 секунди людина фізично не бачить різниці між 30 та 60 кадрами в послідовності, проте 177 кадрів важать лише ~8-11 МБ замість 30-50 МБ, що завантажується практично миттєво навіть на 4G.
- **Як працює перехід у `Final_shot.png`?**  
  На позначці 85-100% скролу таймлайн GSAP плавно збільшує прозорість `finalShotBlend` від 0.0 до 1.0, завдяки чому фінальний кадр відео плавно розчиняється у високоякісному статичному зображенні `Final_shot.png`.
