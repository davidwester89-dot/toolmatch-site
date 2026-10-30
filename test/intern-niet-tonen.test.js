// Testgat L11 (SC 28-10, review 3616ca7): mutaties in scripts/pages.py die het interne budgetgetal tonen
// (S1 '(budget 20)', S2 '(€20)', S3 prijsMaandBron in de keuzehulp-tabel) gaven 0 fails. prijsMaand is een intern budgetgetal
// voor de budgetvraag en wordt NOOIT getoond (js/lib/tools.js). Deze test bewaakt dat op de build:
//  1. de prijscel van elke tool in de keuzehulp-tabel is precies tool.prijs (of 'Niet gecontroleerd'), niets erbij;
//  2. in geen enkel blok (tr/li/dd/p/div/td) dat een tool met prijsMaandBron 'intern' noemt staat dat getal als bedrag/budget;
//  3. geen 'prijsMaand', 'budgetgetal' of de bronlabels als zichtbare tekst, en keuzehulp.js/match.js tonen prijsMaand niet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { TOOLS } from '../js/lib/tools.js';

const ROOT = new URL('..', import.meta.url).pathname;
execSync('python3 scripts/build.py', { cwd: ROOT });
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (/^(\.git|node_modules|scripts|test|_site)$/.test(f)) return []; return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(ROOT).filter((f) => f.endsWith('.html') && !/google[0-9a-f]+\.html$/.test(f));
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', euro: '€' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e.toLowerCase()] ?? m));
const zichtbaar = (h) => h.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ');
const tekst = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const INTERN = TOOLS.filter((t) => t.prijsMaandBron === 'intern' && t.prijsMaand != null);
const rel = (f) => f.slice(ROOT.length);

// Alle schrijfwijzen van het getal (20 → 20, 20,00, 20.00; 14.99 → 14,99, 14.99) als los getal (niet in 200 of 2026).
const getalRe = (n) => {
  const v = new Set([String(n), String(n).replace('.', ','), n.toFixed(2), n.toFixed(2).replace('.', ',')]);
  return `(?<![\\d,.])(?:${[...v].map((x) => x.replace('.', '\\.')).join('|')})(?![\\d]|[,.]\\d)`;
};
export function toontGetal(blokTekst, n) {
  const g = getalRe(n);
  return new RegExp(`(?:€|\\$|＄|eur\\b|euro)\\s?${g}|${g}\\s?(?:€|euro|eur\\b|dollar|usd|\\$|per maand|p\\/?m\\b|\\/\\s?maand|\\/mnd)|budget\\w*\\s*:?\\s*(?:€\\s?)?${g}|\\(\\s*(?:€\\s?)?${g}\\s*\\)`, 'i').test(blokTekst);
}

test('intern budgetgetal: keuzehulp-tabel toont per tool precies tool.prijs in de prijscel', () => {
  const h = readFileSync(join(ROOT, 'keuzehulp/index.html'), 'utf8');
  const rows = [...h.matchAll(/<tr><th scope="row">([\s\S]*?)<\/th>([\s\S]*?)<\/tr>/g)].map((m) => [tekst(m[1]), [...m[2].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((c) => c[1])]);
  assert.ok(rows.length >= TOOLS.filter((t) => t.doelen.length).length - 2, 'keuzehulp-tabel gevonden');
  const fout = [];
  for (const t of TOOLS) {
    const r = rows.find(([naam]) => naam === t.naam);
    if (!r) continue;
    const verwacht = t.prijs ? esc(t.prijs) : 'Niet gecontroleerd';
    if (decode(r[1][2]) !== decode(verwacht)) fout.push(`${t.id}: prijscel '${tekst(r[1][2])}' ≠ tool.prijs`);
  }
  assert.deepEqual(fout, []);
});

test('intern budgetgetal: nergens als bedrag of budget getoond bij de tool (alle pagina’s)', () => {
  const fout = [];
  for (const f of pages) {
    const blokken = [...zichtbaar(readFileSync(f, 'utf8')).matchAll(/<(tr|li|dd|p|td|div|figcaption|h[1-6])\b[^>]*>((?:(?!<\/?(?:tr|li|dd|p|div|table|ul|ol)\b)[\s\S])*?)<\/\1>/gi)].map((m) => tekst(m[2]));
    for (const t of INTERN) for (const b of blokken) if (b.includes(t.naam.split(' (')[0]) && toontGetal(b, t.prijsMaand)) fout.push(`${rel(f)}: ${t.id} ${t.prijsMaand}: …${b.slice(0, 120)}…`);
  }
  assert.deepEqual([...new Set(fout)], []);
});

test('intern budgetgetal: geen prijsMaand/budgetgetal/bronlabel als zichtbare tekst; client-JS toont prijsMaand niet', () => {
  const fout = [];
  for (const f of pages) {
    const s = tekst(zichtbaar(readFileSync(f, 'utf8')));
    for (const m of s.matchAll(/prijsMaand\w*|budgetgetal|\((?:intern|pagina)\)|\bintern(?:e)? (?:budget|getal|bedrag)/gi)) fout.push(`${rel(f)}: ${m[0]}`);
  }
  for (const js of ['js/keuzehulp.js']) if (/prijsMaand/.test(readFileSync(join(ROOT, js), 'utf8'))) fout.push(`${js} gebruikt prijsMaand (tonen verboden)`);
  assert.deepEqual(fout, []);
  // zelftest: de drie SC-mutaties
  assert.ok(toontGetal('Plus (het bedrag zie je op de prijspagina van OpenAI) (budget 20)', 20));
  assert.ok(toontGetal('Plus (het bedrag zie je op de prijspagina van OpenAI) (€20)', 20));
  assert.ok(toontGetal('Pro (€ 14,99 per maand)', 14.99));
  assert.ok(!toontGetal('ChatGPT bestaat sinds 2022 en heeft 200 miljoen gebruikers', 20));
});
