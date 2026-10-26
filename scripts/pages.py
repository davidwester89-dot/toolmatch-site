# Extra pagina's (keuzehulp, contact, disclaimer, partnerlinks, 404) plus sitemap en robots. Wordt uitgevoerd door build.py.
TOOLS_DATA=json.loads(subprocess.check_output(['node','--input-type=module','-e',
 "import {TOOLS,DOELEN,GECONTROLEERD} from './js/lib/tools.js'; console.log(JSON.stringify({TOOLS,DOELEN,GECONTROLEERD}))"]))
TL=TOOLS_DATA['TOOLS']; DL=TOOLS_DATA['DOELEN']; GC=TOOLS_DATA['GECONTROLEERD']
MAANDEN=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']
y,m,d=GC.split('-'); GCN=f'{int(d)} {MAANDEN[int(m)-1]} {y}'
E=html.escape
def page(path,title,desc,crumb,h1,lead,body,js='/js/consent.js',wide=False,extra='',robots=None):
    h=head(path,title,desc,title,extra)
    if robots: h=h.replace('<meta name="robots" content="index, follow">',f'<meta name="robots" content="{robots}">')
    inner=body if wide else f'''    <div class="prose">
{body}
    </div>'''
    return h+f'''
<main id="inhoud">
  <section class="page-hero">
    <div class="wrap">
      <p class="crumbs"><a href="/">Home</a> › {crumb}</p>
      <h1>{h1}</h1>
      <p class="lead">{lead}</p>
    </div>
  </section>
  <div class="wrap">
{inner}
  </div>
</main>

'''+foot(js)
def write(path,txt):
    os.makedirs(os.path.dirname(path) or '.',exist_ok=True); open(path,'w').write(txt)

# ---------- keuzehulp ----------
def radios(name,legend,opts,hint=''):
    o=''.join(f'<label class="opt"><input type="radio" name="{name}" value="{v}"{" required" if i==0 else ""}><span>{t}</span></label>' for i,(v,t) in enumerate(opts))
    hint=f'<p class="hint">{hint}</p>' if hint else ''
    return f'''        <fieldset class="q">
          <legend>{legend}</legend>{hint}
          <div class="opts">{o}</div>
        </fieldset>
'''
FORM=f'''      <form id="form" class="kh" aria-describedby="kh-uitleg">
        <p id="kh-uitleg" class="sr">Vijf vragen. Na het versturen verschijnt je match onder het formulier.</p>
{radios('doel','1. Waar wil je vooral hulp bij?',list(DL.items()))}{radios('budget','2. Wat mag het kosten?',[('gratis','Alleen gratis'),('klein','Tot ongeveer 30 per maand'),('ruim','Maakt niet zoveel uit')])}{radios('team','3. Voor hoeveel mensen?',[('alleen','Alleen ik'),('klein','2 tot 10 mensen'),('groot','Meer dan 10 mensen')])}{radios('privacy','4. Is opslag in de EU belangrijk?',[('eu','Belangrijk: liefst in de EU'),('normaal','Geen harde eis')],'Werk je met gegevens van klanten, dan helpt opslag in de EU bij de AVG. Lees ook hoe je <a href="/gids/ai-veilig-gebruiken/">gegevens van klanten veilig houdt</a>.')}{radios('techniek','5. Hoe technisch ben je?',[('beginner','Ik wil het simpel'),('handig','Ik ben redelijk handig'),('technisch','Ik ben technisch')])}        <button type="submit" class="btn">Toon mijn match</button>
      </form>
      <noscript><p class="pledge-n">De keuzehulp werkt met JavaScript. Hieronder staan alle tools met hun gegevens en bronnen.</p></noscript>
      <section id="resultaat" class="kh-res" aria-live="polite" hidden></section>
'''
INSTAP={'eenvoudig':'Eenvoudig','gemiddeld':'Gemiddeld','technisch':'Technisch'}
EUT={'ja':'In de EU','deels':'Vooral in de EU'}
rows=''.join(f'''          <tr><th scope="row">{E(t['naam'])}</th><td>{', '.join(E(DL[x]) for x in t['doelen'])}</td><td>{'Ja' if t['gratis'] is True else ('Nee' if t['gratis'] is False else 'Niet gecontroleerd')}</td><td>{E(t['prijs']) if t['prijs'] else 'Niet gecontroleerd'}</td><td>{EUT.get(t['eu'],'Niet gecontroleerd')}</td><td>{INSTAP[t['instap']]}</td><td>{', '.join(f'<a href="{E(u)}" rel="noopener">{E(n)}</a>' for n,u in t['bronnen'])}</td></tr>
''' for t in sorted(TL,key=lambda t:t['naam'].lower()) if t['doelen'])
KH_FAQ=[('Hoe komt de volgorde tot stand?','Je antwoorden geven punten volgens vaste regels: je doel telt het zwaarst, daarna budget, team, privacy en techniek. Bij gelijke punten staan de tools op alfabetische volgorde.'),
 ('Hebben partnerlinks invloed op de uitkomst?','Nee. De berekening gebruikt geen partnerlinks. Staat er ooit een partnerlink bij een resultaat, dan wordt dat bij de knoppen vermeld en verandert de volgorde niet.'),
 ('Bewaren jullie mijn antwoorden?','Nee. Je antwoorden blijven in je browser en staan alleen in de adresbalk. We sturen ze nooit naar Google.'),
 ('Waar komen de prijzen vandaan?','Van de sites van de aanbieders, met de bron en de datum erbij. We noemen alleen bedragen in euro. Konden we geen europrijs nalezen, dan staat alleen het pakket er en vind je het bedrag via de bron. Konden we iets niet controleren, dan staat er "niet gecontroleerd".')]
KH_FAQ_HTML='      <h2 id="faq">Vragen over de keuzehulp</h2>\n      <div class="faq">\n'+''.join(f'      <details>\n        <summary>{q}</summary>\n        <p>{a}</p>\n      </details>\n' for q,a in KH_FAQ)+'      </div>\n'
KH=f'''    <div class="kh-wrap">
{FORM}    </div>
    <div class="prose wide">
      <h2 id="zo-werkt-het">Zo werkt de keuzehulp</h2>
      <p>Je antwoorden geven punten. Een tool die gemaakt is voor jouw doel krijgt de meeste punten, een tool die het als bijfunctie kan minder. Daarna tellen een gratis versie of een lage prijs mee als je budget klein is, een teamabonnement als je met meer mensen werkt, opslag in de EU als je dat belangrijk vindt, en hoe makkelijk je ermee start. Bij gelijke punten staan de tools op alfabetische volgorde.</p>
      <ul>
        <li><strong>Geen invloed van vergoedingen.</strong> De berekening kent geen partnerlinks. Staat er onder een resultaat ooit een partnerlink, dan wordt dat bij de knoppen vermeld en verandert de volgorde niet. Lees meer over <a href="/partnerlinks/">partnerlinks</a>.</li>
        <li><strong>Alleen wat we konden controleren.</strong> Prijzen en privacygegevens komen van de site van de aanbieder. Konden we iets niet bevestigen, dan staat er "niet gecontroleerd" en telt het niet als pluspunt.</li>
        <li><strong>Instap is onze eigen indeling.</strong> Eenvoudig: je kunt direct beginnen. Gemiddeld: je moet het even inrichten. Technisch: je hebt er meer aan als je met code of zelf hosten overweg kunt.</li>
        <li><strong>Prijzen in euro.</strong> Met of zonder btw zoals de aanbieder het vermeldt. Konden we op een Nederlandse prijspagina geen europrijs nalezen, dan noemen we alleen het pakket; het bedrag zie je dan op de prijspagina bij de bron. Bij "per maand bij jaarbetaling" betaal je per jaar vooruit.</li>
      </ul>
      <h2 id="alle-tools">Alle tools in de keuzehulp</h2>
      <p>Gecontroleerd op {GCN}; de prijzen hebben we op 26 oktober 2026 opnieuw nagelezen. Klopt er iets niet meer? Mail naar <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a>.</p>
      <div class="tbl" role="region" aria-labelledby="alle-tools" tabindex="0">
        <table>
          <thead><tr><th scope="col">Tool</th><th scope="col">Geschikt voor</th><th scope="col">Gratis versie</th><th scope="col">Betaald vanaf</th><th scope="col">Gegevens</th><th scope="col">Instap</th><th scope="col">Bron</th></tr></thead>
          <tbody>
{rows}          </tbody>
        </table>
      </div>
{KH_FAQ_HTML}      <p class="note">Redactie ToolMatch · gecontroleerd op 20 oktober 2026, bijgewerkt op 27 oktober 2026. De keuzehulp is een hulpmiddel, geen persoonlijk advies.</p>
    </div>'''
KH_LD='<script type="application/ld+json">\n'+json.dumps({"@context":"https://schema.org","@graph":[
 {"@type":"WebApplication","name":"Keuzehulp (AI-)tools voor ondernemers","url":D+"/keuzehulp/","applicationCategory":"BusinessApplication","operatingSystem":"Web","inLanguage":"nl-NL","isAccessibleForFree":True,"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR"},"publisher":{"@id":D+"/#organization"}},
 {"@type":"WebPage","@id":D+"/keuzehulp/","url":D+"/keuzehulp/","name":"Keuzehulp: welke (AI-)tool past bij jou?","inLanguage":"nl-NL","isPartOf":{"@id":D+"/#website"},"publisher":{"@id":D+"/#organization"},"dateModified":"2026-10-27"},
 {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":D+"/"},{"@type":"ListItem","position":2,"name":"Keuzehulp","item":D+"/keuzehulp/"}]},
 {"@type":"FAQPage","@id":D+"/keuzehulp/#faq","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in KH_FAQ]}]},ensure_ascii=False,indent=1)+'\n</script>\n'
write('keuzehulp/index.html',page('/keuzehulp/','Keuzehulp: welke (AI-)tool past bij jou? | ToolMatch',
 'Beantwoord 5 vragen en zie welke (AI-)tools passen bij je doel, budget, team en privacy-eisen. Gratis, zonder account, met bronnen.',
 'Keuzehulp','Welke (AI-)tool past bij jou?','Vijf korte vragen over je doel, budget, team, privacy en techniek. Je ziet direct welke tools het best passen, met prijs en bron.',KH,js='/js/keuzehulp.js',wide=True,extra=KH_LD))

# ---------- contact ----------
write('contact/index.html',page('/contact/','Contact | ToolMatch','Een vraag, een tip of een fout gezien op ToolMatch? Mail naar info@toolmatch.nl. We passen de site aan als iets niet klopt.',
 'Contact','Contact','Een vraag, een fout gezien of een prijs die veranderd is? Mail ons op <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a>.','''      <ul>
        <li><strong>Fout of verouderde prijs:</strong> stuur de link naar de bron mee, dan passen we het snel aan.</li>
        <li><strong>Aanbieder?</strong> Je mag ons wijzen op nieuwe prijzen of functies. Een plek in de keuzehulp of in de volgorde kun je niet kopen.</li>
        <li><strong>Persoonlijk advies</strong> over je bedrijf, je contracten of je belastingen geven we niet.</li>
      </ul>
      <p>We gebruiken je mailadres en je bericht alleen om je te antwoorden. Lees meer in onze <a href="/privacy/">privacyverklaring</a>.</p>
      <p><a class="btn" href="mailto:info@toolmatch.nl">Mail info@toolmatch.nl</a></p>'''))

# ---------- disclaimer ----------
write('disclaimer/index.html',page('/disclaimer/','Disclaimer | ToolMatch','ToolMatch geeft een overzicht van (AI-)tools op basis van wat aanbieders zelf publiceren. Zo lees je prijzen, de keuzehulp en partnerlinks.',
 'Disclaimer','Disclaimer','ToolMatch geeft een overzicht van (AI-)tools op basis van wat de aanbieders zelf publiceren. We doen ons best om alles juist en actueel te houden, en zetten bij de gegevens de datum van de laatste controle.',f'''      <h2>Prijzen en functies</h2>
      <p>Alle bedragen en functies komen van de sites van de aanbieders, op de datum die erbij staat. Aanbieders kunnen hun prijzen, abonnementen en voorwaarden wijzigen. Wat de aanbieder je bij het afsluiten aanbiedt, gaat altijd voor.</p>
      <h2>De keuzehulp</h2>
      <p>De keuzehulp is een hulpmiddel op basis van vaste regels en je antwoorden. Het is een eerste selectie, geen persoonlijk advies over je bedrijf. Lees <a href="/keuzehulp/#zo-werkt-het">hoe de keuzehulp werkt</a>.</p>
      <h2>Privacy en AVG</h2>
      <p>Wat we schrijven over opslag in de EU en het gebruik van je gegevens komt uit de informatie van de aanbieder. Het vervangt geen eigen controle. Werk je met persoonsgegevens van klanten, kijk dan zelf naar de verwerkersovereenkomst en de voorwaarden van de tool.</p>
      <h2>Partnerlinks</h2>
      <p>Bij sommige aanbieders kunnen we een vergoeding krijgen als je via ons een abonnement neemt. Partnerlinks worden bij de knoppen vermeld. Partnerlinks hebben geen invloed op de keuzehulp of de volgorde. Meer uitleg staat op <a href="/partnerlinks/">partnerlinks</a>.</p>
      <h2>Merken</h2>
      <p>Merknamen zijn van de betreffende aanbieders. ToolMatch is onafhankelijk en geen onderdeel van deze aanbieders.</p>
      <h2>Fout gezien?</h2>
      <p>Mail naar <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a>, dan passen we het aan.</p>
      <p class="note">Redactie ToolMatch · bijgewerkt op {GCN}</p>'''))

# ---------- partnerlinks ----------
write('partnerlinks/index.html',page('/partnerlinks/','Partnerlinks: zo verdient ToolMatch geld','ToolMatch is gratis. Hoe verdienen we geld? Met partnerlinks die altijd herkenbaar zijn en nooit de volgorde of de keuzehulp beïnvloeden.',
 'Partnerlinks','Partnerlinks: zo verdienen we geld','ToolMatch is gratis en je hebt geen account nodig. Om de site te kunnen maken, kunnen we partnerlinks gebruiken. Hier lees je wat dat betekent.',f'''      <h2>Wat is een partnerlink?</h2>
      <p>Een partnerlink is een link naar een aanbieder waarbij ToolMatch een vergoeding kan krijgen als je via die link een abonnement neemt. Voor jou verandert de prijs daardoor niet.</p>
      <h2>Zo herken je ze</h2>
      <ul>
        <li>Partnerlinks worden bij de knoppen vermeld.</li>
        <li>Zo'n link heeft in de code <code>rel="sponsored nofollow"</code>, zoals zoekmachines vragen.</li>
        <li>Alle andere links naar aanbieders zijn gewone links naar hun eigen site.</li>
      </ul>
      <h2>Geen invloed op de volgorde</h2>
      <p>De keuzehulp en onze vergelijkingen rekenen alleen met wat bij jouw situatie past: je doel, budget, team, privacy-eisen en techniek. De partnerlinks staan in een apart bestand dat de berekening niet gebruikt. Een aanbieder kan geen betere plek kopen.</p>
      <h2>Stand van zaken</h2>
      <p>Op dit moment staan er nog geen partnerlinks op ToolMatch. Alle links naar aanbieders zijn gewone links.</p>
      <h2>Vragen?</h2>
      <p>Mail naar <a href="mailto:info@toolmatch.nl">info@toolmatch.nl</a>.</p>
      <p class="note">Redactie ToolMatch · bijgewerkt op {GCN}</p>'''))

# ---------- 404 ----------
write('404.html',page('/404.html','Pagina niet gevonden | ToolMatch','Deze pagina bestaat niet (meer). Ga naar de homepage of start de keuzehulp.','Niet gevonden','Pagina niet gevonden','Deze pagina bestaat niet (meer).','''      <p><a class="btn" href="/keuzehulp/">Start de keuzehulp</a></p>
      <p>Of ga naar de <a href="/">homepage</a>.</p>''',robots='noindex, follow').replace(f'<link rel="canonical" href="{D}/404.html">\n',''))

# ---------- sitemap + robots ----------
URLS=['/','/keuzehulp/','/over/','/partnerlinks/','/contact/','/disclaimer/','/privacy/']
_sm=('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{D}{u}</loc><lastmod>{GC}</lastmod></url>\n' for u in URLS)+'</urlset>\n')
write('robots.txt',f'User-agent: *\nAllow: /\n\nSitemap: {D}/sitemap.xml\n')
