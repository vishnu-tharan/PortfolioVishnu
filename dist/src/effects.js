const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
const header = document.querySelector('.header');
const links = [...document.querySelectorAll('.header a[href^="#"]')];
const sections = [...document.querySelectorAll('#home,#work,#universe,#journey,#beyond,#contact')];
let navigationFrame = 0;
function paintNavigation() {
  navigationFrame = 0;
  const extent = document.documentElement.scrollHeight - innerHeight;
  const fraction = extent > 0 ? Math.max(0, Math.min(1, scrollY / extent)) : 0;
  progress.style.transform = `scaleX(${fraction})`;
  const line = (header?.getBoundingClientRect().bottom || 0) + Math.max(24, (innerHeight - (header?.offsetHeight || 0)) * .2);
  let current = 'home';
  for (const section of sections) if (section.getBoundingClientRect().top <= line) current = section.id;
  // The education link covers the journey and education details together.
  if (current === 'journey') current = 'beyond';
  if (fraction >= .995 && extent > 0) current = 'contact';
  links.forEach(link => {
    if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function queueNavigation() { if (!navigationFrame) navigationFrame = requestAnimationFrame(paintNavigation); }
window.addEventListener('scroll', queueNavigation, {passive:true});
window.addEventListener('resize', queueNavigation, {passive:true});
window.addEventListener('pageshow', queueNavigation);
document.addEventListener('portfolio:themechange', queueNavigation);
if (window.ResizeObserver) new ResizeObserver(queueNavigation).observe(document.querySelector('main'));
queueNavigation();
