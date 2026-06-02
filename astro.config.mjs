import { defineConfig } from 'astro/config';

// Сайт frezorez.ru — статика на Astro.
// build.format: 'file' => /frezerovka-chpy.html, URL без завершающего слэша,
// чтобы сохранить старые проиндексированные адреса (SEO-капитал).
export default defineConfig({
  site: 'https://frezorez.ru',
  build: {
    format: 'file',
  },
});
