import { defineConfig } from 'astro/config';

// Сайт frezorez.ru — статика на Astro.
// ХОСТИНГ: AdminVPS, shared, nginx (Apache/.htaccess недоступны).
// Дефолтный nginx НЕ подставляет .html к чистым URL, но корректно отдаёт
// index.html из каталога и 301-редиректит бесслэшевый вариант на слэш.
// Поэтому build.format:'directory' => /frezerovka-chpy/ (index.html внутри):
// чистые URL работают без доступа к конфигу nginx.
// Старые бесслэшевые адреса сохраняют вес через штатный 301 nginx на слэш.
export default defineConfig({
  site: 'https://frezorez.ru',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
