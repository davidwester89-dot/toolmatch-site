# Fase 2: categoriepagina's, vergelijkingen, gidsen en hubs. Wordt uitgevoerd door build.py (na pages.py).
PL=json.loads(subprocess.check_output(['node','--input-type=module','-e',
 "import {PARTNERLINKS} from './js/lib/partnerlinks.js'; console.log(JSON.stringify(PARTNERLINKS))"]))
T={t['id']:t for t in TL}
LOGOS=json.loads(subprocess.check_output(['node','--input-type=module','-e',
 "import {LOGOS} from './js/lib/logos.js'; console.log(JSON.stringify(LOGOS))"]))
def LG(i,px=24,naam=''):
    """Logo in een vast vak (zelfde maat voor elke aanbieder, partner of niet); decoratief (alt="", aria-hidden), de naam staat ernaast; geen logo = neutrale letter. Zelfde markup als js/lib/logos.js."""
    if i not in LOGOS: return f'<span class="tlogo tlogo-f" style="width:{px}px;height:{px}px" aria-hidden="true">{E((naam or i)[0].upper())}</span>'
    return f'<img class="tlogo" src="/logos/{i}.webp" alt="" aria-hidden="true" width="{px}" height="{px}" loading="lazy" decoding="async">'
_ORDE=json.loads(subprocess.check_output(['node','-e',
 "const n=JSON.parse(process.argv[1]); const c=new Intl.Collator('nl',{sensitivity:'base'}); console.log(JSON.stringify(n.sort(c.compare)))",
 json.dumps([t['naam'] for t in TL])]))
def alfa(paren): return sorted(paren,key=lambda p:_ORDE.index(T[p[0]]['naam']))
def L(href,txt): return f'<a href="{href}">{txt}</a>'
def X(href,txt): return f'<a href="{E(href)}" rel="noopener">{txt}</a>'
PUB='2026-10-20'
# Schema-update 26-10 (image in Article = de og:image van de pagina): dateModified en sitemap-lastmod van de gewijzigde pagina's.
SCHEMA_UPD='2026-10-26'
# Valuta-fix (alleen euro's): inhoudelijk gewijzigd, dateModified en lastmod = pushdatum.
VALUTA_UPD={u:'2026-10-27' for u in ('/gids/wat-kosten-ai-abonnementen/','/ai-afbeeldingen-en-ontwerp/','/ai-assistenten/','/ai-chatbot-website/','/ai-data-analyse/','/ai-mail-en-offertes/','/ai-notuleren/','/ai-tekst-schrijven/','/ai-vertalen/','/automatiseren-zonder-code/','/crm-klein-bedrijf/','/online-afspraken-plannen/','/social-media-inplannen/','/vergelijken/chatgpt-vs-claude/','/vergelijken/chatgpt-vs-copilot/','/vergelijken/chatgpt-vs-gemini/','/vergelijken/zapier-vs-make-vs-n8n/')}
VERDER_UPD='2026-10-29'  # Verder lezen + gidslinks: zichtbare wijziging, L7
NOTULY_UPD={'/ai-notuleren/':'2026-10-30'}  # Notuly toegevoegd 30-10 (MM-OK): zichtbare wijziging, L7
LOGO_UPD={u:'2026-10-30' for u in ('/ai-afbeeldingen-en-ontwerp/','/ai-assistenten/','/ai-chatbot-website/','/ai-data-analyse/','/ai-mail-en-offertes/','/ai-notuleren/','/ai-tekst-schrijven/','/ai-vertalen/','/automatiseren-zonder-code/','/crm-klein-bedrijf/','/online-afspraken-plannen/','/social-media-inplannen/','/gids/wat-kosten-ai-abonnementen/','/vergelijken/chatgpt-vs-claude/','/vergelijken/chatgpt-vs-copilot/','/vergelijken/chatgpt-vs-gemini/','/vergelijken/zapier-vs-make-vs-n8n/')}  # logo's van aanbieders 30-10: zichtbare wijziging in de body, L7
VERDER_GIDS=('/gids/ai-veilig-gebruiken/','/gids/ai-beleid-opstellen/')
PRIJS_UPD={'/gids/ai-veilig-gebruiken/':'2026-10-30'}  # NL-IP-prijscheck 30-10: bronnen ChatGPT/Claude opnieuw bekeken (opt-out-claims nagelezen), L7
ORG={"@id":D+"/#organization"}
def ldscript(graph): return '<script type="application/ld+json">\n'+json.dumps({"@context":"https://schema.org","@graph":graph},ensure_ascii=False,indent=1)+'\n</script>\n'
def crumbs_ld(items): return {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":i+1,"name":n,"item":D+u} for i,(n,u) in enumerate(items)]}
def faq_ld(path,faq):
    strip=lambda s: re.sub(r'<[^>]+>','',s)
    return {"@type":"FAQPage","@id":D+path+"#faq","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":strip(a)}} for q,a in faq]}
def faq_html(faq):
    return '      <h2 id="faq">Veelgestelde vragen</h2>\n      <div class="faq">\n'+''.join(f'      <details>\n        <summary>{q}</summary>\n        <p>{a}</p>\n      </details>\n' for q,a in faq)+'      </div>\n'
# Bronnen die voor de valuta-fix op 26-10 voor het eerst zijn bekeken.
BRON_DATUM={'https://notuly.nl/prijzen':'30 oktober 2026','https://notuly.nl/privacy':'30 oktober 2026','https://www.notta.ai/nl/pricing':'26 oktober 2026','https://workspace.google.com/intl/nl/business/':'26 oktober 2026','https://www.deepl.com/nl/pro':'26 oktober 2026'}
# NL-IP-prijscheck 30-10 (site-checks/2026-10-30/tm-nl-ip-prijscheck.md): prijspagina's opnieuw bekeken vanuit Nederland.
BRON_BEKEKEN={'https://chatgpt.com/nl-NL/pricing':'30 oktober 2026','https://chatgpt.com/pricing':'30 oktober 2026','https://claude.com/pricing':'30 oktober 2026'}
def bronnen_html(srcs):
    seen=[]; 
    for s in srcs:
        if s not in seen: seen.append(s)
    return '      <h2 id="bronnen">Bronnen</h2>\n      <ul class="bronnen">\n'+''.join(f'        <li>{X(u,E(n.replace(' (NL-pagina van de aanbieder)','')))}, {('NL-pagina van de aanbieder, bekeken op '+BRON_DATUM[u]) if u in BRON_DATUM else 'bekeken op '+BRON_BEKEKEN.get(u,GCN)}</li>\n' for n,u in seen)+'      </ul>\n'
# Datumsweep 30-10: een kaart noemt naast "gecontroleerd op" ook de datum waarop een Nederlandse prijspagina later is nagelezen
# (BRON_DATUM, valuta-fix cd561d0 26-10), zodat de kaart niet tegenspreekt wat er in de bronnenlijst staat.
def kaartdatum(t): return datum_nl(t['gecontroleerd']) if t.get('gecontroleerd') else GCN
def nagelezen(t):
    d=sorted({BRON_DATUM[u] for _,u in t['bronnen'] if u in BRON_DATUM and BRON_DATUM[u]!=kaartdatum(t)})
    b=sorted({BRON_BEKEKEN[u] for _,u in t['bronnen'] if u in BRON_BEKEKEN and BRON_BEKEKEN[u]!=kaartdatum(t)})
    return (f'; Nederlandse prijspagina bekeken op {d[0]}' if len(d)==1 else '')+(f'; prijspagina bekeken op {b[0]}' if len(b)==1 and not d else '')
def byline(slug=None):
    if slug in LOGO_UPD: return '      <p class="note">Redactie ToolMatch · gecontroleerd op 20 oktober 2026, bijgewerkt op 30 oktober 2026. Prijzen zoals de aanbieder ze vermeldt; wat de aanbieder je bij het afsluiten aanbiedt, gaat voor.</p>\n'
    if slug in NOTULY_UPD: return '      <p class="note">Redactie ToolMatch · gecontroleerd op 20 oktober 2026, bijgewerkt op 30 oktober 2026. Prijzen zoals de aanbieder ze vermeldt; wat de aanbieder je bij het afsluiten aanbiedt, gaat voor.</p>\n'
    if slug in VERDER: return '      <p class="note">Redactie ToolMatch · gecontroleerd op 20 oktober 2026, bijgewerkt op 29 oktober 2026. Prijzen zoals de aanbieder ze vermeldt; wat de aanbieder je bij het afsluiten aanbiedt, gaat voor.</p>\n'
    if slug in VALUTA_UPD: return '      <p class="note">Redactie ToolMatch · gecontroleerd op 20 oktober 2026, bijgewerkt op 27 oktober 2026. Prijzen zoals de aanbieder ze vermeldt; wat de aanbieder je bij het afsluiten aanbiedt, gaat voor.</p>\n'
    return f'      <p class="note">Redactie ToolMatch · gecontroleerd op {GCN}. Prijzen zoals de aanbieder ze vermeldt; wat de aanbieder je bij het afsluiten aanbiedt, gaat voor.</p>\n'
JN=lambda v: 'Ja' if v is True else ('Nee' if v is False else 'Niet gecontroleerd')
EUL={'ja':'In de EU (volgens de aanbieder)','deels':'Vooral in de EU (volgens de aanbieder)'}
DPA={'ja':'Ja (volgens de aanbieder)','team':'Vanaf Team (volgens de aanbieder)'}
def dpa(t):
    if t.get('dpa'): return DPA[t['dpa']]
    if t.get('privacy') and re.search(r'verwerkersovereenkomst|DPA',t['privacy']): return 'Ja (volgens de aanbieder)'
    return 'Onbekend'
def knoplabel(t):
    v = t.get("vendor") or t["naam"]
    zicht = f"Naar de site van {v}"
    prod = t["naam"].replace(f" ({v})", "")
    if prod.startswith(v + " "): return zicht, f"Naar de site van {prod} (opent in een nieuw tabblad)"
    extra = f" ({prod})" if t.get("vendor") and prod != v else ""
    return zicht, f"{zicht}{extra} (opent in een nieuw tabblad)"

def uit(t):
    p=PL.get(t['id'])
    if p: return f'<a class="btn ghost" href="{E(p)}" rel="sponsored nofollow noopener" target="_blank" data-vendor="{t["id"]}" data-cta="partner" aria-label="{E(knoplabel(t)[1])}">{E(knoplabel(t)[0])}</a>'
    return f'<a class="btn ghost" href="{E(t["url"])}" rel="noopener" target="_blank" data-vendor="{t["id"]}" data-cta="outbound" aria-label="{E(knoplabel(t)[1])}">{E(knoplabel(t)[0])}</a>'
PNOOT='      <p class="pnoot">Sommige links zijn partnerlinks; dat verandert de volgorde nooit.</p>\n'
def met_noot(blok):
    """Precies één partnerzin direct na een blok waarin een partnerlink (rel sponsored) staat; anders niets."""
    return blok+PNOOT if re.search(r'<a\s[^>]*rel="[^"]*\bsponsored\b',blok) else blok
def datum_nl(iso): y,m,d=iso.split('-'); return f'{int(d)} {MAANDEN[int(m)-1]} {y}'
def kaart(t,past):
    pv=f'\n        <p class="priv">{E(t["privacy"])}</p>' if t.get('privacy') else ''
    return f'''      <article class="res tool" id="{t['id']}">
        <h3>{LG(t['id'],32)}{E(t['naam'])}</h3>
        <p>{E(t['wat'])}</p>
        <p><strong>Past als</strong> {past}</p>
        <dl class="facts">
          <div><dt>Gratis versie</dt><dd>{JN(t['gratis'])}</dd></div>
          <div><dt>Betaald vanaf</dt><dd>{E(t['prijs']) if t['prijs'] else 'Niet gecontroleerd'}</dd></div>
          <div><dt>Gegevens</dt><dd>{EUL.get(t['eu'],'Locatie niet gecontroleerd')}</dd></div>
          <div><dt>Verwerkersovereenkomst</dt><dd>{dpa(t)}</dd></div>
          <div><dt>Nederlands</dt><dd>{JN(t.get('nl'))}</dd></div>
          <div><dt>Instap</dt><dd>{INSTAP[t['instap']]} <small>(onze indeling)</small></dd></div>
        </dl>{pv}
        <p class="src">Bron: {', '.join(X(u,E(n)) for n,u in t['bronnen'])} · gecontroleerd op {kaartdatum(t)}{nagelezen(t)}</p>
        <p class="go">{uit(t)}</p>
      </article>
'''
def kort_tabel(ids,cap):
    rows=''.join(f'''          <tr><th scope="row"><a href="#{i}">{LG(i)}{E(T[i]['naam'])}</a></th><td>{JN(T[i]['gratis'])}</td><td>{E(T[i]['prijs']) if T[i]['prijs'] else 'Niet gecontroleerd'}</td><td>{EUL.get(T[i]['eu'],'Niet gecontroleerd')}</td><td>{dpa(T[i])}</td></tr>
''' for i in ids)
    return f'''      <div class="tbl" role="region" aria-label="{cap}" tabindex="0">
        <table>
          <caption class="sr">{cap}</caption>
          <thead><tr><th scope="col">Tool</th><th scope="col">Gratis versie</th><th scope="col">Betaald vanaf</th><th scope="col">Gegevens</th><th scope="col">Verwerkersovereenkomst</th></tr></thead>
          <tbody>
{rows}          </tbody>
        </table>
      </div>
'''
SPOKES=[]  # (path, title) voor sitemap
def zet(path,title,desc,crumb,h1,lead,body,graph):
    write(path.strip('/')+'/index.html',page(path,title,desc,crumb,h1,lead,body,wide=True,extra=ldscript(graph)))
    SPOKES.append(path)

# ======================= CATEGORIEËN =======================
CAT=[]
def cat(slug,title,desc,crumb,h1,lead,intro,tools,kies,faq,extra_src=(),na=''):
    CAT.append(dict(slug=slug,title=title,desc=desc,crumb=crumb,h1=h1,lead=lead,intro=intro,tools=tools,kies=kies,faq=faq,src=list(extra_src),na=na))

cat('/ai-assistenten/','ChatGPT-alternatief kiezen: AI-assistenten | ToolMatch',
 'De bekende AI-assistenten naast elkaar voor zakelijk gebruik: wat ze kosten, waar je gegevens staan en welke past bij Microsoft 365 of Google.',
 'AI-assistenten','AI-assistenten: ChatGPT en de alternatieven',
 'ChatGPT is de bekendste, maar niet de enige. Hier staan de algemene AI-assistenten naast elkaar: wat ze kosten, waar ze in je werk passen en wat er met je gegevens gebeurt.',
 f'''      <p>Een AI-assistent is een chatbot voor algemeen werk: een tekst opzetten, een lang document samenvatten, een idee uitwerken of een vraag uitzoeken. De grote verschillen zitten zelden in wat ze kunnen, maar in <strong>waar ze in je werk zitten</strong> (in Microsoft 365, in Google Workspace of als losse app), <strong>wat het per gebruiker kost</strong> en <strong>wat er met je invoer gebeurt</strong>.</p>
      <p>Werk je al in Microsoft 365, bekijk dan eerst {L('/vergelijken/chatgpt-vs-copilot/','ChatGPT en Copilot naast elkaar')}. Werk je in Gmail en Google Docs, lees dan {L('/vergelijken/chatgpt-vs-gemini/','het verschil tussen ChatGPT en Gemini')}. Schrijf je vooral lange stukken, dan helpt de vergelijking {L('/vergelijken/chatgpt-vs-claude/','ChatGPT of Claude voor lange teksten')}.</p>
''',
 [('chatgpt','je een losse assistent wilt die los staat van je kantoorsoftware, met een gratis versie om te proberen.'),
  ('claude','je veel met lange documenten werkt en een gratis versie wilt testen; bij Pro zit ook een koppeling met Microsoft 365.'),
  ('lechat','je een Europese aanbieder wilt: volgens Mistral staan je gegevens standaard in de EU.'),
  ('copilot','je team al in Word, Outlook en Teams werkt en een geschikt Microsoft 365 Business-abonnement heeft.'),
  ('gemini','je team in Gmail en Google Docs werkt; Gemini zit in de Workspace-abonnementen.')],
 [f'<strong>Begin bij wat je al hebt.</strong> Heb je Microsoft 365 of Google Workspace, kijk dan eerst wat daar al in zit. Bij geschikte Microsoft 365-plannen is Copilot Chat zonder extra kosten beschikbaar, volgens Microsoft.',
  '<strong>Reken per gebruiker.</strong> Zakelijke plannen tellen per persoon. Met vijf mensen is een verschil van een paar euro per maand al snel honderden euro per jaar.',
  '<strong>Kijk naar training op je invoer.</strong> Bij ChatGPT en Claude kun je training op je gesprekken uitzetten. Volgens Microsoft worden prompts en antwoorden bij Copilot Business niet gebruikt om de modellen te trainen.',
  f'<strong>Test met echt werk.</strong> Geef twee assistenten dezelfde opdracht uit je eigen werk, in het Nederlands. Daarna weet je meer dan na tien reviews. Wat de abonnementen kosten, zie je in {L("/gids/wat-kosten-ai-abonnementen/","alle abonnementsprijzen op een rij")}.'],
 [('Wat is het beste alternatief voor ChatGPT?','Dat hangt af van waar je werkt. In Microsoft 365 ligt Copilot voor de hand, in Google Workspace Gemini. Wil je een Europese aanbieder, dan is Le Chat van Mistral een optie. Claude is een losse assistent, net als ChatGPT. Wij zetten ze hier op alfabetische volgorde, niet op rangorde.'),
  ('Is er een gratis AI-assistent?','ChatGPT, Claude en Le Chat hebben een gratis versie, met beperkingen. Bij Copilot en Gemini hangt het af van je Microsoft 365- of Google-abonnement.'),
  ('Welke AI-assistent slaat gegevens op in Europa?','Van de assistenten op deze pagina zegt alleen Mistral (Le Chat) dat gegevens standaard in de EU staan. Bij de andere hebben we de opslaglocatie niet kunnen bevestigen op de pagina\'s die we bekeken.'),
  ('Mag ik klantgegevens in een AI-assistent zetten?','Alleen als je weet wat de aanbieder ermee doet en je afspraken hebt gemaakt, zoals een verwerkersovereenkomst. Bij twijfel: laat namen en andere persoonsgegevens weg.')])

cat('/ai-tekst-schrijven/','AI-tools om Nederlandse teksten te schrijven | ToolMatch',
 'Welke AI-tool schrijft goed Nederlands voor je website, blog of LinkedIn? Vergelijk schrijfassistenten op prijs, kwaliteit van het Nederlands en privacy.',
 'Tekst schrijven','AI-tools voor Nederlandse teksten',
 'Een eerste versie van een webtekst, blog of LinkedIn-post laten schrijven, of je eigen tekst laten verbeteren. Dit zijn de tools, met prijs en wat er met je tekst gebeurt.',
 f'''      <p>Voor schrijfwerk heb je grofweg twee soorten tools. Een <strong>algemene AI-assistent</strong> schrijft een tekst vanaf een korte opdracht. Een <strong>schrijfhulp</strong> zoals DeepL Write verbetert een tekst die je zelf hebt geschreven. Vaak volstaat {L('/ai-assistenten/','een algemene AI-assistent')} die je al hebt.</p>
      <p>Hoe goed een tool Nederlands schrijft, hebben we niet gemeten en dat beweren we dus ook niet. Test het zelf met een echte tekst, en lees altijd na: AI-tekst kan fouten en verzonnen feiten bevatten.</p>
''',
 [('chatgpt','je teksten vanaf nul wilt laten opzetten en ook andere taken met dezelfde tool wilt doen.'),
  ('claude','je met lange teksten werkt, zoals een rapport of een uitgebreide webpagina.'),
  ('deepl','je je eigen tekst wilt verbeteren of vertalen; bij betaalde abonnementen wordt je tekst volgens DeepL niet gebruikt voor training.'),
  ('lechat','je liever een Europese aanbieder gebruikt.')],
 ['<strong>Schrijven of verbeteren?</strong> Wil je dat de tool de tekst maakt, kies een assistent. Schrijf je liever zelf, dan is een schrijfhulp vaak genoeg.',
  '<strong>Geef context mee.</strong> Vertel voor wie de tekst is, hoe lang hij moet zijn en welke toon je wilt. Hoe preciezer de opdracht, hoe minder je hoeft te herschrijven.',
  f'<strong>Lees alles na.</strong> Controleer namen, cijfers en beloftes. Een tekst publiceer je onder je eigen naam. Klaar met schrijven? Dan kun je {L("/social-media-inplannen/","je LinkedIn-posts inplannen")}.',
  f'<strong>Begin niet blanco.</strong> Gebruik onze {L("/gids/prompts-voor-ondernemers/","voorbeeldprompts voor je teksten")}. Moet de tekst ook in een andere taal? Lees over {L("/ai-vertalen/","teksten vertalen met AI")}.'],
 [('Welke AI schrijft het beste Nederlands?','Dat hebben we niet gemeten, dus daar doen we geen uitspraak over. Probeer twee tools met dezelfde opdracht uit je eigen werk en vergelijk het resultaat.'),
  ('Kan ik een AI-tekst zomaar op mijn website zetten?','Je bent zelf verantwoordelijk voor wat je publiceert. Lees de tekst na op fouten en verzonnen feiten, en pas hem aan zodat hij klinkt als jouw bedrijf.'),
  ('Wat is het verschil tussen DeepL en ChatGPT?','DeepL is gemaakt voor vertalen en het verbeteren van bestaande tekst. ChatGPT is een algemene assistent die ook nieuwe teksten schrijft en andere taken doet.')])

cat('/ai-mail-en-offertes/','AI voor offertes en zakelijke mail: welke tool? | ToolMatch',
 'Sneller een offerte, voorstel of zakelijke mail opstellen met AI. Zie welke tools in Outlook of Gmail werken, wat ze kosten en wat je zelf moet checken.',
 'Mail en offertes','AI voor offertes en zakelijke mail',
 'Een offertetekst, een voorstel of een lastige mail sneller op papier. Hier zie je welke AI-tools in je mailprogramma zitten en welke los werken.',
 f'''      <p>Het meeste schrijfwerk voor offertes en mail gebeurt in je mailprogramma. Daarom maakt het veel uit of de AI daar al in zit: <strong>Copilot in Outlook</strong> bij Microsoft 365, <strong>Gemini in Gmail</strong> bij Google Workspace, of een losse assistent waar je tekst in en uit kopieert. Twijfel je tussen de eerste en de laatste, lees dan {L('/vergelijken/chatgpt-vs-copilot/','Copilot in Outlook of ChatGPT')}.</p>
      <p>Deze pagina gaat over het schrijven van de tekst. De prijzen, voorwaarden en afspraken in je offerte blijven jouw werk: controleer ze altijd zelf.</p>
''',
 [('copilot','je mail in Outlook staat: volgens Microsoft helpt Copilot daar mails op te stellen en vat het lange e-mailthreads samen.'),
  ('gemini','je mail in Gmail staat: Gemini in Gmail zit in Google Workspace Business Starter.'),
  ('chatgpt','je een losse assistent wilt die met elk mailprogramma werkt, via kopiëren en plakken.'),
  ('claude','je een losse assistent wilt; bij Pro hoort volgens de prijspagina ook Claude for Microsoft Outlook.')],
 ['<strong>Werk vanuit een eigen voorbeeld.</strong> Geef de tool een eerdere offerte of mail die goed werkte, zonder klantgegevens, en vraag om dezelfde opbouw.',
  '<strong>Laat bedragen en afspraken staan.</strong> Laat AI de tekst schrijven, maar zet prijzen, data en voorwaarden er zelf in. Zo voorkom je dat er een verkeerd bedrag in je offerte belandt.',
  f'<strong>Volg op.</strong> Een offerte die je verstuurt, wil je ook terugzien. Met een CRM kun je {L("/crm-klein-bedrijf/","offertes opvolgen")} en zie je welke nog openstaan.'],
 [('Kan AI een offerte voor mij maken?','AI kan de tekst opzetten: de inleiding, de omschrijving van het werk en de afsluiting. De bedragen en afspraken moet je zelf invullen en controleren.'),
  ('Werkt Copilot ook in de gratis Outlook?','Copilot Business is een betaalde invoegtoepassing bij een geschikt Microsoft 365 Business-abonnement. Wat er in andere versies van Outlook zit, hebben we niet gecontroleerd.'),
  ('Is het veilig om klantmails in een AI-tool te plakken?','Daar staan namen en andere persoonsgegevens in. Doe dat alleen met een zakelijk abonnement waarvan je weet wat er met je gegevens gebeurt, of haal die gegevens eerst weg.')])

cat('/ai-notuleren/','AI-notulist kiezen: notuleren en transcriptie | ToolMatch',
 'Meetings laten notuleren met AI, in Teams of aan tafel. Vergelijk AI-notulisten op Nederlands, waar je opnames staan, verwerkersovereenkomst en prijs.',
 'Notuleren','AI-notulist kiezen: notuleren en transcriptie',
 'Een meeting laten uitschrijven en samenvatten, online of aan tafel. Zo vergelijk je AI-notulisten op prijs, opslag van je opnames en afspraken over je gegevens.',
 f'''      <p>Een AI-notulist neemt een gesprek op, schrijft het uit en maakt er een samenvatting met actiepunten van. Sommige tools schuiven aan bij je online meeting, andere werken met een opname die je uploadt of met een app die het gesprek op je telefoon of laptop opneemt. Werk je in Teams met Microsoft 365, dan kan ook {L('/vergelijken/chatgpt-vs-copilot/','Copilot in Teams')} vergaderingen samenvatten, volgens Microsoft.</p>
      <p>Een opname bevat stemmen, namen en vaak vertrouwelijke informatie. Lees daarom ook wat er geldt voor {L('/gids/ai-veilig-gebruiken/','opnames en de AVG')} voordat je begint.</p>
''',
 [('amberscript','opslag in de EU en een verwerkersovereenkomst belangrijk zijn; ook nagekeken door mensen mogelijk.'),
  ('notta','je een gratis versie wilt proberen en ook opnames wilt laten vertalen.'),
  ('notuly','verwerking in Nederland belangrijk is en je gesprekken aan tafel én online wilt vastleggen; gratis voor 3 gesprekken per maand (max. 60 minuten per opname).'),
  ('otter','je vooral online meetings live wilt laten uitschrijven.'),
  ('tldv','je online meetings wilt opnemen en er notities en samenvattingen van wilt.')],
 ['<strong>Vraag toestemming.</strong> Vertel deelnemers vooraf dat je opneemt en waarom.',
  '<strong>Check het Nederlands.</strong> Of een tool Nederlands goed verstaat, verschilt. Test met een echte opname met dialect of vaktermen.',
  '<strong>Kijk waar de opnames staan.</strong> En hoe lang ze bewaard blijven. Bij Amberscript staan ze volgens de aanbieder op servers in de EU. Notuly verwerkt gesprekken volgens de aanbieder op Nederlandse servers in Amsterdam en wist de audio binnen een minuut na verwerking. Bij de andere tools konden we dat niet bevestigen.'],
 [('Wat is het verschil tussen transcriptie en notuleren?','Transcriptie is het letterlijk uitschrijven van wat er gezegd is. Notuleren is samenvatten: besluiten en actiepunten. De meeste tools op deze pagina doen allebei.'),
  ('Mag ik een meeting opnemen met AI?','Vertel deelnemers vooraf dat je opneemt en waarvoor. In een opname staan persoonsgegevens, dus dan geldt ook de AVG.'),
  ('Is er een gratis AI-notulist?','Notta, Notuly, Otter en tl;dv hebben een gratis versie met beperkingen; bij Notuly zijn dat 3 gesprekken per maand. Bij Amberscript zagen we geen gratis versie op de prijspagina.')])

cat('/crm-klein-bedrijf/','CRM voor een klein bedrijf: gratis en betaald | ToolMatch',
 'Een eenvoudig CRM voor je klantgegevens, contactmomenten en offertes. Vergelijk gratis en betaalde CRM-systemen voor kleine bedrijven op prijs en limieten.',
 'CRM','CRM voor een klein bedrijf',
 'Klantgegevens, contactmomenten en lopende offertes op één plek. Voor een klein bedrijf of zzp\'er is een eenvoudig CRM vaak genoeg. Dit zijn de opties.',
 f'''      <p>Een CRM is een adresboek met geheugen: wie je klanten zijn, wanneer je ze sprak en welke offertes nog openstaan. Voor een klein bedrijf is de belangrijkste vraag vaak niet welk systeem het meeste kan, maar <strong>hoeveel mensen het gebruiken</strong> en <strong>of je met een gratis versie begint</strong>.</p>
      <p>Een CRM wordt pas echt handig als het met de rest praat. Lees {L('/automatiseren-zonder-code/','hoe je je CRM aan andere apps koppelt')}, en hoe klanten zelf {L('/online-afspraken-plannen/','afspraken direct in je agenda')} zetten.</p>
''',
 [('hubspot','je gratis wilt beginnen en later misschien wilt uitbreiden.'),
  ('pipedrive','je vooral verkoopkansen wilt volgen in een pipeline.'),
  ('zoho','je met maximaal drie mensen gratis wilt werken in een uitgebreid systeem.')],
 ['<strong>Tel de gebruikers.</strong> De meeste CRM\'s rekenen per gebruiker. Bij Zoho is de gratis versie voor maximaal 3 gebruikers.',
  '<strong>Begin klein.</strong> Zet eerst je klanten en lopende offertes erin. Extra functies kun je later nog aanzetten.',
  '<strong>Check de export.</strong> Kijk of je je gegevens kunt exporteren als je wilt overstappen.'],
 [('Heb ik als zzp\'er een CRM nodig?','Niet altijd. Heb je weinig klanten, dan kan een spreadsheet genoeg zijn. Een CRM helpt als je veel contactmomenten en offertes tegelijk bijhoudt.'),
  ('Is er een gratis CRM?','HubSpot heeft een gratis basis en Zoho CRM is gratis voor maximaal 3 gebruikers, volgens de aanbieders. Bij Pipedrive zagen we een proefperiode van 14 dagen.'),
  ('Waar staan mijn klantgegevens in een CRM?','Dat verschilt per aanbieder. Op de pagina\'s die we bekeken, hebben we de opslaglocatie niet kunnen bevestigen. Vraag het na bij de aanbieder, en vraag om een verwerkersovereenkomst.')])

cat('/online-afspraken-plannen/','Online afspraken laten plannen door klanten | ToolMatch',
 'Laat klanten zelf een afspraak kiezen in je agenda. Vergelijk tools voor online afspraken plannen op koppelingen, herinneringen, betalen vooraf en prijs.',
 'Afspraken plannen','Online afspraken laten plannen door klanten',
 'Geen heen-en-weer gemail meer over een tijd: klanten kiezen zelf een moment in je agenda. Dit zijn de tools, met prijs en wat de gratis versie kan.',
 f'''      <p>Een afsprakenplanner geeft je een boekingspagina met de tijden waarop je beschikbaar bent. De klant kiest een moment, de afspraak staat in je agenda en beide krijgen een bevestiging. Voor een kapper, coach of adviseur werkt dat anders dan voor een salesgesprek, dus kijk goed wat je nodig hebt.</p>
      <p>Na de afspraak wil je de klant vaak vastleggen. Daarvoor gebruik je een {L('/crm-klein-bedrijf/','CRM om klantgegevens bij te houden')}. En met een koppeling kun je {L('/automatiseren-zonder-code/','herinneringen automatisch versturen')}.</p>
''',
 [('acuity','je als dienstverlener afspraken plant en intakeformulieren en herinneringen wilt.'),
  ('calcom','je alleen werkt en gratis wilt beginnen, of later met een team.'),
  ('calendly','je een bekende planner wilt met een gratis versie.'),
  ('simplybook','je een eigen boekingssite wilt en klanten misschien vooraf wilt laten betalen: betalingen en aanbetalingen zitten volgens de aanbieder vanaf Standard.')],
 ['<strong>Koppelt hij met je agenda?</strong> Kijk of de planner werkt met de agenda die je al gebruikt, zodat je niet dubbel geboekt wordt.',
  '<strong>Betalen vooraf?</strong> Wil je dat klanten bij het boeken betalen, kijk dan of dat in het abonnement zit. Op deze pagina hebben we dat alleen bij SimplyBook.me bevestigd.',
  '<strong>Prijs per persoon of per bedrijf.</strong> Sommige planners rekenen per gebruiker, andere per account.'],
 [('Wat is de beste gratis afsprakenplanner?','Calendly, Cal.com en SimplyBook.me hebben een gratis versie. Welke past, hangt af van wat je nodig hebt; wij zetten ze op alfabetische volgorde.'),
  ('Kunnen klanten vooraf betalen?','Bij SimplyBook.me kan dat volgens de aanbieder vanaf het Standard-abonnement. Bij de andere tools hebben we dat niet gecontroleerd.'),
  ('Krijgen klanten een herinnering?','De meeste planners sturen een bevestiging. Of herinneringen in jouw abonnement zitten, verschilt per tool en plan; check dat op de prijspagina.')])

cat('/ai-afbeeldingen-en-ontwerp/','AI voor afbeeldingen, logo’s en presentaties | ToolMatch',
 'Beelden, een logo of een presentatie maken met AI. Vergelijk ontwerptools op wat de gratis versie kan, de prijs en of je het beeld zakelijk mag gebruiken.',
 'Afbeeldingen en ontwerp','AI voor afbeeldingen, logo’s en presentaties',
 'Een beeld voor je website, een eerste logo-idee of een presentatie voor een klant. Dit zijn de tools waarvan we de prijs konden controleren.',
 f'''      <p>Voor beeld heb je twee soorten tools: een <strong>AI-assistent die een afbeelding maakt</strong> op basis van een beschrijving, en een <strong>ontwerptool</strong> waarin je zelf bouwt, met AI als hulp. Voor presentaties is de tweede soort vaak handiger.</p>
      <p>Is je beeld klaar? Met een planner kun je {L('/social-media-inplannen/','je visuals als post inplannen')}.</p>
''',
 [('chatgpt','je af en toe een afbeelding wilt laten maken met een beschrijving; in de gratis versie kan dat beperkt.'),
  ('lechat','je een Europese assistent wilt die ook eenvoudige afbeeldingen maakt.'),
  ('pitch','je presentaties wilt maken en delen, ook met een team.'),
  ('canva','je zelf ontwerpt voor social media, presentaties of drukwerk. Pro geeft volgens Canva tien keer zoveel AI-gebruik als de gratis versie, die tot 20 AI-toepassingen geeft.')],
 ['<strong>Zakelijk gebruik.</strong> Lees in de voorwaarden van de tool of je het beeld commercieel mag gebruiken. Dat hebben we voor deze tools niet gecontroleerd.',
  f'<strong>Vermeld AI waar dat moet.</strong> Volgens de Autoriteit Persoonsgegevens moet je mensen vanaf augustus 2026 in bepaalde gevallen informeren dat ze met AI te maken hebben, bijvoorbeeld bij een deepfake of een AI-beeld dat echt lijkt. Lees {L("/gids/ai-act-ondernemers/","wanneer je AI-beelden moet vermelden")}.',
  '<strong>Een logo is een merk.</strong> Gebruik AI voor ideeën, maar laat een definitief logo controleren op gelijkenis met bestaande merken.'],
 [('Mag ik een AI-afbeelding gebruiken voor mijn bedrijf?','Dat hangt af van de voorwaarden van de tool. Lees die na voordat je een beeld op je website of in een advertentie zet.'),
  ('Kan ik met AI een logo maken?','Je kunt er ideeën mee maken. Voor een definitief logo is het verstandig om te controleren of het niet lijkt op een bestaand merk.'),
  ('Moet ik vermelden dat een beeld met AI is gemaakt?','De AI-verordening bevat transparantieregels voor AI die beeld maakt. Volgens de Autoriteit Persoonsgegevens gelden die vanaf augustus 2026 in bepaalde gevallen, bijvoorbeeld bij een deepfake of een AI-beeld dat echt lijkt. Lees de details in onze gids over de AI Act.')],
 extra_src=[('Autoriteit Persoonsgegevens: Risicogroepen AI-verordening','https://www.autoriteitpersoonsgegevens.nl/themas/algoritmes-ai/ai-verordening/risicogroepen-ai-verordening')])

cat('/social-media-inplannen/','Social media inplannen: planners vergeleken | ToolMatch',
 'Je posts voor LinkedIn, Instagram en Facebook vooruit inplannen. Vergelijk social media planners op kanalen, gratis versie, AI-hulp en prijs per maand.',
 'Social media inplannen','Social media inplannen: planners vergeleken',
 'Eén keer per week je posts klaarzetten in plaats van elke dag. Dit zijn de planners, met wat de gratis versie kan en wat je per maand betaalt.',
 f'''      <p>Met een social media planner zet je je posts voor LinkedIn, Instagram of Facebook vooruit klaar. Ze verschillen vooral in <strong>hoe ze rekenen</strong>: per kanaal, per gebruiker of per account. Met drie kanalen en twee mensen kan dat een groot verschil maken.</p>
      <p>De tekst van je post schrijf je met een andere tool: zo {L('/ai-tekst-schrijven/','schrijf je met AI een betere posttekst')}. En hier vind je {L('/ai-afbeeldingen-en-ontwerp/','tools om beelden voor je posts te maken')}.</p>
''',
 [('buffer','je klein begint: de gratis versie is voor 3 kanalen, daarna betaal je per kanaal.'),
  ('hootsuite','je met een team veel kanalen beheert en rapportages wilt.'),
  ('metricool','je plannen en analyseren wilt combineren; de gratis versie is zonder LinkedIn.')],
 ['<strong>Tel je kanalen.</strong> Buffer rekent per kanaal; andere planners per account. Reken uit wat het voor jouw aantal kanalen kost.',
  '<strong>Kijk wat gratis kan.</strong> Voor één persoon met een paar kanalen is een gratis versie vaak genoeg.',
  '<strong>Plan, maar blijf reageren.</strong> Inplannen bespaart tijd, maar reacties op je posts moet je zelf blijven beantwoorden.'],
 [('Wat is de beste gratis social media planner?','Buffer en Metricool hebben een gratis versie. Let op: de gratis versie van Metricool is volgens de prijspagina zonder LinkedIn. Hootsuite heeft een gratis proefperiode; de betaalde plannen beginnen bij Standard.'),
  ('Kan ik LinkedIn-posts inplannen?','Buffer en Metricool noemen LinkedIn als kanaal; bij Metricool zit LinkedIn volgens de prijspagina niet in de gratis versie. Welke soorten posts precies kunnen, verschilt per tool.'),
  ('Wat kost een social media planner?','Metricool Starter kost vanaf €16 per maand. Buffer Essentials reken je per kanaal per maand; dat bedrag en de prijs van Hootsuite Standard zie je op de prijspagina van de aanbieder. Zie de bronnen voor de details.')])

cat('/automatiseren-zonder-code/','Automatiseren zonder code: Zapier, Make en meer | ToolMatch',
 'Terugkerend werk vanzelf laten gaan door je apps te koppelen, zonder code. Zie welke automatiseringstool past en hoe de kosten meegroeien met je taken.',
 'Automatiseren','Automatiseren zonder code',
 'Een formulier dat vanzelf in je CRM belandt, een mail die automatisch vertrekt. Zo koppel je apps zonder te programmeren, en dit kost het.',
 f'''      <p>Met een automatiseringstool zeg je: <em>als</em> dit gebeurt, doe <em>dan</em> dat. Een nieuw formulier op je site wordt een contact in je CRM. Een nieuwe afspraak levert een herinnering op. Zo hoef je niet steeds hetzelfde over te typen.</p>
      <p>De kosten groeien mee met hoe vaak je automatiseringen draaien: Zapier telt taken, Make credits en n8n uitvoeringen. Make staat hier niet als kaart: de prijs konden we op de prijspagina niet controleren. Wel staat Make in de vergelijking. Welk merk het best past, lees je in {L('/vergelijken/zapier-vs-make-vs-n8n/','Zapier, Make en n8n vergeleken')}. En denk aan de {L('/gids/ai-veilig-gebruiken/','gegevens die door je koppelingen gaan')}: die gaan via een extra partij.</p>
''',
 [('powerautomate','je al in Microsoft 365 werkt en ook taken op je pc wilt automatiseren.'),
  ('n8n','je gegevens in de EU wilt of zelf wilt hosten, en het niet erg vindt om iets technischer te werken.'),
  ('zapier','je snel wilt beginnen en veel verschillende apps wilt koppelen.')],
 ['<strong>Begin met één taak.</strong> Kies het klusje dat je het vaakst handmatig doet en automatiseer alleen dat.',
  '<strong>Reken met je volume.</strong> Schat hoe vaak de automatisering per maand draait. Dat bepaalt welk abonnement je nodig hebt.',
  '<strong>Kijk waar je gegevens langs gaan.</strong> Bij n8n staan ze volgens de aanbieder in de EU (Frankfurt) als n8n host; bij Zapier en Power Automate hebben we de locatie niet gecontroleerd.'],
 [('Wat is no-code automatiseren?','Apps aan elkaar koppelen met een visuele bouwer, zonder te programmeren. Je kiest een trigger (als dit gebeurt) en een actie (doe dan dat).'),
  ('Is er een gratis automatiseringstool?','Zapier en Make hebben een gratis versie met beperkingen; Power Automate heeft een gratis proefversie van 30 dagen. n8n kun je volgens de aanbieder zelf hosten met de Community Edition; de door n8n gehoste versie is betaald.'),
  ('Wat kost automatiseren?','Power Automate Premium kost €13,00 per gebruiker per maand bij jaarbetaling (excl. btw) en n8n Starter €20 per maand bij jaarbetaling, volgens de aanbieders. Het bedrag van Zapier Professional (750 taken) zie je op de prijspagina van Zapier. De prijs van Make konden we niet controleren.')])

cat('/ai-chatbot-website/','Chatbot voor je website: AI-tools vergeleken | ToolMatch',
 'Een AI-chatbot op je website die klantvragen beantwoordt. Vergelijk tools op prijs per gesprek of maand, Nederlands, overdracht naar een mens en AVG.',
 'Chatbot op je website','Een AI-chatbot voor je website',
 'Een chatbot die veelgestelde vragen beantwoordt, ook buiten kantoortijd. Dit zijn de tools, en zo rekenen ze: per maand, per gebruiker of per opgeloste vraag.',
 f'''      <p>Een AI-chatbot op je website beantwoordt vragen op basis van je eigen informatie, zoals je veelgestelde vragen of je helpcenter. Kan de bot iets niet, dan moet de vraag bij een mens terechtkomen. Dat kan via een gedeelde inbox, of je kunt {L('/automatiseren-zonder-code/','vragen doorzetten naar je mail of CRM')}.</p>
      <p>Volgens de Autoriteit Persoonsgegevens moet je mensen vanaf augustus 2026 in bepaalde gevallen informeren dat ze met AI te maken hebben, bijvoorbeeld bij een chatbot of deepfake. In onze gids over de AI Act lees je wanneer je moet {L('/gids/ai-act-ondernemers/','melden dat klanten met een bot praten')}.</p>
''',
 [('intercom','je een uitgebreid klantenservice-platform wilt en betalen per opgeloste vraag past bij je volume.'),
  ('tidio','je een webshop of kleine site hebt en met een gratis versie wilt beginnen.'),
  ('trengo','je mail, WhatsApp, chat en social in één inbox wilt, met een team.')],
 ['<strong>Kijk hoe er gerekend wordt.</strong> Intercom rekent naast een prijs per gebruiker ook een bedrag per opgeloste vraag van de AI-agent Fin, volgens de prijspagina. Trengo heeft een maandprijs met 10 gebruikers inbegrepen.',
  '<strong>Regel de overdracht.</strong> Zorg dat een klant altijd een mens kan bereiken.',
  '<strong>Vertel dat het een bot is.</strong> Zet in het chatvenster dat de klant met AI praat.'],
 [('Wat kost een AI-chatbot voor je website?','Trengo Boost kost €299 per maand bij jaarbetaling, met 10 gebruikers. Bij Tidio Starter en Intercom Essential (per gebruiker, plus een bedrag per opgeloste Fin-vraag) zie je het bedrag op de prijspagina van de aanbieder. Zie de bronnen.'),
  ('Moet ik melden dat het een chatbot is?','Volgens de Autoriteit Persoonsgegevens moet je mensen vanaf augustus 2026 in bepaalde gevallen informeren dat ze met AI te maken hebben, bijvoorbeeld bij een chatbot of deepfake.'),
  ('Kan een chatbot Nederlands?','Dat verschilt per tool en hebben we niet gecontroleerd. Test het met echte vragen van je klanten.')],
 extra_src=[('Autoriteit Persoonsgegevens: Risicogroepen AI-verordening','https://www.autoriteitpersoonsgegevens.nl/themas/algoritmes-ai/ai-verordening/risicogroepen-ai-verordening')])

cat('/ai-data-analyse/','AI voor data-analyse en dashboards: welke tool? | ToolMatch',
 'Je cijfers laten analyseren met AI of in een dashboard zetten. Vergelijk ChatGPT, Looker Studio en Power BI op prijs, koppelingen en benodigde kennis.',
 'Data-analyse','AI voor data-analyse en dashboards',
 'Je verkoopcijfers, websitebezoek of klantenlijst begrijpen zonder dat je data-analist bent. Dit zijn de tools: van een AI-assistent tot een dashboard.',
 f'''      <p>Er zijn twee manieren om met je cijfers aan de slag te gaan. Je kunt een <strong>AI-assistent</strong> een bestand laten analyseren en er vragen over stellen. Of je zet je cijfers in een <strong>dashboard</strong> dat steeds bijgewerkt wordt. Werk je in Excel, lees dan ook {L('/vergelijken/chatgpt-vs-copilot/','Copilot in Excel of ChatGPT')}.</p>
      <p>Een dashboard is pas handig als de cijfers vanzelf binnenkomen. Met een koppeling kun je {L('/automatiseren-zonder-code/','je cijfers automatisch laten bijwerken')}. Zet je klantgegevens in een AI-tool, lees dan eerst wat er geldt voor {L('/gids/ai-veilig-gebruiken/','klantdata in een AI-tool')}.</p>
''',
 [('chatgpt','je af en toe een bestand wilt laten analyseren en er vragen over wilt stellen.'),
  ('copilot','je in Excel werkt: volgens Microsoft analyseert Copilot daar gegevens en maakt het grafieken.'),
  ('lookerstudio','je gratis dashboards wilt op basis van Google Sheets of Analytics.'),
  ('powerbi','je in de Microsoft-omgeving werkt en rapporten wilt delen; Power BI Desktop is gratis.')],
 ['<strong>Eenmalig of steeds?</strong> Een losse vraag over een bestand: een AI-assistent. Cijfers die je elke week bekijkt: een dashboard.',
  '<strong>Laat persoonsgegevens weg.</strong> Voor een analyse heb je zelden namen of adressen nodig. Haal ze eruit voordat je een bestand uploadt.',
  '<strong>Controleer de uitkomst.</strong> Een AI kan een berekening verkeerd doen. Reken belangrijke cijfers na.'],
 [('Kan ChatGPT een Excel-bestand analyseren?','ChatGPT noemt op de prijspagina ook extensies voor Excel en Google Sheets. Controleer de uitkomsten altijd zelf.'),
  ('Is Looker Studio gratis?','Ja, Looker Studio is gratis. Voor Looker Studio Pro betaal je per gebruiker per project per maand; het bedrag zie je op de pagina van Google.'),
  ('Wat is het verschil tussen Power BI en Looker Studio?','Power BI is van Microsoft en past bij Excel en Microsoft 365. Looker Studio is van Google en past bij Sheets en Analytics. Allebei hebben ze een gratis instap.')])

# Verder lezen: per categoriepagina 3 verwante categoriepagina's (gewone interne links, geen rangorde).
VL_TXT={'/ai-assistenten/':'AI-assistenten: ChatGPT en de alternatieven','/ai-tekst-schrijven/':'AI-tools voor Nederlandse teksten',
 '/ai-mail-en-offertes/':'AI voor offertes en zakelijke mail','/ai-notuleren/':'Een AI-notulist kiezen','/crm-klein-bedrijf/':'Een CRM voor een klein bedrijf',
 '/ai-vertalen/':'Teksten en mails vertalen met AI','/ai-afbeeldingen-en-ontwerp/':'AI voor afbeeldingen, logo’s en presentaties',
 '/ai-website-maken/':'Een website maken met AI','/websitebezoekers-herkennen/':'Zien welke bedrijven je website bezoeken',
 '/automatiseren-zonder-code/':'Automatiseren zonder code','/ai-chatbot-website/':'Een chatbot voor je website','/ai-data-analyse/':'AI voor data-analyse en dashboards'}
VERDER={'/ai-assistenten/':['/ai-mail-en-offertes/','/ai-notuleren/','/ai-data-analyse/'],
 '/ai-tekst-schrijven/':['/ai-mail-en-offertes/','/ai-afbeeldingen-en-ontwerp/','/ai-website-maken/'],
 '/ai-mail-en-offertes/':['/ai-tekst-schrijven/','/ai-notuleren/','/ai-vertalen/'],
 '/ai-notuleren/':['/ai-mail-en-offertes/','/ai-vertalen/','/ai-assistenten/'],
 '/crm-klein-bedrijf/':['/websitebezoekers-herkennen/','/ai-chatbot-website/','/ai-data-analyse/'],
 '/online-afspraken-plannen/':['/ai-chatbot-website/','/ai-website-maken/','/ai-mail-en-offertes/'],
 '/ai-afbeeldingen-en-ontwerp/':['/ai-tekst-schrijven/','/ai-website-maken/','/ai-assistenten/'],
 '/social-media-inplannen/':['/ai-website-maken/','/websitebezoekers-herkennen/','/automatiseren-zonder-code/'],
 '/automatiseren-zonder-code/':['/ai-mail-en-offertes/','/ai-notuleren/','/ai-assistenten/'],
 '/ai-chatbot-website/':['/ai-website-maken/','/websitebezoekers-herkennen/','/ai-assistenten/'],
 '/ai-data-analyse/':['/ai-assistenten/','/crm-klein-bedrijf/','/websitebezoekers-herkennen/']}
def verder_lezen(slug):
    return '      <h2 id="verder-lezen">Verder lezen</h2>\n      <ul>\n'+''.join(f'        <li>{L(u,VL_TXT[u])}</li>\n' for u in VERDER[slug])+'      </ul>\n'

for c in CAT:
    c['tools']=alfa(c['tools'])
    ids=[i for i,_ in c['tools']]
    ok=[i for i in ids if T[i]['prijs'] and T[i]['bronnen']]
    assert len(ok)>=3, c['slug']+' heeft minder dan 3 tools met gecontroleerde prijs'
    assert ok==ids, c['slug']+': alleen tools met gecontroleerde prijs op een categoriepagina'
    srcs=[tuple(b) for i in ids for b in T[i]['bronnen']]+[tuple(s) for s in c['src']]
    body=c['intro']+'      <h2 id="overzicht">In het kort</h2>\n      <p>De tools staan op alfabetische volgorde, niet op rangorde. Welke past, hangt af van je situatie.</p>\n'+kort_tabel(ids,'Overzicht van de tools')
    body+='      <h2 id="tools">De tools</h2>\n'+met_noot('      <div class="results">\n'+''.join(kaart(T[i],p) for i,p in c['tools'])+'      </div>\n')
    body+='      <h2 id="zo-kies-je">Zo kies je</h2>\n      <ul>\n'+''.join(f'        <li>{k}</li>\n' for k in c['kies'])+'      </ul>\n'
    body+=f'      <p>Nog niet zeker? {L("/keuzehulp/","Doe de keuzehulp")} en zie wat bij jouw situatie past.</p>\n' if c['slug']!='/ai-assistenten/' else ''
    body+=verder_lezen(c['slug'])+faq_html(c['faq'])+bronnen_html(srcs)+byline(c['slug'])
    graph=[{"@type":"CollectionPage","@id":D+c['slug'],"url":D+c['slug'],"name":c['h1'],"description":c['desc'],"inLanguage":"nl-NL","isPartOf":{"@id":D+"/#website"},"publisher":ORG,"dateModified":LOGO_UPD.get(c['slug']) or (NOTULY_UPD[c['slug']] if c['slug'] in NOTULY_UPD else VERDER_UPD if c['slug'] in VERDER else VALUTA_UPD.get(c['slug'],GC))},
      {"@type":"ItemList","name":c['h1'],"itemListOrder":"https://schema.org/ItemListUnordered","itemListElement":[{"@type":"ListItem","position":n+1,"name":T[i]['naam'],"url":D+c['slug']+'#'+i} for n,i in enumerate(ids)]},
      crumbs_ld([('Home','/'),(c['crumb'],c['slug'])]),faq_ld(c['slug'],c['faq'])]
    zet(c['slug'],c['title'],c['desc'],c['crumb'],c['h1'],c['lead'],body,graph)

# ======================= VERGELIJKINGEN =======================
AP_RISK=('Autoriteit Persoonsgegevens: Risicogroepen AI-verordening','https://www.autoriteitpersoonsgegevens.nl/themas/algoritmes-ai/ai-verordening/risicogroepen-ai-verordening')
AP_GESL=('Autoriteit Persoonsgegevens: AI-geletterdheid','https://www.autoriteitpersoonsgegevens.nl/themas/algoritmes-ai/ai-verordening/ai-geletterdheid')
AP_AIV=('Autoriteit Persoonsgegevens: AI-verordening','https://www.autoriteitpersoonsgegevens.nl/themas/algoritmes-ai/ai-verordening')
AP_VWO=('Autoriteit Persoonsgegevens: Verwerkersovereenkomst','https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verwerkersovereenkomst')
AP_HULP=('Autoriteit Persoonsgegevens: Hulpmiddel generatieve AI en de AVG + VR Microsoft Copilot','https://www.autoriteitpersoonsgegevens.nl/documenten/hulpmiddel-generatieve-ai-en-de-avg-vr-microsoft-copilot')
AP_GENAI=('Autoriteit Persoonsgegevens: Handreiking generatieve AI en de AVG','https://www.autoriteitpersoonsgegevens.nl/documenten/handreiking-generatieve-ai-en-de-avg')
EURLEX=('EUR-Lex: Verordening (EU) 2024/1689 (AI-verordening)','https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=nl')
CHATGPT_SRC=('ChatGPT: Prijzen','https://chatgpt.com/nl-NL/pricing')
VS=[]
def vs(slug,title,desc,crumb,h1,lead,cols,rows,intro,secties,faq,srcs):
    VS.append(dict(slug=slug,title=title,desc=desc,crumb=crumb,h1=h1,lead=lead,cols=cols,rows=rows,intro=intro,secties=secties,faq=faq,src=srcs))

vs('/vergelijken/chatgpt-vs-copilot/','ChatGPT vs Copilot: verschil, prijs en keuze | ToolMatch',
 'ChatGPT of Copilot Business voor je bedrijf? We zetten prijs, koppeling met Word, Outlook en Teams, en wat er met je gegevens gebeurt naast elkaar.',
 'ChatGPT vs Copilot','ChatGPT vs Copilot voor je bedrijf',
 'De ene is een losse assistent, de andere zit in Word, Outlook en Teams. Zo verschillen ChatGPT en Copilot Business in prijs, koppelingen en omgang met je gegevens.',
 ['ChatGPT','Copilot Business'],
 [('Wat het is','Losse AI-assistent van OpenAI, op web, desktop en mobiel.','AI-assistent in de Microsoft 365-apps, voor bedrijven die daar al in werken.'),
  ('Gratis instap','Ja, ChatGPT Free (met beperkingen).','Copilot Chat is volgens Microsoft zonder extra kosten beschikbaar bij geschikte Microsoft 365-plannen.'),
  ('Betaald','Plus: €23 per maand (btw niet vermeld op de prijspagina).','€18,20 per gebruiker per maand bij jaarbetaling (excl. btw); bij aanschaf tot en met 31-12-2026 actieprijs €15,60 voor het eerste jaar. Alleen als invoegtoepassing bij een geschikt Microsoft 365 Business-abonnement.'),
  ('Word, Excel en PowerPoint','Extensies voor Excel, Word, PowerPoint en Google Sheets: beperkt in Free, ja in Plus.','Ingebouwd in Word, Excel en PowerPoint.'),
  ('Outlook en Teams','Niet gecontroleerd.','Ingebouwd: mails opstellen en threads samenvatten in Outlook, samenvattingen van vergaderingen in Teams.'),
  ('Training op je invoer','Opt-out beschikbaar (Free, Go, Plus en Pro).','Prompts en antwoorden worden volgens Microsoft niet gebruikt om de modellen te trainen.'),
  ('Verwerkersovereenkomst','Niet gecontroleerd.','Het Microsoft-addendum voor gegevensbescherming (DPA) is van toepassing, volgens Microsoft.')],
 '''      <p>De vraag is meestal niet welke van de twee slimmer is, maar <strong>waar je werkt</strong>. ChatGPT is een losse app waar je tekst in en uit haalt. Copilot zit in de Microsoft 365-apps die je team al gebruikt en werkt met je mails, documenten en vergaderingen.</p>
''',
 [('Copilot Business vs ChatGPT Business',f'''      <p>Voor teams heeft OpenAI ChatGPT Business. De prijs daarvan konden we op de prijspagina niet aflezen, dus die noemen we niet. Copilot Business (op de Nederlandse site van Microsoft: Microsoft 365 Copilot Bedrijven) is een invoegtoepassing: je hebt er een geschikt Microsoft 365 Business-abonnement bij nodig, en je betaalt per gebruiker per jaar. Volgens Microsoft geldt voor sommige geavanceerde functies daarnaast een prijs naar gebruik. Wil je {L('/vergelijken/chatgpt-vs-gemini/','ook Gemini bekijken')}, dan staat die vergelijking apart.</p>
'''),
  ('Wat er met je gegevens gebeurt',f'''      <p>Bij ChatGPT kun je volgens de prijspagina uitzetten dat je inhoud wordt gebruikt om modellen te trainen. Bij Copilot Business blijven prompts en antwoorden volgens Microsoft binnen de Microsoft 365-servicegrenzen en worden ze niet gebruikt om de modellen te trainen.</p>
      <p>Let op: de Autoriteit Persoonsgegevens publiceerde in juli 2026 een advies over een voorgenomen inzet van Copilot bij een gemeente en concludeerde dat die verwerking inbreuk zou maken op de AVG. Dat ging over één specifieke situatie, maar het laat zien dat je de instellingen en de toegang tot je bestanden goed moet regelen. De AP heeft daar ook een hulpmiddel voor gepubliceerd.</p>
'''),
  ('Zo kies je',f'''      <ul>
        <li><strong>Kies Copilot Business</strong> als je team in Word, Outlook en Teams werkt en je al een geschikt Microsoft 365 Business-abonnement hebt.</li>
        <li><strong>Kies ChatGPT</strong> als je een losse assistent wilt, alleen werkt of geen Microsoft 365 gebruikt.</li>
        <li><strong>Twijfel je over de kosten?</strong> Bekijk {L('/gids/wat-kosten-ai-abonnementen/','alle prijzen per maand')}, of zie {L('/ai-assistenten/','alle AI-assistenten op een rij')}.</li>
      </ul>
''')],
 [('Wat is het verschil tussen ChatGPT en Copilot?','ChatGPT is een losse AI-assistent. Copilot Business zit in Word, Excel, PowerPoint, Outlook en Teams en werkt met je werkgegevens in Microsoft 365.'),
  ('Is Copilot gratis?','Copilot Chat is volgens Microsoft zonder extra kosten beschikbaar bij geschikte Microsoft 365-plannen. Copilot in de apps zelf is een betaalde invoegtoepassing: Copilot Business.'),
  ('Wat kost Copilot Business?','Copilot Business kost €18,20 per gebruiker per maand bij jaarbetaling, exclusief btw. Bij aanschaf tot en met 31 december 2026 geldt volgens Microsoft een actieprijs van €15,60 voor het eerste jaar.'),
  ('Wordt mijn invoer gebruikt om de AI te trainen?','Bij ChatGPT kun je dat uitzetten. Bij Copilot Business worden prompts en antwoorden volgens Microsoft niet gebruikt voor training.')],
 [CHATGPT_SRC,('Microsoft: Copilot voor kleine bedrijven','https://www.microsoft.com/nl-nl/microsoft-365/copilot/business'),AP_HULP])

vs('/vergelijken/chatgpt-vs-gemini/','ChatGPT vs Gemini: welke past bij je bedrijf? | ToolMatch',
 'ChatGPT of Google Gemini? Vergelijk prijs, wat de gratis versie kan, koppeling met Gmail, Docs en Drive, en hoe goed beide Nederlands schrijven.',
 'ChatGPT vs Gemini','ChatGPT vs Gemini voor je bedrijf',
 'Werk je in Gmail en Google Docs, dan zit Gemini er misschien al in. Zo verschillen ChatGPT en Gemini in prijs, koppelingen en wat je per gebruiker betaalt.',
 ['ChatGPT','Gemini in Google Workspace'],
 [('Wat het is','Losse AI-assistent van OpenAI.','Gemini als onderdeel van Google Workspace (zakelijk).'),
  ('Gratis instap','Ja, ChatGPT Free (met beperkingen).','De gratis Gemini-app voor particulieren hebben we niet gecontroleerd. Workspace heeft een proefperiode van 14 dagen.'),
  ('Betaald','Plus: €23 per maand (btw niet vermeld op de prijspagina).','Business Starter: €8,10 per gebruiker per maand, met een contract van 1 jaar €6,80, met Gemini in Gmail en chat met Gemini. Business Standard: €16,20 per gebruiker per maand, met een contract van 1 jaar €13,60, ook met Gemini in Documenten en Meet (NL-pagina van de aanbieder, bekeken op 26 oktober 2026).'),
  ('Gmail, Docs en Drive','Extensie voor Google Sheets; verder niet gecontroleerd.','Gemini in Gmail vanaf Starter; in Documenten en Meet vanaf Standard.'),
  ('Training op je invoer','Opt-out beschikbaar (Free, Go, Plus en Pro).','Niet gecontroleerd op de pagina\'s die we bekeken.'),
  ('Nederlands','Niet gemeten.','Niet gemeten.')],
 '''      <p>Voor een bedrijf is Gemini vooral interessant als je al met Google Workspace werkt: dan krijg je de AI in je mail en documenten, en betaal je per gebruiker voor het hele pakket. ChatGPT is een losse app, los van je mail en documenten.</p>
      <p>Hoe goed beide Nederlands schrijven, hebben we niet gemeten. Test ze met dezelfde opdracht uit je eigen werk.</p>
''',
 [('Zo kies je',f'''      <ul>
        <li><strong>Kies Gemini</strong> als je bedrijf in Gmail en Google Docs werkt; bekijk welk Workspace-abonnement de functies heeft die je nodig hebt.</li>
        <li><strong>Kies ChatGPT</strong> als je een losse assistent wilt, los van je mailprogramma.</li>
        <li><strong>Nog een optie:</strong> vergelijk ook {L('/vergelijken/chatgpt-vs-claude/','ChatGPT tegen Claude')}, of bekijk {L('/ai-assistenten/','andere assistenten, ook Europese')}.</li>
      </ul>
''')],
 [('Wat is het verschil tussen ChatGPT en Gemini?','ChatGPT is een losse AI-assistent. Gemini zit voor bedrijven in Google Workspace, onder meer in Gmail en, vanaf Business Standard, in Documenten en Meet.'),
  ('Wat kost Gemini voor een bedrijf?','Gemini zit in Google Workspace. Business Starter kost €8,10 per gebruiker per maand, of €6,80 met een contract van 1 jaar. Business Standard kost €16,20, of €13,60 met een contract van 1 jaar. Zo staat het op de NL-pagina van Google, bekeken op 26 oktober 2026.'),
  ('Schrijft Gemini goed Nederlands?','Dat hebben we niet gemeten. Probeer het met een echte tekst uit je werk, bijvoorbeeld in de proefperiode van Workspace.')],
 [CHATGPT_SRC,('Google Workspace voor bedrijven: abonnementen (NL-pagina van de aanbieder)','https://workspace.google.com/intl/nl/business/'),('Google Workspace: prijzen','https://workspace.google.com/intl/nl/pricing')])

vs('/vergelijken/chatgpt-vs-claude/','ChatGPT vs Claude: verschil voor ondernemers | ToolMatch',
 'ChatGPT of Claude? We vergelijken de prijs per maand, schrijven in het Nederlands, werken met lange documenten en de zakelijke abonnementen.',
 'ChatGPT vs Claude','ChatGPT vs Claude voor ondernemers',
 'Twee losse AI-assistenten met een gratis versie en een betaald abonnement voor één persoon. Zo verschillen ze in prijs, zakelijke plannen en wat er met je gesprekken gebeurt.',
 ['ChatGPT','Claude'],
 [('Wat het is','AI-assistent van OpenAI.','AI-assistent van Anthropic.'),
  ('Gratis versie','Ja (met beperkingen).','Ja (met beperkingen).'),
  ('Persoonlijk abonnement','Plus: €23 per maand (btw niet vermeld op de prijspagina).','Pro: €18 per maand bij maandelijks betalen, €15 per maand bij jaarbetaling (€180 per jaar), excl. btw. Max vanaf €90 per maand.'),
  ('Voor teams','ChatGPT Business; prijs niet gecontroleerd.','Team, voor 2 tot 150 gebruikers: €21,04 per gebruiker per maand bij maandelijks betalen, €18 bij jaarbetaling, excl. btw.'),
  ('Kantoorsoftware','Extensies voor Excel, Word, PowerPoint en Google Sheets (beperkt in Free).','Claude for Microsoft 365 en Claude for Microsoft Outlook vanaf Pro, volgens de prijspagina.'),
  ('Training op je invoer','Opt-out beschikbaar.','Opt-out bij Free, Pro en Max; bij de zakelijke plannen volgens Anthropic standaard geen training op je inhoud.'),
  ('Nederlands','Niet gemeten.','Niet gemeten.')],
 '''      <p>ChatGPT en Claude lijken veel op elkaar: allebei losse assistenten met een gratis versie en een betaald abonnement. De verschillen zitten in de details: de prijs bij jaarbetaling, de koppelingen met kantoorsoftware en de standaardinstellingen voor training op je gesprekken.</p>
      <p>Werk je met lange documenten, probeer dan allebei met hetzelfde document. Hoe goed ze lange teksten verwerken of Nederlands schrijven, hebben we niet gemeten.</p>
''',
 [('Zo kies je',f'''      <ul>
        <li><strong>Kies Claude</strong> als je bij jaarbetaling iets minder wilt betalen voor een persoonlijk abonnement, of als je de koppeling met Microsoft 365 en Outlook wilt.</li>
        <li><strong>Kies ChatGPT</strong> als je ook de extensies voor Excel en Google Sheets wilt gebruiken.</li>
        <li><strong>Vooral schrijfwerk?</strong> Bekijk ook {L('/ai-tekst-schrijven/','tools speciaal voor teksten')}, en {L('/gids/wat-kosten-ai-abonnementen/','wat de abonnementen kosten')}.</li>
      </ul>
''')],
 [('Wat is het verschil tussen ChatGPT en Claude?','Allebei zijn het losse AI-assistenten. Ze verschillen vooral in prijs bij jaarbetaling, koppelingen met kantoorsoftware en de standaardinstellingen voor training.'),
  ('Wat kost Claude per maand?','Claude Pro kost €18 per maand bij maandelijks betalen, of €15 per maand bij jaarbetaling (€180 vooraf). Anthropic noemt de prijzen exclusief btw.'),
  ('Gebruikt Claude mijn gesprekken voor training?','Bij Free, Pro en Max kun je dat uitzetten. Bij de zakelijke plannen traint Anthropic volgens de prijspagina standaard niet op je inhoud.')],
 [CHATGPT_SRC,('Claude Pricing','https://claude.com/pricing')])

vs('/vergelijken/zapier-vs-make-vs-n8n/','Zapier vs Make vs n8n: welke past bij jou? | ToolMatch',
 'Zapier, Make of n8n? Vergelijk gemak, prijs per taak of operatie, waar je gegevens staan en wat je zelf moet beheren als je n8n zelf host.',
 'Zapier vs Make vs n8n','Zapier vs Make vs n8n',
 'Drie tools om apps te koppelen zonder te programmeren. Ze rekenen elk op een andere manier: per taak, per credit of per uitvoering. Zo kies je.',
 ['Zapier','Make','n8n'],
 [('Wat het is','Koppelt duizenden apps; snel te beginnen.','Visuele bouwer met veel controle over elke stap.','Automatiseren met AI-agents en code-stappen; ook zelf te hosten.'),
  ('Gratis versie','Ja (met beperkingen).','Ja: 1.000 credits per maand.','Zelf hosten met de Community Edition; de door n8n gehoste versie is betaald.'),
  ('Betaald vanaf','Professional, met 750 taken; het bedrag zie je op de prijspagina van Zapier.','Niet gecontroleerd.','Starter: €20 per maand bij jaarbetaling.'),
  ('Hoe het telt','Per taak.','Per credit.','Per uitvoering.'),
  ('Gegevens','Niet gecontroleerd.','Niet gecontroleerd.','In de EU (Frankfurt) als n8n host; zelf hosten kan ook.'),
  ('Instap (onze indeling)','Eenvoudig.','Gemiddeld.','Technisch.')],
 '''      <p>Alle drie koppelen ze apps: als er in de ene app iets gebeurt, doet de andere iets. Het verschil zit in <strong>gemak</strong>, <strong>hoe de prijs meegroeit</strong> en <strong>waar je gegevens langs gaan</strong>.</p>
''',
 [('Zelf hosten met n8n','''      <p>n8n kun je zelf hosten. Dan staan je gegevens op je eigen server, maar ben je zelf verantwoordelijk voor updates, beveiliging en back-ups. Kun je dat niet zelf, dan is de door n8n gehoste versie of een van de andere twee eenvoudiger.</p>
'''),
  ('Zo kies je',f'''      <ul>
        <li><strong>Kies Zapier</strong> als je snel wilt beginnen en gemak belangrijker vindt dan de laagste prijs.</li>
        <li><strong>Kies Make</strong> als je meer controle wilt over elke stap. Bekijk de prijs op de site van Make: die konden we niet controleren.</li>
        <li><strong>Kies n8n</strong> als je gegevens in de EU wilt houden of zelf wilt hosten, en technisch werk niet erg vindt.</li>
        <li>Lees ook {L('/automatiseren-zonder-code/','wat je allemaal kunt automatiseren')}, en meer over {L('/gids/ai-veilig-gebruiken/','EU-hosting en je gegevens')}.</li>
      </ul>
''')],
 [('Wat is goedkoper: Zapier of Make?','Dat hangt af van hoeveel taken je nodig hebt. Het bedrag van Zapier Professional (750 taken) zie je op de prijspagina van Zapier, dat van Make op de prijspagina van Make. Een taak bij Zapier en een credit bij Make zijn niet hetzelfde, dus reken met je eigen automatiseringen.'),
  ('Is n8n gratis?','De Community Edition kun je volgens n8n zelf hosten. De versie die n8n voor je host, begint bij Starter: €20 per maand bij jaarbetaling.'),
  ('Waar staan mijn gegevens?','Bij n8n Cloud volgens de aanbieder in de EU (Frankfurt). Bij Zapier en Make hebben we de locatie niet gecontroleerd.')],
 [tuple(b) for i in ('zapier','make','n8n') for b in T[i]['bronnen']])

VSID={'ChatGPT':'chatgpt','Copilot Business':'copilot','Gemini in Google Workspace':'gemini','Claude':'claude','Zapier':'zapier','Make':'make','n8n':'n8n'}
for v in VS:
    nc=len(v['cols'])
    th=''.join(f'<th scope="col">{LG(VSID[c])}{E(c)}</th>' for c in v['cols'])
    tr=''.join('          <tr><th scope="row">'+r[0]+'</th>'+''.join(f'<td>{E(x)}</td>' for x in r[1:])+'</tr>\n' for r in v['rows'])
    tbl=f'''      <h2 id="naast-elkaar">Naast elkaar</h2>
      <div class="tbl" role="region" aria-label="{E(v['crumb'])} naast elkaar" tabindex="0">
        <table class="vs">
          <thead><tr><th scope="col">Gecontroleerd op {GCN}</th>{th}</tr></thead>
          <tbody>
{tr}          </tbody>
        </table>
      </div>
'''
    body=v['intro']+tbl+''.join(f'      <h2>{h}</h2>\n{b}' for h,b in v['secties'])+faq_html(v['faq'])+bronnen_html(v['src'])+byline(v['slug'])
    crumb=f'<a href="/vergelijken/">Vergelijken</a> › {v["crumb"]}'
    graph=[{"@type":"Article","@id":D+v['slug']+"#artikel","headline":v['h1'],"description":v['desc'],"inLanguage":"nl-NL","url":D+v['slug'],"mainEntityOfPage":D+v['slug'],"datePublished":PUB,"dateModified":LOGO_UPD.get(v['slug']) or VALUTA_UPD.get(v['slug'],SCHEMA_UPD),"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
      crumbs_ld([('Home','/'),('Vergelijken','/vergelijken/'),(v['crumb'],v['slug'])]),faq_ld(v['slug'],v['faq'])]
    zet(v['slug'],v['title'],v['desc'],crumb,v['h1'],v['lead'],body,graph)

KIES={'/vergelijken/chatgpt-vs-copilot/':'Werk je in Word, Outlook en Teams? Dan zit Copilot in je eigen apps. ChatGPT is de losse assistent, ook zonder Microsoft 365.',
 '/vergelijken/chatgpt-vs-gemini/':'Werk je in Gmail en Google Docs? Dan krijg je Gemini via Google Workspace. ChatGPT werkt los van je mail en documenten.',
 '/vergelijken/chatgpt-vs-claude/':'Twee losse assistenten met een gratis versie. Ze verschillen in prijs bij jaarbetaling, koppelingen en instellingen voor training.',
 '/vergelijken/zapier-vs-make-vs-n8n/':'Zapier voor gemak, Make voor controle over elke stap, n8n als je gegevens in de EU wilt of zelf wilt hosten.'}
def hub(path,title,desc,crumb,h1,lead,intro,items,outro=''):
    li=''.join(f'''      <article class="res">
        <h3><a href="{p}">{E(n)}</a></h3>
        <p>{E(t)}</p>
      </article>
''' for p,n,t in items)
    body=intro+f'      <h2 id="overzicht">{"Kies een vergelijking" if path=="/vergelijken/" else "Alle gidsen"}</h2>\n      <div class="results">\n'+li+'      </div>\n'+outro+f'      <p class="note">Redactie ToolMatch · bijgewerkt op {GCN}</p>\n'
    graph=[{"@type":"CollectionPage","@id":D+path,"url":D+path,"name":h1,"description":desc,"inLanguage":"nl-NL","isPartOf":{"@id":D+"/#website"},"publisher":ORG},
      {"@type":"ItemList","name":h1,"itemListOrder":"https://schema.org/ItemListUnordered","itemListElement":[{"@type":"ListItem","position":n+1,"name":nm,"url":D+p} for n,(p,nm,_) in enumerate(items)]},
      crumbs_ld([('Home','/'),(crumb,path)])]
    zet(path,title,desc,crumb,h1,lead,body,graph)
hub('/vergelijken/','AI-tools vergelijken: alle vergelijkingen | ToolMatch',
 'Alle vergelijkingen van ToolMatch op een rij: ChatGPT tegen Copilot, Gemini en Claude, en Zapier tegen Make en n8n. Met prijzen, bronnen en datum.',
 'Vergelijken','Alle vergelijkingen',
 'Twee of drie bekende tools naast elkaar: wat ze kosten, waar ze in je werk passen en wat er met je gegevens gebeurt. Met de bron en de datum bij elk gegeven.',
 '''      <p>In een vergelijking zetten we alleen naast elkaar wat we op de sites van de aanbieders konden controleren. Konden we iets niet bevestigen, dan staat er "niet gecontroleerd". We geven geen cijfers of sterren: welke tool past, hangt af van je situatie. Zoek je liever per soort werk? Bekijk dan <a href="/#categorieen">de categorieën</a>.</p>
''',[(v['slug'],v['h1'],KIES[v['slug']]) for v in VS])

# ======================= GIDSEN =======================
GIDS=[]
def gids(slug,title,desc,crumb,h1,lead,body,faq,srcs):
    GIDS.append(dict(slug=slug,title=title,desc=desc,crumb=crumb,h1=h1,lead=lead,body=body,faq=faq,src=srcs))

gids('/gids/ai-gebruiken-in-je-bedrijf/','AI gebruiken in je bedrijf: een stappenplan | ToolMatch',
 'Zo begin je met AI in je bedrijf: kies de taken die tijd kosten, test met echt werk, regel privacy en houd de abonnementen klein. Met praktijkvoorbeelden.',
 'AI gebruiken in je bedrijf','AI gebruiken in je bedrijf: een stappenplan',
 'Niet beginnen bij de tool, maar bij het werk. In zes stappen van "we moeten iets met AI" naar een paar tools die echt tijd schelen.',
 f'''      <h2 id="stap-1">1. Kies de taken die tijd kosten</h2>
      <p>Schrijf een week lang op welk werk steeds terugkomt en weinig plezier geeft. Denk aan: mails beantwoorden met steeds dezelfde uitleg, notulen uitwerken na een overleg, een eerste versie van een offertetekst of een LinkedIn-post. Dat zijn taken waar AI vaak goed bij helpt. Werk waarbij één fout grote gevolgen heeft, zoals juridische teksten of berekeningen, laat je beter (nog) niet aan AI over.</p>
      <h2 id="stap-2">2. Kijk wat je al hebt</h2>
      <p>Misschien zit de functie al in software die je betaalt. Bij geschikte Microsoft 365-plannen is Copilot Chat volgens Microsoft zonder extra kosten beschikbaar, en in Google Workspace zit Gemini in Gmail vanaf Business Starter. Kijk daar eerst, voordat je een nieuw abonnement neemt.</p>
      <h2 id="stap-3">3. Test met echt werk</h2>
      <p>Neem één taak en probeer twee tools met dezelfde opdracht, liefst in een gratis versie of proefperiode. Kijk naar wat je echt bespaart: hoeveel moet je nog herschrijven of controleren? Weet je niet waar je moet beginnen, dan helpt {L('/keuzehulp/','de keuzehulp')} met een eerste selectie.</p>
      <h2 id="stap-4">4. Regel privacy en afspraken</h2>
      <p>Bepaal vooraf welke gegevens wel en niet in een AI-tool mogen. Gaat het om persoonsgegevens van klanten, dan geldt de AVG en heb je afspraken met de aanbieder nodig. Werk je met meer mensen, {L('/gids/ai-beleid-opstellen/','spreek een kort AI-beleid af')}, zodat iedereen weet wat mag.</p>
      <h2 id="stap-5">5. Zorg dat je team weet wat het doet</h2>
      <p>Organisaties die AI-systemen gebruiken, moeten volgens de Autoriteit Persoonsgegevens sinds 2 februari 2025 zorgen dat hun medewerkers AI-geletterd zijn: genoeg weten en kunnen om AI verantwoord in te zetten. Welke maatregelen dat precies zijn, staat niet in de wet. Een korte uitleg aan je team over wat AI goed en slecht doet, is een begin.</p>
      <h2 id="stap-6">6. Houd de abonnementen klein</h2>
      <p>Neem één abonnement per taak en zeg op wat je na een maand niet gebruikt. Reken met de prijs per gebruiker en let op jaarbetalingen die automatisch verlengen. Zo {L('/gids/wat-kosten-ai-abonnementen/','houd je de kosten klein')}.</p>
''',
 [('Waar begin ik met AI in mijn bedrijf?','Bij het werk, niet bij de tool. Kies één taak die vaak terugkomt en tijd kost, en test daar twee tools mee.'),
  ('Heb ik een betaald abonnement nodig?','Niet altijd. Veel tools hebben een gratis versie, en misschien zit de functie al in software die je betaalt, zoals Microsoft 365 of Google Workspace.'),
  ('Moet mijn team een AI-training volgen?','Organisaties die AI gebruiken, moeten volgens de Autoriteit Persoonsgegevens zorgen dat medewerkers AI-geletterd zijn. Welke maatregelen dat zijn, staat niet in de wet; dat hangt af van hoe je AI gebruikt.')],
 [AP_GESL,('Microsoft: Copilot voor kleine bedrijven','https://www.microsoft.com/nl-nl/microsoft-365/copilot/business'),('Google Workspace: prijzen','https://workspace.google.com/intl/nl/pricing')])

gids('/gids/ai-veilig-gebruiken/','ChatGPT en AI veilig gebruiken in je bedrijf | ToolMatch',
 'Wat mag je wel en niet in ChatGPT of Copilot typen? Zo zet je training uit, kies je een zakelijk abonnement en regel je een verwerkersovereenkomst.',
 'AI veilig gebruiken','ChatGPT en AI veilig gebruiken in je bedrijf',
 'Wat je in een AI-tool typt, verlaat je computer. Zo houd je gegevens van klanten veilig: wat je niet invoert, welke instellingen je aanzet en welke afspraken je maakt.',
 f'''      <h2 id="niet-invoeren">Wat je niet in een AI-tool zet</h2>
      <ul>
        <li><strong>Persoonsgegevens van klanten</strong>, zoals namen, adressen, telefoonnummers of klantnummers, tenzij je afspraken hebt met de aanbieder (zie hieronder).</li>
        <li><strong>Gevoelige gegevens</strong>, zoals gegevens over gezondheid, en wachtwoorden of inloggegevens.</li>
        <li><strong>Vertrouwelijke informatie</strong> van klanten of partners waarover je geheimhouding hebt afgesproken.</li>
      </ul>
      <p>Heb je ze niet nodig voor de taak, haal ze er dan uit. Voor een samenvatting of een analyse zijn namen bijna nooit nodig. Dat geldt ook voor {L('/ai-notuleren/','opnames van meetings')}: daarin staan stemmen en namen.</p>
      <h2 id="training">Zet training op je invoer uit</h2>
      <p>Sommige aanbieders gebruiken wat je invoert om hun AI te verbeteren. Bij veel tools kun je dat uitzetten:</p>
      <ul>
        <li><strong>ChatGPT:</strong> opt-out beschikbaar bij Free, Go, Plus en Pro, via de instellingen voor gegevensbeheer.</li>
        <li><strong>Claude:</strong> opt-out bij Free, Pro en Max; bij de zakelijke plannen traint Anthropic volgens de prijspagina standaard niet op je inhoud.</li>
        <li><strong>Copilot Business:</strong> prompts en antwoorden worden volgens Microsoft niet gebruikt om de modellen te trainen.</li>
        <li><strong>DeepL:</strong> bij betaalde abonnementen wordt je tekst volgens DeepL niet gebruikt voor training.</li>
      </ul>
      <h2 id="verwerkersovereenkomst">Regel een verwerkersovereenkomst</h2>
      <p>Verwerkt een aanbieder persoonsgegevens voor jou, dan is die aanbieder een verwerker. De AVG eist dan een verwerkersovereenkomst: schriftelijke afspraken over onder meer beveiliging, subverwerkers en het verwijderen van gegevens. Volgens de Autoriteit Persoonsgegevens ben je in overtreding als je met een verwerker werkt zonder zo'n overeenkomst. Kijk daarom vóór je klantgegevens invoert of de aanbieder een verwerkersovereenkomst biedt bij jouw abonnement. Wil je je gegevens in Europa houden, bekijk dan {L('/ai-assistenten/','assistenten met EU-opslag')}.</p>
      <h2 id="koppelingen">Let op koppelingen</h2>
      <p>Koppel je apps met een tool als {L('/vergelijken/zapier-vs-make-vs-n8n/','Zapier, Make of n8n')}, dan gaan je gegevens via die tool. Ook daarvoor heb je dan afspraken nodig. n8n biedt hosting in de EU (Frankfurt) of zelf hosten; bij de andere twee hebben we de locatie niet gecontroleerd.</p>
      <h2 id="vastleggen">Leg het vast</h2>
      <p>Spreek met je team af welke tools mogen en welke gegevens nooit in een AI-tool gaan, en {L('/gids/ai-beleid-opstellen/','leg het vast in een AI-beleid')}. De Autoriteit Persoonsgegevens heeft ook een hulpmiddel gepubliceerd om in te schatten of je generatieve AI kunt en mag inzetten.</p>
      <p>Begin je net met AI? Volg dan {L('/gids/ai-gebruiken-in-je-bedrijf/','het stappenplan voor AI in je bedrijf')}. Als startpunt kun je {L('/gids/prompts-voor-ondernemers/','de voorbeeldprompts voor ondernemers')} gebruiken.</p>
''',
 [('Mag ik klantgegevens in ChatGPT zetten?','Alleen als je weet wat er met die gegevens gebeurt en je afspraken hebt gemaakt met de aanbieder, zoals een verwerkersovereenkomst. Is dat niet geregeld, haal persoonsgegevens dan weg.'),
  ('Hoe zet ik training uit in ChatGPT?','ChatGPT noemt op de prijspagina een opt-out voor training op je inhoud bij Free, Go, Plus en Pro. Je vindt die in de instellingen voor gegevensbeheer (Data Controls).'),
  ('Wat is een verwerkersovereenkomst?','Een schriftelijke overeenkomst met een partij die persoonsgegevens voor jou verwerkt. De AVG verplicht die in artikel 28. Er staat in wat de verwerker met de gegevens mag doen, hoe ze beveiligd worden en wat er gebeurt na afloop.')],
 [CHATGPT_SRC,('Claude Pricing','https://claude.com/pricing'),('Microsoft: Copilot voor kleine bedrijven','https://www.microsoft.com/nl-nl/microsoft-365/copilot/business'),('DeepL Pro','https://www.deepl.com/en/pro'),('n8n Pricing','https://n8n.io/pricing/'),AP_VWO,AP_HULP])

gids('/gids/ai-act-ondernemers/','AI Act voor ondernemers: wat moet je regelen? | ToolMatch',
 'Wat vraagt de AI-verordening van jou als je AI-tools gebruikt? Over AI-geletterdheid, de data uit de wet en wat een klein bedrijf echt moet doen.',
 'AI Act voor ondernemers','AI Act voor ondernemers: wat moet je regelen?',
 'De Europese AI-verordening (AI Act) geldt ook voor bedrijven die AI alleen gebruiken. Wat betekent dat voor een klein bedrijf? Op basis van officiële bronnen.',
 f'''      <p class="pledge-n">Dit is algemene uitleg op basis van de Autoriteit Persoonsgegevens en de wettekst, geen juridisch advies. Twijfel je over jouw situatie, vraag dan advies aan een jurist.</p>
      <h2 id="wat">Wat is de AI-verordening?</h2>
      <p>De AI-verordening (Verordening (EU) 2024/1689) is de Europese wet over kunstmatige intelligentie. Ze deelt AI-systemen in naar risico: hoe hoger het risico voor mensen, hoe strenger de regels. De wet geldt voor organisaties die AI aanbieden én voor organisaties die AI gebruiken, ook voor het mkb.</p>
      <h2 id="data">De data</h2>
      <ul>
        <li><strong>Sinds 2 februari 2025:</strong> een aantal AI-systemen is verboden, en organisaties die AI ontwikkelen of gebruiken, moeten zorgen dat hun medewerkers AI-geletterd zijn.</li>
        <li><strong>Vanaf augustus 2026:</strong> transparantieregels voor AI-systemen met een beperkt risico, zoals chatbots en AI die teksten en beeld maakt. Andere AI-systemen moeten vanaf 2 augustus 2026 aan extra eisen voldoen.</li>
        <li><strong>2 augustus 2027:</strong> de verordening is helemaal van kracht.</li>
      </ul>
      <p>Bron: Autoriteit Persoonsgegevens, bekeken op {GCN}.</p>
      <h2 id="geletterdheid">AI-geletterdheid</h2>
      <p>Iedereen die binnen of namens je bedrijf met AI-systemen werkt, moet genoeg weten en kunnen om AI verantwoord te gebruiken. Welke maatregelen je precies neemt, staat niet in de wet: dat hangt af van hoe en waarvoor je AI inzet. Leg vast welke tools je gebruikt en wat je team daarover weet. {L('/gids/ai-beleid-opstellen/','Een AI-beleid helpt om AI-geletterdheid vast te leggen')}.</p>
      <h2 id="transparantie">Vertellen dat het AI is</h2>
      <p>Gebruik je een chatbot op je website, of maak je teksten of beelden met AI? Dan moet je mensen volgens de Autoriteit Persoonsgegevens in bepaalde gevallen informeren dat ze met AI te maken hebben, bijvoorbeeld bij een chatbot of deepfake. Bij een chatbot zet je dat bijvoorbeeld in het chatvenster.</p>
      <h2 id="hoog-risico">Hoog risico</h2>
      <p>Voor AI met een hoog risico gelden strengere regels, bijvoorbeeld voor AI die bedoeld is voor werving en selectie. Gebruik je zoiets, dan moet je onder meer zorgen voor menselijk toezicht en het systeem gebruiken volgens de gebruiksaanwijzing van de aanbieder. Het is je eigen verantwoordelijkheid om te beoordelen in welke risicogroep een systeem valt.</p>
      <h2 id="avg">En de AVG?</h2>
      <p>De AI-verordening komt bovenop de AVG. Gaan er persoonsgegevens in een AI-tool, dan gelden ook de regels uit de AVG. Lees daarover {L('/gids/ai-veilig-gebruiken/','AVG en AI-tools')}.</p>
''',
 [('Geldt de AI Act ook voor mijn kleine bedrijf?','Ja, de AI-verordening geldt ook voor organisaties die AI gebruiken, van overheid tot mkb. Voor de meeste kleine bedrijven gaat het vooral om AI-geletterdheid en transparantie.'),
  ('Wat is AI-geletterdheid?','Dat medewerkers genoeg weten en kunnen om AI verantwoord in te zetten. Organisaties die AI gebruiken, moeten daar volgens de Autoriteit Persoonsgegevens sinds 2 februari 2025 voor zorgen.'),
  ('Moet ik melden dat mijn chatbot AI is?','Volgens de Autoriteit Persoonsgegevens moet je mensen vanaf augustus 2026 in bepaalde gevallen informeren dat ze met AI te maken hebben, bijvoorbeeld bij een chatbot of deepfake.'),
  ('Wanneer is de AI Act helemaal van kracht?','Op 2 augustus 2027, volgens de Autoriteit Persoonsgegevens. Delen gelden al eerder.')],
 [AP_AIV,AP_GESL,AP_RISK,EURLEX])

gids('/gids/ai-beleid-opstellen/','AI-beleid opstellen, met voorbeeld | ToolMatch',
 'Een kort AI-beleid voor je team: welke tools mogen, welke gegevens nooit in een AI-tool gaan en wie controleert. Met een voorbeeld dat je kunt aanpassen.',
 'AI-beleid opstellen','AI-beleid opstellen, met voorbeeld',
 'Eén pagina is genoeg. Een kort AI-beleid zegt welke tools je team mag gebruiken, welke gegevens nooit in een AI-tool gaan en wie het resultaat controleert.',
 f'''      <h2 id="waarom">Waarom een AI-beleid?</h2>
      <p>Zonder afspraken gebruikt iedereen zijn eigen tool, met zijn eigen instellingen. Een kort beleid voorkomt dat er klantgegevens in een gratis tool belanden. Het helpt ook om te laten zien hoe je werkt aan AI-geletterdheid. Welke maatregelen je voor AI-geletterdheid neemt, staat volgens de Autoriteit Persoonsgegevens niet in de wet: een beleid is een manier, geen vaste eis. Lees {L('/gids/ai-act-ondernemers/','wat de AI Act verplicht')}.</p>
      <h2 id="wat-erin">Wat erin staat</h2>
      <ol>
        <li><strong>Welke tools mogen.</strong> Een korte lijst, met het abonnement dat je gebruikt (persoonlijk of zakelijk).</li>
        <li><strong>Welke gegevens nooit in een AI-tool gaan.</strong> Zie {L('/gids/ai-veilig-gebruiken/','welke gegevens nooit in een AI-tool')} horen.</li>
        <li><strong>Instellingen.</strong> Bijvoorbeeld: training op je invoer staat uit.</li>
        <li><strong>Controle.</strong> Wie leest na voordat iets naar een klant gaat of online komt.</li>
        <li><strong>Vertellen dat het AI is.</strong> Wanneer je meldt dat een tekst, beeld of chatbot met AI werkt.</li>
        <li><strong>Vragen en fouten.</strong> Bij wie je terechtkunt, en wat je doet als er toch iets misgaat.</li>
      </ol>
      <h2 id="voorbeeld">Voorbeeld dat je kunt aanpassen</h2>
      <div class="pledge-n">
        <p><strong>AI-beleid van [bedrijfsnaam]</strong> · versie [datum]</p>
        <ol>
          <li>We gebruiken voor werk alleen deze AI-tools: [tool en abonnement]. Een nieuwe tool overleg je eerst met [naam of rol].</li>
          <li>We zetten nooit persoonsgegevens van klanten, wachtwoorden of vertrouwelijke informatie in een AI-tool, tenzij die tool op de lijst staat met een verwerkersovereenkomst.</li>
          <li>Training op onze invoer staat uit, als de tool die keuze biedt.</li>
          <li>Wat AI maakt, lezen we na voordat het naar een klant gaat of online komt. De maker blijft verantwoordelijk.</li>
          <li>Praat een klant met een chatbot, of is een beeld of tekst met AI gemaakt waar dat vermeld moet worden, dan zeggen we dat.</li>
          <li>Twijfel, een vraag of een fout? Meld het bij [naam of rol]. Bij een mogelijk datalek: direct.</li>
          <li>We kijken elk half jaar of dit beleid nog klopt.</li>
        </ol>
      </div>
      <p>Pas het voorbeeld aan op je eigen bedrijf. Bespreek het met je team, zodat iedereen weet waarom de afspraken er zijn.</p>
      <p>Weet je nog niet voor welke taken je AI wilt inzetten? Volg dan {L('/gids/ai-gebruiken-in-je-bedrijf/','het stappenplan voor AI in je bedrijf')}. Wil je je team een begin geven, deel dan {L('/gids/prompts-voor-ondernemers/','de voorbeeldprompts voor ondernemers')}.</p>
''',
 [('Is een AI-beleid verplicht?','Een apart AI-beleid wordt in de bronnen die we bekeken niet als verplichting genoemd. Wel moeten organisaties die AI gebruiken volgens de Autoriteit Persoonsgegevens zorgen voor AI-geletterdheid, en een beleid helpt daarbij.'),
  ('Hoe lang moet een AI-beleid zijn?','Voor een klein bedrijf is één pagina genoeg: welke tools mogen, welke gegevens niet, wie controleert en bij wie je terechtkunt.'),
  ('Mag ik dit voorbeeld gebruiken?','Ja, pas het aan op je eigen bedrijf. Het is een voorbeeld, geen juridisch advies.')],
 [AP_GESL,AP_VWO,AP_RISK])

PRIJZEN=[('chatgpt','ChatGPT'),('claude','Claude'),('lechat','Le Chat'),('copilot','Copilot Business'),('gemini','Gemini in Google Workspace'),('deepl','DeepL')]
prijsrows=''.join(f'''          <tr><th scope="row">{LG(i)}{E(n)}</th><td>{JN(T[i]['gratis'])}</td><td>{E(T[i]['prijs'])}</td><td>{', '.join(X(u,E(b)) for b,u in T[i]['bronnen'])}</td></tr>
''' for i,n in PRIJZEN)
gids('/gids/wat-kosten-ai-abonnementen/','Wat kosten ChatGPT, Copilot en andere AI-tools? | ToolMatch',
 'Wat betaal je per maand voor ChatGPT, Copilot, Gemini en Claude? Persoonlijk en zakelijk naast elkaar, met de bron en de datum bij elke prijs.',
 'Wat kosten AI-abonnementen','Wat kosten ChatGPT, Copilot en andere AI-tools?',
 'De prijzen van de bekende AI-assistenten op een rij, zoals de aanbieders ze vermelden. Met waar je op moet letten: valuta, btw, jaarbetaling en prijs per gebruiker.',
 f'''      <h2 id="prijzen">De prijzen op een rij</h2>
      <p>Gecontroleerd op {GCN}; de europrijzen van Google Workspace en DeepL hebben we op 26 oktober 2026 nagelezen op hun Nederlandse prijspagina. Met of zonder btw zoals de aanbieder het vermeldt. We noemen alleen bedragen in euro. Konden we op een Nederlandse prijspagina geen europrijs nalezen, dan staat alleen het abonnement erbij en vind je het bedrag via de bron.</p>
      <div class="tbl" role="region" aria-label="Prijzen van AI-abonnementen" tabindex="0">
        <table>
          <thead><tr><th scope="col">Tool</th><th scope="col">Gratis versie</th><th scope="col">Betaald vanaf</th><th scope="col">Bron</th></tr></thead>
          <tbody>
{prijsrows}          </tbody>
        </table>
      </div>
      <h2 id="persoonlijk-zakelijk">Persoonlijk of zakelijk</h2>
      <p>Persoonlijke abonnementen zoals ChatGPT Plus en Claude Pro reken je per persoon. Zakelijke abonnementen zoals Copilot Business en Google Workspace reken je ook per gebruiker, maar daar horen beheer en afspraken over je gegevens bij. Werk je met klantgegevens, dan is een zakelijk abonnement vaak de betere keuze. Twijfel je tussen de twee bekendste? Lees {L('/vergelijken/chatgpt-vs-copilot/','ChatGPT of Copilot zakelijk')}.</p>
      <h2 id="let-op">Waar je op let</h2>
      <ul>
        <li><strong>Kijk naar de Nederlandse prijs.</strong> Sommige aanbieders tonen hun prijs in een andere munt, afhankelijk van waar je de pagina bekijkt. Wat je betaalt, zie je op de betaalpagina voordat je afrekent.</li>
        <li><strong>Met of zonder btw.</strong> Microsoft noemt de prijs van Copilot exclusief btw, DeepL de prijs van Individual inclusief btw. Vergelijk dus niet zomaar.</li>
        <li><strong>Jaarbetaling.</strong> "Per maand bij jaarbetaling" betekent dat je een jaar vooruit betaalt. Zonder jaarcontract is de prijs vaak hoger, zoals bij Google Workspace Business Starter: €8,10 per gebruiker per maand, met een contract van 1 jaar €6,80.</li>
        <li><strong>Actieprijzen.</strong> Copilot Business heeft tot en met 31 december 2026 een actieprijs voor het eerste jaar. Daarna betaal je de normale prijs.</li>
        <li><strong>Per gebruiker.</strong> Met vijf mensen betaal je vijf keer. Kijk of iedereen echt een eigen abonnement nodig heeft.</li>
      </ul>
      <p>Welke assistent het beste past, lees je bij {L('/ai-assistenten/','welke assistent bij je past')}.</p>
''',
 [('Wat kost ChatGPT per maand?','Het betaalde abonnement voor één persoon heet ChatGPT Plus en kost €23 per maand; of daar btw bij zit, staat niet op de prijspagina. Plus betaal je per maand: jaarabonnementen noemt OpenAI alleen voor Business en Enterprise. Er is ook een gratis versie met beperkingen.'),
  ('Wat kost Copilot per maand?','Copilot Business kost €18,20 per gebruiker per maand bij jaarbetaling, exclusief btw. Bij aanschaf tot en met 31 december 2026 geldt een actieprijs van €15,60 voor het eerste jaar.'),
  ('Wat is het verschil tussen ChatGPT Plus en Business?','Plus is een persoonlijk abonnement. Business is voor teams, met beheer en zakelijke afspraken. De prijs van Business konden we op de prijspagina niet aflezen.')],
 [tuple(b) for i,_ in PRIJZEN for b in T[i]['bronnen']])

for g in GIDS:
    upd=LOGO_UPD.get(g['slug']) or PRIJS_UPD.get(g['slug']) or VALUTA_UPD.get(g['slug'])
    body=g['body']+faq_html(g['faq'])+bronnen_html(g['src'])+(f'      <p class="note">Redactie ToolMatch · gepubliceerd op {GCN}, gecontroleerd op {GCN}, bijgewerkt op {datum_nl(upd)}. Prijzen zoals de aanbieder ze vermeldt; wat de aanbieder je bij het afsluiten aanbiedt, gaat voor.</p>\n' if upd else f'      <p class="note">Redactie ToolMatch · gepubliceerd op {GCN}, gecontroleerd op {GCN}{", bijgewerkt op 29 oktober 2026" if g["slug"] in VERDER_GIDS else ""}</p>\n')
    crumb=f'<a href="/gids/">Gidsen</a> › {g["crumb"]}'
    graph=[{"@type":"Article","@id":D+g['slug']+"#artikel","headline":g['h1'],"description":g['desc'],"inLanguage":"nl-NL","url":D+g['slug'],"mainEntityOfPage":D+g['slug'],"datePublished":PUB,"dateModified":upd or (VERDER_UPD if g['slug'] in VERDER_GIDS else SCHEMA_UPD),"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
      crumbs_ld([('Home','/'),('Gidsen','/gids/'),(g['crumb'],g['slug'])]),faq_ld(g['slug'],g['faq'])]
    zet(g['slug'],g['title'],g['desc'],crumb,g['h1'],g['lead'],body,graph)


# ======================= VRIJDAG: VERTALEN + PROMPTS =======================
DEEPL_NL=('DeepL Pro (Nederlandse prijspagina)','https://www.deepl.com/nl/pro')
vt=dict(slug='/ai-vertalen/',title='AI-vertaaltools voor je bedrijf: DeepL en meer | ToolMatch',
 desc='Zakelijke teksten en documenten vertalen met AI. Vergelijk DeepL, Google Translate en AI-assistenten op kwaliteit, privacy van je bestanden en prijs.',
 crumb='Vertalen',h1='AI-vertaaltools voor je bedrijf',
 lead='Een offerte in het Engels, een webpagina in het Duits of een document van een buitenlandse klant. Zo vergelijk je vertaaltools op prijs en wat er met je bestanden gebeurt.',
 intro=f'''      <p>Voor vertalen heb je drie soorten tools: een <strong>vertaaldienst</strong> zoals DeepL, een <strong>algemene AI-assistent</strong> die ook kan vertalen, en een <strong>vertaal-API</strong> voor als je vertalingen in je eigen website of software wilt inbouwen.</p>
      <p>Google Translate kun je ook gebruiken om bestanden en websites te vertalen, volgens Google. De voorwaarden en wat er met je bestanden gebeurt, hebben we voor de gratis webversie niet gecontroleerd; daarom staat die hier niet als tool met prijs. Hoe goed een tool vertaalt, hebben we niet gemeten. Laat een belangrijke vertaling altijd nalezen door iemand die de taal goed kent.</p>
''',
 tools=[('chatgpt','je af en toe iets vertaalt en de vertaling meteen wilt laten aanpassen aan je doelgroep.'),
  ('deepl','je regelmatig teksten en documenten vertaalt; bij Individual zit volgens DeepL geen training op je gegevens en 3 documentvertalingen per maand. Team kost €24,99 per gebruiker per maand bij jaarbetaling.'),
  ('googlecloudtranslate','je vertalingen wilt inbouwen in je eigen website of software; daar heb je technische kennis voor nodig.'),
  ('lechat','je liever een Europese AI-assistent gebruikt om te vertalen.')],
 kies=['<strong>Wat vertaal je?</strong> Losse zinnen en mails kun je met elke tool vertalen. Voor hele documenten in dezelfde opmaak is een vertaaldienst handiger.',
  '<strong>Wat staat er in je bestanden?</strong> Gaat het om klantgegevens of vertrouwelijke stukken, kies dan een abonnement waarvan je weet dat je tekst niet voor training wordt gebruikt.',
  '<strong>Laat nalezen.</strong> Een vertaling voor een klant of je website laat je controleren door iemand die de taal goed kent.'],
 faq=[('Is DeepL beter dan Google Translate?','Dat hebben we niet gemeten. Vergelijk ze zelf met een echte tekst uit je werk. Voor zakelijk gebruik is ook belangrijk wat er met je tekst gebeurt: bij betaalde DeepL-abonnementen wordt je tekst volgens DeepL niet gebruikt voor training.'),
  ('Kan ik een heel document laten vertalen?','Ja. DeepL Individual heeft volgens DeepL 3 documentvertalingen per maand, en ook Google Translate kan volgens Google bestanden vertalen.'),
  ('Wat kost DeepL voor een bedrijf?','DeepL Individual kost €7,49 per maand en Team €24,99 per gebruiker per maand, allebei bij jaarbetaling. Er is een gratis proefperiode van 30 dagen.')],
 src=[DEEPL_NL,('Google Translate: over','https://translate.google.com/intl/nl/about/')])
c=vt; c['tools']=alfa(c['tools']); ids=[i for i,_ in c['tools']]
assert all(T[i]['prijs'] for i in ids) and len(ids)>=3
srcs=[tuple(b) for i in ids for b in T[i]['bronnen']]+c['src']
body=c['intro']+'      <h2 id="overzicht">In het kort</h2>\n      <p>De tools staan op alfabetische volgorde, niet op rangorde.</p>\n'+kort_tabel(ids,'Overzicht van de vertaaltools')
body+='      <h2 id="tools">De tools</h2>\n'+met_noot('      <div class="results">\n'+''.join(kaart(T[i],p) for i,p in c['tools'])+'      </div>\n')
body+='      <h2 id="zo-kies-je">Zo kies je</h2>\n      <ul>\n'+''.join(f'        <li>{k}</li>\n' for k in c['kies'])+'      </ul>\n'
body+=f'      <p>Schrijf je de tekst eerst zelf? Bekijk dan de {L("/ai-tekst-schrijven/","AI-tools voor Nederlandse teksten")}.</p>\n'
body+=faq_html(c['faq'])+bronnen_html(srcs)+byline(c['slug'])
graph=[{"@type":"CollectionPage","@id":D+c['slug'],"url":D+c['slug'],"name":c['h1'],"description":c['desc'],"inLanguage":"nl-NL","isPartOf":{"@id":D+"/#website"},"publisher":ORG,"dateModified":LOGO_UPD.get(c['slug']) or VALUTA_UPD.get(c['slug'],GC)},
  {"@type":"ItemList","name":c['h1'],"itemListOrder":"https://schema.org/ItemListUnordered","itemListElement":[{"@type":"ListItem","position":n+1,"name":T[i]['naam'],"url":D+c['slug']+'#'+i} for n,i in enumerate(ids)]},
  crumbs_ld([('Home','/'),(c['crumb'],c['slug'])]),faq_ld(c['slug'],c['faq'])]
zet(c['slug'],c['title'],c['desc'],c['crumb'],c['h1'],c['lead'],body,graph)

def prompt(titel,tekst): return f'''      <div class="pledge-n prompt">
        <p><strong>{titel}</strong></p>
        <p>{tekst}</p>
      </div>
'''
PR=f'''      <h2 id="zo-werkt-het">Zo haal je meer uit een prompt</h2>
      <ul>
        <li><strong>Zeg wie je bent en voor wie het is.</strong> "Ik heb een schildersbedrijf, de tekst is voor particuliere klanten."</li>
        <li><strong>Geef een voorbeeld of je eigen opzet mee.</strong> Dan hoeft de AI niet te raden naar je toon.</li>
        <li><strong>Vraag om een vorm.</strong> Een lengte, een opsomming of drie varianten.</li>
        <li><strong>Laat persoonsgegevens weg.</strong> Gebruik [klantnaam] in plaats van een echte naam. Lees waarom in onze gids over <a href="/gids/ai-veilig-gebruiken/">AI veilig gebruiken</a>.</li>
        <li><strong>Controleer het resultaat.</strong> AI kan fouten maken en dingen verzinnen. Wat je verstuurt, staat onder jouw naam.</li>
      </ul>
      <h2 id="mail">Mail en offertes</h2>
{prompt('Offertemail','Schrijf een korte, vriendelijke mail bij een offerte voor [soort werk] voor [klantnaam]. Noem dat de offerte in de bijlage zit, dat de offerte [aantal] dagen geldig is en dat de klant met vragen kan bellen. Toon: zakelijk maar persoonlijk. Maximaal 120 woorden. Noem geen bedragen.')}{prompt('Herinnering zonder te drammen','Schrijf een korte mail om [klantnaam] te herinneren aan de offerte die ik op [datum] stuurde. Vraag of er nog vragen zijn. Geen druk, wel een duidelijke vraag aan het eind. Maximaal 80 woorden.')}{prompt('Lastige mail beantwoorden','Hier is een mail van een klant die ontevreden is: [tekst zonder namen]. Schrijf een rustig antwoord dat begrip toont, uitlegt wat we gaan doen ([wat je gaat doen]) en eindigt met een concrete volgende stap. Maximaal 150 woorden.')}
      <h2 id="social">LinkedIn en social media</h2>
{prompt('LinkedIn-post','Schrijf een LinkedIn-post over [onderwerp] voor [doelgroep]. Begin met een korte, concrete openingszin, geen vraag. Gebruik korte alinea’s, geen emoji’s en maximaal drie hashtags. Lengte: ongeveer 150 woorden. Geef drie varianten.')}{prompt('Van blog naar posts','Hier is een blog van mijn website: [tekst]. Maak er vier korte posts van voor LinkedIn, elk met een ander punt uit de blog. Maximaal 80 woorden per post.')}
      <h2 id="meetings">Meetings en samenvatten</h2>
{prompt('Samenvatting van een meeting','Hier zijn de aantekeningen van een overleg: [aantekeningen zonder namen van klanten]. Maak een samenvatting met drie kopjes: besluiten, actiepunten (met wie en wanneer) en open vragen. Kort en zakelijk.')}{prompt('Lang document samenvatten','Vat dit document samen in vijf punten voor iemand die weinig tijd heeft: [tekst]. Zet bij elk punt waar in het document het staat. Verzin niets dat er niet in staat.')}
      <h2 id="website">Website en teksten</h2>
{prompt('Tekst voor een dienstpagina','Schrijf een tekst voor de pagina [dienst] op de website van mijn bedrijf [soort bedrijf] in [plaats of regio]. Leg uit wat de klant krijgt, hoe het werkt in drie stappen en sluit af met een uitnodiging om contact op te nemen. Ongeveer 300 woorden, eenvoudig Nederlands.')}{prompt('Tekst verbeteren','Verbeter deze tekst op spelling, lengte van de zinnen en duidelijkheid. Houd mijn toon en verander de inhoud niet. Zet de belangrijkste wijzigingen onder de tekst: [tekst].')}
      <h2 id="volgende-stap">Welke tool?</h2>
      <p>Deze prompts werken in elke algemene AI-assistent. Welke bij je past, lees je bij de <a href="/ai-assistenten/">AI-assistenten</a> en de <a href="/ai-tekst-schrijven/">tools voor teksten</a>.</p>
'''
PF=[('Werken deze prompts in elke AI-tool?','Ja, het zijn gewone opdrachten in het Nederlands. Ze werken in elke algemene AI-assistent, zoals ChatGPT, Claude, Le Chat, Copilot of Gemini. Het resultaat verschilt per tool.'),
 ('Mag ik klantgegevens in een prompt zetten?','Liever niet. Gebruik [klantnaam] of een andere plaatshouder en vul de echte gegevens daarna zelf in. Zo komen er geen persoonsgegevens in de AI-tool.'),
 ('Waarom krijg ik steeds een ander antwoord?','AI-assistenten geven bij dezelfde vraag vaak een iets ander antwoord. Vraag om drie varianten en kies de beste, of geef een voorbeeld mee van wat je wilt.')]
g=dict(slug='/gids/prompts-voor-ondernemers/',title='AI-prompts voor ondernemers: voorbeelden | ToolMatch',
 desc='Kant-en-klare prompts voor je werk: een offertemail, een LinkedIn-post, een samenvatting van een meeting. Kopieer, pas aan en controleer het resultaat.',
 crumb='Prompts voor ondernemers',h1='AI-prompts voor ondernemers: voorbeelden',
 lead='Prompts die je meteen kunt gebruiken voor mail, social media, meetings en je website. Vul de plekken tussen [haken] in en controleer altijd wat eruit komt.')
body=PR+faq_html(PF)+f'      <p class="note">Redactie ToolMatch · gepubliceerd op {GCN}</p>\n'
graph=[{"@type":"Article","@id":D+g['slug']+"#artikel","headline":g['h1'],"description":g['desc'],"inLanguage":"nl-NL","url":D+g['slug'],"mainEntityOfPage":D+g['slug'],"datePublished":PUB,"dateModified":SCHEMA_UPD,"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
  crumbs_ld([('Home','/'),('Gidsen','/gids/'),(g['crumb'],g['slug'])]),faq_ld(g['slug'],PF)]
zet(g['slug'],g['title'],g['desc'],f'<a href="/gids/">Gidsen</a> › {g["crumb"]}',g['h1'],g['lead'],body,graph)
GIDS.append(dict(slug=g['slug'],h1=g['h1'],lead=g['lead']))
hub('/gids/','Gidsen: AI veilig en slim gebruiken | ToolMatch',
 'Praktische gidsen voor ondernemers: AI veilig gebruiken, wat de AI Act van je vraagt, een AI-beleid opstellen en wat AI-abonnementen echt kosten.',
 'Gidsen','Gidsen: AI veilig en slim gebruiken',
 'Praktische uitleg voor ondernemers: hoe je begint met AI, hoe je gegevens veilig houdt, wat de wet vraagt en wat het kost.',
 '''      <p>Onze gidsen zijn geschreven door Redactie ToolMatch, op basis van officiële bronnen en de sites van aanbieders. Bij elke gids staan de bronnen en de datum waarop we ze bekeken.</p>
''',[(g['slug'],g['h1'],g['lead']) for g in GIDS])
