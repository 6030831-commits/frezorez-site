// Трекинг позиций: снимает срез из Яндекс.Вебмастера и дописывает в историю.
// Только чтение API + локальная запись. Запускается по расписанию (Task Scheduler).
// Запуск вручную: node --env-file=.env scripts/track-positions.mjs
import { appendFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const HIST = join(SITE, 'seo', 'positions-history.jsonl');

const token = process.env.YANDEX_WEBMASTER_TOKEN;
const userId = process.env.YANDEX_WEBMASTER_USER_ID;
const hostId = process.env.YANDEX_WEBMASTER_HOST_ID;
if (!token || !userId || !hostId) { console.error('Нет токена/ID в .env'); process.exit(1); }

const base = `https://api.webmaster.yandex.net/v4/user/${userId}/hosts/${encodeURIComponent(hostId)}`;
const res = await fetch(`${base}/query-analytics/list`, {
  method: 'POST',
  headers: { Authorization: `OAuth ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ offset: 0, limit: 500, device_type_indicator: 'ALL', text_indicator: 'QUERY', region_ids: [], filters: {} }),
});
if (!res.ok) { console.error(`API ${res.status}: ${await res.text()}`); process.exit(1); }
const data = await res.json();

const today = new Date().toISOString().slice(0, 10);
const rows = (data.text_indicator_to_statistics || []).map((item) => {
  let imp = 0, clk = 0, pw = 0, ww = 0;
  const byDate = {};
  for (const s of item.statistics || []) {
    if (s.field === 'IMPRESSIONS') imp += s.value || 0;
    else if (s.field === 'CLICKS') clk += s.value || 0;
    byDate[s.date] = byDate[s.date] || {};
    byDate[s.date][s.field] = s.value;
  }
  for (const d of Object.values(byDate)) if (d.POSITION != null && d.IMPRESSIONS) { pw += d.POSITION * d.IMPRESSIONS; ww += d.IMPRESSIONS; }
  return {
    q: item.text_indicator?.value,
    url: item.popular_complementary_indicator?.value || '',
    imp, clk,
    pos: ww ? +(pw / ww).toFixed(1) : null,
  };
}).filter((r) => r.imp >= 2 && r.pos != null);

// одна запись = один снимок за день (компактно)
appendFileSync(HIST, JSON.stringify({ date: today, count: rows.length, rows }) + '\n', 'utf8');

// краткое сравнение с прошлым снимком по ключевым запросам
const WATCH = ['3d фрезеровка', 'фрезеровка 3d', 'фрезеровка чпу', 'фрезеровка на чпу на заказ',
  'фрезеровка дерева', 'фрезеровка фанеры', 'фрезеровка на заказ', 'фрезеровка москва',
  'фрезеровка пвх', 'фрезеровка акрила', 'фрезорез'];

let prev = null;
if (existsSync(HIST)) {
  const lines = readFileSync(HIST, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  // сравниваем с последним снимком ДРУГОЙ даты (день-к-дню, а не сегодня-к-сегодня)
  for (let i = lines.length - 2; i >= 0; i--) { if (lines[i].date !== today) { prev = lines[i]; break; } }
}
const prevMap = {};
if (prev) for (const r of prev.rows) prevMap[r.q] = r.pos;
const nowMap = {};
for (const r of rows) nowMap[r.q] = r;

console.log(`Снимок ${today}: ${rows.length} запросов с показами → ${HIST.replace(SITE, '.')}`);
console.log('\nКлючевые запросы (поз сегодня ← прошлый снимок):');
for (const q of WATCH) {
  const r = nowMap[q];
  if (!r) { console.log(`  ${q}: нет показов`); continue; }
  const was = prevMap[q];
  const delta = was != null ? (was - r.pos > 0 ? `↑${(was - r.pos).toFixed(1)}` : was - r.pos < 0 ? `↓${(r.pos - was).toFixed(1)}` : '=') : 'нов';
  console.log(`  ${q}: поз ${r.pos} (${delta})  показы ${r.imp}  клики ${r.clk}  ${r.url}`);
}
