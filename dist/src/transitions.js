// Enhance interactions without making animation a requirement.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let active;
export function motionAllowed() {
  return !reduced.matches && !document.hidden && !document.documentElement.classList.contains('motion-paused');
}
export function viewTransition(update, {kind = 'theme', origin, prepare = () => {}, cleanup = () => {}} = {}) {
  active?.skipTransition();
  if (!motionAllowed() || !document.startViewTransition) { update(); return; }
  const root = document.documentElement;
  const rect = origin?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : innerHeight / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty('--transition-x', `${x}px`);
  root.style.setProperty('--transition-y', `${y}px`);
  root.style.setProperty('--transition-radius', `${radius}px`);
  root.dataset.transition = kind;
  let updated = false;
  const change = () => { updated = true; update(); };
  try {
    prepare();
    const transition = document.startViewTransition(change);
    active = transition;
    transition.ready.catch(() => {});
    transition.finished.catch(() => {}).finally(() => {
      cleanup();
      if (active === transition) { active = undefined; delete root.dataset.transition; }
    });
  } catch {
    cleanup();
    delete root.dataset.transition;
    if (!updated) change();
  }
}
function stopMotion() { if (!motionAllowed()) active?.skipTransition(); }
reduced.addEventListener('change', stopMotion);
new MutationObserver(stopMotion).observe(document.documentElement, {attributes:true, attributeFilter:['class']});
document.addEventListener('visibilitychange', stopMotion);
