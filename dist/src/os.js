import { projects } from './project-data.js?v=20261006-cv-v1';
import { escape } from './projects.js?v=20261006-cv-v1';
import { openProject as openPortfolioProject } from './main.js?v=20261006-cv-v1';
import { setTheme, toggleTheme } from './preferences.js?v=20261006-cv-v1';
import { mountTerminal } from './terminal.js?v=20261006-cv-v1';
import { motionAllowed } from './transitions.js?v=20261006-cv-v1';
export { escape };
const dialog = document.querySelector('#app-dialog');
let previousFocus, toastTimer;
export function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message; element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3000);
}
export function openProject(project) {
  if (dialog.open) dialog.close();
  openPortfolioProject(project);
}
export function openTerminal() {
  if (dialog.open) { dialog.close(); return; }
  const projectDialog = document.querySelector('.project-dialog');
  if (projectDialog.open) projectDialog.close();
  previousFocus = document.activeElement;
  dialog.show();
  mountTerminal(document.querySelector('#app-content'), {projects, openProject, setTheme, toggleTheme, close:() => dialog.close()});
  if (motionAllowed()) dialog.animate?.([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:200,easing:'ease-out'});
}
dialog.querySelector('[data-close-terminal]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) previousFocus?.focus({preventScroll:true}); });
document.addEventListener('click', event => { if (event.target.closest('button[data-app="terminal"]')) openTerminal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && dialog.open && !document.querySelector('#search-dialog').open) dialog.close(); });
