import { withoutClaimSources } from './claim-source-helper.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('SC-v4: meetbare productclaims noemen hun bron als onderwerp in de eigen alinea of cel', () => {
  const cases = [
    ['ai-assistenten/index.html', 'Microsoft geeft aan dat prompts en antwoorden bij Copilot Business niet worden gebruikt'],
    ['vergelijken/chatgpt-vs-copilot/index.html', 'Microsoft gebruikt prompts en antwoorden niet'],
    ['vergelijken/chatgpt-vs-copilot/index.html', 'Microsoft houdt prompts en antwoorden bij Copilot Business'],
    ['gids/ai-veilig-gebruiken/index.html', 'Microsoft geeft aan prompts en antwoorden niet te gebruiken'],
    ['ai-presentatie-maken/index.html', 'Microsoft laat Copilot ook een presentatie maken'],
    ['ai-presentatie-maken/index.html', 'Google laat je met Gemini naar je Drive-bestanden verwijzen'],
    ['ai-mail-en-offertes/index.html', 'Microsoft laat Copilot daar mails opstellen'],
    ['ai-mail-en-offertes/index.html', 'de prijspagina van Anthropic noemt Claude for Microsoft Outlook vanaf Pro'],
    ['ai-notuleren/index.html', 'dan laat Microsoft ook'],
    ['ai-data-analyse/index.html', 'Microsoft laat Copilot daar gegevens analyseren'],
    ['vergelijken/chatgpt-vs-claude/index.html', 'Anthropic traint bij de zakelijke plannen standaard niet op je inhoud'],
    ['online-afspraken-plannen/index.html', 'SimplyBook.me zet betalingen en aanbetalingen vanaf Standard'],
    ['ai-website-maken/index.html', 'Wix biedt Nederlandstalige klantenservice.'],
  ];
  for (const [file, phrase] of cases) assert.ok(withoutClaimSources(readFileSync(file,'utf8')).includes(phrase), file+': '+phrase);
});
