const person = document.querySelector('.beyond-person');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
function resetPerson() {
 person.style.setProperty('--person-rx', '0deg');
 person.style.setProperty('--person-ry', '0deg');
}
if (person) {
 person.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !finePointer.matches || reduced.matches || document.documentElement.classList.contains('motion-paused')) return;
  const rect = person.getBoundingClientRect();
  const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
  const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
  person.style.setProperty('--person-rx', `${(-y * 8).toFixed(2)}deg`);
  person.style.setProperty('--person-ry', `${(x * 16).toFixed(2)}deg`);
 });
 person.addEventListener('pointerleave', resetPerson);
 reduced.addEventListener('change', resetPerson);
 finePointer.addEventListener('change', resetPerson);
 new MutationObserver(resetPerson).observe(document.documentElement, {attributes:true,attributeFilter:['class']});
}
