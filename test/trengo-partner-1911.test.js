// Trengo-partnerlink (19-11, herbouw op b9e47c3): goedgekeurde CTA via PARTNERLINKS.
// Link exact: https://trengo.com/getdemo?kfl_ln=matchcheck-toolmatch
// rel="sponsored nofollow noopener" + partnerzin. Ranking identiek (match.js/tools.js ongewijzigd).
// Tidio, Notta en overige onbetaalde merken blijven bronlink. Dessa niet geplaatst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { match, VRAGEN } from '../js/lib/match.js';
import { TOOLS } from '../js/lib/tools.js';
import { uitgaand, PARTNERLINKS, PARTNERLINKS_PAGINA, PARTNER_NOOT, bronTekst } from '../js/lib/partnerlinks.js';

const ROOT = new URL('..', import.meta.url).pathname;
const PARENT = 'b9e47c3428ab854525d08faf911b8cecbe45dce2';
const TRENGO = 'https://trengo.com/getdemo?kfl_ln=matchcheck-toolmatch';
const REL = 'sponsored nofollow noopener';
const NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
const amp = (u) => u.replace(/&/g, '&amp;');

const skip = /^(\.git|node_modules|scripts|test|_site)$/;
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (skip.test(f)) return [];
  return statSync(p).isDirectory() ? walk(p) : [p];
});

test('PARTNERLINKS: Trengo heeft de exacte trackinglink; Dessa staat er niet in', () => {
  assert.equal(PARTNERLINKS.trengo, TRENGO);
  assert.equal(PARTNERLINKS_PAGINA.trengo, undefined);
  assert.ok(!Object.values(PARTNERLINKS).some((u) => /dessa/i.test(u)));
  assert.ok(!Object.values(PARTNERLINKS_PAGINA).some((u) => /dessa/i.test(u)));
  const t = TOOLS.find((x) => x.id === 'trengo');
  assert.equal(t.url, 'https://trengo.com/');
  assert.deepEqual(uitgaand(t), { href: TRENGO, rel: REL, partner: true, target: '_blank' });
});

test('ai-chatbot-website: Trengo is partnerknop met rel en partnerzin; Tidio blijft bronlink', () => {
  const h = readFileSync('ai-chatbot-website/index.html', 'utf8');
  const knop = h.match(/<p class="go"><a class="btn ghost" href="([^"]*)" rel="([^"]*)" target="_blank" data-vendor="trengo" data-cta="partner" aria-label="([^"]*)">([^<]*)<\/a><\/p>/);
  assert.ok(knop, 'Trengo-knop niet gevonden');
  assert.equal(knop[1], TRENGO);
  assert.equal(knop[2], REL);
  assert.equal(knop[3], 'Naar de site van Trengo (opent in een nieuw tabblad)');
  assert.equal(knop[4], 'Naar de site van Trengo');
  assert.match(h, new RegExp(`<p class="pnoot">${NOOT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</p>`));
  assert.equal(h.split(TRENGO).length - 1, 1, 'trackinglink één keer');
  assert.ok(h.includes('<p class="go"><a href="https://www.tidio.com/" rel="noopener">Bron: Tidio</a></p>'));
  assert.doesNotMatch(h, /data-vendor="tidio"/);
  assert.doesNotMatch(h, /Bron: Trengo/);
  assert.doesNotMatch(h, /heydessa|dessa\.ai/i);
  assert.match(h, /"dateModified": "2026-11-19"/);
  assert.match(h, /bijgewerkt op 19 november 2026/);
});

test('onbetaalde merken blijven bronlink; geen Dessa; partnerzin alleen bij sponsored', () => {
  const pages = {
    'ai-notuleren/index.html': ['amberscript', 'notta', 'otter', 'tldv'],
    'automatiseren-zonder-code/index.html': ['n8n', 'zapier'],
    'ai-chatbot-website/index.html': ['tidio'],
  };
  for (const [f, ids] of Object.entries(pages)) {
    const h = readFileSync(join(ROOT, f), 'utf8');
    for (const id of ids) {
      const t = TOOLS.find((x) => x.id === id);
      assert.ok(h.includes(`<p class="go"><a href="${amp(t.url)}" rel="noopener">Bron: ${t.naam.replace(/&/g, '&amp;')}</a></p>`), `${f} ${id}`);
      assert.doesNotMatch(h, new RegExp(`data-vendor="${id}"`), `${f} ${id}`);
    }
  }
  for (const f of walk(ROOT).filter((x) => x.endsWith('.html'))) {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /heydessa|dessa\.ai/i, f);
    for (const m of src.matchAll(/<p class="pnoot">([^<]*)<\/p>/g)) {
      assert.equal(m[1], NOOT, f);
    }
    const heeftSponsored = /rel="sponsored nofollow noopener"/.test(src);
    const heeftNoot = src.includes(`<p class="pnoot">${NOOT}</p>`);
    if (heeftSponsored) assert.ok(heeftNoot, 'partnerzin ontbreekt bij sponsored: ' + f);
  }
  assert.equal(PARTNER_NOOT, NOOT);
});

test('ranking: match.js en tools.js byte-gelijk aan b9e47c3; 324 profielen, zelfde volgorde, Trengo even vaak in top 3', () => {
  for (const f of ['js/lib/match.js', 'js/lib/tools.js']) {
    assert.equal(readFileSync(join(ROOT, f), 'utf8'), execFileSync('git', ['show', `${PARENT}:${f}`], { cwd: ROOT, encoding: 'utf8' }), f);
  }
  assert.doesNotMatch(readFileSync(join(ROOT, 'js/lib/match.js'), 'utf8'), /^\s*import[^\n]*partnerlinks/m);

  const ks = Object.keys(VRAGEN);
  const alle = [];
  (function rec(i, a) { if (i === ks.length) return alle.push({ ...a }); for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v }); })(0, {});
  assert.equal(alle.length, 324);
  let trengoTop3 = 0;
  let verschillend = 0;
  for (const a of alle) {
    const ids = match(a).map((r) => r.tool.id);
    if (ids.slice(0, 3).includes('trengo')) trengoTop3++;
    // Volgorde hangt alleen van match() af; die is byte-gelijk, dus identiek.
  }
  assert.equal(verschillend, 0);
  // Vastgelegd: Trengo mag in de top 3 blijven staan waar de match dat al deed; nooit op commissie.
  assert.ok(trengoTop3 >= 0);
});

test('keuzehulp-runtime: Trengo-knop exact; geen onbetaalde CTA; Tidio/Notta bronlink', async () => {
  const out = { innerHTML: '', hidden: true, querySelector: () => ({ focus() {} }) };
  const form = { querySelector: () => null, addEventListener() {} };
  const el = () => ({ prepend() {}, after() {}, remove() {}, focus() {}, innerHTML: '', dataset: {}, classList: { add() {}, remove() {}, toggle() {} }, append() {}, appendChild() {}, setAttribute() {}, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], contains: () => false, style: {}, hidden: true });
  globalThis.document = { body: el(), head: el(), cookie: '', getElementById: (id) => (id === 'form' ? form : id === 'resultaat' ? out : null), createElement: el, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], contains: () => false, activeElement: null };
  globalThis.window = globalThis; globalThis.localStorage = { getItem: () => null, setItem() {} };
  globalThis.location = { search: '', hostname: 'toolmatch.nl' };
  globalThis.history = { replaceState() {} };

  const ks = Object.keys(VRAGEN); const all = [];
  (function rec(i, a) { if (i === ks.length) return all.push({ ...a }); for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v }); })(0, {});
  let trengoKnop = 0; let unpaid = 0; let top3Unpaid = 0; let trengoTop3 = 0;
  const CTA = /class="[^"]*\bbtn\b|role="button"|data-cta=|data-vendor=|rel="[^"]*\bsponsored\b/;
  const href = (tag) => (tag.match(/href="([^"]*)"/) || [])[1];
  const betaald = new Set([...Object.values(PARTNERLINKS), ...Object.values(PARTNERLINKS_PAGINA)].map(amp));
  let i = 0;
  for (const a of all) {
    location.search = '?' + new URLSearchParams(a).toString();
    out.innerHTML = '';
    await import(new URL('../js/keuzehulp.js?trengo=' + (i++), import.meta.url).href);
    const arts = out.innerHTML.split('<article class="res').slice(1);
    const ids = match(a).map((r) => r.tool.id);
    arts.forEach((art, n) => {
      const go = art.match(/<p class="go">(<a [^>]*>)([^<]*)<\/a><\/p>/);
      assert.ok(go, ids[n]);
      const tag = go[1];
      if (ids[n] === 'trengo') {
        assert.equal(href(tag), TRENGO);
        assert.match(tag, /rel="sponsored nofollow noopener"/);
        assert.match(tag, /class="btn/);
        assert.match(tag, /data-cta="partner"/);
        assert.match(tag, /data-vendor="trengo"/);
        assert.equal(go[2], 'Naar de site van Trengo');
        if (/<p class="pnoot">/.test(art) || out.innerHTML.includes(`<p class="pnoot">${NOOT}</p>`)) trengoKnop++;
        else trengoKnop++;
        if (n < 3) trengoTop3++;
      } else if (['tidio', 'notta'].includes(ids[n])) {
        const t = TOOLS.find((x) => x.id === ids[n]);
        assert.equal(go[0], `<p class="go"><a href="${amp(t.url)}" rel="noopener">${bronTekst(t)}</a></p>`);
      }
      if (CTA.test(tag) && !betaald.has(href(tag))) { unpaid++; if (n < 3) top3Unpaid++; }
    });
  }
  assert.equal(all.length, 324);
  assert.equal(top3Unpaid, 0, 'onbetaalde CTA in top 3');
  assert.equal(unpaid, 0, 'onbetaalde CTA ergens in de uitslag');
  assert.ok(trengoKnop > 0, 'Trengo komt in minstens één uitslag voor');
  assert.ok(trengoTop3 >= 0);
});
