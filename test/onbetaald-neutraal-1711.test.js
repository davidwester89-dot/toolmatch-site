// Onbetaalde CTA's neutraal (17-11): alleen een goedgekeurde partnerlink (PARTNERLINKS / PARTNERLINKS_PAGINA) mag een knop,
// data-cta, data-vendor, target of rel=sponsored hebben. Alle andere merken krijgen een neutrale bronlink
// <a href="…" rel="noopener">Bron: Merk</a> (de 16 merken van 12-11/16-11 houden 'Merk'). Statisch én in de keuzehulp-runtime.
// Deze test faalt zodra er weer een onbetaalde CTA verschijnt, in welke positie dan ook (dus ook in de top 3).
// Ranking: match.js en tools.js byte-gelijk aan f4dccde. Partnermanager-status: rekentools/partners (12-11-2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { VRAGEN, match } from '../js/lib/match.js';
import { TOOLS } from '../js/lib/tools.js';
import { PARTNERLINKS, PARTNERLINKS_PAGINA, uitgaand, bronTekst, NEUTRAAL_NAAM } from '../js/lib/partnerlinks.js';

const ROOT = new URL('..', import.meta.url).pathname;
const PARENT = 'f4dccde60af44c5cc703e9a618ce4c1f6437ea2c';
const amp = (u) => u.replace(/&/g, '&amp;');
const BETAALD = new Set([...Object.values(PARTNERLINKS), ...Object.values(PARTNERLINKS_PAGINA)].map(amp));
const CTA = /class="[^"]*\bbtn\b|role="button"|data-cta=|data-vendor=|data-pos=|rel="[^"]*\bsponsored\b|[?&](utm_|ref=)/i;
const href = (tag) => (tag.match(/href="([^"]*)"/) || [])[1];
const NEUTRAAL_1711 = ['amberscript', 'fireflies', 'n8n', 'notta', 'otter', 'pitch', 'tidio', 'tldv', 'trengo', 'zapier', 'hubspot', 'pipedrive', 'zoho', 'buffer', 'hootsuite'];

/** Fouten: elke CTA-achtige <a> in html waarvan de href geen goedgekeurde partnerlink is. */
export function onbetaaldeCtas(html) {
  const fout = [];
  for (const m of html.matchAll(/<a\b[^>]*>/g)) {
    const tag = m[0]; const h = href(tag) || '';
    if (/^(\/|#|mailto:)/.test(h)) continue;
    if (CTA.test(tag) && !BETAALD.has(h)) fout.push(tag);
  }
  return fout;
}

const skip = /^(\.git|node_modules|scripts|test|_site)$/;
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (skip.test(f)) return []; return statSync(p).isDirectory() ? walk(p) : [p]; });

// De echte js/keuzehulp.js renderen voor elk profiel (minimale DOM-stub, geen browser nodig).
async function renderAlle() {
  const out = { innerHTML: '', hidden: true, querySelector: () => ({ focus() {} }) };
  const form = { querySelector: () => null, addEventListener() {} };
  const el = () => ({ prepend() {}, after() {}, remove() {}, focus() {}, innerHTML: '', dataset: {}, classList: { add() {}, remove() {}, toggle() {} }, append() {}, appendChild() {}, setAttribute() {}, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], contains: () => false, style: {}, hidden: true });
  globalThis.document = { body: el(), head: el(), cookie: '', getElementById: (id) => (id === 'form' ? form : id === 'resultaat' ? out : null), createElement: el, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], contains: () => false, activeElement: null };
  globalThis.window = globalThis; globalThis.localStorage = { getItem: () => null, setItem() {} };
  globalThis.location = { search: '', hostname: 'toolmatch.nl' };
  globalThis.history = { replaceState() {} };
  const ks = Object.keys(VRAGEN); const all = [];
  (function rec(i, a) { if (i === ks.length) return all.push({ ...a }); for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v }); })(0, {});
  const res = []; let i = 0;
  for (const a of all) {
    location.search = '?' + new URLSearchParams(a).toString();
    out.innerHTML = '';
    await import(new URL('../js/keuzehulp.js?p=' + (i++), import.meta.url).href);
    res.push({ a, html: out.innerHTML, ids: match(a).map((r) => r.tool.id) });
  }
  return res;
}

test('runtime keuzehulp: 324 profielen, 0 onbetaalde CTA in de top 3 (en in elke positie); onbetaald = Bron-link', async () => {
  const res = await renderAlle();
  assert.equal(res.length, 324);
  let top3 = 0; let alle = 0; let bron = 0; let knop = 0;
  for (const { a, html, ids } of res) {
    const arts = html.split('<article class="res').slice(1);
    assert.equal(arts.length, ids.length, JSON.stringify(a));
    arts.forEach((art, n) => {
      const t = TOOLS.find((x) => x.id === ids[n]);
      const go = art.match(/<p class="go">(<a [^>]*>)([^<]*)<\/a><\/p>/);
      assert.ok(go, ids[n]);
      const fout = onbetaaldeCtas(go[1]);
      if (fout.length) { alle++; if (n < 3) top3++; }
      if (PARTNERLINKS[t.id]) { knop++; assert.match(go[1], /class="btn/); assert.equal(href(go[1]), amp(PARTNERLINKS[t.id])); }
      else { bron++; assert.equal(go[0], `<p class="go"><a href="${amp(t.url)}" rel="noopener">${bronTekst(t).replace(/&/g, '&amp;')}</a></p>`, t.id); }
    });
  }
  assert.equal(top3, 0, 'onbetaalde CTA in top 3');
  assert.equal(alle, 0, 'onbetaalde CTA ergens in de uitslag');
  assert.ok(bron > 0 && knop > 0);
});

test('statisch: elke knop/data-cta/data-vendor/sponsored-link op de site is een goedgekeurde partnerlink', () => {
  const fout = [];
  let betaald = 0;
  for (const f of walk(ROOT).filter((x) => /\.html$/.test(x))) {
    const src = readFileSync(f, 'utf8');
    for (const tag of onbetaaldeCtas(src)) fout.push(`${f.slice(ROOT.length)}: ${tag}`);
    betaald += [...src.matchAll(/<a\b[^>]*rel="sponsored nofollow noopener"[^>]*>/g)].length;
    assert.doesNotMatch(src, /data-cta="outbound"/, f);
  }
  assert.equal(fout.join('\n'), '', fout.join('\n'));
  assert.equal(betaald, 10, 'betaalde links: Make 2×, Hostinger, Wix, Cal.com, SimplyBook.me, Metricool, Gemini 3×');
});

test('17-11 geneutraliseerde merken: Bron-link op de kaart, geen knop; partnerlijst ongewijzigd', () => {
  const pages = {
    'ai-notuleren/index.html': ['amberscript', 'notta', 'otter', 'tldv'],
    'ai-chatbot-website/index.html': ['tidio', 'trengo'],
    'automatiseren-zonder-code/index.html': ['n8n', 'zapier'],
    'ai-afbeeldingen-en-ontwerp/index.html': ['pitch'],
    'crm-klein-bedrijf/index.html': ['hubspot', 'pipedrive', 'zoho'],
    'social-media-inplannen/index.html': ['buffer', 'hootsuite'],
  };
  for (const [f, ids] of Object.entries(pages)) {
    const h = readFileSync(join(ROOT, f), 'utf8');
    for (const id of ids) {
      const t = TOOLS.find((x) => x.id === id);
      assert.ok(h.includes(`<p class="go"><a href="${amp(t.url)}" rel="noopener">Bron: ${t.naam.replace(/&/g, '&amp;')}</a></p>`), `${f} ${id}`);
      assert.doesNotMatch(h, new RegExp(`data-vendor="${id}"`), `${f} ${id}`);
    }
  }
  const wl = { 'ai-website-maken/index.html': [['https://www.jouwweb.nl/', 'JouwWeb']], 'websitebezoekers-herkennen/index.html': [['https://www.leadfeeder.com/', 'Leadfeeder'], ['https://www.leadinfo.com/nl/', 'Leadinfo']] };
  for (const [f, xs] of Object.entries(wl)) {
    const h = readFileSync(join(ROOT, f), 'utf8');
    for (const [u, n] of xs) assert.ok(h.includes(`<p class="go"><a href="${u}" rel="noopener">Bron: ${n}</a></p>`), `${f} ${n}`);
  }
  for (const id of NEUTRAAL_1711) {
    assert.equal(PARTNERLINKS[id], undefined, id);
    const o = uitgaand(TOOLS.find((x) => x.id === id));
    assert.deepEqual(o, { href: TOOLS.find((x) => x.id === id).url, rel: 'noopener', partner: false, target: '' }, id);
    assert.ok(!NEUTRAAL_NAAM.includes(id));
  }
  assert.deepEqual(Object.keys(PARTNERLINKS).sort(), ['calcom', 'gemini', 'make', 'metricool', 'simplybook']);
  assert.equal(PARTNERLINKS.simplybook, 'https://simplybook.me?ref=dave_west_fd136');
  assert.equal(PARTNERLINKS.gemini, 'https://sharegoogleworkspace.advocate.impact.com/mQZoWo9');
  for (const [id, u] of Object.entries({ ...PARTNERLINKS, ...PARTNERLINKS_PAGINA })) if (id !== 'simplybook') assert.doesNotMatch(u, /dave/i, id);
  const ouder = (p) => execFileSync('git', ['show', `${PARENT}:${p}`], { cwd: ROOT, encoding: 'utf8' });
  const blok = (s, naam) => (s.match(new RegExp(`export const ${naam} = \\{[\\s\\S]*?\\};`)) || [])[0];
  const pl = readFileSync(join(ROOT, 'js/lib/partnerlinks.js'), 'utf8');
  assert.equal(blok(pl, 'PARTNERLINKS'), blok(ouder('js/lib/partnerlinks.js'), 'PARTNERLINKS'));
  assert.equal(blok(pl, 'PARTNERLINKS_PAGINA'), blok(ouder('js/lib/partnerlinks.js'), 'PARTNERLINKS_PAGINA'));
  assert.equal(readFileSync(join(ROOT, 'scripts/l7.config.mjs'), 'utf8'), ouder('scripts/l7.config.mjs'), 'ALLOW_NAME/l7.config ongewijzigd');
});

test('ranking: match.js en tools.js byte-gelijk aan f4dccde; partnerlinks beïnvloeden de volgorde niet', () => {
  for (const f of ['js/lib/match.js', 'js/lib/tools.js']) {
    assert.equal(readFileSync(join(ROOT, f), 'utf8'), execFileSync('git', ['show', `${PARENT}:${f}`], { cwd: ROOT, encoding: 'utf8' }), f);
  }
  assert.doesNotMatch(readFileSync(join(ROOT, 'js/lib/match.js'), 'utf8'), /^\s*import[^\n]*partnerlinks/m);
});

test('guard werkt: een onbetaalde knop of een gewijzigde partnerref wordt gevonden', () => {
  assert.equal(onbetaaldeCtas('<a class="btn ghost" href="https://zapier.com/" rel="noopener" target="_blank" data-vendor="zapier" data-cta="outbound">Naar de site van Zapier</a>').length, 1);
  assert.equal(onbetaaldeCtas('<a href="https://tldv.io/" rel="sponsored nofollow noopener">tl;dv</a>').length, 1);
  assert.equal(onbetaaldeCtas('<a href="https://simplybook.me?ref=dave_other" rel="sponsored nofollow noopener" data-cta="partner">x</a>').length, 1);
  assert.equal(onbetaaldeCtas('<a href="https://fireflies.ai/?utm_source=toolmatch" rel="noopener">Bron: Fireflies.ai</a>').length, 1);
  assert.equal(onbetaaldeCtas('<a href="https://fireflies.ai/" rel="noopener">Bron: Fireflies.ai</a>').length, 0);
  assert.equal(onbetaaldeCtas(`<a class="btn" href="${amp(PARTNERLINKS.calcom)}" rel="sponsored nofollow noopener" data-cta="partner">x</a>`).length, 0);
});
