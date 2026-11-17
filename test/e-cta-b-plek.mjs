// E-CTA-1 B, plek van de tekstlink (SEO-besluit B in-tekst punten 3, 8, 9, 10; seo-review-5380612.md, 17-11).
// - Geen sponsored link in h1-h6.
// - Per sectie max. 1 B-link per merk, en die staat op de eerste vermelding van het merk in de lopende tekst (p/li).
//   Koppen, tabellen, dl-feitenlijsten, bronregels (p.src/.sources/.bron), knoplabels (p.go), partnerzin (p.pnoot), keuzeboxen (aside),
//   nav/breadcrumb en script tellen niet mee.
// - Vermelding = het merk als los woord, ook in een productnaam (Shopify Payments/POS/Plus telt dus mee). Is die eerste vermelding
//   een productnaam, dan kan B daar niet zonder de naam te breken en krijgt de sectie geen B-link. Samenstellingen (Merk-xxx) tellen niet.
// - Staat de eerste vermelding in een bestaande link (bron-, claim- of interne link), dan kan B daar niet (een bestaande link wijkt niet)
//   en krijgt de sectie geen B-link.
export const MERK = { shopify: 'Shopify', wix: 'Wix', hostinger: 'Hostinger', calcom: 'Cal.com', simplybook: 'SimplyBook.me' };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const vermeldingRe = (merk) => new RegExp(`(?<![\\w.-])${esc(merk)}(?![\\w-])`, 'g');
const isB = (tag) => /^<a\b/.test(tag) && /\sdata-pos="mid"/.test(tag) && /\srel="sponsored nofollow noopener"/.test(tag);
const SKIP = /^(h[1-6]|table|dl|script|style|nav|aside|figure|template|button|select)$/;
const skipP = (tag) => /^<p\b/.test(tag) && /\sclass="[^"]*\b(src|go|pnoot|bron|sources)\b/.test(tag);

/** Splitst <main> in secties. sectieRe: waar een nieuwe sectie begint (lookahead). */
export function secties(html, sectieRe) {
  const m = (html.match(/<main[\s\S]*<\/main>/) || [html])[0];
  return m.split(sectieRe);
}

/** Loopt een sectie af: lopende-tekstfragmenten (p/li, buiten SKIP) en B-links in documentvolgorde. */
export function loop(sectie) {
  const uit = []; const stack = []; let b = null;
  const tel = () => ({ skip: stack.some((x) => x.k === 'S'), pl: stack.some((x) => x.n === 'p' || x.n === 'li'), inA: stack.some((x) => x.n === 'a' && x.k !== 'B') });
  for (const t of sectie.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || []) {
    if (t.startsWith('<!--')) continue;
    if (t.startsWith('</')) {
      const n = t.slice(2).replace(/[\s>][\s\S]*$/, '').toLowerCase();
      let i = stack.length - 1; while (i >= 0 && stack[i].n !== n) i--; if (i < 0) continue;
      const weg = stack.splice(i);
      if (weg[0].k === 'B') { uit.push(b); b = null; }
      continue;
    }
    if (t.startsWith('<')) {
      const n = t.slice(1).replace(/[\s/>][\s\S]*$/, '').toLowerCase();
      if (/^(br|img|hr|input|meta|link|source|wbr|!doctype)$/.test(n) || t.endsWith('/>')) continue;
      if (n === 'p' && stack.length && stack[stack.length - 1].n === 'p') stack.pop();
      if (SKIP.test(n) || skipP(t)) stack.push({ n, k: 'S' });
      else if (n === 'a' && isB(t)) { const c = tel(); b = { type: 'B', vendor: (t.match(/\sdata-vendor="([^"]+)"/) || [])[1], tag: t, tekst: '', inPL: c.pl && !c.skip, inA: c.inA }; stack.push({ n, k: 'B' }); }
      else stack.push({ n });
      continue;
    }
    if (b) { b.tekst += t; continue; }
    const c = tel();
    if (c.pl && !c.skip) uit.push({ type: 'tekst', s: t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&'), inA: c.inA });
  }
  return uit;
}

/** Fouten in één sectie: sponsored in een kop, B buiten p/li, B in een andere link, >1 per merk, B niet op de eerste vermelding, B op een productnaam. */
export function plekFouten(sectie) {
  const f = []; const items = loop(sectie);
  for (const m of sectie.matchAll(/data-pos="mid"[^>]*>[^<]*<\/a>\s*(Payments|POS|Plus)\b/g)) f.push(`B-link op een productnaam (… ${m[1]})`);
  for (const m of sectie.matchAll(/<(h[1-6])\b[^>]*>((?:(?!<\/\1>)[\s\S])*)<\/\1>/g)) if (/<a\b[^>]*\srel="[^"]*\bsponsored\b/.test(m[2])) f.push(`sponsored link in <${m[1]}>`);
  const per = {};
  for (const it of items) if (it.type === 'B') (per[it.vendor] ||= []).push(it);
  for (const [v, bs] of Object.entries(per)) {
    if (bs.length > 1) f.push(`${v}: ${bs.length} B-links in één sectie`);
    const merk = MERK[v]; const B = bs[0];
    if (!B.inPL) { f.push(`${v}: B-link niet in de lopende tekst (p/li)`); continue; }
    if (B.inA) f.push(`${v}: B-link in een andere link`);
    if (!vermeldingRe(merk).test(B.tekst.replace(/ \(partnerlink\)$/, ''))) f.push(`${v}: linktekst «${B.tekst}» is geen vermelding van ${merk}`);
    for (const it of items) {
      if (it === B) break;
      if (it.type === 'tekst' && vermeldingRe(merk).test(it.s)) { f.push(`${v}: eerdere vermelding in de lopende tekst: «${it.s.trim().slice(0, 80)}»`); break; }
      if (it.type === 'B' && it.vendor !== v && vermeldingRe(merk).test(it.tekst)) { f.push(`${v}: eerdere vermelding in een andere B-link`); break; }
    }
  }
  return f;
}

/** Eerste vermelding van een merk in de lopende tekst van een sectie (rapportage). */
export function eersteVermelding(sectie, merk) {
  for (const it of loop(sectie)) {
    if (it.type === 'B' && !it.inPL) continue;
    const s = it.type === 'B' ? it.tekst : it.s;
    if (vermeldingRe(merk).test(s)) return { B: it.type === 'B', vendor: it.vendor, inA: !!it.inA, s: s.trim().slice(0, 100) };
  }
  return null;
}
