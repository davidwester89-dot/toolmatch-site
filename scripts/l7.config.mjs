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
