import { Link, useParams } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink, FeatureList, Tag } from '@/components/ui/CardLink'
import { LinkButton, ArrowIcon } from '@/components/ui/Button'
import { VisualPlaceholder } from '@/components/ui/VisualPlaceholder'
import { SourceCallout } from '@/components/ui/SourceNote'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { getProduct, products } from '@/data/products'
import { industries } from '@/data/industries'
import { caseStudies } from '@/data/work'
import { SITE_ORIGIN } from '@/data/company'
import type { Product } from '@/types/content'
import NotFound from './NotFound'

/** Product detail template — serves all seven product pages. */
export default function ProductDetail() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)

  // The early return lives here, BEFORE any other hook runs. Putting it
  // after useSeo would change hook order between a found and a missing
  // record, which React forbids.
  if (!product) return <NotFound />

  return <ProductDetailView product={product} slug={slug} />
}

function ProductDetailView({ product, slug }: { product: Product; slug: string }) {

  const relatedIndustries = industries.filter((i) => i.productSlugs.includes(slug))
  const relatedWork = caseStudies.filter(
    (c) => slug === 'itms' && c.slug === 'national-railway-infrastructure',
  )
  const others = products.filter((p) => p.slug !== slug).slice(0, 3)
  // Several titles carry their expansion after an em dash ("ITMS — Institute
  // Training Management System"). The full name belongs in the h1 and the
  // breadcrumb; buttons and inline sentences use the short form.
  const shortTitle = product.title.split(' — ')[0]

  const trail = [
    { name: 'Products', path: '/products' },
    { name: product.title, path: `/products/${slug}` },
  ]

  useSeo({
    title: product.title,
    description: product.description,
    path: `/products/${slug}`,
    breadcrumbs: trail,
    jsonLd: [
      {
        // `SoftwareApplication` with no `offers` node: we do not publish a price
        // or a purchase route, and asserting one would be a fabricated claim.
        '@type': 'SoftwareApplication',
        name: product.title,
        description: product.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        ...(product.externalUrl ? { url: product.externalUrl } : {}),
      },
    ],
  })

  return (
    <>
      <PageHero
        eyebrow={product.category}
        title={product.title}
        lede={product.description}
        breadcrumbs={trail}
        meta={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {product.externalUrl ? (
              <LinkButton to={product.externalUrl} external>
                Visit {new URL(product.externalUrl).hostname.replace(/^www\./, '')}
              </LinkButton>
            ) : null}
            <LinkButton to="/contact" variant="secondary">
              Enquire about {shortTitle}
              <ArrowIcon />
            </LinkButton>
          </div>
        }
        aside={
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
            <p className="label label-plain mb-4">Built with</p>
            <ul className="flex flex-wrap gap-2">
              {product.technologies.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* Features + visual */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Supported features</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>What it does</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <div className="mt-8">
                <FeatureList items={product.features} />
              </div>
            </Reveal>
          </div>

          <Reveal delay={160} from="left">
            {/*
              Every product's `screenshots` array is empty — the source site ships
              none. Rather than reference files that do not exist or hotlink stock
              imagery, this renders a designed placeholder that names what belongs
              here. See docs/ASSET_INVENTORY.md.
            */}
            {product.screenshots.length > 0 ? (
              <img
                src={product.screenshots[0]}
                alt={`${shortTitle} interface`}
                width={1200}
                height={750}
                loading="lazy"
                decoding="async"
                className="rounded-[var(--radius-lg)] border border-line"
              />
            ) : (
              <>
                <VisualPlaceholder
                  label={`${shortTitle} — product screenshot`}
                  caption="Awaiting an approved screenshot or interface capture from the product team."
                />
                <p className="mt-4 text-[0.8125rem] leading-relaxed text-content-subtle">
                  We would rather show a labelled placeholder than a stock photograph
                  that is not our software.
                </p>
              </>
            )}
          </Reveal>
        </div>
      </Section>

      {/* Availability — stated explicitly rather than implied */}
      <Section tone="sunken" divided spacing="tight">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Availability</Eyebrow>
            </Reveal>
          </div>
          <Reveal delay={100}>
            {product.availability === 'confirmed-active' ? (
              <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {shortTitle} is in active delivery.{' '}
                {product.externalUrl
                  ? 'It has its own product site, linked above.'
                  : 'It is deployed and operated as part of client engagements rather than sold as a shelf licence.'}{' '}
                Contact us for a walkthrough against your own process.
              </p>
            ) : (
              <SourceCallout className="max-w-[64ch]">
                We are not publishing current commercial availability, hosting
                arrangements or pricing for {shortTitle}. It is a product we have
                built and deployed — please ask us about its current status rather than
                assuming it from this page.
              </SourceCallout>
            )}
          </Reveal>
        </div>
      </Section>

      {/* Use cases via industries */}
      {relatedIndustries.length > 0 ? (
        <Section divided>
          <div className="max-w-[44rem]">
            <Reveal from="none">
              <Eyebrow>Where it is used</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>Sectors running this platform.</MaskReveal>
            </h2>
          </div>

          <ul className="hairline-grid mt-12 grid sm:grid-cols-2 lg:grid-cols-3">
            {relatedIndustries.map((industry, i) => (
              <Reveal key={industry.slug} as="li" delay={i * 70} className="flex">
                <CardLink
                  to={`/industries/${industry.slug}`}
                  title={industry.name}
                  description={industry.description}
                  footer="Industry"
                />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Proof */}
      {relatedWork.length > 0 ? (
        <Section tone="emphasis" className="tech-grid-bg" divided>
          <div className="max-w-[46rem]">
            <Reveal from="none">
              <Eyebrow>In production</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>{relatedWork[0].title}</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {relatedWork[0].summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton to={`/work/${relatedWork[0].slug}`}>
                  Read the case study
                  <ArrowIcon />
                </LinkButton>
                <LinkButton to="/about" variant="secondary">
                  See the deployment footprint
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <Section divided spacing="tight">
        <Reveal from="none">
          <Eyebrow>Other platforms</Eyebrow>
        </Reveal>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                to={`/products/${other.slug}`}
                className="group flex items-center justify-between gap-4 py-4"
              >
                <span>
                  <span className="block text-[1.0625rem] text-content group-hover:text-content-accent">
                    {other.title}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-content-subtle">
                    {other.category}
                  </span>
                </span>
                <ArrowIcon className="text-content-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaSection
        headline={`Enquire about ${shortTitle}`}
        body="Tell us about your process and the systems it has to work with. We will tell you what fits, what would need building, and what we would not recommend."
      />
    </>
  )
}
