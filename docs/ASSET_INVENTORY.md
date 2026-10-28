# Asset Inventory

**Audit date:** 2026-10-28

Every visual asset the site uses, where it came from, and what still needs to be
supplied. The guiding rule throughout: **no file is referenced unless it exists**,
and no stock or third-party image stands in for something the company owns.

---

## 1. Assets shipped in this build

**The official NivaSync logo was supplied by the company and is now in use
everywhere.** It lives at `brand-src/nivasync-logo-source.jpg` and every
derivative is generated from it.

| File | What it is | Origin | Status |
| --- | --- | --- | --- |
| `brand-src/nivasync-logo-source.jpg` | The official artwork | **Supplied by the company** | ✅ Source of truth |
| `public/logo-mark.svg` | The mark, exact brand colours | Vector trace of the artwork | ✅ Final |
| `public/logo-mark-dark.svg` | The mark for near-black surfaces | Same trace, lightened blue | ⚠ Adaptation — see §2.1 |
| `public/favicon.svg` | Browser tab icon | Same trace | ✅ Final |
| `public/icon-180.png` | Apple touch icon, 180×180 | Rendered from the mark | ✅ Final |
| `public/logo-nivasync.svg` | Mark + wordmark lockup (structured data) | Same trace + wordmark | ✅ Final |
| `public/og-default.png` | Social sharing image, 1200×630 | Rendered from the real mark and typeface | ✅ Final |
| `src/components/brand/logoPaths.ts` | Path data the React mark renders | **Generated** from the trace | ✅ Final |
| `public/site.webmanifest` | PWA manifest | Written for this project | ✅ Final |
| `src/components/sections/HeroVisual.tsx` | Animated systems diagram, with the real mark at its core | Original inline SVG | ✅ Final |
| `src/components/ui/VisualPlaceholder.tsx` | Designed stand-in for missing imagery | Original CSS/SVG | ✅ Final, by design |
| Inline icons (arrows, chevrons, theme, status) | Original SVG paths | Drawn for this project | ✅ Final |
| `src/components/brand/NivaSyncLogo.tsx` → `SkydotMark` | Abstract Skydot mark | Drawn from Skydot's verified colours | ⚠ Not Skydot's real artwork — see §2.6 |

**No raster photography is used anywhere on the site.** Every visual is SVG, CSS
or text.

### How the brand assets are produced

```bash
npm run brand     # trace → derivatives → social image
```

Three steps, one source:

1. `scripts/trace-logo.mjs` — isolates the orange and blue regions of the
   artwork into separate masks and vector-traces each, which preserves the thin
   white hairline splitting the mark. Each mask is blurred slightly first: JPEG
   artefacts produce stair-stepped edges, and tracing those directly yields
   ~137 KB of path data instead of 6.5 KB for a shape the eye cannot tell apart.
2. `scripts/generate-brand-assets.mjs` — emits the favicon, the mark, the
   dark-surface variant, the lockup and the React path data.
3. `scripts/generate-og.mjs` — renders the social image and app icon by laying
   out real HTML in headless Chromium, so they use the actual logo and the
   actual typeface.

Because every derivative comes from one trace, the mark cannot drift between the
header, the footer, the favicon, the boot screen and the social card. Replace
the source JPG and re-run `npm run brand`.

### Brand colours, sampled from the artwork

| Colour | Value | Measured as |
| --- | --- | --- |
| Orange | `#FC6302` | Median of all 197,392 saturated orange pixels |
| Blue | `#024BB1` | Median of all 196,859 saturated blue pixels |

---

## 2. ⚠ What still needs attention

### 2.1 Dark-surface blue — needs brand confirmation

On near-black backgrounds the official `#024BB1` scores **2.5:1** and is
effectively invisible. On those surfaces only — the inverted hero and CTA bands,
dark mode, the boot screen and the social card — the mark's blue is lightened to
`#4D8FE8`. The orange is never altered.

This is contained in one custom property (`--logo-blue`). If the brand owner
wants the exact value everywhere, remove the override in the `.dark` and
`.on-inverse` blocks of `src/styles/`— but the mark will be very hard to see.

### 2.2 Product screenshots — 7 slots, all empty

The source site ships **no product screenshots**: every product record has
`screenshots: []`. Each product page therefore renders a designed, clearly
labelled `VisualPlaceholder` that names what belongs in the slot.

| Product | Slot | Suggested capture |
| --- | --- | --- |
| SKYDOTERP | Dashboard | Main operations dashboard |
| Frappe Custom Apps | Interface | A representative custom doctype or workflow |
| ITMS | Training dashboard | Training planning or assessment view |
| LMS — Moodle | Course view | A themed course page |
| Course Management System | Batch dashboard | Batches / attendance view |
| POS | Till interface | Billing screen |
| MCX APIs | Data view | API response or a market-data panel |

**Specification:** 1600×1000 (16:10), PNG or WebP, no real customer data
visible, no personally identifying information. Drop them in
`public/products/<slug>.png` and add the path to the product's `screenshots`
array in `src/data/products.ts`. The page swaps automatically from placeholder
to a real `<img>` with correct `width`, `height`, `loading="lazy"` and alt text —
no component change required.

### 2.3 Client logos — 25 names, 0 files

The source site displays 25 client logos. **The image files were not downloaded,
and are not used.** The roster is rendered as typography instead.

Three reasons, all deliberate:

1. The files were not available during the audit.
2. These marks are the trademarks of their owners.
3. Permission to display them under a **new corporate brand** is unconfirmed —
   permission given to Skydot does not automatically extend to NivaSync.

**To display logos**, supply for each: the artwork (SVG preferred, or PNG with
transparency), **and written confirmation that NivaSync may display it**. Public
institutions in particular often have specific emblem-usage rules — the Indian
Railways, AIIMS, ICAR and DIET emblems are not freely reusable.

The full name list is in `docs/CONTENT_INVENTORY.md` §12 and
`src/data/deployments.ts`.

### 2.4 Leadership and team photography — none used

No leadership names, biographies or photographs are published, because none were
verified and no permitted images exist. If the company wants a leadership
section, supply names, roles, approved biographies and photographs with consent.

### 2.5 Case-study imagery — none used

One case study is published (Indian Railways / ITMS) and it carries no imagery.
Any screenshot or photograph for it needs client approval, since the client is a
government body.

### 2.6 Skydot's real logo artwork

`SkydotMark` is an **abstract mark** built from Skydot's verified brand colours.
It does not reproduce Skydot's actual logo, which was not supplied as a file.
Supply `logo.png`/SVG from skydotinfotech.com and it can be swapped in.

---

## 3. Practices from the current site deliberately not carried over

| Current Skydot practice | Why not |
| --- | --- |
| Hotlinking Unsplash photographs (`images.unsplash.com/photo-…`) on the About page | The brief rules out hotlinking as a production strategy. It is also a third-party dependency on every page view, and a licence question. Replaced with original CSS/SVG visuals. |
| A generic `/placeholder.svg` on every case study | Replaced with a labelled placeholder component that says what is missing. |
| `/world.svg` world map image | The deployment map is drawn from published coordinates as inline SVG — no image request, no map SDK, no API key. |

---

## 4. Fonts

| Family | Role | Weights | Source | Licence |
| --- | --- | --- | --- | --- |
| Plus Jakarta Sans | Display / headings | 500–800 | Google Fonts | SIL Open Font License |
| Inter | Body and UI | 400–600 | Google Fonts | SIL Open Font License |

Plus Jakarta Sans was chosen for its geometric-humanist construction, which
matches the geometry of the mark; headings are set at 700 because a bold logo
needs bold headings beside it.

Both are variable fonts loaded from Google Fonts in one **non-blocking**
stylesheet request, preceded by `preconnect`. Each has a metric-matched fallback
face (`src/styles/tokens.css`) measured against Arial, so the swap from fallback
to web font causes no layout shift. No font file is self-hosted.

**Privacy note:** requesting Google Fonts discloses the visitor's IP to Google.
This is disclosed in the Privacy Policy §5. To remove that third party entirely,
self-host the two `.woff2` files in `public/fonts/` and replace the stylesheet
link in `index.html` with `@font-face` rules — the token names do not change.

---

## 5. Asset budget

The whole site currently ships:

| Asset | Size |
| --- | --- |
| `og-default.png` | 207 KB (not loaded by visitors — social crawlers only) |
| `icon-180.png` | 5.7 KB |
| `favicon.svg` | 6.8 KB |
| `logo-mark.svg` / `logo-mark-dark.svg` | 6.9 KB each |
| `logo-nivasync.svg` | 7.3 KB |
| CSS bundle | ~43 KB raw |
| Inline SVG (hero, icons, map) | counted inside the JS/HTML payload |

No image is loaded above the fold on any page. When product screenshots are
added they must be lazy-loaded below the fold with explicit dimensions — the
`ProductDetail` template already does this.
