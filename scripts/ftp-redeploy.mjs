// Заливка сборки на боевой хостинг (AdminVPS shared, nginx).
//
// Зеркалит все верхнеуровневые сущности dist/, КРОМЕ uploads/ — там на сервере
// лежат картинки портфолио с отдельными правами, их трогать нельзя.
//
// Запуск:  node --env-file=.env scripts/ftp-redeploy.mjs
//          node --env-file=.env scripts/ftp-redeploy.mjs --html-only
//
// Флаг --html-only заливает только *.html и каталог _astro/ (стили, 56 КБ).
// Картинки в dist весят больше 100 МБ, и когда правка затрагивает разметку и стили,
// гонять их по FTP заново незачем. _astro включён в этот режим намеренно: при правке
// CSS Astro пересчитывает хеш в имени файла, и страницы начнут ссылаться на стиль,
// которого на сервере нет — сайт приедет без оформления.
// Полная заливка нужна, только когда менялись картинки или файлы из public/.
//
// Доступы берутся из .env (файл в .gitignore) — в коде секретов нет.
//
// ВАЖНО: перед запуском отключить AmneziaVPN. Дефолтный маршрут уходит на
// финский IP, и fail2ban хостинга банит его на порт 21.
import { Client } from 'basic-ftp';
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HOST = process.env.FTP_HOST;
const USER = process.env.FTP_USER;
const PASS = process.env.FTP_PASSWORD;
// FTP без TLS передаёт пароль открытым текстом. По умолчанию требуем FTPS
// (explicit AUTH TLS); FTP_SECURE=false отключает — только осознанно.
const SECURE = process.env.FTP_SECURE !== 'false';

// fileURLToPath, а не .pathname: в пути есть кириллица, .pathname отдал бы её
// percent-кодированной, и readdirSync не нашёл бы каталог.
const LOCAL = fileURLToPath(new URL('../dist', import.meta.url));
const SKIP = new Set(['uploads']);
const HTML_ONLY = process.argv.includes('--html-only');

// Пути всех *.html относительно dist, в POSIX-виде (FTP понимает только прямые слэши).
function collectHtml(dir, prefix = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (!prefix && SKIP.has(name)) continue;
    const full = dir + '/' + name;
    const rel = prefix ? prefix + '/' + name : name;
    if (statSync(full).isDirectory()) out.push(...collectHtml(full, rel));
    else if (name.endsWith('.html')) out.push(rel);
  }
  return out;
}

if (!HOST || !USER || !PASS) {
  console.error('ОШИБКА: в .env нет FTP_HOST / FTP_USER / FTP_PASSWORD.');
  console.error('Запускать так: node --env-file=.env scripts/ftp-redeploy.mjs');
  process.exit(1);
}

const client = new Client(60000);
client.ftp.verbose = false;

async function connect(secure) {
  await client.access({
    host: HOST,
    user: USER,
    password: PASS,
    secure,
    secureOptions: { rejectUnauthorized: false }, // сертификат FTPS у shared-хостинга самоподписанный
  });
}

try {
  try {
    await connect(SECURE);
    if (SECURE) console.log('Подключено по FTPS (AUTH TLS).');
  } catch (e) {
    if (!SECURE) throw e;
    console.warn('FTPS не поднялся (' + e.message + '). Падаю обратно на обычный FTP —');
    console.warn('пароль уйдёт открытым текстом. Проверь поддержку AUTH TLS в ISPmanager.');
    await connect(false);
  }

  console.log('PWD =', await client.pwd());

  if (HTML_ONLY) {
    console.log('Режим --html-only: страницы + _astro/.');
    await client.uploadFromDir(LOCAL + '/_astro', '/_astro');
    await client.cd('/');
    console.log('  -> _astro/');
    for (const rel of collectHtml(LOCAL)) {
      const remoteDir = '/' + rel.split('/').slice(0, -1).join('/');
      if (remoteDir !== '/') await client.ensureDir(remoteDir);
      await client.cd('/');
      await client.uploadFrom(LOCAL + '/' + rel, '/' + rel);
      console.log('  ->', rel);
    }
  } else {
    for (const name of readdirSync(LOCAL)) {
      if (SKIP.has(name)) {
        console.log('  ПРОПУСК:', name);
        continue;
      }
      const full = LOCAL + '/' + name;
      if (statSync(full).isDirectory()) {
        await client.uploadFromDir(full, '/' + name);
        console.log('  dir  ->', name + '/');
      } else {
        await client.uploadFrom(full, '/' + name);
        console.log('  file ->', name);
      }
    }
  }

  console.log('Готово. Корень сайта:');
  for (const item of await client.list('/')) {
    console.log('  ', item.isDirectory ? 'DIR ' : 'file', item.name);
  }
} catch (e) {
  console.error('ОШИБКА:', e.message);
  process.exitCode = 1;
} finally {
  client.close();
}
