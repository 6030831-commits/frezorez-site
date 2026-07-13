// Пост-деплойный контроль SEO-дрейфа. Без внешних зависимостей (Node 18+ fetch).
// Запуск ПОСЛЕ переезда: node seo/drift-check.mjs [https://frezorez.ru]
// Сравнивает живые страницы с target-состоянием seo/baseline-new-build.json.
// Коды: CRITICAL — вероятная потеря трафика (чинить сразу); WARNING — проверить.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ORIGIN = (process.argv[2] || 'https://frezorez.ru').replace(/\/$/, '');
const baseline = JSON.parse(readFileSync(join(HERE, 'baseline-new-build.json'), 'utf8'));

const findings = [];
const add = (sev, url, msg) => findings.push({ sev, url, msg });

for (const [path, base] of Object.entries(baseline)) {
  const url = ORIGIN + (path === '/' ? '/' : path);
  let res, html;
  try {
    res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'frezorez-drift-check' } });
    html = await res.text();
  } catch (e) { add('CRITICAL', path, `не открылась: ${e.message}`); continue; }

  if (res.status !== 200) { add('CRITICAL', path, `HTTP ${res.status} (ожидался 200)`); continue; }

  const g = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };
  const canonical = g(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const robots = g(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) || 'index,follow';
  const title = g(/<title>([^<]*)<\/title>/i);
  const desc = g(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const hasSchema = /application\/ld\+json/.test(html);

  if (/noindex/i.test(robots)) add('CRITICAL', path, `noindex в meta robots!`);
  if (!canonical) add('CRITICAL', path, `нет canonical`);
  else if (base.canonical && canonical !== base.canonical) add('CRITICAL', path, `canonical: ${canonical} (ожидался ${base.canonical})`);
  if (h1.length === 0) add('WARNING', path, `нет H1`);
  if (title !== base.title) add('WARNING', path, `title изменился: "${title}"`);
  if (desc !== base.description) add('WARNING', path, `description изменился`);
  if (base.schemaTypes.length && !hasSchema) add('WARNING', path, `пропала JSON-LD разметка`);
}

const crit = findings.filter(f => f.sev === 'CRITICAL');
const warn = findings.filter(f => f.sev === 'WARNING');
console.log(`\nПроверено URL: ${Object.keys(baseline).length} на ${ORIGIN}`);
console.log(`CRITICAL: ${crit.length}, WARNING: ${warn.length}\n`);
for (const f of [...crit, ...warn]) console.log(`[${f.sev}] ${f.url} — ${f.msg}`);
if (!findings.length) console.log('✅ дрейфа нет — всё совпадает с baseline.');
process.exit(crit.length ? 1 : 0);
