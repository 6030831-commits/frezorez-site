// Аналитика поисковых запросов из Яндекс.Вебмастера (v4 query-analytics).
// Только чтение. По каждому запросу: показы, клики, CTR, средневзвеш. позиция, страница.
// Запуск: node --env-file=.env scripts/query-analytics.mjs

const token = process.env.YANDEX_WEBMASTER_TOKEN;
const userId = process.env.YANDEX_WEBMASTER_USER_ID;
const hostId = process.env.YANDEX_WEBMASTER_HOST_ID;

if (!token || !userId || !hostId) {
  console.error('Нет YANDEX_WEBMASTER_TOKEN / USER_ID / HOST_ID в .env');
  process.exit(1);
}

const base = `https://api.webmaster.yandex.net/v4/user/${userId}/hosts/${encodeURIComponent(hostId)}`;

const res = await fetch(`${base}/query-analytics/list`, {
  method: 'POST',
  headers: { Authorization: `OAuth ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    offset: 0,
    limit: 500,
    device_type_indicator: 'ALL',
    text_indicator: 'QUERY',
    region_ids: [],
    filters: {},
  }),
});
if (!res.ok) {
  console.error(`query-analytics ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();

const rows = (data.text_indicator_to_statistics || []).map((item) => {
  let impressions = 0, clicks = 0, posWeighted = 0, posWeight = 0, demandMax = 0;
  for (const s of item.statistics || []) {
    if (s.field === 'IMPRESSIONS') impressions += s.value || 0;
    else if (s.field === 'CLICKS') clicks += s.value || 0;
    else if (s.field === 'DEMAND') demandMax = Math.max(demandMax, s.value || 0);
  }
  // средневзвешенная позиция по показам того же дня
  const byDate = {};
  for (const s of item.statistics || []) {
    byDate[s.date] = byDate[s.date] || {};
    byDate[s.date][s.field] = s.value;
  }
  for (const d of Object.values(byDate)) {
    if (d.POSITION != null && d.IMPRESSIONS) { posWeighted += d.POSITION * d.IMPRESSIONS; posWeight += d.IMPRESSIONS; }
  }
  const pos = posWeight ? +(posWeighted / posWeight).toFixed(1) : 0;
  return {
    query: item.text_indicator?.value,
    url: item.popular_complementary_indicator?.value || '',
    impressions,
    clicks,
    ctr: impressions ? +(100 * clicks / impressions).toFixed(1) : 0,
    pos,
    demand: demandMax,
  };
});

// Топ по показам
rows.sort((a, b) => b.impressions - a.impressions);
console.log('\n=== Топ запросов по показам (30 дней) ===');
console.log('пок\tкл\tCTR%\tпоз\tспрос\tстраница\tзапрос');
for (const r of rows.filter((r) => r.impressions > 0).slice(0, 40)) {
  console.log(`${r.impressions}\t${r.clicks}\t${r.ctr}\t${r.pos}\t${r.demand}\t${r.url}\t${r.query}`);
}

// Быстрые победы: позиция 5–15, показы есть, кликов мало (близко к топу)
const wins = rows
  .filter((r) => r.impressions >= 2 && r.pos >= 4 && r.pos <= 15 && r.clicks === 0)
  .sort((a, b) => a.pos - b.pos);
console.log('\n=== Быстрые победы (поз 4–15, есть показы, 0 кликов) ===');
console.log('пок\tпоз\tспрос\tстраница\tзапрос');
for (const r of wins.slice(0, 25)) {
  console.log(`${r.impressions}\t${r.pos}\t${r.demand}\t${r.url}\t${r.query}`);
}

console.log(`\nВсего запросов: ${data.count}. С показами: ${rows.filter((r) => r.impressions > 0).length}.`);
