const title = document.querySelector('#hero-title');
const area = document.querySelector('.hero-word');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
let pending = 0;
let pointer = null;
function reset() { pointer = null; title.style.translate = '0px 0px'; }
function paint() {
  pending = 0;
  if (!pointer || reduced.matches || !fine.matches || document.documentElement.classList.contains('motion-paused')) return reset();
  const box = area.getBoundingClientRect();
  const dx = pointer.x - (box.left + box.width / 2);
  const dy = pointer.y - (box.top + box.height / 2);
  const nx = dx / Math.max(1, box.width / 2);
  const ny = dy / Math.max(1, box.height / 2);
  const strength = Math.max(0, 1 - Math.min(1, Math.hypot(nx, ny) / 1.4));
  const distance = Math.hypot(dx, dy) || 1;
  title.style.translate = `${(-dx / distance * 22 * strength).toFixed(2)}px ${(-dy / distance * 16 * strength).toFixed(2)}px`;
}
area.addEventListener('pointermove', event => { if (event.pointerType !== 'mouse') return; pointer = {x:event.clientX,y:event.clientY}; if (!pending) pending = requestAnimationFrame(paint); });
area.addEventListener('pointerleave', reset);
window.addEventListener('scroll', reset, {passive:true});
window.addEventListener('blur', reset);
reduced.addEventListener('change', reset);
fine.addEventListener('change', reset);
new MutationObserver(reset).observe(document.documentElement, {attributes:true,attributeFilter:['class']});
