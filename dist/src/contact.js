export function buildContactEmail({name, email, topic, message}) {
  const subject = `Portfolio enquiry: ${topic}`;
  const body = `Hi Vishnu,\n\n${message.trim()}\n\nFrom: ${name.trim()}\nReply to: ${email.trim()}`;
  return `mailto:bavachelvanvishnutharan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
const form = document.querySelector('#contact-form');
if (form) {
  document.querySelector('#prepare-email').disabled = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of [form.elements.name, form.elements.message]) {
      field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
    }
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    window.location.href = buildContactEmail(values);
    document.querySelector('#contact-status').textContent = 'Your email app has been requested. Send the message there to contact me. If nothing opens, use the email or phone link below.';
  });
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
}
