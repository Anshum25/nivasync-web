import type { Brand } from '@/types/content'

const SRC = 'https://skydotinfotech.com/ (published brand statement and footer)'

/**
 * The NivaSync brand ecosystem.
 *
 * Brands are DATA, not markup. The /brands page, the homepage ecosystem section
 * and the footer ecosystem column all read from this one array, so adding a
 * verified brand means appending one object — nothing needs rewriting.
 *
 * Language rule (docs/BRAND_ARCHITECTURE.md §2): `role` says "brand", never
 * "subsidiary", "division" or "group company". The relationship confirmed by the
 * brief and published by the company is parent-company-to-brand, and the site
 * does not imply anything beyond it.
 */
export const brands: Brand[] = [
  {
    id: 'skydot',
    name: 'Skydot Infotech',
    role: 'Technology brand',
    status: 'active',
    tagline: 'Technology that moves businesses forward.',
    summary:
      'Skydot Infotech is a technology brand of NivaSync Infotech Pvt. Ltd., bringing ' +
      'together enterprise software, ERP, AI, custom development and digital engineering ' +
      'under one customer-focused identity.',
    focusAreas: [
      'Enterprise software',
      'ERP & business systems',
      'Custom development',
      'Digital engineering',
    ],
    externalUrl: 'https://skydotinfotech.com/',
    accentVar: '--skydot-orange',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Summary is the company’s own published sentence, quoted rather than paraphrased.',
    },
  },
  {
    id: 'skydoterp',
    name: 'SKYDOTERP',
    role: 'Product brand',
    status: 'active',
    tagline: 'ERPNext-powered enterprise operations.',
    summary:
      'An integrated enterprise platform powered by ERPNext for managing operations ' +
      'across finance, HR, manufacturing and more. Operated under the Skydot brand with ' +
      'its own product domain.',
    focusAreas: ['Finance', 'HR & payroll', 'Manufacturing', 'Inventory', 'CRM'],
    externalUrl: 'https://skyerpnext.in',
    internalPath: '/products/sky-erp',
    accentVar: '--skydot-blue',
    provenance: {
      tag: 'verified',
      origin: 'Product record and external URL published on skydotinfotech.com',
    },
  },
  {
    id: 'skylms',
    name: 'SkyLMS',
    role: 'Product brand',
    status: 'active',
    tagline: 'Learning management at institutional scale.',
    summary:
      'A comprehensive Learning Management System built on a customised Moodle ' +
      'deployment, for scalable and highly interactive e-learning platforms.',
    focusAreas: ['Online classes', 'Assessment', 'Institutional e-learning'],
    externalUrl: 'https://skylms.in',
    internalPath: '/products/lms-moodle',
    accentVar: '--accent',
    provenance: {
      tag: 'verified',
      origin: 'Product record and external URL published on skydotinfotech.com',
    },
  },
]

/** How the parent company describes its own role, for the ecosystem sections. */
export const ecosystemIntro = {
  label: 'Brand ecosystem',
  headline: 'One engineering organisation. Distinct brands for distinct markets.',
  body:
    'NivaSync Infotech Pvt. Ltd. is the parent company. Our engineering standards, ' +
    'delivery practice and long-term platform investment sit here. Our brands take ' +
    'those capabilities to market, each with its own identity and its own customers.',
  /**
   * ⚠ Flagged for corporate confirmation: whether Skydot Infotech is a separately
   * registered legal entity or a trading brand name. The site asserts neither.
   */
  legalNote:
    'Corporate structure terminology beyond the parent-company and brand relationship ' +
    'requires corporate confirmation before publication.',
} as const

export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id)
}

export const activeBrands = brands.filter((b) => b.status === 'active')
