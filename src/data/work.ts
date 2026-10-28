import type { CaseStudy } from '@/types/content'

const SRC = 'https://skydotinfotech.com/assets/index-Dj6vDmZa.js (case study data object)'

/**
 * PUBLISHED CASE STUDIES.
 *
 * The source site publishes four. Only this one is published here, because it is
 * the only one that can be corroborated: the same source independently names 30
 * real institutional deployment sites running ITMS, lists Indian Railways,
 * IRISET, IRIMEE, ZRTI and STTI among its clients, and carries ITMS as a product
 * record. Its two stated results are qualitative, not invented figures.
 *
 * The other three are in `withheldCaseStudies` below with the reasoning.
 * See docs/CONTENT_INVENTORY.md §10.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'national-railway-infrastructure',
    title: 'Transforming the training lifecycle with ITMS',
    client: 'Indian Railways',
    industry: 'Government & Railways',
    summary:
      'An integrated digital platform designed to manage and streamline the complete training lifecycle of an institute into a single centralized system.',
    challenge:
      'Managing training planning, course management, trainee records, and faculty attendance manually led to massive inefficiencies, delayed reporting, and fragmented assessments across the institute.',
    solution:
      'We engineered the ITMS (Institute Training Management System) platform, bringing training planning, course management, attendance, assessments, examinations, and detailed reporting into a unified, secure dashboard.',
    results: [
      { metric: '100%', description: 'Digitization of training lifecycle and assessments.' },
      {
        metric: 'Real-time',
        description: 'Visibility into trainee records and faculty management.',
      },
    ],
    technologies: ['PHP', 'Django', 'MySQL', 'Apache Superset'],
    provenance: {
      tag: 'verified',
      origin: SRC,
      note:
        'Corroborated within the same source by the 30-site deployment record, the ' +
        'ITMS product record and the client roster.',
    },
  },
]

/**
 * ⚠ WITHHELD — three case studies published on the source site that are NOT
 * republished here.
 *
 * Each names an anonymous client ("Leading Manufacturing Firm", "Global Retail
 * Chain", "Regional Bank") and quotes precise financial or performance metrics
 * with no attributable source. Their technology stacks (Java Spring Boot/Oracle,
 * AWS SageMaker, Go/Kubernetes) appear in none of the verified capability or
 * product records, which consistently list Frappe, Python, React, Node, PHP and
 * MariaDB.
 *
 * Republishing "$1.4M saved" for an unnamed client under a new corporate brand
 * would present an unverifiable metric as corporate fact.
 *
 * This array is NOT rendered. It exists so the omission is documented and
 * reversible: supply evidence, and the record moves into `caseStudies` unchanged.
 */
export const withheldCaseStudies = [
  {
    slug: 'enterprise-erp-manufacturing',
    title: 'Unifying Operations for Large-Scale Manufacturing',
    client: 'Leading Manufacturing Firm',
    claims: ['40% reduction in procurement discrepancies', '3 weeks saved annually'],
    reason: 'Anonymous client; unattributed percentage claims; stack inconsistent with verified records.',
  },
  {
    slug: 'ai-inventory-optimization',
    title: 'Predictive AI for Inventory Optimization',
    client: 'Global Retail Chain',
    claims: ['22% increase in local stock availability', '$1.4M saved in holding costs'],
    reason: 'Anonymous client; precise financial claim with no attributable source.',
  },
  {
    slug: 'fintech-mobile-banking',
    title: 'Next-Generation Mobile Banking Experience',
    client: 'Regional Bank',
    claims: ['App Store rating 4.8, up from 3.1', '60% reduction in support tickets'],
    reason: 'Anonymous client; unverifiable third-party store metrics.',
  },
] as const

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}
