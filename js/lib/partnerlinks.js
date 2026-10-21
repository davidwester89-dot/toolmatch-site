// Goedgekeurde partnerlinks per tool-id. LEEG zolang er geen goedgekeurd programma is.
// Pas invullen na goedkeuring en akkoord. De match (match.js) leest dit bestand NOOIT: geen invloed op score of volgorde.
export const PARTNERLINKS = {};

/** Uitgaande link: partnerlink (rel sponsored nofollow noopener, met label) als die er is, anders de officiële site. */
export function uitgaand(tool, partnerlinks = PARTNERLINKS) {
  const pl = partnerlinks[tool.id];
  return pl ? { href: pl, rel: 'sponsored nofollow noopener', partner: true } : { href: tool.url, rel: 'noopener', partner: false };
}

// Partnerzin: geen label per knop, maar precies één korte zin direct na elk blok waarin een partnerlink staat
// (rel sponsored). Werkt automatisch: staat er geen partnerlink in een blok, dan komt er ook geen zin.
export const PARTNER_NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
export const NOOT_HTML = `<p class="pnoot">${PARTNER_NOOT}</p>`;
const SPONSORED = /<a\s[^>]*rel="[^"]*\bsponsored\b/;
/** Eén blok als string: de zin erachter als er een partnerlink in staat. */
export const metNoot = (html) => (SPONSORED.test(html) ? html + NOOT_HTML : html);
/** Blokken (op class) met knoppen of links naar aanbieders. Het buitenste blok telt; binnen een blok komt geen tweede zin. */
export const BLOKKEN = ['results'];
/** Begin en eind van elk blok in html (buitenste eerst), en of er een partnerlink in staat. kaal = ook <p>, <ul>, <ol> zonder class. */
export function partnerBlokken(html, { blokken = BLOKKEN, kaal = false } = {}) {
  const cls = `<(div|ol|ul|p|aside|section)\\s[^>]*class="(?:[^"]*\\s)?(?:${blokken.join('|')})(?:\\s[^"]*)?"[^>]*>`;
  const re = new RegExp(kaal ? `${cls}|<(p|ul|ol)>` : cls, 'g');
  const res = []; let m;
  while ((m = re.exec(html))) {
    const tag = m[1] || m[2];
    const t = new RegExp(`<${tag}\\b|</${tag}>`, 'g'); t.lastIndex = m.index;
    let d = 0, eind = -1, x;
    while ((x = t.exec(html))) { if (x[0][1] === '/') { if (--d === 0) { eind = x.index + x[0].length; break; } } else d++; }
    if (eind < 0) continue;
    res.push({ start: m.index, end: eind, partner: SPONSORED.test(html.slice(m.index, eind)) });
    re.lastIndex = eind;
  }
  return res;
}
/** Hele pagina: precies één zin direct na elk blok met een partnerlink. */
export function partnerNoten(html, opts) {
  let out = '', i = 0;
  for (const b of partnerBlokken(html, opts)) if (b.partner && !html.startsWith(NOOT_HTML, b.end)) { out += html.slice(i, b.end) + NOOT_HTML; i = b.end; }
  return out + html.slice(i);
}
