// Печатает человекочитаемый прайс из src/data/prices.js в текстовый файл.
// Нужен владельцу для сверки цен с себестоимостью: сам prices.js — код,
// читать его неудобно, а расходиться две версии не должны.
// Запуск: node scripts/print-prices.mjs   (перезапускать после каждой правки цен)
import { writeFileSync } from 'node:fs';
import { tiers, priceTable, terms, engraving } from '../src/data/prices.js';

const OUT = 'C:/Users/60308/Desktop/Сайт FREZOREZ/files/ПРАЙС-сверка.txt';
const L = [];
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

L.push('ПРАЙС FREZOREZ — что сейчас стоит на сайте');
L.push('');
L.push('Цена в рублях за ПОГОННЫЙ МЕТР РЕЗА. Материал в цену не входит.');
L.push('Четыре колонки — ступени объёма: чем больше метраж в заказе, тем дешевле метр.');
L.push('');
L.push('ВАЖНО: это цифры конкурента «ФРЕЗЕРОВКА.МОСКВА», а не твои. Их нужно сверить.');
L.push('Диктуй правки в чат: «фанера 6-10 — сорок» или «ПВХ весь дороже на 20%».');
L.push('');
L.push('='.repeat(60));

for (const m of priceTable) {
  L.push('');
  L.push(m.material.toUpperCase());
  L.push('');
  L.push('  ' + pad('Толщина', 12) + tiers.map((t) => padL(t.short, 10)).join(''));
  L.push('  ' + '-'.repeat(12 + 10 * tiers.length));
  for (const r of m.rows) {
    L.push('  ' + pad(r.t + ' мм', 12) + r.v.map((v) => padL(v + ' ₽', 10)).join(''));
  }
}

L.push('');
L.push('='.repeat(60));
L.push('');
L.push('УСЛОВИЯ');
L.push('');
L.push('  ' + pad('Минимальный заказ', 26) + terms.minOrder.toLocaleString('ru-RU') + ' ₽ без НДС');
L.push('  ' + pad('Срочно, вне очереди', 26) + '+' + terms.urgency + '% к работе');
L.push('  ' + pad('Сложный контур', 26) + '+' + terms.complexity + '%');
L.push('  ' + pad('Доработка макета', 26) + 'от ' + terms.artworkFrom.toLocaleString('ru-RU') + ' ₽');
L.push('  ' + pad('3D-фрезеровка', 26) + 'от ' + terms.hour3dFrom.toLocaleString('ru-RU') + ' ₽ за час станка');
L.push('  ' + pad('Мебельные фасады 3D', 26) + 'от ' + terms.facade3dFrom.toLocaleString('ru-RU') + ' ₽/м² с материалом');
L.push('');
L.push('ГРАВИРОВКА ОРГСТЕКЛА (считается за м², не за метр)');
L.push('');
for (const e of engraving) {
  L.push('  ' + pad(e.name, 26) + e.to.toLocaleString('ru-RU') + '–' + e.from.toLocaleString('ru-RU') + ' ₽/м²');
}
L.push('');

writeFileSync(OUT, L.join('\r\n'), 'utf8');
console.log('✅ ' + OUT);
