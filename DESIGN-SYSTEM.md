# nadir.studio Design System

Small, token-driven system behind the portfolio. Every component in `css/main.css` reads only the variables defined in `css/tokens.css`. Nothing is hardcoded at the component level.

## Direction

- **Brief:** trustworthy, calm, precise. A portfolio for fintech and health clients where credibility is the product.
- **Dials:** design variance 6 / motion intensity 6 / visual density 4.
- **Foundation:** custom tokens + GSAP for motion + Phosphor for icons + three.js for the hero shader. One system, no mixing.

## Color

Theme name: **Trust Blue**. Light is the default; dark is opt-in via the toggle (persisted in `localStorage`, applied through `[data-theme="dark"]` on `<html>`).

Two raw scales feed the semantic layer:

| Scale | Range | Notes |
| --- | --- | --- |
| `--blue-050 … --blue-900` | brand | primary is `--blue-500` `#2f6fce` |
| `--ink-050 … --ink-900` | neutrals | blue-tinted; pure `#000`/`#fff` never appear |

Components only use semantic tokens: `--bg`, `--bg-raised`, `--bg-sunken`, `--text`, `--text-muted`, `--text-faint`, `--accent`, `--accent-strong`, `--accent-soft`, `--on-accent`, `--border`, `--border-strong`. Both themes remap these twelve names; nothing else changes.

Contrast: body text is `ink-800` on `ink-050` (light) and `ink-100` on `ink-900` (dark), both comfortably past WCAG AA.

## Typography

| Role | Font | Usage |
| --- | --- | --- |
| Display | Space Grotesk | headings, buttons, numerals |
| Body | Inter | paragraphs, UI text |

Fluid scale via `clamp()`: `--text-xs` through `--text-mega`. Headline tracking is `-0.03em`; uppercase labels use `+0.14em`. No serifs; the brief is product, not editorial.

## Spacing and layout

8px base scale (`--space-1` to `--space-24`), plus `--space-section` (fluid 80 to 176px) for vertical rhythm and `--gutter` (fluid 20 to 64px) for page margins. Max content width `--container: 90rem`.

Section layout families on the home page, in order: full-bleed hero, marquee strip, editorial project grid (wide / staggered halves / wide), sticky split about, full-width service rows, centered quote, mega-type footer. No two adjacent sections share a family.

## Motion

Tokens: `--ease-out`, `--ease-in-out`, `--dur-fast|base|slow`. Rules:

- Scroll animation runs through GSAP ScrollTrigger only, never raw scroll listeners.
- The hero fluid field is a three.js shader plane (domain-warped fbm) tinted from the active palette; it re-tints on the `themechange` event and pauses when off-screen.
- `prefers-reduced-motion` collapses everything to a single still frame and instant reveals.
- One marquee on the page, maximum.

## Iconography

Phosphor Icons (web font build, self-hosted in `vendor/phosphor/`), regular weight, sized with `em` so they track the text they sit beside. No hand-rolled SVGs.

## Imagery

Photography is hot-linked from Unsplash (free license) with `auto=format&fit=crop` params. Swap for owned assets before real production use.
