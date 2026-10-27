# VISHNU — Personal Portfolio

My personal portfolio showcasing my projects, technical skills, education, and community involvement.

I'm Vishnutharan Bavachelvan, a full-stack developer and B.Sc. (Hons) Information Technology undergraduate at the University of Vavuniya, available for remote work worldwide and on-site work in Sri Lanka.

## About the portfolio

The portfolio keeps its black-and-red design with a focused project section and an interactive education timeline.

- Dark and light modes with a saved preference
- Responsive layouts for desktop and mobile
- Project filters, concise case studies and shareable project links
- Three representative screenshots per gallery
- Keyboard-accessible navigation and dialogs
- Static background accents without continuous decorative animation
- Education, certificates, memberships, a common CV and contact details

## Featured projects

- [Buyora](https://github.com/vishnu-tharan/Buyora) — A Next.js/Spring Boot shop with PostgreSQL, product filters, saved favourites, cash-on-delivery checkout and order administration.
- [Lanka Agri-Direct](https://github.com/dragon-udfly/LankaAgriDirect) — An agricultural marketplace developed as a group project. I helped with frontend development, design and API testing.
- [GATEWAY](https://github.com/chamikara12/GATEWAY) — Our semester 3.1 group project for University of Vavuniya vehicle records and gate-pass management. I contributed to frontend and backend development.
- [GatePilot](https://github.com/vishnu-tharan/GatePilot) — A separate access-management prototype with React Native/Expo web and mobile screens, an Express/MongoDB API, vehicle entry/exit, equipment approvals, searchable records and configurable gates/departments.
- [cashManage](https://github.com/vishnu-tharan/CashManage) — Personal cashbooks, budgets, and expense tracking.
- [CEB-Management](https://github.com/vishnu-tharan/CEB-Management) — Household electricity usage tracking and planning.
- [CinemaStream](https://github.com/vishnu-tharan/CinemaStream) — A mobile movie discovery application.

## Technologies

HTML, CSS and JavaScript. A small Python server is included for local development. The portfolio runs without a framework or build step.

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
tools/
  serve.py         Local development server
```

To deploy, serve the contents of `dist/` with any static website host.

## Appearance and interactions

The header provides a dark/light toggle and saves the selected theme locally when storage is available. Both themes use static gradient accents. Project filters, screenshot selectors, share links and the education timeline remain interactive. The portfolio does not load a terminal, search dialog, sound engine or GitHub activity feed.

The profile card uses the supplied photo in `dist/assets/vishnu-profile.jpeg`, preserving its natural proportions. Mobile layouts include larger touch targets, safe-area spacing and responsive project dialogs. Light-theme refinements are in `dist/light-mode.css`.

After changing assets, run `python tools/version_assets.py <new-release-name>` before publishing. This updates HTML asset URLs and module imports together.

## Verification

Run `node --test tools/portfolio.test.mjs` to check source-backed project content, safe destinations, gallery files and browser module dependencies. The website itself has no Node dependency or build step. Preview with the local Python server before publishing.

Browser checks cover dark/light themes, saved appearance, responsive layouts, project filters and dialogs, screenshot selection and education navigation. Mobile checks use browser viewport emulation.

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

The portfolio has one [common CV](dist/cv.html) and [downloadable PDF](dist/assets/Vishnutharan-Bavachelvan-CV.pdf). The header contains the centered uppercase name and contact links, with no job title. A role-neutral summary describes the confirmed education, project and testing experience. Previous role-specific page URLs redirect to the common page, and their historical PDF URLs serve the same common document. Page two retains group work, leadership, certificates, awards and Dr. R. Nagulan's reference.

Edit `tools/cv-data.json`, then run `python tools/build_cv.py` with ReportLab and pypdf installed to regenerate the common PDF/web CV and compatibility copies for historical download URLs. The main PDF is also saved to `output/pdf/`. Run `python tools/check_cv.py` with pdfplumber to verify the two-page monochrome layout, content, links, absent role heading and consistency of all old URLs. Render and inspect both pages, then run `python tools/version_assets.py <new-release-name>`.

The source has one `general` profile. `certificate_descriptions` supplies concise CV wording for participation and merit entries; the portfolio retains the fuller evidence descriptions. Confirmed dates remain supported without placeholders for unknown dates.

CVs use a single column with black text, gray secondary text, thin rules below section headings, a concise profile and seven skill groups. There is no rule above the name, extra focus tagline or location/availability line. Tools include Linux and GitHub Actions; Playwright and Vitest are omitted. The common profile enables `refined_layout`. Contact links have short labels, and education separates the institution from its dates. The web document stays white in both themes; surrounding controls use monochrome light/dark colors. All legacy PDF aliases are byte-identical to the common download. Selectable text and logical reading order support applicant-tracking compatibility; no automated screening score is claimed. The common CV has no targeted job title.

The owner confirmed expected graduation in June 2027, Buyora development in May-June 2026, GatePilot in August-September 2026, CinemaStream in November 2025, and School Head Prefect service in 2020-2022. Certificate dates come from the supplied documents. Dates for GATEWAY, Lanka Agri-Direct and cashManage, Cisco course dates, Head Prefect duties, GPA and team size remain omitted until confirmed. Optional project and leadership `dates` fields are supported by the generator. Old CinemaStream bundle figures and historical test counts have been removed. Current implementation descriptions and available checks are backed by pinned repository sources; production acceptance is not claimed.

The CVs list GATEWAY under teamwork as a semester 3.1 group project and keep GatePilot as a separate individual project in the relevant selected-project lists. `team_project_ids` controls the shared group-project entries across all versions.

The common CV features Buyora, GatePilot and CEB-Management. GATEWAY and Lanka Agri-Direct retain their group-work contributions, and Other Developments lists CashManage and CinemaStream by name.

## Certificates and recognition

Seven supplied certificates have descriptive filenames in `dist/assets/certificates/`, with organized copies in `output/certificates/`. Original files are preserved. The gallery uses existing portfolio colors in both themes, responsive cards, lazy previews and direct view/download links.

`tools/certificate-data.json` is the shared source for the gallery and the common CV. It separates SQL course completion, Cursor AI workshop participation, Trailblazers development-event participation, the school Accounting & ICT merit award, and participation in IEEEXtreme 17.0, IEEEXtreme 18.0 and HACKFORCE '23. No competition ranking or professional certification is inferred from participation.

After editing the metadata, run `python tools/build_certificates.py`, then `python tools/build_cv.py`. Run `python tools/check_certificates.py` and `python tools/check_cv.py` to check files, content and links. PDF preview images are rendered from the supplied documents using Poppler. Finish with `python tools/version_assets.py <new-release-name>` and browser checks before publishing.

Author: **vishnu-tharan**.

Contact and security update (18 October 2026): the portfolio and all current/legacy CV downloads use vtharan.b@gmail.com. LinkedIn is https://www.linkedin.com/in/vishnutharan. New project category filters and a copy-email shortcut retain both themes. The new FormSubmit destination may need activation; delivery has not been verified. See SECURITY-AUDIT.md for findings, checks and hosting limitations. Run tools/version_assets.py after generating pages to apply the browser security policy.

Current project visuals (27 October 2026): 12 original repository screenshots are selected for four case studies: Buyora, GatePilot, CinemaStream and CEB-Management (three each). Retired comparison and staff-pass screens and the earlier CinemaStream design are no longer shown. CashManage uses its current repository icon because the current version has no interface screenshots. GATEWAY and Lanka Agri-Direct retain related gate/leaf symbols. All seven cards have visuals.

`dist/src/project-screenshots.js` supplies gallery order, alt text and captions. `dist/assets/projects/screenshot-sources.json` records pinned commits and Git blob hashes. Each displayed screenshot was matched to its source hash. Screen selectors load originals only when selected; full-size links follow the selection, and portrait captures keep their aspect ratio. Captions distinguish fictional demo records, sample data and current application screens.

Individual feature verification: PROJECT-REVIEW.md and tools/project-review.json map each retained workflow to its current screen/route implementation. Public summaries and CV bullets now use concise implemented workflows, with historical result counts and speculative features omitted. The CV language list includes Java, JavaScript, C++, C, Python, SQL, HTML and CSS.
