import json, html, os, re, subprocess
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
D='https://toolmatch.nl'
CSP='''<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; base-uri 'self'; form-action 'self'; object-src 'none'">'''
MARK='<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#0f6e6e"/><path d="M11 21.5l6 6 12-13" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 4.5l1.3 3.2 3.2 1.3-3.2 1.3L31 13.5l-1.3-3.2L26.5 9l3.2-1.3z" fill="#f0a83c"/></svg>'
# BreadcrumbList voor de losse pagina's (Home › pagina), gelijk aan het zichtbare kruimelpad.
BC_LOSSE={'/over/':'Over ToolMatch','/partnerlinks/':'Partnerlinks','/contact/':'Contact','/disclaimer/':'Disclaimer','/privacy/':'Privacy en cookies'}
def bc_losse(path):
    if path not in BC_LOSSE: return ''
    ld={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":D+"/"},{"@type":"ListItem","position":2,"name":BC_LOSSE[path],"item":D+path}]}
    return '<script type="application/ld+json">\n'+json.dumps(ld,ensure_ascii=False,indent=1)+'\n</script>\n'
def head(path,title,desc,ogt,extra=''):
    extra=bc_losse(path)+extra
    return f'''<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
{CSP}
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="impact-site-verification" value="4cedf3a1-b7d3-4bae-8898-6a31939e1d08">
<meta name="e08923fead07e26" content="c805cc3c2262098e1a99fce841da04b0" />
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{D}{path}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0f6e6e">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:site_name" content="ToolMatch">
<meta property="og:locale" content="nl_NL">
<meta property="og:type" content="website">
<meta property="og:title" content="{ogt}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{D}{path}">
<meta property="og:image" content="{D}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ToolMatch: de juiste (AI-)tools voor ondernemers">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/fonts/inter-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
{extra}</head>
<body>
<a class="skip" href="#inhoud">Naar de inhoud</a>
<header class="site">
  <div class="wrap">
    <a class="logo" href="/" aria-label="ToolMatch, naar de homepage">{MARK}<span>Tool<b>Match</b></span></a>
    <nav class="main" aria-label="Hoofdmenu">
      <a href="/#categorieen">Categorieën</a>
      <a href="/vergelijken/">Vergelijken</a>
      <a href="/gids/">Gidsen</a>
      <a href="/over/">Over</a>
      <a class="nav-cta" href="/keuzehulp/">Start&nbsp;<span class="nm">de&nbsp;</span>keuzehulp</a>
    </nav>
  </div>
</header>
'''
FOOT_T=f'''<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="logo" href="/" aria-label="ToolMatch, naar de homepage">{MARK}<span>Tool<b>Match</b></span></a>
        <p>De juiste (AI-)tools voor ondernemers: onafhankelijk, met echte kosten en privacy als criterium. Door Redactie ToolMatch.</p>
      </div>
      <nav aria-label="Over ToolMatch">
        <p class="fh">ToolMatch</p>
        <ul>
          <li><a href="/keuzehulp/">Keuzehulp</a></li>
          <li><a href="/over/">Over ToolMatch</a></li>
          <li><a href="/#zo-vergelijken-we">Zo vergelijken wij</a></li>
          <li><a href="/partnerlinks/">Partnerlinks</a></li>
          <li><a href="/#faq">Veelgestelde vragen</a></li>
        </ul>
      </nav>
      <nav aria-label="Privacy en contact">
        <p class="fh">Privacy en contact</p>
        <ul>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/privacy/">Privacy en cookies</a></li>
          <li><a href="/disclaimer/">Disclaimer</a></li>
          <li><a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a></li>
          <li><a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a></li>
        </ul>
      </nav>
    </div>
    <p class="fine">© 2026 ToolMatch — alle rechten voorbehouden · <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a></p>
  </div>
</footer>
@@SCRIPTS@@
</body>
</html>
'''
def foot(js='/js/consent.js'): return FOOT_T.replace('@@SCRIPTS@@',f'<script type="module" src="{js}"></script>')
FOOT=foot()
def ico(p): return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{p}</svg>'
CATS=[
('AI-assistenten','<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>','Een algemene AI-assistent voor schrijven, samenvatten en uitzoeken. Kijk eerst wat er al in je Microsoft 365 of Google Workspace zit.',[('/ai-assistenten/','AI-assistenten zoals ChatGPT en Copilot')],''),
('AI-schrijf- en tekstassistenten','<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>','Hulp bij het schrijven en herschrijven van teksten voor je website, blog of LinkedIn. Handig als eerste opzet, maar je eigen controle blijft nodig.',[('/ai-tekst-schrijven/','AI-schrijf- en tekstassistenten')],''),
('AI voor offertes en mail','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>','Tools die je helpen sneller een offerte, voorstel of zakelijke mail op te stellen. Vaak zitten ze al in je mailprogramma.',[('/ai-mail-en-offertes/','AI voor offertes en mail')],''),
('Facturatie &amp; boekhouding','<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>','Facturen maken, bonnetjes verwerken en je btw-aangifte voorbereiden. Sommige pakketten gebruiken AI om bonnetjes en banktransacties te herkennen.',[],'<span class="xlink">Ben je zzp\'er en zoek je een boekhoudprogramma? Op <a href="https://boekhoudmatch.nl/boekhoudprogramma-kiezen/" rel="noopener">BoekhoudMatch</a> vergelijk je ze op prijs en functies.</span>'),
('Planning &amp; agenda','<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>','Klanten zelf een moment laten kiezen in je agenda. Let op koppelingen met de agenda die je nu al gebruikt.',[('/online-afspraken-plannen/','afspraken laten inplannen')],''),
('CRM &amp; klantbeheer','<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 11h5M19.5 8.5v5"/>','Klantgegevens, contactmomenten en lopende offertes op één plek. Voor een klein bedrijf is een eenvoudig systeem vaak genoeg.',[('/crm-klein-bedrijf/','CRM voor een klein bedrijf')],''),
('Transcriptie &amp; notuleren','<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>','Gesprekken en online meetings laten uitschrijven en samenvatten. Check hoe goed een tool Nederlands verstaat en waar de opnames worden bewaard.',[('/ai-notuleren/','meetings laten notuleren')],''),
('Ontwerp &amp; social media','<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>','Visuals, presentaties en posts maken en inplannen. Vaak is er een gratis versie, met extra\'s alleen in het betaalde abonnement.',[('/ai-afbeeldingen-en-ontwerp/','visuals en presentaties maken'),('/social-media-inplannen/','posts vooruit inplannen')],''),
('Automatisering (no-code)','<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>','Losse apps aan elkaar koppelen zodat terugkerend werk vanzelf gaat, zonder te programmeren. Kijk goed hoe de kosten meegroeien met het aantal taken.',[('/automatiseren-zonder-code/','apps koppelen zonder code')],''),
('Chatbot op je website','<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M12 10h.01M16 10h.01"/><path d="M8 15c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5"/>','Een chatbot die vragen van klanten beantwoordt, ook buiten kantoortijd. Regel wel dat een klant altijd een mens kan bereiken.',[('/ai-chatbot-website/','een chatbot op je website')],''),
('Vertalen','<path d="M4 5h8M8 3v2M5 11c2-1 4-3.5 5-6M6 7c1 2 3 3.5 5 4"/><path d="m12 21 4.5-10 4.5 10M13.5 18h6"/>','Mails, teksten en documenten vertalen met AI. Laat een belangrijke vertaling altijd nalezen door iemand die de taal goed kent.',[('/ai-vertalen/','teksten en documenten vertalen')],''),
('Website &amp; bezoekers','<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>','Een website maken met AI, en zien welke bedrijven hem bezoeken. Let op de verlengprijs en op wat de AVG van je vraagt.',[('/ai-website-maken/','een website maken met AI'),('/websitebezoekers-herkennen/','websitebezoekers herkennen')],''),
('Data &amp; analyse','<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>','Je cijfers laten analyseren met AI of in een dashboard zetten, zonder dat je data-analist bent.',[('/ai-data-analyse/','je cijfers in een dashboard')],''),
]
METH=[
('Onafhankelijk','<path d="M12 3v18M5 7h14"/><path d="M5 7l-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>','De volgorde volgt uit wat bij jouw situatie past. Een vergoeding van een aanbieder verandert daar niets aan. Komen er partnerlinks, dan worden die bij de knoppen vermeld.'),
('Privacy en AVG','<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/>','We kijken waar een tool je gegevens opslaat (in de EU of daarbuiten), of er een verwerkersovereenkomst is en of je invoer wordt gebruikt om AI te trainen. Dat kan net zo zwaar wegen als de prijs.'),
('Echte kosten per maand','<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/>','We rekenen met wat je echt betaalt: per maand, inclusief of exclusief btw zoals de aanbieder het vermeldt, en met de beperkingen van een gratis versie. Bij elke prijs staat de bron en de datum waarop we keken.'),
]
QS=[
('Wat gebeurt er met je gegevens?','Lees waar de gegevens worden opgeslagen, of de aanbieder je invoer gebruikt om zijn AI-model te trainen en of je dat kunt uitzetten. Werk je met gegevens van klanten, vraag dan naar een verwerkersovereenkomst. Lees <a href="/gids/ai-veilig-gebruiken/">wat er met je gegevens gebeurt</a> en wat je kunt instellen.'),
('Wat kost het echt?','Kijk verder dan de prijs op de homepage. Gaat het om een maand- of jaarprijs, is het met of zonder btw, en wat zit er niet in de gratis versie? Tel ook mee wat je al betaalt: misschien zit de functie al in een tool die je hebt. Zie <a href="/gids/wat-kosten-ai-abonnementen/">wat AI-abonnementen echt kosten</a>.'),
('Hoe kom je er weer vanaf?','Check de opzegtermijn, of een jaarabonnement automatisch verlengt en of je je eigen gegevens kunt exporteren voordat je stopt.'),
('Werkt het goed in het Nederlands?','Niet elke tool schrijft, verstaat of vat Nederlands even goed samen. Probeer het met een echte opdracht uit je eigen werk, liefst in een gratis proefperiode.'),
('Past het bij wat je al gebruikt?','Een tool die niet koppelt met je mail, agenda of boekhouding levert vaak extra werk op. Kijk welke koppelingen er zijn, en of die in jouw abonnement zitten.'),
]
FAQ=[
('Wat is ToolMatch?','ToolMatch is een Nederlandse site die ondernemers helpt om de juiste (AI-)tools te kiezen: voor tekst, offertes, facturatie, planning, klantbeheer, notuleren, ontwerp en automatisering. We kijken naar wat je werk vraagt, wat een tool echt per maand kost en hoe er met je gegevens wordt omgegaan.'),
('Voor wie is ToolMatch bedoeld?','Voor ondernemers die zelf hun tools kiezen: van zzp\'ers en freelancers tot kleine bedrijven met een paar mensen. Je hebt geen technische kennis nodig.'),
('Kost ToolMatch iets?','Nee. ToolMatch is gratis te gebruiken en je hebt geen account nodig.'),
('Verdient ToolMatch aan de tools die jullie noemen?','Er kunnen partnerlinks op de site komen. Klik je daarop en neem je een abonnement, dan kan ToolMatch een vergoeding krijgen. Zo\'n link wordt bij de knoppen vermeld, en een vergoeding bepaalt nooit de volgorde of de uitkomst van een vergelijking.'),
('Mag ik gegevens van klanten in een AI-tool zetten?','Dat hangt af van de tool en van wat je erin zet. Gaat het om persoonsgegevens, dan geldt de AVG en ben jij verantwoordelijk voor wat ermee gebeurt. Kijk daarom of de aanbieder een verwerkersovereenkomst biedt, waar de gegevens worden opgeslagen en of je invoer wordt gebruikt om het AI-model te trainen. Twijfel je, laat persoonsgegevens dan weg.'),
]
ld={"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":D+"/#organization","name":"ToolMatch","alternateName":"Redactie ToolMatch","url":D+"/","logo":D+"/favicon.svg","email":"info@toolmatch.nl","description":"Onafhankelijke Nederlandse site die ondernemers helpt de juiste (AI-)tools te kiezen.","contactPoint":{"@type":"ContactPoint","email":"info@toolmatch.nl","contactType":"customer support","availableLanguage":"nl"}},
{"@type":"WebSite","@id":D+"/#website","url":D+"/","name":"ToolMatch","description":"De juiste (AI-)tools voor ondernemers.","inLanguage":"nl-NL","publisher":{"@id":D+"/#organization"}},
{"@type":"FAQPage","@id":D+"/#faq","inLanguage":"nl-NL","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in FAQ]}]}
LD='<script type="application/ld+json">\n'+json.dumps(ld,ensure_ascii=False,indent=1)+'\n</script>\n'
CHECK='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#0f6e6e"/><path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
ART=open('scripts/hero.svg').read()
def catlinks(ls): return ('\n          <ul class="go-l">'+''.join(f'<li><a href="{h}">{a}</a></li>' for h,a in ls)+'</ul>') if ls else ''
cats=''.join(f'''        <article class="cat">
          <div class="ico">{ico(p)}</div>
          <h3>{t}</h3>
          <p>{d}</p>{catlinks(ls)}{x}
        </article>
''' for t,p,d,ls,x in CATS)
meth=''.join(f'''        <div class="m">
          <span class="num" data-n="0{i+1}" aria-hidden="true"></span>
          <div class="mi">{ico(p)}</div>
          <h3>{t}</h3>
          <p>{d}</p>
        </div>
''' for i,(t,p,d) in enumerate(METH))
qs=''.join(f'          <li><div><h3>{q}</h3><p>{a}</p></div></li>\n' for q,a in QS)
faq=''.join(f'      <details>\n        <summary>{q}</summary>\n        <p>{a}</p>\n      </details>\n' for q,a in FAQ)
TITLE="AI-tools voor ondernemers: kies wat past | ToolMatch"
DESC="Welke (AI-)tools heb je als ondernemer echt nodig? ToolMatch helpt je kiezen op wat je doet, wat het per maand kost en waar je gegevens staan."
idx=head('/',TITLE,DESC,"ToolMatch: de juiste (AI-)tools voor ondernemers",LD)+f'''
<main id="inhoud">
  <section class="hero" aria-labelledby="h1">
    <div class="wrap">
      <div>
        <span class="eyebrow">Voor ondernemers</span>
        <h1 id="h1">Kies de <span class="hl">(AI-)tools</span> die je werk écht lichter maken</h1>
        <p class="lead">Er komen steeds nieuwe AI-tools bij, en veel ervan werken met een maandabonnement. ToolMatch helpt je als ondernemer kiezen wat je echt nodig hebt. Zo verspil je geen geld aan dubbele abonnementen en geen tijd aan tools die niet bij je werk passen.</p>
        <div class="actions">
          <a class="btn" href="/keuzehulp/">Start de keuzehulp <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <a class="btn ghost" href="#categorieen">Bekijk de categorieën</a>
        </div>
        <ul class="trust">
          <li>{CHECK}Onafhankelijk</li>
          <li>{CHECK}Echte kosten per maand</li>
          <li>{CHECK}Privacy en AVG als criterium</li>
        </ul>
      </div>
      <div class="hero-art">
{ART}
      </div>
    </div>
  </section>

  <section class="sec" id="categorieen" aria-labelledby="h-cat">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow">Categorieën</span>
        <h2 id="h-cat">Kies een categorie</h2>
        <p>Per categorie zetten we de tools naast elkaar, met wat ze kosten, waar je gegevens staan en de bron bij elke prijs. Weet je nog niet waar je moet beginnen? <a href="/keuzehulp/">Doe de keuzehulp in 5 vragen</a>.</p>
      </div>
      <div class="cats">
{cats}      </div>
      <p class="hub-l">Twee bekende tools naast elkaar? Bekijk <a href="/vergelijken/">alle vergelijkingen</a>.</p>
    </div>
  </section>

  <section class="sec tint" id="zo-vergelijken-we" aria-labelledby="h-zo">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow">Werkwijze</span>
        <h2 id="h-zo">Zo vergelijken wij</h2>
        <p>Een vergelijking heb je alleen iets aan als je hem kunt vertrouwen. Daarom houden we ons aan drie vaste regels.</p>
      </div>
      <div class="method">
{meth}      </div>
      <div class="pledge">{ico('<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>')}<p>We verzinnen geen cijfers, beoordelingen of reviews. Weten we iets niet zeker, dan schrijven we dat erbij.</p></div>
    </div>
  </section>

  <section class="sec warm" id="vijf-vragen" aria-labelledby="h-vragen">
    <div class="wrap split">
      <div class="sec-head">
        <span class="eyebrow">Checklist</span>
        <h2 id="h-vragen">5 vragen voordat je een AI-tool kiest</h2>
        <p>Een proefperiode is snel gestart, een abonnement nog sneller vergeten. Loop deze vragen even langs voordat je ergens je gegevens of je creditcard invult. Meer uitleg staat in onze <a href="/gids/">gidsen over veilig en slim AI gebruiken</a>.</p>
      </div>
      <ol class="qs">
{qs}      </ol>
    </div>
  </section>

  <section class="sec" id="faq" aria-labelledby="h-faq">
    <div class="wrap faq">
      <div class="sec-head">
        <span class="eyebrow">Veelgestelde vragen</span>
        <h2 id="h-faq">Goed om te weten</h2>
      </div>
{faq}    </div>
  </section>

  <section class="sec tint" id="contact" aria-labelledby="h-contact">
    <div class="wrap">
      <div class="cta-band">
        <div>
          <h2 id="h-contact">Een vraag, een tip of een fout gezien?</h2>
          <p>Mail ons op info@toolmatch.nl. We lezen alles en werken de site bij als iets niet klopt.</p>
        </div>
        <a class="btn" href="mailto:info@toolmatch.nl">Mail info@toolmatch.nl</a>
      </div>
    </div>
  </section>
</main>

'''+FOOT
open('index.html','w').write(idx)

def sub(path,title,desc,crumb,h1,lead,body):
    return head(path,title,desc,title)+f'''
<main id="inhoud">
  <section class="page-hero">
    <div class="wrap">
      <p class="crumbs"><a href="/">Home</a> › {crumb}</p>
      <h1>{h1}</h1>
      <p class="lead">{lead}</p>
    </div>
  </section>
  <div class="wrap">
    <div class="prose">
{body}
    </div>
  </div>
</main>

'''+FOOT
PRIV='''      <h2 id="cookies">Cookies en statistieken</h2>
      <p>Als je de site voor het eerst bezoekt, vragen we of je cookies voor statistieken goedvindt. Je kiest zelf: <strong>Accepteren</strong> of <strong>Weigeren</strong>.</p>
      <ul>
        <li><strong>Weiger je, of kies je niets?</strong> Dan plaatsen we geen cookies en laden we geen statistieken. Er gaat dan geen verzoek naar Google.</li>
        <li><strong>Accepteer je?</strong> Dan meten we met Google Analytics 4 hoe de site wordt gebruikt, bijvoorbeeld welke pagina's worden bekeken. Google Analytics zet daarvoor cookies (_ga en _ga_…), die maximaal 12 maanden bewaard blijven.</li>
      </ul>
      <p>We hebben Google Analytics zo ingesteld dat er geen advertentiegegevens worden gedeeld: Google-signalen en advertentiepersonalisatie staan uit. We sturen alleen het adres van de pagina mee, zonder de extra tekst achter het vraagteken.</p>
      <p>Je keuze bewaren we in de opslag van je eigen browser (geen cookie). Na 12 maanden vragen we het opnieuw.</p>
      <p><strong>Van gedachten veranderd?</strong> Via <a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a> (ook onderaan elke pagina) pas je je keuze aan. Kies je Weigeren, dan stoppen de statistieken en wissen we de Analytics-cookies.</p>

      <h2>Geen account, geen nieuwsbrief</h2>
      <p>Je hoeft geen account aan te maken en er is geen nieuwsbrief. Je antwoorden in de keuzehulp blijven in je browser en staan alleen in de adresbalk; die tekst sturen we nooit naar Google.</p>

      <h2>Links naar aanbieders</h2>
      <p>Klik je door naar een aanbieder of neem je daar een abonnement, dan geldt de privacyverklaring van die aanbieder.</p>
      <p>Partnerlinks worden bij de knoppen vermeld. Klik je erop, dan ga je via een affiliatenetwerk (Daisycon) naar de aanbieder. Dat netwerk plaatst op zijn eigen domein een cookie of klik-ID, om vast te leggen dat je via ToolMatch kwam. Sluit je iets af, dan kunnen wij daardoor een vergoeding krijgen. Het netwerk is zelf verantwoordelijk voor die gegevens; zie het privacybeleid van <a href="https://daisycon.com/en/legal-information/privacy-policy/" rel="noopener">Daisycon</a>.</p>

      <h2>Als je ons mailt</h2>
      <p>Mail je naar <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a>, dan gebruiken we je mailadres en je bericht alleen om je te antwoorden. We delen ze met niemand.</p>

      <h2>Hosting</h2>
      <p>De site draait op GitHub Pages. Zoals bij elke website verwerkt de hostingpartij technische gegevens, zoals je IP-adres, om de pagina's te kunnen tonen en de site te beveiligen.</p>

      <h2>Je rechten</h2>
      <p>Je mag vragen welke gegevens we van je hebben en vragen om ze te laten verwijderen. Mail daarvoor naar <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a>. Ben je het niet eens met hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de <a href="https://www.autoriteitpersoonsgegevens.nl/" rel="noopener">Autoriteit Persoonsgegevens</a>.</p>

      <p class="note">Redactie ToolMatch · bijgewerkt op 28 oktober 2026</p>'''
OVER='''      <h2>Wie we zijn</h2>
      <p>ToolMatch wordt gemaakt door Redactie ToolMatch. We zoeken uit wat tools echt doen, wat ze per maand kosten en hoe ze met je gegevens omgaan. Dat zetten we in gewone taal op een rij, voor ondernemers die zelf hun tools kiezen: van zzp'ers tot kleine teams.</p>

      <h2>Zo werken we</h2>
      <ul>
        <li><strong>Onafhankelijk.</strong> De volgorde in een vergelijking volgt uit wat bij jouw situatie past, nooit uit een vergoeding.</li>
        <li><strong>Partnerlinks herkenbaar.</strong> Komen er partnerlinks, dan worden die bij de knoppen vermeld.</li>
        <li><strong>Alleen echte gegevens.</strong> Prijzen en functies halen we bij de aanbieder zelf, met de bron en de datum erbij. We verzinnen geen cijfers, beoordelingen of reviews.</li>
        <li><strong>Privacy telt mee.</strong> Waar je gegevens staan en wat een tool ermee doet, weegt mee in onze vergelijkingen.</li>
      </ul>

      <h2>Contact</h2>
      <p>Een vraag, een tip of een fout gezien? Mail naar <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a>.</p>'''
open('privacy/index.html','w').write(sub('/privacy/','Privacy en cookies | ToolMatch','Hoe ToolMatch met je gegevens omgaat: geen cookies zonder toestemming, en Google Analytics alleen als je op Accepteren klikt.','Privacy en cookies','Privacy en cookies','ToolMatch verzamelt zo min mogelijk. Zonder jouw toestemming plaatsen we geen cookies en meten we niets.',PRIV))
open('over/index.html','w').write(sub('/over/','Over ToolMatch: wie we zijn en hoe we werken','ToolMatch helpt ondernemers de juiste (AI-)tools kiezen. Lees hoe Redactie ToolMatch werkt: onafhankelijk, met echte prijzen en privacy als criterium.','Over ToolMatch','Over ToolMatch','ToolMatch helpt ondernemers de juiste (AI-)tools te kiezen, zonder geld en tijd te verspillen aan abonnementen die niet bij hun werk passen.',OVER))
exec(open('scripts/pages.py').read())
exec(open('scripts/spokes.py').read())
exec(open('scripts/website_leads.py').read())
URLS+=SPOKES
# Pagina's met schema-update 26-10: Article image (vergelijken/gids) en BreadcrumbList (losse pagina's).
LASTMOD={u:'2026-10-26' for u in URLS if u in BC_LOSSE or (u.startswith(('/vergelijken/','/gids/')) and u not in ('/vergelijken/','/gids/'))}
LASTMOD.update(WL_LASTMOD)
LASTMOD.update(VALUTA_UPD); LASTMOD['/keuzehulp/']='2026-10-27'
LASTMOD['/partnerlinks/']='2026-10-28'; LASTMOD['/privacy/']='2026-10-28'  # partnerlink Hostinger: stand van zaken + privacysectie
LASTMOD.update({u:'2026-10-29' for u in ('/ai-afbeeldingen-en-ontwerp/','/ai-assistenten/','/ai-chatbot-website/','/ai-data-analyse/','/ai-mail-en-offertes/','/ai-notuleren/','/ai-tekst-schrijven/','/automatiseren-zonder-code/','/crm-klein-bedrijf/','/online-afspraken-plannen/','/social-media-inplannen/','/gids/ai-veilig-gebruiken/','/gids/ai-beleid-opstellen/')})  # Verder lezen + gidslinks 29-10 (L7)
LASTMOD.update(NOTULY_UPD)  # Notuly op /ai-notuleren/ 30-10 (L7)
LASTMOD.update(LOGO_UPD); LASTMOD['/keuzehulp/']='2026-10-30'  # logo's van aanbieders 30-10 (L7)
LASTMOD.update(PRIJS_UPD)  # NL-IP-prijscheck 30-10 (L7)
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{D}{u}</loc><lastmod>{LASTMOD.get(u,GC)}</lastmod></url>\n' for u in URLS)+'</urlset>\n')
