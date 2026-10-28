import { Link, useParams } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink, FeatureList, Tag } from '@/components/ui/CardLink'
import { ArrowIcon } from '@/components/ui/Button'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import {
  capabilities,
  getCapability,
  offeringsForCapability,
} from '@/data/capabilities'
import { productsBySlugs } from '@/data/products'
import { industries } from '@/data/industries'
import { SITE_ORIGIN } from '@/data/company'
import type { Capability } from '@/types/content'
import NotFound from './NotFound'

/**
 * Capability detail template — one component serves all ten capability pages.
 *
 * Structure follows the brief: problem statement, capabilities, use cases,
 * engagement approach, related products/services, call to action, page metadata.
 */
export default function CapabilityDetail() {
  const { slug = '' } = useParams()
  const capability = getCapability(slug)

  // The early return lives here, BEFORE any other hook runs. Putting it
  // after useSeo would change hook order between a found and a missing
  // record, which React forbids.
  if (!capability) return <NotFound />

  return <CapabilityDetailView capability={capability} slug={slug} />
}

function CapabilityDetailView({ capability, slug }: { capability: Capability; slug: string }) {

  const relatedProducts = productsBySlugs(capability.relatedProducts)
  const relatedIndustries = industries.filter((i) => i.capabilitySlugs.includes(slug))
  const offerings = offeringsForCapability(slug)
  const siblings = capabilities
    .filter((c) => c.category === capability.category && c.slug !== slug)
    .slice(0, 3)

  const trail = [
    { name: 'Capabilities', path: '/capabilities' },
    { name: capability.title, path: `/capabilities/${slug}` },
  ]

  useSeo({
    title: capability.title,
    description: capability.shortDescription,
    path: `/capabilities/${slug}`,
    breadcrumbs: trail,
    jsonLd: [
      {
        '@type': 'Service',
        name: capability.title,
        description: capability.description,
        serviceType: capability.category,
        provider: { '@id': `${SITE_ORIGIN}/#organization` },
        areaServed: { '@type': 'Country', name: 'India' },
      },
    ],
  })

  return (
    <>
      <PageHero
        eyebrow={capability.category}
        title={capability.title}
        lede={capability.description}
        breadcrumbs={trail}
        aside={
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
            <p className="label label-plain mb-4">Technologies</p>
            <ul className="flex flex-wrap gap-2">
              {capability.technologies.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* Problem */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>The problem</Eyebrow>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
              {capability.problem}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* What this includes */}
      <Section tone="sunken" divided>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>What this includes</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>Capabilities</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <div className="mt-8">
                <FeatureList items={capability.features} />
              </div>
            </Reveal>

            {offerings.length > 0 ? (
              <Reveal delay={220}>
                <div className="mt-10 border-t border-line pt-7">
                  <p className="label label-plain mb-4">Also available</p>
                  <ul className="flex flex-wrap gap-2.5">
                    {offerings.map((offering) => (
                      <li key={offering.id}>
                        <Tag>{offering.label}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>

          <div>
            <Reveal from="none">
              <Eyebrow>Where it applies</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>Use cases</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <ol className="mt-8 space-y-6">
                {capability.useCases.map((useCase, i) => (
                  <li key={useCase} className="flex gap-5">
                    <span className="tnum shrink-0 font-display text-[1.125rem] text-content-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                      {useCase}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Engagement approach */}
      <Section divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>Engagement approach</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>How we would run this.</MaskReveal>
          </h2>
        </div>
        <div className="mt-16">
          <ProcessSteps />
        </div>
      </Section>

      {/* Related */}
      {relatedProducts.length > 0 ? (
        <Section tone="sunken" divided>
          <Reveal from="none">
            <Eyebrow>Related products</Eyebrow>
          </Reveal>
          <ul className="hairline-grid mt-10 grid sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product, i) => (
              <Reveal key={product.slug} as="li" delay={i * 80} className="flex">
                <CardLink
                  to={`/products/${product.slug}`}
                  eyebrow={product.category}
                  title={product.title}
                  description={product.description}
                  footer="Product"
                />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section divided>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {relatedIndustries.length > 0 ? (
            <div>
              <Reveal from="none">
                <Eyebrow>Industries we apply this in</Eyebrow>
              </Reveal>
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {relatedIndustries.map((industry) => (
                  <li key={industry.slug}>
                    <Link
                      to={`/industries/${industry.slug}`}
                      className="inline-flex min-h-11 items-center rounded-[var(--radius-full)] border border-line px-5 py-2.5 text-[0.9375rem] text-content-muted transition-colors hover:border-accent hover:text-content-accent"
                    >
                      {industry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {siblings.length > 0 ? (
            <div>
              <Reveal from="none">
                <Eyebrow>More in {capability.category}</Eyebrow>
              </Reveal>
              <ul className="mt-7 divide-y divide-line border-y border-line">
                {siblings.map((sibling) => (
                  <li key={sibling.slug}>
                    <Link
                      to={`/capabilities/${sibling.slug}`}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="text-[1.0625rem] text-content group-hover:text-content-accent">
                        {sibling.title}
                      </span>
                      <ArrowIcon className="text-content-accent transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      <CtaSection
        headline={`Need ${capability.title.toLowerCase()}?`}
        body="Tell us what the system has to do and what it has to connect to. We will tell you honestly whether we are the right people for it."
      />
    </>
  )
}
