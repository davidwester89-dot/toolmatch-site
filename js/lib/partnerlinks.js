// Goedgekeurde partnerlinks per tool-id. LEEG zolang er geen goedgekeurd programma is.
// Pas invullen na goedkeuring en akkoord. De match (match.js) leest dit bestand NOOIT: geen invloed op score of volgorde.
export const PARTNERLINKS = {};

/** Uitgaande link: partnerlink (rel sponsored nofollow noopener, met label) als die er is, anders de officiële site. */
export function uitgaand(tool, partnerlinks = PARTNERLINKS) {
  const pl = partnerlinks[tool.id];
  return pl ? { href: pl, rel: 'sponsored nofollow noopener', partner: true } : { href: tool.url, rel: 'noopener', partner: false };
}
