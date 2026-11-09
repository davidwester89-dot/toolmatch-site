// Siteconfig voor scripts/l7check.mjs (L7-datumcheck, naamgrep, repo-root-404). Wijzigingen in exempt/BEKEND_* alleen met SC-OK.
import { execSync, execFileSync } from 'node:child_process';
import { join } from 'node:path';
const UITSLAG = `
import { match, VRAGEN } from './js/lib/match.js';
const keys = Object.keys(VRAGEN); const out = [];
const rec = (i, a) => { if (i === keys.length) { out.push([a, match(a)]); return; } for (const v of VRAGEN[keys[i]]) rec(i + 1, { ...a, [keys[i]]: v }); };
rec(0, {});
console.log(JSON.stringify(out, (k, v) => (/logo|^prijsMaand/i.test(k) ? undefined : v)));`;
const keuzehulpUitslag = (outDir) => execFileSync('node', ['--input-type=module', '-e', UITSLAG], { cwd: outDir, encoding: 'utf8', maxBuffer: 1 << 28 });
export const CFG = {
  // build.py schrijft de html in de repo; assemble.py zet alleen publieke bestanden (allowlist via git ls-files) in _site.
  build: (dir, env) => {
    execSync('git init -q && git add -A && python3 scripts/build.py && git add -A && python3 scripts/assemble.py _site', { cwd: dir, env, stdio: 'ignore', shell: '/bin/bash' });
    return join(dir, '_site');
  },
  hubs: [],
  // Keuzehulp: alleen een andere uitslag (alle 324 antwoordcombinaties, incl. getoonde toolvelden) telt als client-side wijziging.
  clientOutput: { '/keuzehulp/': { covers: /^js\/lib\/(tools|match)\.js$/, run: keuzehulpUitslag } },
  exempt: {},
};
// 'Gmail' is hier een productnaam (koppelingen van tools), geen persoonlijk adres. Alleen het woord Gmail met hoofdletter, niet
// gevolgd door .com/@ en niet als deel van een e-mailadres.
export const ALLOW_NAME = [{ file: /\.(html|js)$/, match: /^[^\w.@]?Gmail[^\w.@]?$/, reden: 'productnaam Gmail (hoofdletter G, geen adres)' }];
export const BEKEND_ORPHAN = [];
// Hub-audit: bestaande bevindingen op origin/main (30-10). Elk item is exact (alleen = de volledige melding, incl. kinderen en
// datums) en vervalt na 'tot' (Europe/Amsterdam): daarna is de melding weer rood (huisregel BEKEND: exact + vervaldatum, SC 01-11).
// Haal een regel weg zodra de hub is gefixt (vrijdaglijst 06-11: 'TM hubs nog 20-10'); dan bewaakt de test hem.
export const BEKEND_HUB = [];
// Make-partnerlink 9-11-2026: published/bijgewerkt/dateModified/lastmod blijven op de bestaande waarden (opdracht).
// De uitzondering is exact die bevroren datums. De verwacht-datum in de melding is de pushdatum en schuift mee.
// Vervalt na tot: daarna wil L7 de pushdatum, tenzij de datums dan bewust worden bijgewerkt en deze regels weggaan.
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const bevroren = (pad, reden, datum) => new RegExp('^' + escRe(pad) + ' \\(' + escRe(reden) + '; verwacht \\d{4}-\\d{2}-\\d{2}\\): dateModified ' + escRe(datum) + ', zichtbaar ' + escRe(datum) + ', lastmod ' + escRe(datum) + '$');
const MAKE_TOT = '2026-12-09';
export const BEKEND_L7 = [
  { pad: '/automatiseren-zonder-code/', alleen: bevroren('/automatiseren-zonder-code/', 'bodywijziging', '2026-10-30'), tot: MAKE_TOT },
  { pad: '/vergelijken/zapier-vs-make-vs-n8n/', alleen: bevroren('/vergelijken/zapier-vs-make-vs-n8n/', 'bodywijziging', '2026-10-30'), tot: MAKE_TOT },
  { pad: '/vergelijken/', alleen: bevroren('/vergelijken/', 'hub van /vergelijken/zapier-vs-make-vs-n8n/', '2026-10-30'), tot: MAKE_TOT },
  { pad: '/keuzehulp/', alleen: bevroren('/keuzehulp/', 'client-side data: js/lib/partnerlinks.js', '2026-11-07'), tot: MAKE_TOT },
];
