// Генератор public/ceny-na-frezerovky/price.xlsx из src/data/prices.js.
//
// ЗАЧЕМ: по этому URL исторически лежал файл, который nginx отдавал с MIME Excel,
// а внутри был HTML старого сайта — клик из выдачи скачивал «таблицу», которая
// не открывается. URL сидит в индексе Яндекса, редиректы на shared-хостинге нам
// недоступны, поэтому чиним содержимым: кладём настоящий xlsx.
//
// ЗАПУСК: node scripts/make-price-xlsx.mjs   (после любой правки цен в prices.js)
//
// Пишем минимальный OOXML вручную — тянуть зависимость ради пяти XML-файлов
// не стоит. Строки — inline (t="inlineStr"), поэтому sharedStrings.xml не нужен.

import { deflateRawSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tiers, priceTable, terms, engraving } from '../src/data/prices.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/ceny-na-frezerovky/price.xlsx');

// ─── ZIP (deflate) ──────────────────────────────────────────────────────────
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const { name, content } of files) {
    const nameBuf = Buffer.from(name, 'utf8');
    const raw = Buffer.from(content, 'utf8');
    const comp = deflateRawSync(raw, { level: 9 });
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);   // signature
    local.writeUInt16LE(20, 4);           // version needed
    local.writeUInt16LE(0x0800, 6);       // flags: UTF-8 names
    local.writeUInt16LE(8, 8);            // method: deflate
    local.writeUInt16LE(0, 10);           // time
    local.writeUInt16LE(0x2178, 12);      // date (2027-… неважно, но валидна)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, comp);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);         // version made by
    central.writeUInt16LE(20, 6);         // version needed
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0x2178, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(comp.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(0, 38);         // external attrs
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);

    offset += local.length + nameBuf.length + comp.length;
  }

  const centralBuf = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, centralBuf, end]);
}

// ─── Лист ───────────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const colName = (i) => {
  let s = '';
  for (let n = i; n >= 0; n = Math.floor(n / 26) - 1) s = String.fromCharCode(65 + (n % 26)) + s;
  return s;
};

const rows = [];
const push = (cells, style) => rows.push({ cells, style });

push(['FREZOREZ — прайс на ЧПУ-фрезеровку', '', '', '', ''], 'title');
push(['frezorez.ru · +7 925 556-01-66 · zakaz@mail.frezorez.ru']);
push(['Цена — ₽ за погонный метр реза. Материал в стоимость не входит. Без НДС.']);
push([]);

for (const m of priceTable) {
  push([m.material], 'head');
  push(['Толщина, мм', ...tiers.map((t) => t.full)], 'head');
  for (const r of m.rows) push([r.t, ...r.v]);
  push([]);
}

push(['Условия'], 'head');
push(['Минимальный заказ', terms.minOrder]);
push(['Срочно, вне очереди', '+' + terms.urgency + '%']);
push(['Сложный контур', '+' + terms.complexity + '%']);
push(['Доработка макета', 'от ' + terms.artworkFrom + ' ₽']);
push(['3D-фрезеровка', 'от ' + terms.hour3dFrom + ' ₽/час станка']);
push(['Мебельные фасады 3D', 'от ' + terms.facade3dFrom + ' ₽/м² с материалом']);
push([]);
push(['Гравировка оргстекла, ₽/м²'], 'head');
for (const e of engraving) push([e.name, e.to + '–' + e.from]);
push([]);
push(['Цены ориентировочные. Точную сумму называем по чертежу — расчёт бесплатный.']);

const sheetRows = rows
  .map((row, ri) => {
    const cells = row.cells
      .map((v, ci) => {
        if (v === '' || v === undefined || v === null) return '';
        const ref = colName(ci) + (ri + 1);
        const s = row.style === 'head' || row.style === 'title' ? ' s="1"' : '';
        return typeof v === 'number'
          ? `<c r="${ref}"${s}><v>${v}</v></c>`
          : `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
      })
      .join('');
    return `<row r="${ri + 1}">${cells}</row>`;
  })
  .join('');

const files = [
  {
    name: '[Content_Types].xml',
    content:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      '</Types>',
  },
  {
    name: '_rels/.rels',
    content:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      '</Relationships>',
  },
  {
    name: 'xl/workbook.xml',
    content:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheets><sheet name="Прайс" sheetId="1" r:id="rId1"/></sheets></workbook>',
  },
  {
    name: 'xl/_rels/workbook.xml.rels',
    content:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>',
  },
  {
    name: 'xl/styles.xml',
    content:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>' +
      '<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
      '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>' +
      '<borders count="1"><border/></borders>' +
      '<cellStyleXfs count="1"><xf/></cellStyleXfs>' +
      '<cellXfs count="2"><xf xfId="0"/><xf xfId="0" fontId="1" applyFont="1"/></cellXfs>' +
      '</styleSheet>',
  },
  {
    name: 'xl/worksheets/sheet1.xml',
    content:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<cols><col min="1" max="1" width="28" customWidth="1"/>' +
      '<col min="2" max="5" width="16" customWidth="1"/></cols>' +
      `<sheetData>${sheetRows}</sheetData></worksheet>`,
  },
];

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, zip(files));
console.log(`✅ ${OUT}`);
console.log(`   строк ${rows.length}, материалов ${priceTable.length}`);
