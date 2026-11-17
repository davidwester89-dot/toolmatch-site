// E-CTA-1 B (17-11): tekstlinks naar betaalde partners in de lopende tekst (scripts/spokes.py partner_tekst_b,
// scripts/website_leads.py wl_tekst). Eén bron voor de unwrap: dezelfde regel als scripts/l7.config.mjs (stripCta).
// Oudere byte-/telguards op de bestaande knoppen kijken naar de pagina zonder B-links; B heeft een eigen test (e-cta-1-b.test.js).
import { CFG } from '../scripts/l7.config.mjs';

const regel = CFG.stripCta.find((r) => Array.isArray(r));
if (!regel) throw new Error('l7.config: geen B-unwrapregel in stripCta');
export const B_RE = regel[0];
export const REL_B = 'sponsored nofollow noopener';
/** html met elke B-link vervangen door alleen de linktekst. Alle andere tekst blijft. */
export const zonderB = (html) => html.replace(new RegExp(B_RE.source, B_RE.flags), regel[1]);
/** Alle B-links (rel sponsored + data-pos="mid") met hun attributen. */
export const bLinks = (html) => [...html.matchAll(/<a\b(?=[^>]*\sdata-pos="mid")[^>]*>[\s\S]*?<\/a>/g)].map((m) => {
  const at = (n) => (m[0].match(new RegExp(`\\s${n}="([^"]*)"`)) || [])[1];
  return { index: m.index, html: m[0], href: at('href'), rel: at('rel'), vendor: at('data-vendor'), pos: at('data-pos'), aria: at('aria-label'), target: at('target'), tekst: m[0].replace(/<[^>]+>/g, '') };
});
