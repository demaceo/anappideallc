# Logo: the neon bulb

A blacklight-style neon bulb with curly braces inside. The bulb is the idea, the
braces are the build, and the UV glow is the "made visible" part of the story.

## Files

| File | Use | Notes |
| --- | --- | --- |
| `public/favicon.svg` | Browser tab (SVG-capable browsers) | Heavy stroke, no glow |
| `public/favicon-32x32.png`, `favicon-16x16.png`, `favicon.ico` | Fallback favicons | 16px uses its own stroke weight |
| `public/apple-touch-icon.png` | iOS home screen | Full-bleed square (iOS rounds it) |
| `public/icon-192.png`, `icon-512.png` | Web manifest | Rounded tile, soft glow |
| `public/logo.png` | Schema.org `logo` (`src/lib/seo.ts`, `index.html`) | Same render as `icon-512.png` |
| `public/brand/neon-bulb-violet-transparent.svg` / `.png` | Placing the mark on any background (slides, docs, social) | Mark only, UV violet, no glow. Reads on white and on ink. PNG is 900x1230 |
| `public/brand/neon-bulb-gold-transparent.svg` / `.png` | One-color use (stamps, embroidery, engraving) | Mark only, flat gold. Muted on dark backgrounds: use violet there |

`public/favicon_1.svg` is an unreferenced duplicate of `favicon.svg`.

The `public/brand/` files share the same geometry as the favicon, cropped tight
to the mark (`viewBox="20 10 60 82"`, stroke 4.5). They are served from the site,
so they are linkable at `/brand/<file>`.

## Colors

| Token | Value | Role |
| --- | --- | --- |
| Ink | `#0f0e0c` | Tile background |
| UV violet | `#9b6dff` | The whole mark |
| Gold | `#b8860b` | One-color (flat) version only |

## Geometry (100-unit box)

Everything is a single-weight round-capped line. Stroke is 4.5 at 512px, 6.5 at
16px, 7 at 32px and in the SVG favicon; glow only at 180px and above.

```
Glass   M38 66 C29 58 26 50 26 40 A24 24 0 1 1 74 40 C74 50 71 58 62 66 Z
Braces  M46.5 45 Q42.3 45 42.3 49.2 V52.7 Q42.3 55.5 39.5 55.5 Q42.3 55.5 42.3 58.3 V61.8 Q42.3 66 46.5 66
        M53.5 45 Q57.7 45 57.7 49.2 V52.7 Q57.7 55.5 60.5 55.5 Q57.7 55.5 57.7 58.3 V61.8 Q57.7 66 53.5 66
Base    M39 72 H61 M42 79 H58 M46 86 H54
```

Proportions that were chosen on purpose:

- Glass is a 48-unit circle centered at (50, 40) narrowing to a 24-unit neck.
- Braces are 70% of the original size (21 x 21), with their bottoms flush on the
  glass floor line (y = 66), centered horizontally.
- Base is three bars, 22 / 16 / 8 wide, on a 7-unit rhythm.
- The whole mark is centered vertically in its tile by translating up 1 unit
  before scaling about the center.

## Small sizes

At 16px the braces are not legible; the mark reads as a bulb with a dark gap
inside. At 32px and up the braces read. Don't add glow below 180px: it blurs
into the tile.
