/**
 * Generates dist/sitemap.xml and dist/robots.txt after a production build.
 *
 * The route list and the content slugs are read from the same source files the
 * application uses, so the sitemap cannot drift from the router. If a data file
 * stops yielding slugs the script FAILS the build rather than silently emitting
 * a sitemap missing half the site.
 *
 * Run automatically by `npm run build` (postbuild).
 */

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `vite build` first.')
  process.exit(1)
}

function read(relative) {
  return readFileSync(resolve(ROOT, relative), 'utf8')
}

/** Pulls `slug: 'value'` out of a data module. Throws if it finds none. */
function slugsFrom(relativePath, { exclude = [] } = {}) {
  const source = read(relativePath)
  const found = [...source.matchAll(/^\s*slug:\s*'([a-z0-9-]+)'/gm)].map((m) => m[1])
  const unique = [...new Set(found)].filter((s) => !exclude.includes(s))
  if (unique.length === 0) {
    throw new Error(`No slugs extracted from ${relativePath} — sitemap would be incomplete.`)
  }
  return unique
}

/** The canonical origin, read from the single constant the app uses. */
function originFromSource() {
  const source = read('src/data/company.ts')
  const match = source.match(/export const SITE_ORIGIN = '([^']+)'/)
  if (!match) throw new Error('SITE_ORIGIN not found in src/data/company.ts')
  return match[1].replace(/\/$/, '')
}

const ORIGIN = originFromSource()

// `withheldCaseStudies` sits in the same file as the published ones, so its
// slugs are excluded explicitly — an unpublished case study must not appear in
// the sitemap.
const WITHHELD = [
  'enterprise-erp-manufacturing',
  'ai-inventory-optimization',
  'fintech-mobile-banking',
]

const capabilitySlugs = slugsFrom('src/data/capabilities.ts')
const productSlugs = slugsFrom('src/data/products.ts')
const industrySlugs = slugsFrom('src/data/industries.ts')
const workSlugs = slugsFrom('src/data/work.ts', { exclude: WITHHELD })
const articleSlugs = slugsFrom('src/data/insights.ts')

const entries = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/capabilities', priority: '0.9', changefreq: 'monthly' },
  { path: '/products', priority: '0.9', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/brands', priority: '0.8', changefreq: 'monthly' },
  { path: '/industries', priority: '0.8', changefreq: 'monthly' },
  { path: '/work', priority: '0.8', changefreq: 'monthly' },
  { path: '/insights', priority: '0.7', changefreq: 'weekly' },
  { path: '/careers', priority: '0.7', changefreq: 'weekly' },
  ...capabilitySlugs.map((s) => ({
    path: `/capabilities/${s}`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
  ...productSlugs.map((s) => ({ path: `/products/${s}`, priority: '0.8', changefreq: 'monthly' })),
  ...industrySlugs.map((s) => ({
    path: `/industries/${s}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
  ...workSlugs.map((s) => ({ path: `/work/${s}`, priority: '0.7', changefreq: 'yearly' })),
  ...articleSlugs.map((s) => ({ path: `/insights/${s}`, priority: '0.6', changefreq: 'yearly' })),
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
]

const lastmod = new Date().toISOString().slice(0, 10)

const urls = entries
  .map(
    (e) =>
      [
        '  <url>',
        `    <loc>${ORIGIN}${e.path === '/' ? '/' : e.path}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        '  </url>',
      ].join('\n'),
  )
  .join('\n')

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  '',
].join('\n')

writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap)

const robots = `# ${ORIGIN}
# NivaSync Infotech Pvt. Ltd.

User-agent: *
Allow: /

# Nothing here is private; the site has no admin, login or account area.
# The 404 page sets its own noindex at runtime.

Sitemap: ${ORIGIN}/sitemap.xml
`

writeFileSync(resolve(DIST, 'robots.txt'), robots)

console.log(`sitemap.xml written: ${entries.length} URLs at ${ORIGIN}`)
console.log('robots.txt written')

// ── Content-Security-Policy script hashes ────────────────────────────────────
/**
 * index.html carries one inline bootstrap script (theme resolution + font
 * stylesheet promotion), which must run before first paint and so cannot be
 * externalised. A strict `script-src 'self'` would block it.
 *
 * Rather than weaken the policy with 'unsafe-inline', the script's SHA-256 is
 * computed here from the built HTML and substituted into dist/.htaccess. That
 * way the hash can never go stale: edit the script, rebuild, and the policy
 * follows automatically.
 */
const htaccessPath = resolve(DIST, '.htaccess')

if (existsSync(htaccessPath)) {
  const html = readFileSync(resolve(DIST, 'index.html'), 'utf8')
  const inlineScripts = [
    ...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g),
  ].map((m) => m[1])

  const hashes = inlineScripts
    .map((body) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`)
    .join(' ')

  const htaccess = readFileSync(htaccessPath, 'utf8')

  if (!htaccess.includes('{{INLINE_SCRIPT_HASHES}}')) {
    console.error(
      'ERROR: public/.htaccess no longer contains the {{INLINE_SCRIPT_HASHES}} placeholder.\n' +
        'The Content-Security-Policy would block the inline bootstrap script in production.',
    )
    process.exit(1)
  }

  writeFileSync(htaccessPath, htaccess.replaceAll('{{INLINE_SCRIPT_HASHES}}', hashes))
  console.log(
    `.htaccess CSP updated with ${inlineScripts.length} inline script hash(es): ${hashes}`,
  )
} else {
  console.warn('WARNING: dist/.htaccess not found — CSP hashes were not injected.')
}
