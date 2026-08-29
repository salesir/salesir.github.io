# Arian Charkhgari — Portfolio

Static portfolio site for AI/ML, desktop tooling, simulation, and Unity work.
No build step and no package installation required.

## Run locally

Open `index.html` in a modern browser, or serve this directory with any
static-file server. The site is fully client-side.

```bash
python -m http.server 8899
```

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Identity, résumé, contact, and the section shells |
| `js/particles.js` | Hero canvas — the ambient particle-network background |
| `js/projects-data.js` | Case-study content: one entry per project |
| `js/projects.js` | The codex — project index on the left, spec sheet + parts on the right |
| `js/app.js` | Bootstrap, hero CTA, typewriter, nav, scroll reveal |
| `css/` | Tokens (`variables.css`), reset (`base.css`), then per-section styles |

## Content rules

**Every factual claim on this site must be traceable to a source document.**
Skills, coursework, dates, and metrics come from Arian's CV, résumés, and the
Fresno State registrar letter. Do not add a technology, course, or number that
is not documented somewhere — an unverifiable claim on a portfolio is worse
than an omission, because it is the first thing an interviewer will probe.

- Update identity, résumé summary, and contact information in `index.html`.
- Add or revise case studies in `js/projects-data.js`. Project `content` is
  hand-authored HTML and must remain trusted, source-controlled content; do not
  feed it unreviewed external or user-provided input.
- Each project takes a `spec` block (`summary`, `role`, `stack`, `facts`). That
  is what renders in the index and the spec sheet, so it is what a visitor
  reads in the first few seconds. Keep `facts` concrete and measured.
- Add portfolio images to `assets/` and reference them relative to the site
  root. Use screenshots that clearly show the project, omit personal account
  data, and give every image descriptive alt text.

## Design intent

The hero keeps the particle-network background. A data-driven alternative (a
plot of the real training LR schedule, plus a band of measured metrics) was
built and rejected — see `_backup/README.md`. Do not reintroduce it without
asking.

Projects are one persistent index plus a single panel: every project is
readable at a glance on the left, and selecting one swaps the panel on the
right. The panel leads with a spec sheet so the essentials are visible without
a click.

Section scrolling uses `scroll-snap-type: y proximity`. Proximity, never
mandatory — long sections must stay freely scrollable through the middle.

Hero spacing is viewport-relative (`clamp(..., vh, ...)`) so the scroll cue
stays above the fold on short viewports. Check it at 1860x870, not just in a
narrow preview pane.

Scroll reveal is decorative only. `js/app.js` adds the `reveal` classes, reveals
on intersection, and then strips the classes entirely, with a scroll-based
watchdog as a second path. Content must never depend on an animation completing
in order to be visible.

## Verification

Run after JavaScript changes:

```bash
node --check js/app.js && node --check js/instrument.js && node --check js/projects.js && node --check js/projects-data.js
```

Then check in a real browser at desktop and mobile widths:

- "View My Work" opens the first project and focuses its case-study title;
  clicking its left, centre, and right edges all work.
- The scroll cue lands on `#projectsHeader`, so the open project's spec sheet
  is visible, **without** opening or switching a project.
- The whole hero, scroll cue included, fits above the fold at 1860x870.
- Tab/Enter reach both controls; arrow keys move through the project index.
- No horizontal overflow at 375px.

## Backups

`_backup/v1-pre-redesign/` holds the pre-redesign snapshot. The hero has since
been reverted to match it; the codex redesign was kept. Read
`_backup/README.md` before restoring anything.

## Open gaps

**Coursework is verified.** Every course in the "Relevant Coursework" line of
`index.html` appears on the complete Fresno State transcript
(`Downloads/FR_TRNS_RPTS.pdf`, printed 2026-08-28: 126 units, B.S. Computer
Science conferred 2026-05-22). Dean's List Spring 2023 and Spring 2025 are both
on it. Re-check against that file before adding a course.

The list is curated by **relevance to the projects shown on this site**, not by
grade, and it is deliberately short. Grades and GPA are never displayed.
Courses taken but deliberately not listed: Computer Organization, Programming
Languages, Computational Science, Intro Computer Systems, Foundations of CS.
**Media.** Career Resource Center is illustrated with seven captures made
against a fictional culinary job seeker, so no real person's data appears.
Keep it that way: never capture the chat tab with a real signed-in session,
and never capture a real résumé.

Project Corvex's newest work (the arena system, July 2026) has no usable
capture, and `docs/README.md` there still names `RiftHuntVerticalSlice.unity`
as the build scene — that file no longer exists; the current scene is
`BossApproachArena.unity`.

Screenshots live in the user's `Pictures/Screenshots` folder, which mixes
project captures with credentials and immigration paperwork. Never pull from
it in bulk; look at every file before using it.
