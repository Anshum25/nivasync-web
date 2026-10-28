# Project Plan — NivaSync Infotech corporate website

**Repository state at audit:** `C:\Users\Admin\Desktop\Mickey` was **completely empty**
— no files, no `.git`, no existing application, no deployment config, no environment
variables. Nothing was overwritten or deleted. This is a greenfield build.

**Toolchain found:** Node v24.15.0, npm 11.12.1, Windows 11, PowerShell. No Git
repository was initialised (and none will be without authorisation).

---

## 1. Stack decisions

| Choice | Decision | Why |
| --- | --- | --- |
| Framework | **React 19 + TypeScript + Vite 7** | Brief's stated preference; static output suits shared hosting. |
| Routing | **react-router-dom 7** (`BrowserRouter`) | Centralised route config; deep links work with a host rewrite rule. |
| Styling | **Tailwind CSS 4** (CSS-first `@theme`) | Design tokens live in CSS custom properties and are usable from both Tailwind utilities and hand-written CSS. No `tailwind.config.js` sprawl. |
| Motion | **`motion` (Motion for React) only** | One library. Deliberately **no GSAP, no Lenis, no ScrollTrigger** — see §2. |
| Tests | **Vitest + Testing Library + jsdom**, plus two Node scripts | See §4. |
| Backend | **None** | No real requirement; forms use a documented adapter. |

### 2. Motion stack rationale (deliberate exclusions)

The brief asks for a considered minimum rather than every library.

- **`motion` is enough.** It provides declarative entrance animation, a `useReducedMotion`
  hook, layout animation and gesture state. Everything the design needs.
- **GSAP + ScrollTrigger: excluded.** The source Skydot site loads GSAP *and* Framer
  Motion together, which is the "two libraries competing for the same elements" problem
  the brief warns about. Scroll reveals here use a single shared
  `IntersectionObserver` hook (`useInView`) that all section components consume, so there
  is exactly one scroll mechanism in the app.
- **Lenis / smooth scroll: excluded.** It hijacks native scrolling, breaks
  `scroll-behavior`, interferes with keyboard paging and anchor focus, and costs payload
  for a cosmetic effect. Native scrolling with `scroll-behavior: smooth` (itself disabled
  under reduced motion) is used instead.
- **3D / video backgrounds: excluded.** Hero motion is CSS/SVG, so there is no heavy
  dependency and no fallback to maintain.

### 3. Information architecture

```
/                           Home
/about                      About NivaSync
/capabilities               Capabilities overview        (10 detail pages)
/capabilities/:slug         Capability detail            (template)
/products                   Products overview            (7 detail pages)
/products/:slug             Product detail               (template)
/industries                 Industries overview          (12 detail pages)
/industries/:slug           Industry detail              (template)
/brands                     Brand ecosystem
/work                       Selected work                (1 verified case study)
/work/:slug                 Case study detail            (template)
/insights                   Insights listing             (2 articles)
/insights/:slug             Article detail               (template)
/careers                    Careers (honest empty state)
/contact                    Contact + inquiry forms
/privacy                    Privacy Policy
/terms                      Terms of Use
*                           404
```

**35 routes total.** "Capabilities" is used rather than "Services" because the parent
company presents organisational capability while Skydot sells services — see
`docs/BRAND_ARCHITECTURE.md` §3. A `/services` → `/capabilities` alias redirect is
included so the conventional URL is not a dead end.

### 4. Test strategy

| Layer | Tool | Covers |
| --- | --- | --- |
| Types | `tsc -b --noEmit` | Whole app, strict mode |
| Lint | ESLint + `jsx-a11y` | Code quality and static accessibility rules |
| Unit / component | Vitest + Testing Library | Rendering, nav, mobile menu, form validation, reduced motion |
| Route coverage | Vitest, every route rendered from the central config | All 35 routes mount without throwing |
| Link integrity | `scripts/check-links.mjs` | Every internal `to=`/`href=` resolves to a real route; no `href="#"` |
| Content integrity | `scripts/check-content.mjs` | No `pending-approval` record is renderable; no unverified metric strings |
| Production build | `vite build` | Real build, not dev server |

**Browser automation (Playwright): attempted, outcome recorded in
`docs/QA_CHECKLIST.md`.** If browser binaries cannot be installed in this environment,
that is stated plainly rather than claimed as passing.

---

## 5. Task checklist

### Phase 1 — Audit and plan ✅ COMPLETE
- [x] Inspect working directory and Git status (empty, no repo)
- [x] Identify toolchain and deployment constraints
- [x] Crawl source site: HTML, `robots.txt`, `sitemap.xml` (31 routes), JS bundle
- [x] Recover full content model (10 capabilities, 7 products, 12 industries, 4 case studies, 2 articles, 30 deployment sites, 25 clients)
- [x] Separate verified / company-stated / unverifiable content
- [x] Identify conflicts (address, PIN code) and dead legacy routes
- [x] `docs/CONTENT_INVENTORY.md`
- [x] `docs/BRAND_ARCHITECTURE.md`
- [x] `docs/PROJECT_PLAN.md`
- [x] `docs/DEPLOYMENT.md`
- [x] `docs/QA_CHECKLIST.md`
- [x] `docs/ASSET_INVENTORY.md`
- [x] `docs/HANDOFF.md`

### Phase 2 — Brand and design system ✅ COMPLETE
- [x] Design tokens: colour, type, spacing, layout, radii, shadow, motion, z-index
- [x] Light + dark surfaces
- [x] Placeholder NivaSync wordmark (SVG, documented as placeholder)
- [x] UI primitives: Button, Link, Container, Section, Heading, Card, Badge, Field
- [x] Motion primitives: Reveal, Stagger, Parallax, Counter — all reduced-motion aware

### Phase 3 — Core application ✅ COMPLETE
- [x] App shell, centralised route config, error boundary, scroll restoration
- [x] Header with mega menu (keyboard + touch), mobile menu
- [x] Footer with auto year, verified links only
- [x] Loading experience (short, non-blocking, once per session, reduced-motion aware)
- [x] SEO head manager (title, description, canonical, OG, JSON-LD)
- [x] Theme (light/dark) with no flash of wrong theme

### Phase 4 — Pages ✅ COMPLETE
- [x] Home · About · Capabilities (+ detail) · Products (+ detail) · Industries (+ detail)
- [x] Brands · Work (+ detail) · Insights (+ detail) · Careers · Contact
- [x] Privacy · Terms · 404

### Phase 5 — Content and integrations ✅ COMPLETE
- [x] Typed content models with provenance tags
- [x] Contact + project inquiry forms, accessible validation, honest status
- [x] Form adapter interface + documented production configuration

### Phase 6 — Motion and polish ✅ COMPLETE
- [x] Section entrances, heading reveals, progressive card reveals, subtle parallax
- [x] Scroll-linked header state and progress
- [x] Hover/focus/press feedback; no horizontal overflow

### Phase 7 — Quality assurance ✅ COMPLETE
- [x] Typecheck · lint · unit/route tests · link check · content check
- [x] Production build + preview verification
- [x] Responsive sweep (320 → 2560 px)
- [x] Accessibility and reduced-motion verification
- [x] Record real results in `docs/QA_CHECKLIST.md`

### Phase 8 — Production readiness ✅ COMPLETE
- [x] `robots.txt`, `sitemap.xml` generated from the route config
- [x] SPA rewrite config for Hostinger (`.htaccess`) + Netlify/Vercel equivalents
- [x] Security headers
- [x] `.gitignore`, `.env.example` (no secrets)
- [x] `docs/DEPLOYMENT.md` + production handoff report

---

## 6. Open questions (answer materially changes the result)

These are the only items where a wrong guess is not cheaply reversible. Each has a
working default so the build is not blocked.

1. **Production domain.** `nivasync.in` is inferred *only* from the published email
   `hello@nivasync.in`. Default used: `https://www.nivasync.in`, isolated in one
   constant, and **not** Skydot's domain. Affects canonicals, sitemap, OG URLs.
2. **Corporate address conflict** — Avalon/380054 (brief) vs Regenta/380059 (live site).
   Default: the brief's version.
3. **Official logo and brand palette.** ✅ RESOLVED — the company supplied the
   artwork. The palette is sampled from it and every asset is generated from the
   one source file via `npm run brand`. One open item: the mark's blue is
   lightened on near-black surfaces for legibility.
4. **Form delivery.** No backend or credentials exist. Default: honest mailto fallback
   plus a documented adapter. No fake success state is ever shown.
5. **Company-stated statistics** (300+ clients, 500+ projects). Default: published,
   labelled as company-stated.
6. **eCount / Real Estate Portal.** Not found on the current site; **not published**.
7. **Client logos.** Names published as text; logo images need files + permission.

---

## 7. Outcome

All eight phases are complete. Results, including the sixteen defects found and
fixed during QA, are recorded in `docs/QA_CHECKLIST.md`; the launch blockers and
approvals still outstanding are in `docs/HANDOFF.md`.

Two plan decisions changed during implementation, both for the better:

1. **The motion library was removed entirely.** The plan allowed one animation
   library; in practice it was loading 126 kB (42 kB gzipped) on every page to
   animate a single menu transition. A CSS keyframe does the same job, so the
   dependency list is now three runtime packages.
2. **The homepage is no longer code-split.** Splitting it meant the first paint
   showed a short placeholder and then swapped in a full-length page, which
   registered as a 0.11 layout shift. Importing it eagerly costs ~15 kB and
   brought Cumulative Layout Shift to zero.
