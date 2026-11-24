import './journey.js?v=projects-timeline';

// Reveal content once when it enters the screen. Decorations stay still.
document.documentElement.classList.add('motion-paused');
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);
for (const element of document.querySelectorAll('.reveal')) {
  revealObserver.observe(element);
}
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
