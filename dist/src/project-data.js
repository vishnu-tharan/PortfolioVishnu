import { projectScreenshots } from './project-screenshots.js?v=20261027-cashmanage-link-v1';
// Author: vishnu-tharan. Based on project documentation and confirmed contributions.
export const projects = [
 {title:'Buyora', type:'E-COMMERCE / FULL-STACK', stack:'Next.js · Spring Boot · PostgreSQL · Redis · Docker',
  summary:'LKR shopping, product comparison, order tracking and store operations in one full-stack application.', role:'Full-stack development',
  image:'./assets/projects/buyora-storefront.jpg', imageLayout:'page', imageAlt:'Buyora red storefront with LKR product prices, category tiles and budget collections', caption:'Red storefront preview · local sample catalog with illustrative LKR prices · repository screenshot',
  link:'https://github.com/vishnu-tharan/Buyora',
  problem:'Connect product discovery, local delivery, checkout and after-sales support with reliable store administration.',
  contribution:'Expanded the Next.js and Spring Boot application with a red storefront, photographed sample catalog, LKR price ranges and budget collections. Added keyboard search suggestions, variant filters, four-product comparison, guest wishlist merging, stock and price alerts, image zoom and mobile purchase controls. Built delivery estimates and COD eligibility, order tracking, partial returns, refund progress, product editing and store operations dashboards.',
  decision:'Use PostgreSQL and Redis with additive Flyway migrations and a Docker setup for the frontend, API, database, cache and local email inbox. A durable email outbox retries delivery, while uncertain payments and refunds require provider evidence or operator review. Uploaded product media is stored in PostgreSQL. Shopping analytics collect aggregate counts only with consent.',
  testing:'The updated repository reports 70 frontend tests, 36 backend unit tests and 8 PostgreSQL integration tests passing, plus production builds, the V13 migration and five healthy Docker services. Browser checks cover the retained catalog, comparison, mobile navigation and LKR filters. Earlier visual checks used fixtures; PayHere sandbox settlement, complete customer/admin flows and live email acceptance remain release checks.',
  status:'Development project · updated storefront and local Docker verification · production acceptance pending', evidence:'https://github.com/vishnu-tharan/Buyora/blob/a54ea43a4c7a0b6ddb862bea851362f48df68803/docs/verification/SHOPPING_IMPROVEMENTS.md'},
 {title:'GATEWAY', image:'./assets/projects/gateway-symbol.svg', imageKind:'logo', imageAlt:'Gate symbol representing the GATEWAY project', caption:'Portfolio gate symbol · represents vehicle access management',type:'SEMESTER 3.1 / GROUP PROJECT',stack:'React · JavaScript · Node.js · Express · MongoDB',
  summary:'Our semester 3.1 group project for vehicle records and gate-pass management at the University of Vavuniya.',role:'Frontend and backend development · Group project',
  link:'https://github.com/chamikara12/GATEWAY',
  problem:'Bring university vehicle entries, exits and gate-pass records into one web application.',
  contribution:'Contributed to both frontend and backend development with my semester 3.1 project team on GATEWAY, our university vehicle and gate-pass management application. This entry represents the original shared group repository.',
  decision:'The group project uses React dashboards for administrators and security officers, with Express routes and MongoDB models for users, gate passes and vehicle records.',
  status:'Semester 3.1 academic group project · University of Vavuniya'},
 {title:'GatePilot', image:'./assets/projects/gatepilot-sign-in.png', imageAlt:'GatePilot sign-in screen with fictional Sample Campus workspace options', caption:'Sign-in screen · existing local web build · fictional Sample Campus prototype',type:'ACCESS MANAGEMENT / WEB & MOBILE',stack:'React Native · Expo · Express · MongoDB · Docker',
  summary:'An independent campus and workplace prototype for vehicle visits, equipment approvals, staff passes and reports.',role:'Full-stack development',
  link:'https://github.com/vishnu-tharan/GatePilot',
  problem:'Coordinate vehicle arrivals, equipment decisions and departures across configurable gates and departments.',
  contribution:'Developed GatePilot with shared React Native and Expo screens, an Express and MongoDB API, and workflows for gate officers, department administrators and organization administrators. Added staff QR lookup, searchable movement records, PDF reports, account management and workspace settings.',
  decision:'Enforce department permissions and visit transitions on the server. Browser sessions use HttpOnly cookies and native clients use SecureStore. Unique active-visit records and conditional updates guard against duplicate arrivals and conflicting approvals or departures. Docker provides a local web/API/database setup.',
  testing:'The repository includes backend integration tests for authentication, department isolation, concurrent visits and equipment decisions, plus frontend checks for reporting dates, pagination and PDF data. Web and mobile bundle exports are separate from signed native builds and physical-device verification.',
  status:'Independent development prototype · fictional Sample Campus demonstration',evidence:'https://github.com/vishnu-tharan/GatePilot#checks'},
 {title:'cashManage',type:'PERSONAL FINANCE / PWA',stack:'React · JavaScript · Express · SQLite · PWA',
  summary:'Private cashbooks, budgets and reports with encrypted offline storage.',role:'Full-stack development',
  image:'./assets/projects/cashmanage-overview.png',imageAlt:'cashManage overview showing an empty temporary guest workspace',caption:'Overview · empty guest workspace in a local build',
  link:'https://github.com/vishnu-tharan/CashManage',
  problem:'Bring income, expenses, debts and savings into currency-specific cashbooks that remain usable offline.',
  contribution:'Created an installable React PWA with encrypted local storage, CSV statement import, budgets, debt tracking and PDF/CSV reports. Added an Express and SQLite account server and shared cashbook roles.',
  decision:'Use encrypted vaults for offline data and revision checks for synchronization, so conflicting edits can be reviewed instead of silently overwritten.',
  testing:'Repository tests cover encryption and tampering, transfer balances, recurrence, CSV validation, conflict resolution, PDF pagination and account isolation. Guest UI checks are documented; device installation and live Google integration remain separate checks.',
  status:'Development project · records finances; does not process payments',evidence:'https://github.com/vishnu-tharan/CashManage#checks'},
 {title:'Lanka Agri-Direct', image:'./assets/projects/agri-symbol.svg', imageKind:'logo', imageAlt:'Leaf symbol representing Lanka Agri-Direct', caption:'Portfolio leaf symbol · represents the agricultural marketplace group project',type:'GROUP PROJECT / TEAM MEMBER',stack:'Spring Boot · React · React Native · MongoDB · Docker',
  summary:'A team-built marketplace connecting Sri Lankan growers and consumers.',role:'Frontend, design and API testing',link:'https://github.com/dragon-udfly/LankaAgriDirect',
  problem:'Help agricultural producers connect with consumers through a direct-to-consumer marketplace.',
  contribution:'Contributed to frontend development and interface design, and helped test APIs as a member of the project team.',
  decision:'The team combined web and mobile interfaces with a Spring Boot backend to support produce distribution and order management.',
  testing:'My contribution included API testing and checking how the frontend works with the backend.',status:'Academic group project'},
 {title:'CEB-Management', image:'./assets/projects/ceb-energy-logo.svg', imageKind:'logo', imageAlt:'Energy Saver lightning logo from the project', caption:'Energy Saver application logo · independent project, not the official CEB identity',type:'HOUSEHOLD ENERGY PLANNER',stack:'JavaScript · HTML · CSS · Express · SQLite',
  summary:'Understand appliance usage and explore household energy plans.',role:'Web application development',link:'https://github.com/vishnu-tharan/CEB-Management',
  problem:'Make household electricity usage easier to understand and plan.',
  contribution:'Developed appliance and meter-reading tracking, budgets, weekly plans, forecasts and CSV export, with scenarios for solar and EV charging.',
  decision:'Keep recorded readings and bills separate from estimates, so users can compare actual usage with planning scenarios.',status:'Independent planning tool · not an official CEB service'},
 {title:'CinemaStream', image:'./assets/projects/cinemastream-welcome.png', imageAlt:'CinemaStream charcoal and amber welcome screen with featured film artwork', caption:'Welcome screen · existing local web build · movie discovery application',type:'MOVIE DISCOVERY / MOBILE & WEB',stack:'TypeScript · React Native · Expo · Firebase · AsyncStorage',
  summary:'Discover movies as a guest, explore trailers, and manage personal collections with offline sync.',role:'Mobile and web application development',link:'https://github.com/vishnu-tharan/CinemaStream',
  problem:'Help viewers explore a movie catalog and maintain personal collections across online and offline sessions.',
  contribution:'Expanded the Expo and React Native application with guest browsing, search across titles, cast, genres and years, combined genre/decade filters and sorting. Added favorites, watchlist and watched collections, verified distributor trailer links or labeled searches, persistent sign-in, password recovery, email verification and resumable profile setup. The charcoal-and-amber interface includes accessible labels, larger touch targets and loading/error states.',
  decision:'Use a per-account AsyncStorage cache and durable pending changes for reconnect synchronization and retries. Guest mode avoids private collection reads and writes. The repository defines owner-only Firestore rules with schema validation; deploying and checking live rules is a separate release step. The production web shell supports offline catalog browsing after an initial online visit and keeps Firebase traffic out of its public cache. Local collection storage is not encrypted.',
  testing:'The repository records passing TypeScript and lint checks, eight unit tests, ten Firebase emulator rule tests, production web export and Android JavaScript export on 5 October 2026. Tests cover discovery, collection migration, pending changes, damaged caches, account isolation and validation rules. Native release builds, Hermes compilation, live Firebase delivery, physical-device behavior and dependency review remain release checks.',
  performance:'Repository measurements show the web entry bundle reduced from approximately 4.25 MB to 2.67 MB by separating the optional crash-reporting SDK; this does not reduce total exported JavaScript. Grid thumbnail bytes fell by 61% across 13 available posters. All 14 movie routes have exported web pages. Actual device startup time, frame rate and memory still need release-device measurements.',
  status:'Development project · movie discovery and trailers; does not stream full films',evidence:'https://github.com/vishnu-tharan/CinemaStream/blob/main/RELEASE_CHECKLIST.md',performanceEvidence:'https://github.com/vishnu-tharan/CinemaStream#guest-mode-and-performance'}
];


// Repository screenshot sets replace older cover images and logo fallbacks.
for (const project of projects) {
 const shots = projectScreenshots[project.title];
 if (!shots?.length) continue;
 project.screenshots = shots;
 project.image = shots[0].src;
 project.imageAlt = shots[0].alt;
 project.caption = shots[0].caption;
 project.imageKind = "screenshot";
 project.imageLayout = "contain";
}
