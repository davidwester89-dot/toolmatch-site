// Mobiel: elke <table> staat direct in <div class="tbl" ...> (overflow-x:auto in style.css), anders scrollt de hele
// pagina horizontaal op 360/390 px (SC-NIET-OK ad0042f: 'table-wrap' zonder CSS op /zakelijk-e-mailadres-aanmaken/).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const skip = new Set(['node_modules', 'scripts', 'test', 'js', 'fonts', 'logos', '.git']);
function pagina(dir = '.', out = []) {
  for (const n of readdirSync(dir)) {
    if (skip.has(n)) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) pagina(p, out);
    else if (n.endsWith('.html')) out.push(p);
  }
  return out;
}

test('style.css: .tbl heeft overflow-x:auto', () => {
  const css = readFileSync('style.css', 'utf8');
  assert.match(css, /\.tbl\{[^}]*overflow-x:auto/);
});

test('elke tabel staat direct in een .tbl-wrapper (geen horizontale paginascroll op mobiel)', () => {
  let n = 0;
  for (const f of pagina()) {
    const h = readFileSync(f, 'utf8');
    for (const m of h.matchAll(/<table\b/g)) {
      n++;
      const voor = h.slice(0, m.index).replace(/\s+$/, '');
      const open = voor.slice(voor.lastIndexOf('<'));
      assert.match(open, /^<div class="tbl"[^>]*>$/, `${f}: tabel zonder .tbl-wrapper (${open.slice(0, 60)})`);
    }
  }
  assert.ok(n > 0);
});
