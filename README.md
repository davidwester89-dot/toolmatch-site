# ToolMatch (toolmatch.nl)

De juiste (AI-)tools voor ondernemers. Statische site, gehost via GitHub Pages vanaf `main` (CNAME toolmatch.nl). De gebouwde HTML staat in de repo.

- Bouwen: `npm run build` (= `python3 scripts/build.py`; schrijft alle pagina's, `sitemap.xml` en `robots.txt`). Bron: `scripts/build.py` (home, over, privacy, layout) en `scripts/pages.py` (keuzehulp, contact, disclaimer, partnerlinks, 404, sitemap).
- Testen: `npm test` (bouwt eerst). Altijd groen voor een push.
- Tools: `js/lib/tools.js` (alleen feiten van de site van de aanbieder, met bron en `GECONTROLEERD`-datum; onbekend = `null`).
- Keuzehulp: `js/lib/match.js` (puur, getest; leest nooit partnerlinks) + `js/keuzehulp.js` (UI, `quiz_complete`-event na toestemming).
- Partnerlinks: alleen in `js/lib/partnerlinks.js` (leeg tot goedkeuring; `rel="sponsored nofollow noopener"` + label "partnerlink"; nooit invloed op de volgorde).
- Cookiemelding + GA4 (`G-Y7V72FDMBZ`): `js/consent.js` + `js/lib/consent.js`; gtag laadt pas na Accepteren.
- Niet weghalen: `CNAME`, `google78d915054efb904d.html` (Search Console), `8815e9457be69edb8e23cf7f4e3a5486.txt` (IndexNow).

Contact: info@toolmatch.nl
