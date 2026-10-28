# Production Handoff — NivaSync Infotech corporate website

**Date:** 2026-10-28
**Status:** feature-complete and verified locally. **Not deployed.** Nothing has
been committed, pushed, published, or pointed at a domain, and no DNS record has
been touched.

---

## 1. What was built

A complete corporate website for NivaSync Infotech Pvt. Ltd., presenting it as
the parent organisation behind the Skydot Infotech brand.

| | |
| --- | --- |
| Pages | **44 addressable pages** across 17 route patterns |
| Stack | React 19 · TypeScript (strict) · Vite 7 · Tailwind CSS 4 · React Router 7 |
| Output | Static files in `dist/`. **No server runtime required** |
| Dependencies | **3 runtime packages**: react, react-dom, react-router-dom |
| First-load JS | ~102 kB gzipped |
| Tests | 229 unit/integration + 78 browser tests |
| Lighthouse | 99 / 100 / 100 / 100 desktop · 90 / 100 / 100 / 100 mobile |

### Pages

Home · About · Capabilities (+10 detail pages) · Products (+7) · Industries
(+12) · Brand ecosystem · Work (+1 case study) · Insights (+2 articles) ·
Careers · Contact · Privacy · Terms · 404

---

## 2. ✅ Complete and verified

- **Content migration.** The source site is a client-rendered SPA that serves no
  readable HTML, so the content model was recovered from its published
  JavaScript bundle: 10 capabilities, 7 products, 12 industries, 4 case studies,
  2 articles, 30 named deployment sites, 25 client names, full contact details
  and the parent-company statement. All documented with provenance in
  `docs/CONTENT_INVENTORY.md`.
- **Brand architecture.** The parent/brand relationship is published in the
  company's own words. Language is deliberately conservative — "technology brand
  of", never "subsidiary" or "division" — and a test enforces it.
- **Design system.** Built on the official logo: tokens for colour, type,
  spacing, layout, radii, shadow, motion and z-index, with the brand's orange
  and blue as the two voices. Light and dark themes with no flash of the wrong
  theme. Type is Plus Jakarta Sans over Inter, both metric-matched so the font
  swap causes no layout shift.
- **Brand pipeline.** `npm run brand` traces the supplied artwork and generates
  every derivative — favicon, dark variant, lockup, React path data, social
  image — from that single source.
- **Motion.** One scroll mechanism (a single shared IntersectionObserver), one
  reveal primitive, compositor-only properties, full reduced-motion support.
  **No animation library at all** — the one that was there cost 42 kB gzipped
  per page to animate a single menu, and was removed.
- **Navigation.** Keyboard-operable mega menu, full-screen mobile dialog with a
  focus trap and scroll lock, skip link, breadcrumbs.
- **SEO.** Unique title, description and canonical per route; Open Graph and
  Twitter cards; Organization, WebSite, BreadcrumbList, Service,
  SoftwareApplication, Article and ContactPage structured data; generated
  `sitemap.xml` (44 URLs) and `robots.txt`; `noindex` on the 404 page only.
- **Accessibility.** Lighthouse 100 on every page audited, plus 55 automated
  structural assertions.
- **Deployment artefacts.** `.htaccess` with SPA rewrite, security headers and
  caching; `_redirects` for Netlify/Cloudflare; a build-time CSP hash injector,
  verified against a live page with zero violations.

## 3. ✅ Tested

Full results, including the 16 defects found and fixed during QA, are in
[`docs/QA_CHECKLIST.md`](QA_CHECKLIST.md).

Headline: typecheck and lint clean; 229 unit tests passing (stable over three
consecutive runs); 78 browser tests passing across desktop and mobile Chromium;
zero console errors on every route; no horizontal overflow at any width from 320
to 1920 px; deep links and refresh verified; Lighthouse scores above are real
tool output.

## 4. ⚠ Unverified — needs doing, cannot be done from here

| Item | Why it could not be verified | Action |
| --- | --- | --- |
| Safari / iOS, Firefox | Only Chromium was available | Open the site on a real iPhone and in Firefox. Pay attention to `backdrop-filter` on the header and `content-visibility` on long pages |
| Live-site performance | Nothing is deployed | Re-run Lighthouse against the live domain |
| `.htaccess` on the real host | Nothing is deployed | Follow the post-deployment checklist in `docs/DEPLOYMENT.md` §8 — especially **opening a deep link directly** |
| Screen-reader experience | No assistive technology available | A manual NVDA or VoiceOver pass over the nav, forms and 404 |
| Contact form delivery | No backend exists, by design | See §6 |

## 5. ⚠ Requires company approval before launch

### 5.1 Production domain — BLOCKER

`SITE_ORIGIN` is set to `https://www.nivasync.in`, inferred from **one** piece
of evidence: the live Skydot site publishes `hello@nivasync.in`. No NivaSync
website was found, so `www` vs apex is an assumption. Skydot's domain was
deliberately not used.

**Confirm the domain.** It is one line: `src/data/company.ts` → `SITE_ORIGIN`.
Canonicals, Open Graph, JSON-LD, sitemap and robots all derive from it.

### 5.2 Corporate address — BLOCKER

The brief and the live Skydot site disagree:

| Source | Landmark | PIN |
| --- | --- | --- |
| Project brief (used) | Near **Avalon** Hotel | **380054** |
| Live Skydot site | Nr. **Regenta** Hotel, Ramdas Road | **380059** |

The brief's version is published as the more recent instruction. **Confirm
which is correct** — `src/data/company.ts` → `offices[0]`.

### 5.3 Logo and brand palette — ✅ RESOLVED

The official logo has been supplied and is now in use everywhere: header,
footer, favicon, boot screen, the hero diagram's core, and the social card. The
palette is derived from the artwork itself — orange `#FC6302`, blue `#024BB1`,
both sampled as the median of every saturated pixel in each region.

Everything is generated from the one source file by `npm run brand`, so the mark
cannot drift between contexts.

**One small thing still needs brand sign-off:** on near-black surfaces the
mark's blue is lightened to `#4D8FE8`, because the official value scores 2.5:1
against the ink and disappears. The orange is never changed. Details in
`docs/ASSET_INVENTORY.md` §2.1.

### 5.4 Legal review — BLOCKER

`/privacy` and `/terms` were written specifically for this site (nothing was
copied from another policy or domain) and both display a visible "pending legal
review" notice. Have counsel approve them, then remove the `reviewNotice` prop.

The Terms assume **Ahmedabad, Gujarat** jurisdiction — confirm.

### 5.5 Corporate structure terminology

The site says Skydot is a "technology brand of" NivaSync and asserts nothing
more. Confirm whether Skydot is a registered legal entity or a trading name, and
whether CIN/GSTIN should appear in the footer (currently omitted — no number was
found).

### 5.6 Company-stated statistics

"10+ years, 300+ clients, 15+ products, 500+ projects" are carried over from the
company's own site and are rendered with a visible note that they are
company-stated rather than audited. Confirm they are still accurate.

## 6. ⚠ Configuration needed before launch

### Contact form — currently honest, not functional

**There is no form backend.** The forms say so in plain language and offer a
pre-filled email instead. **A success message is never shown unless a configured
endpoint returns 2xx.**

To enable delivery:

1. Set `VITE_FORM_ENDPOINT` to a public HTTPS endpoint that accepts a JSON POST.
2. Add that origin to the CSP `connect-src` in `public/.htaccess`.
3. Rebuild.
4. **Submit the form on the deployed site and confirm the message arrives.**
   Until that has happened, the status is "configured but unverified".

Full instructions, including the rule that `VITE_*` values are public and must
never hold credentials: `docs/DEPLOYMENT.md` §4.

## 7. Content deliberately NOT published

This is the part most worth reviewing, because it is where the site says less
than it could.

| Withheld | Why |
| --- | --- |
| **3 of the 4 case studies** on the source site | Each names an anonymous client ("Global Retail Chain", "Leading Manufacturing Firm", "Regional Bank") and quotes precise unattributable figures — `$1.4M saved`, `22% increase`, `4.8 rating`. Their technology stacks appear in none of the verified capability or product records. Republishing them under a new corporate brand would present unverifiable metrics as corporate fact. They are preserved in `src/data/work.ts` → `withheldCaseStudies`; supply evidence and they can be reinstated unchanged. |
| **eCount accounting software** and **Real Estate Portal** | Named in the brief, but **found nowhere** on the current site, and the legacy routes that referenced them no longer exist. Publishing them would claim a product is current with no evidence. |
| **Client logos** (25 names) | The logo files were unavailable, the marks belong to their owners, and permission to display them under a *new* brand is unconfirmed. Names are published as a typographic roster instead. Several are government emblems with specific usage rules. |
| **Job vacancies and benefits** | No real vacancy exists or was supplied, and the source site has no careers page. The page carries a designed empty state and a working speculative-application route. |
| **Leadership names, bios and photographs** | None are published anywhere in the source material. Third-party directories list staff names; publishing them without consent would be wrong. |
| **A founding year** | Third-party directories indicate 2013, but no first-party source states it. "10+ years of experience" is published as a company statement instead. |
| **Rajkot / Vadodara / Hyderabad offices** | The brief asked about these. They are **client and deployment locations, not offices** — the source site lists exactly one office. A historical Rajkot branch appears only in third-party directories. |
| **Mission and vision statements** | The source site publishes none. The Team/Culture/Vision sentences it does publish are presented as operating values, with a note that a formal statement is pending approval. |

**What replaces them** is stronger, not weaker: 30 named, publicly checkable
institutions running our software — NAIR Vadodara, IRISET Secunderabad, AIIMS
Jodhpur, IRIMEE Jamalpur, twelve Divisional Railway Manager offices and more.

## 8. Known characteristics (not defects)

- **Mobile Lighthouse Performance is 90, not 99.** The mobile preset applies 4×
  CPU throttling and slow-4G simulation to pages that are long by design.
- **Fonts load from Google Fonts**, which discloses the visitor's IP to Google.
  Disclosed in the Privacy Policy. `docs/ASSET_INVENTORY.md` §4 explains how to
  self-host if preferred.
- **Content is in typed modules, not a CMS.** Adding a product or article is a
  one-object code change plus a rebuild. The models are shaped so a CMS can be
  connected later without touching components.
- **Insights has two articles.** No filler was generated.

## 9. Immediate next steps

1. Answer the three remaining blockers in §5 (domain, address, legal review),
   and sign off the dark-surface blue adaptation in §5.3.
2. Decide the form backend (§6), or launch with the honest fallback.
3. `git init` and make the first commit — **not done, as no authorisation was
   given** to create a repository or push anything.
4. Build and deploy per `docs/DEPLOYMENT.md`, then work through the
   post-deployment checklist, especially the **deep-link and refresh test**.
5. Test on a real iPhone and in Firefox.
6. Submit the sitemap to Google Search Console.

## 10. Documentation index

| Document | Covers |
| --- | --- |
| [`CONTENT_INVENTORY.md`](CONTENT_INVENTORY.md) | The full source audit, what was migrated, what was withheld and why |
| [`BRAND_ARCHITECTURE.md`](BRAND_ARCHITECTURE.md) | The NivaSync/Skydot relationship, language rules, scalable brand model |
| [`PROJECT_PLAN.md`](PROJECT_PLAN.md) | Stack decisions, IA, task checklist, open questions |
| [`ASSET_INVENTORY.md`](ASSET_INVENTORY.md) | Every asset, every gap, exactly what to supply |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Build, deploy, domain, rollback, troubleshooting |
| [`QA_CHECKLIST.md`](QA_CHECKLIST.md) | What was tested, real results, 16 defects found and fixed, what was NOT tested |
| [`../README.md`](../README.md) | Developer quick start |
