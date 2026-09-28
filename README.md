# VISHNU — Personal Portfolio

My personal portfolio showcasing my projects, technical skills, education, and community involvement.

I'm Vishnutharan Bavachelvan, a full-stack developer and B.Sc. (Hons) Information Technology undergraduate at the University of Vavuniya, available for remote work worldwide and on-site work in Sri Lanka.

## About the portfolio

The portfolio uses a black-and-red cinematic design with animated WebGL backgrounds, an interactive journey timeline, and project cards with individual visual identities.

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

## Contact

- Email: [bavachelvanvishnutharan@gmail.com](mailto:bavachelvanvishnutharan@gmail.com)
- GitHub: [vishnu-tharan](https://github.com/vishnu-tharan)
- LinkedIn: [Vishnutharan Bavachelvan](https://www.linkedin.com/in/vishnutharan-bavachelvan-5419a02b3/)

## Project content and contact form

Edit `dist/src/project-data.js` to update project descriptions, contributions and evidence links. The Buyora image comes from its repository's `docs/verification/login-chromium.png`; University Gateway and cashManage images show actual local builds (sign-in and an empty guest dashboard respectively). Captions identify these states. Testing notes refer to repository documentation, not production certification. No public application demo is claimed.

`dist/recruiter.css` contains the responsive layout refinements. `dist/social-preview.html` is the source for the 1200 × 630 social sharing image.

The contact form submits through FormSubmit with its default spam verification and a hidden honeypot. The owner must click **Activate Form** in the email from FormSubmit before delivery works. An activation request has been sent; delivery still needs an owner-confirmed test after activation. Direct email and phone links remain available. The form discloses the third-party processor and redirects to `contact-sent.html` after submission. Update the form's `_next` URL if the hosting address changes.

## CV

The portfolio includes a responsive [CV page](dist/cv.html) and a [downloadable PDF](dist/assets/Vishnutharan-Bavachelvan-CV.pdf), linked from the introduction, navigation and contact section.

Edit `tools/cv-data.json`, then run `python tools/build_cv.py` with ReportLab installed to regenerate both formats. The PDF is also saved to `output/pdf/`. The CV highlights selected projects; the full project list remains in the portfolio. Buyora is included as a development project, without a claim of completed production validation.

Author: **vishnu-tharan**.
