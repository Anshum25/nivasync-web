import { Link, useParams } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink } from '@/components/ui/CardLink'
import { ArrowIcon } from '@/components/ui/Button'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { getIndustry, industries } from '@/data/industries'
import { capabilities } from '@/data/capabilities'
import { productsBySlugs } from '@/data/products'
import { deploymentSites } from '@/data/deployments'
import type { Industry } from '@/types/content'
import NotFound from './NotFound'

/** Industry detail template — serves all twelve industry pages. */
export default function IndustryDetail() {
  const { slug = '' } = useParams()
  const industry = getIndustry(slug)

  // The early return lives here, BEFORE any other hook runs. Putting it
  // after useSeo would change hook order between a found and a missing
  // record, which React forbids.
  if (!industry) return <NotFound />

  return <IndustryDetailView industry={industry} slug={slug} />
}

function IndustryDetailView({ industry, slug }: { industry: Industry; slug: string }) {

  const relatedCapabilities = capabilities.filter((c) =>
    industry.capabilitySlugs.includes(c.slug),
  )
  const relatedProducts = productsBySlugs(industry.productSlugs)
  const others = industries.filter((i) => i.slug !== slug).slice(0, 4)

  // Railways and government are the two sectors our deployment record covers
  // directly, so those pages show it. No other sector claims that evidence.
  const showFootprint = slug === 'railways' || slug === 'government'

  const trail = [
    { name: 'Industries', path: '/industries' },
    { name: industry.name, path: `/industries/${slug}` },
  ]

  useSeo({
    title: `${industry.name} technology solutions`,
    description: industry.description,
    path: `/industries/${slug}`,
    breadcrumbs: trail,
  })

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={industry.name}
        lede={industry.description}
        breadcrumbs={trail}
      />

      {/* Challenges */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>What gets in the way</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[20ch] text-[length:var(--text-h2)]">
              <MaskReveal>Sector challenges</MaskReveal>
            </h2>
          </div>

          <ol className="space-y-8">
            {industry.challenges.map((challenge, i) => (
              <Reveal key={challenge} as="li" delay={i * 110}>
                <div className="flex gap-6 border-t border-line pt-6">
                  <span className="tnum shrink-0 font-display text-[1.125rem] text-content-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
                    {challenge}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Capabilities applied */}
      {relatedCapabilities.length > 0 ? (
        <Section tone="sunken" divided>
          <Reveal from="none">
            <Eyebrow>How we address it</Eyebrow>
          </Reveal>
          <h2 className="mt-5 max-w-[28ch] text-[length:var(--text-h2)]">
            <MaskReveal>Capabilities we apply here.</MaskReveal>
          </h2>

          <ul className="hairline-grid mt-12 grid sm:grid-cols-2 lg:grid-cols-3">
            {relatedCapabilities.map((capability, i) => (
              <Reveal key={capability.slug} as="li" delay={i * 80} className="flex">
                <CardLink
                  to={`/capabilities/${capability.slug}`}
                  eyebrow={capability.category}
                  title={capability.title}
                  description={capability.shortDescription}
                  footer="Capability"
                />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Products used */}
      {relatedProducts.length > 0 ? (
        <Section divided>
          <Reveal from="none">
            <Eyebrow>Platforms used in this sector</Eyebrow>
          </Reveal>
          <ul className="hairline-grid mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product, i) => (
              <Reveal key={product.slug} as="li" delay={i * 70} className="flex">
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

      {/* Evidence, only where it genuinely applies */}
      {showFootprint ? (
        <Section tone="emphasis" className="tech-grid-bg" divided>
          <div className="max-w-[46rem]">
            <Reveal from="none">
              <Eyebrow>Evidence</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>Institutions already running our systems.</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {deploymentSites.length} named organisations — national academies, signal
                and telecom training institutes, research bodies and divisional railway
                offices.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <ul className="mt-12 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {deploymentSites.slice(0, 14).map((site) => (
                <li key={site.name} className="text-[0.9375rem] leading-snug text-content-muted">
                  {site.name}
                </li>
              ))}
            </ul>
            <Link
              to="/industries"
              className="link-underline mt-8 inline-flex items-center gap-2 font-medium text-content-accent"
            >
              See all {deploymentSites.length} deployment locations
              <ArrowIcon />
            </Link>
          </Reveal>
        </Section>
      ) : null}

      <Section divided spacing="tight">
        <Reveal from="none">
          <Eyebrow>Other industries</Eyebrow>
        </Reveal>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                to={`/industries/${other.slug}`}
                className="inline-flex min-h-11 items-center rounded-[var(--radius-full)] border border-line px-5 py-2.5 text-[0.9375rem] text-content-muted transition-colors hover:border-accent hover:text-content-accent"
              >
                {other.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaSection
        headline={`Working in ${industry.name.toLowerCase()}?`}
        body="Tell us which part of the operation is costing you the most time. That is usually the right place to start."
      />
    </>
  )
}
