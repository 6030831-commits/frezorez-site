// Отправляет изменённые URL на переобход в Яндекс.Вебмастер (v4 recrawl).
// Учитывает суточную квоту. Запуск: node --env-file=.env scripts/recrawl.mjs
const token = process.env.YANDEX_WEBMASTER_TOKEN;
const userId = process.env.YANDEX_WEBMASTER_USER_ID;
const hostId = process.env.YANDEX_WEBMASTER_HOST_ID;
const base = `https://api.webmaster.yandex.net/v4/user/${userId}/hosts/${encodeURIComponent(hostId)}`;

// Приоритет: сначала самые ценные (спрос/показы), потом остальные.
const urls = [
  '/', '/3d-frezerovka/', '/frezerovka-chpy/', '/frezerovka-dereva/',
  '/frezerovka-fanery/', '/frezerovka-pvh/', '/frezerovka-acryl/', '/lazernaja-rezka/',
  '/frezerovka-mdf/', '/frezerovka-kompozita/', '/mebel-iz-fanery/',
  '/balansiry-nejrotrenazhery/', '/izgotovlenie-produkcii-iz-horeca/',
  '/derevyannaya-posuda-dlya-barov-restoranov/', '/korobochki-penaly-iz-dereva/',
  '/trebovaniya-k-maketam/', '/dostavka/', '/ypakovka/',
].map((p) => 'https://www.frezorez.ru' + p);

const q = await fetch(`${base}/recrawl/quota`, { headers: { Authorization: `OAuth ${token}` } });
const quota = await q.json();
const remain = quota?.daily_quota != null ? quota.daily_quota - (quota.quota_remainder != null ? 0 : 0) : null;
console.log('Квота переобхода:', JSON.stringify(quota));
const left = quota.quota_remainder ?? quota.daily_quota ?? 0;
console.log(`Доступно сегодня: ${left}`);

let sent = 0;
for (const url of urls) {
  if (sent >= left) { console.log(`Квота исчерпана — остановился на ${sent}. Остальное отправлю завтра.`); break; }
  const r = await fetch(`${base}/recrawl/queue`, {
    method: 'POST',
    headers: { Authorization: `OAuth ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const body = await r.json().catch(() => ({}));
  if (r.ok) { sent++; console.log(`  ✅ ${url}  task_id=${body.task_id ?? '?'}`); }
  else console.log(`  ❌ ${url}  ${r.status} ${JSON.stringify(body)}`);
}
console.log(`\nОтправлено на переобход: ${sent} из ${urls.length}.`);
