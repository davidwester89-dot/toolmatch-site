// Goedgekeurde partnerlinks per tool-id.
// De match (match.js) leest dit bestand NOOIT: geen invloed op score of volgorde.
// Make: direct programma (geen affiliatenetwerk), tracking via /en/register?pc=toolmatch. Geplaatst 9-11-2026.
// Cal.com, Metricool, SimplyBook.me: directe programma's, goedgekeurd 10-11-2026 (partnerbestand). Geplaatst 17-11-2026.
// Google Workspace/Gemini: Impact Advocate, goedgekeurd 10-11-2026. Geen target=_blank, niet framen. Geplaatst 17-11-2026.
// Canva, Power Automate, Copilot, Power BI en de twaalf vendors van 16-11 (ChatGPT, Claude, Le Chat, DeepL, Looker Studio, Google Cloud Translation, Calendly, Acuity, Albacross, Intercom, WordPress.org, Notuly) staan er bewust niet in: geen open affiliate; links blijven neutraal. Zapier, n8n en overige lopende/aanvraagbare merken blijven buiten deze lijst; hun bestaande knoppen wijzigen we nu niet.
export const PARTNERLINKS = {
  make: 'https://www.make.com/en/register?pc=toolmatch',
  calcom: 'https://refer.cal.com/toolmatch-egfa',
  metricool: 'https://i.mtr.cool/toolmatch',
  simplybook: 'https://simplybook.me?ref=dave_west_fd136',
  gemini: 'https://sharegoogleworkspace.advocate.impact.com/mzZoWo9',
};

// Partnerlinks die niet in een nieuw tabblad mogen openen en niet in een iframe horen (Google Workspace/Gemini, Impact Advocate).
export const PARTNERLINKS_ZELFDE_TAB = ['gemini'];

// Goedgekeurde partnerlinks voor aanbieders die geen tool in tools.js zijn (alleen knoppen op inhoudspagina's, bv. /ai-website-maken/).
// Ook dit leest de match NOOIT; de volgorde op die pagina's blijft alfabetisch.
// Hostinger: Daisycon-campagne 16780, goedgekeurd op 27-10-2026.
// Wix: Impact Dutch WSB, contract 25616, ad 2152480. Link exact uit het portaal; niet aanpassen.
export const PARTNERLINKS_PAGINA = {
  hostinger: 'https://jf79.net/c/?si=16780&li=1722914&wi=440699&ws=&dl=nl%2Fwebsite-maken-met-ai',
  wix: 'https://wix.pxf.io/c/7989613/2152480/25616?trafcat=wsb',
};

/** Uitgaande link: partnerlink (rel sponsored nofollow noopener, met label) als die er is, anders de officiële site.
 *  target is '_blank' behalve bij PARTNERLINKS_ZELFDE_TAB (leeg: geen target-attribuut, niet framen). */
export function uitgaand(tool, partnerlinks = PARTNERLINKS) {
  const pl = partnerlinks[tool.id];
  if (!pl) return { href: tool.url, rel: 'noopener', partner: false, target: '_blank' };
  const zelfde = PARTNERLINKS_ZELFDE_TAB.includes(tool.id);
  return { href: pl, rel: 'sponsored nofollow noopener', partner: true, target: zelfde ? '' : '_blank' };
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
