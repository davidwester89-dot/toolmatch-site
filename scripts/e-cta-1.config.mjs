// E-CTA-1 golf 1 – ToolMatch: pagina → betaalde partners (config voor scripts/e-cta.mjs, toegepast door scripts/e-cta-apply.mjs
// aan het eind van scripts/build.py).
// Bron: PM-partnerkaart /workspace/plannen/e-cta-1/partnerkaart-toolmatch.md (17-11-2026).
// Alleen /online-afspraken-plannen/ (Cal.com + SimplyBook.me) en /ai-website-maken/ (Hostinger + Wix wsb) hebben ≥ 2
// betaalde partners in het onderwerp; alle andere kaartpagina's: ALLEEN KEUZEHULP.
// Reflinks: één veld per partner (hier gekoppeld aan js/lib/partnerlinks.js). Leeg = partner valt weg; een reflink
// invullen activeert hem zonder copywijziging. Volgorde = paginavolgorde van de tools (alfabetisch), nooit op commissie.
// subID: alleen Daisycon ws= (Hostinger, tm-<slug>-top|eind). Direct (Make, Cal.com, Metricool, SimplyBook, Trengo),
// impact (Wix) en impact Advocate (Gemini): bewust leeg (subid: false), notatie onbekend; niet zelf verzinnen.
import { PARTNERLINKS, PARTNERLINKS_PAGINA, PARTNERLINKS_ZELFDE_TAB, PARTNER_NOOT } from '../js/lib/partnerlinks.js';
import { TOOLS } from '../js/lib/tools.js';

// Knoppen volgen de bestaande ToolMatch-conventie (test/fase2.test.js: label-in-name; test/site.test.js: p.pnoot na
// elke partnerlink): data-cta="partner", tekst "Naar de site van …", aria-label met nieuw-tabblad-melding.
const TOOL = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
function naarDeSite(partner) {
  const t = TOOL[partner.vendor];
  if (!t) return `Naar de site van ${partner.naam}`;
  const v = t.vendor || t.naam;
  const prod = t.naam.replace(` (${v})`, '');
  return prod.startsWith(v + ' ') ? `Naar de site van ${prod}` : `Naar de site van ${v}${t.vendor && prod !== v ? ` (${prod})` : ''}`;
}

const KEUZEHULP = { partners: [] };
const p = (...ids) => ({ partners: ids });

export const ECTA = {
  site: 'tm',
  pmKaart: '/workspace/plannen/e-cta-1/partnerkaart-toolmatch.md',
  ankerA: 'h2',
  ankersC: ['<h2 id="verder-lezen"', '<h2 id="faq"', '<h2 id="bronnen"', '<p class="note"'],
  knop: {
    dataCta: 'partner',
    cIntro: 'Of direct:',
    tekst: naarDeSite,
    aria: (partner) => naarDeSite(partner) + (partner.zelfdeTab ? '' : ' (opent in een nieuw tabblad)'),
  },
  noot: `<p class="pnoot">${PARTNER_NOOT}</p>`,
  keuzehulp: { href: '/keuzehulp/', tekst: 'Doe de keuzehulp' },
  vergelijker: { href: '/vergelijken/', tekst: 'Bekijk de vergelijkingen' },
  partners: {
    calcom: { naam: 'Cal.com', reflink: PARTNERLINKS.calcom, subid: false },
    simplybook: { naam: 'SimplyBook.me', reflink: PARTNERLINKS.simplybook, subid: false },
    hostinger: { naam: 'Hostinger', reflink: PARTNERLINKS_PAGINA.hostinger, subid: { param: 'ws', waarde: '{site}-{slug}-{pos}' } },
    wixWsb: { naam: 'Wix', vendor: 'wix', reflink: PARTNERLINKS_PAGINA.wix, subid: false },
    make: { naam: 'Make', reflink: PARTNERLINKS.make, subid: false },
    metricool: { naam: 'Metricool', reflink: PARTNERLINKS.metricool, subid: false },
    gemini: { naam: 'Gemini in Google Workspace', reflink: PARTNERLINKS.gemini, subid: false, zelfdeTab: PARTNERLINKS_ZELFDE_TAB.includes('gemini') },
    trengo: { naam: 'Trengo', reflink: PARTNERLINKS.trengo, subid: false },
  },
  pages: {
    // Categorie
    '/online-afspraken-plannen/': p('calcom', 'simplybook'),
    '/ai-website-maken/': p('hostinger', 'wixWsb'),
    '/ai-assistenten/': KEUZEHULP,
    '/ai-tekst-schrijven/': KEUZEHULP,
    '/ai-mail-en-offertes/': KEUZEHULP,
    '/ai-notuleren/': KEUZEHULP,
    '/crm-klein-bedrijf/': KEUZEHULP,
    '/ai-afbeeldingen-en-ontwerp/': KEUZEHULP,
    '/social-media-inplannen/': KEUZEHULP,
    '/automatiseren-zonder-code/': KEUZEHULP,
    '/ai-chatbot-website/': KEUZEHULP,
    '/ai-data-analyse/': KEUZEHULP,
    '/ai-vertalen/': KEUZEHULP,
    '/websitebezoekers-herkennen/': KEUZEHULP,
    '/ai-presentatie-maken/': KEUZEHULP,
    '/boekingssysteem-salon/': KEUZEHULP, // niet op de kaart (nieuwe pagina 19-11): voorlopig alleen keuzehulp
    // Vergelijken
    '/vergelijken/': KEUZEHULP,
    '/vergelijken/chatgpt-vs-copilot/': KEUZEHULP,
    '/vergelijken/chatgpt-vs-gemini/': KEUZEHULP,
    '/vergelijken/chatgpt-vs-claude/': KEUZEHULP,
    '/vergelijken/zapier-vs-make-vs-n8n/': KEUZEHULP,
    // Gidsen
    '/gids/': KEUZEHULP,
    '/gids/ai-gebruiken-in-je-bedrijf/': KEUZEHULP,
    '/gids/ai-veilig-gebruiken/': KEUZEHULP,
    '/gids/ai-act-ondernemers/': KEUZEHULP,
    '/gids/ai-beleid-opstellen/': KEUZEHULP,
    '/gids/wat-kosten-ai-abonnementen/': KEUZEHULP,
    '/gids/prompts-voor-ondernemers/': KEUZEHULP,
    '/gids/canva-voor-ondernemers/': KEUZEHULP,
  },
};
