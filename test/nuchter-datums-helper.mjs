// Onafhankelijke verwachting voor de stijlrelease van 18 november 2026.
export const STIJL_PADEN = new Set([
  "/ai-afbeeldingen-en-ontwerp/",
  "/ai-assistenten/",
  "/ai-chatbot-website/",
  "/ai-data-analyse/",
  "/ai-mail-en-offertes/",
  "/ai-notuleren/",
  "/ai-presentatie-maken/",
  "/ai-tekst-schrijven/",
  "/ai-vertalen/",
  "/ai-website-maken/",
  "/automatiseren-zonder-code/",
  "/gids/",
  "/gids/ai-act-ondernemers/",
  "/gids/ai-beleid-opstellen/",
  "/gids/ai-gebruiken-in-je-bedrijf/",
  "/gids/ai-veilig-gebruiken/",
  "/gids/canva-voor-ondernemers/",
  "/keuzehulp/",
  "/online-afspraken-plannen/",
  "/vergelijken/",
  "/vergelijken/chatgpt-vs-claude/",
  "/vergelijken/chatgpt-vs-copilot/",
  "/websitebezoekers-herkennen/"
]);
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-18' : vorige;

const STIJL_REGELS = new Map([
  [
    "    eu: null, privacy: 'Volgens de aanbieder worden je gegevens niet gebruikt om AI te trainen. Engels is de hoofdtaal; andere talen zijn in bèta.',",
    "    eu: null, privacy: 'Je gegevens worden niet gebruikt om AI te trainen. Engels is de hoofdtaal; andere talen zijn in bèta.',"
  ],
  [
    "    eu: null, dpa: 'ja', privacy: 'Volgens Microsoft worden prompts en antwoorden niet gebruikt om de taalmodellen te trainen; het Microsoft-addendum voor gegevensbescherming (DPA) is van toepassing.',",
    "    eu: null, dpa: 'ja', privacy: 'Prompts en antwoorden worden niet gebruikt om de taalmodellen te trainen; het Microsoft-addendum voor gegevensbescherming (DPA) is van toepassing.',"
  ],
  [
    "    eu: null, privacy: 'Bij de abonnementen voor particulieren (Free, Pro, Max) kun je modeltraining op je gesprekken uitzetten (opt-out). Bij de zakelijke abonnementen traint Anthropic volgens de prijspagina standaard niet op je inhoud.',",
    "    eu: null, privacy: 'Bij de abonnementen voor particulieren (Free, Pro, Max) kun je modeltraining op je gesprekken uitzetten (opt-out). Bij de zakelijke abonnementen traint Anthropic standaard niet op je inhoud.',"
  ],
  [
    "    if (tool.eu === 'ja') { score += 2; plus.push('Gegevens staan volgens de aanbieder in de EU'); }",
    "    if (tool.eu === 'ja') { score += 2; plus.push('Gegevens staan in de EU'); }"
  ],
  [
    "    else if (tool.eu === 'deels') { score += 1; plus.push('Gegevens worden volgens de aanbieder vooral in de EU verwerkt'); }",
    "    else if (tool.eu === 'deels') { score += 1; plus.push('Gegevens worden vooral in de EU verwerkt'); }"
  ]
]);
export const normaliseerStijl = (code) => code.split('\n').map((regel) => STIJL_REGELS.get(regel) || regel).join('\n');
