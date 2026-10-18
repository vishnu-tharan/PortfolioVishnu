// Optional shortcuts keep the full project gallery available without JavaScript.
const grid = document.querySelector('.project-grid');
const filters = document.querySelector('.project-filters');
if (grid && filters) {
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const selected = button.dataset.filter;
    let count = 0;
    for (const card of grid.children) {
      const text = card.textContent;
      const match = selected === 'all' ||
        (selected === 'mobile' && /React Native|Expo|mobile interfaces/i.test(text)) ||
        (selected === 'team' && /group project|team-built/i.test(text)) ||
        (selected === 'web' && /Next.js|React|HTML|web/i.test(text));
      card.hidden = !match;
      if (match) { card.classList.add('visible'); count++; }
    }
    filters.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#filter-status').textContent = `${count} projects shown`;
  });
}
document.querySelector('[data-copy-email]')?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-email-status');
  const email = document.querySelector('.contact-methods a[href^="mailto:"]') || document.querySelector('a[href^="mailto:"]');
  try {
    await navigator.clipboard.writeText(email.getAttribute('href').slice(7));
    status.textContent = 'Email copied.';
  } catch { status.textContent = 'Please select and copy the email address above.'; }
});
