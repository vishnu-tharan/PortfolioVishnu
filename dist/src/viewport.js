// Keep fixed controls and dialogs within the visible area on mobile keyboards.
let frame = 0;
function updateViewport() {
  frame = 0;
  const viewport = window.visualViewport;
  const height = Math.max(160, viewport?.height || window.innerHeight);
  const keyboard = viewport && viewport.scale === 1 ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
  document.documentElement.style.setProperty('--usable-height', `${Math.round(height)}px`);
  document.documentElement.style.setProperty('--keyboard-inset', `${Math.round(keyboard)}px`);
  const header = document.querySelector('.header');
  if (header) document.documentElement.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
}
function queueViewport() { if (!frame) frame = requestAnimationFrame(updateViewport); }
window.addEventListener('resize', queueViewport, {passive:true});
window.visualViewport?.addEventListener('resize', queueViewport, {passive:true});
window.visualViewport?.addEventListener('scroll', queueViewport, {passive:true});
document.addEventListener('visibilitychange', queueViewport);
const header = document.querySelector('.header');
if (header && window.ResizeObserver) new ResizeObserver(queueViewport).observe(header);
updateViewport();
