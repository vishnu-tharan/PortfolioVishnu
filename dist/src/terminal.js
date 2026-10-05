// A small portfolio command panel. Commands never execute system code.
export function mountTerminal(container, actions) {
  container.innerHTML = `<div class="terminal-output" id="terminal-output" role="log" aria-label="Terminal output" aria-live="polite"></div><form class="terminal-form"><label for="terminal-input">vishnu@portfolio:~$</label><input id="terminal-input" autocomplete="off" spellcheck="false" aria-label="Terminal command" placeholder="help"><button type="submit">Run</button></form><div class="terminal-suggestions" role="group" aria-label="Suggested commands"><button type="button" data-command="help" aria-label="Insert command help">help</button><button type="button" data-command="projects" aria-label="Insert command projects">projects</button><button type="button" data-command="skills" aria-label="Insert command skills">skills</button><button type="button" data-command="search React" aria-label="Insert command search React">search React</button></div><p class="terminal-hint">Pick a suggestion, then Run · ↑ ↓ history · Esc to close<br>Portfolio commands only</p>`;
  const output = container.querySelector('.terminal-output');
  const input = container.querySelector('input');
  container.querySelector('.terminal-suggestions').addEventListener('click', event => {
    const command = event.target.closest('[data-command]')?.dataset.command;
    if (!command) return;
    input.value = command;
    input.focus({preventScroll:true});
    input.setSelectionRange(command.length, command.length);
  });
  const history = [];
  let position = 0;
  const sections = [
    {name:'Education & journey', keywords:'education university vavuniya honours degree academic', hash:'#beyond'},
    {name:'Certifications', keywords:'certificate certifications cisco javascript sololearn sql', hash:'#beyond'},
    {name:'Community & competitions', keywords:'community leadership ieee aiesec ieeextreme volunteering', hash:'#beyond'},
    {name:'Technical skills', keywords:'skills languages tools frontend backend mobile database', hash:'#universe'},
    {name:'GitHub activity', keywords:'github tracker activity repositories commits', hash:'#activity'},
    {name:'Contact', keywords:'contact email phone linkedin internship remote sri lanka', hash:'#contact'}
  ];
  function write(text, command = false) {
    const line = document.createElement('p');
    line.textContent = text;
    if (command) line.className = 'terminal-command';
    output.append(line);
    if (output.children.length > 100) output.firstChild.remove();
    output.scrollTop = output.scrollHeight;
  }
  write('Welcome to VishnuOS. A little terminal in my portfolio.\nType help to see what you can do.');
  container.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const raw = input.value.trim().slice(0, 200);
    if (!raw) return;
    history.push(raw); position = history.length;
    input.value = '';
    write(`$ ${raw}`, true);
    const [command, ...parts] = raw.toLowerCase().split(/\s+/);
    const argument = parts.join(' ');
    switch (command) {
      case 'help': write('help                 Show commands\nabout                Meet Vishnu\nprojects             List projects\nopen <project>       Open a case study\nsearch <text>        Find projects & technologies\nskills               View my toolkit\ncontact              Contact details\ncv                   Open my CV\ngithub               Open the activity section\ntheme dark|light|system\nsound on|off         Control click sounds\nclear                Clear this terminal\nexit                 Close VishnuOS'); break;
      case 'about': write('Vishnutharan Bavachelvan\nIT honours undergraduate — University of Vavuniya.\nBuilding web & mobile applications. Open to software development internships in Sri Lanka and remotely.'); break;
      case 'projects': write(actions.projects.map(item => `${item.title} — ${item.stack}`).join('\n')); break;
      case 'open': {
        if (!argument) { write('Usage: open <project name>'); break; }
        const destinations = {about:'#beyond',education:'#beyond',skills:'#universe',contact:'#contact',github:'#activity',projects:'#work'};
        if (destinations[argument]) { actions.close(); location.hash = destinations[argument]; break; }
        if (argument === 'cv') { actions.close(); location.href = './cv.html'; break; }
        const matches = actions.projects.filter(item => item.title.toLowerCase().includes(argument));
        if (matches.length === 1) actions.openProject(matches[0]);
        else write(matches.length ? `Be more specific: ${matches.map(item => item.title).join(', ')}` : `No project found for “${argument}”. Try projects.`);
        break;
      }
      case 'search': {
        if (!argument) { write('Usage: search <project, technology or topic>'); break; }
        const terms = argument.split(/\s+/);
        const matches = actions.projects.filter(item => terms.every(term => [item.title,item.stack,item.summary,item.problem,item.contribution].join(' ').toLowerCase().includes(term)));
        const pages = sections.filter(item => terms.every(term => `${item.name} ${item.keywords}`.toLowerCase().includes(term)));
        const lines = [...matches.map(item => `${item.title} — ${item.stack}`), ...pages.map(item => `${item.name} — ${item.hash}`)];
        write(lines.length ? lines.join('\n') : `No matches for “${argument}”. Try projects, education or skills.`);
        break;
      }
      case 'skills': write('Frontend: React, Next.js, React Native, Expo, HTML, CSS\nBackend: Spring Boot, Node.js, Express\nData: PostgreSQL, MongoDB, MySQL, SQLite, Firebase\nLanguages & tools: Java, JavaScript, TypeScript, Python, C/C++, SQL, Git, Docker, Vercel'); break;
      case 'contact': write('Email: bavachelvanvishnutharan@gmail.com\nPhone: +94 77 364 6391\nLinkedIn: linkedin.com/in/vishnutharan-bavachelvan-5419a02b3/'); break;
      case 'cv': actions.close(); location.href = './cv.html'; break;
      case 'github': actions.close(); location.hash = '#activity'; break;
      case 'theme':
        if (['light','dark','system'].includes(argument)) { actions.setTheme(argument); write(`Appearance: ${argument}`); }
        else write('Usage: theme dark | light | system');
        break;
      case 'sound':
        if (['on','off'].includes(argument)) { document.dispatchEvent(new CustomEvent('vishnuos:sound', {detail:argument === 'on'})); write(`Click sounds: ${argument}`); }
        else write('Usage: sound on | off');
        break;
      case 'clear': output.replaceChildren(); break;
      case 'exit': actions.close(); break;
      default: write(`Unknown command “${command}”. Type help.`);
    }
    if (container.isConnected && input.isConnected) input.focus();
  });
  input.addEventListener('keydown', event => {
    if (!['ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    position = Math.max(0, Math.min(history.length, position + (event.key === 'ArrowUp' ? -1 : 1)));
    input.value = history[position] || '';
  });
  input.focus();
}
