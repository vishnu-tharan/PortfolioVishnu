import { projects } from './project-data.js';
import { setTheme, toggleTheme } from './preferences.js';
import { mountTerminal } from './terminal.js';

export const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const slug = project => project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dialog = document.querySelector('#app-dialog');
const content = document.querySelector('#app-content');
let lastFocus;
let toastTimer;
export function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3000);
}
function closeWindow() { dialog.close(); }
export function showWindow(title, html, app = 'project') {
  const wasOpen = dialog.open;
  if (wasOpen) dialog.close();
  if (!wasOpen) lastFocus = document.activeElement;
  dialog.dataset.app = app;
  document.querySelector('#app-title').textContent = title;
  content.innerHTML = html;
  if (app === 'terminal') dialog.show();
  else { dialog.showModal(); document.body.classList.add('modal-open'); }
  dialog.scrollTop = 0;
}
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
  if (location.hash.startsWith('#project=')) history.replaceState(null, '', `${location.pathname}${location.search}#work`);
  if (!document.querySelector('dialog[open]')) lastFocus?.focus({preventScroll:true});
});
dialog.querySelector('.dialog-close').addEventListener('click', closeWindow);
dialog.addEventListener('click', event => {
  if (event.target !== dialog || dialog.dataset.app === 'terminal') return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeWindow();
});

export function openProject(project, updateURL = true) {
  const sections = [['The problem', project.problem], ['My contribution', project.contribution], ['Technical approach', project.decision], ['Testing & verification', project.testing]];
  showWindow(project.title, `<p class="eyebrow">${escape(project.type)}</p><h3>${escape(project.title)}</h3><p class="dialog-tech">${escape(project.stack)}</p>${project.image ? `<figure class="project-detail-image"><img src="${escape(project.image)}" alt="${escape(project.imageAlt)}"><figcaption>${escape(project.caption)}</figcaption></figure>` : ''}<div class="case-study">${sections.filter(([, text]) => text).map(([title, text]) => `<section><h4>${title}</h4><p>${escape(text)}</p></section>`).join('')}</div><p class="project-status">${escape(project.status)}</p><div class="project-links"><a href="${escape(project.link)}" target="_blank" rel="noopener noreferrer">View repository</a>${project.evidence ? `<a href="${escape(project.evidence)}" target="_blank" rel="noopener noreferrer">Verification notes</a>` : ''}<button type="button" id="copy-project-link">Copy project link</button></div>`);
  if (updateURL) history.replaceState(null, '', `${location.pathname}${location.search}#project=${slug(project)}`);
  document.querySelector('#copy-project-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); toast('Project link copied'); }
    catch { toast('Copy the project link from your address bar'); }
  });
}
function category(project) {
  const categories = ['web'];
  if (/React Native/.test(project.stack)) categories.push('mobile');
  if (/GROUP/.test(project.type)) categories.push('team');
  if (/MOVIE/.test(project.type)) return ['mobile'];
  return categories;
}
const marks = [['B','blue'],['G','purple'],['cM','green'],['ag','green'],['kWh','amber'],['C','pink']];
const grid = document.querySelector('#project-grid');
grid.innerHTML = projects.map((project, index) => `<article class="project-card" data-project="${index}" data-categories="${category(project).join(' ')}">${project.image ? `<button class="project-preview" type="button" data-open-project="${index}" aria-label="View ${escape(project.title)} details"><img src="${escape(project.image)}" alt="${escape(project.imageAlt)}" width="1280" height="800" loading="lazy" decoding="async"><span class="preview-label">${index === 2 ? 'Guest dashboard · local build' : 'Sign-in · project screenshot'}</span></button>` : `<div class="project-mark"><span class="app-icon ${marks[index][1]}" aria-hidden="true">${marks[index][0]}</span><span>${escape(project.type.split(' / ')[0].toLowerCase())}</span></div>`}<div class="project-body"><p class="eyebrow">${escape(project.type)}</p><h3>${escape(project.title)}</h3><p>${escape(project.summary)}</p><p class="project-role"><strong>My role:</strong> ${escape(project.role)}</p><div class="project-stack">${project.stack.split(' · ').map(tech => `<span>${escape(tech)}</span>`).join('')}</div><div class="project-links"><button type="button" data-open-project="${index}">Read case study</button><a href="${escape(project.link)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(project.title)} on GitHub">GitHub</a></div></div></article>`).join('');
document.addEventListener('click', event => {
  const projectButton = event.target.closest('[data-open-project]');
  if (projectButton) openProject(projects[Number(projectButton.dataset.openProject)]);
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    let count = 0;
    grid.querySelectorAll('[data-project]').forEach(card => {
      card.hidden = filter.dataset.filter !== 'all' && !card.dataset.categories.split(' ').includes(filter.dataset.filter);
      if (!card.hidden) count++;
    });
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
    document.querySelector('#project-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
  }
  if (event.target.closest('[data-app="terminal"]')) openTerminal();
});
function handleRoute() {
  if (!location.hash.startsWith('#project=')) return;
  const project = projects.find(item => slug(item) === location.hash.slice(9));
  if (project) openProject(project, false);
}
window.addEventListener('hashchange', handleRoute);
handleRoute();

export function openTerminal() {
  if (dialog.open && dialog.dataset.app === 'terminal') { closeWindow(); return; }
  showWindow('VishnuOS / terminal', '', 'terminal');
  mountTerminal(content, {projects, openProject, setTheme, toggleTheme, close: closeWindow});
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog.open && dialog.dataset.app === 'terminal') closeWindow();
});
function updateClock() {
  const now = new Date();
  const clock = document.querySelector('#clock');
  clock.textContent = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Colombo', hour:'2-digit', minute:'2-digit'}).format(now) + ' LK';
  clock.dateTime = now.toISOString();
}
updateClock();
setInterval(updateClock, 30000);
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
