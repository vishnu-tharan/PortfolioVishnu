document.querySelector('[data-copy-email]')?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-email-status');
  const email =
    document.querySelector('.contact-methods a[href^="mailto:"]') ||
    document.querySelector('a[href^="mailto:"]');
  try {
    await navigator.clipboard.writeText(email.getAttribute('href').slice(7));
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Please select and copy the email address above.';
  }
});
