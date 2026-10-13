const portrait = document.querySelector('.hero-portrait');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function resetCard() {
  portrait.style.setProperty('--card-rx', '0deg');
  portrait.style.setProperty('--card-ry', '0deg');
  portrait.style.setProperty('--light-x', '50%');
  portrait.style.setProperty('--light-y', '50%');
}
portrait.addEventListener('pointerleave', resetCard);
reduced.addEventListener('change', resetCard);
new MutationObserver(resetCard).observe(document.documentElement, {attributes:true,attributeFilter:['class']});
portrait.addEventListener('pointermove', event => {
  if (reduced.matches || document.documentElement.classList.contains('motion-paused') || event.pointerType !== 'mouse') return;
  const rect = portrait.getBoundingClientRect();
  const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
  const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
  portrait.style.setProperty('--card-rx', `${(-y * 12).toFixed(2)}deg`);
  portrait.style.setProperty('--card-ry', `${(x * 16).toFixed(2)}deg`);
  portrait.style.setProperty('--light-x', `${Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))}%`);
  portrait.style.setProperty('--light-y', `${Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100))}%`);
});

const hero = document.querySelector('.hero');
let scrollFrame = 0;
function paintScroll() {
  scrollFrame = 0;
  const stopped = reduced.matches || document.documentElement.classList.contains('motion-paused');
  const bounds = hero.getBoundingClientRect();
  const progress = stopped ? 0 : Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height * .7)));
  hero.style.setProperty('--portrait-scroll', progress.toFixed(3));
  hero.style.setProperty('--ghost-drift', `${(progress * 30).toFixed(2)}px`);
}
function queueScroll() { if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(paintScroll); }
window.addEventListener('scroll', queueScroll, {passive:true});
window.addEventListener('resize', queueScroll);
reduced.addEventListener('change', queueScroll);
new MutationObserver(queueScroll).observe(document.documentElement, {attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange', queueScroll);
queueScroll();
