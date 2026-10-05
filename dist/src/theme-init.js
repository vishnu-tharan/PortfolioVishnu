// Apply saved appearance before the page paints. Storage is optional.
(() => {
  let theme = 'system';
  try { theme = localStorage.getItem('vishnuos-theme') || 'system'; } catch {}
  if (!['light', 'dark', 'system'].includes(theme)) theme = 'system';
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();
