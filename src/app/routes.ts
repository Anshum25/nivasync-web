/**
 * Centralised route configuration.
 *
 * This is the single source of truth for the site's URL space. It drives:
 *   - the router (src/app/App.tsx),
 *   - sitemap.xml generation (scripts/generate-seo.mjs),
 *   - the internal-link checker (scripts/check-links.mjs),
 *   - the route-coverage test (tests/routes.test.tsx).
 *
 * Adding a page means adding one entry here, so those four things cannot drift
 * apart.
 */

export interface RouteDefinition {
  /** Router path, possibly parameterised. */
  path: string
  /** Static paths this route resolves to, for the sitemap and link checking. */
  staticPaths: string[]
  /** Sitemap priority. Omit to exclude from the sitemap. */
  priority?: number
  changefreq?: 'weekly' | 'monthly' | 'yearly'
}

/**
 * Data is imported lazily by the generator scripts, so this module must stay
 * free of browser-only imports. The slug lists below are generated from the
 * content modules at build time by `scripts/generate-seo.mjs` rather than being
 * duplicated here by hand.
 */
export const routeDefinitions: RouteDefinition[] = [
  { path: '/', staticPaths: ['/'], priority: 1.0, changefreq: 'monthly' },
  { path: '/about', staticPaths: ['/about'], priority: 0.9, changefreq: 'monthly' },
  { path: '/capabilities', staticPaths: ['/capabilities'], priority: 0.9, changefreq: 'monthly' },
  { path: '/capabilities/:slug', staticPaths: [], priority: 0.8, changefreq: 'monthly' },
  { path: '/products', staticPaths: ['/products'], priority: 0.9, changefreq: 'monthly' },
  { path: '/products/:slug', staticPaths: [], priority: 0.8, changefreq: 'monthly' },
  { path: '/industries', staticPaths: ['/industries'], priority: 0.8, changefreq: 'monthly' },
  { path: '/industries/:slug', staticPaths: [], priority: 0.7, changefreq: 'monthly' },
  { path: '/brands', staticPaths: ['/brands'], priority: 0.8, changefreq: 'monthly' },
  { path: '/work', staticPaths: ['/work'], priority: 0.8, changefreq: 'monthly' },
  { path: '/work/:slug', staticPaths: [], priority: 0.7, changefreq: 'yearly' },
  { path: '/insights', staticPaths: ['/insights'], priority: 0.7, changefreq: 'weekly' },
  { path: '/insights/:slug', staticPaths: [], priority: 0.6, changefreq: 'yearly' },
  { path: '/careers', staticPaths: ['/careers'], priority: 0.7, changefreq: 'weekly' },
  { path: '/contact', staticPaths: ['/contact'], priority: 0.9, changefreq: 'monthly' },
  { path: '/privacy', staticPaths: ['/privacy'], priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', staticPaths: ['/terms'], priority: 0.3, changefreq: 'yearly' },
]

/**
 * `/services` is the conventional URL a visitor or an old inbound link will try.
 * This site calls the section "Capabilities" (see docs/BRAND_ARCHITECTURE.md §3),
 * so the conventional path redirects rather than 404s.
 */
export const redirects: { from: string; to: string }[] = [
  { from: '/services', to: '/capabilities' },
  { from: '/solutions', to: '/capabilities' },
]
