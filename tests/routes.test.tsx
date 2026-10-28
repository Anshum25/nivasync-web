import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderRoute } from './helpers'
import { capabilities } from '@/data/capabilities'
import { products } from '@/data/products'
import { industries } from '@/data/industries'
import { caseStudies } from '@/data/work'
import { articles } from '@/data/insights'

/**
 * Route coverage.
 *
 * Every route in the application is mounted directly — the equivalent of a
 * visitor pasting the URL into the address bar or refreshing the page, which is
 * exactly where a client-routed site normally breaks.
 *
 * The list is derived from the content data, so adding a product or capability
 * automatically extends this test rather than leaving a page untested.
 */

const staticRoutes = [
  '/',
  '/about',
  '/capabilities',
  '/products',
  '/industries',
  '/brands',
  '/work',
  '/insights',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
]

const detailRoutes = [
  ...capabilities.map((c) => `/capabilities/${c.slug}`),
  ...products.map((p) => `/products/${p.slug}`),
  ...industries.map((i) => `/industries/${i.slug}`),
  ...caseStudies.map((c) => `/work/${c.slug}`),
  ...articles.map((a) => `/insights/${a.slug}`),
]

const allRoutes = [...staticRoutes, ...detailRoutes]

describe('route coverage', () => {
  it('covers every planned page', () => {
    // 12 static + 10 capabilities + 7 products + 12 industries + 1 case study
    // + 2 articles = 44 addressable pages.
    expect(allRoutes).toHaveLength(44)
  })

  it.each(allRoutes)('renders %s directly with a single h1', async (path) => {
    renderRoute(path)

    const heading = await screen.findByRole('heading', { level: 1 }, { timeout: 5000 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent?.trim().length).toBeGreaterThan(0)

    // Exactly one <h1> per page — the document outline depends on it.
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it.each(allRoutes)('renders the site chrome on %s', async (path) => {
    renderRoute(path)
    await screen.findByRole('heading', { level: 1 }, { timeout: 5000 })

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })
})

describe('unknown routes', () => {
  it('renders the 404 page for an unknown path', async () => {
    renderRoute('/this-page-does-not-exist')
    expect(await screen.findByText(/this page does not exist/i)).toBeInTheDocument()
    expect(screen.getByText('/this-page-does-not-exist')).toBeInTheDocument()
  })

  it('renders the 404 page for an unknown product slug', async () => {
    renderRoute('/products/not-a-real-product')
    expect(await screen.findByText(/this page does not exist/i)).toBeInTheDocument()
  })

  it('renders the 404 page for an unknown capability slug', async () => {
    renderRoute('/capabilities/not-a-real-capability')
    expect(await screen.findByText(/this page does not exist/i)).toBeInTheDocument()
  })

  it('does not publish the three withheld case studies', async () => {
    renderRoute('/work/ai-inventory-optimization')
    expect(await screen.findByText(/this page does not exist/i)).toBeInTheDocument()
  })
})

describe('redirects', () => {
  it.each([
    ['/services', 'Capabilities'],
    ['/solutions', 'Capabilities'],
  ])('redirects %s to the capabilities page', async (path) => {
    renderRoute(path)
    await waitFor(async () => {
      const heading = await screen.findByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent(/disciplines/i)
    })
  })
})
