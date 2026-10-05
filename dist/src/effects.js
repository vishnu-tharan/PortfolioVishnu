import { motionAllowed } from './transitions.js';

const grid = document.querySelector('.project-grid');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
let spotlight, pointer, spotlightFrame = 0;
function resetSpotlight() {
  cancelAnimationFrame(spotlightFrame); spotlightFrame = 0;
  spotlight?.classList.remove('spotlight-active');
  spotlight = undefined; pointer = undefined;
}
grid?.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !fine.matches || !motionAllowed()) return resetSpotlight();
  const card = event.target.closest('.project-card');
  if (!card) return resetSpotlight();
  if (spotlight !== card) { resetSpotlight(); spotlight = card; }
  pointer = {x:event.clientX, y:event.clientY};
  if (spotlightFrame) return;
  spotlightFrame = requestAnimationFrame(() => {
    spotlightFrame = 0;
    if (!spotlight || !pointer) return;
    const rect = spotlight.getBoundingClientRect();
    spotlight.style.setProperty('--spot-x', `${pointer.x - rect.left}px`);
    spotlight.style.setProperty('--spot-y', `${pointer.y - rect.top}px`);
    spotlight.classList.add('spotlight-active');
  });
});
grid?.addEventListener('pointerleave', resetSpotlight);
grid?.addEventListener('pointercancel', resetSpotlight);
window.addEventListener('scroll', resetSpotlight, {passive:true});
fine.addEventListener('change', resetSpotlight);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', resetSpotlight);
new MutationObserver(() => { if (!motionAllowed()) resetSpotlight(); }).observe(document.documentElement, {attributes:true, attributeFilter:['class']});
document.addEventListener('visibilitychange', resetSpotlight);
