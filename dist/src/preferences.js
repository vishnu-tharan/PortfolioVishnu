import { viewTransition } from './transitions.js';
const media = matchMedia('(prefers-color-scheme: dark)');
const storage = {
  get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch {} }
};
let appearance = storage.get('vishnuos-theme', 'dark');
if (!['light', 'dark', 'system'].includes(appearance)) appearance = 'system';
export function setTheme(value, origin) {
  if (!['light', 'dark', 'system'].includes(value)) return;
  appearance = value;
  storage.set('vishnuos-theme', value);
  viewTransition(syncTheme, {origin});
}
export function toggleTheme(origin) {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', origin);
}
function syncTheme() {
  const theme = appearance === 'system' ? (media.matches ? 'dark' : 'light') : appearance;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#090909' : '#faf7f5');
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    button.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === appearance)));
  document.dispatchEvent(new CustomEvent('portfolio:themechange', {detail:theme}));
}
media.addEventListener('change', syncTheme);
document.addEventListener('click', event => {
  const toggle = event.target.closest('[data-theme-toggle]');
  if (toggle) toggleTheme(toggle);
  const choice = event.target.closest('[data-theme-choice]');
  if (choice) setTheme(choice.dataset.themeChoice, choice);
});
syncTheme();
