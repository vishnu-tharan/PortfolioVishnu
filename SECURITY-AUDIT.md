# Portfolio security review — 18 October 2026

Scope: the static HTML, CSS and JavaScript in `dist`, generated CVs, contact flow,
GitHub API/cache handling and GitHub Pages deployment workflow. Linked project
backends, third-party services, account settings and historical Git objects are
outside this source review. This is not a penetration-test certification.

## Findings and changes

- Unexpected GitHub event types such as `constructor` could select inherited
  object properties and crash feed rendering. Own-property lookup now falls back
  safely. Repository dot segments are rejected and cached event arrays bounded.
- Project URL attributes previously trusted repository-authored data. There was
  no demonstrated remote input route, but future imports could make this unsafe.
  URL allowlists and attribute escaping now restrict links to GitHub and images
  to local project assets.
- Added a Content Security Policy to every HTML page. Scripts are local, inline
  JSON-LD has an exact hash, connections allow only this site and GitHub's API,
  form submission permits FormSubmit, and objects, frames and base overrides are
  disabled. Inline styles remain permitted for existing animation styles.
  `tools/version_assets.py` reapplies the policy after page generation.
- Terminal commands remain text-only. Destination lookup now ignores inherited
  properties, and command history is capped at 100 entries.
- Deployment actions are pinned to resolved official release commits; checkout
  does not persist credentials. The deployment runs the portfolio test suite.
- No known credential patterns were found in published text assets. No package
  dependency manifest or third-party JavaScript bundle is shipped by this site.
  This does not prove absence of all secrets or vulnerabilities.

## Verification and remaining limits

13 automated checks pass, including malformed API data, malicious URL values,
event prototype keys, reduced motion and WebGL fallback. Four CVs pass layout,
text and contact checks and have been rendered for inspection. Browser checks
cover filters, copy email, theme switching and mobile layout; the contact form
was not submitted as part of this review.

FormSubmit delivers enquiries to `vtharan.b@gmail.com`. The new destination may
need email activation; delivery is not verified. Google Fonts and GitHub remain
external services. The CSP is in HTML because the site uses GitHub Pages;
response-header-only protections such as CSP `frame-ancestors` require a hosting
layer with configurable headers. Do not claim clickjacking protection from this
meta policy. Re-audit when adding remote content, dependencies or authentication.

References:
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/form-action
- https://web.dev/articles/prefers-reduced-motion
