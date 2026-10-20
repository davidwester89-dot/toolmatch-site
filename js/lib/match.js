// Keuzehulp: rangschikt tools puur op hoe goed ze passen bij de antwoorden. Pure functies, getest in test/match.test.js.
// Leest NOOIT partnerlinks.js: een vergoeding heeft geen invloed op score of volgorde.
import { TOOLS, DOELEN } from './tools.js';

export const VRAGEN = {
  doel: Object.keys(DOELEN),
  budget: ['gratis', 'klein', 'ruim'],          // alleen gratis / tot ongeveer 30 per maand / maakt niet zoveel uit
  team: ['alleen', 'klein', 'groot'],           // alleen ik / 2-10 mensen / meer dan 10
  privacy: ['eu', 'normaal'],                   // EU-opslag belangrijk / geen harde eis
  techniek: ['beginner', 'handig', 'technisch'],
};
export const STANDAARD = { doel: 'schrijven', budget: 'klein', team: 'alleen', privacy: 'normaal', techniek: 'handig' };

/** Alleen bekende waarden; de rest valt terug op de standaard. */
export function normaliseer(a = {}) {
  const out = {};
  for (const [k, opties] of Object.entries(VRAGEN)) out[k] = opties.includes(a[k]) ? a[k] : STANDAARD[k];
  return out;
}

/** Score en redenen voor één tool. Geeft null als de tool niet bij het doel hoort. */
export function beoordeel(tool, antwoorden) {
  const a = normaliseer(antwoorden);
  const i = tool.doelen.indexOf(a.doel);
  if (i < 0) return null;
  let score = i === 0 ? 4 : 1;
  const plus = [];
  const let_op = [];
  if (i === 0) plus.push('Gemaakt voor ' + DOELEN[a.doel].toLowerCase());
  else let_op.push(DOELEN[a.doel] + ' is een bijfunctie, niet de hoofdtaak');

  // Budget
  if (a.budget === 'gratis') {
    if (tool.gratis) { score += 2; plus.push('Er is een gratis versie'); } else { score -= 3; let_op.push(tool.gratis === false ? 'Geen gratis versie' : 'Gratis versie niet gecontroleerd'); }
  } else if (a.budget === 'klein') {
    if (tool.gratis) { score += 1; plus.push('Er is een gratis versie'); }
    if (tool.prijsMaand != null && tool.prijsMaand <= 30) score += 1;
    else if (tool.prijsMaand != null && tool.prijsMaand > 30) { score -= 2; let_op.push('Het goedkoopste betaalde abonnement is duurder dan ongeveer 30 per maand'); }
  }

  // Teamgrootte
  if (a.team === 'alleen' && tool.prijsPer === 'team' && tool.prijsMaand != null && tool.prijsMaand > 100) { score -= 2; let_op.push('Geprijsd voor teams, niet voor één persoon'); }
  if (a.team !== 'alleen') {
    if (tool.team) { score += 1; plus.push('Er is een abonnement voor teams'); } else { score -= 2; let_op.push('Geen teamabonnement gevonden'); }
  }

  // Privacy en EU
  if (a.privacy === 'eu') {
    if (tool.eu === 'ja') { score += 2; plus.push('Gegevens staan volgens de aanbieder in de EU'); }
    else if (tool.eu === 'deels') { score += 1; plus.push('Gegevens worden volgens de aanbieder vooral in de EU verwerkt'); }
    else let_op.push('EU-opslag niet bevestigd: vraag het na bij de aanbieder');
  }

  // Techniek
  if (a.techniek === 'beginner') {
    if (tool.instap === 'technisch') { score -= 3; let_op.push('Vraagt technische kennis'); }
    else if (tool.instap === 'gemiddeld') { score -= 1; let_op.push('Even inwerken nodig'); }
    else plus.push('Snel aan de slag zonder technische kennis');
  } else if (a.techniek === 'technisch' && tool.instap === 'technisch') { score += 1; plus.push('Veel mogelijkheden als je technisch bent'); }

  return { tool, score, plus, let_op };
}

/** Rangschik alle passende tools: hoogste score eerst, bij gelijke score op naam (A-Z). */
export function match(antwoorden, tools = TOOLS) {
  return tools.map((t) => beoordeel(t, antwoorden)).filter(Boolean)
    .sort((x, y) => y.score - x.score || x.tool.naam.localeCompare(y.tool.naam, 'nl'));
}
