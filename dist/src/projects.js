// Escape text before placing project data in an HTML string.
export function escape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function safeProjectURL(value, image = false) {
  if (typeof value !== 'string') {
    return '#';
  }
  if (image) {
    const localImage = /^\.\/assets\/[A-Za-z0-9_/-]+\.(?:png|jpe?g|webp|svg)$/;
    return localImage.test(value) ? value : '#';
  }
  const githubLink =
    /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+(?:[\/#][A-Za-z0-9_./#-]*)?$/;
  if (!githubLink.test(value) || value.split('/').includes('..')) {
    return '#';
  }
  return escape(value);
}

function previewClass(project) {
  if (project.imageKind === 'logo') {
    return ' logo-preview';
  }
  if (project.imageLayout === 'page') {
    return ' page-preview';
  }
  return '';
}

function screenshotOptions(project) {
  if (!project.screenshots?.length) {
    return '';
  }
  let buttons = '';
  for (let index = 0; index < project.screenshots.length; index++) {
    const screenshot = project.screenshots[index];
    buttons += `
      <button type="button" data-screenshot="${index}" aria-pressed="${index === 0}">
        <span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        ${escape(screenshot.label)}
      </button>`;
  }
  return `
    <div class="screenshot-gallery" role="group" aria-label="Project screenshots">
      <div class="screenshot-heading">
        <h3>Explore the screens</h3>
        <span class="screenshot-count" role="status">1 / ${project.screenshots.length}</span>
      </div>
      <div class="screenshot-options">${buttons}</div>
      <p>Choose a screen. Select the image to view its full size.</p>
    </div>`;
}

function detailImage(project) {
  if (!project.image) {
    return '';
  }
  const imageURL = safeProjectURL(project.image, true);
  return `
    <figure class="project-detail-image${previewClass(project)}">
      <a class="screenshot-original" href="${imageURL}" target="_blank"
        rel="noopener noreferrer" aria-label="Open full-size project image">
        <img src="${imageURL}" alt="${escape(project.imageAlt)}">
      </a>
      <figcaption>${escape(project.caption)}</figcaption>
    </figure>`;
}

function caseStudySections(project) {
  const sections = [
    ['The problem', project.problem],
    ['My contribution', project.contribution],
    ['Technical approach', project.decision],
    ['Testing & verification', project.testing],
    ['Performance notes', project.performance]
  ];
  let html = '';
  for (const [title, text] of sections) {
    if (text) {
      html += `<section><h3>${title}</h3><p>${escape(text)}</p></section>`;
    }
  }
  return html;
}

function externalLink(url, label) {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function detailLinks(project) {
  let links = externalLink(safeProjectURL(project.link), 'View repository ↗');
  if (project.evidence) {
    links += externalLink(safeProjectURL(project.evidence), 'Verification notes ↗');
  }
  if (project.image) {
    const label = project.imageKind === 'logo' ? 'View symbol ↗' : 'Full screenshot ↗';
    links += externalLink(safeProjectURL(project.image, true), label);
  }
  if (project.performanceEvidence) {
    links += externalLink(safeProjectURL(project.performanceEvidence), 'Performance measurements');
  }
  return links;
}

export function projectDetails(project) {
  return `
    <span class="eyebrow accent">${escape(project.type)}</span>
    <h2 id="dialog-title">${escape(project.title)}</h2>
    <p class="dialog-tech">${escape(project.stack)}</p>
    ${screenshotOptions(project)}
    ${detailImage(project)}
    <div class="case-study">${caseStudySections(project)}</div>
    <p class="project-status">${escape(project.status)}</p>
    <div class="project-links">
      ${detailLinks(project)}
      <button type="button" class="project-details" data-copy-project>Copy project link</button>
    </div>
    <p class="copy-status" role="status"></p>`;
}

export function mountProjectScreenshots(dialog, project) {
  const gallery = dialog.querySelector('.screenshot-gallery');
  if (!gallery) return;
  gallery.addEventListener('click', (event) => {
    const button = event.target.closest('[data-screenshot]');
    if (!button) return;
    const index = Number(button.dataset.screenshot);
    const shot = project.screenshots?.[index];
    if (!shot) return;
    const url = safeProjectURL(shot.src, true);
    const figure = dialog.querySelector('.project-detail-image');
    const img = figure.querySelector('img');
    img.src = url;
    img.alt = shot.alt;
    figure.querySelector('a').href = url;
    figure.querySelector('figcaption').textContent = shot.caption;
    dialog.querySelectorAll('.project-links a').forEach((link) => {
      if (link.textContent.includes('Full screenshot')) link.href = url;
    });
    gallery
      .querySelectorAll('[data-screenshot]')
      .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    gallery.querySelector('.screenshot-count').textContent =
      `${index + 1} / ${project.screenshots.length} · ${shot.label}`;
  });
}

function cardPreview(project) {
  if (!project.image) {
    return '';
  }
  const kind = project.imageKind === 'logo' ? 'symbol' : 'screenshot';
  const label = project.imageKind === 'logo' ? 'Project symbol' : 'View screenshot';
  return `
    <button class="project-preview${previewClass(project)}" type="button"
      aria-label="View ${escape(project.title)} ${kind} and details">
      <img src="${safeProjectURL(project.image, true)}" alt="${escape(project.imageAlt)}"
        loading="lazy" decoding="async" width="1280" height="800">
      <span>${label}</span>
    </button>`;
}

export function renderProjectGallery(grid, projects, openProject) {
  grid.id = 'project-grid';
  for (const project of projects) {
    const card = document.createElement('article');
    card.className = 'project-card reveal';
    if (project.image) {
      card.classList.add('featured-project');
    }
    let technologies = '';
    for (const technology of project.stack.split(' · ')) {
      technologies += `<span>${escape(technology)}</span>`;
    }
    card.innerHTML = `
      ${cardPreview(project)}
      <div class="project-body">
        <p class="project-category">${escape(project.type)}</p>
        <h3>${escape(project.title)}</h3>
        <p class="project-summary">${escape(project.summary)}</p>
        <p class="project-role"><strong>My role</strong> ${escape(project.role)}</p>
        <div class="project-stack">${technologies}</div>
        <div class="project-links">
          <button type="button" class="project-details" aria-label="Read about ${escape(project.title)}">
            Read case study <span aria-hidden="true">↗</span>
          </button>
          <a href="${safeProjectURL(project.link)}" target="_blank" rel="noopener noreferrer"
            aria-label="${escape(project.title)} repository on GitHub">GitHub ↗</a>
        </div>
      </div>`;
    for (const button of card.querySelectorAll('button')) {
      button.addEventListener('click', () => openProject(project, true, button));
    }
    grid.append(card);
  }
  const count = document.querySelector('.header a[href="#work"] sup');
  if (count) {
    count.textContent = String(projects.length).padStart(2, '0');
  }
}
