# Stijlronde 18 november: uitsluitend gewijzigde pagina's en hun L7-hubs.
# Publicatie-, broncontrole- en overige inhoudelijke datums blijven ongewijzigd.
import re
from datetime import date
from pathlib import Path
NUCHTER_DATUM = '2026-11-18'
NUCHTER_PADEN = ['/ai-afbeeldingen-en-ontwerp/', '/ai-assistenten/', '/ai-chatbot-website/', '/ai-data-analyse/', '/ai-mail-en-offertes/', '/ai-notuleren/', '/ai-presentatie-maken/', '/ai-tekst-schrijven/', '/ai-vertalen/', '/ai-website-maken/', '/automatiseren-zonder-code/', '/gids/ai-act-ondernemers/', '/gids/ai-beleid-opstellen/', '/gids/ai-gebruiken-in-je-bedrijf/', '/gids/ai-veilig-gebruiken/', '/gids/canva-voor-ondernemers/', '/keuzehulp/', '/online-afspraken-plannen/', '/vergelijken/chatgpt-vs-claude/', '/vergelijken/chatgpt-vs-copilot/', '/websitebezoekers-herkennen/']

def nuchter_html(s, en=False, vloer=NUCHTER_DATUM):
    # Alleen een ondergrens: nieuwe inhoudelijke dateModified wordt nooit teruggezet.
    doel = max([vloer] + re.findall(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"', s))
    d = date.fromisoformat(doel)
    maanden = ('January February March April May June July August September October November December' if en else 'januari februari maart april mei juni juli augustus september oktober november december').split()
    datum = f'{d.day} {maanden[d.month-1]} {d.year}'
    s = re.sub(r'("dateModified"\s*:\s*")[^"]+("|$)', lambda m: m[1]+doel+m[2], s)
    s = re.sub(r'(<meta\b[^>]*property=["\'](?:article:modified_time|og:updated_time)["\'][^>]*content=["\'])[^"\']+(["\'])', lambda m:m[1]+doel+m[2], s, flags=re.I)
    label = r'((?:[Ll]aatst\s+)?(?:[Bb]ijgewerkt|[Uu]pdated)(?:\s+(?:op|on))?\s*:?\s*(?:<(?!time\b)[^>]+>\s*)*)'
    time = label+r'(<time\b[^>]*datetime=["\'])[^"\']+(["\'][^>]*>)[^<]*(</time>)'
    text = label+r'(?:\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]+\s+\d{4})'
    s,n = re.subn(time, lambda m:m[1]+m[2]+doel+m[3]+datum+m[4], s)
    s,m = re.subn(text, lambda m:m[1]+datum, s)
    if not n+m:
        stamp = ('Updated' if en else 'Laatst bijgewerkt')+f' <time datetime="{doel}">{datum}</time>'
        s = re.sub(r'</h1>', '</h1><p class="updated">'+stamp+'</p>', s, count=1)
    return s

nuchter_dates = {}
for pad in NUCHTER_PADEN:
    path = Path(pad.lstrip('/')) if pad.endswith('.html') else Path(pad.lstrip('/'))/'index.html'
    h = nuchter_html(path.read_text(),pad.startswith('/en/'))
    path.write_text(h)
    nuchter_dates[pad] = max([NUCHTER_DATUM] + re.findall(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"', h))
sitemap = Path('sitemap.xml')
s = sitemap.read_text()
for pad in NUCHTER_PADEN:
    pattern = r'(<url>\s*<loc>https?://[^<]+?'+re.escape(pad)+r'</loc>\s*<lastmod>)[^<]+(</lastmod>)'
    s,n = re.subn(pattern, lambda m:m[1]+nuchter_dates[pad]+m[2], s)
    if n != 1: raise ValueError(f'Sitemap date scope: {pad}: {n}')
sitemap.write_text(s)
