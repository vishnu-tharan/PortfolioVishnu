// Author: vishnu-tharan
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Restrict data-driven destinations before interpolating them into markup.
export function safeProjectURL(value, image = false) {
 if (typeof value !== 'string') return '#';
 if (image) return /^\.\/assets\/[A-Za-z0-9_/-]+\.(?:png|jpe?g|webp|svg)$/.test(value) ? value : '#';
 return /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+(?:[\/#][A-Za-z0-9_./#-]*)?$/.test(value) && !value.split('/').includes('..') ? escape(value) : '#';
}
export function projectDetails(project) {
 const pagePreview = project.imageKind === 'logo' ? ' logo-preview' : project.imageLayout === 'page' ? ' page-preview' : '';
 const sections = [['The problem', project.problem], ['My contribution', project.contribution], ['Technical approach', project.decision], ['Testing & verification', project.testing], ['Performance notes', project.performance]];
 return `<span class="eyebrow accent">${escape(project.type)}</span><h2 id="dialog-title">${escape(project.title)}</h2><p class="dialog-tech">${escape(project.stack)}</p>
 ${project.screenshots?.length ? `<div class="screenshot-gallery" role="group" aria-label="Project screenshots"><div class="screenshot-heading"><h3>Explore the screens</h3><span class="screenshot-count" role="status">1 / ${project.screenshots.length}</span></div><div class="screenshot-options">${project.screenshots.map((shot,index) => `<button type="button" data-screenshot="${index}" aria-pressed="${index === 0}"><span aria-hidden="true">${String(index + 1).padStart(2,'0')}</span> ${escape(shot.label)}</button>`).join('')}</div><p>Choose a screen. Select the image to view its full size.</p></div>` : ''}
 ${project.image ? `<figure class="project-detail-image${pagePreview}"><a class="screenshot-original" href="${safeProjectURL(project.image, true)}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size project image"><img src="${safeProjectURL(project.image, true)}" alt="${escape(project.imageAlt)}"></a><figcaption>${escape(project.caption)}</figcaption></figure>` : ''}
 <div class="case-study">${sections.filter(([,text]) => text).map(([title,text]) => `<section><h3>${title}</h3><p>${escape(text)}</p></section>`).join('')}</div>
 <p class="project-status">${escape(project.status)}</p><div class="project-links"><a href="${safeProjectURL(project.link)}" target="_blank" rel="noopener noreferrer">View repository ↗</a>${project.evidence ? `<a href="${safeProjectURL(project.evidence)}" target="_blank" rel="noopener noreferrer">Verification notes ↗</a>` : ''}${project.image ? `<a href="${safeProjectURL(project.image, true)}" target="_blank" rel="noopener noreferrer">${project.imageKind === 'logo' ? 'View symbol' : 'Full screenshot'} ↗</a>` : ''}${project.performanceEvidence ? `<a href="${safeProjectURL(project.performanceEvidence)}" target="_blank" rel="noopener noreferrer">Performance measurements</a>` : ''}<button type="button" class="project-details" data-copy-project>Copy project link</button></div><p class="copy-status" role="status"></p>`;
}

export function mountProjectScreenshots(dialog, project) {
 const gallery = dialog.querySelector('.screenshot-gallery');
 if (!gallery) return;
 gallery.addEventListener('click', event => {
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
  dialog.querySelectorAll('.project-links a').forEach(link => {
   if (link.textContent.includes('Full screenshot')) link.href = url;
  });
  gallery.querySelectorAll('[data-screenshot]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  gallery.querySelector('.screenshot-count').textContent = `${index + 1} / ${project.screenshots.length} · ${shot.label}`;
 });
}
export function renderProjectGallery(grid, projects, openProject) {
 grid.id = 'project-grid';
 projects.forEach(project => {
  const card = document.createElement('article');
  card.className = `project-card reveal${project.image ? ' featured-project' : ''}`;
  const pagePreview = project.imageKind === 'logo' ? ' logo-preview' : project.imageLayout === 'page' ? ' page-preview' : '';
  card.innerHTML = `${project.image ? `<button class="project-preview${pagePreview}" type="button" aria-label="View ${escape(project.title)} ${project.imageKind === 'logo' ? 'symbol' : 'screenshot'} and details"><img src="${safeProjectURL(project.image, true)}" alt="${escape(project.imageAlt)}" loading="lazy" decoding="async" width="1280" height="800"><span>${project.imageKind === 'logo' ? 'Project symbol' : 'View screenshot'}</span></button>` : ''}
  <div class="project-body"><p class="project-category">${escape(project.type)}</p><h3>${escape(project.title)}</h3><p class="project-summary">${escape(project.summary)}</p><p class="project-role"><strong>My role</strong> ${escape(project.role)}</p>
  <div class="project-stack">${project.stack.split(' · ').map(tech => `<span>${escape(tech)}</span>`).join('')}</div>
  <div class="project-links"><button type="button" class="project-details" aria-label="Read about ${escape(project.title)}">Read case study <span aria-hidden="true">↗</span></button><a href="${safeProjectURL(project.link)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(project.title)} repository on GitHub">GitHub ↗</a></div></div>`;
  card.querySelectorAll('button').forEach(button => button.addEventListener('click', event => openProject(project, true, event.currentTarget)));
  grid.append(card);
 });
 const count = document.querySelector('.header a[href="#work"] sup');
 if (count) count.textContent = String(projects.length).padStart(2, '0');
}

