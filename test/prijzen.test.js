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
// Uitbreiding 30-10 (vrijdagreview, SEO-specialist; review SC):
// R1+ ook fullwidth ＄ (U+FF04) en small ﹩ (U+FE69), met of zonder bedrag.
// R2+ eenheid = elk blok tussen blokgrenzen (p, li, td, th, dd, dt, figcaption, div, section, article, aside, h1-h6, tr, br, …);
//     inline elementen (span, strong, a, time) vallen in hun blok. Zo tellen prijzen in een <div> of <span> ook mee.
// R5 Actie/korting (L4). Een zin met een bedrag of percentage én 'korting', 'tijdelijk', 'actie(prijs)', 'aanbieding', 'welkomstactie',
//    'kortingscode', 'black friday' of 'sale' moet in dezelfde zin een einddatum noemen ('t/m 31-12-2026', 'tot en met 31 december 2026',
//    'geldig tot …', 'loopt tot …'). Vaste kortingen bij jaarbetaling/jaarabonnement/onderwijs/non-profit tellen niet. Ligt de einddatum
//    vóór PUSH_DATE (standaard vandaag, Europe/Amsterdam), dan is de actie verlopen en faalt de test ook; dat geldt voor elke zin met
//    een bedrag en een einddatum ('Tot en met 31-10-2026 de eerste 12 maanden €2,75'), ook zonder actiewoord.
//
// BEKEND: overtredingen die al in de build stonden toen deze test kwam (26-10, op 45151e3). Ze staan hier expliciet zodat de
// suite groen blijft, maar elke nieuwe overtreding faalt (R1: 79 bedragen/woorden op 18 pagina's; R2: geen).
// Is een bekend item opgelost, dan meldt de test dat als diagnostic; haal het dan uit de lijst.
// Niet stilletjes aanvullen: een nieuw item vraagt een OK van Moneymaker.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('..', import.meta.url).pathname;
// Bewust foute fixture: staat als string in de test (niet als bestand in de repo, want de repo-root is de live site)
// en wordt tijdens de test naar een tijdelijke map geschreven.
const FIXTURE_HTML = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<title>Bewust foute fixture voor test/prijzen.test.js</title>
<meta property="og:image" content="https://toolmatch.nl/og.png">
<meta property="og:image" content="https://toolmatch.nl/og-2.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Offer","price":"9","priceCurrency":"USD","description":"Vanaf $9 per maand"}</script>
</head>
<body>
<p>Pro kost $12 per maand, of 10 dollar bij jaarbetaling (USD).</p>
<table><tr><td>Introprijs €1,99 per maand de eerste 12 maanden, daarna €9,99 per maand.</td></tr></table>
<p>Bij Voorbeeld Pro geldt een actieprijs van €5 per maand; de standaardprijs is €10 per maand.</p>
<p>Drie licenties kosten samen €40 (3 × €10).</p>
</body>
</html>
`;
const FIXTURE_DIR = mkdtempSync(join(tmpdir(), 'tm-prijzen-'));
const FIXTURE = join(FIXTURE_DIR, 'prijzen-fout.html');
writeFileSync(FIXTURE, FIXTURE_HTML);
after(() => rmSync(FIXTURE_DIR, { recursive: true, force: true }));

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
const VALUTA = /[$＄﹩]\s?\d+(?:[.,]\d+)*|[$＄﹩]|\bUSD\b|\bdollars?\b/gi;
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

// Blokken (R2+, R5): splits de zichtbare body op blokgrenzen; inline tags (span, a, strong, time) blijven in hun blok.
const BLOKGRENS = /<\/?(?:p|li|td|th|dd|dt|figcaption|div|section|article|aside|header|footer|main|nav|h[1-6]|tr|table|thead|tbody|ul|ol|dl|blockquote|br|hr|details|summary|caption|form|label|button|figure)\b[^>]*>/gi;
export const blokken = (h) => {
  const b = zonderCode((h.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [, h])[1]);
  return b.replace(BLOKGRENS, '\n¶\n').split('¶').map(tekst).filter(Boolean);
};

// R2
const BEDRAG = /€\s?\d|\$\s?\d|\d\s?(euro|EUR)\b/;
const GETALWOORD = '(\\d+|twee|drie|vier|vijf|zes|zeven|acht|negen|tien|elf|twaalf|achttien|vierentwintig|zesendertig|achtenveertig)';
const PROMO = new RegExp(`\\b(actie(prijs|prijzen|periode)?|intro(ductie)?(prijs|prijzen|tarief|aanbieding)?|eerste ${GETALWOORD} maand(en)?|eerste jaar)\\b`, 'i');
const STANDAARDWOORD = /\b(standaard\w*|verleng\w*|regulier\w*|normaal|normale|daarna)\b/i;
const KNIP = /[;()]|,\s/g; // grens tussen zinsdelen (een decimale komma heeft geen spatie erachter)
const zinnen = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/);
export function volgorde(h) {
  const units = blokken(h).concat(ldStrings(h).map((x) => x.v));
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

// R5 (L4)
const ACTIE = /\b(korting\w*|tijdelijk\w*|actie(?:prijs|prijzen|periode)?|aanbieding\w*|welkomstactie|kortingscode|black friday|sale)\b/i;
const VAST = /\b(jaarbetaling|jaarlijks betalen|jaarabonnement|bij een jaar|onderwijs|non-?profit|student\w*|vrijwilliger\w*)\b/i;
const BEDRAG_OF_PCT = /€\s?\d|\$\s?\d|\d\s?(euro|EUR)\b|\d\s?%/;
const MND = 'januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december';
const EIND = new RegExp(`\\b(?:t\\/m|tot en met|tot|geldig tot|loopt tot|eindigt op|uiterlijk)\\s+(?:(\\d{1,2})[-/](\\d{1,2})[-/](\\d{4})|(\\d{1,2})\\s+(${MND})\\s+(\\d{4})|(\\d{4})-(\\d{2})-(\\d{2}))`, 'i');
const p2 = (x) => String(x).padStart(2, '0');
export const vandaag = () => process.env.PUSH_DATE || new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());
export function acties(h, peil = vandaag()) {
  const hits = [];
  for (const u of blokken(h).concat(ldStrings(h).map((x) => x.v))) for (const z of zinnen(u)) {
    const a = z.match(ACTIE);
    // Elke zin met een bedrag en een einddatum ('Tot en met 31-10-2026 de eerste 12 maanden €2,75') telt als tijdelijke prijs.
    if (!BEDRAG_OF_PCT.test(z) || (!a && !EIND.test(z)) || (a && /^korting/i.test(a[1]) && VAST.test(z))) continue;
    const e = z.match(EIND);
    if (!e) { if (a) hits.push(`zonder einddatum: ${z.slice(0, 90)}`); continue; }
    const eind = e[1] ? `${e[3]}-${p2(e[2])}-${p2(e[1])}` : e[4] ? `${e[6]}-${p2(MND.split('|').indexOf(e[5].toLowerCase()) + 1)}-${p2(e[4])}` : `${e[7]}-${e[8]}-${e[9]}`;
    if (eind < peil) hits.push(`verlopen ${eind}: ${z.slice(0, 90)}`);
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
const BEKEND_VALUTA = {}; // leeg sinds de valuta-fix van 26-10: elke $, USD of dollar op een NL-pagina laat de test falen
const BEKEND_VOLGORDE = {
};

execSync('python3 scripts/build.py', { cwd: ROOT });
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (/^(\.git|node_modules|scripts|test|_site)$/.test(f)) return []; return statSync(p).isDirectory() ? walk(p) : [p]; });
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

test('prijzen R5 (L4): actie/korting met bedrag noemt een einddatum die nog niet verlopen is', () => {
  const fout = [];
  for (const f of pages) for (const r of acties(read(f))) fout.push(`${url(f)}: ${r}`);
  assert.deepEqual(fout, []);
});

test('prijzen R1+/R2+/R5: fullwidth ＄, prijzen in div/span en acties zonder einddatum vallen op (zelftest)', () => {
  assert.ok(valuta('<html lang="nl"><body><div>Pro kost ＄12 per maand</div></body></html>').includes('＄12'));
  assert.ok(valuta('<html lang="nl"><body><span>Pro: ﹩9</span></body></html>').includes('﹩9'));
  assert.ok(volgorde('<body><div class="card"><span>Actieprijs €5 per maand</span>, daarna onbekend.</div></body>').length === 1, 'R2 in div/span');
  assert.ok(volgorde('<body><div><span>Standaardprijs €10 per maand.</span> <span>Actieprijs €5 per maand.</span></div></body>').length === 0, 'R2 goed in div');
  assert.equal(acties('<body><div>Tijdelijk 20% korting op Pro.</div></body>', '2026-11-02').length, 1);
  assert.equal(acties('<body><p>Welkomstactie: €9,95 per maand.</p></body>', '2026-11-02').length, 1);
  assert.equal(acties('<body><span>Actieprijs €15,60 bij aanschaf tot en met 31 december 2026.</span></body>', '2026-11-02').length, 0);
  assert.match(acties('<body><p>Met de actie t/m 31-10-2026 betaal je €59,88.</p></body>', '2026-11-02')[0], /verlopen 2026-10-31/);
  assert.equal(acties('<body><p>Bij jaarbetaling krijg je 20% korting: €96 per jaar.</p></body>', '2026-11-02').length, 0);
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
