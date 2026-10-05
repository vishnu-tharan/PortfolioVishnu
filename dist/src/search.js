import { projects } from './project-data.js?v=20261006-effects-v1';
import { escape, openProject, openTerminal } from './os.js?v=20261006-effects-v1';

const dialog = document.querySelector('#search-dialog');
const input = document.querySelector('#os-search');
const results = document.querySelector('#search-results');
let selected = 0;
let matches = [];
let previousFocus;
const entries = [
  ...projects.map(project => ({title:project.title, description:project.summary, keywords:[project.stack, project.type, project.role, project.problem, project.contribution].join(' '), type:'Project', icon:'▦', action:() => openProject(project)})),
  {title:'Technical skills',description:'Frontend, mobile, backend, databases, languages & tools',keywords:'React Next.js Spring Boot Java Python SQL Docker Git Firebase TypeScript',type:'Section',icon:'</>',action:() => navigate('#universe')},
  {title:'Education & journey',description:'B.Sc. (Hons) IT · University of Vavuniya · 2023–Present',keywords:'honours university degree academic coursework database algorithms',type:'Section',icon:'◈',action:() => navigate('#beyond')},
  {title:'Certifications',description:'Cisco JavaScript Essentials 1 & 2 · Sololearn SQL',keywords:'certificate networking academy learning',type:'Section',icon:'≡',action:() => navigate('#beyond')},
  {title:'Community & competitions',description:'IEEE, AIESEC, IEEEXtreme, volunteering & leadership',keywords:'TheChiefs JamporIEEE camera club hackathon team',type:'Section',icon:'✳',action:() => navigate('#beyond')},
  {title:'GitHub activity',description:'Latest available public updates from @vishnu-tharan',keywords:'repositories commits contributions tracker github feed',type:'Section',icon:'◉',action:() => navigate('#activity')},
  {title:'Contact Vishnu',description:'Internships, collaborations, email & LinkedIn',keywords:'phone email Sri Lanka remote opportunities contact',type:'Section',icon:'@',action:() => navigate('#contact')},
  {title:'View CV',description:'Read my CV or download the PDF',keywords:'resume curriculum vitae experience',type:'Page',icon:'≡',action:() => { location.href = './cv.html'; }},
  {title:'VishnuOS terminal',description:'Try help, projects, search or theme dark',keywords:'cmd command line help terminal shell os',type:'Feature',icon:'>_',action:openTerminal}
];
function navigate(hash) {
  if (location.hash === hash) document.querySelector(hash)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  else location.hash = hash;
}
function render() {
  const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  matches = entries.filter(entry => terms.every(term => `${entry.title} ${entry.description} ${entry.keywords}`.toLowerCase().includes(term)));
  selected = 0;
  results.innerHTML = matches.length ? matches.map((entry, index) => `<button class="search-result${index === 0 ? ' is-selected' : ''}" type="button" data-result="${index}"><span class="result-icon" aria-hidden="true">${escape(entry.icon)}</span><span><strong>${escape(entry.title)}</strong><small>${escape(entry.description)}</small></span><span class="result-type">${entry.type}</span></button>`).join('') : '<p class="empty-search">No matches. Try a project name, React, education or CV.</p>';
  document.querySelector('#search-count').textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`;
}
function open() {
  if (dialog.open) return;
  previousFocus = document.activeElement;
  // Keep a small non-modal terminal from sitting above the search surface.
  const app = document.querySelector('#app-dialog');
  if (app.open) app.close();
  const projectDialog = document.querySelector('.project-dialog');
  if (projectDialog.open) projectDialog.close();
  input.value = '';
  render();
  dialog.showModal();
  document.body.classList.add('modal-open');
  input.focus();
}
function selectResult(index) {
  if (!matches[index]) return;
  dialog.close();
  matches[index].action();
}
function highlight(index) {
  if (!matches.length) return;
  selected = (index + matches.length) % matches.length;
  const buttons = [...results.querySelectorAll('button')];
  buttons.forEach((button, i) => button.classList.toggle('is-selected', i === selected));
  buttons[selected]?.scrollIntoView({block:'nearest'});
}
input.addEventListener('input', render);
input.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); highlight(selected + (event.key === 'ArrowDown' ? 1 : -1)); }
  if (event.key === 'Enter') { event.preventDefault(); selectResult(selected); }
});
results.addEventListener('click', event => {
  const button = event.target.closest('[data-result]');
  if (button) selectResult(Number(button.dataset.result));
});
results.addEventListener('focusin', event => {
  const button = event.target.closest('[data-result]');
  if (button) highlight(Number(button.dataset.result));
});
document.addEventListener('click', event => {
  if (event.target.closest('[data-search]')) open();
  if (event.target.closest('[data-close-search]')) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (document.querySelector('#app-dialog').open || document.querySelector('.project-dialog').open) return;
  previousFocus?.focus({preventScroll:true});
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
document.addEventListener('keydown', event => {
  const typing = event.target.matches('input, textarea, select, [contenteditable="true"]');
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
  else if (event.key === '/' && !typing && !document.querySelector('dialog[open]')) { event.preventDefault(); open(); }
});
