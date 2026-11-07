// /ai-website-maken/ na 31-10-2026: JouwWeb-actie (t/m 31-10, eerste 12 maanden 50%, Lite €2,75) eraf; prijzen Hostinger en JouwWeb
// op 30-10 opnieuw bekeken op NL-IP (site-checks/2026-10-30/tm-website-prijzen-details.md). L1, L4, L7 (paginadatum 2026-11-07 na de Wix-partnerknop).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const PUSH = '2026-11-01';
const read = (p) => readFileSync(p, 'utf8');
const MND = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
const EIND = new RegExp(`\\b(?:t\\/m|tot en met|geldig tot|loopt tot|eindigt op)\\s+(?:(\\d{1,2})[-/](\\d{1,2})[-/](\\d{4})|(\\d{1,2})\\s+(${MND.join('|')})\\s+(\\d{4}))`, 'gi');
const p2 = (x) => String(x).padStart(2, '0');
// Einddatums in de zichtbare tekst (en JSON-LD) die vóór de pushdatum liggen = verlopen actie (L4).
export function verlopen(h, peil = PUSH) {
  const txt = h.replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  const out = [];
  for (const m of txt.matchAll(EIND)) {
    const d = m[1] ? `${m[3]}-${p2(m[2])}-${p2(m[1])}` : `${m[6]}-${p2(MND.indexOf(m[5].toLowerCase()) + 1)}-${p2(m[4])}`;
    if (d < peil) out.push(`${d}: ${m[0]}`);
  }
  return out;
}
const t = read('ai-website-maken/index.html');

test('website-prijzen: geen actie die vóór de pushdatum eindigt (L4)', () => {
  assert.deepEqual(verlopen(t), []);
  assert.doesNotMatch(t, /€2,75|€59,88|12 × €4,99|de helft/);
});

test('website-prijzen: zelftest verlopen()', () => {
  assert.equal(verlopen('<p>Tot en met 31-10-2026 de eerste 12 maanden €2,75.</p>').length, 1);
  assert.equal(verlopen('<p>tot en met 31 oktober 2026 betaal je de helft</p>').length, 1);
  assert.equal(verlopen('<p>actieprijs t/m 31-12-2026</p>').length, 0);
  assert.equal(verlopen('<p>Actie t/m 31-10-2026</p>', '2026-10-31').length, 0);
});

test('website-prijzen: standaard-/verlengprijs eerst (L1), bedragen zoals op de bron 30-10', () => {
  assert.match(t, /<td>Lite: €5,50 per maand bij jaarbetaling, excl\. btw\.<\/td>/);
  assert.match(t, /Lite \(€5,50 per maand\)[^<]*Pro \(€10 per maand\)[^<]*Business \(€20 per maand\)[^<]*Standaardtarieven bij jaarbetaling, exclusief btw\./);
  assert.match(t, /Premium: €9,99 per maand \(verlengprijs\); de eerste 48 maanden €1,99 per maand \(€95,52 vooraf\), excl\. btw\./);
  assert.match(t, /Onbeperkt kost €16,99 per maand; de eerste 48 maanden €2,99/);
  assert.match(t, /Bij JouwWeb Pro is de standaardprijs €10 per maand, dus €120 per jaar \(onze rekensom\)\./);
});

test('website-prijzen L7: dateModified, zichtbaar bijgewerkt en lastmod = 2026-11-07; bronnen JouwWeb/Hostinger bekeken op 30 oktober 2026', () => {
  assert.match(t, /"dateModified": "2026-11-07"/);
  assert.match(t, /"datePublished": "2026-10-27"/);
  assert.match(t, /<p class="note">Redactie ToolMatch · gepubliceerd op 27 oktober 2026, bijgewerkt op 7 november 2026, bronnen bekeken op 26 oktober 2026, Hostinger en JouwWeb op 30 oktober 2026\./);
  assert.ok(read('sitemap.xml').includes('<loc>https://toolmatch.nl/ai-website-maken/</loc><lastmod>2026-11-07</lastmod>'));
  for (const u of ['https://www.jouwweb.nl/prijzen', 'https://www.hostinger.com/nl/website-maken-met-ai', 'https://www.hostinger.com/nl/website-maken']) {
    assert.ok(t.includes(`<a href="${u}" rel="noopener">`) && new RegExp(u.replace(/[./]/g, '\\$&') + '" rel="noopener">[^<]+</a>, bekeken op 30 oktober 2026').test(t), u);
  }
  // Wix en WordPress zijn niet opnieuw bekeken: hun datum blijft staan.
  assert.match(t, /nl\.wix\.com\/pricing" rel="noopener">[^<]+<\/a>, bekeken op 26 oktober 2026/);
  assert.match(read('websitebezoekers-herkennen/index.html'), /<th scope="col">Gecontroleerd op 26 oktober 2026<\/th>/);
});
