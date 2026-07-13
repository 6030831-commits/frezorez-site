// Снимает target-состояние SEO из готовой сборки dist/ и пишет baseline JSON.
// Запуск: node seo/make-baseline.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(SITE, 'dist');

function walk(d) {
  let o = [];
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) o = o.concat(walk(p));
    else if (e.name.endsWith('.html')) o.push(p);
  }
  return o;
}

const baseline = {};
for (const f of walk(DIST)) {
  const html = readFileSync(f, 'utf8');
  const url = f.split('\\').join('/').replace(DIST.split('\\').join('/'), '')
    .replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
  const g = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };
  let schemaTypes = [];
  const sm = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (sm) { try { (JSON.parse(sm[1])['@graph'] || []).forEach(n => schemaTypes.push(n['@type'])); } catch {} }
  baseline[url] = {
    title: g(/<title>([^<]*)<\/title>/i),
    description: g(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i),
    canonical: g(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i),
    robots: g(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) || 'index,follow',
    h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()),
    schemaTypes,
  };
}

const outDir = join(SITE, 'seo');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'baseline-new-build.json');
writeFileSync(out, JSON.stringify(baseline, null, 2));
console.log(`baseline: ${Object.keys(baseline).length} URL → ${out.replace(SITE, '.')}`);
