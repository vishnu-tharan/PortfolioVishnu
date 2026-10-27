// Education content and year selection are kept together in this file.
const years = [
  {
    year: 2021,
    label: 'SCHOOL & UNIVERSITY SELECTION',
    title: 'Learning to lead.',
    body: 'Studied for my A/Ls at J/Uduppiddy American Mission College and served as Head Prefect. Selected for the B.Sc. in Information Technology at the University of Vavuniya.',
    skills: ['A/L studies', 'Head Prefect', 'B.Sc. IT selection']
  },
  {
    year: 2023,
    label: '2023–2024 / YEAR 1',
    title: 'IT foundations.',
    body: 'University of Vavuniya — studied programming fundamentals, computer architecture, mathematics for computing, and an introduction to web technologies.',
    skills: ['Programming with Java', 'Computer Systems', 'Web Development Basics']
  },
  {
    year: 2024,
    label: '2024–2025 / YEAR 2',
    title: 'Software & databases.',
    body: 'University of Vavuniya — focused on object-oriented programming, database management systems, data structures, and frontend development with modern tools.',
    skills: ['MySQL database systems', 'Data Structures & Algorithms', 'React & JavaScript']
  },
  {
    year: 2025,
    label: '2024–2025 / APPLIED LEARNING',
    title: 'Putting knowledge into practice.',
    body: 'Applied my Year 2 software and database studies through a Mini LMS project, alongside academic coursework and student activities at the University of Vavuniya.',
    skills: ['Mini LMS Project', 'Object-oriented programming', 'Frontend development']
  },
  {
    year: 2026,
    label: 'HONOURS PROGRAMME SELECTION',
    title: 'The next academic chapter.',
    body: 'Selected for the B.Sc. in Information Technology Honours degree programme at the University of Vavuniya. Continuing to develop my skills in software development and computing.',
    skills: ['B.Sc. IT Honours', 'University of Vavuniya']
  }
];

const yearRail = document.querySelector('.year-rail');
const yearStory = document.querySelector('.year-story');
const clockFace = document.querySelector('.clock-face');
const clockHand = document.querySelector('.clock-hand');
let selectedYearIndex = -1;

function pointClockAtSelectedYear() {
  const button = yearRail.children[selectedYearIndex];
  if (!button) {
    return;
  }
  const hub = clockFace.querySelector('b').getBoundingClientRect();
  const label = button.getBoundingClientRect();
  const horizontalDistance = label.left + label.width / 2 - (hub.left + hub.width / 2);
  const verticalDistance = label.top + label.height / 2 - (hub.top + hub.height / 2);
  // The clock hand starts pointing down. Convert the direction into degrees.
  const angle = (Math.atan2(-horizontalDistance, verticalDistance) * 180) / Math.PI;
  clockHand.style.transform = `rotate(${angle}deg)`;
}

function selectYear(index) {
  if (index === selectedYearIndex) {
    return;
  }
  selectedYearIndex = index;
  pointClockAtSelectedYear();
  for (let buttonIndex = 0; buttonIndex < yearRail.children.length; buttonIndex++) {
    yearRail.children[buttonIndex].setAttribute('aria-pressed', String(buttonIndex === index));
  }
  const year = years[index];
  const skills = year.skills.map((skill) => `<li>${skill}</li>`).join('');
  yearStory.innerHTML = `
    <span class="eyebrow">${year.year} / ${year.label}</span>
    <h3>${year.title}</h3>
    <p>${year.body}</p>
    <ul class="year-skills">${skills}</ul>
  `;
  document.querySelector('.clock-number').textContent = String(year.year).slice(-2);
}

function handleYearKey(event, index) {
  let nextIndex = index;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (index + 1) % years.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (index + years.length - 1) % years.length;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = years.length - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  yearRail.children[nextIndex].focus();
}

for (let index = 0; index < years.length; index++) {
  const button = document.createElement('button');
  button.className = 'year-button';
  button.textContent = years[index].year;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `Explore ${years[index].year}`);
  button.addEventListener('click', () => selectYear(index));
  button.addEventListener('focus', () => selectYear(index));
  button.addEventListener('keydown', (event) => handleYearKey(event, index));
  yearRail.append(button);
}

// On a mouse, select the year whose button is nearest to the pointer.
yearRail.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse') {
    return;
  }
  let nearestIndex = 0;
  let nearestDistance = Infinity;
  for (let index = 0; index < yearRail.children.length; index++) {
    const bounds = yearRail.children[index].getBoundingClientRect();
    const distance = Math.hypot(
      event.clientX - (bounds.left + bounds.width / 2),
      event.clientY - (bounds.top + bounds.height / 2)
    );
    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  }
  selectYear(nearestIndex);
});

selectYear(years.length - 1);
// Recalculate the hand when fonts or responsive layout change.
const clockLayout = new ResizeObserver(pointClockAtSelectedYear);
clockLayout.observe(yearRail);
clockLayout.observe(clockFace);
window.addEventListener('resize', pointClockAtSelectedYear);
document.fonts.ready.then(pointClockAtSelectedYear);
