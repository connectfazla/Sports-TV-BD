# nadir.studio · Portfolio

Awwwards-style one-page portfolio built with the [taste-skill](https://github.com/Leonxlnx/taste-skill) design discipline. Static site, no build step.

## Run it

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Any static server works.

## What's inside

| Path | Purpose |
| --- | --- |
| `index.html` | The home page (hero, marquee, work, about, services, quote, contact) |
| `css/tokens.css` | Design tokens: Trust Blue palette, type scale, spacing, motion |
| `css/main.css` | Components, all reading from tokens |
| `js/fluid.js` | three.js fluid shader hero (domain-warped fbm, pointer-reactive) |
| `js/main.js` | GSAP ScrollTrigger choreography |
| `js/theme.js` | Light (default) / dark toggle, persisted |
| `vendor/` | Self-hosted three.js, GSAP, ScrollTrigger, Phosphor Icons |
| `assets/fonts/` | Self-hosted Inter and Space Grotesk (variable, latin subset) |
| `DESIGN-SYSTEM.md` | System documentation |

## Notes

- All content is dummy data for a fictional creative developer.
- Photography is hot-linked from Unsplash (free license); everything else is self-hosted, so the page works offline apart from photos.
- Respects `prefers-reduced-motion` throughout.
