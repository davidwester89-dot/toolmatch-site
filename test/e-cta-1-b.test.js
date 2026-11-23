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
import { secties, plekFouten, MERK } from './e-cta-b-plek.mjs';

// SEO-besluit B in-tekst (17-11, /workspace/site-checks/2026-11-17/e-cta-1/seo-besluit-b-intekst.md): alleen kaartmerken, exacte
// partnerlink + rel sponsored + label (partnerlink), niet in FAQ/schema, max. 1 per merk per sectie, alleen als link in een bestaande
// zin (geen nieuwe tekst: bewaakt door L7 met de B-unwrap, zie test hieronder), interne links wijken nooit.
const LABEL = ' (partnerlink)';
// Aanvulling 17-11 (seo-review-5380612.md, besluit punten 8-10): geen B in koppen, B op de eerste vermelding in p/li per sectie
// (h2, h3 en elke toolkaart <article> is een eigen sectie), alleen bestaande woorden linken, bronregels byte-gelijk.
// v3: op TM staat de eerste vermelding in elke kaart in een bestaande bronlink (claim-source) of in geen enkele p/li; daarom
// heeft TM nu 0 B-links. Deze tests bewaken elke B-link die later wordt toegevoegd.
const PRE_B = '4d32407'; // golf-1-tip vóór B (vendor-fix): referentie voor interne links, koppen, bronregels en tekst
const oudePagina = (p) => { try { return execFileSync('git', ['show', `${PRE_B}:${p.slice(1)}index.html`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } };

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
      assert.ok(b.tekst.startsWith(MERK[b.vendor]), `${p}: linktekst ${b.tekst} begint niet met ${MERK[b.vendor]}`);
      // aria-label = zichtbare tekst (label-in-name) + nieuw-tabblad-melding
      assert.equal(b.aria, b.tekst + (b.target === '_blank' ? ' (opent in een nieuw tabblad)' : ''), `${p}: aria-label`);
    }
    for (const s of h.split(/<h2\b/)) { const v = bLinks(s).map((b) => b.vendor); assert.equal(new Set(v).size, v.length, `${p}: merk dubbel in één H2-sectie`); }
    // volgorde in de alinea = neutrale kaartvolgorde
    const v = bs.map((b) => b.vendor);
    assert.deepEqual(v, [...new Set(ids.map((id) => ECTA.partners[id].vendor || id))].filter((x) => v.includes(x)), `${p}: volgorde`);
  }
  // v3: n mag 0 zijn (zie boven).
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
    const oud = oudePagina(p); if (!oud) continue;
    const a = interneLinks(oud), b = interneLinks(h);
    for (const [href, n] of a) assert.ok((b.get(href) || 0) >= n, `${p}: interne link ${href} ${n}× → ${b.get(href) || 0}×`);
  }
});

const SECTIE = /(?=<h2\b|<h3\b|<article\b)/;
test('E-CTA-1 B: geen sponsored link in h1-h6 (SEO-besluit 8)', () => {
  for (const p of alle()) for (const m of lees(p).matchAll(/<(h[1-6])\b[^>]*>((?:(?!<\/\1>)[\s\S])*)<\/\1>/g)) assert.doesNotMatch(m[2], /<a\b[^>]*\srel="[^"]*\bsponsored\b/, `${p}: sponsored link in <${m[1]}>`);
});

test('E-CTA-1 B: per sectie/toolkaart max. 1 per merk, op de eerste vermelding in de lopende tekst (p/li) (SEO-besluit 3, 9)', () => {
  const fout = [];
  for (const p of alle()) { const h = zonderEcta(lees(p)); if (!/data-pos="mid"/.test(h)) continue; for (const s of secties(h, SECTIE)) for (const f of plekFouten(s)) fout.push(`${p} ${f}`); }
  assert.deepEqual(fout, []);
});

test('E-CTA-1 B: alleen bestaande woorden gelinkt; koppen en bronregels byte-gelijk aan de stand vóór B (SEO-besluit 4, 8, 10)', () => {
  const koppen = (h) => [...h.matchAll(/<h[1-6]\b[\s\S]*?<\/h[1-6]>/g)].map((m) => m[0]);
  const bron = (h) => [...h.matchAll(/<p\b[^>]*\sclass="[^"]*\bsrc\b[^"]*"[^>]*>[\s\S]*?<\/p>/g)].map((m) => m[0]);
  let n = 0;
  for (const p of alle()) {
    const h = lees(p); const oud = oudePagina(p);
    if (!oud) { assert.equal(bLinks(h).length, 0, `${p}: B op een pagina die vóór B niet bestond`); continue; }
    n++;
    // /websitebezoekers-herkennen/: Leadinfo-partnerknop (19-11) wijzigt zichtbare knoptekst + partnerzin + datum;
    // dat is geen B-tekstlink. Koppen en bronregels blijven gelijk aan de stand vóór B.
    // /ai-presentatie-maken/: techronde 19-11 (push 26-11) zet één interne link op het bestaande woord «Canva» in de lead;
    // de tekst zelf blijft gelijk, dus die link halen we weg vóór de vergelijking.
    // /ai-mail-en-offertes/: wk48 (push 27-11) voegt in de intro één zin met een inlink naar /zakelijk-e-mailadres-aanmaken/ toe; die zin halen we weg vóór de vergelijking.
    const zonderTechInlink = (x) => (p === '/ai-presentatie-maken/' ? x.replace('<a href="/gids/canva-voor-ondernemers/">Canva</a>', 'Canva') : p === '/ai-mail-en-offertes/' ? x.replace(' Heb je nog geen mailadres op je eigen domein? Lees hoe je een <a href="/zakelijk-e-mailadres-aanmaken/">zakelijk e-mailadres aanmaakt</a>.', '') : x);
    if (p !== '/websitebezoekers-herkennen/') {
      assert.equal(bodyFingerprint(zonderTechInlink(h), CFG), bodyFingerprint(oud, CFG), `${p}: tekst gewijzigd t.o.v. ${PRE_B}`);
    }
    assert.deepEqual(koppen(h), koppen(oud), `${p}: koppen niet byte-gelijk aan ${PRE_B}`);
    assert.deepEqual(bron(h), bron(oud), `${p}: bronregels niet byte-gelijk aan ${PRE_B}`);
  }
  assert.ok(n > 20);
  // expliciet: de twee bronregels die in v2 gesplitst waren
  const oa = lees('/online-afspraken-plannen/');
  assert.match(oa, /<p class="src">Bron: <a href="https:\/\/cal\.com\/pricing" rel="noopener">Cal\.com Pricing<\/a> ·/);
  assert.match(oa, /<p class="src">Bron: <a href="https:\/\/simplybook\.me\/en\/pricing" rel="noopener">SimplyBook\.me Pricing<\/a> ·/);
});

test('E-CTA-1 B plek: negatieve tests (kop, latere vermelding, dubbel, bronregel, feitenlijst, in een bestaande link)', () => {
  const b = (v = 'calcom', t = 'Cal.com') => `<a href="https://x.example/r" rel="sponsored nofollow noopener" target="_blank" data-vendor="${v}" data-cta="partner" data-pos="mid" aria-label="${t} (partnerlink) (opent in een nieuw tabblad)">${t} (partnerlink)</a>`;
  const ok = (s) => assert.deepEqual(plekFouten(s), [], s);
  const rood = (s, re) => assert.ok(plekFouten(s).some((f) => re.test(f)), `${s} → ${plekFouten(s)}`);
  ok(`<article class="res tool"><h3>Cal.com</h3><p>Met ${b()} plan je afspraken. Cal.com is gratis.</p></article>`);
  rood(`<h3>${b()}</h3><p>Cal.com is gratis.</p>`, /in <h3>|lopende tekst/);
  rood(`<article><p>Cal.com is gratis. Kies ${b()}.</p></article>`, /eerdere vermelding/);
  rood(`<article><p>Kies ${b()}. En ${b()}.</p></article>`, /2 B-links/);
  rood(`<article><p class="src">Bron: ${b()} Pricing</p></article>`, /lopende tekst/);
  rood(`<article><dl><dd>${b()}</dd></dl></article>`, /lopende tekst/);
  rood(`<article><p><a class="claim-source" href="https://cal.com/pricing">Cal.com is gratis</a>, ${b()}.</p></article>`, /eerdere vermelding/);
  rood(`<article><p><a class="claim-source" href="https://cal.com/pricing">Met ${b()} plan je</a></p></article>`, /andere link/);
  rood(`<article><p>Kies ${b('calcom', 'Calendly')}.</p></article>`, /geen vermelding/);
  ok(`<article><h3>Cal.com</h3><dl><dd>Cal.com</dd></dl><p class="src">Bron: Cal.com</p><p class="go"><a href="#">Cal.com</a></p><p>Kies ${b()}.</p></article>`);
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
  // (v3: TM heeft geen echte B-links meer; we zetten er één om een bestaand woord op de echte pagina.)
  const h = lees('/online-afspraken-plannen/');
  const metB = h.replace(/(<main[\s\S]*?<p>)([A-Z][\w.]+)/, (_, a, w) => `${a}${b.replace(/Merk/g, w)}`);
  assert.notEqual(metB, h, 'B-link geplaatst');
  assert.equal(bLinks(metB).length, 1);
  assert.equal(bodyFingerprint(metB, CFG), bodyFingerprint(h, CFG));
  assert.equal(zonderB(metB), h);
  const eerste = bLinks(metB)[0].html;
  const mut = metB.replace(eerste, `Extra ${eerste}`); // één woord vlak vóór de B-link
  assert.notEqual(bodyFingerprint(mut, CFG), bodyFingerprint(h, CFG));
  assert.equal(fp('<p>x</p>'), fp('<p>x</p><aside class="ecta ecta-a" data-ecta="A"><p>Cal.com</p></aside>'));
});
