# NivaSync Infotech — corporate website

The corporate website for **NivaSync Infotech Pvt. Ltd.**, the parent company of
the Skydot Infotech technology brand.

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · React Router 7. Static output,
no backend, no database.

Built on the official NivaSync logo — orange `#FC6302`, blue `#024BB1` — with
Plus Jakarta Sans over Inter.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Typecheck → production build → sitemap & robots.txt |
| `npm run preview` | Serve the production build (http://localhost:4173) |
| `npm run typecheck` | TypeScript, strict |
| `npm run lint` | ESLint + jsx-a11y |
| `npm run test` | Vitest — 229 unit, route, form, SEO and a11y tests |
| `npm run verify` | typecheck + lint + test + build |
| `npx playwright test` | 78 browser tests against the production build |
| `node scripts/check-links.mjs` | Every internal link resolves; no `href="#"` |
| `node scripts/check-content.mjs` | No unapproved or withheld content is published |
| `npm run brand` | Re-trace the logo and regenerate every brand asset |

## Structure

```
src/
  app/          route configuration and the router
  components/
    brand/      logo and brand marks
    forms/      accessible form fields and the inquiry form
    layout/     header chrome, footer, error boundary, scroll handling
    motion/     scroll-reveal primitives
    navigation/ header mega menu and mobile navigation
    sections/   reusable page sections
    ui/         buttons, containers, cards, provenance notes
  data/         ALL business content, typed, with provenance tags
  hooks/        in-view, media query, reduced motion, theme
  lib/          SEO head management, form adapter, validation
  pages/        one module per route
  styles/       design tokens and global CSS
  types/        content models
docs/           audit, plan, brand architecture, assets, deployment, QA
scripts/        SEO generation, integrity checks, asset generation
tests/          unit tests + tests/e2e browser tests
```

## Where the content lives

All business information is in `src/data/` — nothing is scattered through
components. Each record carries a `provenance` tag recording where it came from
and whether it is verified, company-stated, illustrative, or awaiting approval.

To add a capability, product, industry, case study, article or brand: append one
object to the relevant array. The navigation, sitemap, cross-links and route
tests all read from the same source.

## Read these before changing anything

| Document | Covers |
| --- | --- |
| [`docs/CONTENT_INVENTORY.md`](docs/CONTENT_INVENTORY.md) | The audit of skydotinfotech.com, what was migrated, what was deliberately withheld, and why |
| [`docs/BRAND_ARCHITECTURE.md`](docs/BRAND_ARCHITECTURE.md) | The NivaSync/Skydot relationship and the language rules that go with it |
| [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md) | Stack decisions, information architecture, task checklist |
| [`docs/ASSET_INVENTORY.md`](docs/ASSET_INVENTORY.md) | Every asset, and what still needs supplying |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Build, deploy, domain, rollback, troubleshooting |
| [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md) | What was tested, with real results |
| [`docs/HANDOFF.md`](docs/HANDOFF.md) | Production handoff: done, tested, unverified, blocked |

## Content integrity rules

This site is built so that it cannot quietly start claiming things it cannot
support:

- **No invented facts.** No fabricated testimonials, client names, metrics,
  awards or vacancies. Three case studies published on the source site were
  withheld because they used anonymous clients and unattributable figures.
- **Company-stated figures are labelled as such** in the UI, not dressed up as
  audited metrics.
- **Forms never lie.** With no backend configured they say so and offer a
  pre-filled email; a success state appears only after a real 2xx response.
- **No referenced file is missing.** Imagery that does not exist renders a
  designed placeholder naming what belongs there.
- `scripts/check-content.mjs` and `tests/content.test.ts` enforce these in CI.

## Before launch

Three items need company confirmation — all documented in
[`docs/HANDOFF.md`](docs/HANDOFF.md):

1. The production domain (`nivasync.in` is inferred from one published email).
2. The corporate address (the brief and the live Skydot site disagree).
3. Legal review of `/privacy` and `/terms`.

Plus one brand sign-off: on near-black surfaces the mark's blue is lightened for
legibility (the official value is 2.5:1 against the ink).
