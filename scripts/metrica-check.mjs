// Проверка привязки Яндекс Метрики через API.
// Запуск (после вставки токена в .env):
//   node --env-file=.env scripts/metrica-check.mjs
//
// Ничего не меняет — только читает статистику визитов за 7 дней.

const token = process.env.YANDEX_METRICA_TOKEN;
const counter = process.env.YANDEX_METRICA_COUNTER || '53352265';

if (!token) {
  console.error('YANDEX_METRICA_TOKEN пуст. Выпусти токен по инструкции в .env.example и вставь в .env.');
  process.exit(1);
}

const url = new URL('https://api-metrika.yandex.net/stat/v1/data');
url.searchParams.set('ids', counter);
url.searchParams.set('metrics', 'ym:s:visits,ym:s:users');
url.searchParams.set('date1', '7daysAgo');
url.searchParams.set('date2', 'today');

const res = await fetch(url, { headers: { Authorization: `OAuth ${token}` } });

if (!res.ok) {
  console.error(`Ошибка API: ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}

const data = await res.json();
const [visits, users] = data.totals ?? [0, 0];
console.log(`✅ Метрика привязана. Счётчик ${counter}.`);
console.log(`За 7 дней: визитов ${visits}, посетителей ${users}.`);
