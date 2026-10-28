import type { Capability, NamedOffering } from '@/types/content'

const SRC = 'https://skydotinfotech.com/assets/index-Dj6vDmZa.js (solutions data array)'

/**
 * The ten capability records published on the source site, each flagged
 * `verified: true` there. Titles, categories, short descriptions, long
 * descriptions, features, industries and technologies are migrated VERBATIM.
 *
 * `problem` and `useCases` are written for this site. They restate the
 * capability's existing scope in problem-first language — they introduce no new
 * technology, no new claim of expertise and no metric.
 */
export const capabilities: Capability[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    category: 'Digital Engineering',
    shortDescription: 'Custom website design and highly performant web applications.',
    description:
      'We engineer high-performance, scalable web applications and corporate websites tailored to your unique business requirements. Our architecture ensures long-term reliability and growth.',
    problem:
      'A website that was built as a brochure cannot carry a business process. Teams end up working around it with spreadsheets, and the cost of every change grows.',
    features: [
      'Custom Website Design',
      'Responsive Interfaces',
      'Progressive Web Apps',
      'Enterprise Portals',
    ],
    industries: ['Retail', 'Education', 'Real Estate', 'Enterprise'],
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    useCases: [
      'Replacing a static corporate site with a portal staff and customers actually transact in',
      'Giving an existing back-office system a usable web interface',
      'Consolidating several ageing microsites into one maintainable platform',
    ],
    relatedProducts: ['cms'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'software-development',
    title: 'Software Development',
    category: 'Digital Engineering',
    shortDescription: 'Creating custom software for real-world enterprise needs.',
    description:
      'End-to-end custom software development services that solve complex operational challenges. We build secure, scalable solutions that align perfectly with your business goals.',
    problem:
      'Off-the-shelf software forces the organisation to change how it works. Where the process is the competitive advantage, that trade is the wrong way round.',
    features: [
      'Enterprise Software',
      'Legacy Modernization',
      'API Development',
      'System Integration',
    ],
    industries: ['Manufacturing', 'Government', 'Finance'],
    technologies: ['Python', 'Java', 'Node.js', 'PostgreSQL'],
    useCases: [
      'Modernising a legacy system that only one or two people still understand',
      'Building the integration layer between systems that were never designed to talk',
      'Digitising a regulated process that has to produce an audit trail',
    ],
    relatedProducts: ['frappe-apps'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'mobile-development',
    title: 'Mobile Application Development',
    category: 'Digital Engineering',
    shortDescription: 'Turning ideas into powerful mobile experiences for iOS and Android.',
    description:
      'Engage your users anywhere with premium mobile experiences. We design robust, intuitive cross-platform and native mobile applications that drive engagement.',
    problem:
      'Field staff, drivers and customers are not at a desk. A process that only exists on a desktop screen stops at the office door.',
    features: ['iOS Apps', 'Android Apps', 'Cross-Platform', 'Mobile Backends'],
    industries: ['E-Commerce', 'Healthcare', 'Logistics'],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    useCases: [
      'Giving field teams offline-capable data capture',
      'Putting a customer-facing service in the app stores without two codebases',
      'Adding a mobile front end to an existing ERP or portal',
    ],
    relatedProducts: ['pos'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'custom-application',
    title: 'Custom Application Development',
    category: 'Digital Engineering',
    shortDescription: 'Bespoke applications designed for specialized workflows.',
    description:
      'We build custom Frappe applications and proprietary web apps from the ground up, designed to perfectly map onto your highly specific business logic.',
    problem:
      'Some workflows are too specific for a product and too important for a spreadsheet. They need an application shaped around them.',
    features: ['Custom Frappe Apps', 'Microservices', 'Scalable Architectures'],
    industries: ['Enterprise', 'Education', 'Healthcare'],
    technologies: ['Frappe', 'Python', 'React', 'MariaDB'],
    useCases: [
      'Modelling a specialised approval or inspection workflow as a first-class application',
      'Extending an ERP with a module the standard product does not cover',
      'Replacing a critical spreadsheet that has outgrown its author',
    ],
    relatedProducts: ['frappe-apps'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'erp-solutions',
    title: 'ERP Solutions',
    category: 'Business Systems',
    shortDescription: 'Integrating business processes into one smart ERP system.',
    description:
      'Unify your business operations with comprehensive ERP solutions. We connect finance, inventory, HR, and sales into a single source of truth.',
    problem:
      'When finance, stores and production each keep their own numbers, every month-end becomes a reconciliation exercise instead of a decision.',
    features: ['Financial Management', 'Inventory Control', 'Supply Chain', 'CRM'],
    industries: ['Manufacturing', 'Distribution', 'Retail'],
    technologies: ['ERPNext', 'Frappe', 'Python', 'SQL'],
    useCases: [
      'Consolidating disconnected finance, inventory and sales records',
      'Bringing multi-branch or multi-warehouse operations onto one ledger',
      'Replacing an ERP the business has outgrown or can no longer license',
    ],
    relatedProducts: ['sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'erpnext-implementation',
    title: 'ERPNext Implementation',
    category: 'Business Systems',
    shortDescription: 'End-to-end implementation of the ERPNext framework.',
    description:
      'From discovery to deployment, we provide full-lifecycle ERPNext implementation. We map your processes, configure modules, migrate data, and train your team.',
    problem:
      'ERP projects rarely fail on software. They fail on unmapped processes, unmigrated data and teams who were never trained.',
    features: [
      'Requirement Analysis',
      'Data Migration',
      'System Configuration',
      'Training & Support',
    ],
    industries: ['Manufacturing', 'Retail', 'Services'],
    technologies: ['ERPNext', 'Frappe'],
    useCases: [
      'A first ERP rollout where the processes have never been formally documented',
      'Migrating years of transactional history out of legacy software',
      'Rescuing a stalled implementation and getting it to go-live',
    ],
    relatedProducts: ['sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'frappe-development',
    title: 'Frappe Development',
    category: 'Business Systems',
    shortDescription: 'Tailored customizations on the open-source Frappe framework.',
    description:
      'Leverage the power of the Frappe framework. We build custom doctypes, automate workflows, and develop tailored modules that fit your operational realities perfectly.',
    problem:
      'A standard ERP covers eighty per cent of the work. The remaining twenty per cent is usually where the business is actually different.',
    features: ['Custom Modules', 'API Integration', 'Workflow Automation'],
    industries: ['Enterprise', 'Education', 'Logistics'],
    technologies: ['Frappe', 'Python', 'MariaDB'],
    useCases: [
      'Adding industry-specific doctypes and workflows to an ERPNext deployment',
      'Integrating an ERP with machinery, payment or government systems',
      'Automating an approval chain that currently runs on email',
    ],
    relatedProducts: ['frappe-apps', 'sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    category: 'Business Systems',
    shortDescription:
      'Automating repetitive workflows and integrating intelligent systems.',
    description:
      'Transform manual processes into automated workflows. We connect disparate systems and integrate AI-driven insights to save time and reduce errors.',
    problem:
      'Skilled people spend their week copying data between systems. The cost is not only the hours — it is the errors nobody catches.',
    features: ['Process Automation', 'System Integration', 'AI Copilots'],
    industries: ['Finance', 'Healthcare', 'Corporate'],
    technologies: ['Frappe', 'Python', 'OpenAI'],
    useCases: [
      'Removing manual re-entry between two systems of record',
      'Automating document-heavy compliance and reporting cycles',
      'Adding assisted data extraction to a high-volume intake process',
    ],
    relatedProducts: ['frappe-apps'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'hr-management',
    title: 'HR Management',
    category: 'Business Systems',
    shortDescription: 'Managing people, policies, and performance.',
    description:
      'Streamline your human resources with comprehensive HRMS solutions. Handle payroll, attendance, leave management, and employee self-service efficiently.',
    problem:
      'Payroll, attendance and leave live in three different places, and every exception lands on one person’s desk.',
    features: [
      'Payroll Processing',
      'Attendance Tracking',
      'Appraisals',
      'Employee Portal',
    ],
    industries: ['Corporate', 'Manufacturing', 'IT Sector'],
    technologies: ['Frappe HR', 'ERPNext'],
    useCases: [
      'Bringing payroll, attendance and leave onto one system',
      'Giving employees self-service access to their own records',
      'Running appraisal cycles without a spreadsheet per department',
    ],
    relatedProducts: ['sky-erp'],
    provenance: { tag: 'verified', origin: SRC },
  },
  {
    slug: 'domain-registration',
    title: 'Domain & Digital Infrastructure',
    category: 'Digital Infrastructure',
    shortDescription: 'Secure domain procurement and lifecycle management.',
    description:
      'Complete lifecycle management including domain procurement, DNS configuration, and automated renewals to protect your brand identity.',
    problem:
      'Domains, DNS, certificates and business email are usually spread across whoever set them up. The risk only becomes visible when something expires.',
    features: ['Domain Procurement', 'DNS Management', 'Automated Renewals'],
    industries: ['SMEs', 'Enterprise', 'Startups'],
    technologies: ['DNS', 'Registrar APIs'],
    useCases: [
      'Consolidating domains and DNS under one managed account',
      'Setting up business email and certificates for a new entity or brand',
      'Taking over infrastructure that was configured by a former supplier',
    ],
    relatedProducts: [],
    provenance: { tag: 'verified', origin: SRC },
  },
]

/**
 * Offerings the company lists in its own navigation and footer but has published
 * no detail content for. They are named here honestly instead of being inflated
 * into full service pages with invented copy. See docs/CONTENT_INVENTORY.md §6.1.
 */
export const namedOfferings: NamedOffering[] = [
  {
    id: 'hosting',
    label: 'Web hosting',
    description: 'Managed hosting for the applications we build and maintain.',
    capabilitySlug: 'domain-registration',
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Listed as a navigation offering only; no detail copy exists in the source.',
    },
  },
  {
    id: 'ssl',
    label: 'SSL certificates',
    description: 'Certificate provisioning and renewal as part of infrastructure management.',
    capabilitySlug: 'domain-registration',
    provenance: { tag: 'verified', origin: SRC, note: 'Navigation offering only.' },
  },
  {
    id: 'business-email',
    label: 'Business email',
    description: 'Domain-based business email setup and administration.',
    capabilitySlug: 'domain-registration',
    provenance: { tag: 'verified', origin: SRC, note: 'Navigation offering only.' },
  },
  {
    id: 'seo',
    label: 'Search engine optimisation',
    description: 'Technical and on-page SEO for the sites and portals we deliver.',
    capabilitySlug: 'web-development',
    provenance: { tag: 'verified', origin: SRC, note: 'Navigation offering only.' },
  },
  {
    id: 'digital-marketing',
    label: 'Digital marketing',
    description: 'Campaign and channel support alongside the platforms we build.',
    capabilitySlug: 'web-development',
    provenance: { tag: 'verified', origin: SRC, note: 'Navigation offering only.' },
  },
  {
    id: 'bulk-sms',
    label: 'Bulk SMS & messaging',
    description: 'Transactional and bulk messaging integration for business systems.',
    capabilitySlug: 'business-automation',
    provenance: { tag: 'verified', origin: SRC, note: 'Navigation offering only.' },
  },
]

export const capabilityCategories = [
  'Digital Engineering',
  'Business Systems',
  'Digital Infrastructure',
] as const

export function getCapability(slug: string): Capability | undefined {
  return capabilities.find((c) => c.slug === slug)
}

export function capabilitiesByCategory(category: string): Capability[] {
  return capabilities.filter((c) => c.category === category)
}

export function offeringsForCapability(slug: string): NamedOffering[] {
  return namedOfferings.filter((o) => o.capabilitySlug === slug)
}
