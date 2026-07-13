# HANDOFF — frezorez.ru (для Hermes и продолжения на VPS)

Слепок состояния на 2026-07-13. Подробные документы — в `docs/`.

## Что это
Astro 4, статическая сборка. `build.format:'file'` → URL без завершающего слэша (сохранение
проиндексированных старых URL = SEO-капитал). Цель проекта: переезд без потери позиций + рост.

## Команды
- `npm install` → `npm run build` (выход в `dist/`) → раздавать `dist/` (nginx).
- `npm run dev` → localhost:4321.

## Что сделано в этой сессии (уже в этом коммите)
- **Изображения сжаты**: 190 фото, sharp, ресайз 1800px + q80. public 174 МБ → ~39 МБ. Имена не менялись.
  Оригиналы НЕ в репо (лежат в `../_backup-originals/` вне git).
- **Schema JSON-LD** на всех 23 страницах (LocalBusiness/WebSite/BreadcrumbList/Service) — в `Base.astro`,
  `[slug].astro` и отдельных страницах.
- **Мета переписаны**: 15 коротких description + 2 длинных title приведены в норму (`src/data/pages.js`,
  страницы шезлонгов/мебели).
- **Битые ссылки** `/skladnaya-mebel`, `/pressvoly` → неактивные «скоро»-плашки.
- **Мусор удалён**: `public/assets/tmp/` (49 МБ) вынесен из репо.

## SEO-инструменты в репозитории
- `seo/make-baseline.mjs` — снять эталон SEO из `dist/` → `seo/baseline-new-build.json`.
- `seo/drift-check.mjs` — ПОСЛЕ переезда: `node seo/drift-check.mjs https://frezorez.ru`.
  Ловит noindex/404/сломанный canonical/пропажу schema/смену title. Без зависимостей.
- `scripts/metrica-check.mjs` — проверка API Метрики: `node --env-file=.env scripts/metrica-check.mjs`.
- `.env.example` — как выпустить OAuth-токен Яндекса (Метрика + Вебмастер).

## Критично при деплое на VPS (детали в docs/seo-agents-plan.md → «Чек-лист дня переезда»)
1. Пере-снять baseline с ФИНАЛЬНОГО билда перед заливкой.
2. nginx: URL без слэша (try_files), Content-Type `text/html` для `/ceny-na-frezerovky/price.xlsx`.
3. 301: `/korzinka` → `/`.
4. Все 23 URL должны отдавать 200 (список — ключи `seo/baseline-new-build.json`).
5. После DNS: `drift-check` (0 CRITICAL), перезалить `sitemap.xml`, переобход в Вебмастере.

## Блокеры на владельце
- OAuth-токен Яндекса (включает агентов Метрики/Вебмастера).
- Отложено: страница лазера по металлу, цена шезлонгов (нужны данные — не выдумывать).

## Аналитика/верификация (уже вшиты)
Метрика 53352265, yandex-verification b330e706b1ce79f4. Токен в HTML НЕ кладём — только в `.env`.
