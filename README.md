# Tiger Town Lab

The project site for **Tiger Town** — Jen Murse and Garth Webb's personal creative lab.

**Live:** [tigertownlab.com](https://tigertownlab.com)

## What it is

A portfolio of things we've built: coffee roasting rigs, baked goods, a bear car, boombox suitcases,
cabinetry, stickers. One page per project, each with photography and a short set of details. Spare
and handmade-feeling by intent — no marketing language, no hero copy, just the work.

The one flourish is the cursor, which leaves a mint paint trail across the page.

## Built with

| | |
|---|---|
| **Generator** | [Eleventy](https://www.11ty.dev) 3.x — Nunjucks templates, one `.njk` per project |
| **Styles** | Plain CSS, tokens on `:root`. No preprocessor, no utility framework. |
| **Scripts** | `main.js` — font injection and the paint-trail cursor. No dependencies. |
| **Type** | Syne (Google Fonts), loaded from `main.js` rather than the HTML head |
| **Hosting** | Vercel — pushes to `main` deploy automatically |

## Layout

```
src/
  _data/        # site data
  _includes/    # layouts and partials
  *.njk         # one file per project, plus about
_site/          # build output (gitignored)
```

## Running it

```sh
npm install
npm run dev     # eleventy --serve, with live reload
npm run build   # writes to _site/
```

## Docs

- [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) — colour, type, layout, and the rules behind them
- [`DECISIONS.md`](DECISIONS.md) — specific values and what to change when swapping fonts or colours

## Credit

Design and build by [Jen Murse](https://jenmurse.com). Syne is licensed under the SIL Open Font
License. Project photography is Jen and Garth's own.
