import test from 'node:test';
import assert from 'node:assert/strict';
import { validSnapshot, eventDetails } from '../dist/src/github-data.js';
import { projects } from '../dist/src/project-data.js';
import { safeProjectURL, projectDetails } from '../dist/src/projects.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const now = Date.now();
const valid = {time:now,user:{login:'vishnu-tharan',public_repos:12,followers:1,following:1},events:[]};

test('Every gallery image is present, traceable to its repository and uses a safe local URL', () => {
  const sources = JSON.parse(readFileSync(new URL('../dist/assets/projects/screenshot-sources.json', import.meta.url)));
  let count = 0;
  for (const project of projects.filter(item => item.screenshots)) {
    assert.equal(project.image, project.screenshots[0].src);
    assert.equal(new Set(project.screenshots.map(shot => shot.src)).size, project.screenshots.length);
    for (const shot of project.screenshots) {
      assert.notEqual(safeProjectURL(shot.src, true), '#');
      const bytes = readFileSync(new URL('../dist/' + shot.src.slice(2), import.meta.url));
      const source = sources.find(item => shot.src.endsWith('/' + item.file));
      assert.ok(source?.source.includes('/blob/' + source.commit + '/docs/screenshots/'));
      assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), source.blob);
      assert.ok(shot.alt && shot.caption && shot.width > 0 && shot.height > 0 && bytes.length > 0);
      count++;
    }
    const malicious = {...project, screenshots:[{...project.screenshots[0], label:'<script>alert(1)</script>'}]};
    assert.ok(!projectDetails(malicious).includes('<script>'));
  }
  assert.equal(count, 29);
});

test('Untrusted event types and path segments cannot crash or redirect the activity feed', () => {
  for (const type of ['constructor', '__proto__', 'toString']) {
    assert.equal(eventDetails({type,repo:{name:'owner/repo'},created_at:'2026-10-18'}).url, 'https://github.com/owner/repo');
  }
  for (const name of ['owner/..','owner/.']) assert.equal(eventDetails({repo:{name},created_at:'2026-10-18'}), null);
  assert.equal(validSnapshot({...valid,events:Array(101).fill(null)}), false);
});

test('Project destinations reject executable URLs, attribute injection and outside images', () => {
  for (const url of ['javascript:alert(1)','https://evil.test/repo','https://github.com/a/b" onmouseover="alert(1)', 'https://github.com/a/../evil']) assert.equal(safeProjectURL(url), '#');
  assert.equal(safeProjectURL('https://evil.test/image.jpg', true), '#');
  assert.equal(safeProjectURL('./assets/projects/buyora-storefront.jpg', true), './assets/projects/buyora-storefront.jpg');
  for (const project of projects) {
    assert.notEqual(safeProjectURL(project.link), '#');
    if (project.evidence) assert.notEqual(safeProjectURL(project.evidence), '#');
  }
  assert.ok(!projectDetails({...projects[0],link:'javascript:alert(1)',title:'<script>alert(1)</script>'}).includes('<script>'));
});
test('GitHub snapshots reject malformed, foreign and future data', () => {
  assert.equal(validSnapshot(valid), true);
  for (const invalid of [null, {}, {...valid,time:now + 120000}, {...valid,time:-1}, {...valid,events:{}}, {...valid,user:{...valid.user,login:42}}, {...valid,user:{...valid.user,login:'someone-else'}}, {...valid,user:{...valid.user,followers:'1'}}, {...valid,user:{...valid.user,public_repos:-2}}]) assert.equal(validSnapshot(invalid), false);
});
test('Push events link to the supplied commit without inventing commit counts', () => {
  const head = 'a'.repeat(40);
  const item = eventDetails({type:'PushEvent',repo:{name:'vishnu-tharan/Buyora'},created_at:'2026-10-05T00:00:00Z',payload:{ref:'refs/heads/main',head}});
  assert.equal(item.url, `https://github.com/vishnu-tharan/Buyora/commit/${head}`);
  assert.equal(item.detail,'Branch: main');
  assert.equal(item.title,'Pushed code');
});
test('Unsafe repository names and invalid dates never become feed links', () => {
  for (const name of ['javascript:alert(1)','evil.test/../../secret','owner/repo?token=value','owner/repo"><script>','//evil.test/path']) assert.equal(eventDetails({repo:{name},created_at:'2026-10-05'}),null);
  assert.equal(eventDetails({repo:{name:'owner/repo'},created_at:'invalid'}),null);
  assert.equal(eventDetails(null),null);
});
test('Incomplete event payloads fall back to a repository link', () => {
  const item = eventDetails({type:'PushEvent',repo:{name:'owner/repo'},created_at:'2026-10-05',payload:{head:'not-a-sha'}});
  assert.equal(item.url,'https://github.com/owner/repo');
  assert.equal(item.detail,'Repository update');
});
test('All project share links have unique names and useful content', () => {
  const slugs = projects.map(project => project.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));
  assert.equal(new Set(slugs).size, projects.length);
  for (const project of projects) {
    for (const field of ['title','summary','role','stack','problem','contribution','decision','status']) assert.ok(project[field], `${project.title}: ${field}`);
    assert.match(project.link,/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/);
  }
});

test('Project descriptions follow the reviewed repository revisions', () => {
  const review = JSON.parse(readFileSync(new URL('./project-review.json', import.meta.url)));
  assert.equal(review.length, projects.length);
  for (const project of projects) {
    const source = review.find(item => 'https://github.com/' + item.repository === project.link);
    assert.equal(project.reviewedCommit, source?.commit, project.title);
    assert.ok(source.sources.length >= 3);
  }
  const cinema = projects.find(item => item.title === 'CinemaStream');
  assert.match(cinema.stack, /JavaScript/);
  assert.doesNotMatch(cinema.stack, /TypeScript|AsyncStorage/);
  assert.match(cinema.decision, /require an internet connection/);
  assert.equal(cinema.performance, undefined);
  const gatepilot = projects.find(item => item.title === 'GatePilot');
  assert.doesNotMatch(gatepilot.contribution, /staff QR|PDF report/);
  const cash = projects.find(item => item.title === 'CashManage');
  assert.equal(cash.imageKind, 'logo');
  assert.doesNotMatch(cash.contribution, /shared cashbook roles/);
});

test('GATEWAY group work and GatePilot retain their own repositories and attribution', () => {
  const gateway = projects.find(project => project.title === 'GATEWAY');
  const gatepilot = projects.find(project => project.title === 'GatePilot');
  assert.equal(gateway.link, 'https://github.com/chamikara12/GATEWAY');
  assert.match(gateway.type, /3\.1.*GROUP PROJECT/);
  assert.match(gateway.role, /Frontend and backend.*Group project/);
  assert.equal(gateway.imageKind, 'logo');
  assert.match(gateway.image, /gateway-symbol\.svg$/);
  assert.equal(gateway.evidence, undefined);
  assert.match(gateway.stack, /React · JavaScript/);
  assert.equal(gatepilot.link, 'https://github.com/vishnu-tharan/GatePilot');
  assert.match(gatepilot.stack, /React Native · Expo/);
  assert.ok(projects.every(project => !project.link.includes('GATEWAY-UniversityOfVavuniya')));
});
