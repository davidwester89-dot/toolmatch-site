// E-CTA-1: zet de blokken A/C in de gebouwde html (laatste stap van scripts/build.py). Idempotent.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyEcta } from './e-cta.mjs';
import { ECTA } from './e-cta-1.config.mjs';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const path of Object.keys(ECTA.pages)) {
  const f = join(ROOT, path, 'index.html');
  const oud = readFileSync(f, 'utf8');
  const nieuw = applyEcta(oud, path, ECTA);
  if (nieuw !== oud) writeFileSync(f, nieuw);
}
