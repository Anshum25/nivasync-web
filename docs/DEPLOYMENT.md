# Deployment Guide — NivaSync Infotech corporate website

**Status:** ready for a static production deployment. Nothing has been deployed,
committed, pushed, or pointed at a domain. No DNS record has been changed.

---

## 1. Requirements

| Requirement | Version used | Minimum |
| --- | --- | --- |
| Node.js | 24.15.0 | 20.19 (set in `package.json` `engines`) |
| npm | 11.12.1 | 10 |
| Build output | static files in `dist/` | — |
| Server runtime | **none** | The site is 100% static. **No Node.js runtime is required on the host.** |

This matters for Hostinger shared hosting: nothing here needs Node on the
server. The build runs on your machine (or in CI); the host only serves files.

## 2. Commands

```bash
npm install          # install dependencies
npm run dev          # development server (http://localhost:5173)
npm run typecheck    # TypeScript, strict, whole project
npm run lint         # ESLint + jsx-a11y
npm run test         # Vitest — 229 tests
npm run build        # typecheck, then production build, then SEO generation
npm run preview      # serve the production build locally (http://localhost:4173)
npm run verify       # typecheck + lint + test + build, in that order
```

Two extra integrity checks, run manually or in CI:

```bash
node scripts/check-links.mjs     # every internal link resolves; no href="#"
node scripts/check-content.mjs   # no unapproved or withheld content is published
```

And one asset generator, only needed if the brand mark changes:

```bash
node scripts/generate-og.mjs     # regenerates og-default.png and icon-180.png
```

**Production output directory: `dist/`.**

## 3. ⚠ Confirm before launch

### 3.1 Production domain — REQUIRED

The canonical origin is a single constant:

```ts
// src/data/company.ts
export const SITE_ORIGIN = 'https://www.nivasync.in'
```

`nivasync.in` is inferred from **one** piece of evidence: the live Skydot site
publishes the NivaSync-branded address `hello@nivasync.in`. No NivaSync website
was found, so the host (`www.` vs apex) is an assumption.

Skydot's domain is deliberately **not** used as NivaSync's canonical domain.

Changing this one line updates canonicals, Open Graph URLs, JSON-LD, `robots.txt`
and `sitemap.xml` together. Then rebuild.

### 3.2 Corporate address — REQUIRED

The brief and the live Skydot site disagree (landmark hotel and PIN code). The
brief's version is published. See `docs/CONTENT_INVENTORY.md` §4.1. One object in
`src/data/company.ts` → `offices[0]`.

### 3.3 Brand assets — REQUIRED

The NivaSync wordmark and palette are **original placeholders**. See
`docs/ASSET_INVENTORY.md`.

### 3.4 Legal review — REQUIRED

`/privacy` and `/terms` were drafted for this site and carry a visible
"pending legal review" notice. Have counsel approve them, then remove the
`reviewNotice` prop in `src/pages/Privacy.tsx` and `src/pages/Terms.tsx`.

## 4. Contact form configuration

**Current status: no backend is configured.** The forms say so plainly and offer
a pre-filled email instead. They never show a false "sent" confirmation. This is
by design — see `src/lib/forms.ts`.

### To enable real delivery

1. Choose a destination that accepts a JSON `POST` and answers 2xx. Any of these
   work with the existing adapter, with no code change:
   - a form service (Formspree, Web3Forms, Basin, …)
   - a serverless function (Cloudflare Worker, Netlify/Vercel function)
   - a CRM inbound webhook
2. Set the environment variable **at build time**:

   ```bash
   # .env.production.local  — NEVER commit this file
   VITE_FORM_ENDPOINT=https://your-endpoint.example.com/inquiries
   ```

3. Rebuild. `createFormAdapter()` picks up the endpoint and switches from the
   fallback to the HTTP adapter automatically.
4. **Add the endpoint's origin to the CSP `connect-src` in `public/.htaccess`,**
   or the browser will block the request. It currently allows `'self'` only.
5. **Verify a real submission end to end before telling anyone the form works.**
   Submit the form on the deployed site and confirm the message actually arrives.
   Until that has happened, the form's status is "configured but unverified".

### Security rules for this variable

- Anything prefixed `VITE_` is **inlined into the client bundle and is public**.
  Only a public endpoint URL belongs here.
- API keys, SMTP credentials and CRM tokens must live **server-side** (in the
  serverless function) or in the form provider's own account. Never in `VITE_*`.
- `.env*` is already in `.gitignore`; only `.env.example` is tracked.

### Spam protection

A honeypot field is included and sent with each submission. Real protection is
the endpoint's responsibility — enable the provider's own spam filtering, or add
a captcha/turnstile check in your serverless function.

## 5. Deploying to Hostinger (shared / static)

This is the path the brief identifies, and the build is compatible with it.

1. Build locally: `npm run build`.
2. Upload **the contents of `dist/`** — not the folder itself — into
   `public_html/` using hPanel File Manager or SFTP.
3. Confirm `.htaccess` arrived. File managers hide dotfiles by default; if it is
   missing, deep links will 404. Turn on "show hidden files" and verify.
4. In hPanel, issue the free SSL certificate for the domain and enable
   "Force HTTPS".
5. Visit the site and run the post-deployment checklist in §8.

### Why `.htaccess` is critical

This is a client-routed single-page application. The server has no file at
`/products/itms`. Without the rewrite rule, opening that URL directly — or
pressing refresh anywhere except the homepage — returns the host's 404 page.

The included `public/.htaccess` handles:

- **SPA routing** — anything that is not a real file falls through to `index.html`.
- **HTTPS redirect** — comment out that block if the certificate is not issued yet.
- **Security headers** — CSP, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, HSTS.
- **Caching** — hashed assets immutable for a year; `index.html` never cached.
- **Compression** — gzip for text assets.

## 6. Deploying elsewhere

| Platform | What to do |
| --- | --- |
| **Netlify / Cloudflare Pages** | Build `npm run build`, publish `dist`. `public/_redirects` is already included and handles SPA routing. |
| **Vercel** | Build `npm run build`, output `dist`. Add a rewrite: `{"source": "/(.*)", "destination": "/index.html"}`. |
| **nginx** | `try_files $uri $uri/ /index.html;` |
| **Any static host** | Serve `dist/`, with a fallback rewrite of unmatched paths to `index.html`. |

Security headers on Netlify/Vercel/Cloudflare must be configured in that
platform's own config file — `.htaccess` is Apache-only.

## 7. Domain and DNS

**Do not change DNS without explicit authorisation.** For reference, once the
domain is confirmed:

1. Point the domain's A record (or CNAME for a subdomain) at the host.
2. Decide `www` vs apex and **redirect one to the other**, so only one host
   serves content. The canonical in `SITE_ORIGIN` must match the winner.
3. Issue and verify the SSL certificate; confirm `https://` loads with no mixed
   content warning.
4. Confirm `https://<domain>/robots.txt` and `/sitemap.xml` are reachable.
5. Submit the sitemap in Google Search Console.

## 8. Post-deployment checklist

Run on the live site, not locally:

- [ ] Homepage loads over HTTPS with a valid certificate.
- [ ] **Open a deep link directly**, e.g. `/products/itms`. It must load, not 404.
- [ ] **Press refresh on a deep link.** Same.
- [ ] Browser back/forward works across several pages.
- [ ] `/robots.txt` and `/sitemap.xml` return the generated files.
- [ ] A 404 URL renders the site's own 404 page.
- [ ] `/services` redirects to `/capabilities`.
- [ ] Mobile menu opens, navigates and closes on a real phone.
- [ ] No console errors on any page.
- [ ] No horizontal scrolling at 320 px width.
- [ ] `og-default.png` resolves (test with a link preview debugger).
- [ ] Contact form behaves as documented — honest fallback, or a verified real send.
- [ ] Check canonicals in page source match the live domain.

## 9. Cache and asset handling

Vite fingerprints every asset (`index-B8xA2x5s.js`), so a new deployment produces
new filenames. Combined with the `.htaccess` rules:

- Hashed assets: cached one year, immutable, never stale.
- `index.html`: `no-cache, must-revalidate` — visitors always get the current
  asset references.

If a deployment appears not to take effect, the cause is almost always a cached
`index.html` at a CDN or proxy layer. Purge that first.

## 10. Rollback

The build is a folder of static files, so rollback is a file swap.

1. **Before each deployment, keep the previous `dist/`.** Rename the live folder
   (e.g. `public_html` → `public_html_prev`) rather than deleting it, or keep a
   dated zip of the previous build.
2. To roll back: restore the previous folder's contents over `public_html/`.
3. Verify `.htaccess` is present in the restored set.
4. Purge any CDN cache for `index.html`.

Because the site has no database, no server state and no user accounts, a
rollback is complete and instant — there is nothing to migrate back.

To rebuild a previous version from source, check out that commit and run
`npm ci && npm run build`. (`npm ci` rather than `npm install`, so the lockfile
is honoured exactly.)

## 11. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Deep links 404; homepage fine | `.htaccess` missing or `mod_rewrite` off | Re-upload `.htaccess` (show hidden files); confirm rewrite is enabled |
| Blank white page, console shows a MIME or 404 error on `/assets/…` | Uploaded the `dist` folder instead of its contents | Upload the **contents** of `dist/` into `public_html/` |
| Fonts do not load | CSP blocking Google Fonts | Confirm `font-src` includes `https://fonts.gstatic.com` |
| Form request blocked in console | CSP `connect-src` is `'self'` only | Add the form endpoint origin to `connect-src` |
| Old version still served after upload | Cached `index.html` | Purge CDN/proxy cache; verify `Cache-Control` on `index.html` |
| Mixed content warnings | Absolute `http://` reference | All assets are relative; check any newly added external URL uses HTTPS |
| Styles missing entirely | CSS file not uploaded, or `dist/assets/` incomplete | Re-upload the whole `assets/` directory |

## 12. What is NOT configured

Stated plainly so nobody assumes otherwise:

- **No analytics.** None is installed. Adding any requires updating
  `/privacy` §4 and the CSP before enabling it.
- **No cookie banner**, because the site sets no cookies.
- **No CMS.** Content lives in typed modules under `src/data/`.
- **No backend, database, login, admin or customer portal.**
- **No CI pipeline.** `npm run verify` is the gate; wire it into CI when a
  repository exists.
- **No git repository.** The working directory is not initialised, and nothing
  has been committed or pushed.
