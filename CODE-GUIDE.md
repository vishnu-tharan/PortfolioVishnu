# Portfolio code guide

The website uses HTML, CSS and JavaScript. It runs directly in the browser without a framework or a build step.

## Where to make changes

| File | What it contains |
| --- | --- |
| `dist/index.html` | Main page sections and contact form |
| `dist/src/project-data.js` | Project descriptions, technology lists and repository links |
| `dist/src/project-screenshots.js` | Screenshot order, labels and captions |
| `dist/src/projects.js` | Project cards, case study markup and screenshot selection |
| `dist/src/main.js` | Opening, closing and sharing project dialogs |
| `dist/src/journey.js` | Education years, year buttons and the clock hand |
| `dist/src/preferences.js` | Dark/light mode and saving the chosen theme |
| `dist/src/theme-init.js` | Loading the saved theme before the page appears |
| `dist/src/discovery.js` | Project filters and the copy-email button |
| `dist/src/contact.js` | Contact form validation before submission |
| `dist/src/effects.js` | Scroll progress and the active navigation link |
| `dist/src/viewport.js` | Mobile viewport and header measurements |
| `dist/style.css` | Original page layout and main styles |
| `dist/responsive.css` | Mobile layout adjustments |
| `dist/light-mode.css` | Light theme adjustments |
| `tools/cv-data.json` | Common CV content |
| `tools/build_cv.py` | Creating the matching web CV and PDF downloads |
| `tools/certificate-data.json` | Certificate names, dates and files |

Other CSS files cover the section named in their filename, such as projects, certificates or the CV.

## Coding style

- Use descriptive names such as `selectedYearIndex` and `copyProjectLink`.
- Give each function one clear job.
- Put each step on its own line and use braces for conditions.
- Prefer simple loops and conditions over nested expressions.
- Add short comments to explain a calculation or an important reason.
- Keep project text separate from the code that displays it.
- Keep text escaping and URL checks when displaying project data.
- Keep keyboard controls, focus handling and mobile layouts working.

## Preview and check changes

Run `python tools/serve.py 5173`, then open `http://localhost:5173`.

Run `node --test tools/portfolio.test.mjs` after changing website code. When changing CV content, run `python tools/build_cv.py` and `python tools/check_cv.py` as well.

An optional formatter keeps the source indentation consistent without becoming a website dependency:

```sh
npx --yes prettier@3.6.2 --write "dist/**/*.js" "dist/*.css" "dist/*.html" "tools/*.mjs"
```

After formatting or generating pages, run `python tools/version_assets.py YOUR_RELEASE_NAME`. This updates cached asset links and the browser security policy. Finally, check the page in both themes and at a mobile size before publishing.
