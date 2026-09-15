const portrait = document.querySelector('.hero-portrait');
const button = document.querySelector('.portrait-toggle');
const cutout = document.querySelector('.portrait-cutout');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let pinned = false; // Original-photo view is an explicit toggle.
let hovering = false;
function update() {
  portrait.classList.toggle('original-view', pinned);
  portrait.classList.toggle('code-active', !pinned && hovering);
  button.setAttribute('aria-pressed', String(pinned));
  button.textContent = pinned ? 'Back to cinematic portrait ↙' : 'Show original photo ↗';
}
let maskLoaded = false;
function ready() { if (maskLoaded && cutout.naturalWidth) { button.disabled = false; portrait.classList.add('effect-ready'); document.querySelector('.hero').classList.add('portrait-ready'); update(); } }
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

const hero = document.querySelector('.hero');
let scrollFrame = 0;
function paintScroll() {
  scrollFrame = 0;
  const stopped = reduced.matches || document.documentElement.classList.contains('motion-paused');
  const bounds = hero.getBoundingClientRect();
  const progress = stopped ? 0 : Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height * .7)));
  hero.style.setProperty('--portrait-scroll', progress.toFixed(3));
  hero.style.setProperty('--tie-lift', `${(progress * -9).toFixed(2)}px`);
  hero.style.setProperty('--tie-scale', (1 + progress * .035).toFixed(3));
  hero.style.setProperty('--ghost-drift', `${(progress * 30).toFixed(2)}px`);
}
function queueScroll() { if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(paintScroll); }
window.addEventListener('scroll', queueScroll, {passive:true});
window.addEventListener('resize', queueScroll);
reduced.addEventListener('change', queueScroll);
new MutationObserver(queueScroll).observe(document.documentElement, {attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange', queueScroll);
queueScroll();
