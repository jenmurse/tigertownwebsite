# Tiger Town — Site Design Decisions

Last updated: 2026-08-17

## Typography

| Element | Value | Notes |
|---|---|---|
| Font | Funnel Display (Google Fonts) | weights 400, 700, 800 — injected via main.js, not HTML. Self-hosted `@font-face` fallback at the top of style.css, from `src/fonts/`, for when Google Fonts is unreachable. |
| Homepage hero line 1 | `clamp(2.375rem, 6vw, 3.875rem)` / weight 700 | line-height 1.1, letter-spacing -0.02em |
| Homepage hero line 2 | `clamp(1.9rem, 4.8vw, 3.1rem)` / weight 400 | line-height 1.1, letter-spacing -0.02em, color: text-secondary |
| Project title | `clamp(1.8rem, 4.5vw, 2.8rem)` / weight 700 | line-height 1.1, letter-spacing -0.02em |
| Project intro | 1.6rem / weight 400 | color: text-primary, line-height 1.3, letter-spacing -0.01em |
| Project additional-details label | 0.7rem / weight 200 / uppercase | color: text-primary, line-height 1.8 |
| Project details | 1rem / weight 200 | color: text-primary, line-height 1.35 |
| Nav/section labels | 0.68rem / weight 700 / uppercase | letter-spacing 0.14em |
| Link list items | 0.875rem / weight 400 | color: text-secondary, hover → text-primary |

**To swap fonts:** three places, not two — the Google Fonts URL in `// ── FONT ──` in main.js, the
`@font-face` block at the top of style.css along with the file in `src/fonts/`, and `font-family` in
`html, body` in style.css.

**Three rules set their own `font-family` rather than inheriting it** — `.modal-close`,
`.modal-caption` and `.modal-counter`. All three named `'Syne'` until 2026-08-17, so all three had
been falling back to `sans-serif` since the switch; `.modal-caption` is the one that was visible.
`.modal-close` genuinely needs its own declaration, because there is no global button reset and
buttons do not inherit the family. Any new rule that names a family is a place this can break again.

## Colors

| Variable | Value | Notes |
|---|---|---|
| `--bg` | `#fffcf5` | warm off-white, not pure white |
| `--text-primary` | `#111111` | |
| `--text-secondary` | `#c0c0c0` | links, inactive states |
| `--text-mid` | `#555555` | available, not currently applied |
| `--accent` | `#aeffd0` | mint green — paint trail color |

## Layout

| Property | Value | Where |
|---|---|---|
| Max content width | `--max-width: 1200px` | style.css `:root` |
| Page padding (desktop) | `--page-pad: 64px` | style.css `:root` |
| Page padding (mobile) | `--page-pad: 24px` | style.css `@media` |
| Column gap (links + nav) | `--col-gap: clamp(48px, 15vw, 212px)` | style.css `:root` — controls both homepage link grid and interior bottom nav. Fluid now; 212px is the ceiling, not the value. |
| Gallery height (legacy) | `--gallery-h: 62vh` | desktop only |

**To change column gap:** edit `--col-gap` in `:root` in style.css. This controls both the homepage link grid and the interior bottom nav simultaneously.

## Page Title Format

`Project Name | Tiger Town` — pipe separator, no em dash

## Architecture

**All styles live in `style.css` only.** No inline styles in HTML.

**All shared behavior lives in `main.js`:**
- Font injection
- Cursor + paint trail
- Favicon injection
- Logo src (single place to change logo file)
- Projects list (single source of truth for all nav links)
- Bottom nav builder (auto-detects current page)
- Homepage link grid builder
- Modal shell injection

**The site is built with Eleventy.** Sources live in `src/` as Nunjucks templates (`.njk`), one per
project, with shared layout in `src/_includes/layouts/` and site data in `src/_data/site.json`.
`npm run build` writes to `_site/`, which is gitignored. There are no hand-edited HTML files.

**Each page template contains only:**
- Page-specific content (title, copy, image list)
- Justified grid builder
- Scroll reveal
- Modal image/caption data

style.css is organized in this order:
1. Variables (`:root`)
2. Base (`html`, `body`)
3. Cursor + Paint
4. Page Shell
5. Animations (`@keyframes`)
6. Logo
7. Nav (interior)
8. Homepage Hero
9. Homepage + Bottom Link Grid
10. Project Header
11. Project Hero (single + duo)
12. Justified Photo Grid + scroll reveal
13. Modal + Modal Caption
14. Bottom Nav (interior pages)
15. WIP Notice
16. Horizontal Gallery (legacy, kept for reference)
17. Mobile (`@media`)

## Logo

- **File:** set in `// ── LOGO ──` in main.js — change filename there to swap globally
- **Current file:** `tiger-town-animated.svg` (full logo with TIGER TOWN text)
- **Alt file:** `tiger-town-mark-animated.svg` (cat head mark only, no text)
- **Height:** 56px on all pages (`.logo img` and `.nav .logo img` in style.css)
- **Format:** Animated SVG — white pupils slide left/right inside black eye shapes
- **Animation structure:** `<g id="black">` (static) + `<g id="white">` (animated)
- **Animation variables in the SVG file:**
  - `values` on each white path — controls travel distance (e.g. `"5,0; 5,0; -5,0; -5,0; 5,0"`)
  - `dur` — controls cycle speed (e.g. `"10s"`)
  - `keyTimes` — controls timing of each position
  - `calcMode="linear"` — instant snap between positions (no easing)
- **Favicon:** `favicon.svg` — cat head mark only, injected via main.js

## Projects List

Defined once in `// ── PROJECTS ──` in main.js. Controls:
- Homepage link grid (both columns)
- Interior page bottom nav (both columns, current page auto-detected)

To add/rename/remove a project: edit the `PROJECTS` object in main.js only.

## Photo Layout (interior pages)

- **Hero:** first image, full-width, 3:2 aspect ratio, clickable (opens modal at index 0)
- **Grid:** justified rows — JS measures natural image ratios, packs rows to fill container width
- **Target row height:** 280px. Gap: 14px
- **Last row:** not stretched — images sit at natural 280px height, left-aligned
- **Scroll reveal:** grid items fade up (opacity 0→1, translateY 12px→0) as they enter viewport, 60ms stagger per row. Hero always immediately visible.

## Modal

- **Overlay:** 100% white, fully opaque
- **Close button:** X icon in a 28×28px bordered box, color: text-secondary, hover → text-primary. `cursor: none` maintained.
- **Prev/Next arrows:** SVG chevrons, fixed to left/right edges
- **Caption:** centered below image, `padding-top: 14px`, color: rgba(0,0,0,0.45)
- **Counter:** removed
- **Cursor:** custom dot visible over modal (z-index: 1001, above modal z-index: 1000)
- **Keyboard:** ← → Escape
- **Swipe:** touch supported (threshold: 40px)
- **Modal HTML:** injected by main.js — not in any HTML file

## Cursor

- **Shape:** 8×8px dot, `border-radius: 50%` — change to `0` for square
- **Color:** `--text-primary` (#111111)
- **z-index:** 1001 (above modal)
- **Paint trail:** mint `#aeffd0`, fades out over 90 frames, radius ~26px
- **Mobile:** cursor and canvas hidden at < 580px, system cursor restored

## Bottom Nav (interior pages)

- Two-column grid using `--col-gap` variable
- Current page: bold, color text-primary
- Populated by main.js — no HTML edits needed
- Mobile: stacks to single column

## Project Category Labels

- Hidden globally via `display: none` on `.project-category` in style.css
- HTML elements remain in each page
- To re-enable: change `display: none` to `display: block`

## File Responsibilities

All paths are under `src/`.

| File | Responsibility |
|---|---|
| `style.css` | All visual styles, global layout, variables |
| `main.js` | Font, cursor, paint, favicon, logo, projects list, nav, link grid, modal shell |
| `_includes/layouts/` | Shared page shell |
| `_data/site.json` | Site-wide data |
| `tiger-town-animated.svg` | Full logo (cat + TIGER TOWN text) with animated pupils |
| `tiger-town-mark-animated.svg` | Cat head mark only with animated pupils |
| `favicon.svg` | Cat head mark, static, for browser tab |
| Each `[page].njk` | Content, image list, justified grid JS, modal data |

---

## Open Questions

- [ ] Videos — embed YouTube/Vimeo or link out?
- [ ] Image order per page — will be curated after layout is finalized
- [x] Font — switched from Syne to Funnel Display. Done, and the last stray reference is gone.
- [x] About page — `about.njk` exists.

---

## How to use this file with Claude

> "I'm working on the Tiger Town website. Here is the current DECISIONS.md. All styles live in style.css. Drop the files I want you to edit. Please read this file before making any changes."

For visual changes: **drop src/style.css only.**
For content/structure changes: drop the relevant `.njk` template(s).
For nav/logo/font changes: drop **main.js only.**
For logo animation changes: edit **tiger-town-animated.svg or tiger-town-mark-animated.svg in VS Code.**
