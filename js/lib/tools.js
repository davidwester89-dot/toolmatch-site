// Tools in de keuzehulp. Alleen feiten van de eigen site van de aanbieder, met bron en controledatum.
// Weten we iets niet zeker, dan staat het op null ("niet gecontroleerd") en telt het niet als pluspunt.
// 'instap' is onze eigen indeling (eenvoudig / gemiddeld / technisch), uitgelegd op /keuzehulp/.
// Dit bestand bevat GEEN partnerlinks: die staan alleen in partnerlinks.js en tellen nooit mee.
export const GECONTROLEERD = '2026-10-20';

export const DOELEN = {
  schrijven: 'Teksten schrijven',
  notuleren: 'Vergaderen en notuleren',
  klantcontact: 'Klantcontact en chatbot',
  automatiseren: 'Werk automatiseren',
  beeld: 'Beeld en design',
  data: 'Data en analyse',
};

/**
 * prijs: tekst zoals de aanbieder hem vermeldt (goedkoopste betaalde abonnement).
 *   Alleen euro's: staat er voor Nederland geen europrijs die we konden nalezen, dan noemen we het pakket zonder bedrag.
 * prijsMaand: bedrag per maand als getal, alleen voor de budgetvraag (wordt niet getoond). Zonder europrijs: het getal
 *   van de prijspagina zoals eerder gecontroleerd, niet omgerekend.
 * prijsPer: 'gebruiker' of 'team' (vast bedrag voor een team).
 * gratis: is er een gratis versie (geen proefperiode)?
 * eu: 'ja' = de aanbieder zegt dat gegevens standaard in de EU staan; 'deels' = grotendeels; null = niet gecontroleerd.
 * team: is er een abonnement voor meerdere gebruikers?
 */
export const TOOLS = [
  { id: 'chatgpt', naam: 'ChatGPT', vendor: 'OpenAI', url: 'https://chatgpt.com/', doelen: ['schrijven', 'data', 'beeld'],
    wat: 'Algemene AI-assistent van OpenAI voor tekst, samenvatten, data-analyse en afbeeldingen.',
    gratis: true, prijs: 'Plus (het bedrag zie je op de prijspagina van OpenAI)', prijsMaand: 20, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: 'Je kunt uitzetten dat je gesprekken worden gebruikt om modellen te trainen (Data Controls).',
    bronnen: [['ChatGPT Pricing', 'https://chatgpt.com/pricing'], ['OpenAI Help: What is ChatGPT Plus?', 'https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus']] },
  { id: 'lechat', naam: 'Le Chat (Mistral AI)', vendor: 'Mistral AI', url: 'https://mistral.ai/', doelen: ['schrijven', 'beeld'],
    wat: 'AI-assistent van het Franse Mistral AI voor tekst, zoeken en eenvoudige afbeeldingen.',
    gratis: true, prijs: 'Pro; Team per gebruiker (het bedrag zie je op de prijspagina van Mistral AI)', prijsMaand: 14.99, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: 'ja', privacy: 'Gegevens staan standaard in de EU; bij sommige functies kunnen ze tijdelijk naar subverwerkers buiten de EU gaan.',
    bronnen: [['Mistral AI Pricing', 'https://mistral.ai/pricing'], ['Mistral Help: Where do you store my data?', 'https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data']] },
  { id: 'deepl', naam: 'DeepL', url: 'https://www.deepl.com/', doelen: ['schrijven'],
    wat: 'Vertalen en teksten verbeteren (DeepL Write), ook in je browser en Google Docs.',
    gratis: true, prijs: 'Individual: €7,49 per maand bij jaarbetaling (incl. btw)', prijsMaand: 7.49, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: null, privacy: 'Bij betaalde abonnementen wordt je tekst niet gebruikt om de AI van DeepL te trainen.',
    bronnen: [['DeepL Pro (Nederlandse prijspagina)', 'https://www.deepl.com/nl/pro'], ['DeepL Pro', 'https://www.deepl.com/en/pro']] },
  { id: 'amberscript', naam: 'Amberscript', url: 'https://www.amberscript.com/', doelen: ['notuleren'],
    wat: 'Opnames en gesprekken laten uitschrijven, automatisch of nagekeken door mensen.',
    gratis: false, prijs: 'Starter: €19 per maand voor 5 uur (Pro: €29 per maand voor 10 uur)', prijsMaand: 19, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: 'ja', privacy: 'Opslag op servers in de EU; verwerkersovereenkomst (DPA) en NDA mogelijk.',
    bronnen: [['Amberscript Pricing', 'https://www.amberscript.com/en/pricing/']] },
  { id: 'tldv', naam: 'tl;dv', url: 'https://tldv.io/', doelen: ['notuleren'],
    wat: 'Neemt online meetings op en maakt er notities en samenvattingen van.',
    gratis: true, prijs: 'Pro: €18 per gebruiker per maand bij jaarbetaling (€29 maandelijks)', prijsMaand: 18, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: null, privacy: null,
    bronnen: [['tl;dv Pricing', 'https://tldv.io/pricing/']] },
  { id: 'fireflies', naam: 'Fireflies.ai', url: 'https://fireflies.ai/', doelen: ['notuleren'],
    wat: 'Notulist voor Zoom, Google Meet en Teams met samenvattingen en zoeken in gesprekken.',
    gratis: true, prijs: null, prijsMaand: null, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: null, privacy: 'Volgens de aanbieder worden je gegevens niet gebruikt om AI te trainen. Engels is de hoofdtaal; andere talen zijn in bèta.',
    bronnen: [['Fireflies Pricing', 'https://fireflies.ai/pricing']] },
  { id: 'trengo', naam: 'Trengo', url: 'https://trengo.com/', doelen: ['klantcontact'],
    wat: 'Eén inbox voor mail, WhatsApp, chat en social, met AI-antwoorden en automatisering.',
    gratis: false, prijs: 'Boost: €299 per maand bij jaarbetaling, 10 gebruikers inbegrepen', prijsMaand: 299, prijsPer: 'team', team: true, instap: 'gemiddeld',
    eu: null, privacy: null,
    bronnen: [['Trengo Pricing', 'https://trengo.com/pricing']] },
  { id: 'tidio', naam: 'Tidio', url: 'https://www.tidio.com/', doelen: ['klantcontact'],
    wat: 'Livechat en AI-chatbot (Lyro) voor je website of webshop.',
    gratis: true, prijs: 'Starter (het bedrag zie je op de prijspagina van Tidio)', prijsMaand: 24.17, prijsPer: 'team', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: 'deels', privacy: 'Gegevens worden vooral binnen de EER verwerkt; het contract loopt via een Amerikaanse entiteit.',
    bronnen: [['Tidio Pricing', 'https://www.tidio.com/pricing/'], ['Tidio Privacy Policy', 'https://www.tidio.com/privacy-policy/']] },
  { id: 'intercom', naam: 'Intercom', url: 'https://www.intercom.com/', doelen: ['klantcontact'],
    wat: 'Klantenservice-platform met inbox, helpcenter en AI-agent Fin.',
    gratis: false, prijs: 'Essential: per gebruiker per maand, plus een bedrag per opgeloste Fin-vraag (de bedragen zie je op de prijspagina van Intercom)', prijsMaand: 29, prijsPer: 'gebruiker', team: true, instap: 'gemiddeld', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Intercom Pricing', 'https://www.intercom.com/pricing']] },
  { id: 'zapier', naam: 'Zapier', url: 'https://zapier.com/', doelen: ['automatiseren'],
    wat: 'Koppelt duizenden apps zodat terugkerend werk vanzelf gaat, zonder programmeren.',
    gratis: true, prijs: 'Professional, met 750 taken (het bedrag zie je op de prijspagina van Zapier)', prijsMaand: 19.99, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Zapier Pricing', 'https://zapier.com/pricing']] },
  { id: 'make', naam: 'Make', url: 'https://www.make.com/', doelen: ['automatiseren'],
    wat: 'Visuele bouwer voor automatiseringen met veel controle over elke stap.',
    gratis: true, prijs: null, prijsMaand: null, prijsPer: 'team', team: true, instap: 'gemiddeld',
    eu: null, privacy: null,
    bronnen: [['Make Pricing', 'https://www.make.com/en/pricing'], ['Make vs Zapier (Make)', 'https://www.make.com/en/compare/make-vs-zapier']] },
  { id: 'n8n', naam: 'n8n', url: 'https://n8n.io/', doelen: ['automatiseren'],
    wat: 'Automatiseren met AI-agents en code-stappen; ook zelf te hosten (Community Edition).',
    gratis: false, prijs: 'Starter: €20 per maand bij jaarbetaling', prijsMaand: 20, prijsPer: 'team', team: true, instap: 'technisch',
    eu: 'ja', privacy: 'Bij hosting door n8n staan gegevens in de EU (Frankfurt). Zelf hosten kan ook.',
    bronnen: [['n8n Pricing', 'https://n8n.io/pricing/']] },
  { id: 'canva', naam: 'Canva', url: 'https://www.canva.com/', doelen: ['beeld'],
    wat: 'Ontwerpen voor social media, presentaties en drukwerk, met AI-functies.',
    gratis: true, prijs: 'Pro, per jaar voor één persoon (het bedrag zie je op de prijspagina van Canva)', prijsMaand: 12, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Canva Pricing', 'https://www.canva.com/pricing/']] },
  { id: 'lookerstudio', naam: 'Looker Studio', vendor: 'Google', url: 'https://lookerstudio.google.com/', doelen: ['data'],
    wat: 'Gratis dashboards en rapporten van Google, bijvoorbeeld op basis van Sheets of Analytics.',
    gratis: true, prijs: 'Pro, per gebruiker per project per maand (het bedrag zie je op de prijspagina van Google)', prijsMaand: 9, prijsPer: 'gebruiker', team: true, instap: 'gemiddeld', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Google Cloud: Looker Studio', 'https://cloud.google.com/looker-studio']] },
  { id: 'powerbi', naam: 'Power BI', vendor: 'Microsoft', url: 'https://www.microsoft.com/nl-nl/power-platform/products/power-bi', doelen: ['data'],
    wat: 'Rapporten en dashboards van Microsoft; Power BI Desktop is gratis te downloaden.',
    gratis: true, prijs: 'Pro: €12,10 per gebruiker per maand bij jaarbetaling (excl. btw)', prijsMaand: 12.1, prijsPer: 'gebruiker', team: true, instap: 'gemiddeld',
    eu: null, privacy: null,
    bronnen: [['Microsoft: Prijzen voor Power BI', 'https://www.microsoft.com/nl-nl/power-platform/products/power-bi/pricing']] },  // ---- toegevoegd voor de categoriepagina's (fase 2) ----
  { id: 'copilot', naam: 'Copilot Business', vendor: 'Microsoft', url: 'https://www.microsoft.com/nl-nl/microsoft-365/copilot/business', doelen: ['schrijven', 'data'],
    wat: 'AI-assistent in Word, Excel, PowerPoint, Outlook en Teams, voor bedrijven die al in Microsoft 365 werken.',
    gratis: null, prijs: 'Copilot Business: €18,20 per gebruiker per maand bij jaarbetaling (excl. btw); bij aanschaf tot en met 31-12-2026 actieprijs €15,60 voor het eerste jaar. Invoegtoepassing bij een geschikt Microsoft 365 Business-abonnement', prijsMaand: 18.2, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: null, dpa: 'ja', privacy: 'Volgens Microsoft worden prompts en antwoorden niet gebruikt om de taalmodellen te trainen; het Microsoft-addendum voor gegevensbescherming (DPA) is van toepassing.',
    bronnen: [['Microsoft: Copilot voor kleine bedrijven', 'https://www.microsoft.com/nl-nl/microsoft-365/copilot/business']] },
  { id: 'gemini', naam: 'Gemini in Google Workspace', vendor: 'Google', url: 'https://workspace.google.com/intl/nl/', doelen: ['schrijven'],
    wat: 'Gemini als onderdeel van Google Workspace: vanaf Business Starter in Gmail en als chat, vanaf Business Standard (€16,20 per gebruiker per maand, met een contract van 1 jaar €13,60) ook in Documenten en Meet.',
    gratis: null, prijs: 'Workspace Business Starter: €8,10 per gebruiker per maand; met een contract van 1 jaar €6,80 (NL-pagina van de aanbieder, bekeken op 26 oktober 2026)', prijsMaand: 8.1, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: null, privacy: null,
    bronnen: [['Google Workspace voor bedrijven: abonnementen (NL-pagina van de aanbieder)', 'https://workspace.google.com/intl/nl/business/'], ['Google Workspace: prijzen', 'https://workspace.google.com/intl/nl/pricing']] },
  { id: 'claude', naam: 'Claude (Anthropic)', vendor: 'Anthropic', url: 'https://claude.com/', doelen: ['schrijven'],
    wat: 'AI-assistent van Anthropic voor schrijven, samenvatten en werken met lange documenten.',
    gratis: true, prijs: 'Pro; Team per gebruiker (het bedrag zie je op de prijspagina van Anthropic)', prijsMaand: 17, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: 'Bij de abonnementen voor particulieren (Free, Pro, Max) kun je modeltraining op je gesprekken uitzetten (opt-out). Bij de zakelijke abonnementen traint Anthropic volgens de prijspagina standaard niet op je inhoud.',
    bronnen: [['Claude Pricing', 'https://claude.com/pricing']] },
  { id: 'notta', naam: 'Notta', url: 'https://www.notta.ai/', doelen: ['notuleren'],
    wat: 'Meetings en opnames uitschrijven en samenvatten, met optionele vertaling.',
    gratis: true, prijs: 'Pro: €7 per maand bij jaarbetaling, €83,99 per jaar (NL-pagina van de aanbieder, bekeken op 26 oktober 2026)', prijsMaand: 7, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: null, privacy: null,
    bronnen: [['Notta: prijzen (NL-pagina van de aanbieder)', 'https://www.notta.ai/nl/pricing'], ['Notta Pricing', 'https://notta.ai/en/pricing']] },
  { id: 'otter', naam: 'Otter.ai', url: 'https://otter.ai/', doelen: ['notuleren'],
    wat: 'Notulist voor online meetings met live transcriptie en samenvattingen.',
    gratis: true, prijs: 'Pro, per gebruiker per maand (het bedrag zie je op de prijspagina van Otter.ai)', prijsMaand: 8.33, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Otter.ai Pricing', 'https://otter.ai/pricing']] },
  { id: 'pitch', naam: 'Pitch', url: 'https://pitch.com/', doelen: ['beeld'],
    wat: 'Presentaties maken en delen, met AI-hulp en samenwerken in een team.',
    gratis: true, prijs: 'Plus: €10 per maand bij jaarbetaling', prijsMaand: 10, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig',
    eu: null, privacy: null,
    bronnen: [['Pitch Pricing', 'https://pitch.com/pricing']] },
  { id: 'hubspot', naam: 'HubSpot CRM', vendor: 'HubSpot', url: 'https://www.hubspot.com/products/crm', doelen: [],
    wat: 'CRM met een gratis basis voor contacten, deals en taken, uit te breiden met betaalde onderdelen.',
    gratis: true, prijs: 'Starter, per gebruiker per maand (het bedrag zie je op de prijspagina van HubSpot)', prijsMaand: 15, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['HubSpot CRM', 'https://www.hubspot.com/products/crm']] },
  { id: 'pipedrive', naam: 'Pipedrive', url: 'https://www.pipedrive.com/', doelen: [],
    wat: 'CRM rond je verkoopkansen: je ziet al je deals in een pipeline. Proefperiode van 14 dagen.',
    gratis: null, prijs: 'Lite, per gebruiker per maand (het bedrag zie je op de prijspagina van Pipedrive)', prijsMaand: 14, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Pipedrive Pricing', 'https://www.pipedrive.com/en/pricing']] },
  { id: 'zoho', naam: 'Zoho CRM', vendor: 'Zoho', url: 'https://www.zoho.com/crm/', doelen: [],
    wat: 'Uitgebreid CRM met een gratis versie voor kleine teams.',
    gratis: true, prijs: 'Gratis voor maximaal 3 gebruikers (prijzen van de betaalde edities niet gecontroleerd)', prijsMaand: 0, prijsPer: 'team', team: true, instap: 'gemiddeld',
    eu: null, privacy: null,
    bronnen: [['Zoho CRM Pricing', 'https://www.zoho.com/crm/zohocrm-pricing.html']] },
  { id: 'calendly', naam: 'Calendly', url: 'https://calendly.com/', doelen: [],
    wat: 'Klanten kiezen zelf een tijd in je agenda via een boekingspagina.',
    gratis: true, prijs: 'Standard, per gebruiker per maand (het bedrag zie je op de prijspagina van Calendly)', prijsMaand: 10, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Calendly Pricing', 'https://calendly.com/pricing']] },
  { id: 'calcom', naam: 'Cal.com', url: 'https://cal.com/', doelen: [],
    wat: 'Afsprakenplanner met een gratis versie voor één persoon en plannen voor teams.',
    gratis: true, prijs: 'Teams, per gebruiker per maand (het bedrag zie je op de prijspagina van Cal.com)', prijsMaand: 12, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Cal.com Pricing', 'https://cal.com/pricing']] },
  { id: 'simplybook', naam: 'SimplyBook.me', url: 'https://simplybook.me/', doelen: [],
    wat: 'Boekingssysteem met een eigen boekingswebsite; in hogere plannen ook betalingen en aanbetalingen.',
    gratis: true, prijs: 'Basic; betalingen en aanbetalingen vanaf Standard (de bedragen zie je op de prijspagina van SimplyBook.me)', prijsMaand: 11.9, prijsPer: 'team', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['SimplyBook.me Pricing', 'https://simplybook.me/en/pricing']] },
  { id: 'acuity', naam: 'Acuity Scheduling', url: 'https://acuityscheduling.com/', doelen: [],
    wat: 'Afspraken plannen voor dienstverleners, met intakeformulieren en herinneringen per mail. Proefperiode van 7 dagen.',
    gratis: null, prijs: 'Starter (het bedrag zie je op de prijspagina van Acuity Scheduling)', prijsMaand: 16, prijsPer: 'team', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Acuity Scheduling Pricing', 'https://acuityscheduling.com/pricing']] },
  { id: 'buffer', naam: 'Buffer', url: 'https://buffer.com/', doelen: [],
    wat: 'Posts vooruit inplannen voor onder meer LinkedIn, Instagram en Facebook.',
    gratis: true, prijs: 'Essentials, per kanaal per maand (het bedrag zie je op de prijspagina van Buffer)', prijsMaand: 5, prijsPer: 'gebruiker', team: true, instap: 'eenvoudig', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Buffer Pricing', 'https://buffer.com/pricing']] },
  { id: 'metricool', naam: 'Metricool', url: 'https://metricool.com/', doelen: [],
    wat: 'Social media plannen en analyseren. De gratis versie is voor één merk, zonder LinkedIn en X (Twitter).',
    gratis: true, prijs: 'Starter: vanaf €16 per maand bij jaarbetaling', prijsMaand: 16, prijsPer: 'team', team: true, instap: 'eenvoudig',
    eu: null, privacy: null,
    bronnen: [['Metricool Pricing', 'https://metricool.com/pricing/']] },
  { id: 'hootsuite', naam: 'Hootsuite', url: 'https://www.hootsuite.com/', doelen: [],
    wat: 'Uitgebreide social media planner met een social inbox en analyses, vooral voor teams. Gratis proefperiode.',
    gratis: null, prijs: 'Standard (het bedrag zie je op de prijspagina van Hootsuite)', prijsMaand: 99, prijsPer: 'team', team: true, instap: 'gemiddeld', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Hootsuite Plans', 'https://www.hootsuite.com/plans']] },
  { id: 'googlecloudtranslate', naam: 'Google Cloud Translation', vendor: 'Google', url: 'https://cloud.google.com/translate', doelen: [],
    wat: 'Vertaal-API van Google om teksten en documenten vanuit je eigen software of website te laten vertalen.',
    gratis: true, prijs: 'Eerste 500.000 tekens per maand gratis; daarboven betaal je per miljoen tekens (de bedragen zie je op de prijspagina van Google Cloud)', prijsMaand: 0, prijsPer: 'team', team: true, instap: 'technisch', // intern budgetgetal, niet tonen; geen officiële europrijs
    eu: null, privacy: null,
    bronnen: [['Google Cloud: Translation pricing', 'https://cloud.google.com/translate/pricing']] },
  { id: 'powerautomate', naam: 'Power Automate', vendor: 'Microsoft', url: 'https://www.microsoft.com/nl-nl/power-platform/products/power-automate', doelen: ['automatiseren'],
    wat: 'Automatiseren van Microsoft: cloudstromen tussen apps en, met Premium, ook desktopstromen op je pc. Gratis proefversie van 30 dagen.',
    gratis: null, prijs: 'Premium: €13,00 per gebruiker per maand bij jaarbetaling (excl. btw)', prijsMaand: 13, prijsPer: 'gebruiker', team: true, instap: 'gemiddeld',
    eu: null, privacy: null,
    bronnen: [['Microsoft: Prijzen voor Power Automate', 'https://www.microsoft.com/nl-nl/power-platform/products/power-automate/pricing']] },
];
