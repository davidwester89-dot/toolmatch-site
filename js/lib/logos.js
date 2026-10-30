// Logo's van de aanbieders: het officiële merkicoon van hun eigen site (bron per logo in scripts/logo-bronnen.md).
// Neutraal: elke aanbieder krijgt precies hetzelfde vak, partner of niet. Logo's tellen nooit mee in de match of de volgorde.
// Ook in de browser gebruikt (keuzehulp.js), daarom zonder Node-imports.

/** Geen logo: de merkrichtlijn van de maker staat logogebruik alleen toe met licentie, toestemming of partnerovereenkomst,
 *  of stelt eisen waar een klein tabel-icoon niet aan voldoet (bv. minimummaat). Zie scripts/logo-bronnen.md (SC 30-10).
 *  Deze tools krijgen de neutrale letter in hetzelfde vak. */
export const ZONDER_LOGO = new Set([
  'acuity', 'canva', 'chatgpt', 'claude', 'copilot', 'gemini', 'googlecloudtranslate', 'hostinger', 'hubspot', 'intercom', 'lechat', 'lookerstudio', 'make', 'n8n', 'pipedrive', 'powerautomate', 'powerbi', 'wordpress', 'zapier', 'zoho',
]);

/** tool-id -> merknaam (het merk van het getoonde logo; alleen voor de bronnenlijst en tests). */
export const LOGOS = {
  albacross: 'Albacross', leadfeeder: 'Leadfeeder', leadinfo: 'Leadinfo', amberscript: 'Amberscript', buffer: 'Buffer', calcom: 'Cal.com', calendly: 'Calendly',
  deepl: 'DeepL', fireflies: 'Fireflies.ai',
  hootsuite: 'Hootsuite',
  jouwweb: 'JouwWeb',
  metricool: 'Metricool', notta: 'Notta', notuly: 'Notuly', otter: 'Otter.ai',
  pitch: 'Pitch', simplybook: 'SimplyBook.me', tidio: 'Tidio',
  tldv: 'tl;dv', trengo: 'Trengo', wix: 'Wix',
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Vast vak (width/height in de HTML, geen layoutverschuiving), lazy. Decoratief: de naam staat ernaast, dus alt="" en aria-hidden.
 *  Geen logo: neutrale letter in hetzelfde vak. */
export function logoImg(id, { px = 24, naam = '' } = {}) {
  const merk = LOGOS[id];
  if (!merk) return `<span class="tlogo tlogo-f" style="width:${px}px;height:${px}px" aria-hidden="true">${esc((naam || id).charAt(0).toUpperCase())}</span>`;
  return `<img class="tlogo" src="/logos/${id}.webp" alt="" aria-hidden="true" width="${px}" height="${px}" loading="lazy" decoding="async">`;
}
