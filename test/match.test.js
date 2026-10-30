import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { match, beoordeel, normaliseer, VRAGEN, STANDAARD } from '../js/lib/match.js';
import { TOOLS, DOELEN } from '../js/lib/tools.js';
import { uitgaand, PARTNERLINKS } from '../js/lib/partnerlinks.js';

const alle = () => { const out = []; const ks = Object.keys(VRAGEN);
  (function rec(i, a) { if (i === ks.length) return out.push({ ...a }); for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v }); })(0, {}); return out; };

test('elk doel heeft minstens 3 tools, elke tool hoort bij bekende doelen', () => {
  for (const d of Object.keys(DOELEN)) assert.ok(match({ doel: d }).length >= 3, d);
  for (const t of TOOLS) for (const d of t.doelen) assert.ok(DOELEN[d], t.id + ' ' + d);
});

test('tooldata: unieke ids, https-bronnen, prijs alleen met getal, geldige waarden', () => {
  const ids = new Set();
  for (const t of TOOLS) {
    assert.ok(!ids.has(t.id)); ids.add(t.id);
    assert.match(t.url, /^https:\/\//);
    assert.ok(t.bronnen.length >= 1); for (const [n, u] of t.bronnen) { assert.ok(n); assert.match(u, /^https:\/\//); }
    assert.equal(t.prijs == null, t.prijsMaand == null, t.id);
    assert.ok([null, 'ja', 'deels'].includes(t.eu)); assert.ok(['eenvoudig', 'gemiddeld', 'technisch'].includes(t.instap));
    assert.ok(['gebruiker', 'team'].includes(t.prijsPer)); assert.ok(t.gratis === null || typeof t.gratis === 'boolean', t.id);
    assert.ok(Array.isArray(t.doelen)); assert.ok([undefined, null, 'ja', 'team'].includes(t.dpa), t.id);
  }
});

test('match leest geen partnerlinks en tools.js bevat geen partnerlinks', () => {
  assert.ok(!/import[^;]*partnerlinks/.test(readFileSync(new URL('../js/lib/match.js', import.meta.url), 'utf8')));
  assert.ok(!/sponsored|partnerlink[s]?\s*[:=]/i.test(readFileSync(new URL('../js/lib/tools.js', import.meta.url), 'utf8').replace(/\/\/.*$/gm, '')));
});

test('volgorde verandert niet door partnerlinks: match() met gevulde PARTNERLINKS geeft dezelfde volgorde', () => {
  const before = alle().map((a) => match(a).map((r) => [r.tool.id, r.score].join(':')).join());
  for (const t of TOOLS) PARTNERLINKS[t.id] = 'https://example.org/p/' + t.id;
  try {
    assert.equal(Object.keys(PARTNERLINKS).length, TOOLS.length);
    const after = alle().map((a) => match(a).map((r) => [r.tool.id, r.score].join(':')).join());
    assert.deepEqual(after, before);
    const o = uitgaand(TOOLS[0]); assert.equal(o.rel, 'sponsored nofollow noopener'); assert.equal(o.partner, true);
  } finally { for (const k of Object.keys(PARTNERLINKS)) delete PARTNERLINKS[k]; }
  const g = uitgaand(TOOLS[0]); assert.equal(g.rel, 'noopener'); assert.equal(g.href, TOOLS[0].url); assert.equal(g.partner, false);
});

test('alle antwoordcombinaties geven een stabiele, gesorteerde lijst', () => {
  for (const a of alle()) {
    const r = match(a);
    assert.ok(r.length >= 3);
    for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].score > r[i].score || (r[i - 1].score === r[i].score && r[i - 1].tool.naam.localeCompare(r[i].tool.naam, 'nl') <= 0));
    assert.ok(r.every((x) => x.tool.doelen.includes(a.doel)));
  }
});

test('regels: gratis, EU, techniek en team werken zoals uitgelegd', () => {
  const amber = TOOLS.find((t) => t.id === 'amberscript');
  const tldv = TOOLS.find((t) => t.id === 'tldv');
  const n8n = TOOLS.find((t) => t.id === 'n8n');
  const trengo = TOOLS.find((t) => t.id === 'trengo');
  assert.ok(beoordeel(tldv, { doel: 'notuleren', budget: 'gratis' }).score > beoordeel(amber, { doel: 'notuleren', budget: 'gratis' }).score);
  assert.ok(beoordeel(amber, { doel: 'notuleren', privacy: 'eu' }).score > beoordeel(amber, { doel: 'notuleren', privacy: 'normaal' }).score);
  assert.ok(beoordeel(n8n, { doel: 'automatiseren', techniek: 'beginner' }).score < beoordeel(n8n, { doel: 'automatiseren', techniek: 'technisch' }).score);
  assert.ok(beoordeel(trengo, { doel: 'klantcontact', team: 'alleen' }).score < beoordeel(trengo, { doel: 'klantcontact', team: 'groot', budget: 'ruim' }).score);
  assert.equal(beoordeel(n8n, { doel: 'schrijven' }), null);
});

test('onbekende antwoorden vallen terug op de standaard', () => {
  assert.deepEqual(normaliseer({ doel: 'x', budget: '<script>' }), STANDAARD);
});

test('onbekende gratis versie telt niet als pluspunt en wordt niet als "geen" gemeld', () => {
  const t = TOOLS.find((x) => x.gratis === null && x.doelen.length);
  const r = match({ doel: t.doelen[0], budget: 'gratis', team: 'alleen', privacy: 'normaal', techniek: 'handig' }).find((x) => x.tool.id === t.id);
  assert.ok(r.let_op.includes('Gratis versie niet gecontroleerd'));
  assert.ok(!r.plus.includes('Er is een gratis versie'));
});

test('budgetgetal (prijsMaand) = europrijs op de pagina, of expliciet intern gemarkeerd zonder bedrag in de tekst', () => {
  const nl = (x) => { const [e, c] = x.toFixed(2).split('.'); return c === '00' ? [`€${e}`, `€${e},00`, `${e}€`] : [`€${e},${c}`, `${e},${c}€`]; };
  for (const t of TOOLS) {
    if (t.prijsMaand == null) { assert.equal(t.prijsMaandBron, undefined, t.id); continue; }
    assert.ok(['pagina', 'gratis', 'intern'].includes(t.prijsMaandBron), t.id + ': prijsMaandBron ontbreekt');
    const tekst = t.prijs.replace(/€\s/g, '€');
    if (t.prijsMaandBron === 'pagina') {
      const eerste = tekst.match(/€\d+(?:,\d{2})?|\d+(?:,\d{2})?€/);
      assert.ok(eerste, t.id + ': geen europrijs in de tekst');
      assert.ok(nl(t.prijsMaand).some((v) => eerste[0].startsWith(v) && eerste[0].length === v.length), `${t.id}: prijsMaand ${t.prijsMaand} ≠ eerste europrijs ${eerste[0]}`);
    } else if (t.prijsMaandBron === 'gratis') {
      assert.equal(t.prijsMaand, 0, t.id); assert.match(t.prijs, /gratis/i, t.id);
    } else {
      assert.doesNotMatch(t.prijs, /[€$£]\s?\d|\d\s?[€$£]|\b(USD|EUR)\b/, t.id + ': intern getal maar wel een bedrag in de tekst');
    }
  }
  const src = readFileSync(new URL('../js/lib/tools.js', import.meta.url), 'utf8');
  for (const t of TOOLS.filter((x) => x.prijsMaandBron === 'intern')) {
    const regel = src.split('\n').find((l) => l.includes(`prijsMaandBron: 'intern'`) && l.includes(`prijsMaand: ${t.prijsMaand},`) && src.indexOf(l) > src.indexOf(`id: '${t.id}'`));
    assert.ok(regel && regel.includes('// INTERN budgetgetal'), t.id + ': intern getal zonder commentaar');
  }
});
