# VISHNU — cinematic portfolio

A buildless, framework-free portfolio for Vishnutharan Bavachelvan. HTML, CSS, native JavaScript modules, and four visibility-gated WebGL atmosphere canvases.

## Run

```sh
python tools/serve.py 5173
```

Open http://localhost:5173. Deploy the contents of `dist/` to any static host. There is no install or compilation step.

## Content and interaction

- `dist/index.html`: semantic page, personal details, contact links.
- `dist/style.css`: responsive desktop/portrait layouts and animation.
- `dist/src/main.js`: project data, accessible project dialogs, six-year timeline, keyboard navigation, reduced motion, visibility lifecycle.
- `dist/src/stage.js`: WebGL ember, orbital, clockwork floor, and finale atmospheres. No WebGL support falls back to the CSS background with all content usable.

The Work section contains five repository-linked projects: Lanka Agri-Direct (group project; team member), University Gateway, cashManage, CEB-Management, and CinemaStream. Covers use original name-based graphics, not official logos or application screenshots.

Community details: AIESEC member, IEEE member, Vanni Vogue Camera Club member, and JamporIEEE organizing committee (Logistics team). Competition details: IEEEXtreme 17.0 and 18.0 participant, and IEEEXtreme 18.0 organizing committee member. Undated memberships and organizing roles remain outside the dated timeline.

## Missing original media

Only the text brief was attached. The reference images, walking-person source footage, universe movie, and two footer stills were not supplied. This implementation therefore uses an original typographic / procedural direction, not an exact reconstruction of those unavailable references. It does not pretend a generated person is Vishnu.

To finish the footage-based art direction, supply the original portrait/video, universe film, project artwork/screenshots, and finale images. The original brief's matte/extraction scripts cannot be reconstructed or verified against absent source pixels. No unimplemented matte pipeline is claimed here.

## Review

`?t=end` settles and pauses the canvas atmosphere; `?t=3.2` sets its time. `window.__shot('name')` downloads the visible atmosphere canvas (not the DOM layers). `window.__chrono.targetU = 2.5` drives the continuous clock hand. Motion can be paused with the bottom-right control, and system reduced-motion is respected.

Keep `overflow-x: clip` on body so sticky scenes retain document scrolling. Body copy and controls remain in the DOM for selection, keyboard access, and screen readers. Background animation stops while off-screen or when the tab is hidden.
