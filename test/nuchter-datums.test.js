import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dateFields, readSitemap } from '../scripts/l7check.mjs';
import { STIJL_PADEN, revisieDatum } from './nuchter-datums-helper.mjs';
test('stijlrelease 18-11: bijgewerkt-/lastmod-/dateModified-datums, uitsluitend op de vastgelegde pagina’s (vloer 18-11; latere inhoudelijke revisie mag hoger)', () => {
  const out = '.';
  const sitemap = readSitemap(out);
  for (const pad of STIJL_PADEN) {
    const file = pad.endsWith('.html') ? out + pad : out + pad + 'index.html';
    const fields = dateFields(readFileSync(file, 'utf8'));
    const d = revisieDatum(pad, '2026-11-18');
    assert.equal(fields.visible, d, pad + ': zichtbaar');
    assert.equal(sitemap.get(pad), d, pad + ': sitemap');
    for (const date of [...fields.ld, ...fields.og]) assert.equal(date, d, pad + ': dateModified');
  }
});
