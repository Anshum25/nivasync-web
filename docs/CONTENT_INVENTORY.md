# Content Inventory — audit of skydotinfotech.com

**Audit date:** 2026-10-28
**Purpose:** source-content audit for the NivaSync Infotech corporate website build
**Sources of record:** `https://skydotinfotech.com/` (live site), its published
`sitemap.xml`, `robots.txt`, and its client JavaScript bundle `/assets/index-Dj6vDmZa.js`.

---

## 1. How this audit was performed (and its limits)

The live Skydot site is a **client-rendered React single-page application**. Every route
(`/`, `/about`, `/contact`, …) returns the identical 2,522-byte HTML shell with an empty
`<div id="root">`. Fetching a route therefore yields **no readable page text**.

| Method | Result |
| --- | --- |
| HTML fetch of `/`, `/about`, `/contact`, `/work`, `/products`, `/solutions`, `/industries` | HTTP 200, identical shell, no content |
| `sitemap.xml` | **Retrieved** — 31 URLs, full route inventory |
| `robots.txt` | **Retrieved** — Cloudflare-managed, `Content-Signal: search=yes,ai-train=no,use=reference` |
| JS bundle `/assets/index-Dj6vDmZa.js` (828 KB) | **Retrieved** — content data models recovered from string literals |
| Image / logo binaries under `/logo/`, `/world.svg`, `/placeholder.svg` | **Not downloaded.** Filenames only. |

**Honest statement of limits:**

- Content below was recovered from the published bundle's data objects. It is the
  content the live site renders, but it was **not** read from a visually rendered page,
  so incidental micro-copy inside components may be incomplete.
- **No image, logo, or screenshot asset was downloaded.** All imagery referenced by the
  current site is unavailable to this build and is listed in `docs/ASSET_INVENTORY.md`
  as "must be supplied".
- The legacy routes named in the project brief (`/services/software-development/`,
  `/services/erp-solution/`, `/services/domain-registration/`,
  `/products/accounting-software/`, `/products/real-estate-portal/`, `/careers/`)
  **do not exist** in the current sitemap and returned no content. They appear to
  describe a **previous generation** of the Skydot site. Items referenced only by those
  dead routes (notably "eCount accounting software" and "Real Estate Portal" as
  products) are therefore recorded below as **UNVERIFIED — not present on the current
  site** and are not published as NivaSync products.
- `robots.txt` carries `ai-train=no`. This audit performs **no model training**; it is a
  first-party content migration for the site owner, and `use=reference` is honoured.

---

## 2. Route inventory (from published sitemap.xml — 31 URLs)

The sitemap canonicalises on the **`www.`** host.

```
/                                         /products/itms
/about                                    /products/lms
/contact                                  /products/cms
/work                                     /products/pos
/insights                                 /products/moodle
/solutions                                /products/mcx-apis
/products                                 /solutions/ai-automation
/industries                               /solutions/web-software-development
/work/national-railway-infrastructure     /solutions/mobile-development
/work/enterprise-erp-manufacturing        /solutions/erp-enterprise
/work/ai-inventory-optimization           /solutions/cloud-infrastructure
/work/fintech-mobile-banking              /solutions/frappe-services
/industries/government                    /solutions/moodle-services
/industries/railways                      /industries/education
/industries/manufacturing                 /industries/real-estate
/industries/retail
```

**No `/careers`, `/privacy`, or `/terms` route exists on the current Skydot site.**
Those pages are new work for NivaSync with no legacy content to migrate.

---

## 3. Corporate identity and the parent-company relationship

**This is the most important audit finding:** the live Skydot site **already publishes
the NivaSync parent relationship.** The brand architecture described in the project
brief is confirmed by the company's own published site, verbatim:

> "Skydot is a technology brand of NivaSync Infotech Pvt. Ltd., bringing together
> enterprise software, ERP, AI, custom development and digital engineering under one
> customer-focused identity."

> "Skydot brings NivaSync's technology capabilities to businesses through a focused
> digital [brand]."

The site's footer links to "NivaSync Infotech Pvt. Ltd." with "Learn more about
NivaSync" and "Visit NivaSync Infotech Pvt. Ltd." calls to action.

**Status: VERIFIED (first-party published).** Safe to build on.

The site also publishes the NivaSync-branded email `hello@nivasync.in`, which is the
only evidence available for the intended NivaSync domain — see
`docs/DEPLOYMENT.md` §"Domain confirmation required".

---

## 4. Contact information

Recovered from the site configuration object in the bundle:

| Field | Value | Status |
| --- | --- | --- |
| Corporate email | `hello@nivasync.in` | **VERIFIED** — published, and NivaSync-branded |
| Phone (sales) | `+91 97144 90600` | **VERIFIED** — site config `phone`, labelled "Sales:" |
| Phone (support) | `+91 97145 90600` | **VERIFIED** — labelled "Support:" |
| Office (only one in config) | Ahmedabad (HQ) | **VERIFIED** as the sole published office |
| Facebook | `https://www.facebook.com/Skydotinfotech/` | VERIFIED (Skydot brand) |
| X / Twitter | `https://x.com/Skydotinfotech` | VERIFIED (Skydot brand) |
| LinkedIn | `https://in.linkedin.com/in/skydotinfotech` | VERIFIED (Skydot brand) |

Additional emails surfaced by third-party search but **not** found in the bundle, and
therefore unconfirmed: `support@skydotinfotech.com`, `business@skydotinfotech.com`.
These are **not published** on the NivaSync site.

All three social profiles are **Skydot-branded**. No NivaSync-branded social profile
exists. They are therefore presented in the footer under the Skydot brand, not as
NivaSync corporate accounts.

### 4.1 ⚠ CONFLICT — corporate address (LAUNCH BLOCKER)

Two different addresses exist for the same office:

| Source | Address |
| --- | --- |
| **Project brief** (supplied in this session) | 603, Z1, ZION, **Near Avalon Hotel**, Bodakdev, Sindhu Bhavan Road, Ahmedabad, Gujarat **380054** |
| **Live Skydot site** (published) | 603, ZION Z1, **Nr. Regenta Hotel, Ramdas Road**, SindhuBhavan Road, Bodakdev, Ahmedabad, Gujarat **380059** |

They agree on `603, ZION Z1 / Bodakdev / Sindhu Bhavan Road / Ahmedabad` and disagree on
the **landmark hotel** and the **PIN code**.

**Decision taken:** the brief's version is used, because it is the most recent
instruction from the company itself. It is isolated in one place
(`src/data/company.ts`) so a correction is a one-line change. **This must be confirmed
by the company before launch.**

### 4.2 ⚠ Rajkot / Vadodara / Hyderabad — resolved

The brief asked whether Skydot has offices in Rajkot, Vadodara and Hyderabad.

**Finding:** the current site's config contains **exactly one** office — Ahmedabad (HQ).
Rajkot, Vadodara, Hyderabad and ~27 other cities appear on the site **as client /
deployment locations**, not as offices (see §11). Third-party directories (ZoomInfo,
Dun & Bradstreet) do list a historical **Rajkot branch** ("Balaji, Plot No. 99, Jayram
Park, Kothariya Road, Rajkot – 360002") and a phone `+91 7043412079`, but these are
**third-party, unconfirmed, and possibly stale.**

**Decision taken:** the NivaSync site publishes **only the Ahmedabad HQ**. The
architecture supports multiple offices (`company.offices[]`) so a verified branch can be
added as one object.

---

## 5. Company-stated statistics

Published in the live site's config as `stats`:

| Value | Label |
| --- | --- |
| 10+ | Years of Experience |
| 300+ | Clients Worldwide |
| 15+ | Proprietary Products |
| 500+ | Projects Delivered |

**Status: COMPANY-STATED, not independently verifiable.** These are the company's own
published claims about itself, so they are not fabricated — but they cannot be audited
from outside.

**Decision taken:** carried over, and rendered through a single component that labels
them as company-stated figures rather than as audited metrics. A third-party search
indicates the company was **founded in 2013** (consistent with "10+ years"); 2013 is
recorded as UNCONFIRMED and is **not** published as a founding date.

---

## 6. Capabilities / solutions (10 records — all `verified: true` in source)

Grouped by the source's own `category` field.

### Digital Engineering
| Title | Slug | Short description |
| --- | --- | --- |
| Web Development | `web-development` | Custom website design and highly performant web applications. |
| Software Development | `software-development` | Creating custom software for real-world enterprise needs. |
| Mobile Application Development | `mobile-development` | Turning ideas into powerful mobile experiences for iOS and Android. |
| Custom Application Development | `custom-application` | Bespoke applications designed for specialized workflows. |

### Business Systems
| Title | Slug | Short description |
| --- | --- | --- |
| ERP Solutions | `erp-solutions` | Integrating business processes into one smart ERP system. |
| ERPNext Implementation | `erpnext-implementation` | End-to-end implementation of the ERPNext framework. |
| Frappe Development | `frappe-development` | Tailored customizations on the open-source Frappe framework. |
| Business Automation | `business-automation` | Automating repetitive workflows and integrating intelligent systems. |
| HR Management | `hr-management` | Managing people, policies, and performance. |

### Digital Infrastructure
| Title | Slug | Short description |
| --- | --- | --- |
| Domain Registration | `domain-registration` | Secure domain procurement and lifecycle management. |

Each record carries `features[]`, `industries[]`, `technologies[]` and a long
`description`, migrated verbatim into `src/data/capabilities.ts`.

### 6.1 Secondary service labels (navigation-only, no detail content)

The current site's footer/menu also lists **Hosting, SSL, Business Email, SEO, Digital
Marketing, CMS, Bulk SMS, Cloud Infrastructure, AI & Intelligent Systems**. These exist
as **menu labels pointing at aggregate pages** — they have no dedicated descriptions,
features or detail copy in the source.

**Status: PARTIALLY VERIFIED** (the company lists them as offerings; no detail copy exists).

**Decision taken:** published as named offerings within the relevant capability pages,
**not** promoted to full detail pages with invented copy.

---

## 7. Products (7 records — all `verified: true` in source)

| Title | Slug | Category | External URL |
| --- | --- | --- | --- |
| SKYDOTERP | `sky-erp` | Enterprise | `https://skyerpnext.in` |
| Frappe Custom Apps | `frappe-apps` | Enterprise | — |
| ITMS (Institute Training Management System) | `itms` | Training Management | — |
| LMS – Moodle | `lms-moodle` | Education | `https://skylms.in` |
| Course Management System (CMS) | `cms` | Education Technology | — |
| POS (Point of Sale) | `pos` | Retail | — |
| MCX APIs | `mcx-apis` | Finance | — |

Every record has `description`, `features[]`, `industries[]`, `technologies[]`, and an
**empty `screenshots: []` array** — the current site ships **no product screenshots**.
Designed placeholders are required (see `docs/ASSET_INVENTORY.md`).

### 7.1 ⚠ Products named in the brief but NOT on the current site

| Brief item | Finding |
| --- | --- |
| **eCount accounting and business software** | **NOT FOUND.** No reference anywhere in the current site or bundle. Legacy route `/products/accounting-software/` does not exist. |
| **Real Estate Portal** | **NOT FOUND as a product.** `real-estate` exists only as an **industry**. Legacy route `/products/real-estate-portal/` does not exist. |

**Decision taken:** neither is published. Publishing them would claim a product is
current with no evidence, which the brief forbids. Both are logged in
`docs/QA_CHECKLIST.md` as "awaiting company confirmation — supply details to publish".

---

## 8. Industries (12 records — all `verified: true` in source)

`finance` (NBFC & Finance) · `logistics` · `government` · `railways` · `manufacturing` ·
`distribution` (Distribution & Trading) · `healthcare` · `retail` (Retail & E-commerce) ·
`education` · `real-estate` · `textile` (Textile & Garments) · `fmcg` (Dairy & FMCG)

Each carries a `description`, three `challenges[]`, and linked `solutions[]` and
`products[]`. All migrated verbatim.

---

## 9. Reconciling the brief's service list against reality

The brief listed 13 "discovery candidates". Verification outcome:

| Brief candidate | Status on current site | Published on NivaSync site? |
| --- | --- | --- |
| Custom software development | VERIFIED (full record) | Yes — capability page |
| Web development | VERIFIED (full record) | Yes — capability page |
| Mobile application development | VERIFIED (full record) | Yes — capability page |
| ERP / ERPNext solutions | VERIFIED (3 full records) | Yes — capability pages |
| HR management solutions | VERIFIED (full record) | Yes — capability page |
| Content management systems | VERIFIED as a **product** (CMS) + menu label | Yes — product + named offering |
| Digital transformation / integration | VERIFIED via Business Automation record | Yes — capability page |
| Domain registration | VERIFIED (full record) | Yes — capability page |
| Web hosting | Menu label only, no detail copy | Named offering only |
| Business email | Menu label only, no detail copy | Named offering only |
| Search engine optimization | Menu label only, no detail copy | Named offering only |
| Digital marketing | Menu label only, no detail copy | Named offering only |
| Bulk SMS / messaging | Menu label only, no detail copy | Named offering only |

---

## 10. Work / case studies — most important integrity finding

The current site publishes **four** case studies. They are **not of equal quality.**

### 10.1 `national-railway-infrastructure` — CORROBORATED ✅

"Transforming Training Lifecycle with ITMS", client **Indian Railways**, industry
Government & Railways. Technologies: PHP, Django, MySQL, Apache Superset.
Stated results: `100%` digitization of training lifecycle, `Real-time` visibility into
trainee records and faculty management.

**Why this one is credible:** it is independently corroborated *within the same source*
by a **30-site deployment map** (§11) naming real, checkable institutions, by the ITMS
product record, and by a client roster including Indian Railways, IRISET, IRIMEE, ZRTI,
STTI and DIET'S. Its two "results" are **qualitative**, not invented numbers.

**Decision taken:** published as the flagship case study.

### 10.2 The other three — NOT VERIFIABLE, EXCLUDED ⚠

| Slug | Client as named | Claimed metrics |
| --- | --- | --- |
| `enterprise-erp-manufacturing` | "Leading Manufacturing Firm" | 40% reduction in procurement discrepancies; 3 weeks saved annually |
| `ai-inventory-optimization` | "Global Retail Chain" | 22% increase in stock availability; **$1.4M saved** |
| `fintech-mobile-banking` | "Regional Bank" | App rating **4.8 (from 3.1)**; 60% fewer support tickets |

All three use **anonymous placeholder client names** and quote **precise financial and
performance metrics with no attributable source**. Their technology stacks (Java Spring
Boot/Oracle, AWS SageMaker, Go/Kubernetes) are **absent from every verified capability
and product record**, which consistently list Frappe, Python, React, Node, PHP and
MariaDB.

**Decision taken: these three are NOT published on the NivaSync site.** Republishing
"$1.4M saved" for an unnamed client under a new corporate brand would present an
unverifiable metric as corporate fact — explicitly forbidden by the brief. They remain
recorded here so the company can supply evidence and have them reinstated; the Work page
architecture accepts them the moment a verified record is provided.

---

## 11. Deployment footprint — 30 named institutions (strongest verified evidence)

Recovered from the site's interactive map, with latitude/longitude for each. These are
**named, real, checkable public institutions** and are the best evidence of delivery
capability anywhere on the source site.

**National academies & institutes (8)**
National Academy of Indian Railways (NAIR), Vadodara · National Academy of Agricultural
Research Management (NAARM), Hyderabad · Indian Railways Institute of Mechanical and
Electrical Engineering (IRIMEE), Jamalpur · Indian Railways Institute of Signal and
Telecommunication Engineering (IRISET), Secunderabad · Indian Railways Institute of
Disaster Management (IRIDM), Bengaluru · Multi-Disciplinary Divisional Training
Institute (MDDTI), Bengaluru · Specialised Training Institute (STI), Ajmer ·
Agricultural Co-operative Staff Training Institute (ACSTI), Shimla

**Zonal & signal/telecom training institutes (6)**
ZRTI Udaipur · ZRTI Alipurduar (WB) · STTI Sabarmati (Ahmedabad) · STTI Byculla
(Mumbai) · STTI Pandu (Assam) · STTI Podanur (Tamil Nadu)

**Medical & research (2)**
All India Institute of Medical Science (AIIMS), Jodhpur · Institute of Teaching and
Research in Ayurveda (ITRA), Jamnagar

**Divisional Railway Manager offices (12)**
Vadodara · Jabalpur · Kota · Gwalior · Agra · Howrah · Guntakal · Secunderabad ·
Vijayawada · Kacheguda · Nanded · Agartala

**Other (2)**
Diesel Loco Shed, Andal, Asansol (WB) · District Institute of Education & Training
(DIET'S), Gujarat

**Status: COMPANY-PUBLISHED, named and checkable.** Published on the NivaSync site as a
deployment footprint.

---

## 12. Client roster — 25 names (logo files NOT available)

Published as logo images on the current site. **Names only** were recovered; the image
files were not downloaded.

Shree Lifecare · Spectrum Printech · Verdict Group · VGE LLP · Millenio Ventures ·
Metalix · ZRTI · Uzalla BioGas · Pragna Chemicals · Katariya Snacks · 3 Square Design ·
7 Star Pune · Indian Railways · AIIMS Jodhpur · Diesel Loco Shed · DIET'S Rajkot ·
IRISET Secunderabad · HPSCB · IRIDM · ITRA Jamnagar · DIET'S Mahesana · ICAR ·
IRIMEE Jamalpur · STTI Pandu · STTC

**Decision taken:** rendered as a **typographic roster**, not as logo images.
Third-party logos are trademarks of their owners, the files are unavailable, and their
licence for use under a *new* corporate brand is unconfirmed. The component accepts logo
images once the company supplies files and confirms permission.

---

## 13. Insights / articles (2 records)

| Title | Slug | Date | Category |
| --- | --- | --- | --- |
| The Future of ERP in Manufacturing | `future-of-erp-in-manufacturing` | August 24, 2026 | Enterprise Software |
| Automating Compliance with AI Document Processing | `ai-in-document-processing` | August 15, 2026 | Artificial Intelligence |

Full body copy recovered for both and migrated verbatim, re-attributed to **NivaSync
Engineering**. The source's "Skydot AI Research Lab" byline is **not** carried over — no
evidence of such a named lab exists.

**No new articles were generated.** The brief forbids padding the site with filler.

---

## 14. Homepage narrative elements (migrated, reframed to parent-company voice)

- Hero headline: "Technology built around your business."
- Hero subheadline: "AI, ERP, software and digital products engineered around the way your business works."
- Positioning: "One technology partner. / Multiple ways to move your business forward."
- Four pillars: `01 AI & Intelligent Systems` · `02 ERP & Business Automation` · `03 Custom Software` · `04 Digital Products`
- Five-step process: `01 Understand` (Map goals, constraints, and systems) · `02 Design` (Shape architecture and experience) · `03 Build` (Engineer with clarity and discipline) · `04 Launch` (Deploy, validate, and support) · `05 Improve` (Measure, refine, and evolve)
- "Technology is only valuable when it works in the real world."

---

## 15. About page copy (migrated)

- "Skydot Infotech is a mature technology partner focused on solving complex business challenges through rigorous software engineering and digital innovation."
- "Founded on a commitment to delivering reliable technology solutions."
- "Over the years, we have grown into a comprehensive engineering firm, partnering with enterprises, government bodies, and educational institutions to modernize their digital infrastructure."
- "We are technologists, but our focus is always on business outcomes. We design, engineer, and deploy custom software, enterprise web applications, and robust ERP systems."
- Team / Culture / Vision framing: "we believe in the power of a dedicated **Team**…", "Our vibrant **Culture** fosters creativity and collaboration…", "driven by a shared **Vision** to engineer the future of software, AI, and digital transformation."

**No formal mission/vision statement is published**, and **no leadership names, bios,
founding date, awards or certifications appear anywhere on the current site.** None are
invented. Third-party directories list staff names; these are **not** published without
consent.

---

## 16. Practices on the current site deliberately NOT carried over

| Current Skydot practice | Why it is not carried over |
| --- | --- |
| Hotlinked Unsplash images (`images.unsplash.com/photo-…`) on About page cards | The brief forbids hotlinking as a production strategy. Replaced with original SVG/CSS visuals. |
| `imageUrl: '/placeholder.svg'` on all four case studies | Replaced with a designed, clearly labelled placeholder component. |
| Three unverifiable case studies with invented metrics | See §10.2. |
| "Skydot AI Research Lab" byline | No evidence such a lab exists. |
| Client logo images | Rights and availability unconfirmed — see §12. |

---

## 17. Source-URL provenance record

Every migrated fact traces to one of:

- `https://skydotinfotech.com/` → HTML shell, meta tags, brand colour `#f05a28`
- `https://skydotinfotech.com/sitemap.xml` → route inventory (§2)
- `https://skydotinfotech.com/robots.txt` → crawl directives
- `https://skydotinfotech.com/assets/index-Dj6vDmZa.js` → all content data (§3–§15)
- Project brief supplied in-session → corporate address (§4.1), parent/brand relationship

Per-record provenance is encoded in the `source` field of each entry under `src/data/`.
