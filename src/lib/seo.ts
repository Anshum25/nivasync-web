import { useEffect } from 'react'
import { SITE_ORIGIN, company, offices, contactChannels, socialProfiles } from '@/data/company'

export interface SeoMeta {
  /** Page-specific title. The site name is appended automatically. */
  title: string
  description: string
  /** Route path, e.g. `/capabilities/erp-solutions`. Canonical is built from it. */
  path: string
  /** Set true only for pages that genuinely must not be indexed. */
  noindex?: boolean
  /** Open Graph type. `website` for most pages, `article` for insights. */
  type?: 'website' | 'article'
  publishedTime?: string
  /** JSON-LD graph nodes for this page, beyond the site-wide Organization node. */
  jsonLd?: object[]
  /** Breadcrumb trail, excluding Home which is added automatically. */
  breadcrumbs?: { name: string; path: string }[]
}

const SITE_NAME = 'NivaSync Infotech'
const OG_IMAGE = `${SITE_ORIGIN}/og-default.png`

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const JSON_LD_ID = 'nivasync-jsonld'

function setJsonLd(nodes: object[]) {
  const existing = document.getElementById(JSON_LD_ID)
  if (existing) existing.remove()
  if (nodes.length === 0) return
  const script = document.createElement('script')
  script.id = JSON_LD_ID
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
  document.head.appendChild(script)
}

/**
 * Site-wide Organization node.
 *
 * Only factual, verified values go in here. There is no `foundingDate` (no
 * first-party source states one), no `numberOfEmployees`, no `award` and no
 * `aggregateRating` — structured data that asserts unverified facts is worse than
 * no structured data at all.
 */
function organizationNode(): object {
  const hq = offices[0]
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: company.legalName,
    alternateName: company.shortName,
    url: SITE_ORIGIN,
    description: company.description,
    logo: `${SITE_ORIGIN}/logo-nivasync.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hq.lines.join(', '),
      addressLocality: hq.city,
      addressRegion: hq.region,
      postalCode: hq.postalCode,
      addressCountry: hq.countryCode,
    },
    contactPoint: contactChannels
      .filter((c) => c.kind === 'phone')
      .map((c) => ({
        '@type': 'ContactPoint',
        telephone: c.value,
        contactType: c.label === 'Sales' ? 'sales' : 'customer support',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi', 'gu'],
      })),
    email: 'hello@nivasync.in',
    sameAs: socialProfiles.map((s) => s.url),
    /** The brand/parent relationship, stated in schema exactly as in the copy. */
    brand: [{ '@type': 'Brand', name: 'Skydot Infotech', url: 'https://skydotinfotech.com/' }],
  }
}

function websiteNode(): object {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: SITE_NAME,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    inLanguage: 'en-IN',
  }
}

function breadcrumbNode(trail: { name: string; path: string }[]): object {
  const items = [{ name: 'Home', path: '/' }, ...trail]
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

/**
 * Applies per-page metadata to <head>.
 *
 * Every page supplies its own title, description and canonical path, so no two
 * routes share metadata. `noindex` is opt-in per page and is never set globally,
 * which is the mistake that silently de-indexes a production site.
 */
export function useSeo(meta: SeoMeta) {
  const {
    title,
    description,
    path,
    noindex = false,
    type = 'website',
    publishedTime,
    jsonLd = [],
    breadcrumbs,
  } = meta

  /**
   * `jsonLd` and `breadcrumbs` arrive as fresh array literals on most renders,
   * so they are compared by serialised value. Without this the effect would
   * rewrite the whole <head> on every single render.
   */
  const jsonLdKey = JSON.stringify(jsonLd)
  const breadcrumbKey = JSON.stringify(breadcrumbs ?? null)

  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} — ${SITE_NAME}`
    const canonical = `${SITE_ORIGIN}${path === '/' ? '/' : path}`

    document.title = fullTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    })
    upsertLink('canonical', canonical)

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: OG_IMAGE })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' })

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: OG_IMAGE })

    if (publishedTime) {
      upsertMeta('meta[property="article:published_time"]', {
        property: 'article:published_time',
        content: publishedTime,
      })
    }

    const nodes: object[] = [organizationNode(), websiteNode()]
    if (breadcrumbs?.length) nodes.push(breadcrumbNode(breadcrumbs))
    nodes.push(...jsonLd)
    setJsonLd(nodes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, noindex, type, publishedTime, jsonLdKey, breadcrumbKey])
}

export { SITE_NAME, SITE_ORIGIN }
