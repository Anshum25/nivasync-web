/**
 * Content models for the NivaSync corporate site.
 *
 * Every record carries a `source` tag. That tag is the mechanism which keeps the
 * acceptance criterion — "no invented testimonials, customers, statistics, awards
 * or vacancies presented as facts" — enforceable in code rather than by memory.
 *
 * See docs/BRAND_ARCHITECTURE.md §6 and docs/CONTENT_INVENTORY.md.
 */

/**
 * - `verified`        First-party published fact, or supplied directly by the company.
 * - `company-stated`  The company's own claim about itself; not externally auditable.
 *                     Rendered, but visibly attributed as a company-stated figure.
 * - `illustrative`    Example content present to demonstrate structure only.
 *                     Rendered with a visible marker.
 * - `pending-approval` Drafted but unapproved. Filtered out of production builds.
 */
export type SourceTag = 'verified' | 'company-stated' | 'illustrative' | 'pending-approval'

/** Where a migrated fact came from, kept for provenance. */
export interface Provenance {
  tag: SourceTag
  /** Origin URL, or a short note when the origin is the project brief. */
  origin: string
  /** Why this tag was chosen, when the reason is not obvious. */
  note?: string
}

export interface Office {
  id: string
  label: string
  isHeadquarters: boolean
  lines: string[]
  city: string
  region: string
  postalCode: string
  country: string
  countryCode: string
  /** Google Maps search URL. Built from the address, never from an invented place ID. */
  mapsUrl: string
  provenance: Provenance
}

export interface ContactChannel {
  id: string
  label: string
  /** Display form, e.g. "+91 97144 90600". */
  value: string
  /** `tel:` / `mailto:` target. */
  href: string
  kind: 'phone' | 'email'
  description: string
  provenance: Provenance
}

export interface SocialProfile {
  id: string
  label: string
  url: string
  /** Which brand owns the account. No NivaSync-branded account exists yet. */
  brand: 'nivasync' | 'skydot'
}

export interface CompanyStat {
  value: string
  label: string
  provenance: Provenance
}

export type BrandStatus = 'active' | 'planned' | 'retired'

export interface Brand {
  id: string
  name: string
  legalName?: string
  /** e.g. "Technology brand", "Product brand". Never "subsidiary". */
  role: string
  status: BrandStatus
  tagline: string
  summary: string
  focusAreas: string[]
  externalUrl?: string
  internalPath?: string
  /** CSS custom-property name — never a raw hex value. */
  accentVar: string
  provenance: Provenance
}

export type CapabilityCategory =
  | 'Digital Engineering'
  | 'Business Systems'
  | 'Digital Infrastructure'
  | 'Growth'

export interface Capability {
  slug: string
  title: string
  category: CapabilityCategory
  shortDescription: string
  description: string
  /** The business problem this capability answers. */
  problem: string
  features: string[]
  industries: string[]
  technologies: string[]
  /** Practical, non-numeric use cases. */
  useCases: string[]
  relatedProducts: string[]
  provenance: Provenance
}

/**
 * A named offering the company lists but has no detail content for. Published as a
 * named offering inside a capability page rather than promoted to a full page with
 * invented copy. See docs/CONTENT_INVENTORY.md §6.1.
 */
export interface NamedOffering {
  id: string
  label: string
  description: string
  capabilitySlug: string
  provenance: Provenance
}

export interface Product {
  slug: string
  title: string
  category: string
  description: string
  features: string[]
  industries: string[]
  technologies: string[]
  /** Empty on every record: the source site ships no screenshots. */
  screenshots: string[]
  externalUrl?: string
  /**
   * Lifecycle claims are deliberately separate from the description so that
   * "actively maintained / for sale / cloud-hosted" is never implied by prose.
   * `unconfirmed` renders as "contact us about availability".
   */
  availability: 'confirmed-active' | 'unconfirmed'
  provenance: Provenance
}

export interface Industry {
  slug: string
  name: string
  description: string
  challenges: string[]
  capabilitySlugs: string[]
  productSlugs: string[]
  provenance: Provenance
}

export interface CaseStudyResult {
  metric: string
  description: string
}

export interface CaseStudy {
  slug: string
  title: string
  client: string
  industry: string
  summary: string
  challenge: string
  solution: string
  results: CaseStudyResult[]
  technologies: string[]
  provenance: Provenance
}

export interface DeploymentSite {
  name: string
  shortName: string
  category: 'academy' | 'training-institute' | 'medical-research' | 'divisional-office' | 'other'
  lat: number
  lng: number
}

export interface ClientReference {
  name: string
  /** Sector grouping for display. Logo files are not available — names only. */
  group: 'public-institution' | 'enterprise'
}

export interface Article {
  slug: string
  title: string
  author: string
  /** ISO-8601, for <time> and structured data. */
  date: string
  displayDate: string
  category: string
  summary: string
  /** Paragraphs of body copy. */
  body: string[]
  relatedSlugs: string[]
  provenance: Provenance
}

export interface JobOpening {
  slug: string
  title: string
  location: string
  type: string
  summary: string
  provenance: Provenance
}
