# frezorez.ru — Astro-проект

Запускаемый каркас сайта столярного производства. Собран на Astro 4, стиль — тёмный «Industrial Editorial» по `DESIGN.md`. URL сохранены без завершающего слэша (`build.format:'file'`) ради SEO-капитала старого сайта.

## Запуск

```bash
npm install      # один раз
npm run dev      # http://localhost:4321
npm run build    # сборка в dist/
npm run preview  # предпросмотр сборки
```

## Что уже готово (этот каркас)

- **Конфиг:** `astro.config.mjs` (`build.format:'file'`), `package.json`, `tsconfig.json`, `.gitignore`.
- **`src/layouts/Base.astro`** — head, `<title>`, meta description, **canonical** (нормализован, без `.html`), Open Graph, **Яндекс-верификация** `b330e706b1ce79f4`, **счётчик Метрики** `53352265`. Подключены шрифты Playfair Display + Inter + JetBrains Mono (кириллица).
- **`src/components/Header.astro`, `Footer.astro`** — sticky-навигация с выпадающими меню, подвал с контактами/метро/каналами/доставкой.
- **`src/data/site.js`** — единый источник: контакты, навигация, клиенты, материалы. Меняешь здесь — меняется везде.
- **`src/data/pages.js`** — контент внутренних страниц (ключ = слаг = URL). Все 17 KEEP-страниц заведены с корректными `title`/`description`/`h1`; богатые наполнены текстом из `CONTENT.md`, тонкие помечены `todo: true`.
- **`src/pages/[slug].astro`** — один шаблон рендерит все внутренние страницы из `pages.js`.
- **`src/pages/index.astro`** — главная (скелет): hero, три направления, материалы, клиенты, CTA.
- **`src/styles/global.css`** — дизайн-токены из `DESIGN.md`.
- **`public/`** — `robots.txt`, `favicon.svg`.

Проект **собирается без ошибок** — 18 страниц, canonical чистый, мета и Метрика на месте.

## Что наполняет Claude Code (фаза P0)

Положи рядом с проектом: `CLAUDE.md`, `pagemap.md`, `CONTENT.md`, `DESIGN.md` (и `semantics.md` для будущей фазы `/seo`). Запусти Claude Code из корня и дай задачу по `CLAUDE.md`:

1. Обогатить страницы с `todo: true` (фанера, МДФ, ПВХ, акрил, лазер-CO2, упаковка) из `CONTENT.md` — правило «обогащаем, не режем».
2. Развить главную и внутренние страницы по `DESIGN.md` (визуальные блоки, фото производства).
3. Добавить страницы уровня 0 NEW: `/o-nas`, `/portfolio`, `/kontakty` (просто новые ключи в `pages.js` или отдельные `.astro`).
4. Сгенерировать `sitemap.xml` со всеми URL.

**Сейчас НЕ делаем:** `/lazernaya-rezka-metalla` (нет параметров станка), мебель decorbros (нет данных), блог.

## Статика (портфолио, фото, логотипы)

Локальную копию (~208 МБ) скопируй в `public/`, сохранив пути:
`public/assets/`, `public/images/`, `public/content/partners/`, `public/uploads/`.
После копирования — проверить битые ссылки и сжать тяжёлые фото (тёмная тема требовательна к качеству).

## Деплой

`npm run build` → залить `dist/` на РФ-хостинг (Timeweb/Selectel), настроить отдачу `.html` по чистым URL без расширения, проверить, что все KEEP-URL отдают 200, затем переключить DNS и заново подтвердить Вебмастер.
