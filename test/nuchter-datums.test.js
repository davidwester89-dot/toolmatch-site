import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dateFields, readSitemap } from '../scripts/l7check.mjs';
import { STIJL_PADEN, revisieDatum, LEADINFO_PADEN } from './nuchter-datums-helper.mjs';
test('stijlrelease 18-11: bijgewerkt-/lastmod-/dateModified-datums, uitsluitend op de vastgelegde pagina’s (vloer 18-11; latere inhoudelijke revisie mag hoger)', () => {
  const out = '.';
  const sitemap = readSitemap(out);
  for (const pad of STIJL_PADEN) {
    const file = pad.endsWith('.html') ? out + pad : out + pad + 'index.html';
    const fields = dateFields(readFileSync(file, 'utf8'));
    const envIso = process.env.BUILD_DATE || process.env.PUSH_DATE;
    const verwacht = LEADINFO_PADEN.has(pad)
      ? [revisieDatum(pad, '2026-11-18'), envIso].filter(Boolean).sort().at(-1)
      : revisieDatum(pad, '2026-11-18');
    assert.equal(fields.visible, verwacht, pad + ': zichtbaar');
    assert.equal(sitemap.get(pad), verwacht, pad + ': sitemap');
    for (const date of [...fields.ld, ...fields.og]) assert.equal(date, verwacht, pad + ': dateModified');
  }
});
