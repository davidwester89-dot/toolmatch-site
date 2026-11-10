# Nieuwe gids 10-11-2026: /gids/canva-voor-ondernemers/ (SEO-refresh wk46).
# Geen /blog/-map op ToolMatch: gids-pad (siteconventie). Wordt uitgevoerd door build.py na ai_presentatie.py.
# Bedragen letterlijk van canva.com/nl_nl/abonnementen/ (NL-IP-capture 2-11-2026, maand/jaar-schakelaar):
# site-checks/2026-11-02/wk45/src/canva_maand.txt + canva_pricing.txt.
# Pro €12/maand, €110/jaar; Business €17/maand, €170/jaar per persoon. Maandprijs eerst (L1). Geen actie zonder einddatum (L4).
# Geen betaald Canva-affiliate: informatieve gids zonder commerciële CTA; alleen feitelijke bronlinks. /ai-presentatie-maken/ blijft multi-tool.
CANVA='/gids/canva-voor-ondernemers/'
CANVA_UPD='2026-11-10'
# nieuwe pagina + hub /gids/ (nieuw kind) + inbound op ontwerp-hub (zichtbare wijziging, L7)
CANVA_PAD={CANVA:CANVA_UPD,'/gids/':CANVA_UPD,'/ai-afbeeldingen-en-ontwerp/':CANVA_UPD,'/keuzehulp/':CANVA_UPD}
# CTA-neutralisatie 12-11 (Canva, Power Automate, Copilot, Power BI): alleen pagina's met bodywijziging. Hubs niet tillen.
CANVA_NEUTRAAL_UPD='2026-11-12'
CANVA_NEUTRAAL_PAD={'/ai-afbeeldingen-en-ontwerp/':CANVA_NEUTRAAL_UPD,'/ai-presentatie-maken/':CANVA_NEUTRAAL_UPD,'/keuzehulp/':CANVA_NEUTRAAL_UPD,'/automatiseren-zonder-code/':CANVA_NEUTRAAL_UPD,'/ai-assistenten/':CANVA_NEUTRAAL_UPD,'/ai-data-analyse/':CANVA_NEUTRAAL_UPD,'/ai-mail-en-offertes/':CANVA_NEUTRAAL_UPD}
P_CANVA=('Canva: Abonnementen en prijzen','https://www.canva.com/nl_nl/abonnementen/')
P_CANVA_HELP=('Canva Help: Abonnementen vergelijken','https://www.canva.com/help/about-canva/')
P_CANVA_PRIV=('Canva: Privacybeleid','https://www.canva.com/nl_nl/policies/privacy-policy/')
CANVA_SRC=[P_CANVA,P_CANVA_PRIV,
 ('ToolMatch: AI presentatie maken','https://toolmatch.nl/ai-presentatie-maken/'),
 ('ToolMatch: AI veilig gebruiken','https://toolmatch.nl/gids/ai-veilig-gebruiken/'),
 ('ToolMatch: Wat kosten AI-abonnementen','https://toolmatch.nl/gids/wat-kosten-ai-abonnementen/'),
 ('ToolMatch: ChatGPT vs Copilot','https://toolmatch.nl/vergelijken/chatgpt-vs-copilot/'),
 ('ToolMatch: ChatGPT vs Gemini','https://toolmatch.nl/vergelijken/chatgpt-vs-gemini/')]
# Alleen Canva-bronnen onderaan de pagina (huisregel: naam + link); interne ToolMatch-links staan in de body.
CANVA_BRON=[P_CANVA,P_CANVA_PRIV]

def canva_bronnen(srcs):
    return '      <h2 id="bronnen">Bronnen</h2>\n      <ul class="bronnen">\n'+''.join(f'        <li>{X(u,E(n))}</li>\n' for n,u in srcs)+'      </ul>\n'

CANVA_FAQ=[
 ('Wat kost Canva Pro per maand?','Volgens de Nederlandse prijspagina van Canva kost Pro €12 per maand voor één persoon, of €110 per jaar bij jaarbetaling.'),
 ('Is Canva Gratis genoeg voor een zzp’er?','Gratis bevat volgens Canva meer dan 1,6 miljoen sjablonen, 5 GB opslag en 1 merkmateriaal. Pro bevat volgens Canva premium content, meer merkmaterialen, social planning en meer AI.'),
 ('Wat is het verschil tussen Canva Pro en Business?','Pro is voor één persoon. Business is per persoon en voegt volgens Canva teambeheer, 100 merkmaterialen met goedkeuringen, Flourish, 500 GB opslag en meer AI-gebruik toe.'),
]

CANVA_BODY=f'''      <h2 id="free-vs-pro">Free vs Pro: wat je als zzp’er merkt</h2>
      <p>Canva heeft drie relevante plannen voor ondernemers: <strong>Gratis</strong>, <strong>Pro</strong> (één persoon) en <strong>Business</strong> (per persoon, met teamfuncties). Enterprise is een apart traject via de salesafdeling van Canva; die prijzen staan niet op de prijspagina.</p>
      <p>Met <strong>Gratis</strong> krijg je volgens Canva een editor met sleepfunctie, meer dan 1.000 ontwerptypes, meer dan 1,6 miljoen sjablonen, meer dan 4,7 miljoen foto’s, video’s, afbeeldingen en audio, 1 merkmateriaal (alleen 3 kleuren), 5 GB cloudopslag en beperkte toegang tot standaard en premium AI.</p>
      <p>Met <strong>Pro</strong> ontgrendel je volgens Canva AI-tools zoals formaat wijzigen, vertalen en achtergrond verwijderen, meer dan 3,6 miljoen sjablonen (inclusief premium), meer dan 141 miljoen premium content-items, 5 merkmaterialen, content plannen voor social media, 100 GB cloudopslag en 10× meer AI dan met Canva Free.</p>
      <p>Met <strong>Business</strong> krijg je volgens Canva samenwerkings- en teambeheertools, 100 merkmaterialen met goedkeuringen, toegang tot Flourish, 500 GB cloudopslag en 20× meer AI dan met Canva Free.</p>
      <h2 id="klussen">Voor welke klussen</h2>
      <p>Canva is een ontwerptool: social posts, stories, flyers, voorstellen, factuurlayouts en presentaties. Je kiest een sjabloon, past kleuren en tekst aan en exporteert of deelt. Voor een <em>eerste opzet van een presentatie met AI</em> naast Copilot en Gemini staat de vergelijking op {L('/ai-presentatie-maken/','AI presentatie maken')}; die pagina blijft multi-tool. Dit stuk gaat over Canva zelf: Free versus Pro en wat het kost.</p>
      <p>Voor logo’s, beelden en andere ontwerpklussen naast Canva zie je het overzicht op {L('/ai-afbeeldingen-en-ontwerp/','AI voor afbeeldingen, logo’s en presentaties')}.</p>
      <h2 id="prijzen">Prijzen in euro</h2>
      <p>Bedragen van de Nederlandse prijspagina van Canva (canva.com/nl_nl/abonnementen/). Maandprijs eerst; daarna de jaarprijs.</p>
      <div class="tbl" role="region" aria-label="Canva-prijzen" tabindex="0">
        <table>
          <thead><tr><th scope="col">Plan</th><th scope="col">Per maand</th><th scope="col">Per jaar</th><th scope="col">Voor wie</th></tr></thead>
          <tbody>
          <tr><th scope="row">Gratis</th><td>€0</td><td>€0</td><td>Eén persoon</td></tr>
          <tr><th scope="row">Pro</th><td>€12 per maand</td><td>€110 per jaar</td><td>Eén persoon</td></tr>
          <tr><th scope="row">Business</th><td>€17 per maand per persoon</td><td>€170 per jaar per persoon</td><td>Particulieren en teams</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Onze rekensom:</strong> Pro maandelijks een jaar lang is 12 × €12 = €144; bij jaarbetaling €110. Business voor twee personen maandelijks: 2 × €17 × 12 = €408; bij jaarbetaling 2 × €170 = €340. Canva noemt op de prijspagina “Bespaar vanaf 16%” bij jaarbetaling; wij rekenen alleen met de bedragen hierboven.</p>
      <p>Andere AI-abonnementen (ChatGPT, Copilot, Gemini) staan in {L('/gids/wat-kosten-ai-abonnementen/','wat AI-abonnementen kosten')}.</p>
      <h2 id="privacy">Privacy en bedrijfsdata</h2>
      <p>In een ontwerp zetten zzp’ers vaak klantnamen, logo’s van opdrachtgevers of prijsvoorstellen. Canva heeft een privacybeleid; wat er precies met jouw bestanden gebeurt, lees je daar en in de voorwaarden van Canva. Zet persoonsgegevens of vertrouwelijke cijfers alleen in een tool als je weet wat de aanbieder ermee doet. Praktische stappen staan in {L('/gids/ai-veilig-gebruiken/','AI veilig gebruiken in je bedrijf')}.</p>
      <h2 id="copilot-gemini">Wanneer Copilot of Gemini genoeg is</h2>
      <p>Heb je vooral tekst, samenvattingen of dia’s in PowerPoint of Google Presentaties nodig, en geen social templates of merkkit? Dan kan Copilot in Microsoft 365 of Gemini in Google Workspace genoeg zijn — vooral als je die suite al betaalt. Twijfel je tussen de assistenten zelf, lees {L('/vergelijken/chatgpt-vs-copilot/','ChatGPT en Copilot naast elkaar')} en {L('/vergelijken/chatgpt-vs-gemini/','ChatGPT en Gemini naast elkaar')}.</p>
      <p>Canva is een ontwerptool met sjablonen, merkmaterialen, social planning en snelle exports; welke functies beschikbaar zijn, verschilt per abonnement.</p>
      <h2 id="zo-kies-je">Zo kies je</h2>
      <ul>
        <li><strong>Gratis</strong> bevat 5 GB opslag en één merkmateriaal voor onder meer posts en flyers.</li>
        <li><strong>Pro</strong> bevat premium sjablonen, meer merkmaterialen, social planning en meer AI-gebruik — €12 per maand voor één persoon.</li>
        <li><strong>Business</strong> bevat gedeelde merkmaterialen en goedkeuringen voor teams — €17 per maand per persoon.</li>
        <li><strong>Blijf bij Copilot of Gemini</strong> als je vooral in Office of Google Workspace werkt en geen aparte ontwerptool nodig hebt.</li>
      </ul>
      <p>Nog niet zeker welke tools bij jouw bedrijf passen? {L('/keuzehulp/','Doe de keuzehulp')}.</p>
'''

_ct='Canva voor ondernemers: Free vs Pro en prijzen'
_cd='Canva Free vs Pro voor zzp’ers: templates, merkkit, prijzen in euro van Canva, en wanneer Copilot of Gemini genoeg is voor social en presentaties.'
_ch1='Canva voor ondernemers: Free vs Pro en wat het kost'
_cb=CANVA_BODY+faq_html(CANVA_FAQ)+canva_bronnen(CANVA_BRON)+f'      <p class="note">Redactie ToolMatch · bijgewerkt op <time datetime="{CANVA_UPD}">10 november 2026</time></p>\n'
_cg=[{"@type":"Article","@id":D+CANVA+"#artikel","headline":_ch1,"description":_cd,"inLanguage":"nl-NL","url":D+CANVA,"mainEntityOfPage":D+CANVA,"datePublished":CANVA_UPD,"dateModified":CANVA_UPD,"image":{"@type":"ImageObject","url":D+"/og.png","width":1200,"height":630},"author":{"@type":"Organization","name":"Redactie ToolMatch","@id":D+"/#organization"},"publisher":ORG},
  crumbs_ld([('Home','/'),('Gidsen','/gids/'),('Canva voor ondernemers',CANVA)]),faq_ld(CANVA,CANVA_FAQ)]
write(CANVA.strip('/')+'/index.html',page(CANVA,_ct,_cd,'Canva voor ondernemers',_ch1,'Free of Pro voor je bedrijf? Templates, merkkit en prijzen in euro van Canva, plus wanneer Copilot of Gemini genoeg is.',_cb,wide=True,extra=ldscript(_cg)))
SPOKES.append(CANVA)

# Hub /gids/: card toevoegen + L7-datum (nieuwste kind = pushdatum)
_gh=open('gids/index.html',encoding='utf-8').read()
_card='''      <article class="res">
        <h3><a href="/gids/canva-voor-ondernemers/">Canva voor ondernemers: Free vs Pro en wat het kost</a></h3>
        <p>Canva Free of Pro voor zzp’ers: wat je merkt aan templates, merkkit en AI, en wat het in euro kost.</p>
      </article>
'''
if '/gids/canva-voor-ondernemers/' not in _gh:
    _gh=_gh.replace('      </div>\n      <p class="note">Redactie ToolMatch · bijgewerkt op 30 oktober 2026</p>',_card+'      </div>\n      <p class="note">Redactie ToolMatch · bijgewerkt op 10 november 2026</p>',1)
_gh=_gh.replace('"dateModified": "2026-10-30"','"dateModified": "2026-11-10"',1)
# ItemList: voeg Canva toe als laatste ListItem (position 7)
if 'canva-voor-ondernemers' not in _gh.split('ItemList')[1][:2000] if 'ItemList' in _gh else True:
    import re as _re
    def _add_li(m):
        pos=7
        return m.group(0)+f''',\n    {{\n     "@type": "ListItem",\n     "position": {pos},\n     "name": "Canva voor ondernemers: Free vs Pro en wat het kost",\n     "url": "https://toolmatch.nl/gids/canva-voor-ondernemers/"\n    }}'''
    # only add once
    if 'gids/canva-voor-ondernemers/' not in _gh[ _gh.find('ItemList'): _gh.find('ItemList')+2500] if 'ItemList' in _gh else '':
        _gh=_re.sub(r'("url": "https://toolmatch\.nl/gids/prompts-voor-ondernemers/"\n    \})',
                    r'\1,\n    {\n     "@type": "ListItem",\n     "position": 7,\n     "name": "Canva voor ondernemers: Free vs Pro en wat het kost",\n     "url": "https://toolmatch.nl/gids/canva-voor-ondernemers/"\n    }',
                    _gh, count=1)
open('gids/index.html','w',encoding='utf-8').write(_gh)

# Inbound op /ai-afbeeldingen-en-ontwerp/: 1 natuurlijke link naar Canva-gids (hub blijft multi-tool)
_af=open('ai-afbeeldingen-en-ontwerp/index.html',encoding='utf-8').read()
if '/gids/canva-voor-ondernemers/' not in _af:
    _af=_af.replace(
        'Wil je vooral een presentatie maken? Lees <a href="/ai-presentatie-maken/">hoe je met AI een presentatie maakt</a>, met Canva, Copilot en Gemini naast elkaar.</p>',
        'Wil je vooral een presentatie maken? Lees <a href="/ai-presentatie-maken/">hoe je met AI een presentatie maakt</a>, met Canva, Copilot en Gemini naast elkaar. Twijfel je tussen Canva Free en Pro voor social en merkwerk, lees <a href="/gids/canva-voor-ondernemers/">Canva voor ondernemers</a>.</p>',
        1)
# L7 byline + dateModified: Canva-CTA neutraal 12-11 (spokes schrijft dit al; vangnet voor oudere tussenwaarden)
for _oud, _nieuw in (('bijgewerkt op 3 november 2026','bijgewerkt op 12 november 2026'),('bijgewerkt op 10 november 2026','bijgewerkt op 12 november 2026')):
    _af=_af.replace(_oud, _nieuw)
for _oud in ('"dateModified": "2026-11-03"','"dateModified": "2026-11-10"'):
    _af=_af.replace(_oud, '"dateModified": "2026-11-12"', 1)
open('ai-afbeeldingen-en-ontwerp/index.html','w',encoding='utf-8').write(_af)

# L7: keuzehulp.js wijzigt de Canva-uitslagknop → dateModified/zichtbaar = 12-11. Hub /gids/ blijft 10-11.
_kh=open('keuzehulp/index.html',encoding='utf-8').read()
_kh=_kh.replace('"dateModified": "2026-11-10"','"dateModified": "2026-11-12"',1)
_kh=_kh.replace('bijgewerkt op 10 november 2026. De keuzehulp','bijgewerkt op 12 november 2026. De keuzehulp',1)
open('keuzehulp/index.html','w',encoding='utf-8').write(_kh)
