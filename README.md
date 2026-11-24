# VISHNU — Personal Portfolio

My personal portfolio showcasing technical skills, education, and community involvement.

I'm Vishnutharan Bavachelvan, a full-stack developer and B.Sc. (Hons) Information Technology undergraduate at the University of Vavuniya, available for remote work worldwide and on-site work in Sri Lanka.

## About the portfolio

The portfolio keeps its black-and-red design with an interactive education timeline.

- Dark and light modes with a saved preference
- Responsive layouts for desktop and mobile
- Keyboard-accessible navigation
- Static background accents without continuous decorative animation
- Education, certificates, memberships, a common CV and contact details

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
    main.js        Page reveals
    journey.js     Education timeline
tools/
  serve.py         Local development server
```

To deploy, serve the contents of `dist/` with any static website host.

## Appearance and interactions

The header provides a dark/light toggle and saves the selected theme locally when storage is available. Both themes use static gradient accents. The education timeline is interactive. The portfolio does not load a terminal, search dialog, sound engine or GitHub activity feed.

The profile card uses the supplied photo in `dist/assets/vishnu-profile.jpeg`, preserving its natural proportions. Mobile layouts include larger touch targets, safe-area spacing. Light-theme refinements are in `dist/light-mode.css`.

After changing assets, run `python tools/version_assets.py <new-release-name>` before publishing. This updates HTML asset URLs and module imports together.

## Verification

Run `node --test tools/portfolio.test.mjs` to check local links, browser module dependencies and security policies. The website itself has no Node dependency or build step. Preview with the local Python server before publishing.

Browser checks cover dark/light themes, saved appearance, responsive layouts, and education navigation. Mobile checks use browser viewport emulation.

The GitHub Pages workflow publishes `dist/` when commits reach `main`. The local publishing checkout under `.sites-runtime/github-publish/` contains the matching GitHub history; the main workspace keeps the editable site files.

## Contact

- Email: [vtharan.b@gmail.com](mailto:vtharan.b@gmail.com)
- GitHub: [vishnu-tharan](https://github.com/vishnu-tharan)
- LinkedIn: [Vishnutharan Bavachelvan](https://www.linkedin.com/in/vishnutharan)

## Contact form

`dist/recruiter.css` contains the responsive layout refinements. `dist/social-preview.html` is the source for the 1200 × 630 social sharing image.

The contact form submits through FormSubmit with its default spam verification and a hidden honeypot. FormSubmit accepted a test submission to the configured address and returned its success page. Receipt in the Gmail inbox still needs owner confirmation. Direct email and phone links remain available. The form discloses the third-party processor and redirects to `contact-sent.html` after submission. Update the form's `_next` URL if the hosting address changes.

## CV

The portfolio has one [common CV](dist/cv.html) and [downloadable PDF](dist/assets/Vishnutharan-Bavachelvan-CV.pdf). The one-page CV includes the academic heading, technical skills, education, competitions, leadership, certificates and two academic references. Previous role-specific page URLs redirect to the common page, and their historical PDF URLs serve the same common document.

Edit `tools/cv-data.json`, then run `python tools/build_cv.py` with pypdf installed to regenerate the common PDF/web CV and compatibility copies for historical download URLs. The main PDF is also saved to `output/pdf/`. Run `python tools/check_cv.py` with pdfplumber to verify the monochrome layout, content, links, academic heading and consistency of all old URLs. Render and inspect both pages, then run `python tools/version_assets.py <new-release-name>`.

The source has one `general` profile. `certificate_descriptions` supplies concise CV wording for participation and merit entries; the portfolio retains the fuller evidence descriptions. Confirmed dates remain supported without placeholders for unknown dates.

CVs use a single column with black text, gray secondary text, thin rules below section headings, a concise profile and five skill groups. There is no rule above the name. The academic subtitle and contact links appear directly below it. Tools include Linux and GitHub Actions; Playwright and Vitest are omitted. The common profile enables `refined_layout`. Contact links have short labels, and education separates the institution from its dates. The web document stays white in both themes; surrounding controls use monochrome light/dark colors. All legacy PDF aliases are byte-identical to the common download. Selectable text and logical reading order support applicant-tracking compatibility; no automated screening score is claimed. The common CV has no targeted job title.

## Certificates and recognition

Seven supplied certificates have descriptive filenames in `dist/assets/certificates/`, with organized copies in `output/certificates/`. Original files are preserved. The gallery uses existing portfolio colors in both themes, responsive cards, lazy previews and direct view/download links.

`tools/certificate-data.json` is the shared source for the gallery and the common CV. It separates SQL course completion, Cursor AI workshop participation, Trailblazers development-event participation, the school Accounting & ICT merit award, and participation in IEEEXtreme 17.0, IEEEXtreme 18.0 and HACKFORCE '23. No competition ranking or professional certification is inferred from participation.

After editing the metadata, run `python tools/build_certificates.py`, then `python tools/build_cv.py`. Run `python tools/check_certificates.py` and `python tools/check_cv.py` to check files, content and links. PDF preview images are rendered from the supplied documents using Poppler. Finish with `python tools/version_assets.py <new-release-name>` and browser checks before publishing.

Author: **vishnu-tharan**.

Contact and security update (18 October 2026): the portfolio and all current/legacy CV downloads use vtharan.b@gmail.com. LinkedIn is https://www.linkedin.com/in/vishnutharan. A copy-email shortcut works in both themes. See the contact form section for the latest delivery check. See SECURITY-AUDIT.md for findings, checks and hosting limitations. Run tools/version_assets.py after generating pages to apply the browser security policy.

## Editing the code

See [CODE-GUIDE.md](CODE-GUIDE.md) for the file map, simple coding conventions and preview/check commands. Website source files use normal indentation and separate functions for page reveals and the education timeline.

## Supplied CV PDF

`tools/cv-source.pdf` is the master PDF. `python tools/build_cv.py` copies it unchanged to current and legacy downloads and rebuilds the web CV from `tools/cv-data.json`. To replace it, use `python tools/build_cv.py --pdf PATH_TO_NEW_PDF`, keep the metadata consistent, then run `python tools/check_cv.py`. The reference phone field is optional. Run the asset version script after rebuilding.
