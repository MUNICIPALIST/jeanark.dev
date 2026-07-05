# Deploy to Cloudflare Pages

This site is a **static export** (`next.config.ts` → `output: "export"`), so it deploys as plain
static files. Use **Cloudflare Pages** (not Workers — Workers is only needed for server-side
rendering / edge compute, which this site doesn't use).

## Pages vs Workers (short version)

| | Cloudflare **Pages** | Cloudflare **Workers** |
|---|---|---|
| Best for | static / JAMstack sites (this project) | SSR, APIs, edge compute |
| How | serves the built `out/` folder on the CDN | runs your JS on every request |
| Next.js | static export → just upload `out/` | full Next.js via `@opennextjs/cloudflare` |
| Setup | connect Git, done | more config |

## One-time setup (GitHub-connected auto-deploy)

### 1. Push to GitHub
```bash
git add -A
git commit -m "Portfolio"          # (initial commit is already made)
# create the repo (either use the GitHub website, or the gh CLI):
gh repo create arkinov-portfolio --public --source=. --remote=origin --push
# — or manually:
git remote add origin https://github.com/municipalist/<repo>.git
git branch -M main
git push -u origin main
```

### 2. Connect it in Cloudflare
Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick the
repo. Then set:

| Setting | Value |
|---|---|
| Framework preset | **Next.js (Static HTML Export)** (or "None") |
| Build command | `npm run build` |
| Build output directory | `out` |
| Environment variables | `NODE_VERSION` = `20`  ·  `NEXT_PUBLIC_SITE_URL` = your final URL |

Click **Save and Deploy**. First deploy lands on `https://<project>.pages.dev`.

### 3. Set the site URL
Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://<project>.pages.dev`, or your custom domain) so the OG
image and share links use absolute URLs, then trigger a redeploy (Deployments → Retry, or push a
commit).

### 4. Custom domain (optional)
Pages project → **Custom domains** → add your domain (Cloudflare handles DNS + HTTPS). Update
`NEXT_PUBLIC_SITE_URL` to match.

## After that
Every `git push` to the connected branch **auto-deploys**. Other branches get preview URLs.

## Notes
- `public/_headers` fixes the OG image content-type and long-caches hashed assets on Cloudflare.
- `.nvmrc` pins Node 20 for the build.
- Add `public/cv.pdf` for the "Download CV" button to work.
