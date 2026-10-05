// Author: vishnu-tharan
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function projectDetails(project) {
 const sections = [['The problem', project.problem], ['My contribution', project.contribution], ['Technical approach', project.decision], ['Testing & verification', project.testing], ['Performance notes', project.performance]];
 return `<span class="eyebrow accent">${escape(project.type)}</span><h2 id="dialog-title">${escape(project.title)}</h2><p class="dialog-tech">${escape(project.stack)}</p>
 ${project.image ? `<figure class="project-detail-image"><img src="${project.image}" alt="${escape(project.imageAlt)}"><figcaption>${escape(project.caption)}</figcaption></figure>` : ''}
 <div class="case-study">${sections.filter(([,text]) => text).map(([title,text]) => `<section><h3>${title}</h3><p>${escape(text)}</p></section>`).join('')}</div>
 <p class="project-status">${escape(project.status)}</p><div class="project-links"><a href="${project.link}" target="_blank" rel="noopener noreferrer">View repository ↗</a>${project.evidence ? `<a href="${project.evidence}" target="_blank" rel="noopener noreferrer">Verification notes ↗</a>` : ''}${project.image ? `<a href="${project.image}" target="_blank" rel="noopener noreferrer">Full screenshot ↗</a>` : ''}${project.performanceEvidence ? `<a href="${escape(project.performanceEvidence)}" target="_blank" rel="noopener noreferrer">Performance measurements</a>` : ''}<button type="button" class="project-details" data-copy-project>Copy project link</button></div>`;
}
export function renderProjectGallery(grid, projects, openProject) {
 grid.id = 'project-grid';
 projects.forEach(project => {
  const card = document.createElement('article');
  card.className = `project-card reveal${project.image ? ' featured-project' : ''}`;
  card.innerHTML = `${project.image ? `<button class="project-preview" type="button" aria-label="View ${escape(project.title)} screenshot and details"><img src="${project.image}" alt="${escape(project.imageAlt)}" loading="lazy" decoding="async" width="1280" height="800"><span>View project</span></button>` : ''}
  <div class="project-body"><p class="project-category">${escape(project.type)}</p><h3>${escape(project.title)}</h3><p class="project-summary">${escape(project.summary)}</p><p class="project-role"><strong>My role</strong> ${escape(project.role)}</p>
  <div class="project-stack">${project.stack.split(' · ').map(tech => `<span>${escape(tech)}</span>`).join('')}</div>
  <div class="project-links"><button type="button" class="project-details" aria-label="Read about ${escape(project.title)}">Read case study <span aria-hidden="true">↗</span></button><a href="${project.link}" target="_blank" rel="noopener noreferrer" aria-label="${escape(project.title)} repository on GitHub">GitHub ↗</a></div></div>`;
  card.querySelectorAll('button').forEach(button => button.addEventListener('click', () => openProject(project)));
  grid.append(card);
 });
 const count = document.querySelector('.header a[href="#work"] sup');
 if (count) count.textContent = String(projects.length).padStart(2, '0');
}

