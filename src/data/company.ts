import type {
  CompanyStat,
  ContactChannel,
  Office,
  SocialProfile,
} from '@/types/content'

const BRIEF = 'Project brief supplied by the company, 2026-10-28'
const SKYDOT_CONFIG = 'https://skydotinfotech.com/assets/index-Dj6vDmZa.js (site config object)'

/**
 * ⚠ PRODUCTION DOMAIN — REQUIRES CONFIRMATION.
 *
 * `nivasync.in` is inferred from exactly one piece of evidence: the live Skydot
 * site publishes the NivaSync-branded address `hello@nivasync.in`. No NivaSync
 * website was found, so the host (`www.` or apex) is an assumption.
 *
 * Skydot's domain is deliberately NOT used as NivaSync's canonical domain.
 *
 * Everything SEO-related (canonicals, sitemap, Open Graph, JSON-LD) derives from
 * this one constant, so correcting it is a one-line change.
 */
export const SITE_ORIGIN = 'https://www.nivasync.in'

export const company = {
  name: 'NivaSync Infotech',
  legalName: 'NivaSync Infotech Pvt. Ltd.',
  shortName: 'NivaSync',
  /** Written for this build. The source site has no parent-company tagline. */
  tagline: 'Enterprise technology, engineered to last.',
  /**
   * Corporate description. Built from the parent/brand relationship the Skydot
   * site publishes verbatim, plus the verified capability and deployment record.
   */
  description:
    'NivaSync Infotech Pvt. Ltd. is the parent company behind Skydot Infotech. ' +
    'We engineer enterprise software, ERP platforms, training systems and digital ' +
    'infrastructure for government bodies, educational institutions and industry.',
  /**
   * The exact sentence the Skydot site publishes about the relationship. Quoted
   * rather than paraphrased so the brand architecture stays legally conservative.
   */
  brandStatement:
    'Skydot Infotech is a technology brand of NivaSync Infotech Pvt. Ltd., bringing ' +
    'together enterprise software, ERP, AI, custom development and digital engineering ' +
    'under one customer-focused identity.',
  foundedYear: null as number | null,
  /**
   * ⚠ Third-party directories indicate 2013. Not published: no first-party source
   * states a founding year, and the site must not assert one on directory evidence.
   */
  foundedYearNote:
    'Not published. Third-party directories indicate 2013; no first-party source confirms it.',
} as const

/**
 * ⚠ ADDRESS CONFLICT — LAUNCH BLOCKER. See docs/CONTENT_INVENTORY.md §4.1.
 *
 * The brief and the live Skydot site disagree on the landmark hotel and the PIN code:
 *   brief     → "Near Avalon Hotel",       380054
 *   live site → "Nr. Regenta Hotel, Ramdas Road", 380059
 *
 * The brief's version is used because it is the more recent instruction from the
 * company. This must be confirmed before launch.
 */
export const offices: Office[] = [
  {
    id: 'ahmedabad',
    label: 'Ahmedabad — Corporate Office',
    isHeadquarters: true,
    lines: [
      '603, Z1, ZION',
      'Near Avalon Hotel',
      'Bodakdev, Sindhu Bhavan Road',
    ],
    city: 'Ahmedabad',
    region: 'Gujarat',
    postalCode: '380054',
    country: 'India',
    countryCode: 'IN',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(
        '603, Z1, ZION, Near Avalon Hotel, Bodakdev, Sindhu Bhavan Road, Ahmedabad, Gujarat 380054',
      ),
    provenance: {
      tag: 'verified',
      origin: BRIEF,
      note:
        'CONFLICTS with the live Skydot site, which publishes "Nr. Regenta Hotel, ' +
        'Ramdas Road" and PIN 380059. Confirm before launch.',
    },
  },
]

/**
 * Rajkot, Vadodara and Hyderabad were queried in the brief as possible offices.
 * Resolved: the source site lists exactly one office (Ahmedabad). Those cities
 * appear as client/deployment locations. A historical Rajkot branch is listed by
 * third-party directories only and is NOT published here.
 */
export const unpublishedOfficeNote =
  'Only the Ahmedabad corporate office is published. Rajkot, Vadodara and Hyderabad ' +
  'appear in our delivery footprint as client locations, not as offices.'

export const contactChannels: ContactChannel[] = [
  {
    id: 'corporate-email',
    label: 'Corporate enquiries',
    value: 'hello@nivasync.in',
    href: 'mailto:hello@nivasync.in',
    kind: 'email',
    description: 'Partnerships, corporate and media enquiries.',
    provenance: { tag: 'verified', origin: SKYDOT_CONFIG },
  },
  {
    id: 'sales-phone',
    label: 'Sales',
    value: '+91 97144 90600',
    href: 'tel:+919714490600',
    kind: 'phone',
    description: 'New projects, products and commercial discussions.',
    provenance: { tag: 'verified', origin: SKYDOT_CONFIG },
  },
  {
    id: 'support-phone',
    label: 'Support',
    value: '+91 97145 90600',
    href: 'tel:+919714590600',
    kind: 'phone',
    description: 'Existing deployments and service requests.',
    provenance: { tag: 'verified', origin: SKYDOT_CONFIG },
  },
]

export const primaryEmail = contactChannels[0]
export const salesPhone = contactChannels[1]

/**
 * All three confirmed profiles are Skydot-branded. No NivaSync-branded account
 * exists, so they are presented under the Skydot brand rather than as NivaSync
 * corporate accounts. No placeholder or dummy icon is shown for networks the
 * company is not on.
 */
export const socialProfiles: SocialProfile[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://in.linkedin.com/in/skydotinfotech',
    brand: 'skydot',
  },
  { id: 'x', label: 'X', url: 'https://x.com/Skydotinfotech', brand: 'skydot' },
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/Skydotinfotech/',
    brand: 'skydot',
  },
]

/**
 * The company's own published figures. Tagged `company-stated` because they are
 * genuine first-party claims that cannot be audited externally — the UI labels
 * them accordingly rather than presenting them as measured results.
 */
export const companyStats: CompanyStat[] = [
  {
    value: '10+',
    label: 'Years of experience',
    provenance: { tag: 'company-stated', origin: SKYDOT_CONFIG },
  },
  {
    value: '300+',
    label: 'Clients served',
    provenance: { tag: 'company-stated', origin: SKYDOT_CONFIG },
  },
  {
    value: '15+',
    label: 'Proprietary products',
    provenance: { tag: 'company-stated', origin: SKYDOT_CONFIG },
  },
  {
    value: '500+',
    label: 'Projects delivered',
    provenance: { tag: 'company-stated', origin: SKYDOT_CONFIG },
  },
]

/** Verified, countable facts — derived from data in this repository, not claimed. */
export const verifiedFacts = [
  {
    value: '30',
    label: 'Named institutional deployment sites',
    detail: 'Railway, agricultural, medical and education institutes across India.',
  },
  {
    value: '12',
    label: 'Industries served',
    detail: 'From railways and government to manufacturing, FMCG and education.',
  },
  {
    value: '7',
    label: 'Proprietary platforms',
    detail: 'ERP, training management, learning, retail and market-data products.',
  },
] as const
