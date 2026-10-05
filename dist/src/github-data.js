// Validate cached public data and build links only to GitHub repositories.
export function validSnapshot(value, username = 'vishnu-tharan', now = Date.now()) {
  return Boolean(value && Number.isFinite(value.time) && value.time >= 0 && value.time <= now + 60000 && typeof value.user?.login === 'string' && value.user.login.toLowerCase() === username && ['public_repos','followers','following'].every(key => Number.isInteger(value.user[key]) && value.user[key] >= 0) && Array.isArray(value.events));
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
