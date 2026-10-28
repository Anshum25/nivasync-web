import type { Industry } from '@/types/content'

const SRC = 'https://skydotinfotech.com/assets/index-Dj6vDmZa.js (industries data array)'

/**
 * The twelve industry records published on the source site, all flagged
 * `verified: true` there. Names, descriptions and challenges are migrated
 * VERBATIM. The source's loose `solutions`/`products` name strings are resolved
 * here into real slugs so every cross-link points at a page that exists.
 */
export const industries: Industry[] = [
  {
    slug: 'railways',
    name: 'Railways',
    description:
      'Specialized monitoring and management systems designed specifically for railway operations and training.',
    challenges: [
      'Safety monitoring',
      'Large scale personnel training',
      'Real-time data processing',
    ],
    capabilitySlugs: ['software-development', 'web-development'],
    productSlugs: ['itms'],
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Strongest evidenced sector — see the 30-site deployment record.',
    },
  },
  {
    slug: 'government',
    name: 'Government',
    description:
      'Secure, scalable, and compliant software solutions for public sector organizations and government bodies.',
    challenges: [
      'Data security and compliance',
      'Legacy system integration',
      'Public service delivery efficiency',
    ],
    capabilitySlugs: ['software-development', 'erp-solutions', 'domain-registration'],
    productSlugs: ['sky-erp', 'itms'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'education',
    name: 'Education',
    description:
      'Comprehensive Campus OS, learning management, and student lifecycle administration.',
    challenges: [
      'Remote learning facilitation',
      'Student performance tracking',
      'Administrative overhead',
    ],
    capabilitySlugs: ['web-development', 'mobile-development', 'custom-application'],
    productSlugs: ['lms-moodle', 'cms', 'itms', 'sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    description:
      'End-to-end ERP operations covering BOM, production planning, quality control, and shop floor management.',
    challenges: [
      'Equipment downtime',
      'Supply chain visibility',
      'Inventory and scrap management',
    ],
    capabilitySlugs: ['erp-solutions', 'erpnext-implementation', 'frappe-development'],
    productSlugs: ['sky-erp', 'frappe-apps'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'finance',
    name: 'NBFC & Finance',
    description:
      'Compliance tracking, loan management, and highly secure financial reporting solutions.',
    challenges: ['Regulatory compliance', 'Loan lifecycle management', 'Data security'],
    capabilitySlugs: ['custom-application', 'erp-solutions', 'business-automation'],
    productSlugs: ['sky-erp', 'mcx-apis'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'logistics',
    name: 'Logistics',
    description:
      'Fleet management and Transport Management Systems (TMS) for global and local supply chains.',
    challenges: ['Route optimization', 'Fleet maintenance', 'Real-time tracking'],
    capabilitySlugs: ['software-development', 'erp-solutions', 'mobile-development'],
    productSlugs: ['sky-erp', 'frappe-apps'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'distribution',
    name: 'Distribution & Trading',
    description:
      'Streamlined multi-branch logistics, inventory tracking, and warehouse operations.',
    challenges: [
      'Multi-warehouse management',
      'Route planning',
      'Stock reconciliation',
    ],
    capabilitySlugs: ['erp-solutions', 'business-automation'],
    productSlugs: ['sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'retail',
    name: 'Retail & E-commerce',
    description:
      'Robust omnichannel operating systems bridging in-store POS and online storefronts.',
    challenges: [
      'Omnichannel experience',
      'Payment processing',
      'Customer retention',
    ],
    capabilitySlugs: ['web-development', 'mobile-development', 'erp-solutions'],
    productSlugs: ['sky-erp', 'pos'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description:
      'Integrated clinical and administrative operations, patient management, and billing.',
    challenges: ['Patient data management', 'Compliance', 'Resource scheduling'],
    capabilitySlugs: ['web-development', 'custom-application', 'business-automation'],
    productSlugs: ['sky-erp', 'frappe-apps'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    description:
      'Project management and broker CRMs designed specifically for real estate developers and agencies.',
    challenges: [
      'Lead management',
      'Project lifecycle tracking',
      'Broker commissions',
    ],
    capabilitySlugs: ['software-development', 'web-development'],
    productSlugs: ['sky-erp', 'frappe-apps'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'textile',
    name: 'Textile & Garments',
    description:
      'Style to season tracking, batch management, and precise manufacturing controls for apparel.',
    challenges: [
      'Variant management',
      'Seasonal demand forecasting',
      'Supply chain tracking',
    ],
    capabilitySlugs: ['erp-solutions', 'business-automation'],
    productSlugs: ['sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'fmcg',
    name: 'Dairy & FMCG',
    description:
      'Batch control, FEFO (First Expired, First Out) management, and fast-moving inventory tracking.',
    challenges: [
      'Perishable goods tracking',
      'Quality compliance',
      'Fast distribution cycles',
    ],
    capabilitySlugs: ['erp-solutions'],
    productSlugs: ['sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug)
}
