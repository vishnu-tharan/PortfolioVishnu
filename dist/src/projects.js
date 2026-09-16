// Custom project symbols in natural colors; card styling stays consistent.
const icons = {
 'Lanka Agri-Direct': '<path d="M32 49V30M17 51h30" stroke="#b5d66f"/><path d="M32 36C14 37 10 25 12 15c14-2 25 4 20 21Z" fill="#22a65b" stroke="#70e6a0"/><path d="M32 29c-2-13 6-20 20-19 1 13-6 23-20 19Z" fill="#67bb36" stroke="#b1ec76"/><path d="m19 23 13 13m12-17-12 10" stroke="#d4f7ad"/>',
 'University Gateway': '<path d="m9 23 23-13 23 13Z" fill="#3b82f6" stroke="#93c5fd"/><path d="M13 25h38M17 26v24m10-24v24m10-24v24m10-24v24M10 52h44" stroke="#93c5fd"/><path d="m25 39 6 5 11-12" stroke="#5eead4" stroke-width="3"/>',
 'cashManage': '<path d="M14 17v-3a4 4 0 0 1 4-4h29v7" fill="#9ade83" stroke="#d1f5aa"/><rect x="10" y="17" width="44" height="34" rx="7" fill="#13795b" stroke="#6ee7b7"/><path d="M54 29H40a6 6 0 0 0 0 12h14Z" fill="#e4b54b" stroke="#ffe08a"/><circle cx="41" cy="35" r="1.5" fill="#754513" stroke="#754513"/>',
 'CEB-Management': '<path d="m36 7-19 28h14l-3 22 20-30H34Z" fill="#fbbf24" stroke="#fef08a"/><path d="M14 13a26 26 0 0 0-7 19m43 19a26 26 0 0 0 7-19" stroke="#fb923c"/>',
 'CinemaStream': '<rect x="9" y="10" width="46" height="44" rx="9" fill="#6d28a8" stroke="#c4b5fd"/><path d="m28 24 14 8-14 8Z" fill="#f9a8d4" stroke="#fce7f3"/><path d="M10 19h44M19 10l6 9m7-9 6 9m7-9 6 9" stroke="#e9d5ff"/>'
};
const summaries = {
 'Lanka Agri-Direct': 'Connecting growers and consumers.',
 'University Gateway': 'Smarter access for a connected campus.',
 'cashManage': 'A clearer picture of everyday finances.',
 'CEB-Management': 'Understand usage. Plan your energy.',
 'CinemaStream': 'Discover your next favorite movie.'
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderProjectGallery(grid, projects, openProject) {
 grid.id = 'project-grid';
 const cards = projects.map((project, index) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'project-card reveal';
  card.style.setProperty('--project-delay', `${index * -.8}s`);
  card.setAttribute('aria-label', `Read about ${project.title}`);
  const icon = icons[project.title] || '<rect x="10" y="12" width="44" height="40" rx="8"/><path d="m26 25-8 7 8 7m12-14 8 7-8 7"/>';
  card.innerHTML = `<span class="project-topline"><span>PROJECT / ${String(index + 1).padStart(2, '0')}</span><span class="project-open" aria-hidden="true">↗</span></span><span class="project-emblem" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg></span><span class="project-copy"><span class="project-category">${escape(project.type)}</span><span class="project-name">${escape(project.title)}</span><span class="project-summary">${escape(summaries[project.title] || project.description)}</span></span><span class="project-stack">${project.stack.split(' · ').map(tech => `<span>${escape(tech)}</span>`).join('')}</span><span class="project-bottom">Explore project <span aria-hidden="true">↗</span></span>`;
  card.hidden = index >= 5;
  card.addEventListener('click', () => openProject(project));
  grid.append(card);
  return card;
 });
 const count = document.querySelector('.header a[href="#work"] sup');
 if (count) count.textContent = String(projects.length).padStart(2, '0');
 if (projects.length <= 5) return;
 const more = document.createElement('button');
 more.type = 'button'; more.className = 'projects-more';
 more.setAttribute('aria-controls', grid.id);
 let expanded = false;
 function update() {
  cards.forEach((card, index) => { card.hidden = !expanded && index >= 5; });
  more.setAttribute('aria-expanded', String(expanded));
  more.textContent = expanded ? 'Show fewer projects −' : `See more projects (${projects.length - 5}) +`;
 }
 more.addEventListener('click', () => { expanded = !expanded; update(); });
 update(); grid.after(more);
}
