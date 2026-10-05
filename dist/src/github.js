import { escape } from './os.js';

const username = 'vishnu-tharan';
const cacheKey = 'vishnuos-github-v1';
const status = document.querySelector('#github-status');
const badge = document.querySelector('#github-badge');
const refresh = document.querySelector('#refresh-github');
const feed = document.querySelector('#github-feed');
let snapshot;
let busy = false;
let lastAttempt = 0;
let retryAt = 0;
let pollInterval = 5 * 60 * 1000;
try {
  const saved = JSON.parse(localStorage.getItem(cacheKey) || 'null');
  if (validSnapshot(saved)) snapshot = saved;
} catch {}

export function validSnapshot(value) {
  return value && Number.isFinite(value.time) && value.time <= Date.now() + 60000 && value.user?.login?.toLowerCase() === username && ['public_repos','followers','following'].every(key => Number.isInteger(value.user[key]) && value.user[key] >= 0) && Array.isArray(value.events);
}
export function eventDetails(event) {
  const repo = event?.repo?.name;
  if (typeof repo !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return null;
  const created = new Date(event.created_at);
  if (!Number.isFinite(created.getTime())) return null;
  const ref = String(event.payload?.ref || '').replace('refs/heads/', '');
  const types = {
    PushEvent:['Pushed code', ref ? `Branch: ${ref}` : 'Repository update', '>_'],
    CreateEvent:['Created ' + String(event.payload?.ref_type || 'resource'), ref || 'New repository resource', '+'],
    PullRequestEvent:['Pull request ' + String(event.payload?.action || 'updated'), event.payload?.pull_request?.title || 'Pull request update', '⑂'],
    IssuesEvent:['Issue ' + String(event.payload?.action || 'updated'), event.payload?.issue?.title || 'Issue update', '◉'],
    IssueCommentEvent:['Commented on an issue', event.payload?.issue?.title || 'Discussion update', '≡'],
    WatchEvent:['Starred a repository', 'Public repository', '☆'],
    ForkEvent:['Forked a repository', 'Public repository', '⑂'],
    ReleaseEvent:['Published a release', event.payload?.release?.name || 'Release update', '◇']
  };
  const [title, detail, icon] = types[event.type] || ['Repository activity', String(event.type || 'Public event').replace(/Event$/, ''), '·'];
  const head = event.payload?.head;
  const url = event.type === 'PushEvent' && /^[a-f0-9]{40}$/i.test(head || '') ? `https://github.com/${repo}/commit/${head}` : `https://github.com/${repo}`;
  return {repo, created, title, detail:String(detail), icon, url};
}
function relativeTime(date) {
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
function render(cached) {
  if (!snapshot) return;
  document.querySelector('#github-summary').innerHTML = [['public_repos','Public repositories'],['followers','Followers'],['following','Following']].map(([key,label]) => `<div><strong>${snapshot.user[key].toLocaleString()}</strong><span>${label}</span></div>`).join('');
  const items = snapshot.events.map(eventDetails).filter(Boolean).slice(0, 6);
  feed.innerHTML = items.length ? items.map(item => `<article class="feed-item"><span class="feed-icon" aria-hidden="true">${escape(item.icon)}</span><div><p>${escape(item.title)} · <a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.repo.split('/')[1])}</a></p><small>${escape(item.detail)}</small></div><time datetime="${item.created.toISOString()}" title="${escape(item.created.toLocaleString())}">${relativeTime(item.created)}</time></article>`).join('') : '<p class="feed-status">No recent public events returned by GitHub. Explore the repositories on my profile.</p>';
  const time = new Date(snapshot.time);
  document.querySelector('#github-updated').textContent = `${cached ? 'Saved snapshot' : 'Updated'} · ${new Intl.DateTimeFormat('en-GB', {dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Colombo'}).format(time)} LK`;
  badge.textContent = cached ? 'Saved data' : 'Connected';
  status.textContent = cached ? 'Showing a saved snapshot while checking GitHub.' : 'Latest available public activity from GitHub.';
}
async function get(path, controller) {
  const response = await fetch(`https://api.github.com/users/${username}${path}`, {signal:controller.signal, headers:{Accept:'application/vnd.github+json'}});
  const wait = Number(response.headers.get('X-Poll-Interval'));
  if (Number.isFinite(wait) && wait > 0) pollInterval = Math.max(300000, wait * 1000);
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      const reset = Number(response.headers.get('X-RateLimit-Reset')) * 1000;
      const after = Number(response.headers.get('Retry-After')) * 1000;
      retryAt = Math.max(Date.now() + 300000, Number.isFinite(reset) ? reset + 5000 : 0, Number.isFinite(after) ? Date.now() + after : 0);
      throw new Error('GitHub has temporarily limited requests. Try again later or open my GitHub profile.');
    }
    throw new Error('GitHub is unavailable right now. Try again later or open my GitHub profile.');
  }
  return response.json();
}
export async function loadGitHub(manual = false) {
  if (busy || document.hidden) return;
  if (Date.now() < retryAt) { status.textContent = 'GitHub request limit reached. Refresh will be available later; the profile link still works.'; return; }
  if (Date.now() - lastAttempt < 60000) {
    if (manual) status.textContent = 'Please wait a minute between refreshes.';
    return;
  }
  busy = true; lastAttempt = Date.now(); refresh.disabled = true; badge.textContent = 'Updating';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const [user, events] = await Promise.all([get('', controller), get('/events/public?per_page=30', controller)]);
    const next = {user:{login:user.login, public_repos:user.public_repos, followers:user.followers, following:user.following},events,time:Date.now()};
    if (!validSnapshot(next)) throw new Error('GitHub returned unexpected data. Please open the profile directly.');
    snapshot = next;
    try { localStorage.setItem(cacheKey, JSON.stringify(snapshot)); } catch {}
    render(false);
  } catch (error) {
    if (snapshot) render(true);
    else badge.textContent = 'Unavailable';
    status.textContent = (error.name === 'AbortError' ? 'GitHub took too long to respond. Try again later.' : error.message) + (snapshot ? ' The saved snapshot is shown below.' : '');
  } finally {
    controller.abort(); clearTimeout(timeout); busy = false; refresh.disabled = false;
  }
}
if (snapshot) render(true);
if (!snapshot || Date.now() - snapshot.time > pollInterval) loadGitHub();
else { render(false); status.textContent = 'Recent saved snapshot. Checking GitHub automatically when the next refresh is due.'; }
refresh.addEventListener('click', () => loadGitHub(true));
setInterval(() => { if (Date.now() - (snapshot?.time || lastAttempt) >= pollInterval) loadGitHub(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - (snapshot?.time || lastAttempt) >= pollInterval) loadGitHub(); });
