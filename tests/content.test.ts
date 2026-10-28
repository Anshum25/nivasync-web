import { describe, expect, it } from 'vitest'
import { capabilities, namedOfferings } from '@/data/capabilities'
import { products, unpublishedProductCandidates } from '@/data/products'
import { industries } from '@/data/industries'
import { caseStudies, withheldCaseStudies } from '@/data/work'
import { articles } from '@/data/insights'
import { brands } from '@/data/brands'
import { openings } from '@/data/careers'
import { clientReferences, deploymentSites } from '@/data/deployments'
import {
  SITE_ORIGIN,
  companyStats,
  contactChannels,
  offices,
  socialProfiles,
} from '@/data/company'

/**
 * Content model integrity.
 *
 * These assertions encode the project's content rules so that a future edit
 * cannot quietly break them: every cross-reference must resolve, every slug must
 * be unique, and nothing marked unverifiable may become published.
 */

describe('slug integrity', () => {
  it.each([
    ['capabilities', capabilities.map((c) => c.slug)],
    ['products', products.map((p) => p.slug)],
    ['industries', industries.map((i) => i.slug)],
    ['case studies', caseStudies.map((c) => c.slug)],
    ['articles', articles.map((a) => a.slug)],
  ])('has unique, url-safe slugs in %s', (_name, slugs) => {
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/)
  })
})

describe('cross-references resolve', () => {
  const capabilitySlugs = new Set(capabilities.map((c) => c.slug))
  const productSlugs = new Set(products.map((p) => p.slug))
  const articleSlugs = new Set(articles.map((a) => a.slug))

  it('industry → capability references all exist', () => {
    for (const industry of industries) {
      for (const slug of industry.capabilitySlugs) {
        expect(capabilitySlugs, `${industry.slug} → ${slug}`).toContain(slug)
      }
    }
  })

  it('industry → product references all exist', () => {
    for (const industry of industries) {
      for (const slug of industry.productSlugs) {
        expect(productSlugs, `${industry.slug} → ${slug}`).toContain(slug)
      }
    }
  })

  it('capability → product references all exist', () => {
    for (const capability of capabilities) {
      for (const slug of capability.relatedProducts) {
        expect(productSlugs, `${capability.slug} → ${slug}`).toContain(slug)
      }
    }
  })

  it('named offerings attach to a real capability', () => {
    for (const offering of namedOfferings) {
      expect(capabilitySlugs).toContain(offering.capabilitySlug)
    }
  })

  it('article → related article references all exist', () => {
    for (const article of articles) {
      for (const slug of article.relatedSlugs) {
        expect(articleSlugs).toContain(slug)
      }
    }
  })

  it('brand internal paths point at real product pages', () => {
    for (const brand of brands) {
      if (!brand.internalPath) continue
      const slug = brand.internalPath.replace('/products/', '')
      expect(productSlugs, `${brand.id} → ${brand.internalPath}`).toContain(slug)
    }
  })
})

describe('provenance rules', () => {
  it('ships no pending-approval content', () => {
    const everything = [
      ...capabilities,
      ...products,
      ...industries,
      ...caseStudies,
      ...articles,
      ...brands,
      ...namedOfferings,
    ]
    for (const record of everything) {
      expect(record.provenance.tag).not.toBe('pending-approval')
    }
  })

  it('records an origin for every piece of migrated content', () => {
    const everything = [...capabilities, ...products, ...industries, ...caseStudies, ...articles]
    for (const record of everything) {
      expect(record.provenance.origin.length).toBeGreaterThan(10)
    }
  })

  it('tags the four self-reported statistics as company-stated', () => {
    expect(companyStats).toHaveLength(4)
    for (const stat of companyStats) {
      expect(stat.provenance.tag).toBe('company-stated')
    }
  })
})

describe('withheld and unpublished content', () => {
  it('publishes only the corroborated case study', () => {
    expect(caseStudies).toHaveLength(1)
    expect(caseStudies[0].slug).toBe('national-railway-infrastructure')
    expect(caseStudies[0].client).toBe('Indian Railways')
  })

  it('keeps the three unverifiable case studies out of the published set', () => {
    expect(withheldCaseStudies).toHaveLength(3)
    const publishedSlugs = caseStudies.map((c) => c.slug)
    for (const withheld of withheldCaseStudies) {
      expect(publishedSlugs).not.toContain(withheld.slug)
    }
  })

  it('publishes no case study with an anonymous client', () => {
    for (const study of caseStudies) {
      expect(study.client).not.toMatch(/leading|global|regional|major|a well-known/i)
    }
  })

  it('does not publish the two unevidenced product candidates', () => {
    expect(unpublishedProductCandidates).toHaveLength(2)
    const titles = products.map((p) => p.title.toLowerCase())
    expect(titles.some((t) => t.includes('ecount'))).toBe(false)
    expect(titles.some((t) => t.includes('real estate portal'))).toBe(false)
  })

  it('lists no invented vacancies', () => {
    expect(openings).toHaveLength(0)
  })
})

describe('verified facts', () => {
  it('carries all 30 named deployment sites with coordinates', () => {
    expect(deploymentSites).toHaveLength(30)
    for (const site of deploymentSites) {
      expect(site.name.length).toBeGreaterThan(5)
      expect(site.lat).toBeGreaterThan(5)
      expect(site.lat).toBeLessThan(37)
      expect(site.lng).toBeGreaterThan(67)
      expect(site.lng).toBeLessThan(98)
    }
  })

  it('carries the 25-name client roster', () => {
    expect(clientReferences).toHaveLength(25)
    expect(new Set(clientReferences.map((c) => c.name)).size).toBe(25)
  })

  it('has the expected published content counts', () => {
    expect(capabilities).toHaveLength(10)
    expect(products).toHaveLength(7)
    expect(industries).toHaveLength(12)
    expect(articles).toHaveLength(2)
    expect(brands).toHaveLength(3)
  })
})

describe('company data', () => {
  it('publishes exactly one verified office', () => {
    expect(offices).toHaveLength(1)
    expect(offices[0].city).toBe('Ahmedabad')
    expect(offices[0].isHeadquarters).toBe(true)
    // The conflict with the live Skydot address is recorded, not hidden.
    expect(offices[0].provenance.note).toMatch(/CONFLICTS/)
  })

  it('uses a NivaSync origin, never the Skydot domain', () => {
    expect(SITE_ORIGIN).toContain('nivasync')
    expect(SITE_ORIGIN).not.toContain('skydot')
    expect(SITE_ORIGIN).toMatch(/^https:\/\//)
  })

  it('builds working tel: and mailto: targets', () => {
    for (const channel of contactChannels) {
      if (channel.kind === 'phone') {
        expect(channel.href).toMatch(/^tel:\+\d{10,}$/)
      } else {
        expect(channel.href).toMatch(/^mailto:[^@]+@[^@]+\.[a-z]+$/)
      }
    }
  })

  it('attributes every social profile to the Skydot brand', () => {
    expect(socialProfiles).toHaveLength(3)
    for (const profile of socialProfiles) {
      expect(profile.brand).toBe('skydot')
      expect(profile.url).toMatch(/^https:\/\//)
    }
  })
})

describe('brand architecture language', () => {
  it('never describes a brand as a subsidiary or division', () => {
    const forbidden = /subsidiar|division|wholly[- ]owned|holding company|group company/i
    for (const brand of brands) {
      expect(brand.role).not.toMatch(forbidden)
      expect(brand.summary).not.toMatch(forbidden)
      expect(brand.tagline).not.toMatch(forbidden)
    }
  })

  it('models Skydot as an active technology brand with its own site', () => {
    const skydot = brands.find((b) => b.id === 'skydot')
    expect(skydot?.role).toBe('Technology brand')
    expect(skydot?.status).toBe('active')
    expect(skydot?.externalUrl).toBe('https://skydotinfotech.com/')
  })
})
