# 🚢 7PORT.UA — Awwwards-Tier 3D Scroll Experience & Redesign

Робочий простір для повноцінного редизайну **[7port.ua](https://7port.ua/)** до світового рівня **Awwwards / FWA**.

---

## 🔗 Офіційні Посилання Проекту

- **🌐 Публічний деплой (Vercel):** [https://7port-scroll-hero.vercel.app](https://7port-scroll-hero.vercel.app)
- **🐙 Репозиторій проекту (GitHub):** [https://github.com/sburmych-lgtm/7port-scroll-hero](https://github.com/sburmych-lgtm/7port-scroll-hero)
- **📄 Файл з адресою деплою в репозиторії:** [`URL Deploy`](./URL%20Deploy)

---

## 📁 Структура Робочої Папки

```
G:\01_PROJECTS\Web Design\7порт\Scroll Hero_AG\
│
├── 🚀 MASTER_PROMPT.md            # Запускаючий промпт для передачі код-агенту
├── 📋 AGENTS.md                   # Мануал головного оркестратора (Lead Frontend Designer)
├── 📖 README.md                   # Повна документація проекту (цей файл)
├── 🔗 URL Deploy                  # Зафіксовані адреси деплою та репозиторію
│
├── 🎥 Video_scroll.MOV            # Вхідне 3D відео-референс (вантажівка в портовому терміналі)
├── 🖼️ Final_shot.png              # Еталонний кадр Hero-сторінки (1672x941)
├── 📊 7PORT_MASTER_UI_UX_AUDIT... # Повний експертний UX/CRO/A11y аудит сайту 7port.ua
│
├── 🧠 skills/                     # Спеціалізовані скіли, підключені для агента:
│   ├── remotion-3d/               # 3D анімація та рендеринг у Remotion
│   ├── remotion-create/           # Побудова відео-композицій та пайплайнів
│   ├── remotion-best-practices/   # Оптимізація таймінгів, пам'яті та рендеру
│   ├── threejs/                   # Робота з WebGL / Three.js сценами
│   ├── impeccable/                # Преміальна естетика, мікродеталі та візуальний баланс
│   ├── ui-ux-pro-max/             # Глибоке проектування UX, конверсійні шляхи, дизайн-системи
│   ├── apple-canvas-scrubber/     # HTML5 Canvas 2D frame-scrubbing з DPR scaling
│   └── lenis-gsap-coordination/   # Синхронізація плавного скролу Lenis з тікером GSAP
│
├── 🤖 .agents/                    # Специфікації субагентів для оркестратора
│   ├── asset-sequence-engineer.md # Генерація та рендер надчітких keyframes
│   ├── canvas-engine-specialist.md# Canvas рушій, фізика та світіння фар
│   ├── ui-typography-artisan.md   # Awwwards UI/UX верстка та маршрут Київ-Сінгапур
│   └── qa-perf-auditor.md         # SEO, Core Web Vitals, мобільна адаптивність, Vercel/GitHub
│
├── 💻 src/                        # Вихідний код фронтенду (HTML5 Canvas, GSAP, Lenis)
├── 📄 index.html                  # Повна семантична розмітка з ТОП SEO (JSON-LD, OpenGraph)
└── 📦 package.json                # Залежності та скрипти збірки
```

---

## 🎯 Ключові Вимоги до Реалізації

1. **Самостійний високоякісний рендер кадрів агентом**:
   - Агент використовує підключені скіли `/remotion-3d`, `/remotion-create`, `/remotion-best-practices` та `/threejs`, щоб самостійно підготувати та відрендерити кришталево чіткі кадри з `Video_scroll.MOV` без артефактів стиснення.
2. **Безшовне перетікання в Hero Page**:
   - Останній кадр скролу плавно перетікає в `Final_shot.png`.
3. **Обов'язкові мікроанімації**:
   - Реалістичне світіння фар вантажівки (Headlights glow) на мокрому асфальті терміналу.
   - Неоновий анімований маршрут **Київ (50.4501° N, 30.5234° E) → Сінгапур (1.3521° N, 103.8198° E)** з пульсуючими точками локацій.
4. **Врахування аудиту `7PORT_MASTER_UI_UX_AUDIT_WDI_V2.md`**:
   - Єдина форма прорахунку (Audit F-03) замість розрізнених форм.
   - Два ключові напрямки: Митне оформлення та Міжнародні перевезення.
   - Реальні кейси перевезень (Audit P-03) та команда (Audit P-02).
   - Топове технічне SEO (Schema.org `LogisticsService`, OpenGraph).
   - Повна адаптивність під десктоп та мобільні пристрої.
