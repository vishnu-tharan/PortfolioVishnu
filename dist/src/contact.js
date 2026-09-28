// Author: vishnu-tharan. Native submission retains FormSubmit's spam verification.
const form = document.querySelector('#contact-form');
if (form) {
 const status = document.querySelector('#contact-status');
 form.addEventListener('submit', event => {
  for (const field of [form.elements.name, form.elements.message]) {
   field.value = field.value.trim();
   field.setCustomValidity(field.value ? '' : 'Please complete this field.');
  }
  if (!form.reportValidity()) { event.preventDefault(); return; }
  if (form.elements._honey.value) { event.preventDefault(); return; }
  form.elements._subject.value = `Portfolio enquiry: ${form.elements.topic.value}`;
  status.textContent = 'Opening secure submission. Complete any verification shown to send your message.';
 });
 form.addEventListener('input', event => { event.target.setCustomValidity?.(''); status.textContent = ''; });
 window.addEventListener('pageshow', () => { status.textContent = ''; });
}
