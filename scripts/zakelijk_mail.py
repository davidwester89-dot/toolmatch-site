# Nieuwe pagina 27-11-2026: /zakelijk-e-mailadres-aanmaken/ (briefing Blogschrijver wk48). Wordt uitgevoerd door build.py (na boekingssysteem_salon.py).
# Bedragen alleen van de prijspagina's van de aanbieder (bekeken 23-11-2026):
#  - Google Workspace (workspace.google.com/intl/nl/pricing): Business Starter € 6,80 (contract 1 jaar) / € 8,10 (flexibel), Business Standard
#    € 13,60 / € 16,20, per gebruiker per maand, exclusief belastingen; 14 dagen kosteloos proberen. Gelijk aan js/lib/tools.js (gemini).
#    Tijdelijke introductiekorting (30% eerste 3 maanden) bewust niet genoemd.
#  - Microsoft 365 Business Basic (microsoft.com/nl-nl): € 6,07 per gebruiker per maand bij jaarbetaling, € 7,28 met maandabonnement, excl. btw.
# Partner: alleen de bestaande Google Workspace-reflink (id gemini) via uit(): geen target=_blank, niet framen, geen promocodes.
# Microsoft 365 alleen als bronlink. Geen Hostinger-link (vraagt MM-OK). E-CTA-1: KEUZEHULP in scripts/e-cta-1.config.mjs (zoals /boekingssysteem-salon/).
# Bronnen: alleen naam + link, zonder datum (huisregel).
ZM_PUB='2026-11-27'
ZM_PAD={ZM:ZM_UPD}
GWS_PRIJS=('https://workspace.google.com/intl/nl/pricing')
M365_BASIC='https://www.microsoft.com/nl-nl/microsoft-365/business/microsoft-365-business-basic'
ZM_SRC=[('Google Workspace: prijzen',GWS_PRIJS),
 ('Google Workspace-beheerder Help: MX-records instellen voor Google Workspace','https://support.google.com/a/answer/16004259?hl=nl'),
 ('Microsoft 365 Business Basic',M365_BASIC),
 ('Microsoft 365: alle abonnementen voor bedrijven vergelijken','https://www.microsoft.com/nl-nl/microsoft-365/business/compare-all-microsoft-365-business-products'),
 ('Microsoft Learn: Een aangepast domein toevoegen aan Microsoft 365','https://learn.microsoft.com/nl-nl/microsoft-365/admin/setup/add-domain'),
 ('Gmail Help: Aankomende wijzigingen in Gmail voor POP','https://support.google.com/mail/answer/16604719?hl=nl'),
 ('Gmail Help: Nog een e-mailaccount toevoegen in de Gmail-app','https://support.google.com/mail/answer/6078445?hl=nl'),
 ('Gmail Help: E-mails sturen vanaf een ander adres of een alias','https://support.google.com/mail/answer/22370?hl=nl'),
 ('Microsoft Support: Een e-mailaccount toevoegen aan Outlook voor Windows','https://support.microsoft.com/nl-nl/outlook/getstarted/add-an-email-account-to-outlook-for-windows'),
 ('Autoriteit Persoonsgegevens: Controle van werknemers','https://autoriteitpersoonsgegevens.nl/themas/werk-en-uitkering/controle-van-werknemers')]
def zm_bronnen(srcs):
    return '      <h2 id="bronnen">Bronnen</h2>\n      <ul class="bronnen">\n'+''.join(f'        <li>{X(u,E(n))}</li>\n' for n,u in srcs)+'      </ul>\n'
ZM_FAQ=[
 ('Wat kost een zakelijk e-mailadres?','Je betaalt voor je domeinnaam en voor het mailpakket. Google Workspace Business Starter kost € 6,80 per gebruiker per maand met een contract van 1 jaar, of € 8,10 flexibel. Microsoft 365 Business Basic kost € 6,07 per gebruiker per maand bij jaarbetaling, of € 7,28 met een maandabonnement. Beide bedragen zijn exclusief btw.'),
 ('Kan ik een zakelijk e-mailadres gratis aanmaken?','Niet op je eigen domein: de domeinnaam kost altijd geld. Google Workspace kun je 14 dagen kosteloos proberen en Microsoft 365 Business Basic kun je ook gratis uitproberen. Een gratis Gmail-adres werkt, maar dat staat niet op je eigen domein.'),
 ('Hoe lang duurt het voor mijn nieuwe mailadres werkt?','Na het aanpassen van je MX-record kan het tot 72 uur duren voordat mail op het nieuwe adres binnenkomt. In die tijd kan er nog mail bij je oude aanbieder binnenkomen.')]
ZM_BODY=f'''      <h2 id="wat-je-nodig-hebt">Wat je nodig hebt</h2>
      <p>Een zakelijk e-mailadres zoals naam@jouwbedrijf.nl bestaat uit twee delen. Je hebt allebei nodig:</p>
      <ul>
        <li><strong>Een domeinnaam.</strong> Het deel achter de @, zoals jouwbedrijf.nl. Die koop je bij een domeinregistrar of hostingbedrijf. Heb je al een website, dan heb je meestal ook al een domein. Nog geen site? Lees hoe je {L('/ai-website-maken/','met AI een website maakt')}.</li>
        <li><strong>Een mailpakket.</strong> De dienst die je mailboxen beheert: Google Workspace, Microsoft 365 of de mail bij je webhosting.</li>
        <li><strong>Toegang tot je DNS-instellingen.</strong> Daar zet je een MX-record, zodat mail voor je domein bij het juiste mailpakket aankomt. Die instellingen vind je bij de partij waar je je domein beheert.</li>
      </ul>
      <h2 id="pakketten">Google Workspace, Microsoft 365 of mail bij je hosting</h2>
      <p>Google Workspace en Microsoft 365 rekenen per gebruiker per maand. Elke medewerker met een eigen mailbox telt als gebruiker. De bedragen zijn exclusief btw, zoals de aanbieders ze tonen.</p>
      <div class="tbl" role="region" aria-label="Mailpakketten per gebruiker per maand" tabindex="0">
        <table>
          <caption class="sr">Mailpakketten per gebruiker per maand</caption>
          <thead><tr><th scope="col">Pakket</th><th scope="col">Met jaarcontract</th><th scope="col">Per maand opzegbaar</th><th scope="col">Opslag en extra's</th></tr></thead>
          <tbody>
          <tr><th scope="row">Google Workspace Business Starter</th><td>€ 6,80</td><td>€ 8,10</td><td>30 GB per gebruiker; Gemini in Gmail en als chat</td></tr>
          <tr><th scope="row">Google Workspace Business Standard</th><td>€ 13,60</td><td>€ 16,20</td><td>2 TB per gebruiker</td></tr>
          <tr><th scope="row">Microsoft 365 Business Basic</th><td>€ 6,07</td><td>€ 7,28</td><td>Web- en mobiele versies van Word, Excel, PowerPoint en Outlook; Teams</td></tr>
          </tbody>
        </table>
      </div>
      <ul>
        <li><strong>Google Workspace</strong> past als je al in Gmail en Google Docs werkt. In Business Starter zit ook Gemini in Gmail en als chat. Of dat beter past dan ChatGPT, lees je in {L('/vergelijken/chatgpt-vs-gemini/','ChatGPT vs Gemini')}.</li>
        <li><strong>Microsoft 365</strong> past als je met Outlook, Word en Excel werkt. Copilot is daar een betaalde invoegtoepassing; zie {L('/vergelijken/chatgpt-vs-copilot/','ChatGPT vs Copilot')}. {X(M365_BASIC,'Bron: Microsoft 365 Business Basic')}</li>
        <li><strong>Mail bij je hosting</strong> past als je alleen mail nodig hebt en al een hostingpakket hebt. Hoeveel mailboxen en opslag erbij zitten, verschilt per pakket. Kijk dat na bij je hostingbedrijf.</li>
      </ul>
'''+met_noot(f'      <p class="go">{uit(T["gemini"])}</p>\n')+f'''      <p>Wat AI-abonnementen zoals Gemini en Copilot los kosten, staat in {L('/gids/wat-kosten-ai-abonnementen/','wat kosten AI-abonnementen')}.</p>
      <h2 id="gratis">Gratis zakelijk e-mailadres: wat kan wel en niet</h2>
      <ul>
        <li><strong>Eigen domein kost altijd iets.</strong> Ook als je mailpakket gratis is, betaal je voor de domeinnaam.</li>
        <li><strong>Eerst proberen kan.</strong> Google Workspace kun je 14 dagen kosteloos proberen. Microsoft 365 Business Basic kun je ook gratis uitproberen.</li>
        <li><strong>Een gratis Gmail-adres</strong> werkt voor je zaak, maar staat niet op je eigen domein.</li>
        <li><strong>Mail van je hosting binnenhalen in Gmail op je computer kan niet meer.</strong> Gmail ondersteunt het ophalen van mail van andere accounts via POP niet meer. Wil je die mail toch in Gmail, dan kun je automatisch doorsturen instellen bij je mailaanbieder, of het adres via IMAP toevoegen in de Gmail-app op je telefoon.</li>
      </ul>
      <h2 id="stap-voor-stap">Stap voor stap</h2>
      <p><strong>Met Google Workspace:</strong></p>
      <ol>
        <li>Meld je aan voor Google Workspace en geef je domein op.</li>
        <li>Bevestig dat het domein van jou is. Zonder die verificatie kun je Gmail niet instellen.</li>
        <li>Maak de gebruikers aan: één account per mailadres.</li>
        <li>Log in bij de partij waar je je domein beheert en open de DNS-instellingen. Verwijder oude MX-records en voeg een MX-record toe met de waarde <code>smtp.google.com</code> en prioriteit 1.</li>
        <li>Activeer Gmail in de Google Beheerdersconsole. Het kan tot 72 uur duren voordat het nieuwe MX-record overal werkt.</li>
      </ol>
      <p><strong>Met Microsoft 365:</strong></p>
      <ol>
        <li>Kies in het Microsoft 365-beheercentrum bij Domeinen voor Domein toevoegen en vul je domeinnaam in.</li>
        <li>Bevestig dat het domein van jou is met een TXT-record. Ondersteunt je registrar Domain Connect, dan zet Microsoft de records automatisch.</li>
        <li>Voeg gebruikers en postvakken toe voordat je het MX-record naar Microsoft 365 laat wijzen.</li>
        <li>Zet de DNS-records die Microsoft 365 aangeeft bij je registrar, als dat niet automatisch ging.</li>
      </ol>
      <h2 id="mailprogramma">In Gmail of Outlook zetten</h2>
      <ul>
        <li><strong>Google Workspace:</strong> je logt in Gmail in met je nieuwe adres. In de Gmail-app voor Android, iPhone en iPad tik je op je profiel en kies je Nog een account toevoegen. Je kunt tot 5 adressen aan de app toevoegen.</li>
        <li><strong>Mail bij je hosting in de Gmail-app:</strong> voeg het adres toe als niet-Gmail-adres. De app gebruikt daarvoor IMAP.</li>
        <li><strong>Versturen vanaf je zakelijke adres in Gmail:</strong> via Instellingen, Accounts en Mail verzenden als voeg je een adres toe. Vanaf januari 2027 werkt dat niet meer voor adressen van andere aanbieders; Google Workspace-aliassen blijven werken.</li>
        <li><strong>Outlook voor Windows:</strong> ga naar Instellingen, Accounts en kies Account toevoegen. Vul je zakelijke adres in en daarna je wachtwoord.</li>
      </ul>
      <p>Mail je veel offertes? Lees hoe {L('/ai-mail-en-offertes/','AI helpt bij offertes en zakelijke mail')}.</p>
      <h2 id="avg">Mailadressen van medewerkers en AVG</h2>
      <p>Geef je medewerkers een eigen mailadres, dan staan daar hun naam en hun berichten in. Daarvoor geldt de AVG. Dit moet je als werkgever weten:</p>
      <ul>
        <li>Je mag voorwaarden stellen aan het gebruik van zakelijke mail en dat controleren. Je moet medewerkers wel vooraf laten weten wat de regels zijn en dat controle mogelijk is.</li>
        <li>Is iemand langere tijd afwezig, bijvoorbeeld door ziekte of vakantie, dan mag je de zakelijke mail lezen. Privémail niet.</li>
        <li>Stiekem meelezen mag vrijwel nooit.</li>
      </ul>
      <p>Bewaar je klantgegevens uit je mail ook ergens anders, leg ze dan vast in een {L('/crm-klein-bedrijf/','CRM voor een klein bedrijf')}.</p>
      <p>Twijfel je welke tools je verder nodig hebt? {L('/keuzehulp/','Doe de keuzehulp')}.</p>
'''
_zt='Zakelijk e-mailadres aanmaken met je eigen domein'
_zd='Zakelijk e-mailadres aanmaken met je eigen domein? Wat je nodig hebt, wat Google Workspace en Microsoft 365 kosten en hoe je het in Gmail of Outlook zet.'
_zh1='Zakelijk e-mailadres aanmaken met je eigen domein'
_zb=ZM_BODY+faq_html(ZM_FAQ)+zm_bronnen(ZM_SRC)+f'      <p class="note">Redactie ToolMatch · bijgewerkt op <time datetime="{ZM_UPD}">{datum_nl(ZM_UPD)}</time></p>\n'
_zg=[{"@type":"Article","@id":D+ZM+"#artikel","headline":_zh1,"description":_zd,"inLanguage":"nl-NL","url":D+ZM,"mainEntityOfPage":D+ZM,"datePublished":ZM_PUB,"dateModified":ZM_UPD,"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
  crumbs_ld([('Home','/'),('Zakelijk e-mailadres',ZM)]),faq_ld(ZM,ZM_FAQ)]
write(ZM.strip('/')+'/index.html',page(ZM,_zt,_zd,'Zakelijk e-mailadres',_zh1,'Een mailadres op je eigen domein, zoals naam@jouwbedrijf.nl, laat meteen zien bij welk bedrijf je hoort. Zo maak je het aan: wat je nodig hebt, wat het kost en hoe je het in Gmail of Outlook zet.',_zb,wide=True,extra=ldscript(_zg)+WL_EXTRA))
SPOKES.append(ZM)
