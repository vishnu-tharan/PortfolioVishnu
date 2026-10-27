# VISHNU — Personal Portfolio

My personal portfolio showcasing my projects, technical skills, education, and community involvement.

I'm Vishnutharan Bavachelvan, a full-stack developer and B.Sc. (Hons) Information Technology undergraduate at the University of Vavuniya, available for remote work worldwide and on-site work in Sri Lanka.

## About the portfolio

The portfolio keeps its black-and-red cinematic design with animated WebGL backgrounds, an interactive journey timeline, and project case studies. New features extend this layout:

- Dark and light modes, with saved preferences and a dark default
- Search across projects, technologies, education, certificates and contact information (Ctrl/Cmd K or `/`)
- A small optional **VishnuOS** terminal; the portfolio itself remains a normal website
- Optional quiet click sounds, off by default and controlled from the header or terminal
- Public GitHub repository counts and recent activity, refreshed every five minutes while visible
- Shareable project links such as `#project=buyora`

- Responsive layouts for desktop and mobile
- Projects immediately after the introduction, with screenshots, contribution notes, technical decisions and verification context
- Keyboard-accessible navigation and dialogs
- Animation controls and reduced-motion support
- Education, certifications, memberships, and contact details

## Featured projects

- [Buyora](https://github.com/vishnu-tharan/Buyora) — A Next.js and Spring Boot e-commerce project with storefront, customer accounts and administration workflows.
- [Lanka Agri-Direct](https://github.com/dragon-udfly/LankaAgriDirect) — An agricultural marketplace developed as a group project. I helped with frontend development, design and API testing.
- [GATEWAY](https://github.com/chamikara12/GATEWAY) — Our semester 3.1 group project for University of Vavuniya vehicle records and gate-pass management. I contributed to frontend and backend development.
- [GatePilot](https://github.com/vishnu-tharan/GatePilot) — A separate access-management prototype with React Native/Expo web and mobile screens, an Express/MongoDB API, vehicle entry/exit, equipment approvals, searchable records and configurable gates/departments.
- [cashManage](https://github.com/vishnu-tharan/CashManage) — Personal cashbooks, budgets, and expense tracking.
- [CEB-Management](https://github.com/vishnu-tharan/CEB-Management) — Household electricity usage tracking and planning.
- [CinemaStream](https://github.com/vishnu-tharan/CinemaStream) — A mobile movie discovery application.

## Technologies

HTML, CSS, JavaScript, and WebGL. A small Python server is included for local development. The portfolio runs without a framework or build step.

## Run locally

```sh
git clone https://github.com/vishnu-tharan/PortfolioVishnu.git
cd PortfolioVishnu
python tools/serve.py 5173
```

Open [localhost:5173](http://localhost:5173) in your browser.

## Project structure

```text
dist/
  index.html       Page content and sections
  style.css        Styling and responsive layouts
  src/
    main.js        Projects, timeline, and interactions
    stage.js       WebGL backgrounds
tools/
  serve.py         Local development server
```

To deploy, serve the contents of `dist/` with any static website host.

## VishnuOS commands

Click **VishnuOS** in the corner and type `help`. Supported commands include `about`, `projects`, `open buyora`, `search spring boot`, `certificates`, `skills`, `contact`, `cv`, `github`, `theme dark`, `theme light`, `theme system`, `sound on`, `sound off`, `clear`, and `exit`. `open` also accepts `certificates`, `education`, `skills`, `contact`, `github`, `projects` and `cv`. Arrow keys navigate the current terminal's command history. Commands only navigate this portfolio; they never run system code.

## GitHub activity

The tracker reads the public GitHub REST API for `vishnu-tharan`, without an access token. GitHub events can arrive late, so this is the latest available public feed rather than instant notifications or a complete contribution calendar. A browser-local snapshot is labelled when reused. Timeouts, rate limits and unavailable data leave the profile link accessible. Automatic requests stop while the page is hidden, refreshes are spaced out, and server polling/rate-limit headers are respected. No private activity is accessed.

Appearance, sound preferences and the public GitHub snapshot are stored locally when browser storage is available. Sound requires a visitor interaction; nothing autoplays on page load. The existing reduced-motion and animation controls remain available.

Both themes keep the cinematic backgrounds. Light mode uses warm red lighting, particles and orbit effects against paper-colored surfaces, with matching portrait, project and timeline styles. Paused scenes repaint once when the theme changes. Touch devices use a lower maximum canvas resolution, and browsers without WebGL retain static gradient backgrounds.

The profile card uses the owner's supplied black-suit/white-shirt photo in `dist/assets/vishnu-profile.jpeg`, with its natural proportions. The old portrait, cutout mask and tie-specific layers have been removed. Card lighting and pointer tilt remain, with reduced-motion support.

After changing assets or regenerating the CV, run `python tools/version_assets.py <new-release-name>` before publishing. This updates HTML asset URLs and module imports together, so returning visitors receive one consistent version instead of mixing cached theme files with new code.

Mobile layouts include larger touch targets, safe-area spacing, and dialogs that adapt to the browser's visible area and on-screen keyboard. Appearance refinements are in `dist/light-mode.css`; responsive controls are in `dist/responsive.css` and `dist/src/viewport.js`.

Interaction effects live in `dist/effects.css`, `dist/src/effects.js` and `dist/src/transitions.js`. Theme changes reveal the new palette from the theme button in browsers with View Transitions; other browsers switch immediately. Project screenshots animate into their case studies when the source image is visible and loaded, with a short dialog entrance for other projects. Desktop project cards have a pointer spotlight. The thin scroll indicator and active navigation follow the current section without changing the layout. VishnuOS includes command suggestions that fill the input before the visitor presses Run, and a blinking prompt. Copying a project link shows an accessible confirmation beside its button.

New motion respects both the operating system's reduced-motion preference and the portfolio's pause button. Pointer effects require a mouse and fine-pointer support. Animations stop when the page is hidden; essential navigation and commands remain usable without View Transitions.

## Verification

Run `node --test tools/portfolio.test.mjs tools/stage.test.mjs tools/effects.test.mjs` to check GitHub data validation, safe activity links, project content, renderer palettes, touch-device resolution, WebGL fallbacks and transition cancellation/fallbacks. The website itself has no Node dependency or build step. Preview with the local Python server before publishing.

Browser checks cover 320, 390, 768 and 1280 pixel viewports in both themes, search-to-project navigation, terminal commands, animation pause and theme changes while paused. These checks use browser viewport emulation; no physical phone was connected.

The GitHub Pages workflow publishes `dist/` when commits reach `main`. The local publishing checkout under `.sites-runtime/github-publish/` contains the matching GitHub history; the main workspace keeps the editable site files.

## Contact

- Email: [vtharan.b@gmail.com](mailto:vtharan.b@gmail.com)
- GitHub: [vishnu-tharan](https://github.com/vishnu-tharan)
- LinkedIn: [Vishnutharan Bavachelvan](https://www.linkedin.com/in/vishnutharan)

## Project content and contact form

Edit `dist/src/project-data.js` for descriptions and `tools/cv-data.json` for CV entries. All seven projects were reviewed against pinned repository commits on 27 October 2026; `tools/project-review.json` records the files inspected. Evidence links point to current README checks. Buyora covers the storefront and transactional checkout; GatePilot covers vehicle/equipment workflows; CashManage covers personal encrypted vaults and account security; CEB covers household readings and a dated tariff estimator; CinemaStream uses JavaScript and online Firestore collections. GATEWAY credits frontend/backend group work, and Lanka Agri-Direct credits frontend, design and API testing for a produce directory. This source review did not execute the project application test suites.

`dist/recruiter.css` contains the responsive layout refinements. `dist/social-preview.html` is the source for the 1200 × 630 social sharing image.

The contact form submits through FormSubmit with its default spam verification and a hidden honeypot. The owner must click **Activate Form** in the email from FormSubmit before delivery works. An activation request has been sent; delivery still needs an owner-confirmed test after activation. Direct email and phone links remain available. The form discloses the third-party processor and redirects to `contact-sent.html` after submission. Update the form's `_next` URL if the hosting address changes.

## CV

The portfolio's main [Software Engineering CV](dist/cv.html) and [downloadable PDF](dist/assets/Vishnutharan-Bavachelvan-CV.pdf) are linked from the introduction, navigation and contact section. Separate [full-stack](dist/cv-fullstack.html), [web development](dist/cv-web.html) and [mobile app](dist/cv-mobile.html) CVs tailor the summary, skills and three selected projects to each role. All four versions use a centered, uppercase Arial Bold name, a concise internship title and contact links, with a left-aligned Calibri body. Page two includes group projects, community involvement, School Head Prefect leadership, certificates, awards and Dr. R. Nagulan's reference at the end.

Edit `tools/cv-data.json`, then run `python tools/build_cv.py` with ReportLab and pypdf installed to regenerate the four role PDFs and web pages, plus the main Software Engineering alias. PDFs are also saved to `output/pdf/`. Run `python tools/check_cv.py` with pdfplumber installed to check two-page layout limits, readable monochrome text, standard reading order, certificate and reference links, project order, all role links and matching web downloads. Render and inspect both pages of every PDF before publishing. Then run `python tools/version_assets.py <new-release-name>`; PDF download URLs are versioned too.

To regenerate only affected CVs, pass profile names: `python tools/build_cv.py software fullstack web mobile`. Omit profile names to regenerate all four and the main alias. `default_profile` selects Software Engineering for the main page and PDF. The previous frontend/backend web links redirect to the web/software replacements. `certificate_descriptions` supplies concise CV summaries for participation and merit entries; the portfolio gallery retains the full descriptions. Confirmed `dates` fields are supported for projects and leadership, without placeholders when dates are unknown.

CVs use a single column with black text, gray secondary text, thin rules below section headings, a concise profile and five skill groups. There is no rule above the name, extra focus tagline or location/availability line. Tools include Linux and GitHub Actions; Playwright and Vitest are omitted. All profiles enable `refined_layout`. Contact links have short labels, and education separates the institution from its dates. The web document stays white in both themes; surrounding controls use monochrome light/dark colors. The main PDF is byte-identical to the named Software Engineering PDF. Selectable text and logical reading order support applicant-tracking compatibility; no automated screening score is claimed. Tailor each CV to the vacancy.

The owner confirmed expected graduation in June 2027, Buyora development in May-June 2026, GatePilot in August-September 2026, CinemaStream in November 2025, and School Head Prefect service in 2020-2022. Certificate dates come from the supplied documents. Dates for GATEWAY, Lanka Agri-Direct and cashManage, Cisco course dates, Head Prefect duties, GPA and team size remain omitted until confirmed. Optional project and leadership `dates` fields are supported by the generator. Old CinemaStream bundle figures and historical test counts have been removed. Current implementation descriptions and available checks are backed by pinned repository sources; production acceptance is not claimed.

The CVs list GATEWAY under teamwork as a semester 3.1 group project and keep GatePilot as a separate individual project in the relevant selected-project lists. `team_project_ids` controls the shared group-project entries across all versions.

The main Software Engineering CV features Buyora, GatePilot and CEB-Management. Each CV adds a compact Other Developments section containing only linked names for projects not already featured or covered under teamwork. CinemaStream remains featured in the Mobile App CV and is listed by name in the main CV's Other Developments section.

## Certificates and recognition

Seven supplied certificates have descriptive filenames in `dist/assets/certificates/`, with organized copies in `output/certificates/`. Original files are preserved. The gallery uses existing portfolio colors in both themes, responsive cards, lazy previews and direct view/download links. Search includes each certificate and its issuer. VishnuOS supports `certificates`, `search SQL` and `open certificates`.

`tools/certificate-data.json` is the shared source for the gallery, search, terminal and all four role CVs. It separates SQL course completion, Cursor AI workshop participation, Trailblazers development-event participation, the school Accounting & ICT merit award, and participation in IEEEXtreme 17.0, IEEEXtreme 18.0 and HACKFORCE '23. No competition ranking or professional certification is inferred from participation.

After editing the metadata, run `python tools/build_certificates.py`, then `python tools/build_cv.py`. Run `python tools/check_certificates.py` and `python tools/check_cv.py` to check files, content and links. PDF preview images are rendered from the supplied documents using Poppler. Finish with `python tools/version_assets.py <new-release-name>` and browser checks before publishing.

Author: **vishnu-tharan**.

Contact and security update (18 October 2026): the portfolio and all current/legacy CV downloads use vtharan.b@gmail.com. LinkedIn is https://www.linkedin.com/in/vishnutharan. New project category filters and a copy-email shortcut retain both themes. The new FormSubmit destination may need activation; delivery has not been verified. See SECURITY-AUDIT.md for findings, checks and hosting limitations. Run tools/version_assets.py after generating pages to apply the browser security policy.

Current project visuals (27 October 2026): 29 original repository screenshots are available in four case studies: Buyora (9), GatePilot (8), CinemaStream (5) and CEB-Management (7). Retired comparison and staff-pass screens and the earlier CinemaStream design are no longer shown. CashManage uses its current repository icon because the current version has no interface screenshots. GATEWAY and Lanka Agri-Direct retain related gate/leaf symbols. All seven cards have visuals.

`dist/src/project-screenshots.js` supplies gallery order, alt text and captions. `dist/assets/projects/screenshot-sources.json` records pinned commits and Git blob hashes. Each displayed screenshot was matched to its source hash. Screen selectors load originals only when selected; full-size links follow the selection, and portrait captures keep their aspect ratio. Captions distinguish fictional demo records, sample data and current application screens.
