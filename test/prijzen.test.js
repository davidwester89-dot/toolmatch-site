// Prijstest (lessen L1, L2 en L3 uit geleerde-lessen.md, plus og:image).
// Loopt over de build (zelfde aanpak als site.test.js: eerst scripts/build.py, dan alle .html buiten test/ en scripts/).
//
// Regels en heuristieken:
// R1 Valuta (L2). Op een NL-pagina (<html lang="nl…">) mag '$', 'USD' of 'dollar(s)' niet voorkomen in:
//    - zichtbare tekst: de HTML zonder <script>, <style>, <noscript> en commentaar, tags gestript, entiteiten gedecodeerd;
//    - tekst in attributen die een lezer of zoekmachine ziet: content= van meta description/og:/twitter:, alt=, title=, aria-label=, placeholder=;
//    - JSON-LD: elke stringwaarde (recursief), en priceCurrency moet 'EUR' zijn.
//    Gewoon JavaScript (inline <script> zonder ld+json, onclick-attributen, js/*.js) telt niet mee: daar is '$' code.
//    EN-pagina's (lang="en…") slaan R1 over; R2-R4 gelden daar wel. Op dit moment heeft ToolMatch geen EN-pagina's.
// R2 Prijsvolgorde (L1). Eenheid = blok (<p>, <li>, <td>, <th>, <dd>, <figcaption>) of een JSON-LD-stringwaarde, opgesplitst in zinnen
//    (splitsen na . ! ? gevolgd door spatie en hoofdletter/cijfer/aanhalingsteken; 'excl. btw' splitst dus niet).
//    Een promozin bevat een bedrag (€, $, euro, EUR) én een promowoord: 'actie(prijs|prijzen|periode)', 'intro(ductie)(prijs|tarief|aanbieding)',
//    'eerste N maand(en)' (N als cijfer of woord) of 'eerste jaar'. 'actief' en 'actiepunten' tellen niet (woordgrens).
//    Een promozin is goed als:
//      a) vóór het eerste promowoord in dezelfde zin een van de woorden standaard…, verleng…, regulier…, normaal, daarna staat, of een bedrag
//         in een eerder zinsdeel (zinsdelen gescheiden door ; ( ) of komma+spatie). Een bedrag in hetzelfde zinsdeel als het promowoord
//         ('je betaalt €95,52 voor de eerste 48 maanden') is zelf de actieprijs en telt niet als standaardprijs; of
//      b) de vorige zin in hetzelfde blok een bedrag noemt zonder promowoord (de standaardprijs staat er net voor), en de promozin
//         niet met een nieuw onderwerp begint ('Bij <Hoofdletter>…', zoals 'Bij JouwWeb Pro …').
// R3 Rekensom (L3). '(N × €X)', 'N x €X', 'N×€X' (ook decimale komma en punt als duizendtal). Het totaal is het bedrag direct na
//    '= ' achter de som, of anders het bedrag direct vóór '(N × €X)' (zoals '€59,88 (12 × €4,99)'). Staat er geen totaal, dan geen oordeel.
//    Het totaal moet tot op de cent gelijk zijn aan N × X.
// R4 og:image: hoogstens één property="og:image" per pagina (og:image:width e.d. tellen niet).
//
// BEKEND: overtredingen die al in de build stonden toen deze test kwam (26-10, op 45151e3). Ze staan hier expliciet zodat de
// suite groen blijft, maar elke nieuwe overtreding faalt (R1: 79 bedragen/woorden op 18 pagina's; R2: geen).
// Is een bekend item opgelost, dan meldt de test dat als diagnostic; haal het dan uit de lijst.
// Niet stilletjes aanvullen: een nieuw item vraagt een OK van Moneymaker.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const FIXTURE = join(ROOT, 'test/fixtures/prijzen-fout.html');

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', euro: '€', dollar: '$', times: '×', hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e.toLowerCase()] ?? m));
const tekst = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const zonderCode = (h) => h.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ');

const ldStrings = (h) => {
  const out = [];
  const rec = (v, k) => {
    if (typeof v === 'string') out.push({ k, v });
    else if (Array.isArray(v)) v.forEach((x) => rec(x, k));
    else if (v && typeof v === 'object') for (const [kk, vv] of Object.entries(v)) rec(vv, kk);
  };
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) rec(JSON.parse(m[1]), '');
  return out;
};

// R1
const VALUTA = /\$\s?\d+(?:[.,]\d+)*|\$|\bUSD\b|\bdollars?\b/gi;
export function valuta(h) {
  if (/<html[^>]*lang="en/i.test(h)) return [];
  const hits = [];
  const vis = zonderCode(h);
  const attr = [...vis.matchAll(/<meta\s+(?:name|property)="(?:description|og:[^"]*|twitter:[^"]*)"\s+content="([^"]*)"/gi),
    ...vis.matchAll(/\s(?:alt|title|aria-label|placeholder)="([^"]*)"/gi)].map((m) => decode(m[1]));
  for (const s of [tekst(vis), ...attr]) for (const m of s.matchAll(VALUTA)) hits.push(m[0].replace(/\s/g, ''));
  for (const { k, v } of ldStrings(h)) {
    if (k === 'priceCurrency' && v !== 'EUR') hits.push('priceCurrency:' + v);
    for (const m of v.matchAll(VALUTA)) hits.push(m[0].replace(/\s/g, ''));
  }
  return hits;
}

// R2
const BEDRAG = /€\s?\d|\$\s?\d|\d\s?(euro|EUR)\b/;
const GETALWOORD = '(\\d+|twee|drie|vier|vijf|zes|zeven|acht|negen|tien|elf|twaalf|achttien|vierentwintig|zesendertig|achtenveertig)';
const PROMO = new RegExp(`\\b(actie(prijs|prijzen|periode)?|intro(ductie)?(prijs|prijzen|tarief|aanbieding)?|eerste ${GETALWOORD} maand(en)?|eerste jaar)\\b`, 'i');
const STANDAARDWOORD = /\b(standaard\w*|verleng\w*|regulier\w*|normaal|normale|daarna)\b/i;
const KNIP = /[;()]|,\s/g; // grens tussen zinsdelen (een decimale komma heeft geen spatie erachter)
const zinnen = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/);
export function volgorde(h) {
  const units = [...zonderCode(h).matchAll(/<(p|li|td|th|dd|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => tekst(m[2]))
    .concat(ldStrings(h).map((x) => x.v));
  const hits = [];
  for (const u of units) {
    const zs = zinnen(u);
    zs.forEach((z, i) => {
      const p = z.match(PROMO);
      if (!p || !BEDRAG.test(z)) return;
      const voor = z.slice(0, p.index);
      const grens = Math.max(-1, ...[...voor.matchAll(KNIP)].map((k) => k.index));
      if (STANDAARDWOORD.test(voor) || BEDRAG.test(voor.slice(0, grens + 1))) return;
      const vorige = zs[i - 1];
      if (vorige && BEDRAG.test(vorige) && !PROMO.test(vorige) && !/^Bij [A-Z]/.test(z)) return;
      hits.push(z.slice(0, 90));
    });
  }
  return [...new Set(hits)];
}

// R3
const num = (s) => Math.round(parseFloat(s.replace(/\./g, '').replace(',', '.')) * 100);
const BED = '€\\s?(\\d{1,3}(?:\\.\\d{3})*(?:,\\d{1,2})?|\\d+(?:,\\d{1,2})?)';
export function rekensom(h) {
  const hits = [];
  const bronnen = [tekst(zonderCode(h)), ...ldStrings(h).map((x) => x.v)];
  const re = new RegExp(`(\\()?\\b(\\d+)\\s?[×xX]\\s?${BED}(\\))?`, 'g');
  for (const s of bronnen) for (const m of s.matchAll(re)) {
    const n = +m[2], x = num(m[3]);
    const na = s.slice(m.index + m[0].length).match(new RegExp(`^\\s?=\\s?${BED}`));
    const voor = m[1] ? s.slice(0, m.index).match(new RegExp(`${BED}\\s?$`)) : null;
    const totaal = na ? num(na[1]) : voor ? num(voor[1]) : null;
    if (totaal !== null && totaal !== n * x) hits.push(`${m[0]} totaal €${(totaal / 100).toFixed(2)} ≠ €${(n * x / 100).toFixed(2)}`);
  }
  return hits;
}

// R4
export const ogImages = (h) => (h.match(/property=["']og:image["']/g) || []).length;

// Bekende overtredingen in de build van 45151e3 (26-10). Zie de kop van dit bestand.
const BEKEND_VALUTA = {
  '/ai-afbeeldingen-en-ontwerp/': ['$144', '$20', '$14,99', '$24,99'],
  '/ai-assistenten/': ['$20', '$17', '$25', '$7', '$14,99', '$24,99', '$14'],
  '/ai-chatbot-website/': ['$29', '$19', '$0,99', '$24,17'],
  '/ai-data-analyse/': ['$20', '$9'],
  '/ai-mail-en-offertes/': ['$20', '$17', '$25', '$7', '$14'],
  '/ai-notuleren/': ['$8,17', '$8,33'],
  '/ai-tekst-schrijven/': ['$20', '$17', '$25', '$14,99', '$24,99'],
  '/ai-vertalen/': ['$20', '$10', '$14,99', '$24,99'],
  '/automatiseren-zonder-code/': ['$19,99'],
  '/crm-klein-bedrijf/': ['$15', '$14'],
  '/gids/wat-kosten-ai-abonnementen/': ['$20', '$17', '$25', '$14,99', '$24,99', '$7', 'Dollar', 'dollars'],
  '/keuzehulp/': ['$144', '$20', '$17', '$25', '$7', '$29', '$19', '$0,99', '$14,99', '$24,99', '$9', '$8,17', '$8,33', '$24,17', '$19,99'],
  '/online-afspraken-plannen/': ['$16', '$20', '$12', '$10', '$11,90', '$24,90'],
  '/social-media-inplannen/': ['$5', '$60', '$99'],
  '/vergelijken/chatgpt-vs-claude/': ['dollar', '$0', '$20', '$17', '$100', '$25'],
  '/vergelijken/chatgpt-vs-copilot/': ['$20'],
  '/vergelijken/chatgpt-vs-gemini/': ['$20', '$7', '$14'],
  '/vergelijken/zapier-vs-make-vs-n8n/': ['$19,99'],
};
const BEKEND_VOLGORDE = {
};

execSync('python3 scripts/build.py', { cwd: ROOT });
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (/^(\.git|node_modules|scripts|test)$/.test(f)) return []; return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(ROOT).filter((f) => f.endsWith('.html') && !/google[0-9a-f]+\.html$/.test(f));
const read = (f) => readFileSync(f, 'utf8');
const url = (f) => '/' + f.slice(ROOT.length).replace(/index\.html$/, '').replace(/^\//, '');

test('prijzen R1 (L2): geen $, USD of dollar op NL-pagina’s, ook niet in JSON-LD', (t) => {
  const fout = [];
  for (const f of pages) {
    const ok = new Set(BEKEND_VALUTA[url(f)] || []);
    const nu = new Set(valuta(read(f)));
    for (const x of nu) if (!ok.has(x)) fout.push(`${url(f)}: ${x}`);
    for (const x of ok) if (!nu.has(x)) t.diagnostic(`BEKEND_VALUTA opgelost, haal weg: ${url(f)} ${x}`);
  }
  assert.deepEqual(fout, []);
});

test('prijzen R2 (L1): standaard- of verlengprijs vóór actie-/introprijs', () => {
  const fout = [];
  for (const f of pages) {
    const ok = BEKEND_VOLGORDE[url(f)] || [];
    for (const z of volgorde(read(f))) if (!ok.some((b) => z.startsWith(b.slice(0, 60)))) fout.push(`${url(f)}: ${z}`);
  }
  assert.deepEqual(fout, []);
});

test('prijzen R3 (L3): (N × €X) klopt met het genoemde totaal', () => {
  const fout = [];
  for (const f of pages) for (const r of rekensom(read(f))) fout.push(`${url(f)}: ${r}`);
  assert.deepEqual(fout, []);
});

test('prijzen R4: hoogstens één og:image per pagina', () => {
  for (const f of pages) assert.ok(ogImages(read(f)) <= 1, `${url(f)}: ${ogImages(read(f))} og:image`);
});

test('prijzen: inline JavaScript met $ telt niet als valuta', () => {
  const h = '<html lang="nl"><body><p>Prijs €10</p><script>const s = `${a}`; $(".x").hide();</script><a onclick="$(this)">x</a></body></html>';
  assert.deepEqual(valuta(h), []);
});

test('prijzen: de bewust foute fixture faalt op elke regel', () => {
  const h = read(FIXTURE);
  const r = { R1: valuta(h), R2: volgorde(h), R3: rekensom(h), R4: ogImages(h) };
  console.log('fixture prijzen-fout.html:', JSON.stringify(r, null, 1));
  assert.ok(r.R1.includes('$12') && r.R1.includes('USD') && r.R1.includes('dollar') && r.R1.includes('priceCurrency:USD') && r.R1.includes('$9'), 'R1');
  assert.ok(r.R2.length >= 2, 'R2');
  assert.ok(r.R3.some((x) => x.includes('€40.00 ≠ €30.00')), 'R3');
  assert.ok(r.R4 > 1, 'R4');
});
