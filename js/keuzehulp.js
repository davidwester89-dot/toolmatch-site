// Keuzehulp op /keuzehulp/. Logica in ./lib/match.js (getest); partnerlinks alleen voor de knop onder een resultaat.
import { match, normaliseer, VRAGEN } from './lib/match.js';
import { DOELEN, GECONTROLEERD } from './lib/tools.js';
import { uitgaand } from './lib/partnerlinks.js';
import { track } from './consent.js';

const form = document.getElementById('form');
const out = document.getElementById('resultaat');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const datum = new Date(GECONTROLEERD + 'T12:00:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
const CATEGORIE = {
  schrijven: ['/ai-tekst-schrijven/', 'Alle tools voor teksten schrijven vergeleken'],
  notuleren: ['/ai-notuleren/', 'Alle tools voor notuleren vergeleken'],
  klantcontact: ['/ai-chatbot-website/', 'Alle chatbots voor je website vergeleken'],
  automatiseren: ['/automatiseren-zonder-code/', 'Alle tools om zonder code te automatiseren'],
  beeld: ['/ai-afbeeldingen-en-ontwerp/', 'Alle tools voor beeld en ontwerp vergeleken'],
  data: ['/ai-data-analyse/', 'Alle tools voor data en dashboards vergeleken'],
};
const EU = { ja: 'In de EU (volgens de aanbieder)', deels: 'Vooral in de EU (volgens de aanbieder)' };

function lees() {
  const a = {};
  for (const k of Object.keys(VRAGEN)) { const el = form.querySelector(`input[name="${k}"]:checked`); if (el) a[k] = el.value; }
  return a;
}

function kaart(r, n) {
  const t = r.tool;
  const o = uitgaand(t);
  const li = (xs, cls) => xs.length ? `<ul class="${cls}">${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  return `<article class="res${n === 0 ? ' top' : ''}">
  <p class="rank">${n === 0 ? 'Beste match' : '#' + (n + 1)}</p>
  <h3>${esc(t.naam)}</h3>
  <p>${esc(t.wat)}</p>
  ${li(r.plus, 'pros')}${li(r.let_op, 'cons')}
  <dl class="facts">
    <div><dt>Gratis versie</dt><dd>${t.gratis === true ? 'Ja' : t.gratis === false ? 'Nee' : 'Niet gecontroleerd'}</dd></div>
    <div><dt>Betaald vanaf</dt><dd>${t.prijs ? esc(t.prijs) : 'Niet gecontroleerd, zie de site'}</dd></div>
    <div><dt>Gegevens</dt><dd>${EU[t.eu] || 'Locatie niet gecontroleerd'}</dd></div>
    <div><dt>Instap</dt><dd>${esc(t.instap[0].toUpperCase() + t.instap.slice(1))} <small>(onze indeling)</small></dd></div>
  </dl>
  ${t.privacy ? `<p class="priv">${esc(t.privacy)}</p>` : ''}
  <p class="src">Bron: ${t.bronnen.map(([n2, u]) => `<a href="${esc(u)}" rel="noopener" target="_blank">${esc(n2)}</a>`).join(', ')} · gecontroleerd op ${datum}</p>
  <p class="go"><a class="btn${n === 0 ? '' : ' ghost'}" href="${esc(o.href)}" rel="${o.rel}" target="_blank" data-vendor="${esc(t.id)}" data-pos="${n + 1}" data-cta="${o.partner ? 'partner' : 'outbound'}">Naar de site van ${esc(t.naam)}</a>${o.partner ? ' <span class="partner">partnerlink</span>' : ''}</p>
</article>`;
}

function toon(a, scroll) {
  const res = match(a);
  out.innerHTML = `<h2 id="h-res" tabindex="-1">Jouw match voor: ${esc(DOELEN[a.doel].toLowerCase())}</h2>
<p class="lead">${res.length} tools gerangschikt op hoe goed ze bij je antwoorden passen. De volgorde hangt nooit af van een vergoeding.</p>
<div class="results">${res.map(kaart).join('')}</div>
${CATEGORIE[a.doel] ? `<p class="cat-l"><a href="${CATEGORIE[a.doel][0]}">${esc(CATEGORIE[a.doel][1])}</a></p>` : ''}`;
  out.hidden = false;
  if (scroll) out.querySelector('#h-res').focus();
}

if (form && out) {
  const p = new URLSearchParams(location.search);
  const start = {};
  for (const k of Object.keys(VRAGEN)) if (p.get(k)) start[k] = p.get(k);
  const a0 = normaliseer(start);
  if (p.get('doel')) for (const [k, v] of Object.entries(a0)) { const el = form.querySelector(`input[name="${k}"][value="${v}"]`); if (el) el.checked = true; }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const a = normaliseer(lees());
    history.replaceState(null, '', '?' + new URLSearchParams(a).toString() + '#resultaat');
    toon(a, true);
    track('quiz_complete', { tool_name: 'keuzehulp', doel: a.doel });
  });
  if (p.get('doel')) toon(a0, false);
}
