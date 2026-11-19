// Siteconfig voor scripts/l7check.mjs (L7-datumcheck, naamgrep, repo-root-404). Wijzigingen in exempt/BEKEND_* alleen met SC-OK.
import { execSync, execFileSync } from 'node:child_process';
import { join } from 'node:path';
const UITSLAG = `
import { match, VRAGEN } from './js/lib/match.js';
import { TOOLS } from './js/lib/tools.js';
import { uitgaand } from './js/lib/partnerlinks.js';
const keys = Object.keys(VRAGEN); const out = [];
const rec = (i, a) => { if (i === keys.length) { out.push([a, match(a)]); return; } for (const v of VRAGEN[keys[i]]) rec(i + 1, { ...a, [keys[i]]: v }); };
rec(0, {});
const knoppen = TOOLS.map((t) => [t.id, uitgaand(t)]);
console.log(JSON.stringify({ out, knoppen }, (k, v) => (/logo|^prijsMaand/i.test(k) ? undefined : v)));`;
const keuzehulpUitslag = (outDir) => execFileSync('node', ['--input-type=module', '-e', UITSLAG], { cwd: outDir, encoding: 'utf8', maxBuffer: 1 << 28 });
export const CFG = {
  // Geen datumlift door alleen een gewijzigd kind; bij eigen body geldt de gewone L7-plicht.
  bodyOnlyHubs: ["/gids/", "/vergelijken/"],
  // build.py schrijft de html in de repo; assemble.py zet alleen publieke bestanden (allowlist via git ls-files) in _site.
  build: (dir, env) => {
    execSync('git init -q && git add -A && python3 scripts/build.py && git add -A && python3 scripts/assemble.py _site', { cwd: dir, env, stdio: 'ignore', shell: '/bin/bash' });
    return join(dir, '_site');
  },
  hubs: [],
  // Keuzehulp: alleen een andere uitslag (324 combinaties, toolvelden) of andere keuzehulp-knoppen (PARTNERLINKS via uitgaand)
  // telt als client-side wijziging. partnerlinks.js hoort bij covers: een wijziging in PARTNERLINKS_PAGINA (alleen
  // inhoudspagina's, bv. Leadinfo) verandert de keuzehulp niet en mag de datum niet tillen. Een echte PARTNERLINKS-wijziging
  // (knop onder een resultaat) zit in knoppen en telt wel.
  clientOutput: { '/keuzehulp/': { covers: /^js\/lib\/(tools|match|partnerlinks)\.js$/, run: keuzehulpUitslag } },
  // E-CTA-1 (plan MM 17-11, Dave via GB2): de CTA-blokken A/C (scripts/e-cta.mjs) tellen niet als bodywijziging; geen datum-lift. Vraagt SC-OK.
  // E-CTA-1 B (17-11): tekstlink in een bestaande zin (spokes.py partner_tekst_b, website_leads.py wl_tekst) wordt ge-unwrapt tot de
  // linktekst: de linkmarkup (incl. aria-label) en het zichtbare label ' (partnerlink)' vallen weg. Alleen <a> met
  // rel="sponsored nofollow noopener" + data-pos="mid" + label, zonder geneste tags. Alle tekst buiten de link telt mee. Vraagt SC-OK.
  stripCta: [/<aside class="ecta[^"]*"[^>]*data-ecta="[AC]"[^>]*>[\s\S]*?<\/aside>/g,
    [/<a\b(?=[^>]*\srel="sponsored nofollow noopener")(?=[^>]*\sdata-pos="mid")[^>]*>([^<]*?) \(partnerlink\)<\/a>/g, '$1']],
  exempt: {},
};
// 'Gmail' is hier een productnaam (koppelingen van tools), geen persoonlijk adres. Alleen het woord Gmail met hoofdletter, niet
// gevolgd door .com/@ en niet als deel van een e-mailadres.
export const ALLOW_NAME = [
  { file: /\.(html|js)$/, match: /^[^\w.@]?Gmail[^\w.@]?$/, reden: 'productnaam Gmail (hoofdletter G, geen adres)' },
  // Exacte volledige-URL-match, 0 tolerantie: alleen https://simplybook.me?ref=dave_west_fd136
  // (exacte host simplybook.me, exacte ref dave_west_fd136). Een gewijzigde ref, andere hostname
  // of een andere dave-treffer in de buurt wordt niet toegestaan. Tijdelijk: vervalt zodra de
  // naamloze toolmatch-ref er is.
  // Dave West, direct in chat met SEO-uitvoerbot, 10-11-2026 09:56 CET:
  // "Mijn naam in de SimplyBook-link is prima, plaats hem zoals hij is."
  // Dave West, direct in chat met Grok Bot, 10-11-2026 10:12 CET:
  // "Ja, de SimplyBook-link met mijn naam mag live tot hij naar toolmatch gaat."
  { file: /\.(html|js)$/, match: /^=dave_$/, ctx: /(?:^|[^A-Za-z0-9.-])https:\/\/simplybook\.me\?ref=dave_west_fd136(?![A-Za-z0-9._-])/, reden: 'officiële SimplyBook.me-affiliateparameter (tijdelijk tot naamloze toolmatch-ref; Dave 10-11-2026 09:56 CET in chat SEO-uitvoerbot: "Mijn naam in de SimplyBook-link is prima, plaats hem zoals hij is."; 10:12 CET in chat Grok Bot: "Ja, de SimplyBook-link met mijn naam mag live tot hij naar toolmatch gaat.")' },
];
export const BEKEND_ORPHAN = [];
// Hub-audit: bestaande bevindingen op origin/main (30-10). Elk item is exact (alleen = de volledige melding, incl. kinderen en
// datums) en vervalt na 'tot' (Europe/Amsterdam): daarna is de melding weer rood (huisregel BEKEND: exact + vervaldatum, SC 01-11).
// Haal een regel weg zodra de hub is gefixt (vrijdaglijst 06-11: 'TM hubs nog 20-10'); dan bewaakt de test hem.
export const BEKEND_HUB = [];
export const BEKEND_L7 = [];
