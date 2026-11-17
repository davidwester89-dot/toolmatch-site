// E-CTA-1 (17-11-2026): de vaste CTA-blokken A/C (scripts/e-cta.mjs) hebben een eigen test (test/e-cta-1.test.js:
// label, rel, goedgekeurde reflink, volgorde, fallback, idempotent). Oudere byte-/telguards kijken naar de pagina
// zónder die blokken, zodat zij blijven bewaken wat ze bewaakten. Strippen is exact het omgekeerde van applyEcta.
export const ECTA_BLOK = /<aside class="ecta[^"]*"[^>]*data-ecta="[AC]"[^>]*>[\s\S]*?<\/aside>\n?/g;
export const zonderEcta = (html) => html.replace(ECTA_BLOK, '');
// Zelfde regex voor de Python-sweeps (claim_sources: unit-indexen tellen zonder de blokken).
export const ECTA_BLOK_PY = String.raw`re.compile(r'<aside class="ecta[^"]*"[^>]*data-ecta="[AC]"[^>]*>[\s\S]*?</aside>\n?')`;
