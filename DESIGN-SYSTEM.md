# Tiger Town — Design System

Last updated: 2026-08-17

---

## Brand

Tiger Town is Jen and Garth's personal creative lab. The site is a project portfolio — spare, direct, and handmade-feeling. No marketing language, no grid overlays, just work.

**Tone:** confident and unpretentious. The copy says "builds cool shit." The design backs that up.

---

## Color

```
--bg:             #fffcf5   Warm off-white — page background
--text-primary:   #111111   Near-black — headings, active states, current nav
--text-secondary: #c0c0c0   Light gray — body links, inactive nav, captions
--text-mid:       #555555   Mid gray — available but not currently used
--accent:         #aeffd0   Mint green — paint trail only, not used in UI
```

**Rule:** the palette is intentionally minimal. Near-black, a warm off-white, and one gray for most things. The background is deliberately not pure white — the warmth is what keeps a spare layout from reading as clinical. The mint only appears as the cursor paint effect; it's never used as a UI color.

---

## Typography

**Font family:** Funnel Display (Google Fonts) — weights 400, 700, 800

A geometric display sans with a slightly quirky, architectural quality. The site uses three weights: regular for body, bold for headings, and extrabold sparingly. It replaced Syne, and as of 2026-08-17 no reference to Syne remains.

A self-hosted copy in `src/fonts/` is declared as an `@font-face` at the top of style.css, so the site keeps its typeface if Google Fonts is unreachable.

**To swap fonts:** three places — the Google Fonts URL in `// ── FONT ──` in main.js, the `@font-face` block and its file in `src/fonts/`, and `font-family` in `html, body` in style.css.

### Type Scale

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Homepage H1 line 1 | `clamp(2.375rem, 6vw, 3.875rem)` | 700 | text-primary | Fluid, tight tracking |
| Homepage H1 line 2 | `clamp(1.9rem, 4.8vw, 3.1rem)` | 400 | text-secondary | Same fluid scale, lighter |
| Project title | `clamp(1.8rem, 4.5vw, 2.8rem)` | 700 | text-primary | |
| Project intro | 1.6rem | 400 | text-primary | Lead paragraph |
| Project details | 1rem | 200 | text-primary | Secondary body copy |
| Additional details label | 0.7rem | 200 | text-primary | Uppercase, spaced |
| Section labels (TECHNICAL etc) | 0.68rem | 700 | text-primary | Uppercase, 0.14em tracking |
| Nav / link list | 0.875rem | 400 | text-secondary | |
| WIP tag | 0.55rem | 700 | text-secondary | Uppercase, bordered |
| Modal caption | 0.875rem | 400 | rgba(0,0,0,0.45) | Centered |

**Letter spacing:** `-0.02em` on large display text. Tighter is more editorial.

**Line height:** `1.1` for display, `1.3` for intro, `1.35` for body details.

---

## Spacing

The site uses a small set of spacing values — not a formal scale, but consistent in practice:

| Use | Value |
|---|---|
| Page padding (desktop) | 64px (`--page-pad`) |
| Page padding (mobile) | 24px |
| Logo margin-bottom | 80px |
| Nav margin-bottom | 80px |
| Hero margin-bottom | 96px |
| Project header margin-bottom | 32px |
| Photo grid gap | 14px |
| Bottom nav margin-top | 80px |
| Bottom nav padding-top | 32px |
| Link list item gap | 8px |
| Column gap (nav + link grid) | `--col-gap: clamp(48px, 15vw, 212px)` — fluid; 212px is the ceiling |

---

## Layout

**Max width:** 1200px, centered, with 64px side padding on desktop.

**Grid system:** not a traditional grid. Two patterns:

1. **Full-width justified photo grid** — JS-built rows that fill the container width at a target row height of 280px. Images are never cropped; aspect ratios are preserved.

2. **Two-column link layout** — `grid-template-columns: max-content max-content` with `--col-gap`. Used for both the homepage project list and interior bottom nav. Columns are content-width (not stretched).

---

## Logo

Two versions:
- `tiger-town-animated.svg` — full lockup (cat mark + TIGER TOWN text)
- `tiger-town-mark-animated.svg` — cat mark only

Both have animated white pupils that slide left/right inside the black eye shapes. The black layer is static; only the white `<g id="white">` paths animate.

**Size:** 56px height, width auto.

**Animation controls** (edit in VS Code, inside `<g id="white">`):
- `values` — travel distance, e.g. `"5,0; 5,0; -5,0; -5,0; 5,0"`
- `dur` — cycle duration, e.g. `"10s"`
- `keyTimes` — timing of each position as 0–1 fractions of `dur`
- `calcMode="linear"` — instant snap, no easing

**Favicon:** `favicon.svg` — cat mark only, static.

---

## Cursor

Custom cursor replaces the system cursor sitewide.

- **Shape:** 8×8px circle (`border-radius: 50%`). Change to `0` for square.
- **Color:** `--text-primary`
- **Paint trail:** mint green blobs that fade behind the cursor as it moves
- **Modal:** cursor dot floats above the modal (z-index 1001)
- **Mobile:** disabled — system cursor restored, paint canvas hidden

---

## Components

### Logo / Nav
Interior pages use `.nav` — a flex row containing the logo as a link back to index. Homepage uses `.logo` — same image, no link wrapper, with `margin-bottom: 80px`.

### Link Grid (homepage)
Two-column layout built by main.js from the `PROJECTS` array. Section labels in uppercase, links in text-secondary, hover → text-primary.

### Bottom Nav (interior)
Same visual structure as the homepage link grid. Built by main.js. Current page is auto-detected from `window.location.pathname` and displayed bold in text-primary.

### Photo Hero
Full-width image at 3:2 aspect ratio. Clicking opens the modal at index 0. Fades in on load.

### Justified Photo Grid
JS-built rows of images at matched heights. Target row height 280px. Last row left-aligned at natural height. Images fade up on scroll via IntersectionObserver.

### Modal
- Triggered by clicking any grid image or the hero
- Full-screen white overlay (100% opacity)
- X button (top right) — bordered box, SVG icon
- Prev/Next chevron arrows (left/right edges)
- Caption centered below image
- Keyboard: ← → Escape
- Touch: swipe left/right (40px threshold)
- Injected by main.js — not in any HTML file

### WIP Notice
Dashed-border box used on photo-booth.html. Styled via `.wip-notice`.

### WIP Tag
Small bordered label used inline in nav lists next to Photo Booth. Styled via `.wip-tag`.

---

## Animation

**Page entrance:** elements fade up on load via `@keyframes fadeUp` (opacity 0→1, translateY 8px→0). Staggered delays per element.

**Scroll reveal:** photo grid items fade up as they enter the viewport (same keyframe, triggered by IntersectionObserver). 60ms stagger between items in the same row.

**Paint trail:** canvas-based, mint green circles drawn along the mouse path, each fading over 90 frames.

**Logo pupils:** SVG `<animateTransform>` on white path elements inside the logo file.

---

## Mobile (< 580px)

- Page padding drops from 64px to 24px
- Custom cursor and paint canvas disabled, system cursor restored
- Link grid stacks to single column
- Bottom nav stacks to single column
- Photo grid and hero gaps reduce to 6px
- Modal prev/next padding reduces

---

## File Map

Eleventy: sources in `src/`, build output to `_site/` (gitignored). No hand-edited HTML.

```
/
├── .eleventy.js                   Config — input src/, output _site/, njk only
├── package.json                   npm run dev / npm run build
└── src/
    ├── index.njk                  Homepage
    ├── about.njk
    ├── alt-baking.njk             Project pages
    ├── bear-car.njk
    ├── boombox-suitcases.njk
    ├── cabinet-desk.njk
    ├── coffee-grinder.njk
    ├── coffee-roasting.njk
    ├── disco-dancefloor.njk
    ├── sound-level-monitor.njk
    ├── vegan-ice-cream.njk
    ├── wedding-save-the-date.njk
    ├── photo-booth.njk            WIP
    ├── _includes/
    │   ├── layouts/               Shared page shell
    │   └── grid-script.njk        Justified grid builder
    ├── _data/site.json            Site-wide data
    ├── style.css                  All styles
    ├── main.js                    All shared behavior
    ├── fonts/                     Self-hosted Funnel Display fallback
    ├── tiger-town-animated.svg    Full logo, animated pupils
    ├── tiger-town-animated-mark.svg
    ├── tiger-town-animated-stacked.svg
    ├── tiger-town-mark-animated.svg
    ├── favicon.svg                Mark only, static
    ├── OG_image_1200x630.png
    └── images/
        ├── logo/                  (legacy GIF, no longer used)
        ├── about/
        ├── alt-baking/
        ├── bear-car/
        ├── boombox-suitcases/
        ├── coffee-grinder/
        ├── coffee-roasting/
        ├── disco-dance-floor/
        ├── felt-show/
        └── ice-cream/
```

---

## Single Sources of Truth

All paths under `src/`.

| What | Where |
|---|---|
| Font | `// ── FONT ──` in main.js, plus the `@font-face` at the top of style.css |
| Logo file | `// ── LOGO ──` in main.js |
| Project list / nav links | `// ── PROJECTS ──` in main.js |
| Column gap | `--col-gap` in `:root` in style.css |
| All other visual styles | style.css |
| Logo animation | `<g id="white">` in tiger-town-animated.svg |
| Page shell | `_includes/layouts/` |
