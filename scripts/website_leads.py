# Nieuwe pagina's 27-10-2026: /ai-website-maken/ en /websitebezoekers-herkennen/. Wordt uitgevoerd door build.py (na spokes.py).
# Bronnen bekeken op 26-10-2026. Aanbieders op alfabetische volgorde; geen partnerlinks (gewone links met rel="noopener").
WL_PUB='2026-10-27'
WL_CHECK='26 oktober 2026'
WL_LASTMOD={'/ai-website-maken/':WL_PUB,'/websitebezoekers-herkennen/':WL_PUB,'/':WL_PUB}
WL_EXTRA='<meta name="author" content="Redactie ToolMatch">\n<meta property="og:image:type" content="image/png">\n'
def wl_bronnen(srcs):
    return '      <h2 id="bronnen">Bronnen</h2>\n      <ul class="bronnen">\n'+''.join(f'        <li>{X(u,E(n))}, bekeken op {WL_CHECK}</li>\n' for n,u in srcs)+'      </ul>\n'
def wl_knop(vid,naam,url):
    return f'<p class="go"><a class="btn ghost" href="{E(url)}" rel="noopener" target="_blank" data-vendor="{vid}" data-cta="outbound" aria-label="Naar de site van {E(naam)} (opent in een nieuw tabblad)">Naar de site van {E(naam)}</a></p>'
def wl_tabel(label,cols,rows):
    th=''.join(f'<th scope="col">{E(c)}</th>' for c in cols)
    tr=''.join('          <tr><th scope="row">'+r[0]+'</th>'+''.join(f'<td>{x}</td>' for x in r[1:])+'</tr>\n' for r in rows)
    return f'''      <div class="tbl" role="region" aria-label="{E(label)}" tabindex="0">
        <table class="vs">
          <thead><tr><th scope="col">Gecontroleerd op {WL_CHECK}</th>{th}</tr></thead>
          <tbody>
{tr}          </tbody>
        </table>
      </div>
'''
def wl_zet(slug,title,desc,crumb,h1,lead,body,faq,srcs):
    body=body+faq_html(faq)+wl_bronnen(srcs)+f'      <p class="note">Redactie ToolMatch · gepubliceerd op 27 oktober 2026, bronnen bekeken op {WL_CHECK}. Prijzen zoals de aanbieder ze vermeldt.</p>\n'
    graph=[{"@type":"Article","@id":D+slug+"#artikel","headline":h1,"description":desc,"inLanguage":"nl-NL","url":D+slug,"mainEntityOfPage":D+slug,"datePublished":WL_PUB,"dateModified":WL_PUB,"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
      crumbs_ld([('Home','/'),(crumb,slug)]),faq_ld(slug,faq)]
    write(slug.strip('/')+'/index.html',page(slug,title,desc,crumb,h1,lead,body,wide=True,extra=ldscript(graph)+WL_EXTRA))
    SPOKES.append(slug)

# ======================= /ai-website-maken/ =======================
HOST_AI=('Hostinger: Website maken met AI','https://www.hostinger.com/nl/website-maken-met-ai')
HOST_WB=('Hostinger: Website maken (websitebouwer)','https://www.hostinger.com/nl/website-maken')
JW=('JouwWeb: Prijzen en vergelijking','https://www.jouwweb.nl/prijzen')
WIX_NL=('Wix: Premiumpakketten (Nederlandse prijspagina)','https://nl.wix.com/pricing')
WIX=('Wix: Plans','https://www.wix.com/plans')
WP_DL=('WordPress.org: Download','https://nl.wordpress.org/download/')
WP_HOME=('WordPress.org: Maak kennis met WordPress','https://nl.wordpress.org/')
WP_ABOUT=('WordPress.org: About','https://wordpress.org/about/')

A_BODY=f'''      <h2 id="wat-het-doet">Wat een AI-websitebouwer wel en niet voor je doet</h2>
      <p>Een AI-websitebouwer maakt op basis van een korte omschrijving een eerste versie van je website: pagina's, opmaak en teksten. Bij Hostinger kies je tussen een handmatige modus, waarin je die eerste versie daarna met slepen en neerzetten aanpast, en een Agentic-modus, waarin je de site bouwt en aanpast door met de AI te chatten.</p>
      <p>Wat de AI niet voor je doet: weten wat jouw klanten zoeken. Je diensten, prijzen en werkgebied zet je er zelf in, en je leest alles na voordat je live gaat. Schrijf je de teksten liever met een losse tool, bekijk dan de {L('/ai-tekst-schrijven/','AI-tools voor Nederlandse teksten')}.</p>
      <h2 id="naast-elkaar">Naast elkaar</h2>
      <p>De opties staan op alfabetische volgorde, niet op rangorde.</p>
{wl_tabel('Vier opties om een website te maken naast elkaar',['Hostinger','JouwWeb','Wix','WordPress (zelf hosten)'],[
 ('Wat het is','AI Bouwer met hosting, domein en e-mail in één pakket.','Websitebouwer; hosting zit in alle pakketten.','Websitebouwer met AI en slepen en neerzetten; hosting inbegrepen.','Open source software (GPL); hosting en domein regel je zelf of via een hostingpartij.'),
 ('Gratis','Nee; de websitebouwer kun je 14 dagen gratis proberen.','Ja, zonder eigen domeinnaam.','Ja, met een wixsite.com-adres en Wix-branding.','De software is open source; voor hosting en domein ga je naar een hostingpartij.'),
 ('Betaald vanaf','Premium: €9,99 per maand (verlengprijs); de eerste 48 maanden €1,99 per maand (€95,52 vooraf), excl. btw.','Lite: €5,50 per maand bij jaarbetaling, excl. btw. Tot en met 31-10-2026 de eerste 12 maanden €2,75.','Light; het bedrag zie je op de <a href="https://nl.wix.com/pricing" target="_blank" rel="noopener">prijspagina van Wix</a>. Jaarabonnement vooraf betaald, excl. toeslagen.','Hangt af van je hostingpartij.'),
 ('Na de eerste periode','Premium verlengt voor €9,99 per maand, voor dezelfde looptijd.','Standaardtarief; domein na het eerste jaar €20 per jaar.','Niet gecontroleerd.','–'),
 ('Opzeggen','Op elk moment opzegbaar; 30 dagen geld-terug-garantie.','Maandbetaling: 1 maand opzegtermijn. Jaarbetaling verlengt automatisch, tenzij je minstens 1 maand vooraf opzegt.','14 dagen geld-terug-garantie.','–'),
 ('Domein','1 jaar gratis.','1 jaar gratis (niet bij Gratis), op jouw naam.','1 jaar gratis bij de meeste jaarabonnementen, alleen voor een nieuw domein via Wix.','Regel je zelf.'),
 ('E-mail','Premium: 2 mailboxen per website, 1 jaar gratis.','Pro: 1 mailbox; Business: 1 XL-mailbox.','Via een los Google Workspace-abonnement.','Niet gecontroleerd.'),
 ('Webshop','E-commerce bij Onbeperkt: €16,99 per maand; de eerste 48 maanden €2,99, excl. btw.','Pro: 10 producten; Business: onbeperkt.','Betalingen en eCommerce vanaf Core.','Met plugins, bijvoorbeeld een winkel.'),
 ('AI','Bouwen met AI (handmatig of Agentic), met AI-credits per plan.','AI-functies genoemd in de pakketvergelijking.','Site maken vanuit één prompt.','Niet genoemd op de pagina\'s die we bekeken.'),
 ('Nederlands','Nederlandstalige site; taal van de support niet gecontroleerd.','Nederlandstalige site, persoonlijke ondersteuning.','Nederlandstalige klantenservice, volgens de Nederlandse prijspagina.','Nederlandstalige site (nl.wordpress.org).')])}      <p>Bij Wix noemen we geen bedragen: Wix toont prijzen per land, en de uiteindelijke prijs zie je op de aankooppagina.</p>
      <h2 id="opties">De opties</h2>
      <h3 id="hostinger">Hostinger Website Bouwer</h3>
      <p>Hostinger verkoopt de AI Bouwer als pakket met hosting, domein en e-mail. Je beschrijft je idee, de AI maakt een eerste versie en met "Ga live" staat hij online. Premium is voor maximaal 3 websites; voor een webshop noemt Hostinger Onbeperkt. Premium kost €9,99 per maand (verlengprijs); de eerste 48 maanden €1,99 per maand (€95,52 vooraf). Onbeperkt kost €16,99 per maand; de eerste 48 maanden €2,99. Alles excl. btw.</p>
      <p><strong>Past als</strong> je alles in één pakket wilt en lang vooruit betalen geen bezwaar is.</p>
      {wl_knop('hostinger','Hostinger','https://www.hostinger.com/nl/website-maken-met-ai')}
      <h3 id="jouwweb">JouwWeb</h3>
      <p>Lite (€5,50 per maand) toont advertenties op je site. Pro (€10 per maand) heeft een eigen mailbox en een webshop voor 10 producten, Business (€20 per maand) een webshop zonder limiet. Standaardtarieven bij jaarbetaling, exclusief btw; tot en met 31 oktober 2026 betaal je de eerste 12 maanden de helft. Je domeinnaam staat op jouw naam, zodat je hem later kunt verhuizen.</p>
      <p><strong>Past als</strong> je een eenvoudige zakelijke site wilt en per maand wilt kunnen betalen, met een korte opzegtermijn.</p>
      {wl_knop('jouwweb','JouwWeb','https://www.jouwweb.nl/')}
      <h3 id="wix">Wix</h3>
      <p>Je kunt gratis beginnen, met een adres als naam.wixsite.com en Wix-branding. Met een Premium-pakket koppel je een eigen domein en verdwijnt die branding. Betalingen ontvangen en afspraken laten boeken kan vanaf Core. De pakketten zijn Light, Core, Business en Business Elite; de prijzen staan op de <a href="https://nl.wix.com/pricing" target="_blank" rel="noopener">prijspagina van Wix</a>.</p>
      <p><strong>Past als</strong> je eerst gratis wilt bouwen en later wilt uitbreiden met boekingen of een winkel.</p>
      {wl_knop('wix','Wix','https://www.wix.com/')}
      <h3 id="wordpress">WordPress (zelf hosten)</h3>
      <p>WordPress is open source software onder de GPL-licentie. Je kunt het zelf downloaden en installeren; volgens WordPress.org is dat "voor iedereen die zich op zijn gemak voelt bij het regelen van zijn eigen hosting en domein". Of je laat het instellen bij een hostingpartij. Met plugins voeg je bijvoorbeeld een winkel of nieuwsbrief toe. Wat het kost, hangt af van de hosting en het domein die je kiest.</p>
      <p><strong>Past als</strong> je alle vrijheid wilt en het technische beheer zelf wilt regelen.</p>
      {wl_knop('wordpress','WordPress.org','https://nl.wordpress.org/')}
      <h2 id="let-op">Waar je op let</h2>
      <ul>
        <li><strong>Introductieprijs of verlengprijs.</strong> Een lage maandprijs geldt vaak alleen voor de eerste periode. Bij Hostinger Premium betaal je €95,52 voor de eerste 48 maanden. Verleng je daarna voor dezelfde looptijd, dan is dat 48 × €9,99 = €479,52 (onze rekensom, excl. btw). Bij JouwWeb Pro is het eerste jaar met de actie €59,88 (12 × €4,99) en daarna €120 per jaar, plus €20 voor je domein (onze rekensom, excl. btw).</li>
        <li><strong>Looptijd.</strong> Bij JouwWeb verlengt een jaarabonnement automatisch, tenzij je minstens een maand van tevoren opzegt.</li>
        <li><strong>Overstappen.</strong> Je domeinnaam wil je kunnen meenemen. JouwWeb registreert hem op jouw naam. Bij Wix geldt het gratis domein alleen voor een nieuw domein dat je via Wix koopt. Hoe makkelijk je de site zelf meeneemt, hebben we niet getest.</li>
        <li><strong>Gegevens van bezoekers.</strong> Komen er via een contactformulier namen en mailadressen binnen, dan geldt de AVG. Waar de servers van deze aanbieders staan, hebben we niet gecontroleerd. Lees ook {L('/gids/ai-veilig-gebruiken/','wat de AVG vraagt bij online tools')}.</li>
      </ul>
      <h2 id="welke-past">Welke past bij jou?</h2>
      <div class="tbl" role="region" aria-label="Welke optie past bij jouw situatie" tabindex="0">
        <table>
          <thead><tr><th scope="col">Jouw situatie</th><th scope="col">Kijk eerst naar</th></tr></thead>
          <tbody>
          <tr><td>Snel online met alles in één pakket, en lang vooruit betalen is geen bezwaar</td><td><a href="#hostinger">Hostinger</a></td></tr>
          <tr><td>Een eenvoudige zakelijke site, liefst met maandbetaling</td><td><a href="#jouwweb">JouwWeb</a></td></tr>
          <tr><td>Eerst gratis bouwen, later boekingen of betalingen</td><td><a href="#wix">Wix</a></td></tr>
          <tr><td>Alle vrijheid en het beheer zelf doen</td><td><a href="#wordpress">WordPress</a></td></tr>
          </tbody>
        </table>
      </div>
      <p>Wil je vooral online verkopen? Op ShopMatch vergelijk je <a href="https://shopmatch.nl/beste-webshop-platform/" rel="noopener">webshopplatforms voor kleine ondernemers</a>. Klanten zelf laten boeken? Lees hoe je {L('/online-afspraken-plannen/','online afspraken laat plannen')}. En wil je weten welke bedrijven je nieuwe site bezoeken: {L('/websitebezoekers-herkennen/','websitebezoekers herkennen als B2B-leads')}. Nog niet zeker welke tools je nodig hebt? {L('/keuzehulp/','Doe de keuzehulp')}.</p>
'''
A_FAQ=[('Kan ik gratis een website maken met AI?','JouwWeb en Wix hebben een gratis versie: bij JouwWeb zonder eigen domeinnaam, bij Wix met een wixsite.com-adres en Wix-branding. Hostinger is niet gratis, maar de websitebouwer kun je volgens Hostinger 14 dagen gratis proberen.'),
 ('Wat kost een website maken met AI per maand?','Hostinger Premium kost €9,99 per maand (verlengprijs); de eerste 48 maanden €1,99 per maand (€95,52 vooraf). JouwWeb Lite €5,50 per maand bij jaarbetaling, beide exclusief btw. Bij Wix begin je met Light; de prijs daarvan zie je op de prijspagina van Wix.'),
 ('Kan ik mijn bestaande domeinnaam gebruiken?','Ja. Hostinger, JouwWeb en Wix noemen allemaal dat je een domein dat je al hebt kunt koppelen. Bij JouwWeb kun je het ook verhuizen.')]
wl_zet('/ai-website-maken/','Website maken met AI: 4 opties vergeleken | ToolMatch',
 'Een website maken met AI? Hostinger, JouwWeb, Wix en WordPress naast elkaar: prijs per maand, verlengprijs, looptijd, domein, e-mail en webshop.',
 'Website maken met AI','Een website maken met AI: vier opties voor ondernemers',
 'Je beschrijft je bedrijf en de AI zet er een eerste website van in elkaar. Maar wat betaal je per maand, ook na de eerste periode? Vier opties naast elkaar, met de bron bij elk bedrag.',
 A_BODY,A_FAQ,[HOST_AI,HOST_WB,JW,WIX_NL,WIX,WP_DL,WP_HOME,WP_ABOUT])

# ======================= /websitebezoekers-herkennen/ =======================
LI_T=('Leadinfo: Tarieven','https://www.leadinfo.com/nl/tarieven/')
LI_AVG=('Leadinfo: Leadinfo is 100% AVG-conform','https://www.leadinfo.com/nl/legal/avg/')
LI_IP=('Leadinfo: IP tracking','https://www.leadinfo.com/nl/oplossingen/functies/ip-tracking/')
LF=('Leadfeeder (Dealfront): Pricing','https://www.leadfeeder.com/pricing/')
AB=('Albacross: Pricing','https://www.albacross.com/pricing/')
AP_PG=('Autoriteit Persoonsgegevens: Wat zijn persoonsgegevens?','https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/privacy-en-persoonsgegevens/wat-zijn-persoonsgegevens')
AP_CK=('Autoriteit Persoonsgegevens: Cookies','https://autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies')

B_BODY=f'''      <h2 id="hoe-werkt-het">Hoe bedrijfsherkenning werkt</h2>
      <p>Je zet een stukje trackingcode op je website. Bij Leadinfo ziet die code volgens de aanbieder het IP-adres van je bezoekers en vergelijkt dat met een database op basis van openbare bronnen, zoals het handelsregister. Zo wordt een bezoek gekoppeld aan een bedrijfsnaam, met de pagina's die er zijn bekeken.</p>
      <p>Je ziet dus bedrijven, geen namen van bezoekers. En lang niet elk bezoek: Leadinfo zegt ruwweg 30% van de bezoekers als bedrijf te herkennen, en telt bezoeken via internetproviders niet mee.</p>
      <p>De prijs hangt bij alle drie de tools hieronder af van het aantal herkende bedrijven per maand. Komt hetzelfde bedrijf vaker langs, dan telt het bij Leadfeeder en Leadinfo één keer.</p>
      <p>Sommige tools gaan verder dan het bedrijf. Leadinfo noemt LinkedIn-profielen, telefoonnummers en e-mailadressen van contactpersonen, Leadfeeder geverifieerde e-mailadressen en telefoonnummers vanaf Activate, en Albacross tegoeden voor geverifieerde mailadressen en telefoonnummers. Dat zijn gegevens van personen. Daarover hieronder meer.</p>
      <h2 id="avg">Mag dat? AVG, cookies en je privacyverklaring</h2>
      <p>Wat er mag, hangt af van hoe je zo'n tool gebruikt. Dit zegt de Autoriteit Persoonsgegevens (AP):</p>
      <ul>
        <li><strong>Gegevens over organisaties</strong> zijn geen persoonsgegevens. Maar informatie over een klein bedrijf kan ook iets zeggen over het gedrag van de eigenaar, en dan geldt de AVG wel.</li>
        <li><strong>Een IP-adres</strong> kan een persoonsgegeven zijn.</li>
        <li><strong>Cookies:</strong> voor trackingcookies, die gedrag over meerdere websites volgen, is toestemming nodig. Functionele cookies mogen zonder toestemming, maar je moet bezoekers wel vertellen dat je ze plaatst, bijvoorbeeld in je privacyverklaring.</li>
      </ul>
      <p>Leadinfo schrijft zelf dat IP-adressen onder de AVG als persoonsgegevens kunnen gelden en dat jij als website-eigenaar je bezoekers moet informeren, via je privacyverklaring en/of cookiebanner. Afhankelijk van de implementatie kan vooraf toestemming nodig zijn, en Leadinfo raadt aan om die te vragen voordat de trackingcode actief wordt. Op de tarievenpagina noemt Leadinfo daarnaast "gerechtvaardigd belang" als grondslag. De code plaatst volgens Leadinfo optioneel twee first-party cookies; er is ook een variant zonder cookies.</p>
      <p>Wat je in elk geval regelt:</p>
      <ul>
        <li><strong>Noem de tool in je privacyverklaring:</strong> welke gegevens, waarvoor en hoe lang. Leadinfo heeft volgens eigen zeggen voorbeeldteksten.</li>
        <li><strong>Sluit een verwerkersovereenkomst.</strong> Leadinfo zegt verwerker te zijn en een verwerkersovereenkomst te leveren. Lees {L('/gids/ai-veilig-gebruiken/','wat een verwerkersovereenkomst regelt')}.</li>
        <li><strong>Kijk waar de gegevens staan.</strong> Leadinfo host volgens de aanbieder in Ierland, bij AWS. Bij Leadfeeder en Albacross hebben we dat niet gecontroleerd.</li>
        <li><strong>Twijfel je over de grondslag</strong> (toestemming of gerechtvaardigd belang)? Vraag dan advies aan een jurist.</li>
      </ul>
      <h2 id="naast-elkaar">Naast elkaar</h2>
      <p>De tools staan op alfabetische volgorde, niet op rangorde. Geen van de drie prijspagina's zegt of de prijs met of zonder btw is.</p>
{wl_tabel('Drie tools om websitebezoekers te herkennen naast elkaar',['Albacross','Leadfeeder (Dealfront)','Leadinfo'],[
 ('Gratis versie','Niet gezien op de prijspagina.','Ja, Lite: de laatste 100 bedrijven per maand, 7 dagen historie.','Niet gezien op de tarievenpagina.'),
 ('Proefperiode','14 dagen, zonder creditcard.','14 dagen, zonder creditcard.','14 dagen, zonder creditcard.'),
 ('Betaald vanaf','Starter: €59 per maand bij jaarbetaling (0 tot 50 bedrijven per maand).','Discover: €79 per maand bij jaarbetaling, €113 bij maandbetaling (tot 50 bedrijven).','Starter: €69 per maand bij jaarbetaling (0 tot 50 bedrijven).'),
 ('Gebruikers','Niet gecontroleerd.','Onbeperkt.','Starter 3, Scale 10, Pro onbeperkt.'),
 ('CRM-koppelingen','Pipedrive vanaf Starter, HubSpot vanaf Professional (€149), Salesforce bij Organisation.','HubSpot, Salesforce en Pipedrive.','Starter: handmatig naar je CRM. HubSpot en Microsoft Dynamics vanaf Scale (€159), Salesforce vanaf Pro (€359).'),
 ('Contactpersonen','Tegoeden voor geverifieerde e-mail (10) en telefoon (5) in Starter.','Geverifieerde e-mail en telefoon vanaf Activate (vanaf €369 per maand).','LinkedIn-profielen, telefoonnummers en e-mailadressen; mobiele nummers vanaf Pro.'),
 ('Opslag van gegevens','Niet gecontroleerd.','Niet gecontroleerd.','Ierland (AWS), volgens Leadinfo.')])}      <h2 id="tools">De tools</h2>
      <h3 id="albacross">Albacross</h3>
      <p>Albacross herkent bedrijven op je site en combineert dat met opvolgen: automatische e-mail- en LinkedIn-reeksen met AI zitten volgens de prijspagina al in Starter. Starter kost €59 per maand bij jaarbetaling, Professional €149 per maand. Je kunt 14 dagen gratis proberen, zonder creditcard.</p>
      <p><strong>Past als</strong> je herkennen en opvolgen in één tool wilt en met Pipedrive werkt.</p>
      {wl_knop('albacross','Albacross','https://www.albacross.com/')}
      <h3 id="leadfeeder">Leadfeeder (Dealfront)</h3>
      <p>Leadfeeder is van Dealfront; de prijspagina van Dealfront stuurt door naar die van Leadfeeder. Lite is gratis, met de laatste 100 herkende bedrijven per maand en 7 dagen historie. Discover begint bij €79 per maand bij jaarbetaling (€113 bij maandbetaling) voor maximaal 50 bedrijven per maand. In elk plan zitten onbeperkt gebruikers en websites. Contactgegevens van personen haal je met credits, vanaf Activate.</p>
      <p><strong>Past als</strong> je eerst gratis wilt zien welke bedrijven langskomen, met je hele team.</p>
      {wl_knop('leadfeeder','Leadfeeder','https://www.leadfeeder.com/')}
      <h3 id="leadinfo">Leadinfo</h3>
      <p>Leadinfo herkent volgens de aanbieder bedrijven in real time en toont bedrijfsinformatie, bezochte pagina's en contactpersonen. Starter kost €69 per maand bij jaarbetaling voor maximaal 50 bedrijven per maand, met 3 gebruikers. Scale (vanaf €159) koppelt ook met HubSpot en Microsoft Dynamics. Na de gratis proefperiode van 14 dagen, waarvoor je geen creditcard nodig hebt, krijg je een voorstel op maat. Leadinfo host in Ierland en is ISO 27001-gecertificeerd, volgens de aanbieder.</p>
      <p><strong>Past als</strong> je een Nederlandstalige tool zoekt met een verwerkersovereenkomst en hosting in de EU.</p>
      {wl_knop('leadinfo','Leadinfo','https://www.leadinfo.com/nl/')}
      <h2 id="opvolgen">Van bezoek naar lead</h2>
      <p>Een bedrijfsnaam is nog geen klant. Zet de bedrijven die echt interessant zijn in een {L('/crm-klein-bedrijf/','CRM voor een klein bedrijf')}, zodat je ziet wie je al sprak en welke offerte nog openstaat. Koppelt je tool niet rechtstreeks met je CRM, dan kan het vaak via een koppelingstool; Leadinfo noemt Zapier en Make. Lees hoe je {L('/automatiseren-zonder-code/','apps koppelt zonder code')}.</p>
      <p>Kijk voordat je contact opneemt welke pagina's een bedrijf bekeek. Dan weet je waar de interesse ligt, en wordt je bericht relevant in plaats van een gok. Heb je nog geen site die bezoekers trekt? Lees dan eerst hoe je {L('/ai-website-maken/','een website maakt met AI')}.</p>
'''
B_FAQ=[('Kan ik zien wie mijn website bezoekt?','Je ziet bedrijven, geen namen van bezoekers. Tools als Leadinfo koppelen het IP-adres aan een bedrijf. Leadinfo zegt ruwweg 30% van de bezoekers als bedrijf te herkennen.'),
 ('Mag ik websitebezoekers herkennen onder de AVG?','Dat hangt af van hoe je de tool gebruikt. Volgens de Autoriteit Persoonsgegevens kan een IP-adres een persoonsgegeven zijn, en informatie over een klein bedrijf ook iets zeggen over de eigenaar. Informeer bezoekers in je privacyverklaring. Leadinfo raadt zelf aan om toestemming te vragen voordat de trackingcode actief wordt.'),
 ('Wat kost een tool om websitebezoekers te herkennen?','Voor het kleinste aantal bedrijven per maand: Albacross Starter €59, Leadinfo Starter €69 en Leadfeeder Discover €79, alle drie per maand bij jaarbetaling. Leadfeeder Lite is gratis, met de laatste 100 bedrijven per maand.'),
 ('Is er een gratis proefperiode?','Ja, alle drie de tools noemen een proefperiode van 14 dagen. Alle drie zeggen dat je daarvoor geen creditcard nodig hebt.')]
wl_zet('/websitebezoekers-herkennen/','Websitebezoekers herkennen: tools en AVG | ToolMatch',
 'Welke bedrijven bezoeken je website? Zo werken Albacross, Leadfeeder en Leadinfo, wat ze per maand kosten en wat de AVG van je vraagt.',
 'Websitebezoekers herkennen','Websitebezoekers herkennen als B2B-leads',
 'Zien welke bedrijven je website bezoeken, zodat je ze gericht kunt opvolgen. Zo werken die tools, wat ze kosten en wat je moet regelen voor de AVG.',
 B_BODY,B_FAQ,[AB,LF,LI_T,LI_AVG,LI_IP,AP_PG,AP_CK])
