import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
execSync('python3 scripts/build.py', { cwd: ROOT });
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (/^(\.git|node_modules|scripts|test)$/.test(f)) return []; return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(ROOT).filter((f) => f.endsWith('.html') && !/google[0-9a-f]+\.html$/.test(f));
const read = (f) => readFileSync(f, 'utf8');
const url = (f) => '/' + f.slice(ROOT.length).replace(/index\.html$/, '').replace(/^\//, '');

test('alle pagina’s bestaan', () => {
  for (const p of ['index.html', 'keuzehulp/index.html', 'contact/index.html', 'disclaimer/index.html', 'partnerlinks/index.html', 'over/index.html', 'privacy/index.html', '404.html'])
    assert.ok(existsSync(join(ROOT, p)), p);
});

test('per pagina: title ≤60, meta ≤155, canonical, één h1, lang nl, viewport', () => {
  for (const f of pages) {
    const h = read(f);
    const t = h.match(/<title>([^<]*)<\/title>/)[1]; assert.ok(t.length <= 60, `${f} title ${t.length}`);
    const d = h.match(/<meta name="description" content="([^"]*)"/)[1]; assert.ok(d.length <= 155 && d.length >= 70, `${f} meta ${d.length}`);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, f);
    assert.ok(h.includes('<html lang="nl">') && h.includes('name="viewport"'));
    if (!f.endsWith('404.html')) assert.ok(h.includes(`<link rel="canonical" href="https://toolmatch.nl${url(f)}">`), f);
  }
});

test('koppen in de juiste volgorde (geen sprong van h1 naar h3)', () => {
  for (const f of pages) {
    const lv = [...read(f).matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
    for (let i = 1; i < lv.length; i++) assert.ok(lv[i] <= lv[i - 1] + 1, `${f}: h${lv[i - 1]} -> h${lv[i]}`);
  }
});

test('huisregels: geen concept, geen gmail, geen persoonsnamen; footer met rechten en info@', () => {
  for (const f of pages) {
    const h = read(f);
    assert.ok(!/concept/i.test(h), f + ' concept'); assert.ok(!/gmail/i.test(h), f + ' gmail');
    assert.ok(!/Dave|West\b/.test(h), f + ' naam');
    assert.ok(h.includes('alle rechten voorbehouden') && h.includes('mailto:info@toolmatch.nl'), f + ' footer');
    for (const p of ['/contact/', '/disclaimer/', '/partnerlinks/', '/privacy/', '/keuzehulp/']) assert.ok(h.includes(`href="${p}"`), f + ' ' + p);
  }
});

test('GA alleen via consent.js (geen gtag inline), JSON-LD geldig', () => {
  for (const f of pages) {
    const h = read(f);
    assert.ok(!/googletagmanager\.com\/gtag/.test(h), f);
    assert.ok(/<script type="module" src="\/js\/(consent|keuzehulp)\.js"><\/script>/.test(h), f);
    for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  }
  assert.ok(read(join(ROOT, 'js/consent.js')).includes("'G-Y7V72FDMBZ'"));
  assert.ok(read(join(ROOT, 'js/keuzehulp.js')).includes("from './consent.js'"));
});

test('externe links: noopener; partnerlinks nooit zonder sponsored', () => {
  for (const f of pages) for (const m of read(f).matchAll(/<a [^>]*href="https?:\/\/(?!toolmatch\.nl)[^"]*"[^>]*>/g)) {
    assert.ok(/rel="[^"]*noopener/.test(m[0]), f + ' ' + m[0]);
    if (/data-cta="partner"/.test(m[0])) assert.ok(/sponsored nofollow/.test(m[0]));
  }
});

test('sitemap en robots: alle indexeerbare pagina’s, geen 404', () => {
  const sm = read(join(ROOT, 'sitemap.xml'));
  for (const f of pages) if (!f.endsWith('404.html')) assert.ok(sm.includes(`<loc>https://toolmatch.nl${url(f)}</loc>`), f);
  assert.ok(!sm.includes('404'));
  assert.ok(read(join(ROOT, 'robots.txt')).includes('Sitemap: https://toolmatch.nl/sitemap.xml'));
  assert.match(read(join(ROOT, '404.html')), /noindex/);
});

test('verificatiebestand, IndexNow-sleutel en CNAME blijven staan', () => {
  assert.equal(read(join(ROOT, 'google78d915054efb904d.html')), 'google-site-verification: google78d915054efb904d.html');
  assert.equal(read(join(ROOT, '8815e9457be69edb8e23cf7f4e3a5486.txt')), '8815e9457be69edb8e23cf7f4e3a5486');
  assert.equal(read(join(ROOT, 'CNAME')).trim(), 'toolmatch.nl');
});

test('kopteksten van Dave blijven staan', () => {
  const h = read(join(ROOT, 'index.html'));
  assert.ok(h.includes('<h2 id="h-zo">Zo vergelijken wij</h2>'));
  assert.ok(h.includes('5 vragen voordat je een AI-tool kiest'));
});
