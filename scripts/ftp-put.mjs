// Точечная доливка отдельных файлов из dist/ на боевой хостинг.
//
// ЗАЧЕМ: ftp-redeploy.mjs умеет два режима — всё (117 МБ, из них 107 МБ картинки)
// и --html-only (страницы + _astro/). Когда правка задела пару файлов из public/
// (sitemap.xml, price.xlsx, robots.txt), гонять полную заливку незачем, а
// --html-only их не возьмёт: они не *.html и не в _astro/.
//
// ЗАПУСК: node --env-file=.env scripts/ftp-put.mjs sitemap.xml ceny-na-frezerovky/price.xlsx
// Пути — относительно dist/, через прямые слэши.
//
// ВАЖНО: как и у ftp-redeploy — перед запуском отключить AmneziaVPN,
// иначе выход через финский IP и fail2ban хостинга банит порт 21.

import { Client } from 'basic-ftp';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HOST = process.env.FTP_HOST;
const USER = process.env.FTP_USER;
const PASS = process.env.FTP_PASSWORD;
const SECURE = process.env.FTP_SECURE !== 'false';

// fileURLToPath, а не .pathname: в пути есть кириллица.
const LOCAL = fileURLToPath(new URL('../dist', import.meta.url));

const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));

if (!HOST || !USER || !PASS) {
  console.error('ОШИБКА: в .env нет FTP_HOST / FTP_USER / FTP_PASSWORD.');
  process.exit(1);
}
if (!files.length) {
  console.error('Укажите файлы относительно dist/, например:');
  console.error('  node --env-file=.env scripts/ftp-put.mjs sitemap.xml ceny-na-frezerovky/price.xlsx');
  process.exit(1);
}

for (const rel of files) {
  const full = LOCAL + '/' + rel;
  if (!existsSync(full)) {
    console.error(`ОШИБКА: нет файла dist/${rel} — сначала npm run build.`);
    process.exit(1);
  }
}

const client = new Client(60000);
client.ftp.verbose = false;

try {
  await client.access({ host: HOST, user: USER, password: PASS, secure: SECURE, secureOptions: { rejectUnauthorized: false } });
  console.log(`Подключено к ${HOST}${SECURE ? ' (FTPS)' : ' (открытый FTP!)'}.`);

  // Пути абсолютные от корня FTP — он же корень сайта (как в ftp-redeploy.mjs).
  for (const rel of files) {
    const full = LOCAL + '/' + rel;
    const remoteDir = '/' + rel.split('/').slice(0, -1).join('/');
    if (remoteDir !== '/') await client.ensureDir(remoteDir);
    await client.cd('/');
    await client.uploadFrom(full, '/' + rel);
    console.log(`  ↑ ${rel} (${statSync(full).size} Б)`);
  }

  console.log(`Готово: ${files.length} файл(ов).`);
} catch (err) {
  console.error('СБОЙ:', err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
