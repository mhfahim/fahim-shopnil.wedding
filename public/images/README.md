# Image slots

All supplied and in use — nothing here is a placeholder.

| File                | Used by                          | Size       |
| ------------------- | -------------------------------- | ---------- |
| `hero-backdrop.png` | `components/HeroSection.tsx`     | 849 × 1853 |
| `gallery-1.png`     | slider, slide 1                  | 1314 × 668 |
| `gallery-2.png`     | slider, slide 2                  | 1293 × 666 |
| `gallery-3.png`     | slider, slide 3 + social preview | 1303 × 670 |
| `gallery-4.png`     | slider, slide 4                  | 1296 × 663 |

`hero-backdrop.png` is portrait (roughly 0.46:1) because it backs a full-height
phone screen; it is rendered with `fill` + `object-cover`, so it crops from the
centre on taller or shorter handsets. Swap it for another portrait image and
nothing else needs to change.

The slider images are all roughly 2:1. Keep that ratio when replacing them, or
the track will jump height between slides. Their dimensions are declared in
`data/invitation.ts` — update them there if you swap in different files.

`next/image` re-encodes these to WebP/AVIF on request, so the PNG weight here
is not what a guest downloads.
