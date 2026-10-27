import { projectScreenshots } from './project-screenshots.js?v=20261027-project-refresh-v1';
// Project descriptions reviewed against current repository source on 27 October 2026.
export const projects = [
  {
    "title": "Buyora",
    "type": "E-COMMERCE / FULL-STACK",
    "stack": "Next.js · Spring Boot · PostgreSQL · Redis · Docker",
    "summary": "A Sri Lankan storefront with LKR pricing, cart, checkout, order tracking and store administration.",
    "role": "Full-stack development",
    "image": "./assets/projects/buyora-desktop-home.png",
    "imageLayout": "contain",
    "imageAlt": "Buyora — storefront screen",
    "caption": "Storefront · Guest session · sample catalog and illustrative LKR prices",
    "link": "https://github.com/vishnu-tharan/Buyora",
    "problem": "Connect product discovery, local delivery, checkout and after-sales support with reliable store administration.",
    "contribution": "Developed product browsing, search and filters, favourites, guest and account carts, checkout, order tracking and eligible return/refund requests. Built account and address screens plus administration for products, images, variants, stock, orders, reviews and store settings.",
    "decision": "Next.js and JavaScript call Spring Boot feature modules backed by PostgreSQL and Redis. Checkout uses server prices, BigDecimal totals, stock reservations and an idempotency key inside a transaction. HTTP-only cookies, CSRF checks and ownership rules protect account actions; queued email retries and payment-provider evidence support order operations.",
    "testing": "The current source includes frontend unit/component checks and backend business-rule and PostgreSQL integration tests for authentication, CSRF, pricing, stock, checkout, duplicate submissions, ownership, callbacks and refunds. Browser checks use an optional sample catalog. This portfolio review inspected source and documentation; it did not rerun the application suites.",
    "status": "Development project · local Docker setup · PayHere sandbox requires configuration and callback verification",
    "evidence": "https://github.com/vishnu-tharan/Buyora/blob/3db4dda77a9336791ed7d05c1cc2c5c75ae3152b/README.md#checks",
    "imageKind": "screenshot",
    "reviewedCommit": "3db4dda77a9336791ed7d05c1cc2c5c75ae3152b"
  },
  {
    "title": "GATEWAY",
    "image": "./assets/projects/gateway-symbol.svg",
    "imageKind": "logo",
    "imageAlt": "Gate symbol representing the GATEWAY project",
    "caption": "Portfolio gate symbol · represents vehicle access management",
    "type": "SEMESTER 3.1 / GROUP PROJECT",
    "stack": "React · JavaScript · Node.js · Express · MongoDB",
    "summary": "Our semester 3.1 group application for university vehicle movements and gate-pass records.",
    "role": "Frontend and backend development · Group project",
    "link": "https://github.com/chamikara12/GATEWAY",
    "problem": "Bring university vehicle entries, exits and gate-pass records into one web application.",
    "contribution": "Contributed frontend and backend development to the original semester 3.1 GATEWAY group project. The repository contains React administration and security-officer screens, Express controllers and MongoDB models for users, gate passes and vehicle movements.",
    "decision": "React interfaces separate administration from security-officer entry and exit tasks. Express controllers read and save gate passes and vehicle records through Mongoose models. This shared academic repository contains several earlier implementation folders.",
    "status": "Semester 3.1 academic group project · frontend and backend contribution",
    "testing": "Reviewed the current repository structure, package manifest, vehicle and gate-pass controllers and administration report screen. The README remains a Create React App template, so no passing application test results or deployment status are claimed.",
    "reviewedCommit": "fc205a40ccc97571adcf53ad0e60bb35f5cc7de0"
  },
  {
    "title": "GatePilot",
    "image": "./assets/projects/gatepilot-02-dashboard.png",
    "imageAlt": "GatePilot — dashboard screen",
    "caption": "Dashboard · Prototype workspace · fictional Sample Campus records",
    "type": "ACCESS MANAGEMENT / WEB & MOBILE",
    "stack": "React Native · Expo · Express · MongoDB · Docker",
    "summary": "Vehicle arrivals, departures and department equipment approvals across configurable gates.",
    "role": "Full-stack development",
    "link": "https://github.com/vishnu-tharan/GatePilot",
    "problem": "Coordinate vehicle arrivals, equipment decisions and departures across configurable gates and departments.",
    "contribution": "Built shared React Native/Expo web and mobile layouts for gate officers, department administrators and organization administrators. Implemented vehicle entry and exit, equipment approval, rejection and resubmission, searchable records, dashboard counts, account management and gate/department settings.",
    "decision": "Express session and role checks scope MongoDB records to the permitted department. A unique active-visit index blocks duplicate arrivals, and conditional updates protect approvals and departures. Retiring gates or departments preserves history and checks open visits. An isolated demo uses fictional Sample Campus identities.",
    "testing": "The repository contains temporary-MongoDB security and workflow tests, plus frontend record, pagination and dependency checks. Scripts export web, Android and iOS bundles; these exports do not establish signed installers or physical-device behavior. Suites were reviewed rather than rerun for this portfolio refresh.",
    "status": "Independent gate-management prototype · fictional Sample Campus demo · responsive web and mobile layouts",
    "evidence": "https://github.com/vishnu-tharan/GatePilot/blob/94f5c069dad296877cd321bdfa54275ed7b95ba6/README.md#checks",
    "imageKind": "screenshot",
    "imageLayout": "contain",
    "reviewedCommit": "94f5c069dad296877cd321bdfa54275ed7b95ba6"
  },
  {
    "title": "CashManage",
    "type": "PERSONAL FINANCE / PWA",
    "stack": "React · JavaScript · Vite · Express · SQLite · PWA",
    "summary": "Personal cashbooks with budgets, receipts, encrypted backups and offline account access.",
    "role": "Full-stack development",
    "image": "./assets/projects/cashmanage-current-icon.png",
    "imageAlt": "CashManage application icon from the current repository",
    "caption": "Current CashManage application icon · the repository has no current interface screenshots",
    "link": "https://github.com/vishnu-tharan/CashManage",
    "problem": "Bring income, expenses, debts and savings into currency-specific cashbooks that remain usable offline.",
    "contribution": "Built currency-specific cashbooks for income, expenses, transfers, recurring entries, debts and savings targets. Added CSV import with preview and duplicate checks, receipt attachments, guarded undo, CSV reports, browser PDF printing and encrypted backup import/export.",
    "decision": "React and Vite provide an installable interface with an Express/SQLite account server. Money uses integer minor units and separate currency totals. Password-derived AES-GCM vaults support local storage and offline unlock; revision checks surface synchronization conflicts. Account settings include MFA, recovery, session revocation and auto-lock.",
    "testing": "The current README reports client lint, 14 client tests, 4 server tests, a production build and a local HTTP response check. Reviewed source covers encryption, sync and MFA. It explicitly leaves desktop/mobile visual checks, real-device installation and public deployment unverified; the portfolio review did not rerun these suites.",
    "status": "Personal finance development app · records money movements · no bank connection or payment processing",
    "evidence": "https://github.com/vishnu-tharan/CashManage/blob/6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa/README.md#checks",
    "imageKind": "logo",
    "imageLayout": "contain",
    "reviewedCommit": "6c4d82d5fcd3eab6985d4691bcf822ea2bc417aa"
  },
  {
    "title": "Lanka Agri-Direct",
    "image": "./assets/projects/agri-symbol.svg",
    "imageKind": "logo",
    "imageAlt": "Leaf symbol representing Lanka Agri-Direct",
    "caption": "Portfolio leaf symbol · represents the agricultural marketplace group project",
    "type": "GROUP PROJECT / TEAM MEMBER",
    "stack": "Spring Boot · React · React Native · MongoDB · Docker",
    "summary": "A group-built Sri Lankan produce directory connecting buyers with verified producers.",
    "role": "Frontend, design and API testing",
    "link": "https://github.com/dragon-udfly/LankaAgriDirect",
    "problem": "Help buyers discover local produce and contact verified growers directly, with producer listings and administrative review.",
    "contribution": "Contributed frontend development, interface design and API integration testing as a team member. The shared project combines a React admin interface with React Native buyer and producer screens, product discovery and producer listing management.",
    "decision": "Spring Boot controllers and MongoDB support producer verification, product listing, sold-out updates and administration. React Native provides discovery and locally saved favourites; producer contact details support direct offline transactions. The repository describes a directory, without digital payment processing.",
    "testing": "Cross-checked the README, web/mobile dependency manifests, product and producer controllers and mobile workflows. Personal credit remains limited to the confirmed frontend, design and API-testing contribution; no complete production workflow or passing test suite is claimed.",
    "status": "Academic group project · direct-contact produce directory · frontend, design and API-testing contribution",
    "reviewedCommit": "3142c15f1bd36017185cc24028f51849991e82ee"
  },
  {
    "title": "CEB-Management",
    "image": "./assets/projects/ceb-management-dashboard-desktop.jpg",
    "imageKind": "screenshot",
    "imageAlt": "CEB-Management — dashboard screen",
    "caption": "Dashboard · Temporary sample household · illustrative readings and estimates",
    "type": "HOUSEHOLD ELECTRICITY TRACKER",
    "stack": "JavaScript · HTML · CSS · Express · SQLite",
    "summary": "Appliance tracking, cumulative meter readings and electricity bill estimates for Sri Lankan homes.",
    "role": "Web application development",
    "link": "https://github.com/vishnu-tharan/CEB-Management",
    "problem": "Explain household electricity use by separating appliance estimates, meter measurements and actual saved bills.",
    "contribution": "Built account access and recovery, appliance CRUD and search, dated cumulative meter readings, consumption charts, daily and 30-day estimates, an itemised bill estimator and actual bill history. Added responsive light/dark screens and editable household profiles.",
    "decision": "HTML, CSS and JavaScript call an Express API backed by user-scoped SQLite queries and transactions. Calculations use appliance power and hours, meter-reading differences and a day-weighted average of recent intervals. The estimator uses a dated 30-day domestic tariff snapshot, with taxes, arrears and other adjustments excluded.",
    "status": "Independent student project · dated tariff model · no live utility or smart-meter connection",
    "imageLayout": "contain",
    "testing": "The repository includes calculation/API tests and a migration/restart test that preserves existing records. Its optional browser suite checks the account and household journey, eight screens, HTML escaping and password changes. These are repository checks, not results rerun by this portfolio review.",
    "evidence": "https://github.com/vishnu-tharan/CEB-Management/blob/e708d978a9b13e72d0b193a38bfc11095c44fa61/README.md#verify",
    "reviewedCommit": "e708d978a9b13e72d0b193a38bfc11095c44fa61"
  },
  {
    "title": "CinemaStream",
    "image": "./assets/projects/cinemastream-welcome-desktop.jpg",
    "imageAlt": "CinemaStream — welcome screen",
    "caption": "Welcome · Web prototype · movie discovery and collections",
    "type": "MOVIE DISCOVERY / MOBILE & WEB",
    "stack": "JavaScript · React Native · Expo Router · Firebase · Firestore",
    "summary": "Browse movies, search and filter the catalog, open trailers and save online personal collections.",
    "role": "Mobile and web application development",
    "link": "https://github.com/vishnu-tharan/CinemaStream",
    "problem": "Let guests discover films while signed-in users manage their own favourites, watchlist and watched movies.",
    "contribution": "Developed a 20-film discovery catalog with posters, film information, search across titles, cast, genres and years, genre filters and official YouTube trailer links. Added guest browsing, email/password authentication, password reset, email verification and personal collection controls.",
    "decision": "JavaScript React Native screens use Expo Router for navigation. Firebase Authentication identifies the account; Firestore stores validated per-user collection records. Collection reads and writes require an internet connection, and the UI updates after successful writes. Rules enforce account ownership and record shape.",
    "testing": "Current scripts cover lint, JavaScript helper unit tests, catalog checks, formatting and static web export. Firestore permission tests use local Firebase emulators. The app opens trailers rather than full films. Native release installers and physical-device testing remain separate checks.",
    "status": "Movie discovery and collection prototype · online account/collection actions · trailers, not full-film streaming",
    "evidence": "https://github.com/vishnu-tharan/CinemaStream/blob/abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3/README.md#check",
    "imageKind": "screenshot",
    "imageLayout": "contain",
    "reviewedCommit": "abc97b57ac3e454cbfa55c797b3d8c421d2f2ba3"
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
