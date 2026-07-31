# Shopnil &amp; Fahim — wedding invitation

A single-page digital wedding invitation. Friday, 4 September 2026 at Senakunja,
Dhaka Cantonment.

Built with Next.js 16 (App Router), TypeScript, Tailwind v4 and Framer Motion.

## Mobile only

This is deliberately not responsive to desktop. Every guest opens it on a phone,
so the page is a single column capped at `--container-phone` (480px) and the type
scale is tuned for 360–480px. On a wider screen it renders as a centred phone
column on a dark field. Verified at 360, 375, 390, 412, 414, 430, 440 and 480px.

## Editing the content

Everything a guest reads lives in [`data/invitation.ts`](data/invitation.ts).
Change a field there and it updates everywhere it appears — the countdown target,
the scratch-card date, the page title and the social preview all derive from it.
Components hold no content strings, only UI microcopy.

Dates are formatted through [`lib/date.ts`](lib/date.ts) with `Intl`, pinned to
`Asia/Dhaka`, so a guest abroad still sees local wedding time.

`displayName` is the single name shown large in the hero; it is stored rather
than derived, because a call-name is often not the first word of a full name.

## Running it

```bash
npm install
```

```bash
npm run dev
```

## Deploying

Set one environment variable in Vercel so link previews resolve absolutely:

```
NEXT_PUBLIC_SITE_URL=https://your-domain
```

Without it, `metadataBase` falls back to `http://localhost:3000` and the
WhatsApp/Facebook preview image will not load. Nothing else is required.

## Notes

- `POST /api/messages` validates with zod and appends to an in-memory array.
  Messages are lost on restart — swap it for a database or a Google Sheet
  webhook before relying on it. The marker is in
  [`app/api/messages/route.ts`](app/api/messages/route.ts).
- Images live in `public/images`; see
  [`public/images/README.md`](public/images/README.md) for sizes and ratios.
- The venue map is driven by a text query, not coordinates, in
  [`data/invitation.ts`](data/invitation.ts).
