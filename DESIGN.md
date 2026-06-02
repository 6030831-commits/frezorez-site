# DESIGN.md

> Дизайн-система для лендинга AI-автоматизации с B2B/производственным позиционированием. Кладётся в корень проекта рядом с `CLAUDE.md`. Claude Code читает этот файл и использует ТОЛЬКО эти токены при генерации UI.

---

## 1. Vision

**Концепция:** Industrial Editorial. Тёмная база как у инженерного ПО (Linear, Vercel, Together AI), но с тёплым акцентом — отсылка к металлу, лазеру, сварочной дуге. Геометрическая sans-serif типографика Unbounded отделяет проект от типовых «neon-tech» AI-лендингов и говорит на языке зрелого B2B.

**Кому говорим:** руководители производств, директора по операциям, владельцы малого/среднего B2B. Не айтишники-новаторы, а практики, которым нужна понятная автоматизация.

**Tone of voice в UI-текстах:** уверенно, без хайпа, с конкретикой. «Сократили время обработки заявок с 4 часов до 12 минут» вместо «революционный AI меняет правила».

**Чего избегаем:**
- Фиолетово-розовых градиентов и «AI glow».
- Анимированных частиц, мерцающих звёзд, нейросетевых визуализаций фоном.
- Generic stock-картинок «человек смотрит на голограмму».
- 3D-сцен Three.js на главной.

---

## 2. Color Palette

### Base (нейтральные)

```
--bg-primary:       #0A0A0B    /* почти чёрный, тёплая нота */
--bg-secondary:     #131316    /* поверхность карточек */
--bg-tertiary:      #1C1C20    /* hover, активные состояния */
--bg-elevated:      #232328    /* модалки, поповеры */

--border-subtle:    #2A2A2F    /* разделители, рамки карточек */
--border-default:   #38383F    /* инпуты, видимые границы */
--border-strong:    #52525B    /* фокус, активные рамки */
```

### Text

```
--text-primary:     #FAFAFA    /* заголовки, основной текст */
--text-secondary:   #A1A1AA    /* подзаголовки, body */
--text-tertiary:    #71717A    /* подписи, meta */
--text-disabled:    #52525B    /* неактивные элементы */
```

### Accent (молотый металл / лазер)

```
--accent-primary:   #F97316    /* основной акцент — calls to action */
--accent-hover:     #EA580C    /* hover */
--accent-pressed:   #C2410C    /* pressed/active */
--accent-subtle:    #1F1410    /* фон бейджей, подсветки */
--accent-border:    #7C2D12    /* рамки акцентных блоков */
```

### Semantic

```
--success:          #10B981    /* выполнено, метрики роста */
--warning:          #F59E0B    /* предупреждения */
--error:            #EF4444    /* ошибки, отрицательная динамика */
--info:             #60A5FA    /* информационные блоки */
```

### Правила использования

- Акцентный оранжевый — **только** на одной-двух точках на экране: главный CTA, ключевая метрика, активный элемент навигации.
- Никаких градиентов между brand-цветами. Допустим один градиент: `--bg-primary → --bg-secondary` для секций.
- Цветной текст (не белый/серый) — исключение, а не правило. Если оранжевый текст — то заголовок одной hero-секции, не больше.

---

## 3. Typography

### Шрифты

```
--font-display:  'Unbounded', sans-serif;
--font-sans:     'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:     'JetBrains Mono', 'Fira Code', monospace;
```

Подключение через Google Fonts. Веса: Unbounded 700/800, Manrope 400/500/600/700, JetBrains 400/500.

### Scale

```
--text-xs:    12px / 16px  / 0      /* подписи, лейблы */
--text-sm:    14px / 20px  / 0      /* body small, мета */
--text-base:  16px / 24px  / 0      /* основной текст */
--text-lg:    18px / 28px  / 0      /* увеличенный body */
--text-xl:    20px / 28px  / -0.01em /* H4 */
--text-2xl:   24px / 32px  / -0.01em /* H3 */
--text-3xl:   32px / 40px  / -0.02em /* H2 */
--text-4xl:   48px / 56px  / -0.02em /* H1 секционный */
--text-5xl:   64px / 72px  / -0.03em /* Hero на десктопе */
--text-6xl:   80px / 88px  / -0.03em /* Mega-hero (опционально) */
```

Формат: `size / line-height / letter-spacing`.

### Применение

| Контекст | Шрифт | Размер | Вес |
|---|---|---|---|
| Hero H1 | Unbounded | 5xl–6xl | 800 |
| Section H2 | Unbounded | 4xl | 800 |
| Card H3 | Manrope | 2xl | 600 |
| Subheading H4 | Manrope | xl | 500 |
| Body | Manrope | base | 400 |
| Lead paragraph | Manrope | lg | 400 |
| Meta / labels | Manrope | xs uppercase | 500, letter-spacing 0.08em |
| Code / тех. данные | JetBrains Mono | sm | 400 |

### Правила

- Display-шрифт (Unbounded) — **только** для H1 и H2. На кнопках, в навигации, в body — никогда.
- Длина строки в body: 60–75 символов. Не растягивать на всю ширину экрана.
- Кириллица в Unbounded: подключён диапазон cyrillic через Google Fonts.

---

## 4. Spacing & Layout

### Grid

8-pixel base. Все отступы кратны 4px, основные — кратны 8px.

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px
--space-32:  128px
```

### Container

```
--container-sm:  640px
--container-md:  768px
--container-lg:  1024px
--container-xl:  1200px   /* максимум контента */
--container-2xl: 1440px   /* фоновые секции */

--container-padding-mobile:  16px
--container-padding-tablet:  32px
--container-padding-desktop: 48px
```

### Radii

```
--radius-sm:   4px    /* инпуты, мелкие бейджи */
--radius-md:   8px    /* кнопки */
--radius-lg:   12px   /* карточки */
--radius-xl:   16px   /* большие карточки, модалки */
--radius-2xl:  24px   /* hero-блоки */
--radius-full: 9999px /* пилюли, аватары */
```

### Section spacing

- Между секциями на десктопе: `--space-24` (96px) или `--space-32` (128px) для воздушных лендингов.
- На мобильном: `--space-16` (64px).
- Внутри секции, между заголовком и контентом: `--space-12` (48px).

---

## 5. Components

### Buttons

**Primary** (главный CTA, один-два на экран)
```
background:    var(--accent-primary)
color:         #FFFFFF
padding:       12px 24px
border-radius: var(--radius-md)
font:          Manrope 500, 14px
hover:         background: var(--accent-hover)
active:        background: var(--accent-pressed)
focus:         outline 2px var(--accent-primary), offset 2px
```

**Secondary**
```
background:    transparent
color:         var(--text-primary)
border:        1px solid var(--border-default)
padding:       12px 24px
hover:         border-color: var(--border-strong); background: var(--bg-tertiary)
```

**Ghost** (для tertiary действий)
```
background:    transparent
color:         var(--text-secondary)
padding:       8px 16px
hover:         color: var(--text-primary); background: var(--bg-tertiary)
```

Размеры: sm (32px высота), md (40px, дефолт), lg (48px, для hero).

### Cards

```
background:    var(--bg-secondary)
border:        1px solid var(--border-subtle)
border-radius: var(--radius-lg)
padding:       24px (mobile) / 32px (desktop)
```

**Hover state** (если карточка кликабельна):
```
border-color:  var(--border-default)
background:    var(--bg-tertiary)
transition:    border-color 200ms, background 200ms
```

**Featured card** (один акцентный кейс):
```
border-color:  var(--accent-border)
background:    linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-subtle) 100%)
```

### Inputs

```
background:    var(--bg-secondary)
border:        1px solid var(--border-default)
border-radius: var(--radius-sm)
padding:       10px 14px
color:         var(--text-primary)
font:          Manrope 400, 14px

placeholder:   color: var(--text-tertiary)
focus:         border-color: var(--accent-primary)
               box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15)
error:         border-color: var(--error)
```

### Badges / Pills

```
padding:       4px 10px
border-radius: var(--radius-full)
font:          Manrope 500, 12px
letter-spacing: 0.02em

/* Варианты */
default:       background var(--bg-tertiary), color var(--text-secondary)
accent:        background var(--accent-subtle), color var(--accent-primary)
success:       background rgba(16, 185, 129, 0.1), color var(--success)
```

### Navigation

**Top nav (sticky):**
```
height:        64px
background:    rgba(10, 10, 11, 0.8)
backdrop-filter: blur(16px)
border-bottom: 1px solid var(--border-subtle)
```

Логотип слева (Unbounded или wordmark), ссылки по центру или справа, CTA-кнопка справа.

### Code Block (для демо-примеров API/конфигов)

```
background:    #050506
border:        1px solid var(--border-subtle)
border-radius: var(--radius-md)
padding:       16px 20px
font:          JetBrains Mono, 14px
color:         var(--text-secondary)

/* Подсветка синтаксиса */
keyword:       #F97316
string:        #10B981
comment:       #52525B
number:        #60A5FA
```

### Metric / Stat block (для кейсов)

Большая цифра — Unbounded, 4xl-5xl, цвет `--accent-primary`. Подпись под цифрой — Manrope, sm, `--text-tertiary`, uppercase, letter-spacing 0.08em.

```
72%        — Unbounded, 5xl, accent
СОКРАЩЕНИЕ ВРЕМЕНИ ОБРАБОТКИ ЗАЯВОК — Manrope, xs, uppercase
```

---

## 6. Shadows & Effects

Тёмная тема почти не требует теней. Используем границы и фон для разделения слоёв. Тени — только для модалок и поповеров.

```
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.4)
--shadow-md:   0 4px 12px rgba(0, 0, 0, 0.5)
--shadow-lg:   0 12px 32px rgba(0, 0, 0, 0.6)
--shadow-xl:   0 24px 64px rgba(0, 0, 0, 0.7)

/* Свечение акцента — для одного hero-элемента, не больше */
--glow-accent: 0 0 80px rgba(249, 115, 22, 0.15)
```

**Backdrop blur** для модалок и sticky-нав: `backdrop-filter: blur(16px)` поверх полупрозрачного фона.

---

## 7. Iconography & Imagery

### Иконки

`lucide-react` — единственная библиотека иконок. Размеры: 16px (inline), 20px (default), 24px (стандарт в карточках). Stroke 1.5–2px. Цвет наследуется от текста.

Запрещено: смешивать lucide с другими наборами (Heroicons, Material Icons и т.д.).

### Изображения

- Фотографии: только реальные кадры производства, оборудования, кода, скриншоты систем. Никаких stock-картинок.
- Если фото нет — используем **технические иллюстрации**: схемы потоков данных, архитектурные диаграммы (Mermaid), wireframes интерфейсов автоматизации.
- Все изображения — с радиусом `--radius-lg`, на фоне `--bg-secondary` с padding 24px для воздуха.

### Логотипы клиентов (если будут на лендинге)

Монохром, цвет `--text-tertiary`. На hover — `--text-secondary`. Никаких цветных логотипов в общей сетке.

---

## 8. Motion & Animation

**Принцип:** анимация — это сигнал, а не декорация. Если движение не несёт информации (фокус, переход состояния, появление) — его быть не должно.

### Длительности

```
--duration-fast:    150ms   /* hover, focus */
--duration-base:    200ms   /* большинство переходов */
--duration-slow:    300ms   /* появление модалок */
--duration-slower:  500ms   /* появление секций при скролле */
```

### Easing

```
--ease-default:  cubic-bezier(0.4, 0, 0.2, 1)
--ease-out:      cubic-bezier(0, 0, 0.2, 1)
--ease-in-out:   cubic-bezier(0.4, 0, 0.6, 1)
```

### Допустимые анимации

- Hover-переходы цвета/фона (`--duration-fast`).
- Fade + slide-up на 8px для появления карточек при скролле (`--duration-slower`, intersection observer).
- Cursor blink в hero-блоке для эффекта «терминала» (опционально, один элемент).

### Запрещено

- Бесконечные циклические анимации (вращающиеся круги, плывущие частицы).
- Parallax-скролл.
- Анимированные SVG-фоны.

---

## 9. Agent Prompt Guide

> Этот раздел читает Claude Code при генерации UI. Здесь — правила, как трактовать токены выше.

### Когда собираешь компонент или страницу:

1. **Цвета — только из палитры в разделе 2.** Хардкод hex-значений запрещён. Используй CSS-переменные через Tailwind (`bg-[var(--bg-primary)]`) или маппинг в `tailwind.config.ts`.

2. **Шрифты — только три из раздела 3.** Unbounded — для H1/H2, Manrope — для всего остального, JetBrains Mono — для кода и тех. данных.

3. **Иерархия акцента:** на одном экране — **один** оранжевый CTA. Если на странице два равноценных действия — оба secondary, акцентный оставляем на самое важное.

4. **Карточки кейсов:** структура — короткий заголовок (Manrope 600), метрика крупно (Unbounded 4xl, accent), 2–3 строки описания (Manrope base, secondary), тонкая мета внизу (Manrope xs uppercase, tertiary).

5. **Hero-блок лендинга:**
   - H1 — Unbounded 5xl–6xl, max 8 слов, белый. Допустимо одно слово/фраза акцентным цветом.
   - Подзаголовок — Manrope lg, secondary, max 25 слов.
   - Один primary CTA + один ghost link рядом.
   - Опционально: monospaced бейдж сверху над H1 (типа «AI-автоматизация для производства»).

6. **Секции лендинга — последовательность:**
   - Hero
   - Логотипы клиентов (если есть) или социальное доказательство
   - Услуги / решения (3–6 карточек)
   - 1–2 разобранных кейса с метриками
   - Процесс работы (нумерованные шаги)
   - FAQ
   - Контактная форма / CTA

7. **Адаптив:** mobile-first. Все размеры в разделе 3 — для десктопа. На мобильном hero H1 — 4xl, остальные заголовки на ступень меньше.

8. **shadcn/ui:** перед сборкой нового компонента — проверь, нет ли его в `components/ui/`. Если есть — кастомизируй через Tailwind-классы, не переписывай.

9. **Что НЕ делать:**
   - Не добавляй градиенты, кроме описанных в разделе 2 и 5.
   - Не используй emoji в UI (можно в тех. иллюстрациях/демках).
   - Не вставляй декоративные SVG-фоны.
   - Не добавляй glassmorphism (полупрозрачные карточки с blur) — только для sticky-нав и модалок.

10. **Кириллица:** все примеры текста — на русском, грамотно. Не вставляй lorem ipsum.

---

## Краткая справка для копирования в tailwind.config.ts

```ts
// extend.colors
bg: {
  primary: '#0A0A0B',
  secondary: '#131316',
  tertiary: '#1C1C20',
  elevated: '#232328',
},
border: {
  subtle: '#2A2A2F',
  DEFAULT: '#38383F',
  strong: '#52525B',
},
text: {
  primary: '#FAFAFA',
  secondary: '#A1A1AA',
  tertiary: '#71717A',
  disabled: '#52525B',
},
accent: {
  DEFAULT: '#F97316',
  hover: '#EA580C',
  pressed: '#C2410C',
  subtle: '#1F1410',
  border: '#7C2D12',
},
```
