// Inline sources only in the choice-help view. No ranking or vendor data changes.
// URLs are the same primary sources already shown in that tool's source column.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function claimSource(t, text, privacy = false) {
  const s = String(text);
  if (/^(?:Niet gecontroleerd|Gratis versie niet gecontroleerd|Locatie niet gecontroleerd|EU-opslag niet bevestigd|Geen teamabonnement gevonden)/i.test(s)) return esc(s);
  const source = (privacy ? t.bronnen.find(([name]) => /privacy|store my data/i.test(name)) : null) || t.bronnen[0];
  if (!source || !/^https:\/\//.test(source[1])) throw new Error(`Geen gecontroleerde bron voor ${t.id}`);
  return `<a class="claim-source" href="${esc(source[1])}" rel="noopener">${esc(s)}</a>`;
}
export function reasonSource(t, text) {
  // Instap/ease is our disclosed editorial classification, not a vendor promise.
  if (/^(?:Vraagt technische kennis|Even inwerken nodig|Snel aan de slag zonder technische kennis|Veel mogelijkheden als je technisch bent)/.test(text)) return esc(text);
  return claimSource(t, text, /opslag|verwerking/.test(text));
}
