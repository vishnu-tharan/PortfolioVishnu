import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('Every browser script and module dependency resolves to an existing local file', () => {
  const root = new URL('../dist/', import.meta.url);
  for (const file of readdirSync(root).filter((file) => file.endsWith('.html'))) {
    const html = readFileSync(new URL(file, root), 'utf8');
    for (const [, path] of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
      const target = new URL(path, new URL(file, root));
      target.search = '';
      assert.ok(existsSync(target), `${file}: missing ${path}`);
    }
  }
  const src = new URL('src/', root);
  for (const file of readdirSync(src).filter((file) => file.endsWith('.js'))) {
    const script = readFileSync(new URL(file, src), 'utf8');
    for (const [, path] of script.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
      const target = new URL(path, new URL(file, src));
      target.search = '';
      assert.ok(existsSync(target), `${file}: missing ${path}`);
    }
  }
});

test('Each page has one security policy with matching inline script hashes', () => {
  const root = new URL('../dist/', import.meta.url);
  for (const file of readdirSync(root).filter((file) => file.endsWith('.html'))) {
    // Browsers normalize Windows line endings before checking script hashes.
    const html = readFileSync(new URL(file, root), 'utf8').replace(/\r\n/g, '\n');
    const policies = [
      ...html.matchAll(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/g)
    ];
    assert.equal(policies.length, 1, `${file}: expected one security policy`);
    for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (!attributes.includes('src=')) {
        const hash = createHash('sha256').update(body).digest('base64');
        assert.ok(
          policies[0][1].includes(`'sha256-${hash}'`),
          `${file}: inline script hash does not match`
        );
      }
    }
  }
});

test('Home page links and styles resolve', () => {
  const home = new URL('../dist/index.html', import.meta.url);
  const html = readFileSync(home, 'utf8');
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith('#')) {
      assert.ok(html.includes(`id="${href.slice(1)}"`), `Missing section ${href}`);
    } else if (href.startsWith('./')) {
      const target = new URL(href, home);
      target.search = '';
      assert.ok(existsSync(target), `Missing file ${href}`);
    }
  }
});
