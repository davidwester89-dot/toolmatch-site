# Nieuwe pagina 3-11-2026: /ai-presentatie-maken/ (briefing SEO wk45). Wordt uitgevoerd door build.py (na website_leads.py).
# Alleen tools die al op TM staan: Canva, Microsoft Copilot, Google Gemini (Gamma niet: nieuwe aanbieder = eerst MM-OK).
# Bedragen letterlijk van de eigen NL-pagina's, gerenderd op 2-11-2026 vanaf een NL-IP (maand-/jaarschakelaars met Playwright):
# site-checks/2026-11-02/wk45/src/canva_pricing.txt + canva_maand.txt, ms_m365_compare.txt, ms_copilot_biz.txt + ms_copilot_biz_maand.txt,
# gw_pricing.txt + gw_pricing_maand.txt. Maandprijs eerst (L1). Geen actieprijzen: Copilot-korting en Workspace-introductieprijs weggelaten (L4).
# Bronnen: alleen naam + link, zonder datum (huisregel briefing wk45). Geen partnerlinks (PARTNERLINKS heeft geen Canva/Copilot/Gemini).
PRES='/ai-presentatie-maken/'
PRES_UPD='2026-11-03'
PRES_PAD={PRES:PRES_UPD,'/ai-afbeeldingen-en-ontwerp/':PRES_UPD}  # nieuwe pagina + link terug (zichtbare wijziging, L7)
P_CANVA=('Canva: Abonnementen en prijzen','https://www.canva.com/nl_nl/abonnementen/')
P_CANVA_PRES=('Canva: Presentaties','https://www.canva.com/nl_nl/presentaties/')
P_CANVA_HELP=('Canva Helpcentrum: Maak een presentatie met Canva AI','https://www.canva.com/nl_nl/help/using-magic-presentations/')
P_CANVA_AI=('Canva Helpcentrum: Aan de slag met Canva AI','https://www.canva.com/nl_nl/help/using-canva-ai/')
P_M365=('Microsoft 365: abonnementen vergelijken','https://www.microsoft.com/nl-nl/microsoft-365/buy/compare-all-microsoft-365-products')
P_COP=('Microsoft: Copilot voor bedrijven','https://www.microsoft.com/nl-nl/microsoft-365/copilot/business')
P_COP_FAQ=('Microsoft Ondersteuning: Veelgestelde vragen over Copilot in PowerPoint','https://support.microsoft.com/nl-nl/powerpoint/frequently-asked-questions-about-copilot-in-powerpoint')
P_COP_TAAL=('Microsoft Ondersteuning: Ondersteunde talen voor Microsoft 365 Copilot','https://support.microsoft.com/nl-nl/microsoft-365-copilot/supported-languages-for-microsoft-365-copilot')
P_GW=('Google Workspace: prijzen','https://workspace.google.com/intl/nl/pricing')
P_GW_SL=('Google Workspace: Presentaties','https://workspace.google.com/intl/nl/products/slides/')
P_GW_HELP=('Google Help: Samenwerken met Gemini in Google Presentaties','https://support.google.com/docs/answer/14355071?hl=nl')
P_GW_TAAL=('Google Help: Ondersteunde talen voor Google Workspace met Gemini','https://support.google.com/docs/answer/14925782?hl=nl')
PRES_SRC=[P_CANVA,P_CANVA_PRES,P_CANVA_HELP,P_CANVA_AI,P_M365,P_COP,P_COP_FAQ,P_COP_TAAL,P_GW,P_GW_SL,P_GW_HELP,P_GW_TAAL]
def pres_bronnen(srcs):
    return '      <h2 id="bronnen">Bronnen</h2>\n      <ul class="bronnen">\n'+''.join(f'        <li>{X(u,E(n))}</li>\n' for n,u in srcs)+'      </ul>\n'
def pres_tabel(rows):
    cols=[('canva','Canva'),('copilot','Microsoft Copilot'),('gemini','Google Gemini')]
    th=''.join(f'<th scope="col">{LG(i)}{E(n)}</th>' for i,n in cols)
    tr=''.join('          <tr><th scope="row">'+r[0]+'</th>'+''.join(f'<td>{x}</td>' for x in r[1:])+'</tr>\n' for r in rows)
    return f'''      <div class="tbl" role="region" aria-label="AI-presentatietools naast elkaar" tabindex="0">
        <table class="vs">
          <thead><tr><th scope="col">Op alfabet</th>{th}</tr></thead>
          <tbody>
{tr}          </tbody>
        </table>
      </div>
'''
PRES_FAQ=[
 ('Kan ik gratis een presentatie maken met AI?','Ja, met Canva Gratis: daarin heb je volgens Canva beperkte toegang tot standaard en premium AI. Voor Copilot in PowerPoint heb je een Microsoft 365-abonnement met AI nodig, en Gemini in Google Presentaties zit volgens de prijspagina van Google niet in Business Starter.'),
 ('Kan Copilot een presentatie maken in PowerPoint?','Ja. Volgens Microsoft maakt Copilot in PowerPoint een presentatie op basis van een opdracht of van één Word-document. Copilot werkt alleen met PowerPoint-bestanden (.ppt en .pptx) en heeft een internetverbinding nodig.'),
 ('Werkt AI voor presentaties in het Nederlands?','Bij alle drie staat Nederlands in de lijst met ondersteunde talen. Microsoft schrijft wel dat de kwaliteit in het Engels naar verwachting het hoogst is, en dat Ontwerpsuggesties in PowerPoint officieel alleen Engels (en-US) ondersteunt.')]
PRES_BODY=f'''      <h2 id="wat-ai-doet">Wat AI wel en niet doet bij een presentatie</h2>
      <p>Je typt waar je presentatie over gaat, en de AI zet een eerste opzet neer: dia's met koppen, tekst en een indeling. Bij Canva heet dat Magic Design for Presentations, in PowerPoint doe je het met Copilot en in Google Presentaties met Gemini. Copilot kan volgens Microsoft ook een presentatie maken van een bestaand Word-document, en met Gemini kun je volgens Google naar je Drive-bestanden verwijzen terwijl je een nieuwe dia maakt.</p>
      <p>Wat de AI niet voor je doet: weten wat jouw klant wil horen. Je cijfers, prijzen en voorbeelden controleer je zelf, en de volgorde van je verhaal bepaal je ook zelf. Zie de AI als een snelle eerste versie, niet als een eindproduct. Zoek je vooral beeld voor je dia's, lees dan ook {L('/ai-afbeeldingen-en-ontwerp/','AI voor afbeeldingen, logo’s en presentaties')}.</p>
      <h2 id="naast-elkaar">Tools naast elkaar</h2>
      <p>De tools staan op alfabetische volgorde, niet op rangorde. De bedragen komen van de Nederlandse prijspagina's van de aanbieders.</p>
{pres_tabel([
 ('Waar je het gebruikt','In Canva Presentaties; je kunt ook een PowerPoint-bestand uploaden en verder bewerken.','In PowerPoint, als onderdeel van Microsoft 365.','In Google Presentaties, als onderdeel van Google Workspace.'),
 ('Gratis','Ja: Canva Gratis, met beperkte toegang tot standaard en premium AI.','Nee: Copilot in PowerPoint zit in Personal, Family en Premium; Microsoft 365 Basic heeft geen AI-functies.','Nee: je hebt een geschikt Workspace- of Google AI-abonnement nodig; in Business Starter zit het niet.'),
 ('Voor één persoon','Pro: €12 per maand; €110 per jaar bij jaarbetaling.','Microsoft 365 Personal: €10 per maand; €99 per jaar bij jaarbetaling.','Niet in deze vergelijking.'),
 ('Voor een team, per gebruiker','Business: €17 per maand; €170 per jaar bij jaarbetaling.','Microsoft 365 Copilot Bedrijven: €21,84 per maand; €18,20 per maand bij jaarbetaling, excl. btw. Een invoegtoepassing bij een Microsoft 365-plan.','Business Standard: €16,20 per maand; €13,60 per maand met een contract van 1 jaar.'),
 ('Nederlands','Ja, Canva AI ondersteunt Nederlands.','Ja, Nederlands staat in de lijst; Ontwerpsuggesties officieel alleen Engels.','Ja, het zijvenster van Gemini in Presentaties werkt in het Nederlands.')])}
      <p>Werk je al met Microsoft 365, dan zit je waarschijnlijk het snelst in PowerPoint met Copilot. Werk je in Gmail en Google Docs, dan ligt Gemini meer voor de hand. Twijfel je tussen de assistenten zelf, lees dan {L('/vergelijken/chatgpt-vs-copilot/','ChatGPT en Copilot naast elkaar')} en {L('/vergelijken/chatgpt-vs-gemini/','het verschil tussen ChatGPT en Gemini')}.</p>
      <h2 id="gratis-of-betaald">Gratis of betaald</h2>
      <p>Wil je eerst proberen zonder te betalen, dan is Canva Gratis de enige van de drie met een gratis versie. Let wel: het maken van een presentatie met Canva AI is volgens Canva een premium AI-tool die meetelt voor je maandelijkse AI-gebruik. Met Pro krijg je volgens Canva 10 keer meer AI dan met Canva Free.</p>
      <p>Bij Microsoft zit Copilot in PowerPoint in Microsoft 365 Personal, Family en Premium. Family kost €13 per maand of €129 per jaar bij jaarbetaling, maar daar is de AI alleen voor de eigenaar van het abonnement. Zakelijk is Copilot Bedrijven een invoegtoepassing: je hebt al een geschikt Microsoft 365 Business-abonnement nodig. Bij Google zit Gemini in Presentaties vanaf Business Standard.</p>
      <p><strong>Voorbeeld:</strong> drie mensen, een jaar lang. Bij maandelijks betalen: Canva Business 3 × €17 × 12 = €612, Google Workspace Business Standard 3 × €16,20 × 12 = €583,20 en Microsoft 365 Copilot Bedrijven 3 × €21,84 × 12 = €786,24 excl. btw. Met de jaarprijzen: 3 × €170 = €510, 3 × €13,60 × 12 = €489,60 en 3 × €18,20 × 12 = €655,20 excl. btw. Copilot Bedrijven komt bovenop je Microsoft 365-abonnement. Meer over het rekenen per gebruiker lees je in {L('/gids/wat-kosten-ai-abonnementen/','wat AI-abonnementen kosten')}.</p>
      <h2 id="nederlands">In het Nederlands</h2>
      <p>Alle drie werken met Nederlandse opdrachten, maar met kanttekeningen. Canva noemt Nederlands bij de ondersteunde talen van Canva AI, ook voor AI-presentaties op basis van je eigen gegevens. Wel kan het volgens Canva van de taalinstelling afhangen of een teamlid toegang heeft tot Canva AI voor presentaties.</p>
      <p>Microsoft zet Nederlands in de lijst voor prompts en antwoorden van Microsoft 365 Copilot. In de veelgestelde vragen over PowerPoint staat dat de kwaliteit in het Engels naar verwachting het hoogst is. Google noemt Nederlands bij het zijvenster van Gemini in Presentaties; Gems in dat zijvenster werken volgens Google alleen in een kleiner aantal talen, en Nederlands hoort daar niet bij.</p>
      <h2 id="privacy">Bedrijfsdata en privacy</h2>
      <p>Een presentatie bevat vaak klantnamen, omzetcijfers of plannen. Google schrijft bij de Workspace-abonnementen dat je bedrijfsgegevens niet worden gebruikt om modellen te trainen. Bij Copilot werk je met je werkgegevens binnen je Microsoft 365-omgeving. Zet persoonsgegevens alleen in een AI-tool als je weet wat de aanbieder ermee doet en je afspraken hebt gemaakt. Lees hoe je {L('/gids/ai-veilig-gebruiken/','AI veilig gebruikt in je bedrijf')}.</p>
      <h2 id="zo-kies-je">Zo kies je</h2>
      <ul>
        <li><strong>Begin bij wat je al hebt.</strong> Betaal je al voor Microsoft 365 of Google Workspace, kijk dan eerst of AI voor presentaties in jouw abonnement zit.</li>
        <li><strong>Vooral vormgeving?</strong> Canva draait om ontwerp en sjablonen, en heeft als enige van de drie een gratis versie.</li>
        <li><strong>Reken per gebruiker.</strong> Alle zakelijke prijzen gelden per persoon. Neem alleen licenties voor wie echt presentaties maakt.</li>
        <li><strong>Test met echt werk.</strong> Laat dezelfde opdracht in twee tools uitvoeren en kijk hoeveel je nog moet herschrijven.</li>
      </ul>
      <p>Zoek je een bredere assistent voor tekst, mail en samenvattingen, bekijk dan de {L('/ai-assistenten/','AI-assistenten naast elkaar')}. Nog niet zeker welke tools bij jouw bedrijf passen? {L('/keuzehulp/','Doe de keuzehulp')}.</p>
      <p class="go">{uit(T['canva'])} {uit(T['copilot'])} {uit(T['gemini'])}</p>
'''
_pt='AI presentatie maken: tools en prijzen voor ondernemers'
_pd='Presentatie maken met AI? Canva, Copilot in PowerPoint en Gemini in Google Slides naast elkaar: wat gratis kan, wat het kost en of het Nederlands kan.'
_ph1='AI presentatie maken: Canva, Copilot en Gemini vergeleken'
_pb=PRES_BODY+faq_html(PRES_FAQ)+pres_bronnen(PRES_SRC)+'      <p class="note">Redactie ToolMatch · bijgewerkt op <time datetime="2026-11-03">3 november 2026</time></p>\n'
_pg=[{"@type":"Article","@id":D+PRES+"#artikel","headline":_ph1,"description":_pd,"inLanguage":"nl-NL","url":D+PRES,"mainEntityOfPage":D+PRES,"datePublished":PRES_UPD,"dateModified":PRES_UPD,"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
  crumbs_ld([('Home','/'),('AI presentatie maken',PRES)]),faq_ld(PRES,PRES_FAQ)]
write(PRES.strip('/')+'/index.html',page(PRES,_pt,_pd,'AI presentatie maken',_ph1,'Een eerste versie van je presentatie in een paar minuten. Hier staan Canva, Copilot en Gemini naast elkaar, met wat gratis kan, wat het per maand kost en hoe het met Nederlands zit.',_pb,wide=True,extra=ldscript(_pg)+WL_EXTRA))
SPOKES.append(PRES)
