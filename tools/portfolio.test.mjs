import test from 'node:test';
import assert from 'node:assert/strict';
import { validSnapshot, eventDetails } from '../dist/src/github-data.js';
import { projects } from '../dist/src/project-data.js';

const now = Date.now();
const valid = {time:now,user:{login:'vishnu-tharan',public_repos:12,followers:1,following:1},events:[]};
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
