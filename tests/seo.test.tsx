import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderRoute } from './helpers'
import { SITE_ORIGIN } from '@/data/company'
import { capabilities } from '@/data/capabilities'
import { products } from '@/data/products'

function meta(selector: string) {
  return document.head.querySelector<HTMLMetaElement>(selector)?.content ?? null
}

function canonical() {
  return document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null
}

function jsonLd() {
  const script = document.getElementById('nivasync-jsonld')
  return script ? JSON.parse(script.textContent ?? '{}') : null
}

/**
 * Renders a route and waits for the metadata effect to have run.
 *
 * `useSeo` writes to <head> from an effect, so the h1 can be on screen a tick
 * before the title is set. Waiting on the title rather than only on the heading
 * removes a race that only showed up under parallel load.
 */
async function load(path: string) {
  renderRoute(path)
  await screen.findByRole('heading', { level: 1 })
  await waitFor(() => expect(document.title).not.toBe(''))
}

const SAMPLE = [
  '/',
  '/about',
  '/capabilities',
  '/capabilities/erp-solutions',
  '/products',
  '/products/itms',
  '/industries/railways',
  '/brands',
  '/work',
  '/insights',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
]

describe('per-page metadata', () => {
  it.each(SAMPLE)('sets a title, description and canonical on %s', async (path) => {
    await load(path)

    expect(document.title.length).toBeGreaterThan(10)
    expect(meta('meta[name="description"]')?.length ?? 0).toBeGreaterThan(50)
    expect(canonical()).toBe(`${SITE_ORIGIN}${path}`)
  })

  it('never uses the Skydot domain as the canonical origin', async () => {
    await load('/')
    expect(canonical()).not.toContain('skydotinfotech')
    expect(SITE_ORIGIN).not.toContain('skydotinfotech')
  })

  it('produces a unique title and description for every sampled route', async () => {
    const titles = new Set<string>()
    const descriptions = new Set<string>()

    for (const path of SAMPLE) {
      const { unmount } = renderRoute(path)
      await screen.findByRole('heading', { level: 1 })
      titles.add(document.title)
      descriptions.add(meta('meta[name="description"]') ?? '')
      unmount()
    }

    // The failure mode this guards against is one description copied across all
    // routes, which is the most common SEO regression on a templated site.
    expect(titles.size).toBe(SAMPLE.length)
    expect(descriptions.size).toBe(SAMPLE.length)
  })

  it('appends the site name to inner pages but not the homepage', async () => {
    const inner = renderRoute('/about')
    await screen.findByRole('heading', { level: 1 })
    expect(document.title).toMatch(/— NivaSync Infotech$/)
    inner.unmount()

    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })
    expect(document.title).not.toMatch(/— NivaSync Infotech$/)
  })
})

describe('robots directives', () => {
  it('marks real pages indexable', async () => {
    await load('/products/itms')
    expect(meta('meta[name="robots"]')).toContain('index')
    expect(meta('meta[name="robots"]')).not.toContain('noindex')
  })

  it('marks only the 404 page noindex', async () => {
    renderRoute('/no-such-page')
    await screen.findByText(/this page does not exist/i)
    expect(meta('meta[name="robots"]')).toContain('noindex')
  })
})

describe('social metadata', () => {
  it('sets Open Graph and Twitter tags', async () => {
    await load('/about')

    expect(meta('meta[property="og:title"]')).toBe(document.title)
    expect(meta('meta[property="og:url"]')).toBe(`${SITE_ORIGIN}/about`)
    expect(meta('meta[property="og:type"]')).toBe('website')
    expect(meta('meta[property="og:image"]')).toBe(`${SITE_ORIGIN}/og-default.png`)
    expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image')
  })

  it('marks articles as og:type article with a published time', async () => {
    await load('/insights/future-of-erp-in-manufacturing')
    expect(meta('meta[property="og:type"]')).toBe('article')
    expect(meta('meta[property="article:published_time"]')).toBe('2026-08-24')
  })
})

describe('structured data', () => {
  it('emits Organization and WebSite nodes on every page', async () => {
    await load('/')
    const graph = jsonLd()?.['@graph'] ?? []
    const types = graph.map((n: { '@type': string }) => n['@type'])
    expect(types).toContain('Organization')
    expect(types).toContain('WebSite')
  })

  it('states only verifiable facts in the Organization node', async () => {
    await load('/')
    const org = jsonLd()['@graph'].find((n: { '@type': string }) => n['@type'] === 'Organization')

    expect(org.name).toBe('NivaSync Infotech Pvt. Ltd.')
    expect(org.email).toBe('hello@nivasync.in')
    expect(org.address.addressLocality).toBe('Ahmedabad')
    expect(org.brand[0].name).toBe('Skydot Infotech')

    // Deliberately absent: no founding date, employee count, award or rating is
    // published, because none is evidenced.
    expect(org.foundingDate).toBeUndefined()
    expect(org.numberOfEmployees).toBeUndefined()
    expect(org.award).toBeUndefined()
    expect(org.aggregateRating).toBeUndefined()
  })

  it('emits breadcrumbs on detail pages', async () => {
    await load(`/capabilities/${capabilities[0].slug}`)
    const crumbs = jsonLd()['@graph'].find(
      (n: { '@type': string }) => n['@type'] === 'BreadcrumbList',
    )
    expect(crumbs.itemListElement).toHaveLength(3)
    expect(crumbs.itemListElement[0].name).toBe('Home')
    expect(crumbs.itemListElement[2].name).toBe(capabilities[0].title)
  })

  it('does not assert a price or purchase route for products', async () => {
    await load(`/products/${products[0].slug}`)
    const app = jsonLd()['@graph'].find(
      (n: { '@type': string }) => n['@type'] === 'SoftwareApplication',
    )
    expect(app).toBeTruthy()
    expect(app.offers).toBeUndefined()
  })
})
