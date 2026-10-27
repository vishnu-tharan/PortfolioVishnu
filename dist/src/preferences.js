// Keep the same storage key so returning visitors keep their chosen theme.
const storageKey = 'vishnuos-theme';
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let savedTheme = 'dark';

try {
  savedTheme = localStorage.getItem(storageKey) || 'dark';
} catch {
  // The toggle still works when browser storage is unavailable.
}
if (!['light', 'dark', 'system'].includes(savedTheme)) {
  savedTheme = 'system';
}

function applyTheme() {
  let theme = savedTheme;
  if (theme === 'system') {
    theme = systemTheme.matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    const color = theme === 'dark' ? '#090909' : '#faf7f5';
    themeColor.setAttribute('content', color);
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  for (const button of document.querySelectorAll('[data-theme-toggle]')) {
    button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    button.setAttribute('title', `Switch to ${nextTheme} mode`);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  document.dispatchEvent(new CustomEvent('portfolio:themechange', { detail: theme }));
}

function toggleTheme() {
  savedTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem(storageKey, savedTheme);
  } catch {
    // Saving is optional; apply the theme for this visit anyway.
  }
  applyTheme();
}

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-theme-toggle]')) {
    toggleTheme();
  }
});
systemTheme.addEventListener('change', applyTheme);
applyTheme();
