import { capabilities, capabilityCategories } from './capabilities'
import { industries } from './industries'
import { products } from './products'

export interface NavLink {
  label: string
  to: string
  description?: string
}

export interface NavGroup {
  title: string
  links: NavLink[]
}

export interface NavItem {
  label: string
  to: string
  /**
   * Present only where a menu genuinely helps discovery: 10 capabilities, 7
   * products and 12 industries are not discoverable from a single link. `Work`
   * and `Insights` are plain links because a two-item menu helps nobody.
   */
  groups?: NavGroup[]
  /** Shown at the foot of the mega menu as the "see everything" route. */
  overviewLabel?: string
}

export const primaryNav: NavItem[] = [
  {
    label: 'About',
    to: '/about',
    overviewLabel: 'About NivaSync',
    groups: [
      {
        title: 'The company',
        links: [
          {
            label: 'About NivaSync',
            to: '/about',
            description: 'How the organisation is built and how we work.',
          },
          {
            label: 'Brand ecosystem',
            to: '/brands',
            description: 'NivaSync, Skydot Infotech and our product brands.',
          },
          {
            label: 'Careers',
            to: '/careers',
            description: 'Working on systems institutions depend on.',
          },
        ],
      },
    ],
  },
  {
    label: 'Capabilities',
    to: '/capabilities',
    overviewLabel: 'All capabilities',
    groups: capabilityCategories.map((category) => ({
      title: category,
      links: capabilities
        .filter((c) => c.category === category)
        .map((c) => ({
          label: c.title,
          to: `/capabilities/${c.slug}`,
          description: c.shortDescription,
        })),
    })),
  },
  {
    label: 'Products',
    to: '/products',
    overviewLabel: 'All products',
    groups: [
      {
        title: 'Platforms',
        links: products.map((p) => ({
          label: p.title,
          to: `/products/${p.slug}`,
          description: p.category,
        })),
      },
    ],
  },
  {
    label: 'Industries',
    to: '/industries',
    overviewLabel: 'All industries',
    groups: [
      {
        title: 'Public sector & institutions',
        links: industries
          .filter((i) => ['railways', 'government', 'education', 'healthcare'].includes(i.slug))
          .map((i) => ({ label: i.name, to: `/industries/${i.slug}` })),
      },
      {
        title: 'Industry & trade',
        links: industries
          .filter((i) =>
            ['manufacturing', 'distribution', 'textile', 'fmcg', 'logistics'].includes(i.slug),
          )
          .map((i) => ({ label: i.name, to: `/industries/${i.slug}` })),
      },
      {
        title: 'Commerce & finance',
        links: industries
          .filter((i) => ['retail', 'finance', 'real-estate'].includes(i.slug))
          .map((i) => ({ label: i.name, to: `/industries/${i.slug}` })),
      },
    ],
  },
  { label: 'Work', to: '/work' },
  { label: 'Insights', to: '/insights' },
]

/** The single primary conversion route, kept out of the nav list. */
export const navCta: NavLink = { label: 'Start a conversation', to: '/contact' }

/**
 * Footer columns. Every entry is a route that exists or a verified external URL —
 * there are no placeholder links and no dead ends.
 */
export const footerNav: NavGroup[] = [
  {
    title: 'Company',
    links: [
      { label: 'About NivaSync', to: '/about' },
      { label: 'Brand ecosystem', to: '/brands' },
      { label: 'Selected work', to: '/work' },
      { label: 'Insights', to: '/insights' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Capabilities',
    links: capabilities.slice(0, 6).map((c) => ({
      label: c.title,
      to: `/capabilities/${c.slug}`,
    })),
  },
  {
    title: 'Products',
    links: products.map((p) => ({ label: p.title, to: `/products/${p.slug}` })),
  },
  {
    title: 'Industries',
    links: industries.slice(0, 6).map((i) => ({
      label: i.name,
      to: `/industries/${i.slug}`,
    })),
  },
]

export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
]
