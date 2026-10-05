import { toast } from './os.js?v=20261006-effects-v1';

let enabled = false;
let context;
let lastPlayed = 0;
try { enabled = localStorage.getItem('vishnuos-sound') === 'on'; } catch {}
function sync() {
  document.querySelectorAll('[data-sound-toggle]').forEach(button => {
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', `Turn click sounds ${enabled ? 'off' : 'on'}`);
    button.title = `Click sounds ${enabled ? 'on' : 'off'}`;
    button.querySelector('.sound-state')?.replaceChildren(enabled ? 'on' : 'off');
  });
}
export function setSound(value) {
  enabled = Boolean(value);
  try { localStorage.setItem('vishnuos-sound', enabled ? 'on' : 'off'); } catch {}
  sync();
}
async function playClick() {
  if (!enabled || document.hidden || Date.now() - lastPlayed < 80) return;
  lastPlayed = Date.now();
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('Audio unavailable');
    context ??= new Audio();
    if (context.state === 'suspended') await context.resume();
    if (context.state !== 'running' || !enabled) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(650, now);
    oscillator.frequency.exponentialRampToValueAtTime(330, now + .045);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.035, now + .004);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .055);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(now); oscillator.stop(now + .06);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  } catch {
    setSound(false);
    toast('Sounds are unavailable in this browser');
  }
}
document.addEventListener('click', event => {
  if (!event.isTrusted) return;
  if (event.target.closest('[data-sound-toggle]')) { setSound(!enabled); toast(`Click sounds ${enabled ? 'on' : 'off'}`); }
  if (event.target.closest('a, button, select')) playClick();
});
document.addEventListener('vishnuos:sound', event => { setSound(event.detail); if (enabled) playClick(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && context?.state === 'running') context.suspend().catch(() => {}); });
sync();
