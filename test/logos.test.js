// Logo's van aanbieders (Dave 30-10): elk logo lokaal, klein, met vaste maat, lazy en alt "<Merk> logo".
// Neutraal: dezelfde maat voor iedereen; logo's veranderen niets aan de volgorde, de match of de partnerlinks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { LOGOS, logoImg } from '../js/lib/logos.js';
import { TOOLS } from '../js/lib/tools.js';
import { match } from '../js/lib/match.js';

const ROOT = new URL('..', import.meta.url).pathname;
const html = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
const IMG = /<img class="tlogo"[^>]*>/g;

test('logo: elke tool in tools.js heeft een lokaal logo van max. 10 KB', () => {
  for (const t of TOOLS) {
    assert.ok(LOGOS[t.id], t.id + ' heeft geen logo');
    const f = ROOT + 'logos/' + t.id + '.webp';
    assert.ok(existsSync(f), f);
    assert.ok(statSync(f).size <= 10 * 1024, f + ' is groter dan 10 KB');
  }
  for (const f of readdirSync(ROOT + 'logos')) assert.ok(LOGOS[f.replace('.webp', '')], 'los bestand ' + f);
});

test('logo: elke img heeft alt "<Merk> logo", vaste width/height, lazy, en het bestand bestaat', () => {
  let n = 0;
  for (const f of html) {
    for (const [tag] of readFileSync(ROOT + f, 'utf8').matchAll(IMG)) {
      n++;
      assert.match(tag, / alt="[^"]+ logo"/, f + ' ' + tag);
      assert.match(tag, / width="(24|32)" height="\1"/, f + ' ' + tag);
      assert.match(tag, / loading="lazy"/, f + ' ' + tag);
      const src = tag.match(/ src="\/(logos\/[a-z0-9]+\.webp)"/);
      assert.ok(src && existsSync(ROOT + src[1]), f + ' ' + tag);
    }
  }
  assert.ok(n > 80, 'te weinig logo\'s: ' + n);
});

test('logo: categoriepagina\'s hebben een logo bij elke tool in de tabel en bij elke kaart', () => {
  for (const f of html.filter((x) => readFileSync(ROOT + x, 'utf8').includes('<article class="res tool"'))) {
    const h = readFileSync(ROOT + f, 'utf8');
    const rijen = [...h.matchAll(/<tr><th scope="row"><a href="#[^"]+">(<img class="tlogo"[^>]*>)?/g)];
    assert.ok(rijen.length >= 2, f);
    for (const r of rijen) assert.ok(r[1], f + ': rij zonder logo');
    for (const k of h.matchAll(/<article class="res tool" id="[^"]+">\s*<h3>(<img class="tlogo"[^>]*>)?/g)) assert.ok(k[1], f + ': kaart zonder logo');
  }
});

test('logo: geen score- of sterrenicoontjes', () => {
  for (const f of html) assert.doesNotMatch(readFileSync(ROOT + f, 'utf8'), /class="[^"]*(star|rating|score)[^"]*"|★|☆/, f);
});

test('logo: de match (match.js) leest de logo\'s nooit', () => {
  assert.doesNotMatch(readFileSync(ROOT + 'js/lib/match.js', 'utf8'), /logos/);
  assert.equal(typeof match, 'function');
});

test('logo: fallback is een neutrale letter in hetzelfde vak', () => {
  assert.equal(logoImg('bestaatniet', { px: 24, naam: 'Voorbeeld' }), '<span class="tlogo tlogo-f" style="width:24px;height:24px" aria-hidden="true">V</span>');
  assert.match(logoImg('notuly'), /^<img class="tlogo" src="\/logos\/notuly.webp" alt="Notuly logo" width="24" height="24" loading="lazy"/);
});
