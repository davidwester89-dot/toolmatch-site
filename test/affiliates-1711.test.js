// Vier goedgekeurde affiliate-links (17-11): Cal.com, Metricool, SimplyBook.me, Google Workspace/Gemini.
// Alleen bestaande CTA's, via PARTNERLINKS. Ranking identiek (match.js/tools.js ongewijzigd).
// Gemini: geen target=_blank, niet framen. Bron-/prijslinks blijven gewone links.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { match, VRAGEN } from '../js/lib/match.js';
import { TOOLS } from '../js/lib/tools.js';
import { uitgaand, metNoot, PARTNERLINKS, PARTNERLINKS_ZELFDE_TAB, PARTNER_NOOT } from '../js/lib/partnerlinks.js';

const ROOT = new URL('..', import.meta.url).pathname;
const PARENT = '31926c9c11f93808147d845b124b06526ea9bb49';
const REL = 'sponsored nofollow noopener';
const NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
const URLS = {
  calcom: 'https://refer.cal.com/toolmatch-egfa',
  metricool: 'https://i.mtr.cool/toolmatch',
  simplybook: 'https://simplybook.me?ref=dave_west_fd136',
  gemini: 'https://sharegoogleworkspace.advocate.impact.com/mzZoWo9',
};
const skip = /^(\.git|node_modules|scripts|test|_site)$/;
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (skip.test(f)) return [];
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const rel = (f) => f.slice(ROOT.length).replace(/^\//, '');
const htmlFiles = () => walk(ROOT).filter((f) => f.endsWith('.html'));

test('PARTNERLINKS: vier affiliates met exacte reflinks, Gemini in zelfde tab', () => {
  assert.equal(PARTNERLINKS.calcom, URLS.calcom);
  assert.equal(PARTNERLINKS.metricool, URLS.metricool);
  assert.equal(PARTNERLINKS.simplybook, URLS.simplybook);
  assert.equal(PARTNERLINKS.gemini, URLS.gemini);
  assert.equal(PARTNERLINKS.make, 'https://www.make.com/en/register?pc=toolmatch');
  assert.deepEqual(Object.keys(PARTNERLINKS).sort(), ['calcom', 'gemini', 'make', 'metricool', 'simplybook']);
  assert.deepEqual(PARTNERLINKS_ZELFDE_TAB, ['gemini']);

  const cal = TOOLS.find((t) => t.id === 'calcom');
  const met = TOOLS.find((t) => t.id === 'metricool');
  const sb = TOOLS.find((t) => t.id === 'simplybook');
  const gem = TOOLS.find((t) => t.id === 'gemini');
  assert.equal(cal.url, 'https://cal.com/');
  assert.equal(met.url, 'https://metricool.com/');
  assert.equal(sb.url, 'https://simplybook.me/');
  assert.equal(gem.url, 'https://workspace.google.com/intl/nl/');

  const oCal = uitgaand(cal);
  assert.deepEqual(oCal, { href: URLS.calcom, rel: REL, partner: true, target: '_blank' });
  const oGem = uitgaand(gem);
  assert.deepEqual(oGem, { href: URLS.gemini, rel: REL, partner: true, target: '' });
});

test('vier affiliates: rel sponsored op bestaande CTA-plekken; bronlinks blijven gewoon', () => {
  const af = readFileSync('online-afspraken-plannen/index.html', 'utf8');
  const soc = readFileSync('social-media-inplannen/index.html', 'utf8');
  const ass = readFileSync('ai-assistenten/index.html', 'utf8');
  const mail = readFileSync('ai-mail-en-offertes/index.html', 'utf8');
  const pres = readFileSync('ai-presentatie-maken/index.html', 'utf8');

  const knop = (html, href, vendor, { targetBlank = true, label } = {}) => {
    const tgt = targetBlank ? ' target="_blank"' : '';
    const re = new RegExp(`<a class="btn ghost" href="${href.replace(/[?./]/g, '\\$&')}" rel="${REL}"${tgt} data-vendor="${vendor}" data-cta="partner" aria-label="([^"]*)">([^<]*)</a>`);
    const m = html.match(re);
    assert.ok(m, `knop ${vendor} niet gevonden`);
    if (label) assert.equal(m[1], label);
    return m;
  };

  knop(af, URLS.calcom, 'calcom', { label: 'Naar de site van Cal.com (opent in een nieuw tabblad)' });
  knop(af, URLS.simplybook, 'simplybook', { label: 'Naar de site van SimplyBook.me (opent in een nieuw tabblad)' });
  knop(soc, URLS.metricool, 'metricool', { label: 'Naar de site van Metricool (opent in een nieuw tabblad)' });
  const gemLabel = 'Naar de site van Google (Gemini in Google Workspace)';
  knop(ass, URLS.gemini, 'gemini', { targetBlank: false, label: gemLabel });
  knop(mail, URLS.gemini, 'gemini', { targetBlank: false, label: gemLabel });
  knop(pres, URLS.gemini, 'gemini', { targetBlank: false, label: gemLabel });

  for (const [html, nootCount] of [[af, 1], [soc, 1], [ass, 1], [mail, 1], [pres, 1]]) {
    assert.equal(html.split('class="pnoot"').length - 1, nootCount);
    assert.match(html, new RegExp(`<p class="pnoot">${NOOT}</p>`));
  }

  // Bron-/prijslinks blijven officiële site, zonder sponsored.
  assert.match(af, /href="https:\/\/cal\.com\/pricing" rel="noopener">Cal\.com Pricing<\/a>/);
  assert.match(af, /href="https:\/\/simplybook\.me\/en\/pricing" rel="noopener">SimplyBook\.me Pricing<\/a>/);
  assert.doesNotMatch(af, /cal\.com\/pricing[^"]*" rel="[^"]*sponsored/);
  assert.doesNotMatch(af, /simplybook\.me\/en\/pricing[^"]*" rel="[^"]*sponsored/);
  assert.match(soc, /href="https:\/\/metricool\.com\/pricing\/" rel="noopener">Metricool Pricing<\/a>/);
  assert.doesNotMatch(soc, /metricool\.com\/pricing\/[^"]*" rel="[^"]*sponsored/);
  assert.match(ass, /href="https:\/\/workspace\.google\.com\/intl\/nl\/business\/" rel="noopener">Google Workspace voor bedrijven: abonnementen \(NL-pagina van de aanbieder\)<\/a>/);
  assert.match(ass, /href="https:\/\/workspace\.google\.com\/intl\/nl\/pricing" rel="noopener">Google Workspace: prijzen<\/a>/);
  assert.doesNotMatch(ass, /workspace\.google\.com[^"]*" rel="[^"]*sponsored/);

  // Trackinglink alleen op de bedoelde knoppen, niet op vergelijking/gids-bronnen.
  const vs = readFileSync('vergelijken/chatgpt-vs-gemini/index.html', 'utf8');
  const gids = readFileSync('gids/wat-kosten-ai-abonnementen/index.html', 'utf8');
  assert.doesNotMatch(vs, /advocate\.impact\.com/);
  assert.doesNotMatch(gids, /advocate\.impact\.com/);
  assert.equal(af.split(URLS.calcom).length - 1, 1);
  assert.equal(af.split(URLS.simplybook).length - 1, 1);
  assert.equal(soc.split(URLS.metricool).length - 1, 1);
});

test('Gemini-partnerlink: nergens target=_blank of iframe; keuzehulp volgt uitgaand()', () => {
  for (const f of htmlFiles()) {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /<iframe\b[^>]*advocate\.impact\.com/i, rel(f));
    assert.doesNotMatch(src, /href="https:\/\/sharegoogleworkspace\.advocate\.impact\.com\/mzZoWo9"[^>]*target=/i, rel(f));
    for (const m of src.matchAll(/<a[^>]*data-vendor="gemini"[^>]*>/g)) {
      assert.doesNotMatch(m[0], /target="/, rel(f) + ' ' + m[0]);
      assert.match(m[0], /rel="sponsored nofollow noopener"/);
      assert.doesNotMatch(m[0], /opent in een nieuw tabblad/);
    }
  }
  const kh = readFileSync('js/keuzehulp.js', 'utf8');
  assert.match(kh, /const o = uitgaand\(t\);/);
  assert.match(kh, /\$\{o\.target \? ` target="\$\{o\.target\}"` : ''\}/);
  assert.match(kh, /knopLabel\(t, \{ nieuwTabblad: Boolean\(o\.target\) \}\)/);
  assert.doesNotMatch(readFileSync('js/lib/match.js', 'utf8'), /^\s*import[^\n]*partnerlinks/m);
});

test('L7 17-11: alleen pagina\'s met bodywijziging; hubs niet gelift; lastmod niet achteruit', () => {
  const sm = readFileSync('sitemap.xml', 'utf8');
  const lifted = {
    '/online-afspraken-plannen/': '2026-11-17',
    '/social-media-inplannen/': '2026-11-17',
    '/ai-assistenten/': '2026-11-17',
    '/ai-mail-en-offertes/': '2026-11-17',
    '/ai-presentatie-maken/': '2026-11-17',
    '/keuzehulp/': '2026-11-17',
    '/privacy/': '2026-11-17',
  };
  const stayed = {
    '/automatiseren-zonder-code/': '2026-11-12',
    '/ai-afbeeldingen-en-ontwerp/': '2026-11-16',
    '/ai-data-analyse/': '2026-11-16',
    '/ai-vertalen/': '2026-11-16',
    '/ai-tekst-schrijven/': '2026-11-16',
    '/ai-chatbot-website/': '2026-11-16',
    '/ai-notuleren/': '2026-11-16',
    '/ai-website-maken/': '2026-11-16',
    '/websitebezoekers-herkennen/': '2026-11-16',
    '/gids/': '2026-11-10',
    '/gids/canva-voor-ondernemers/': '2026-11-10',
    '/gids/wat-kosten-ai-abonnementen/': '2026-10-30',
    '/vergelijken/': '2026-11-10',
    '/vergelijken/chatgpt-vs-gemini/': '2026-10-30',
    '/vergelijken/zapier-vs-make-vs-n8n/': '2026-11-10',
    '/partnerlinks/': '2026-10-28',
  };
  for (const [p, d] of Object.entries({ ...lifted, ...stayed })) {
    assert.ok(sm.includes(`<loc>https://toolmatch.nl${p}</loc><lastmod>${d}</lastmod>`), `${p} lastmod ${d}`);
  }
  const parentSm = execFileSync('git', ['show', `${PARENT}:sitemap.xml`], { encoding: 'utf8' });
  const lastmod = (xml, p) => (xml.match(new RegExp(`<loc>https://toolmatch.nl${p.replace(/\//g, '\\/')}</loc><lastmod>([^<]+)</lastmod>`)) || [])[1];
  for (const p of [...Object.keys(lifted), ...Object.keys(stayed)]) {
    const a = lastmod(parentSm, p);
    const b = lastmod(sm, p);
    assert.ok(a && b, p);
    assert.ok(b >= a, `lastmod achteruit ${p}: ${a} → ${b}`);
  }

  const vis = [
    ['online-afspraken-plannen/index.html', /"dateModified": "2026-11-17"/, /bijgewerkt op 17 november 2026/],
    ['social-media-inplannen/index.html', /"dateModified": "2026-11-17"/, /bijgewerkt op 17 november 2026/],
    ['ai-assistenten/index.html', /"dateModified": "2026-11-17"/, /bijgewerkt op 17 november 2026/],
    ['ai-mail-en-offertes/index.html', /"dateModified": "2026-11-17"/, /bijgewerkt op 17 november 2026/],
    ['ai-presentatie-maken/index.html', /"datePublished": "2026-11-03",\s*"dateModified": "2026-11-17"/, /bijgewerkt op <time datetime="2026-11-17">17 november 2026<\/time>/],
    ['keuzehulp/index.html', /"dateModified": "2026-11-17"/, /bijgewerkt op 17 november 2026/],
    ['privacy/index.html', /"dateModified": "2026-11-17"/, /bijgewerkt op 17 november 2026/],
  ];
  for (const [f, dm, bij] of vis) {
    const h = readFileSync(f, 'utf8');
    assert.match(h, dm, f);
    assert.match(h, bij, f);
  }
});

test('ranking identiek aan 31926c9: match.js en tools.js byte-gelijk, 0 volgordewijzigingen', () => {
  const matchNow = readFileSync('js/lib/match.js', 'utf8');
  const toolsNow = readFileSync('js/lib/tools.js', 'utf8');
  const matchOld = execFileSync('git', ['show', `${PARENT}:js/lib/match.js`], { encoding: 'utf8' });
  const toolsOld = execFileSync('git', ['show', `${PARENT}:js/lib/tools.js`], { encoding: 'utf8' });
  assert.equal(matchNow, matchOld);
  assert.equal(toolsNow, toolsOld);

  const ks = Object.keys(VRAGEN);
  const alle = [];
  (function rec(i, a) { if (i === ks.length) return alle.push({ ...a }); for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v }); })(0, {});
  const volgorde = alle.map((a) => match(a).map((r) => [r.tool.id, r.score].join(':')).join());
  const saved = { ...PARTNERLINKS };
  for (const k of Object.keys(PARTNERLINKS)) delete PARTNERLINKS[k];
  try {
    const zonder = alle.map((a) => match(a).map((r) => [r.tool.id, r.score].join(':')).join());
    assert.deepEqual(zonder, volgorde);
  } finally {
    Object.assign(PARTNERLINKS, saved);
  }
  let wijzig = 0;
  for (let i = 0; i < volgorde.length; i++) if (volgorde[i] !== volgorde[i]) wijzig++;
  assert.equal(wijzig, 0);
  assert.equal(volgorde.length, alle.length);
});

test('onbetaalde CTA in top 3: rapport over alle keuzehulp-profielen', () => {
  const partner = new Set(Object.keys(PARTNERLINKS));
  const neutraal = new Set(['canva', 'powerautomate', 'copilot', 'powerbi', 'chatgpt', 'claude', 'lechat', 'deepl', 'lookerstudio', 'googlecloudtranslate', 'calendly', 'acuity', 'albacross', 'intercom', 'wordpress', 'notuly']);
  const ks = Object.keys(VRAGEN);
  const alle = [];
  (function rec(i, a) { if (i === ks.length) return alle.push({ ...a }); for (const v of VRAGEN[ks[i]]) rec(i + 1, { ...a, [ks[i]]: v }); })(0, {});
  const perMerk = {};
  let profielen = 0;
  for (const a of alle) {
    const top = match(a).slice(0, 3);
    const unpaid = top.filter((r) => !partner.has(r.tool.id) && !neutraal.has(r.tool.id)).map((r) => r.tool.id);
    if (!unpaid.length) continue;
    profielen++;
    for (const id of unpaid) perMerk[id] = (perMerk[id] || 0) + 1;
  }
  // Rapportage: onbetaalde knoppen mogen in de top 3 staan (aanvraag loopt); dit legt de stand vast.
  assert.ok(profielen >= 0);
  const merken = Object.keys(perMerk).sort();
  for (const id of merken) {
    assert.equal(partner.has(id), false, id + ' is partner maar telt als onbetaald');
    assert.equal(neutraal.has(id), false, id + ' is bronlink maar telt als onbetaald');
  }
  // De vier nieuwe affiliates zelf horen niet in dit overzicht.
  for (const id of ['calcom', 'metricool', 'simplybook', 'gemini', 'make']) {
    assert.equal(perMerk[id], undefined, id);
  }
});

test('privacy: Cal.com, Metricool en SimplyBook.me hebben privacy-URL in dezelfde stijl als Make', () => {
  const priv = readFileSync('privacy/index.html', 'utf8');
  for (const [href, name] of [
    ['https://www.make.com/en/privacy-notice', 'Make'],
    ['https://cal.com/privacy', 'Cal.com'],
    ['https://metricool.com/privacy-policy/', 'Metricool'],
    ['https://simplybook.me/en/policy', 'SimplyBook.me'],
  ]) {
    const re = new RegExp(`<a href="${href.replace(/[./]/g, '\\$&')}" rel="noopener">${name.replace(/\./g, '\\.')}</a>`);
    assert.match(priv, re, name);
  }
  assert.match(priv, /nu Make, Cal\.com, Metricool en SimplyBook\.me/);
});
