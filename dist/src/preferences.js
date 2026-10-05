const media = matchMedia('(prefers-color-scheme: dark)');
const storage = {
  get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch {} }
};
let appearance = storage.get('vishnuos-theme', 'system');
if (!['light', 'dark', 'system'].includes(appearance)) appearance = 'system';
export function setTheme(value) {
  if (!['light', 'dark', 'system'].includes(value)) return;
  appearance = value;
  storage.set('vishnuos-theme', value);
  syncTheme();
}
export function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}
function syncTheme() {
  const theme = appearance === 'system' ? (media.matches ? 'dark' : 'light') : appearance;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101018' : '#f2f3f8');
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    button.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === appearance)));
}
media.addEventListener('change', syncTheme);
document.addEventListener('click', event => {
  if (event.target.closest('[data-theme-toggle]')) toggleTheme();
  const choice = event.target.closest('[data-theme-choice]');
  if (choice) setTheme(choice.dataset.themeChoice);
});
syncTheme();
