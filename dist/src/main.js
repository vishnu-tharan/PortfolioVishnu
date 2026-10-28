import {
  renderProjectGallery,
  projectDetails,
  mountProjectScreenshots
} from './projects.js?v=20261029-cv-layout-v1';
import { projects } from './project-data.js?v=20261029-cv-layout-v1';
import './journey.js?v=20261029-cv-layout-v1';

// Project dialogs and shareable links.
const dialog = document.querySelector('.project-dialog');
const dialogContent = dialog.querySelector('.dialog-content');
let previousFocus = null;

function projectSlug(project) {
  return project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function openProject(project, updateURL = true, sourceButton = null) {
  previousFocus = sourceButton || document.activeElement;
  dialogContent.innerHTML = projectDetails(project);
  mountProjectScreenshots(dialog, project);

  if (!dialog.open) {
    dialog.showModal();
  }
  dialog.scrollTop = 0;
  document.body.classList.add('dialog-open');

  if (updateURL) {
    const url = `${location.pathname}${location.search}#project=${projectSlug(project)}`;
    history.replaceState(null, '', url);
  }
}

function openSharedProject() {
  if (!location.hash.startsWith('#project=')) {
    return;
  }
  const slug = location.hash.slice('#project='.length);
  const project = projects.find((project) => projectSlug(project) === slug);
  if (project) {
    openProject(project, false);
  }
}

function restoreProjectFocus() {
  document.body.classList.remove('dialog-open');
  if (location.hash.startsWith('#project=')) {
    history.replaceState(null, '', `${location.pathname}${location.search}#work`);
  }
  // Return keyboard users to the button that opened the dialog.
  if (previousFocus?.isConnected && previousFocus.getClientRects().length > 0) {
    previousFocus.focus({ preventScroll: true });
  }
}

async function copyProjectLink(event) {
  const button = event.target.closest('[data-copy-project]');
  if (!button) {
    return;
  }
  const status = dialog.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(location.href);
    if (!button.isConnected) {
      return;
    }
    button.textContent = '✓ Link copied';
    button.classList.add('copy-confirmed');
    status.textContent = 'Project link copied. You can paste it to share this case study.';
    setTimeout(() => {
      if (button.isConnected) {
        button.textContent = 'Copy project link';
        button.classList.remove('copy-confirmed');
      }
    }, 2500);
  } catch {
    if (status.isConnected) {
      status.textContent = 'Copy the link from the address bar to share this project.';
    }
  }
}

function closeOutsideDialog(event) {
  if (event.target !== dialog) {
    return;
  }
  const bounds = dialog.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;
  if (outside) {
    dialog.close();
  }
}

renderProjectGallery(document.querySelector('.project-grid'), projects, openProject);
window.addEventListener('hashchange', openSharedProject);
dialog.addEventListener('close', restoreProjectFocus);
dialog.addEventListener('click', copyProjectLink);
dialog.addEventListener('click', closeOutsideDialog);
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
openSharedProject();

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
