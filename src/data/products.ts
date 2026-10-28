import type { Product } from '@/types/content'

const SRC = 'https://skydotinfotech.com/assets/index-Dj6vDmZa.js (products data array)'

/**
 * The seven products published on the source site, all flagged `verified: true`
 * there. Titles, categories, descriptions, features, industries, technologies and
 * external URLs are migrated VERBATIM.
 *
 * `screenshots` is empty on every record because the source site ships none. The
 * product pages render a designed, clearly labelled placeholder instead of
 * referencing files that do not exist.
 *
 * `availability` is modelled separately from the description so that no prose
 * implies a product is actively sold, cloud-hosted or maintained unless that is
 * evidenced. Only products with a live public product domain are marked
 * `confirmed-active`.
 */
export const products: Product[] = [
  {
    slug: 'sky-erp',
    title: 'SKYDOTERP',
    category: 'Enterprise',
    description:
      'An integrated enterprise platform powered by ERPNext for managing operations across finance, HR, manufacturing, and more.',
    features: [
      'Accounting & Finance',
      'HR & Payroll',
      'Manufacturing',
      'Inventory Management',
      'CRM',
    ],
    industries: [
      'Manufacturing',
      'Retail & E-commerce',
      'Healthcare',
      'Education',
      'Distribution',
    ],
    technologies: ['Frappe', 'Python', 'MariaDB', 'Redis'],
    screenshots: [],
    externalUrl: 'https://skyerpnext.in',
    availability: 'confirmed-active',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Has a dedicated public product domain (skyerpnext.in).',
    },
  },
  {
    slug: 'frappe-apps',
    title: 'Frappe Custom Apps',
    category: 'Enterprise',
    description:
      'Custom-built applications on the Frappe framework, tailored precisely to your unique business workflows.',
    features: [
      'Rapid Development',
      'Seamless ERP Integration',
      'Open Source',
      'Custom Workflows',
    ],
    industries: ['Enterprise', 'Logistics', 'IT Sector', 'Agriculture'],
    technologies: ['Frappe', 'Python', 'MariaDB'],
    screenshots: [],
    availability: 'confirmed-active',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Delivered as engagements rather than sold as a licensed product.',
    },
  },
  {
    slug: 'itms',
    title: 'ITMS — Institute Training Management System',
    category: 'Training Management',
    description:
      'An integrated digital platform designed to manage and streamline the complete training lifecycle of an institute.',
    features: ['Training Planning', 'Course Management', 'Assessments & Reports'],
    industries: ['Education', 'Corporate Training'],
    technologies: ['Node.js', 'PostgreSQL', 'React'],
    screenshots: [],
    availability: 'confirmed-active',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note:
        'Corroborated by the 30-site institutional deployment record and the ' +
        'Indian Railways case study.',
    },
  },
  {
    slug: 'lms-moodle',
    title: 'LMS — Moodle',
    category: 'Education',
    description:
      'A comprehensive Learning Management System powered by customized Moodle deployment for scalable and highly interactive e-learning platforms.',
    features: [
      'Online classes',
      'Assignment tracking',
      'Custom themes',
      'Plugin integration',
    ],
    industries: ['Education', 'Corporate Training', 'Institutions'],
    technologies: ['PHP', 'MariaDB', 'Linux', 'React'],
    screenshots: [],
    externalUrl: 'https://skylms.in',
    availability: 'confirmed-active',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Has a dedicated public product domain (skylms.in).',
    },
  },
  {
    slug: 'cms',
    title: 'Course Management System (CMS)',
    category: 'Education Technology',
    description:
      'One system for every course, batch and trainee. Plan batches, track attendance, manage faculty and publish results from one dashboard.',
    features: ['Batches', 'Trainees', 'Attendance', 'Faculty', 'Results'],
    industries: ['Education', 'Corporate Training'],
    technologies: ['Next.js', 'PostgreSQL', 'Prisma'],
    screenshots: [],
    availability: 'unconfirmed',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Product record verified; current commercial availability not evidenced.',
    },
  },
  {
    slug: 'pos',
    title: 'POS (Point of Sale)',
    category: 'Retail',
    description:
      'Advanced Point of Sale system integrating inventory, billing, and customer management.',
    features: ['Inventory tracking', 'Billing & Invoicing', 'Sales analytics'],
    industries: ['Retail', 'Hospitality'],
    technologies: ['React Native', 'Node.js', 'MySQL'],
    screenshots: [],
    availability: 'unconfirmed',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Product record verified; current commercial availability not evidenced.',
    },
  },
  {
    slug: 'mcx-apis',
    title: 'MCX APIs',
    category: 'Finance',
    description:
      'High-performance APIs for integrating MCX commodity trading and market data.',
    features: ['Real-time data', 'Low latency', 'Secure endpoints'],
    industries: ['Finance', 'Trading'],
    technologies: ['Python', 'FastAPI', 'Redis'],
    screenshots: [],
    availability: 'unconfirmed',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Product record verified; current commercial availability not evidenced.',
    },
  },
]

/**
 * ⚠ Products named in the project brief that do NOT exist on the current site.
 *
 * Neither appears anywhere in the live site or its bundle, and the legacy routes
 * that referenced them (/products/accounting-software/, /products/real-estate-portal/)
 * are gone from the sitemap. They are NOT published, because doing so would claim
 * a product is current with no evidence.
 *
 * Kept here so the gap is visible to whoever reviews this build. Supply details
 * and these become ordinary records in the array above.
 */
export const unpublishedProductCandidates = [
  {
    name: 'eCount accounting and business software',
    finding: 'Not found anywhere on the current site or in its bundle.',
    legacyRoute: '/products/accounting-software/',
  },
  {
    name: 'Real Estate Portal',
    finding: 'Not found as a product. "real-estate" exists only as an industry.',
    legacyRoute: '/products/real-estate-portal/',
  },
] as const

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function productsBySlugs(slugs: string[]): Product[] {
  return slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p))
}
