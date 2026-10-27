"""Zet alleen de publieke sitebestanden in een artefactmap voor GitHub Pages.

Gebruik: python3 scripts/assemble.py [doelmap]   (standaard: _site)
Allowlist: html-pagina's, css, js/, fonts/, afbeeldingen, sitemap.xml, robots.txt, CNAME,
IndexNow-sleutel en Google-verificatie. Nooit: scripts/, test/, .github/, node_modules/,
README.md, package.json, LICENSE of andere repo-bestanden.
"""
import os, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = sys.argv[1] if len(sys.argv) > 1 else '_site'
NOOIT_MAP = {'scripts', 'test', '.github', 'node_modules', '_site'}
NOOIT_BESTAND = {'README.md', 'package.json', 'package-lock.json', 'LICENSE', '.gitignore', '.nojekyll'}
EXT = {'.html', '.css', '.js', '.woff2', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.xml', '.txt', '.webmanifest'}
ROOTVAST = {'CNAME'}

def publiek(f):
    delen = f.split('/')
    if delen[0] in NOOIT_MAP or f in NOOIT_BESTAND: return False
    if f in ROOTVAST: return True
    if delen[0] == 'fonts': return True  # webfonts + de bijbehorende licentie
    ext = os.path.splitext(f)[1].lower()
    if ext == '.txt': return len(delen) == 1  # IndexNow-sleutel e.d., alleen in de root
    if ext == '.xml': return f == 'sitemap.xml'
    return ext in EXT

def main():
    files = subprocess.check_output(['git', 'ls-files'], text=True).split()
    if os.path.exists(OUT): shutil.rmtree(OUT)
    n = 0
    for f in files:
        if not publiek(f) or not os.path.isfile(f): continue
        d = os.path.join(OUT, f)
        os.makedirs(os.path.dirname(d) or OUT, exist_ok=True)
        shutil.copy2(f, d); n += 1
    print(f'{n} bestanden naar {OUT}/')

if __name__ == '__main__':
    main()
