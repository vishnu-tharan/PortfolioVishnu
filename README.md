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
- [University Gateway](https://github.com/vishnu-tharan/GATEWAY-UniversityOfVavuniya) — Campus vehicle access and equipment gate-pass management.
- [cashManage](https://github.com/vishnu-tharan/cashManage) — Personal cashbooks, budgets, and expense tracking.
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

Click **VishnuOS** in the corner and type `help`. Supported commands include `about`, `projects`, `open buyora`, `search spring boot`, `skills`, `contact`, `cv`, `github`, `theme dark`, `theme light`, `theme system`, `sound on`, `sound off`, `clear`, and `exit`. `open` also accepts `education`, `skills`, `contact`, `github`, `projects` and `cv`. Arrow keys navigate the current terminal's command history. Commands only navigate this portfolio; they never run system code.

## GitHub activity

The tracker reads the public GitHub REST API for `vishnu-tharan`, without an access token. GitHub events can arrive late, so this is the latest available public feed rather than instant notifications or a complete contribution calendar. A browser-local snapshot is labelled when reused. Timeouts, rate limits and unavailable data leave the profile link accessible. Automatic requests stop while the page is hidden, refreshes are spaced out, and server polling/rate-limit headers are respected. No private activity is accessed.

Appearance, sound preferences and the public GitHub snapshot are stored locally when browser storage is available. Sound requires a visitor interaction; nothing autoplays on page load. The existing reduced-motion and animation controls remain available.

Both themes keep the cinematic backgrounds. Light mode uses warm red lighting, particles and orbit effects against paper-colored surfaces, with matching portrait, project and timeline styles. Paused scenes repaint once when the theme changes. Touch devices use a lower maximum canvas resolution, and browsers without WebGL retain static gradient backgrounds.

After changing assets or regenerating the CV, run `python tools/version_assets.py <new-release-name>` before publishing. This updates HTML asset URLs and module imports together, so returning visitors receive one consistent version instead of mixing cached theme files with new code.

Mobile layouts include larger touch targets, safe-area spacing, and dialogs that adapt to the browser's visible area and on-screen keyboard. Appearance refinements are in `dist/light-mode.css`; responsive controls are in `dist/responsive.css` and `dist/src/viewport.js`.

Interaction effects live in `dist/effects.css`, `dist/src/effects.js` and `dist/src/transitions.js`. Theme changes reveal the new palette from the theme button in browsers with View Transitions; other browsers switch immediately. Project screenshots animate into their case studies when the source image is visible and loaded, with a short dialog entrance for other projects. Desktop project cards have a pointer spotlight. The thin scroll indicator and active navigation follow the current section without changing the layout. VishnuOS includes command suggestions that fill the input before the visitor presses Run, and a blinking prompt. Copying a project link shows an accessible confirmation beside its button.

New motion respects both the operating system's reduced-motion preference and the portfolio's pause button. Pointer effects require a mouse and fine-pointer support. Animations stop when the page is hidden; essential navigation and commands remain usable without View Transitions.

## Verification

Run `node --test tools/portfolio.test.mjs tools/stage.test.mjs tools/effects.test.mjs` to check GitHub data validation, safe activity links, project content, renderer palettes, touch-device resolution, WebGL fallbacks and transition cancellation/fallbacks. The website itself has no Node dependency or build step. Preview with the local Python server before publishing.

Browser checks cover 320, 390, 768 and 1280 pixel viewports in both themes, search-to-project navigation, terminal commands, animation pause and theme changes while paused. These checks use browser viewport emulation; no physical phone was connected.

The GitHub Pages workflow publishes `dist/` when commits reach `main`. The local publishing checkout under `.sites-runtime/github-publish/` contains the matching GitHub history; the main workspace keeps the editable site files.

## Contact

- Email: [bavachelvanvishnutharan@gmail.com](mailto:bavachelvanvishnutharan@gmail.com)
- GitHub: [vishnu-tharan](https://github.com/vishnu-tharan)
- LinkedIn: [Vishnutharan Bavachelvan](https://www.linkedin.com/in/vishnutharan-bavachelvan-5419a02b3/)

## Project content and contact form

Edit `dist/src/project-data.js` to update project descriptions, contributions and evidence links. The Buyora image comes from its repository's `docs/verification/login-chromium.png`; University Gateway and cashManage images show actual local builds (sign-in and an empty guest dashboard respectively). Captions identify these states. Testing notes refer to repository documentation, not production certification. No public application demo is claimed.

`dist/recruiter.css` contains the responsive layout refinements. `dist/social-preview.html` is the source for the 1200 × 630 social sharing image.

The contact form submits through FormSubmit with its default spam verification and a hidden honeypot. The owner must click **Activate Form** in the email from FormSubmit before delivery works. An activation request has been sent; delivery still needs an owner-confirmed test after activation. Direct email and phone links remain available. The form discloses the third-party processor and redirects to `contact-sent.html` after submission. Update the form's `_next` URL if the hosting address changes.

## CV

The portfolio includes a responsive [general CV](dist/cv.html) and a [downloadable PDF](dist/assets/Vishnutharan-Bavachelvan-CV.pdf), linked from the introduction, navigation and contact section. The CV page also links to [frontend](dist/cv-frontend.html), [backend](dist/cv-backend.html) and [mobile](dist/cv-mobile.html) versions, each with a matching one-page PDF. Each version selects three relevant projects and preserves the confirmed group-project contribution and community activities.

Edit `tools/cv-data.json`, then run `python tools/build_cv.py` with ReportLab and pypdf installed to regenerate all four PDFs and web pages. PDFs are also saved to `output/pdf/`. Run `python tools/check_cv.py` with pdfplumber installed to check one-page layout limits, selectable text, PDF link annotations, project order and matching web downloads. Render and inspect the PDFs before publishing. Then run `python tools/version_assets.py <new-release-name>`; PDF download URLs are versioned too.

The expected graduation date, June 2027, was confirmed by the owner. Project and certification dates, GPA, team size and more specific group-project responsibilities are omitted until confirmed. Optional project `dates` fields are supported by the generator. The CV's bundle figures describe CinemaStream's measured web entry bundle, not total JavaScript or physical-device performance. Test evidence comes from the linked repository verification documents; production acceptance is not claimed.

Author: **vishnu-tharan**.
