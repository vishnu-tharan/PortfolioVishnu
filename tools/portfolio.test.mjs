import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../dist/src/project-data.js';
import { safeProjectURL, projectDetails } from '../dist/src/projects.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('Every gallery image is present, traceable to its repository and uses a safe local URL', () => {
  const sources = JSON.parse(
    readFileSync(new URL('../dist/assets/projects/screenshot-sources.json', import.meta.url))
  );
  let count = 0;
  for (const project of projects.filter((item) => item.screenshots)) {
    assert.equal(project.image, project.screenshots[0].src);
    assert.equal(
      new Set(project.screenshots.map((shot) => shot.src)).size,
      project.screenshots.length
    );
    for (const shot of project.screenshots) {
      assert.notEqual(safeProjectURL(shot.src, true), '#');
      const bytes = readFileSync(new URL('../dist/' + shot.src.slice(2), import.meta.url));
      const source = sources.find((item) => shot.src.endsWith('/' + item.file));
      assert.ok(source?.source.includes('/blob/' + source.commit + '/docs/screenshots/'));
      assert.equal(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        source.blob
      );
      assert.ok(shot.alt && shot.caption && shot.width > 0 && shot.height > 0 && bytes.length > 0);
      count++;
    }
    const malicious = {
      ...project,
      screenshots: [{ ...project.screenshots[0], label: '<script>alert(1)</script>' }]
    };
    assert.ok(!projectDetails(malicious).includes('<script>'));
  }
  assert.equal(count, 12);
});

test('Project destinations reject executable URLs, attribute injection and outside images', () => {
  for (const url of [
    'javascript:alert(1)',
    'https://evil.test/repo',
    'https://github.com/a/b" onmouseover="alert(1)',
    'https://github.com/a/../evil'
  ])
    assert.equal(safeProjectURL(url), '#');
  assert.equal(safeProjectURL('https://evil.test/image.jpg', true), '#');
  assert.equal(
    safeProjectURL('./assets/projects/buyora-storefront.jpg', true),
    './assets/projects/buyora-storefront.jpg'
  );
  for (const project of projects) {
    assert.notEqual(safeProjectURL(project.link), '#');
    if (project.evidence) assert.notEqual(safeProjectURL(project.evidence), '#');
  }
  assert.ok(
    !projectDetails({
      ...projects[0],
      link: 'javascript:alert(1)',
      title: '<script>alert(1)</script>'
    }).includes('<script>')
  );
});
test('All project share links have unique names and useful content', () => {
  const slugs = projects.map((project) =>
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  );
  assert.equal(new Set(slugs).size, projects.length);
  for (const project of projects) {
    for (const field of [
      'title',
      'summary',
      'role',
      'stack',
      'problem',
      'contribution',
      'decision',
      'status'
    ])
      assert.ok(project[field], `${project.title}: ${field}`);
    assert.match(project.link, /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/);
  }
});

test('Project descriptions follow the reviewed repository revisions', () => {
  const review = JSON.parse(readFileSync(new URL('./project-review.json', import.meta.url)));
  assert.equal(review.length, projects.length);
  for (const project of projects) {
    const source = review.find((item) => 'https://github.com/' + item.repository === project.link);
    assert.equal(project.reviewedCommit, source?.commit, project.title);
    assert.ok(source.sources.length >= 3);
  }
  const cinema = projects.find((item) => item.title === 'CinemaStream');
  assert.match(cinema.stack, /JavaScript/);
  assert.doesNotMatch(cinema.stack, /AsyncStorage/);
  assert.match(cinema.decision, /require an internet connection/);
  assert.equal(cinema.performance, undefined);
  const gatepilot = projects.find((item) => item.title === 'GatePilot');
  assert.doesNotMatch(gatepilot.contribution, /staff QR|PDF report/);
  const cash = projects.find((item) => item.title === 'CashManage');
  assert.equal(cash.imageKind, 'logo');
  assert.doesNotMatch(cash.contribution, /shared cashbook roles/);
});

test('GATEWAY group work and GatePilot retain their own repositories and attribution', () => {
  const gateway = projects.find((project) => project.title === 'GATEWAY');
  const gatepilot = projects.find((project) => project.title === 'GatePilot');
  assert.equal(gateway.link, 'https://github.com/chamikara12/GATEWAY');
  assert.match(gateway.type, /3\.1.*GROUP PROJECT/);
  assert.match(gateway.role, /Frontend and backend.*Group project/);
  assert.equal(gateway.imageKind, 'logo');
  assert.match(gateway.image, /gateway-symbol\.svg$/);
  assert.equal(gateway.evidence, undefined);
  assert.match(gateway.stack, /React · JavaScript/);
  assert.equal(gatepilot.link, 'https://github.com/vishnu-tharan/GatePilot');
  assert.match(gatepilot.stack, /React Native · Expo/);
  assert.ok(projects.every((project) => !project.link.includes('GATEWAY-UniversityOfVavuniya')));
});
import { readdirSync, existsSync } from 'node:fs';

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
