import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createConsent, readConsent, saveConsent, cleanUrl, cleanParams, CONSENT_KEY } from '../js/lib/consent.js';

const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), m }; };
const setup = (storage = mem()) => {
  const loads = []; const doc = { cookie: '', referrer: '' }; const win = { location: { href: 'https://toolmatch.nl/keuzehulp/?doel=data' } };
  const c = createConsent({ gaId: 'G-Y7V72FDMBZ', storage, doc, win, hostname: 'toolmatch.nl', load: (s) => loads.push(s) });
  return { c, loads, win, storage };
};

test('zonder keuze: melding tonen, niets laden, geen events', () => {
  const { c, loads } = setup();
  assert.equal(c.init(), true); assert.equal(loads.length, 0); assert.equal(c.track('quiz_complete', {}), false);
});

test('Weigeren: opgeslagen als denied, niets geladen, melding niet opnieuw', () => {
  const s = mem(); const a = setup(s);
  a.c.init(); a.c.reject();
  assert.equal(JSON.parse(s.getItem(CONSENT_KEY)).choice, 'denied'); assert.equal(a.loads.length, 0);
  const b = setup(s); assert.equal(b.c.init(), false); assert.equal(b.loads.length, 0); assert.equal(b.c.track('x', {}), false);
});

test('Accepteren laadt gtag één keer en stuurt dan events', () => {
  const { c, loads } = setup();
  c.init(); c.accept();
  assert.equal(loads.length, 1); assert.match(loads[0], /googletagmanager\.com\/gtag\/js\?id=G-Y7V72FDMBZ/);
  assert.equal(c.track('quiz_complete', { doel: 'data' }), true);
});

test('keuze verloopt na 12 maanden; ongeldige data telt niet', () => {
  const s = mem(); saveConsent(s, 'granted', new Date('2025-01-01T00:00:00Z'));
  assert.equal(readConsent(s, new Date('2026-10-20T00:00:00Z')), null);
  s.setItem(CONSENT_KEY, '{kapot'); assert.equal(readConsent(s), null);
});

test('URL zonder querystring, alleen korte tekstparameters', () => {
  assert.equal(cleanUrl('https://toolmatch.nl/keuzehulp/?doel=data#resultaat'), 'https://toolmatch.nl/keuzehulp/');
  assert.deepEqual(cleanParams({ a: 'x', n: 5, e: '' }), { a: 'x' });
});
