// Logo's van de aanbieders: het officiële merkicoon van hun eigen site (bron per logo in scripts/logo-bronnen.md).
// Neutraal: elke aanbieder krijgt precies hetzelfde vak, partner of niet. Logo's tellen nooit mee in de match of de volgorde.
// Ook in de browser gebruikt (keuzehulp.js), daarom zonder Node-imports.

/** tool-id -> merknaam in de alt-tekst (het merk van het getoonde logo). */
export const LOGOS = {
  acuity: 'Acuity Scheduling', albacross: 'Albacross', leadfeeder: 'Leadfeeder', leadinfo: 'Leadinfo', amberscript: 'Amberscript', buffer: 'Buffer', calcom: 'Cal.com', calendly: 'Calendly',
  canva: 'Canva', chatgpt: 'ChatGPT', claude: 'Claude', copilot: 'Microsoft', deepl: 'DeepL', fireflies: 'Fireflies.ai',
  gemini: 'Gemini', googlecloudtranslate: 'Google Cloud', hootsuite: 'Hootsuite', hostinger: 'Hostinger', hubspot: 'HubSpot',
  intercom: 'Intercom', jouwweb: 'JouwWeb', lechat: 'Mistral AI', lookerstudio: 'Looker Studio', make: 'Make',
  metricool: 'Metricool', n8n: 'n8n', notta: 'Notta', notuly: 'Notuly', otter: 'Otter.ai', pipedrive: 'Pipedrive',
  pitch: 'Pitch', powerautomate: 'Microsoft', powerbi: 'Microsoft', simplybook: 'SimplyBook.me', tidio: 'Tidio',
  tldv: 'tl;dv', trengo: 'Trengo', wix: 'Wix', wordpress: 'WordPress', zapier: 'Zapier', zoho: 'Zoho',
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Vast vak (width/height in de HTML, geen layoutverschuiving), lazy. Geen logo bekend: neutrale letter in hetzelfde vak. */
export function logoImg(id, { px = 24, naam = '' } = {}) {
  const merk = LOGOS[id];
  if (!merk) return `<span class="tlogo tlogo-f" style="width:${px}px;height:${px}px" aria-hidden="true">${esc((naam || id).charAt(0).toUpperCase())}</span>`;
  return `<img class="tlogo" src="/logos/${id}.webp" alt="${esc(merk)} logo" width="${px}" height="${px}" loading="lazy" decoding="async">`;
}
