/**
 * Narrative copy for the homepage and About page.
 *
 * Migrated elements are marked. Where the source copy spoke in Skydot's
 * customer-facing voice, it has been reframed into the parent company's voice —
 * the facts are unchanged, the altitude is different. See
 * docs/BRAND_ARCHITECTURE.md §3 for why the two brands must not read identically.
 */

/** Hero. Headline and subheadline migrated verbatim from the source homepage. */
export const hero = {
  eyebrow: 'NivaSync Infotech Pvt. Ltd.',
  headline: 'Technology built around your business.',
  subheadline:
    'AI, ERP, software and digital products engineered around the way your business works.',
  /** Parent-company framing added for this site. */
  support:
    'NivaSync is the engineering organisation behind Skydot Infotech. We build the ' +
    'systems that railway academies, research institutes, government bodies and ' +
    'manufacturers run on.',
  primaryCta: { label: 'Discuss a project', to: '/contact' },
  secondaryCta: { label: 'Explore capabilities', to: '/capabilities' },
} as const

/** Positioning line. Migrated verbatim. */
export const positioning = {
  headline: 'One technology partner.',
  subheadline: 'Multiple ways to move your business forward.',
} as const

/** Corporate introduction — written for the parent company. */
export const introduction = {
  label: 'The organisation',
  headline: 'An engineering company, not a reseller.',
  body: [
    'NivaSync Infotech Pvt. Ltd. designs, builds and operates enterprise software. ' +
      'We are technologists, but our focus is always on business outcomes — custom ' +
      'software, enterprise web applications and robust ERP systems.',
    'Over the years we have grown into a comprehensive engineering firm, partnering ' +
      'with enterprises, government bodies and educational institutions to modernise ' +
      'their digital infrastructure.',
  ],
  /** Migrated verbatim from the source homepage. */
  realWorldLine: 'Technology is only valuable when it works in the real world.',
} as const

/** Four capability pillars. Migrated verbatim, re-pointed at routes that exist. */
export const pillars = [
  {
    number: '01',
    title: 'AI & Intelligent Systems',
    description: 'Turn business data into useful intelligence.',
    to: '/capabilities/business-automation',
  },
  {
    number: '02',
    title: 'ERP & Business Automation',
    description: 'Connect operations, people and decisions in one system.',
    to: '/capabilities/erp-solutions',
  },
  {
    number: '03',
    title: 'Custom Software',
    description: 'Software designed around the way your organization actually works.',
    to: '/capabilities/software-development',
  },
  {
    number: '04',
    title: 'Digital Products',
    description: 'From concept to launch, build digital experiences people use.',
    to: '/capabilities/web-development',
  },
] as const

/** Five-step engagement model. Migrated verbatim. */
export const processSteps = [
  { number: '01', title: 'Understand', description: 'Map goals, constraints, and systems.' },
  { number: '02', title: 'Design', description: 'Shape architecture and experience.' },
  { number: '03', title: 'Build', description: 'Engineer with clarity and discipline.' },
  { number: '04', title: 'Launch', description: 'Deploy, validate, and support.' },
  { number: '05', title: 'Improve', description: 'Measure, refine, and evolve.' },
] as const

/** Final conversion section. */
export const closingCta = {
  label: 'Start here',
  headline: 'Tell us what needs to work better.',
  body:
    'Whether it is an ERP rollout, a system that has outgrown its spreadsheet, or a ' +
    'platform you need to keep running for the next decade — start with a conversation ' +
    'about the problem, not the technology.',
  primary: { label: 'Start a conversation', to: '/contact' },
  secondary: { label: 'See how we work', to: '/about' },
} as const

/** About page copy. Source sentences migrated; parent-company framing added. */
export const about = {
  eyebrow: 'About NivaSync',
  headline: 'Engineering the systems institutions depend on.',
  lede:
    'NivaSync Infotech Pvt. Ltd. is a mature technology partner focused on solving ' +
    'complex business challenges through rigorous software engineering and digital ' +
    'innovation.',
  story: {
    label: 'Our story',
    headline: 'Founded on a commitment to delivering reliable technology solutions.',
    body: [
      'Over the years, we have grown into a comprehensive engineering firm, partnering ' +
        'with enterprises, government bodies, and educational institutions to modernize ' +
        'their digital infrastructure.',
      'We are technologists, but our focus is always on business outcomes. We design, ' +
        'engineer, and deploy custom software, enterprise web applications, and robust ' +
        'ERP systems.',
    ],
  },
  /**
   * ⚠ The source site publishes no formal mission or vision statement. These are
   * the Team / Culture / Vision sentences it does publish, presented as operating
   * values rather than as an approved mission statement.
   */
  values: {
    label: 'How we work',
    headline: 'Three things we hold to.',
    note:
      'Drawn from our published position. A formal mission and vision statement is ' +
      'pending corporate approval and is not presented here as one.',
    items: [
      {
        title: 'A dedicated team',
        body:
          'We believe in the power of a dedicated team that brings innovative ' +
          'enterprise solutions to life.',
      },
      {
        title: 'A collaborative culture',
        body:
          'Our culture fosters creativity and collaboration, enabling us to deliver ' +
          'world-class digital solutions.',
      },
      {
        title: 'A shared vision',
        body:
          'We are driven by a shared vision to engineer the future of software, AI, ' +
          'and digital transformation.',
      },
    ],
  },
  /**
   * ⚠ No leadership section exists. The source site publishes no leadership
   * names, biographies or photographs, and none are invented. Third-party
   * directories list staff names; publishing them without consent would be wrong.
   */
  leadershipNote:
    'Leadership and team profiles are not published on this site. No verified ' +
    'biographies or permitted photographs were available at build time.',
} as const
