// Pages-artefact: scripts/assemble.py zet alleen publieke bestanden in de artefactmap.
// Elke URL uit sitemap.xml moet erin staan, plus IndexNow-sleutel, Google-verificatie, CNAME, robots.txt, 404.html;
// test/, scripts/, .github/, node_modules/, README.md, package.json en LICENSE mogen er niet in.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, rmSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('..', import.meta.url).pathname;
const DIR = mkdtempSync(join(tmpdir(), 'tm-artefact-'));
const OUT = join(DIR, '_site');
after(() => rmSync(DIR, { recursive: true, force: true }));
execFileSync('python3', [join(ROOT, 'scripts/assemble.py'), OUT]);
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p.slice(OUT.length + 1)]; });
const files = walk(OUT);

test('artefact: elke sitemap-URL staat erin', () => {
  const locs = [...readFileSync(join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/toolmatch\.nl(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 20);
  for (const p of locs) {
    const f = p.endsWith('/') ? p.slice(1) + 'index.html' : p.slice(1);
    assert.ok(existsSync(join(OUT, f)), `${p} ontbreekt (${f})`);
  }
});

test('artefact: sleutel, verificatie, CNAME, robots, 404 en assets staan erin', () => {
  for (const f of ['8815e9457be69edb8e23cf7f4e3a5486.txt', 'CNAME', 'robots.txt', 'sitemap.xml', '404.html', 'favicon.svg', 'og.png', 'style.css', 'js/consent.js', 'js/keuzehulp.js', 'fonts/inter-800.woff2']) assert.ok(files.includes(f), f + ' ontbreekt');
  for (const f of readdirSync(ROOT).filter((x) => /^google[0-9a-f]+\.html$/.test(x))) assert.ok(files.includes(f), f + ' ontbreekt');
  assert.equal(readFileSync(join(OUT, 'CNAME'), 'utf8').trim(), 'toolmatch.nl');
});

test('artefact: elke html-pagina uit de repo staat erin', () => {
  const tracked = execFileSync('git', ['ls-files', '*.html'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter((f) => f && !/^(test|scripts)\//.test(f));
  for (const f of tracked) assert.ok(files.includes(f), f + ' ontbreekt');
});

test('artefact: geen repo-bestanden (test, scripts, README, package.json, node_modules)', () => {
  for (const f of files) {
    assert.ok(!/^(test|scripts|\.github|node_modules|_site)\//.test(f), f + ' hoort niet in het artefact');
    assert.ok(!['README.md', 'package.json', 'package-lock.json', 'LICENSE', '.gitignore'].includes(f), f + ' hoort niet in het artefact');
    assert.ok(!/\.(py|md|mjs)$/.test(f) && !/\.test\.js$/.test(f), f + ' hoort niet in het artefact');
  }
});
