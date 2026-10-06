# jeanark.dev

Personal portfolio — a single static page built with [Astro](https://astro.build) and Tailwind CSS v4.
Ships ~0 KB of framework JS: animations are CSS, the few interactive bits (theme toggle, nav, scroll
reveal) are tiny inline scripts.

## Develop

```bash
npm install
npm run dev      # http://localhost:3010
npm run build    # static output -> ./out
npm run preview  # serve ./out
npm run check    # type-check .astro/.ts files
npm run screenshots [-- unchina.study]  # refresh project previews (needs local Chrome)
```

Requires Node 22.12+ (see `.nvmrc`).

## Where things live

- `src/lib/content.ts` — every piece of text on the page (edit this to update the portfolio)
- `src/components/sections/` — Hero, About, Stack, Work
- `src/layouts/Base.astro` — `<head>`, SEO/OG tags, theme bootstrap, scroll-reveal script
- `src/styles/global.css` — color tokens (light/dark), base styles, animations
- `public/projects/` — project preview screenshots (`<domain>.webp`)
- `public/` — static files (`og.png` share image, `icon.svg`, `_headers`, add `cv.pdf` here)

Deploy: see [DEPLOY.md](DEPLOY.md).
