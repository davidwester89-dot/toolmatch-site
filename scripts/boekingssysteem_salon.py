# Nieuwe pagina 19-11-2026: /boekingssysteem-salon/ (briefing Blogschrijver wk47). Wordt uitgevoerd door build.py (na canva_ondernemers.py).
# Alleen salon/beauty; /online-afspraken-plannen/ blijft de generieke vergelijking (niet kannibaliseren).
# Tools: alleen wat al in js/lib/tools.js staat (Acuity, Cal.com, Calendly, SimplyBook.me), op alfabet. Alle vier als neutrale bronlink (dee721c-stijl).
# Cal.com en SimplyBook.me staan wel in js/lib/partnerlinks.js, maar plaatsing op deze nieuwe pagina vraagt SC-OK + MM-OK (briefing wk47).
# Na OK: bs_bron(T[...]) voor calcom/simplybook vervangen door uit(T[...]) en de telling in test/onbetaald-neutraal-1711.test.js van 10 naar 12.
# Feiten van de eigen prijs- en functiepagina's, bekeken op 16-11-2026 (box-IP; bedragen daar in USD, dus geen bedragen op deze NL-pagina).
# Bronnen: alleen naam + link, zonder datum (huisregel).
BS='/boekingssysteem-salon/'
BS_PUB='2026-11-19'
BS_UPD='2026-11-19'
BS_PAD={BS:BS_UPD}
BS_SRC=[('SimplyBook.me: Pricing','https://simplybook.me/en/pricing'),
 ('SimplyBook.me: Hair salon scheduling system','https://simplybook.me/en/scheduling-system-for-hair-and-beauty-services/hair-salon-scheduling-system'),
 ('SimplyBook.me: Google Reserve','https://simplybook.me/en/google-reserve'),
 ('Cal.com: Prijzen','https://cal.com/nl/pricing'),
 ('Calendly: Pricing','https://calendly.com/pricing'),
 ('Acuity Scheduling: Pricing','https://acuityscheduling.com/pricing'),
 ('Google Bedrijfsprofiel Help: Boekingen instellen via een aanbieder van boekingsservices','https://support.google.com/business/answer/7475773?hl=nl'),
 ('Autoriteit Persoonsgegevens: Wat zijn persoonsgegevens?','https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/privacy-en-persoonsgegevens/wat-zijn-persoonsgegevens'),
 ('Autoriteit Persoonsgegevens: Verwerkersovereenkomst','https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verwerkersovereenkomst')]
def bs_bron(t): return f'<a href="{E(t["url"])}" rel="noopener">{E(t["naam"])}</a>'
def bs_bronnen(srcs):
    return '      <h2 id="bronnen">Bronnen</h2>\n      <ul class="bronnen">\n'+''.join(f'        <li>{X(u,E(n))}</li>\n' for n,u in srcs)+'      </ul>\n'
BS_FAQ=[
 ('Is er een gratis boekingssysteem voor een salon?','Ja. Cal.com is gratis voor één persoon, Calendly heeft een gratis versie met één afspraaktype en SimplyBook.me heeft een gratis plan tot 50 boekingen per maand. Acuity Scheduling heeft geen gratis versie, wel een proefperiode van 7 dagen.'),
 ('Kan een klant bij het boeken een aanbetaling doen?','Bij SimplyBook.me staan betalingen, aanbetalingen en fooien bij het Basic-plan. Calendly heeft betalingen in het betaalde Standard-plan en noemt betaallinks voor onder meer aanbetalingen, en Acuity Scheduling noemt betalingen en aanbetalingen via onder meer Stripe en PayPal.'),
 ('Kan ik herinneringen per sms sturen?','Ja, maar kijk per tool wat erbij zit. Bij SimplyBook.me betaal je sms-tegoed apart, bij Acuity Scheduling zitten sms-herinneringen vanaf het Standard-plan en Cal.com noemt e-mail- en sms-meldingen al in de gratis versie.')]
BS_BODY=f'''      <h2 id="wat-moet-het-kunnen">Wat een salon-boekingssysteem moet kunnen</h2>
      <p>Een kapper of schoonheidsspecialist plant anders dan een adviseur met één type gesprek. Je hebt behandelingen van verschillende lengte, meerdere stoelen of medewerkers en klanten die vooral 's avonds via hun telefoon boeken. Een boekingssysteem voor een salon moet daarom meer kunnen dan een losse agendalink.</p>
      <ul>
        <li><strong>Behandelingen met eigen duur en prijs.</strong> Een knipbeurt duurt korter dan kleuren. SimplyBook.me laat je per dienst een duur, buffertijd en prijs instellen en diensten aan bepaalde medewerkers koppelen.</li>
        <li><strong>Meerdere medewerkers.</strong> Kijk hoe de tool rekent. SimplyBook.me rekent per plan met een vast aantal medewerkers, Calendly en Cal.com rekenen in hun betaalde plannen per gebruiker.</li>
        <li><strong>Bevestiging en herinnering.</strong> De klant krijgt na het boeken een bevestiging en vóór de afspraak een herinnering. Daar gaat het volgende stuk over.</li>
        <li><strong>Een app voor jezelf.</strong> Tussen twee klanten door wil je snel een afspraak verzetten. SimplyBook.me heeft een beheer-app voor iOS en Android.</li>
      </ul>
      <p>Wil je alleen een eenvoudige agendalink voor gesprekken of intakes, dan past een algemene planner vaak al. Die vergelijken we op {L('/online-afspraken-plannen/','online afspraken laten plannen')}.</p>
      <h2 id="no-shows">No-shows: herinneringen en aanbetaling</h2>
      <p>Een lege stoel kost een salon direct omzet. Er zijn twee knoppen om aan te draaien: de klant herinneren en de klant vooraf laten betalen.</p>
      <p><strong>Herinneringen.</strong> Alle vier de tools in dit stuk sturen herinneringen, maar niet allemaal in elk plan of via elk kanaal:</p>
      <ul>
        <li>Acuity Scheduling: e-mailherinneringen in elk plan, sms-herinneringen vanaf Standard.</li>
        <li>Cal.com: e-mail- en sms-meldingen al in de gratis versie; aanpasbaar in het Teams-plan.</li>
        <li>Calendly: automatische herinneringen zitten in het betaalde Standard-plan, niet in de gratis versie.</li>
        <li>SimplyBook.me: automatische herinneringsmails in alle plannen; sms-tegoed betaal je apart.</li>
      </ul>
      <p><strong>Aanbetaling.</strong> Laat je klanten bij het boeken (een deel) betalen, dan is de drempel om weg te blijven hoger. SimplyBook.me zet betalingen, aanbetalingen en fooien bij het Basic-plan. Acuity Scheduling noemt betalingen en aanbetalingen via onder meer Stripe, Square en PayPal. Calendly heeft in het Standard-plan betalingen via Stripe en PayPal, en noemt betaallinks voor bijvoorbeeld een aanbetaling. Cal.com accepteert Stripe- en PayPal-betalingen in de gratis versie en heeft een functie voor no-showkosten.</p>
      <p>Let op: de betaalprovider rekent zijn eigen transactiekosten. SimplyBook.me schrijft dat het zelf geen transactiekosten rekent, maar Stripe, PayPal of Square wel.</p>
      <h2 id="website-en-google">Boeken via je website en Google</h2>
      <p>Klanten boeken waar ze je vinden: op je website, op Instagram of in Google Maps.</p>
      <ul>
        <li><strong>Op je eigen website.</strong> SimplyBook.me geeft je een eigen boekingswebsite en een widget voor je site, ook voor WordPress. Calendly en Cal.com kun je in je site insluiten. Heb je nog geen site, lees dan hoe je {L('/ai-website-maken/','met AI een website maakt')}.</li>
        <li><strong>Via Google.</strong> In je Google Bedrijfsprofiel kun je onder <em>Boekingen</em> een aanbieder van boekingsservices kiezen of een eigen boekingslink toevoegen. Google meldt dat je aanbieder voor boekingen via Google kosten in rekening kan brengen. SimplyBook.me heeft een koppeling met Reserveren met Google, zodat klanten via Google Maps en Zoeken kunnen boeken.</li>
        <li><strong>Via social media.</strong> SimplyBook.me noemt ook boekingen via Facebook en Instagram.</li>
      </ul>
      <p>Krijg je veel dezelfde vragen via je site, zoals openingstijden of prijzen? Dan kan een {L('/ai-chatbot-website/','AI-chatbot op je website')} die afvangen en de klant naar je boekingspagina sturen.</p>
      <h2 id="kosten">Kosten: gratis of betaald (prijspagina's)</h2>
      <p>De bedragen verschillen per land en valuta, en een deel van de aanbieders toont ze niet in euro's. Het actuele bedrag zie je op de prijspagina. Hier staat wat gratis kan en hoe ze rekenen:</p>
      <ul>
        <li><strong>Acuity Scheduling:</strong> geen gratis versie, wel 7 dagen gratis proberen. Plannen Starter, Standard en Premium, per account met een maximum aantal agenda's.</li>
        <li><strong>Cal.com:</strong> gratis voor één persoon, zonder gebruikslimieten. Teams en Organizations rekenen per gebruiker per maand, met 14 dagen proefperiode.</li>
        <li><strong>Calendly:</strong> gratis met één afspraaktype en één agendakoppeling. Standard rekent per gebruiker per maand.</li>
        <li><strong>SimplyBook.me:</strong> gratis tot 50 boekingen per maand met één medewerker. Basic gaat tot 100 boekingen en 5 medewerkers, Standard tot 500 boekingen en 15 medewerkers. Sms-tegoed en een eigen domeinnaam betaal je apart. Jaarbetaling is goedkoper dan per maand.</li>
      </ul>
      <p>Reken het voor jouw salon uit: met vier medewerkers maakt het veel uit of je per gebruiker of per plan betaalt. Kijk ook naar je aantal boekingen per maand, want daar rekent SimplyBook.me mee.</p>
      <h2 id="welke-tools">Welke tools passen</h2>
      <p>De tools staan op alfabetische volgorde, niet op rangorde.</p>
'''+met_noot(f'''      <ul>
        <li><strong>Acuity Scheduling</strong> als je met intakeformulieren werkt, en vanaf Standard een wachtlijst voor volgeboekte tijden en cadeaubonnen of pakketten wilt. {bs_bron(T["acuity"])}</li>
        <li><strong>Cal.com</strong> als je alleen werkt en gratis wilt beginnen met herinneringen en betalen bij het boeken. {bs_bron(T["calcom"])}</li>
        <li><strong>Calendly</strong> als je een bekende planner wilt en het betaalde plan neemt voor herinneringen en betalingen. {bs_bron(T["calendly"])}</li>
        <li><strong>SimplyBook.me</strong> als je een salon met meerdere medewerkers hebt en een eigen boekingssite, aanbetalingen en boeken via Google wilt. {bs_bron(T["simplybook"])}</li>
      </ul>
''')+f'''      <p>Twijfel je nog welke soort tool je nodig hebt? {L('/keuzehulp/','Doe de keuzehulp')}, of bekijk alle planners op {L('/online-afspraken-plannen/','online afspraken laten plannen')}.</p>
      <h2 id="avg">Klantgegevens en AVG</h2>
      <p>In een boekingssysteem staan namen, telefoonnummers en e-mailadressen van je klanten. Dat zijn persoonsgegevens, dus de AVG geldt.</p>
      <ul>
        <li><strong>Verwerkersovereenkomst.</strong> De aanbieder van je boekingssysteem verwerkt die gegevens voor jou. De Autoriteit Persoonsgegevens schrijft dat jij en zo'n verwerker dan verplicht zijn afspraken vast te leggen in een verwerkersovereenkomst. Vraag die op voordat je klantgegevens invoert.</li>
        <li><strong>Gezondheidsgegevens.</strong> Vraag je in een intakeformulier naar allergieën of huidproblemen? Gegevens over iemands gezondheid zijn bijzondere persoonsgegevens. Daarvoor gelden strenge regels: verwerken is verboden, tenzij er een wettelijke uitzondering is. Vraag alleen wat je echt nodig hebt.</li>
        <li><strong>Eén plek voor je klanten.</strong> Wil je klantgegevens ook gebruiken voor nazorg of een nieuwsbrief, leg ze dan vast in een {L('/crm-klein-bedrijf/','CRM voor je klantgegevens')}.</li>
      </ul>
'''
_bt='Boekingssysteem salon: zo kies je voor kapper of beauty'
_bd='Een boekingssysteem voor je salon kiezen? Waar je op let: online boeken via je website, herinneringen tegen no-shows, aanbetaling en kosten per maand.'
_bh1='Boekingssysteem salon: zo kies je voor kapper of beauty'
_bb=BS_BODY+faq_html(BS_FAQ)+bs_bronnen(BS_SRC)+f'      <p class="note">Redactie ToolMatch · bijgewerkt op <time datetime="{BS_UPD}">19 november 2026</time></p>\n'
_bg=[{"@type":"Article","@id":D+BS+"#artikel","headline":_bh1,"description":_bd,"inLanguage":"nl-NL","url":D+BS,"mainEntityOfPage":D+BS,"datePublished":BS_PUB,"dateModified":BS_UPD,"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
  crumbs_ld([('Home','/'),('Boekingssysteem salon',BS)]),faq_ld(BS,BS_FAQ)]
write(BS.strip('/')+'/index.html',page(BS,_bt,_bd,'Boekingssysteem salon',_bh1,'Minder lege stoelen en minder telefoontjes tijdens het knippen. Zo kies je een boekingssysteem voor je kapsalon of beautysalon: online boeken, herinneringen, aanbetaling en wat het kost.',_bb,wide=True,extra=ldscript(_bg)+WL_EXTRA))
SPOKES.append(BS)
