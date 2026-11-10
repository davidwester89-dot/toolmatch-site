import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { TOOLS } from '../js/lib/tools.js';
import { claimSource, reasonSource } from '../js/lib/claim-source.js';
import { withoutClaimSources } from './claim-source-helper.mjs';
const read = (f) => readFileSync(f, 'utf8');
const plan = JSON.parse(read('scripts/claim_sources.json'));
const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'");
const py = (s) => execFileSync('python3', ['-c', "import sys; sys.path.insert(0,'scripts');\n" + s], { encoding: 'utf8' });

test('SC-v5: alle zeven bronloze claims hebben de uitgever als onderwerp, met exacte bestaande inline bron', () => {
  const cases = [
    ['ai-assistenten/index.html', 'Microsoft zet Copilot Chat bij geschikte Microsoft 365-plannen zonder extra kosten in'],
    ['gids/ai-gebruiken-in-je-bedrijf/index.html', 'Microsoft zet Copilot Chat bij geschikte Microsoft 365-plannen zonder extra kosten in'],
    ['vergelijken/chatgpt-vs-copilot/index.html', 'OpenAI biedt op de prijspagina van ChatGPT de mogelijkheid om uit te zetten'],
    ['vergelijken/chatgpt-vs-copilot/index.html', 'Microsoft noemt voor sommige geavanceerde functies daarnaast een prijs naar gebruik'],
    ['vergelijken/chatgpt-vs-claude/index.html', 'De prijspagina van Anthropic noemt Claude for Microsoft 365 en Claude for Microsoft Outlook vanaf Pro.'],
    ['websitebezoekers-herkennen/index.html', 'Albacross zet automatische e-mail- en LinkedIn-reeksen met AI al in Starter'],
    ['ai-tekst-schrijven/index.html', 'DeepL gebruikt je tekst bij betaalde abonnementen niet voor training'],
    ['ai-vertalen/index.html', 'Google laat je met Translate ook bestanden en websites vertalen'],
  ];
  for (const [file, phrase] of cases) {
    const h = read(file);
    assert.ok(withoutClaimSources(h).includes(phrase), file + ': ' + phrase);
    const entry = plan.find((p) => p.file === file)?.edits.find((e) => plain(e.after).includes(phrase));
    assert.ok(entry && /class="claim-source"/.test(entry.after), file + ': source in own sentence/cell');
  }
});

test('volledige sweep: elk beoordeeld fragment staat exact in de build; cijfers/tekst, oude links en bronnen blijven gelijk', () => {
  assert.equal(plan.length, 21);
  assert.equal(new Set(plan.map((p) => p.page)).size, 21);
  const result = JSON.parse(py(`from claim_sources import Document\nfrom pathlib import Path\nimport json\nplan=json.loads(Path('scripts/claim_sources.json').read_text())\ncount=0\nfor page in plan:\n d=Document(Path(page['file']).read_text()); units=d.units(); sources=d.source_urls()\n for e in page['edits']:\n  assert d.inner(units[e['unit']])==e['after'],(page['file'],e['unit'])\n  assert set(e['sources'])<=sources\n  assert Document('<main>'+e['before']+'</main>').text(Document('<main>'+e['before']+'</main>').nodes[0])==Document('<main>'+e['after']+'</main>').text(Document('<main>'+e['after']+'</main>').nodes[0])\n  count+=1\nprint(json.dumps({'count':count}))`));
  assert.equal(result.count, plan.reduce((n, p) => n + p.edits.length, 0));
  assert.ok(result.count > 500, 'niet alleen zeven losse SC-zinnen');
  for (const p of plan) for (const e of p.edits) {
    assert.equal(plain(e.before), plain(e.after), p.file + ': geen feit aangepast');
    const citations = [...e.after.matchAll(/<a class="claim-source" href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(citations.length, new Set(citations).size, 'geen herhaalde bron-URL in dezelfde alinea/cel');
    assert.doesNotMatch(e.after, /\(bron:/i);
    for (const [tag] of e.after.matchAll(/<a class="claim-source"[^>]*>/g)) assert.doesNotMatch(tag, /sponsored|data-vendor=|data-cta=/i);
    assert.deepEqual([...e.after.matchAll(/<a class="claim-source" href="([^"]*)" rel="noopener">/g)].map((m) => m[1].replace(/&amp;/g, '&')).filter((x, i, a) => a.indexOf(x) === i).sort(), [...e.sources].sort());
  }
});

test('tabellen en kaart-feitcellen: bekende prijs/plan/feature/locatie/limiet heeft de bron in de cel zelf', () => {
  py(`from claim_sources import Document\nfrom pathlib import Path\nimport json,re\nfor page in json.loads(Path('scripts/claim_sources.json').read_text()):\n d=Document(Path(page['file']).read_text())\n for n in d.nodes:\n  if n.tag!='dd': continue\n  text=d.text(n)\n  if 'onze indeling' in text or text in ('Niet gecontroleerd','Locatie niet gecontroleerd','Onbekend'):continue\n  assert 'class="claim-source"' in d.inner(n),(page['file'],text)\n for e in page['edits']:\n  if e['tag']=='td':assert 'class="claim-source"' in e['after']\nprint('known cells sourced')`);
});

test('keuzehulp: iedere vendor-factstring linkt dezelfde eigen bron, zonder zichtbare tekstwijziging', () => {
  for (const t of TOOLS) {
    for (const [text, privacy] of [[t.wat, false], [t.prijs, false], [t.privacy, true]]) {
      if (!text) continue;
      const linked = claimSource(t, text, privacy);
      assert.equal(plain(linked), text);
      const u = linked.match(/href="([^"]+)"/)[1].replace(/&amp;/g, '&');
      assert.ok(t.bronnen.some(([, source]) => source === u), t.id + ': bestaande bron');
      assert.doesNotMatch(linked, /sponsored|data-cta|data-vendor/);
    }
  }
});

test('keuzehulp: onbekend blijft onbekend; onze instapindeling is geen vendorbelofte', () => {
  const t = TOOLS[0];
  for (const text of ['Niet gecontroleerd', 'Locatie niet gecontroleerd', 'Gratis versie niet gecontroleerd', 'EU-opslag niet bevestigd: vraag het na bij de aanbieder']) assert.equal(claimSource(t, text), text);
  for (const text of ['Vraagt technische kennis', 'Even inwerken nodig', 'Snel aan de slag zonder technische kennis', 'Veel mogelijkheden als je technisch bent']) assert.equal(reasonSource(t, text), text);
  for (const text of ['Er is een gratis versie', 'Geen gratis versie', 'Er is een abonnement voor teams', 'De aanbieder geeft opslag in de EU op']) assert.match(reasonSource(t, text), /class="claim-source"/);
});

test('bronplan faalt dicht bij een gewijzigd bedrag of een niet-bestaande bron-URL', () => {
  py(`from claim_sources import Document,apply_plan\nfrom pathlib import Path\nimport json,tempfile,copy\nplan=json.loads(Path('scripts/claim_sources.json').read_text());p=plan[0];h=Path(p['file']).read_text();d=Document(h);units=d.units()\nfor e in sorted(p['edits'],key=lambda e:units[e['unit']].inner_start,reverse=True):\n n=units[e['unit']];h=h[:n.inner_start]+e['before']+h[n.inner_end:]\nfor mutation in ('amount','url'):\n with tempfile.TemporaryDirectory() as td:\n  root=Path(td);(root/'scripts').mkdir();f=root/p['file'];f.parent.mkdir(parents=True,exist_ok=True);pp=copy.deepcopy(p);out=h\n  if mutation=='amount':out=out.replace('€23 per maand','€24 per maand',1)\n  else:pp['edits'][0]['after']=pp['edits'][0]['after'].replace(pp['edits'][0]['sources'][0],'https://not-a-reviewed-source.invalid/')\n  f.write_text(out);(root/'scripts/claim_sources.json').write_text(json.dumps([pp]))\n  try:apply_plan(root)\n  except AssertionError:pass\n  else:raise AssertionError('mutation should block build: '+mutation)\nprint('both mutations rejected')`);
});
