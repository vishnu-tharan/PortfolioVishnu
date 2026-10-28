import { projectScreenshots } from './project-screenshots.js?v=20261028-ceb-v1';
// Current descriptions are limited to implemented screens and routes.
export const projects = [
  {
    title: 'Buyora',
    type: 'E-COMMERCE / FULL-STACK',
    stack: 'Next.js · Spring Boot · PostgreSQL · Docker',
    summary:
      'An LKR-priced shop with product filters, saved favourites, guest checkout and order management.',
    role: 'Full-stack development',
    image: './assets/projects/buyora-desktop-home.png',
    imageLayout: 'contain',
    imageAlt: 'Buyora — storefront screen',
    caption: 'Storefront · Guest session · sample catalog and illustrative LKR prices',
    link: 'https://github.com/vishnu-tharan/Buyora',
    problem:
      'Connect product discovery, local delivery, checkout and after-sales support with reliable store administration.',
    contribution:
      'Built product discovery, saved favourites, guest and account carts, cash-on-delivery checkout and order tracking. Developed admin screens for products, stock, orders, reviews and store settings.',
    decision:
      'Next.js calls Spring Boot services backed directly by PostgreSQL. Transactional checkout reserves stock, calculates totals on the server and uses an idempotency key to prevent duplicate orders.',
    testing:
      'The repository includes frontend component tests and backend tests for authentication, stock, checkout totals, duplicate submissions, payment callbacks and refunds. Integration tests use disposable PostgreSQL databases.',
    status:
      'Local Docker development setup · cash on delivery · PayHere sandbox requires configuration',
    evidence:
      'https://github.com/vishnu-tharan/Buyora/blob/2b71f8e3484a9fec1f51a184dfe78f2a945f7c46/README.md#checks',
    imageKind: 'screenshot',
    reviewedCommit: '2b71f8e3484a9fec1f51a184dfe78f2a945f7c46'
  },
  {
    title: 'GATEWAY',
    image: './assets/projects/gateway-symbol.svg',
    imageKind: 'logo',
    imageAlt: 'Gate symbol representing the GATEWAY project',
    caption: 'Portfolio gate symbol · represents vehicle access management',
    type: 'SEMESTER 3.1 / GROUP PROJECT',
    stack: 'React · JavaScript · Node.js · Express · MongoDB',
    summary:
      'Our semester 3.1 group project for university vehicle entries, exits and gate passes.',
    role: 'Frontend and backend development · Group project',
    link: 'https://github.com/chamikara12/GATEWAY',
    problem:
      'Bring university vehicle entries, exits and gate-pass records into one web application.',
    contribution:
      'Contributed frontend and backend development to our group project. The active React application shows separate admin and security dashboards, with screens for vehicle movements and gate passes.',
    decision:
      'React dashboards call Express controllers and MongoDB models for vehicle and gate-pass records. The current src/App.jsx selects the dashboard using the signed-in user role.',
    status: 'Semester 3.1 academic group project · frontend and backend contribution',
    testing: '',
    reviewedCommit: 'fc205a40ccc97571adcf53ad0e60bb35f5cc7de0'
  },
  {
    title: 'GatePilot',
    image: './assets/projects/gatepilot-02-dashboard.png',
    imageAlt: 'GatePilot — dashboard screen',
    caption: 'Dashboard · Isolated demo · fictional Sample Campus records',
    type: 'ACCESS MANAGEMENT / WEB & MOBILE',
    stack: 'React Native · Expo · Express · MongoDB · Docker',
    summary:
      'A gate-management prototype with vehicle entry and exit, equipment approvals and searchable visit records.',
    role: 'Full-stack development',
    link: 'https://github.com/vishnu-tharan/GatePilot',
    problem:
      'Coordinate vehicle arrivals, equipment decisions and departures across configurable gates and departments.',
    contribution:
      'Built vehicle arrivals and departures with recorded gates and times, equipment approval, rejection and resubmission. Added searchable records with status and gate filters, pagination and dashboard counts. Developed account management, profile and password changes, and organization settings.',
    decision:
      'React Native and Expo provide the responsive interface. Express and MongoDB support three roles: gate officer, department administrator and organization administrator. The API checks department access and equipment approval before departure; conditional updates prevent duplicate approvals and exits.',
    testing:
      'The repository includes tests for sign-in, sessions, permissions, concurrent vehicle updates and approval workflows, plus frontend pagination tests. Build scripts export web, Android and iOS bundles; these exports are not signed native installers or physical-device tests.',
    status: 'Independent development prototype · fictional Sample Campus demo · responsive web screenshots',
    evidence:
      'https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/README.md#checks',
    imageKind: 'screenshot',
    imageLayout: 'contain',
    reviewedCommit: '94f5c069dad296877cd321bdfa54275ed7b95ba6'
  },
  {
    title: 'CashManage',
    type: 'PERSONAL FINANCE / PWA',
    stack: 'React · JavaScript · Vite · Express · SQLite · PWA',
    summary: 'A personal cashbook for income, expenses, budgets, transfers and reports.',
    role: 'Full-stack development',
    image: './assets/projects/cashmanage-current-icon.png',
    imageAlt: 'CashManage application icon from the current repository',
    caption:
      'Current CashManage application icon · the repository has no current interface screenshots',
    link: 'https://github.com/vishnu-tharan/CashManage',
    problem:
      'Bring income, expenses, debts and savings into currency-specific cashbooks that remain usable offline.',
    contribution:
      'Built cashbooks, transaction tracking, budgets, debt and savings forms, CSV import and reports. Added receipt attachments, encrypted backup download/restore and account settings.',
    decision:
      'React and Vite provide the interface; Express and SQLite handle accounts and saved vaults. The workspace hook manages local encrypted storage and synchronization. Reports use CSV export and the browser Print / Save as PDF action.',
    testing:
      'The repository contains client tests and server security tests. Account-security routes and the settings interface are present in the current code.',
    status: 'Personal finance development app · records transactions without processing payments',
    evidence:
      'https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/README.md#checks',
    imageKind: 'logo',
    imageLayout: 'contain',
    reviewedCommit: '6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa'
  },
  {
    title: 'Lanka Agri-Direct',
    image: './assets/projects/agri-symbol.svg',
    imageKind: 'logo',
    imageAlt: 'Leaf symbol representing Lanka Agri-Direct',
    caption: 'Portfolio leaf symbol · represents the produce-directory group project',
    type: 'GROUP PROJECT / TEAM MEMBER',
    stack: 'Spring Boot · React · React Native · MongoDB · Docker',
    summary:
      'A group project for browsing produce listings and finding verified Sri Lankan producers.',
    role: 'Frontend, design and API testing',
    link: 'https://github.com/dragon-udfly/LankaAgriDirect',
    problem:
      'Help buyers discover local produce and contact verified growers directly, with producer listings and administrative review.',
    contribution:
      'Contributed frontend development, interface design and API integration testing. The project has React Native buyer/producer screens and React admin screens for producer and product management.',
    decision:
      'Mobile screens call Spring Boot product and producer endpoints backed by MongoDB. Buyers can browse listings and save bookmarks locally; producers manage listings and sold-out status, while administrators review registrations.',
    testing: '',
    status: 'Academic group project · frontend, design and API-testing contribution',
    reviewedCommit: '3142c15f1bd36017185cc24028f51849991e82ee'
  },
  {
    title: 'CEB-Management',
    image: './assets/projects/ceb-management-dashboard-desktop.jpg',
    imageKind: 'screenshot',
    imageAlt: 'CEB-Management — dashboard screen',
    caption: 'Dashboard · Temporary example household · illustrative estimates and readings',
    type: 'HOUSEHOLD ELECTRICITY TRACKER',
    stack: 'JavaScript · HTML · CSS · Node.js · Express · SQLite · Docker',
    summary:
      'A household electricity tracker with appliance management, meter-based usage forecasts, bill estimates and actual bill history.',
    role: 'Web application development',
    link: 'https://github.com/vishnu-tharan/CEB-Management',
    problem:
      'Explain household electricity use by separating appliance estimates, meter measurements and actual saved bills.',
    contribution:
      'Built appliance editing, search and room filters, dated meter readings, usage charts, an itemised bill estimator and actual monthly bill history. Added registration, sign-in, recovery-code access, profile and password changes across eight responsive screens with light and dark themes.',
    decision:
      'An Express server serves the JavaScript interface and a SQLite-backed API with user-scoped records. Usage forecasts use a day-weighted average of recent meter intervals, falling back to appliance estimates when readings are insufficient. The bill calculator uses a dated 30-day tariff snapshot; saved actual bills are entered separately.',
    status: 'Independent student project · dated tariff estimates · no live utility integration',
    imageLayout: 'contain',
    testing:
      'The repository includes tests for tariff boundaries, usage calculations, household data isolation, reading chronology, account recovery and database migration. An optional browser suite covers the eight screens, household workflows and responsive themes.',
    evidence:
      'https://github.com/vishnu-tharan/CEB-Management/blob/e708d978a9b13e72d0b193a38bfc11095c44fa61/README.md#verify',
    reviewedCommit: 'e708d978a9b13e72d0b193a38bfc11095c44fa61'
  },
  {
    title: 'CinemaStream',
    image: './assets/projects/cinemastream-movies.jpg',
    imageAlt: 'CinemaStream — movie discovery screen',
    caption: 'Movie discovery · Current web prototype · online accounts and collections',
    type: 'MOVIE DISCOVERY / MOBILE & WEB',
    stack: 'JavaScript · React Native · Expo Router · Firebase · Firestore',
    summary: 'A movie catalog with search, genre filters, trailers and personal collections.',
    role: 'Mobile and web application development',
    link: 'https://github.com/vishnu-tharan/CinemaStream',
    problem:
      'Let guests discover films while signed-in users manage their own favourites, watchlist and watched movies.',
    contribution:
      'Built movie discovery, search, genre filtering and film-detail screens with trailer links. Added guest browsing, account access and favourites/watchlist/watched controls.',
    decision:
      'React Native screens use Expo Router. Firebase handles account access, and Firestore stores the signed-in account’s movie collection. Collection reads and writes require an internet connection.',
    testing:
      'The repository includes JavaScript helper tests, catalog checks and Firestore permission tests. Its export script builds the web app.',
    status: 'Movie-discovery prototype · online account collections · trailer links',
    evidence:
      'https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/README.md#check',
    imageKind: 'screenshot',
    imageLayout: 'contain',
    reviewedCommit: 'abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3'
  }
];

for (const project of projects) {
  const shots = projectScreenshots[project.title];
  if (!shots?.length) continue;
  project.screenshots = shots;
  project.image = shots[0].src;
  project.imageAlt = shots[0].alt;
  project.caption = shots[0].caption;
  project.imageKind = 'screenshot';
  project.imageLayout = 'contain';
}
