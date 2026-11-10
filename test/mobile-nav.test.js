import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';

const ROOT = new URL('..', import.meta.url).pathname;
execFileSync('python3', ['scripts/build.py'], { cwd: ROOT });
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  if (/^(\.git|scripts|test|node_modules|_site)$/.test(name)) return [];
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

test('shared header: accessible toggle, all five links, same-origin deferred script on every page', () => {
  const pages = walk(ROOT).filter((p) => p.endsWith('.html') && !/google[0-9a-f]+\.html$/.test(p) && p !== join(ROOT, 'blog/index.html'));
  assert.ok(pages.length >= 35);
  for (const p of pages) {
    const html = readFileSync(p, 'utf8');
    assert.match(html, /<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-menu" hidden>Menu<\/button>/, p);
    const menu = html.match(/<nav class="main" id="main-menu" aria-label="Hoofdmenu">([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(menu, p);
    for (const href of ['/#categorieen', '/vergelijken/', '/gids/', '/keuzehulp/', '/over/']) assert.ok(menu.includes(`href="${href}"`), p + ' ' + href);
    assert.equal((html.match(/id="main-menu"/g) || []).length, 1, p);
    assert.match(html, /<script src="\/js\/nav\.js" defer><\/script>/, p);
    assert.doesNotMatch(html, /\sonclick=/, p);
  }
  const css = read('style.css');
  assert.doesNotMatch(css, /nav\.main a:not\(\.nav-cta\)\{display:none\}/);
  assert.match(css, /header\.site \.nav-toggle\{display:none\}/);
  assert.match(css, /@media\(max-width:899px\)/);
  assert.match(css, /\.nav-toggle:not\(\[hidden\]\)\[aria-expanded="false"\]\+nav\.main\{display:none\}/);
});

function fixture() {
  const listeners = new Map();
  const on = (name) => (type, handler) => listeners.set(name + ':' + type, handler);
  const document = { activeElement: null, addEventListener: on('document') };
  const link = { closest: () => link, focus: () => { document.activeElement = link; } };
  const outside = {};
  const attrs = { 'aria-controls': 'main-menu', 'aria-expanded': 'false' };
  const button = {
    hidden: true,
    getAttribute: (key) => attrs[key], setAttribute: (key, value) => { attrs[key] = value; },
    addEventListener: on('button'), contains: (target) => target === button,
    focus: () => { document.activeElement = button; },
  };
  const menu = { addEventListener: on('menu'), contains: (target) => target === link || target === menu, querySelector: () => link };
  const mobile = { matches: true, addEventListener: on('media') };
  document.querySelector = () => button;
  document.getElementById = (id) => id === 'main-menu' ? menu : null;
  runInNewContext(read('js/nav.js'), { document, window: { matchMedia: () => mobile } });
  return { button, menu, link, outside, document, mobile, expanded: () => attrs['aria-expanded'], fire: (target, event, details = {}) => listeners.get(target + ':' + event)(details) };
}

test('mobile menu: open/close, Escape restores focus, link closes, outside click, responsive reset', () => {
  const f = fixture();
  assert.equal(f.button.hidden, false);
  assert.equal(f.expanded(), 'false');
  f.fire('button', 'click'); assert.equal(f.expanded(), 'true');
  f.fire('button', 'click'); assert.equal(f.expanded(), 'false');
  f.fire('button', 'click'); f.document.activeElement = f.link;
  f.fire('document', 'keydown', { key: 'Escape' });
  assert.equal(f.expanded(), 'false'); assert.equal(f.document.activeElement, f.button);
  f.fire('button', 'click'); f.fire('menu', 'click', { target: f.link }); assert.equal(f.expanded(), 'false');
  f.fire('button', 'click'); f.fire('document', 'click', { target: f.menu }); assert.equal(f.expanded(), 'true');
  f.document.activeElement = f.link;
  f.fire('document', 'click', { target: f.outside });
  assert.equal(f.expanded(), 'false'); assert.equal(f.document.activeElement, f.button);
  f.fire('button', 'click'); f.mobile.matches = false; f.fire('media', 'change');
  assert.equal(f.expanded(), 'false'); assert.equal(f.document.activeElement, f.link);
  f.mobile.matches = true; f.fire('media', 'change'); assert.equal(f.document.activeElement, f.button);
});

test('menu script safely does nothing when no shared header is present', () => {
  assert.doesNotThrow(() => runInNewContext(read('js/nav.js'), { document: { querySelector: () => null, getElementById: () => null } }));
});

test('GitHub Pages /blog/ alias: canonical + noindex + immediate redirect, never in sitemap', () => {
  const html = read('blog/index.html');
  assert.match(html, /<meta name="robots" content="noindex, follow">/);
  assert.match(html, /<meta http-equiv="refresh" content="0; url=\/gids\/">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/toolmatch\.nl\/gids\/">/);
  assert.match(html, /<a href="\/gids\/">Gidsen<\/a>/);
  assert.doesNotMatch(read('sitemap.xml'), /<loc>https:\/\/toolmatch\.nl\/blog\//);
});
