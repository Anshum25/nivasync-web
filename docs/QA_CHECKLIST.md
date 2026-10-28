# QA Checklist — results

**Date:** 2026-10-28
**Build under test:** production build (`npm run build`), served by `vite preview`
on `http://localhost:4173`
**Environment:** Windows 11, Node 24.15.0, Chromium 1248 (Playwright)

Everything marked ✅ was **executed**, and the recorded result is what the tool
printed. Anything not run is listed in §9 as not tested, not as passing.

---

## 1. Static checks

| Check | Command | Result |
| --- | --- | --- |
| TypeScript, strict, whole project | `tsc -b --noEmit` | ✅ **0 errors** |
| ESLint + `jsx-a11y` | `eslint .` | ✅ **0 errors, 0 warnings** |
| Internal link integrity | `node scripts/check-links.mjs` | ✅ **46 links checked across 72 files, all resolve; no `href="#"`** |
| Content integrity | `node scripts/check-content.mjs` | ✅ **No unapproved, withheld or invented content published** |
| Production build | `npm run build` | ✅ **Succeeds** |
| Sitemap generation | postbuild | ✅ **44 URLs written** |

## 2. Unit, component, route and integration tests

`npm run test` — **229 tests, all passing.** Run three consecutive times to
confirm stability after fixing a parallel-load flake.

| File | Tests | Covers |
| --- | --- | --- |
| `tests/routes.test.tsx` | 95 | Every one of the 44 pages mounts directly with exactly one `<h1>` and full site chrome; unknown paths, unknown slugs and withheld case studies render the 404; `/services` and `/solutions` redirect |
| `tests/navigation.test.tsx` | 13 | Mega-menu open/close, `aria-expanded`, Escape restoring focus, overview links, mobile dialog focus trap, body-scroll lock, footer year, external link `rel`, skip link |
| `tests/forms.test.tsx` | 13 | Validation rules, mailto construction, accessible error wiring, focus to first invalid field, **the fallback state is never reported as success**, tab keyboard operation, honeypot |
| `tests/seo.test.tsx` | 25 | Unique title/description/canonical per route, no Skydot domain as canonical, robots directives, Open Graph, JSON-LD content and omissions |
| `tests/content.test.ts` | 28 | Slug uniqueness, every cross-reference resolves, provenance rules, withheld content stays withheld, data counts, brand-architecture language |
| `tests/accessibility.test.tsx` | 55 | Landmark uniqueness, heading hierarchy, no empty links, external link safety, button names, form labelling, reduced-motion behaviour, placeholder imagery |

## 3. Browser tests (Playwright)

`npx playwright test` — **106 passed, 2 skipped** (the two skips are desktop-only
keyboard/menu tests correctly skipped on the mobile project).

Two projects: `desktop-chromium` (1440×900) and `mobile-chromium` (Pixel 7).

| Check | Result |
| --- | --- |
| All 17 representative routes load directly, HTTP < 400 | ✅ |
| Exactly one `<h1>`, banner/main/footer present on each | ✅ |
| **Zero console errors on every route** | ✅ |
| Boot screen removes itself on every route | ✅ |
| **No horizontal overflow at 320, 375, 414, 768, 1024, 1440, 1920 px** | ✅ (forced full layout first — see §7) |
| Every primary navigation item reaches a real page | ✅ |
| Mobile menu opens, navigates, closes | ✅ |
| Browser back and forward | ✅ |
| **Refreshing a deep link keeps the page** | ✅ |
| Unknown path renders the site's own 404 | ✅ |
| `/services` → `/capabilities` | ✅ |
| Product and capability pages show their own content | ✅ |
| Brand links point at `https://skydotinfotech.com/` with `target`/`rel` | ✅ |
| Withheld case studies are unreachable | ✅ |
| Contact form: validation errors, **never a false success**, real mailto fallback | ✅ |
| Skip link is first in the tab order | ✅ |
| `prefers-reduced-motion` respected; boot screen skipped; content not stranded invisible | ✅ |
| All images have alt text | ✅ |
| `robots.txt` and `sitemap.xml` served; sitemap has 44 `<url>` entries | ✅ |
| Each page has a distinct canonical | ✅ |
| **Light mode keeps every large surface light** (7 routes) | ✅ measured by computed luminance |
| **Dark mode keeps every large surface dark** (7 routes) | ✅ measured by computed luminance |

## 4. Lighthouse — real measured scores

Run with Lighthouse CLI against the production build. **These are actual tool
output, not estimates.**

Re-measured after the official logo, palette and typeface were applied.

| Page | Preset | Performance | Accessibility | Best Practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| Home | Desktop | **99** | **100** | **100** | **100** |
| Home | Mobile | **86–95** (median 90, 5 runs) | **100** | **100** | **100** |
| Product (`/products/itms`) | Desktop | **99** | **100** | **100** | **100** |
| Contact | Desktop | **99** | **100** | **100** | **100** |
| Work | Desktop | **99** | **100** | **100** | **100** |

The mobile Performance figure is given as a range because it genuinely varies
between runs on a loaded machine. Reporting a single lucky run would be
misleading; the median is 90.

### Core Web Vitals (lab)

| Page | FCP | LCP | CLS | TBT |
| --- | --- | --- | --- | --- |
| Home (desktop) | 0.3 s | 0.9 s | 0 | 10 ms |
| Home (mobile, throttled) | 0.9 s | 1.9–2.8 s | **0** | 240–330 ms |
| Product (desktop) | 0.2 s | 1.0 s | 0 | 20 ms |
| Contact (desktop) | 0.3 s | 0.9 s | 0 | 0 ms |

**Caveat, stated plainly:** these were measured against a **local preview
server**, so network latency is effectively zero and the mobile figures come
from Lighthouse's simulated throttling. Re-run against the live domain after
deployment; real-world LCP will be higher.

The mobile Performance score is 90 rather than 99 because the mobile preset
applies 4× CPU throttling and a slow-4G network simulation to pages that are
long by design.

## 4b. Theme consistency

Encoded as a test rather than checked by eye. For seven routes, in both colour
schemes, every block covering more than 12% of the viewport has its computed
background converted to relative luminance and asserted on the correct side of
the line:

| Mode | Assertion | Result |
| --- | --- | --- |
| Light | every large surface has luminance **> 0.5** | ✅ 7/7 routes |
| Dark | every large surface has luminance **< 0.2** | ✅ 7/7 routes |

Offscreen sections are forced to lay out first, so `content-visibility: auto`
cannot hide a surface from the measurement.

## 4a. Rebrand verification

The official logo, its palette and a new typeface were applied after the first
QA pass. Everything in §1–§4 was re-run against the rebuilt site:

| Check | Result |
| --- | --- |
| Typecheck, lint | ✅ 0 errors, 0 warnings |
| 229 unit tests | ✅ all passing |
| 78 browser tests | ✅ all passing |
| Lighthouse accessibility, all pages | ✅ **100** on Home, About, Brands, Product, Case study, Industry, Work, Careers, Contact |
| CLS after the typeface change | ✅ **0** — fallback metrics re-measured for Plus Jakarta Sans |
| Logo fidelity | ✅ Traced SVG rendered beside the source artwork and compared visually |
| Traced path weight | ✅ 6.5 KB total after smoothing (137 KB if traced naively) |

Contrast was checked before the palette shipped, not after:

| Pair | Ratio | Verdict |
| --- | --- | --- |
| Blue `#024BB1` on white | 7.9:1 | ✅ AA for all text |
| Orange `#FC6302` on white | 3.0:1 | ⚠ graphics and large type only — body text uses `#B84A00` at 5.2:1 |
| Blue `#4D8FE8` on ink `#070C16` | 6.0:1 | ✅ the dark-surface accent |
| Official blue `#024BB1` on ink | 2.5:1 | ❌ why the mark lightens its blue on dark surfaces |

## 5. Issues found and fixed during QA

Every one of these was discovered by a check in this document, not by inspection.

| # | Issue | Found by | Fix |
| --- | --- | --- | --- |
| 1 | **Mobile menu stole focus on page load.** The focus-restore effect also ran on first mount, so the hamburger button was focused the moment any page loaded — breaking the skip link and dropping keyboard users into the middle of the header. | Skip-link test | Guard the restore so it only runs on an actual close |
| 2 | **Mobile menu panel collapsed to a 49 px strip.** The header uses `backdrop-filter`, which makes it the containing block for `position: fixed` descendants, so `top-16 bottom-0` sized the panel against the 64 px header instead of the viewport. | Visual check + DOM measurement | Portal the dialog to `document.body` |
| 3 | **Header CTA did not hide on mobile.** `hidden` on an element whose base classes already include `inline-flex` is decided by stylesheet order, not attribute order — so the button stayed visible at 390 px and pushed the hamburger off-screen. | Mobile screenshot | Move the responsive rule to a wrapper element |
| 4 | **All headings rendered at body size.** `text-[var(--text-h1)]` is ambiguous in Tailwind and was parsed as a colour, not a length. | Visual check | `text-[length:var(--text-h1)]` across 109 usages |
| 5 | **Horizontal overflow on mobile.** Horizontal scroll reveals (`from="left"`) offset elements 24 px along X while waiting to enter, pushing full-width stacked content past the viewport. | Overflow test at 320/375/414 px | Horizontal entrances only above 64 rem; vertical below |
| 6 | **Mega menu closed on click.** Hover opened the panel, then the click handler read the already-open state and toggled it shut. | Navigation test | Track hover-opened state; a click confirms rather than closes |
| 7 | **Heading hierarchy skipped h2 on `/insights`.** The page jumped from `h1` straight to card `h3`s. | Heading-hierarchy test | Added the missing section heading |
| 8 | **Hooks called conditionally in 5 detail pages.** `if (!record) return <NotFound />` sat before `useSeo`, so hook order changed between a found and a missing record. | ESLint `rules-of-hooks` | Split each page into a resolver and a view component |
| 9 | **`mailto:` links form-encoded spaces as `+`.** Recipients would have seen `Asha+Patel`. | Form unit test | Percent-encode instead of `URLSearchParams` |
| 10 | **Hairline grid painted empty cells as grey slabs** whenever a row was partially filled (5 cards in a 4-column grid). | Visual check | Draw rules with a box-shadow ring per card instead of a container showing through gaps |
| 11 | **`--content-subtle` failed WCAG AA** at 3.6:1 on light surfaces. | Lighthouse a11y (96/97) | New measured token at 5.2:1 on paper and 4.8:1 on sunken → **100** |
| 12 | **CLS of 0.112.** The lazily-loaded homepage chunk replaced a short Suspense fallback, dropping the footer down the page. | Lighthouse | Import Home eagerly; make the fallback full height → **CLS 0** |
| 13 | **Fonts blocked first render.** | Lighthouse render-blocking audit | Non-blocking stylesheet load, made safe by metric-matched fallback faces so the swap causes no shift |
| 14 | **CSP would have blocked the inline bootstrap script in production** — the policy allowed `script-src 'self'` only. | CSP verification test | SHA-256 hash computed at build time and injected into `dist/.htaccess` |
| 15 | **Mobile TBT of 850 ms.** | Lighthouse mobile | `content-visibility: auto` on below-the-fold sections → TBT 210 ms, Performance 74 → 90 |
| 19 | **A near-black band on a light page.** The hero, CTA, feature sections and footer used an *inverted* surface, so light-mode visitors got dark slabs they never chose. | Reported by the client | The band now follows the theme: a soft brand tint in light mode, a raised ink panel in dark. Locked in by 14 browser tests that measure computed luminance. |
| 20 | **Invalid `<dl>` on the About page.** A Reveal div wrapped another div around each dt/dd pair; a `<dl>` allows at most one wrapper. | Lighthouse accessibility (92) | Grid classes moved onto Reveal itself → **100**. A unit test now checks dt/dd nesting on every page. |
| 21 | **"Pvt. Ltd.. All rights reserved."** — the legal name already ends in a full stop. | Footer screenshot | Removed the duplicate |
| 17 | **Logo-less build.** The first pass shipped a placeholder mark because no official artwork existed. | Company supplied the logo | Traced the artwork to SVG and generated every derivative from it |
| 18 | **Official blue is invisible on dark surfaces** (2.5:1 against the ink). | Contrast check before shipping the palette | The mark lightens its blue on dark surfaces only; flagged for brand sign-off |
| 16 | **126 kB animation library for one transition.** The motion library was loaded on every page solely to animate the mobile menu. | Bundle review | Replaced with a CSS keyframe; dependency removed (−42 kB gzip on every page) |

## 6. Security verification

| Check | Result |
| --- | --- |
| Production CSP applied to a live page | ✅ **Zero violations**; inline script runs, fonts promote, boot screen clears |
| No secrets in source | ✅ No API key, token or credential anywhere; `.env*` git-ignored |
| No `dangerouslySetInnerHTML` | ✅ Zero occurrences |
| External links carry `rel="noopener noreferrer"` | ✅ Asserted in both unit and browser tests |
| No analytics, cookies or tracking pixels | ✅ None present; disclosed in the Privacy Policy |
| Source maps not emitted to production | ✅ `sourcemap: false`, and `.htaccess` denies `.map` |

## 7. A note on test honesty

Two places where a test could have passed for the wrong reason, and what was
done about it:

1. **The overflow test** would have missed problems once `content-visibility:
   auto` was added, because the browser stops laying out offscreen sections. The
   test now forces full layout with an injected stylesheet before measuring.
2. **The content-integrity checker** initially reported its own documentation —
   several files discuss the withheld claims in comments precisely because they
   are forbidden. It now strips comments and checks only rendered code.

## 8. Responsive verification

Checked at 320, 375, 414, 768, 1024, 1440 and 1920 px, automated for overflow
and inspected visually at 390 px and 1440 px.

| Aspect | Result |
| --- | --- |
| Navigation | ✅ Mega menu above 1024 px; full-screen dialog below |
| Typography | ✅ Fluid `clamp()` scale, no breakpoint jumps |
| Grids | ✅ 4 → 2 → 1 column; no orphaned grey cells |
| Hero | ✅ Diagram hidden below 1024 px where there is no room |
| Motion | ✅ Horizontal reveals become vertical below 64 rem |
| Forms | ✅ Two columns above 640 px, one below |
| Footer | ✅ Reflows to a single column |
| Horizontal overflow | ✅ None at any tested width |
| Touch targets | ✅ 44 px minimum on buttons, nav items and tags |
| Sticky header | ✅ Does not cover content; `scroll-padding-top` set for anchors |

## 9. ⚠ NOT tested — stated honestly

| Not done | Why | Risk |
| --- | --- | --- |
| **Real-device testing** (physical iOS/Android, Safari, Firefox) | Only Chromium was available in this environment | Medium — Safari differs on `backdrop-filter`, `content-visibility` and `clip`. **Test on a real iPhone before launch.** |
| **Firefox and WebKit engines** | Playwright browsers beyond Chromium were not installed | Medium — same as above |
| **Live-domain Lighthouse** | Nothing is deployed | Low — scores will differ with real network latency |
| **Contact form end-to-end delivery** | No backend is configured, by design | **None while unconfigured** — the form does not claim to send. Must be verified once an endpoint is set. See `docs/DEPLOYMENT.md` §4. |
| **Screen-reader walkthrough** (NVDA / JAWS / VoiceOver) | No assistive technology available here | Medium — automated checks cover structure, not experience. A manual pass is recommended. |
| **Deployed `.htaccess` behaviour** | Nothing is deployed | Medium — SPA rewrite and headers are correct in form but unverified on the live host. §8 of the deployment guide covers this. |
| **Load/stress testing** | Static site, no backend | None |

## 10. How to re-run everything

```bash
npm run verify                     # typecheck + lint + test + build
node scripts/check-links.mjs
node scripts/check-content.mjs
npm run preview                    # then, in another terminal:
npx playwright test
```
