// E-CTA-1 B (17-11): tekstlinks in de lopende tekst (copy Blogschrijver; spokes.py partner_tekst_b, website_leads.py wl_tekst),
// pastAls in keuzebox A, en de L7-unwrap (scripts/l7.config.mjs stripCta): alleen de B-linkmarkup telt niet; de tekst eromheen wel.
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ECTA } from '../scripts/e-cta-1.config.mjs';
import { resolve, MAX_A } from '../scripts/e-cta.mjs';
import { CFG } from '../scripts/l7.config.mjs';
import { bodyFingerprint } from '../scripts/l7check.mjs';
import { PARTNER_NOOT } from '../js/lib/partnerlinks.js';
import { bLinks, zonderB, REL_B } from './e-cta-b-helper.mjs';
import { zonderEcta } from './e-cta-helper.mjs';

// SEO-besluit B in-tekst (17-11, /workspace/site-checks/2026-11-17/e-cta-1/seo-besluit-b-intekst.md): alleen kaartmerken, exacte
// partnerlink + rel sponsored + label (partnerlink), niet in FAQ/schema, max. 1 per merk per sectie, alleen als link in een bestaande
// zin (geen nieuwe tekst: bewaakt door L7 met de B-unwrap, zie test hieronder), interne links wijken nooit.
const LABEL = ' (partnerlink)';
const PRE_B = '4d32407'; // golf-1-tip vóór B (vendor-fix); interne links mogen t.o.v. deze stand niet verdwijnen

const ROOT = join(import.meta.dirname || new URL('.', import.meta.url).pathname, '..');
const lees = (p) => readFileSync(join(ROOT, p, 'index.html'), 'utf8');
const alle = (d = ROOT, pre = '/') => readdirSync(d).flatMap((f) => { if (/^(node_modules|\.git|_site|test|scripts)$/.test(f)) return []; const q = join(d, f); return statSync(q).isDirectory() ? alle(q, `${pre}${f}/`) : f === 'index.html' ? [pre] : []; });
const slug = (p) => p.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
const betaald = (p) => (ECTA.pages[p]?.partners || []).filter((id) => ECTA.partners[id]?.reflink);
const verwachtHref = (id, p) => {
  const c = ECTA.partners[id]; if (!c.subid) return [c.reflink, c.reflink.replace(/&/g, '&amp;')];
  const u = new URL(c.reflink); u.searchParams.set(c.subid.param, c.subid.waarde.replace('{site}', ECTA.site).replace('{slug}', slug(p)).replace('{pos}', 'mid'));
  return [u.toString(), u.toString().replace(/&/g, '&amp;')];
};

test('E-CTA-1 B: elke tekstlink alleen naar een betaalde partner van de kaart voor die pagina; rel, label (partnerlink), aria, data-vendor, data-pos="mid", max. 1 per merk per sectie', () => {
  let n = 0;
  for (const p of alle()) {
    const h = lees(p);
    const bs = bLinks(h); if (!bs.length) continue;
    const ids = betaald(p);
    assert.ok(ids.length >= 2, `${p}: B-link op een pagina zonder (≥ 2) betaalde partners op de kaart`);
    for (const b of bs) {
      n++;
      assert.equal(b.rel, REL_B, `${p}: rel`);
      assert.equal(b.pos, 'mid', `${p}: data-pos`);
      assert.ok(b.vendor, `${p}: data-vendor (vendor_click)`);
      const kand = ids.filter((id) => (ECTA.partners[id].vendor || id) === b.vendor);
      assert.ok(kand.length, `${p}: ${b.vendor} staat niet als betaalde partner op de kaart van deze pagina`);
      assert.ok(kand.some((id) => verwachtHref(id, p).includes(b.href)), `${p}: href ${b.href} ≠ reflink(+subID mid) van ${b.vendor}`);
      // Zichtbaar label (partnerlink); linktekst begint met de merknaam uit de config (bv. 'Hostinger Website Bouwer (partnerlink)').
      assert.ok(b.tekst.endsWith(LABEL), `${p}: label (partnerlink) ontbreekt: ${b.tekst}`);
      assert.ok(b.tekst.startsWith(ECTA.partners[kand[0]].naam), `${p}: linktekst ${b.tekst} begint niet met ${ECTA.partners[kand[0]].naam}`);
      // aria-label = zichtbare tekst (label-in-name) + nieuw-tabblad-melding
      assert.equal(b.aria, b.tekst + (b.target === '_blank' ? ' (opent in een nieuw tabblad)' : ''), `${p}: aria-label`);
    }
    for (const s of h.split(/<h2\b/)) { const v = bLinks(s).map((b) => b.vendor); assert.equal(new Set(v).size, v.length, `${p}: merk dubbel in één H2-sectie`); }
    // volgorde in de alinea = neutrale kaartvolgorde
    const v = bs.map((b) => b.vendor);
    assert.deepEqual(v, [...new Set(ids.map((id) => ECTA.partners[id].vendor || id))].filter((x) => v.includes(x)), `${p}: volgorde`);
  }
  assert.ok(n > 0, 'geen enkele B-link gevonden');
});

// FAQ-sectie: van <h2 id="faq"> (of 'Veelgestelde vragen') tot de volgende <h2>.
const faqDeel = (h) => { const i = h.search(/<h2\b[^>]*(?:id="faq"|>\s*Veelgestelde vragen)/); if (i < 0) return ''; const j = h.slice(i + 3).search(/<h2\b/); return j < 0 ? h.slice(i) : h.slice(i, i + 3 + j); };
const schema = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');

test('E-CTA-1 B: niet in de FAQ en niet in het schema (SEO-besluit 2)', () => {
  for (const p of alle()) {
    const h = lees(p);
    assert.equal(bLinks(faqDeel(h)).length, 0, `${p}: B-link in de FAQ`);
    const ld = schema(h);
    assert.doesNotMatch(ld, /\(partnerlink\)|data-pos=|sponsored/, `${p}: B in het schema`);
    for (const b of bLinks(h)) assert.ok(!ld.includes(b.href) && !ld.includes(b.href.replace(/&amp;/g, '&')), `${p}: B-reflink in het schema`);
  }
});

const interneLinks = (h) => { const m = new Map(); for (const x of zonderEcta((h.match(/<main[\s\S]*<\/main>/) || [''])[0]).matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)) m.set(x[1], (m.get(x[1]) || 0) + 1); return m; };
test('E-CTA-1 B: een interne link wijkt nooit voor een partnerlink (SEO-besluit 5; t.o.v. de stand vóór B)', () => {
  for (const p of alle()) {
    const h = lees(p); if (!bLinks(h).length) continue;
    let oud; try { oud = execFileSync('git', ['show', `${PRE_B}:${p.slice(1)}index.html`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { continue; }
    const a = interneLinks(oud), b = interneLinks(h);
    for (const [href, n] of a) assert.ok((b.get(href) || 0) >= n, `${p}: interne link ${href} ${n}× → ${b.get(href) || 0}×`);
  }
});

test('E-CTA-1 B: vendor_click telt de tekstlinks (consent.js luistert op a[data-vendor], ongewijzigd)', () => {
  assert.match(readFileSync(join(ROOT, 'js/consent.js'), 'utf8'), /a\[data-vendor\]/);
});

test('E-CTA-1 pastAls: keuzebox A toont per betaalde partner precies de pastAls-regel uit de config; C niet', () => {
  let n = 0;
  for (const p of Object.keys(ECTA.pages)) {
    const r = resolve(ECTA, p); if (r.fallback) continue;
    const h = lees(p);
    const a = h.match(/<aside class="ecta[^"]*"[^>]*data-ecta="A"[^>]*>[\s\S]*?<\/aside>/)[0];
    const c = h.match(/<aside class="ecta[^"]*"[^>]*data-ecta="C"[^>]*>[\s\S]*?<\/aside>/)[0];
    const regels = [...a.matchAll(/<span class="ecta-pastals">([^<]*)<\/span>/g)].map((m) => m[1]);
    assert.deepEqual(regels, r.partners.slice(0, MAX_A).map((x) => ECTA.partners[x.id].pastAls).filter(Boolean), `${p}: pastAls A`);
    assert.doesNotMatch(c, /ecta-pastals/, `${p}: geen pastAls in C`);
    for (const t of regels) assert.doesNotMatch(t, /€|\d|gratis|korting|actie/i, `${p}: pastAls zonder prijs/claim`);
    n += regels.length;
  }
  assert.ok(n > 0);
});

test('L7 stripCta B-unwrap: alleen de linkmarkup valt weg; tekst eromheen blijft tellen (negatieve test)', () => {
  const pag = (body) => `<html><body><main><h1>T</h1>${body}</main></body></html>`;
  const b = '<a href="https://x.example/r" rel="sponsored nofollow noopener" target="_blank" data-vendor="x" data-cta="partner" data-pos="mid" aria-label="Merk (partnerlink) (opent in een nieuw tabblad)">Merk (partnerlink)</a>';
  const fp = (body) => bodyFingerprint(pag(body), CFG);
  assert.equal(fp('<p>Kies Merk als je alleen werkt.</p>'), fp(`<p>Kies ${b} als je alleen werkt.</p>`));
  assert.notEqual(fp('<p>Kies Merk als je alleen werkt.</p>'), fp(`<p>Kies ${b} als je vooral alleen werkt.</p>`));
  assert.notEqual(fp('<p>Tekst.</p>'), fp(`<p>Tekst. Van de betaalde merken: ${b}.</p>`));
  assert.notEqual(fp('<p>Kies Merk.</p>'), fp(`<p>Kies ${b.replace(' data-pos="mid"', '')}.</p>`));
  assert.notEqual(fp('<p>Kies Merk.</p>'), fp(`<p>Kies ${b.replace('rel="sponsored nofollow noopener"', 'rel="noopener"')}.</p>`));
  assert.notEqual(fp('<p>Kies Merk.</p>'), fp(`<p>Kies ${b.replace('>Merk (partnerlink)<', '><strong>Merk</strong> (partnerlink)<')}.</p>`));
  // zonder zichtbaar label geen unwrap (label hoort bij B)
  assert.notEqual(fp('<p>Kies Merk.</p>'), fp(`<p>Kies ${b.replace('>Merk (partnerlink)<', '>Merk<')}.</p>`));
  // label buiten de link telt wel
  assert.notEqual(fp('<p>Kies Merk.</p>'), fp(`<p>Kies ${b.replace('>Merk (partnerlink)<', '>Merk<')} (partnerlink).</p>`));
  // echte pagina: B-links terug naar linktekst = zelfde vingerafdruk; één woord buiten de links anders = rood
  const h = lees('/online-afspraken-plannen/');
  assert.ok(bLinks(h).length, 'voorbeeldpagina heeft B-links');
  assert.equal(bodyFingerprint(h, CFG), bodyFingerprint(zonderB(h), CFG));
  const eerste = bLinks(h)[0].html;
  const mut = h.replace(eerste, `Extra ${eerste}`); // één woord vlak vóór de B-link
  assert.notEqual(mut, h);
  assert.notEqual(bodyFingerprint(mut, CFG), bodyFingerprint(h, CFG));
  assert.equal(fp('<p>x</p>'), fp('<p>x</p><aside class="ecta ecta-a" data-ecta="A"><p>Cal.com</p></aside>'));
});
