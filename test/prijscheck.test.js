// NL-IP-prijscheck 30-10 (site-checks/2026-10-30/tm-nl-ip-prijscheck.md): europrijzen ChatGPT en Claude, L1 en L7.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (p) => readFileSync(p, 'utf8');
const sm = read('sitemap.xml');

test('prijscheck: geen "europrijs niet nalezen" meer bij ChatGPT en Claude', () => {
  for (const p of ['gids/wat-kosten-ai-abonnementen/index.html', 'vergelijken/chatgpt-vs-claude/index.html']) {
    assert.doesNotMatch(read(p), /europrijs voor Nederland konden we daar niet nalezen/, p);
  }
});

test('prijscheck: ChatGPT Plus €23 per maand; Claude Pro maandprijs €18 vóór de jaarprijs (L1), excl. btw', () => {
  for (const p of ['vergelijken/chatgpt-vs-claude', 'vergelijken/chatgpt-vs-copilot', 'vergelijken/chatgpt-vs-gemini']) {
    assert.match(read(`${p}/index.html`), /Plus: €23 per maand \(btw niet vermeld op de prijspagina\)/, p);
  }
  const v = read('vergelijken/chatgpt-vs-claude/index.html');
  assert.match(v, /Pro: €18 per maand bij maandelijks betalen, €15 per maand bij jaarbetaling \(€180 per jaar\), excl\. btw/);
  assert.match(v, /€21,04 per gebruiker per maand bij maandelijks betalen, €18 bij jaarbetaling, excl\. btw/);
  assert.ok(v.indexOf('€18 per maand') < v.indexOf('€15 per maand'));
  assert.match(read('gids/wat-kosten-ai-abonnementen/index.html'), /ChatGPT Plus en kost €23 per maand/);
});

test('prijscheck L7: gewijzigde pagina\'s op 30-10, bronnen bekeken op 30 oktober 2026', () => {
  for (const p of ['gids/ai-veilig-gebruiken', 'gids/wat-kosten-ai-abonnementen', 'vergelijken/chatgpt-vs-claude', 'vergelijken/chatgpt-vs-copilot', 'vergelijken/chatgpt-vs-gemini']) {
    const t = read(`${p}/index.html`);
    assert.match(t, /"dateModified": "2026-10-30"/, p);
    assert.match(t, /<p class="note">Redactie ToolMatch · [^<]*bijgewerkt op 30 oktober 2026/, p);
    assert.ok(sm.includes(`<loc>https://toolmatch.nl/${p}/</loc><lastmod>2026-10-30</lastmod>`), p);
    assert.match(t, /https:\/\/chatgpt\.com\/nl-NL\/pricing" rel="noopener">ChatGPT: Prijzen<\/a>, bekeken op 30 oktober 2026|chatgpt\.com\/pricing" rel="noopener">[^<]+<\/a>, bekeken op 30 oktober 2026/, p);
  }
});

test('prijscheck: prijsMaand = europrijs bij maandelijks betalen (MM-besluit groeilog 30-10 14:25)', async () => {
  const { TOOLS } = await import('../js/lib/tools.js');
  const T = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
  for (const [id, v] of [['chatgpt', 23], ['claude', 18], ['notta', 11.69], ['calendly', 12]]) {
    assert.equal(T[id].prijsMaand, v, id); assert.equal(T[id].prijsMaandBron, 'pagina', id);
  }
  assert.equal(T.canva.prijsMaand, 12); assert.equal(T.canva.prijsMaandBron, 'intern');
  assert.equal(T.buffer.prijsMaand, 5); assert.equal(T.buffer.prijsMaandBron, 'intern');
  assert.match(T.calendly.prijs, /^Standard: €12 per gebruiker per maand bij maandelijks betalen, .*\(EUR gekozen op de prijspagina; btw niet vermeld\)$/);
  assert.match(T.notta.prijs, /^Pro: €11,69 per maand bij maandelijks betalen, €7 per maand bij jaarbetaling/);
});

test('prijscheck gids wat-kosten: europrijzen ChatGPT en Claude in tabel, H2 en tekst; maandprijs eerst; btw zoals de bron', () => {
  const t = read('gids/wat-kosten-ai-abonnementen/index.html');
  assert.match(t, /<h2 id="chatgpt-claude-prijs">Wat kosten ChatGPT Plus en Claude Pro\?<\/h2>/);
  assert.match(t, /<p>ChatGPT Plus kost €23 per maand\./);
  assert.match(t, /Claude Pro kost €18 per maand bij maandelijks betalen, of €15 per maand bij jaarbetaling \(€180 vooraf\)\. Anthropic schrijft erbij: "Prices shown don’t include applicable tax\."/);
  assert.match(t, /<td>Plus: €23 per maand \(btw niet vermeld op de prijspagina\)<\/td>/);
  assert.match(t, /<td>Pro: €18 per maand bij maandelijks betalen, €15 per maand bij jaarbetaling \(€180 per jaar\), excl\. btw<\/td>/);
  assert.match(t, /"name": "Wat kost Claude per maand\?"/);
  assert.doesNotMatch(t, /Canva[^<]{0,80}per maand/);
});

test('prijscheck gids wat-kosten: meta noemt de btw-basis per prijs (SC 30-10)', () => {
  const t = read('gids/wat-kosten-ai-abonnementen/index.html');
  const m = t.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.match(m, /^ChatGPT Plus kost €23 per maand \(btw niet vermeld\), Claude Pro €18 excl\. btw\./);
  assert.ok(m.length <= 155, String(m.length));
  assert.match(t, /<meta property="og:description" content="ChatGPT Plus kost €23 per maand \(btw niet vermeld\)/);
});

test('prijscheck: "Zo kies je" Claude vergelijkt met btw-basis per prijs (SC 30-10)', () => {
  const v = read('vergelijken/chatgpt-vs-claude/index.html');
  assert.doesNotMatch(v, /bij jaarbetaling iets minder wilt betalen/);
  assert.match(v, /Claude Pro kost €18 per maand \(€15 bij jaarbetaling\), exclusief btw; ChatGPT Plus kost €23 per maand, zonder vermelding van btw\. Ook met 21% btw erbij is Claude Pro goedkoper \(€21,78 per maand, onze rekensom\)\./);
  assert.equal(Math.round(18 * 1.21 * 100) / 100, 21.78);
});
