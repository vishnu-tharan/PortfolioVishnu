const portrait = document.querySelector('.hero-portrait');
const button = document.querySelector('.portrait-toggle');
const cutout = document.querySelector('.portrait-cutout');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let pinned = false;
let hovering = false;
function update() {
  portrait.classList.toggle('code-active', pinned || hovering);
  button.setAttribute('aria-pressed', String(pinned));
  button.textContent = pinned ? 'Show original photo ↙' : 'Reveal code & glow ↗';
}
let maskLoaded = false;
function ready() { if (maskLoaded && cutout.naturalWidth) { button.disabled = false; portrait.classList.add('effect-ready'); } }
const mask = new Image();
mask.addEventListener('load', () => { maskLoaded = true; ready(); });
cutout.addEventListener('load', ready);
mask.src = new URL('../assets/vishnu-mask.png', import.meta.url).href;
portrait.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && !button.disabled) { hovering = true; update(); } });
portrait.addEventListener('pointerleave', () => { hovering = false; portrait.style.setProperty('--light-x', '50%'); portrait.style.setProperty('--light-y', '50%'); update(); });
portrait.addEventListener('pointermove', event => {
  if (reduced.matches || event.pointerType !== 'mouse') return;
  const rect = portrait.getBoundingClientRect();
  portrait.style.setProperty('--light-x', `${Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))}%`);
  portrait.style.setProperty('--light-y', `${Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100))}%`);
});
button.addEventListener('click', () => { pinned = !pinned; hovering = false; update(); });
portrait.addEventListener('keydown', event => { if (event.key === 'Escape') { pinned = false; hovering = false; update(); } });
