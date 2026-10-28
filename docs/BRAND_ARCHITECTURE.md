# Brand Architecture — NivaSync Infotech

**Status:** working model for the corporate website. Legal terminology flagged below
requires corporate confirmation before launch.

---

## 1. The confirmed relationship

```
NivaSync Infotech Pvt. Ltd.          ← parent corporate entity
└── Skydot Infotech                  ← operating technology brand
    ├── skydotinfotech.com           (live brand website)
    ├── SKYDOTERP   → skyerpnext.in  (product, external)
    └── SkyLMS       → skylms.in     (product, external)
```

**Evidence.** This is not an assumption made for the design. The live Skydot site
publishes it in its own words:

> "Skydot is a technology brand of NivaSync Infotech Pvt. Ltd., bringing together
> enterprise software, ERP, AI, custom development and digital engineering under one
> customer-focused identity."

> "Skydot brings NivaSync's technology capabilities to businesses through a focused
> digital [brand]."

The Skydot site already carries a "Visit NivaSync Infotech Pvt. Ltd." call to action and
publishes the NivaSync-branded address `hello@nivasync.in`. The brief's instruction and
the company's published position agree.

## 2. Language rules (important)

The word used throughout the site is **brand**, never *subsidiary*, *division*,
*holding company*, *group company* or *wholly-owned*.

| Use | Do not use |
| --- | --- |
| "Skydot Infotech is a technology brand of NivaSync Infotech Pvt. Ltd." | "subsidiary of" |
| "operating brand", "brand within the NivaSync ecosystem" | "division", "business unit" (unimplied) |
| "NivaSync Infotech Pvt. Ltd." (full legal name in footer, legal pages, schema) | "NivaSync Group", "NivaSync Holdings" |

**Rationale.** The brief confirms a parent-company / brand relationship and explicitly
forbids implying ownership structures beyond it. "Brand of" is exactly what the company
itself publishes, so it is both accurate and already approved copy.

**⚠ Requires corporate confirmation before launch:**

- Whether Skydot Infotech is a *registered legal entity* or a *trading brand name* of
  NivaSync Infotech Pvt. Ltd. The site deliberately does not state either.
- Whether "Pvt. Ltd." / "Private Limited" should be rendered in full in body copy.
- Whether CIN / GSTIN should appear in the footer (common for Indian corporate sites;
  currently **omitted** because no number was found).

## 3. Positioning split — who says what

The two brands must not read as the same company twice. The site separates them by
**altitude**, not by vocabulary.

| | **NivaSync Infotech** (this site) | **Skydot Infotech** (skydotinfotech.com) |
| --- | --- | --- |
| Role | Parent organisation, engineering standards, long-term capability | Customer-facing delivery brand |
| Voice | Corporate, institutional, "how we are built" | Commercial, service-led, "what we deliver" |
| Audience | Management, government and enterprise buyers, partners, candidates | Businesses buying a project or a product |
| Leads with | Engineering discipline, deployment footprint, governance | Solutions, products, pricing conversations |
| Owns | Brand ecosystem, corporate facts, careers, legal, insights | Service catalogue, product marketing, support |

This is why the NivaSync homepage opens on *how the organisation is built* and the
deployment footprint, and routes commercial detail to Skydot — rather than restating
Skydot's service cards under a new logo.

## 4. Scalable brand model

Brands are data, not markup. `src/data/brands.ts` holds an array of `Brand` records:

```ts
type Brand = {
  id: string
  name: string
  legalName?: string
  role: string            // "Technology brand", "Product", …
  status: 'active' | 'planned' | 'retired'
  summary: string
  focusAreas: string[]
  externalUrl?: string
  internalPath?: string
  accent: string          // design token name, not a raw hex value
  source: SourceTag       // provenance — see §6
}
```

Adding a verified brand, product brand or business unit means appending one object. The
`/brands` page, the homepage ecosystem section, and the footer ecosystem column all read
from the same array, so nothing needs rewriting.

**Currently populated:** Skydot Infotech (active). SKYDOTERP and SkyLMS are modelled as
**product brands with their own domains**, which is why they appear with external links
rather than as separate top-level brands.

## 5. Visual relationship

Each brand carries its own colours. NivaSync's come from the official logo;
Skydot retains its published brand colours so it stays recognisable.

| Brand | Colours | Source |
| --- | --- | --- |
| NivaSync | `#FC6302` orange, `#024BB1` blue | **OFFICIAL** — sampled directly from the logo artwork supplied by the company |
| Skydot | `#F05A28` orange, `#1677FF` blue | **VERIFIED** — `theme-color` meta tag and CSS variables on the live Skydot site |

The two palettes are deliberately close in family but distinct in value, which
is exactly right for a parent and its brand: related, not interchangeable.

### The official mark

The logo is an **N** built from two counter-rotating arrows that close into a
circle — one orange descending, one blue ascending. It reads simultaneously as
the initial, as a cycle, and as the "sync" in the name.

The site uses a **vector trace of the supplied artwork**, not a redraw:

- `scripts/trace-logo.mjs` isolates each brand colour into a mask and traces it,
  preserving the thin white hairline that splits the mark.
- `scripts/generate-brand-assets.mjs` emits every derivative from that one
  trace: the favicon, the mark, the dark-surface variant, the wordmark lockup,
  and the path data the React component renders.
- `scripts/generate-og.mjs` renders the social image from the real artwork and
  the real typeface in headless Chromium.

Run all three with `npm run brand`. Because everything derives from one source,
the mark cannot drift between the header, the footer, the favicon, the boot
screen and the social card.

### How the colours are used

| Role | Value | Why |
| --- | --- | --- |
| Primary accent — buttons, links, focus rings | Blue `#024BB1` | 7.9:1 on white, so it carries UI and text as well as brand |
| Energy accent — section rules, diagram nodes, arrows | Orange `#FC6302` | 3.0:1 on white: correct for graphics and large type, **not** for body text |
| Orange as text | `#B84A00` | The text-safe equivalent at 5.2:1 |
| Accent on dark surfaces | Blue `#4D8FE8` | The official blue is 2.5:1 on near-black and disappears |
| Ink | `#070C16` | Tinted toward the brand blue, so inverted bands read as the identity rather than as generic dark mode |

### ⚠ One adaptation requiring brand confirmation

On near-black surfaces — the inverted hero and CTA bands, dark mode, and the
boot screen — **the mark's blue is lightened** from `#024BB1` to `#4D8FE8`. At
its official value the blue scores 2.5:1 against the ink and is effectively
invisible. The orange is unchanged.

This is a legibility adaptation, not a redesign, and it is contained: the mark
reads `var(--logo-blue)`, which only the dark contexts override. If the brand
owner prefers the exact value everywhere, delete the `--logo-blue` override in
`.dark` and `.on-inverse` — but the mark will be very hard to see.

### Surfaces

The site uses three surfaces, and **all three follow the theme** — there is no
inverted band:

| Surface | Light | Dark | Used for |
| --- | --- | --- | --- |
| Default | `#FCFDFE` | `#070C16` | Most sections |
| Sunken | `#F1F4F9` | `#04070E` | Alternating sections |
| Emphasis (`.band-emphasis`) | `#EAF1FD` — soft brand tint | `#101728` — raised ink | Hero, CTA, footer, feature sections |

An earlier version inverted the emphasis band: a near-black hero and footer on
an otherwise light page. It photographed well and read badly — it broke the
page's rhythm and gave light-mode visitors a dark section they had not chosen.
The band now shifts *within* the theme instead of against it, and browser tests
measure the computed luminance of every large surface in both modes to keep it
that way.

### Typography

| Role | Family | Why |
| --- | --- | --- |
| Display / headings | **Plus Jakarta Sans** (700/800) | Geometric-humanist, with the same confident geometry as the mark. Bold headings match a bold logo; thin ones fight it. |
| Body / UI | **Inter** (400–600) | The most legible screen sans at small sizes, and visually quiet next to the display face. |

Both are variable fonts from Google Fonts under the SIL Open Font License, and
both have metric-matched fallback faces so the web-font swap causes no layout
shift.

## 6. Provenance tagging

Every content record in `src/data/` carries a `source` tag, and the UI can surface it:

| Tag | Meaning | Rendering rule |
| --- | --- | --- |
| `verified` | First-party published fact, or supplied in the brief | Rendered normally |
| `company-stated` | The company's own claim about itself, not externally auditable | Rendered, labelled as company-stated |
| `illustrative` | Example content for structure only | Rendered with a visible "illustrative" marker |
| `pending-approval` | Drafted, awaiting company sign-off | **Not rendered in production builds** |

This is the mechanism that keeps the acceptance criterion "no invented testimonials,
customers, statistics, awards or vacancies presented as facts" enforceable in code rather
than by memory.
