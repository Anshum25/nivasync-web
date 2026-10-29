import { Link } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton, ArrowIcon } from '@/components/ui/Button'
import { CardLink } from '@/components/ui/CardLink'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { HeroVisual } from '@/components/sections/HeroVisual'
import { StatsRow } from '@/components/sections/StatsRow'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { BrandEcosystem } from '@/components/sections/BrandEcosystem'
import { DeploymentFootprint } from '@/components/sections/DeploymentFootprint'
import { TransformationFlow } from '@/components/sections/TransformationFlow'
import { ClientRoster } from '@/components/sections/ClientRoster'
import { CtaSection } from '@/components/sections/CtaSection'
import { useSeo } from '@/lib/seo'
import { hero, introduction, pillars, positioning } from '@/data/narrative'
import { capabilities, capabilityCategories } from '@/data/capabilities'
import { products } from '@/data/products'
import { industries } from '@/data/industries'
import { caseStudies } from '@/data/work'
import { articles } from '@/data/insights'
import { ecosystemIntro } from '@/data/brands'
import { company } from '@/data/company'

/**
 * Homepage.
 *
 * The section order tells one argument rather than stacking generic cards:
 *   who we are → what we build → who we are made of → what we have shipped →
 *   where it actually runs → the one case study we can stand behind →
 *   who we build for → how we work → the numbers → how we think → who trusts us.
 *
 * The deployment footprint carries the weight that invented client metrics would
 * normally carry on a site like this. See docs/CONTENT_INVENTORY.md §10.
 */
export default function Home() {
  const featured = caseStudies[0]

  useSeo({
    title: `${company.legalName} — Enterprise technology, engineered to last`,
    description:
      'NivaSync Infotech Pvt. Ltd. is the parent company behind Skydot Infotech. ' +
      'We engineer enterprise software, ERP, training platforms and digital ' +
      'infrastructure for government, education and industry across India.',
    path: '/',
  })

  return (
    <>
      {/* ——— Hero ——— */}
      <section
        className="band-emphasis tech-grid-bg relative overflow-hidden"
        aria-label="Introduction"
      >
        <div
          aria-hidden="true"
          className="accent-glow pointer-events-none absolute -right-[10%] top-[-10%] h-[40rem] w-[40rem] opacity-50"
        />

        <Container className="relative grid items-center gap-14 pb-[var(--section-y)] pt-16 md:pt-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <Reveal from="none">
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </Reveal>

            <h1 className="mt-6 text-[length:var(--text-display-2)] leading-[var(--leading-tight)]">
              <MaskReveal>{hero.headline}</MaskReveal>
            </h1>

            <Reveal delay={140}>
              <p className="mt-7 max-w-[52ch] text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {hero.subheadline}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-5 max-w-[54ch] leading-relaxed text-content-muted">
                {hero.support}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-3">
                <LinkButton to={hero.primaryCta.to} size="lg">
                  {hero.primaryCta.label}
                  <ArrowIcon />
                </LinkButton>
                <LinkButton to={hero.secondaryCta.to} variant="secondary" size="lg">
                  {hero.secondaryCta.label}
                </LinkButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={260} from="left" className="hidden lg:block">
            <HeroVisual />
          </Reveal>
        </Container>
      </section>

      {/* ——— Positioning + corporate introduction ——— */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>{introduction.label}</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>{positioning.headline}</MaskReveal>
              <MaskReveal delay={90}>
                <span className="text-content-muted">{positioning.subheadline}</span>
              </MaskReveal>
            </h2>
          </div>

          <div>
            <Reveal delay={120}>
              <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
                {introduction.headline}
              </p>
            </Reveal>
            {introduction.body.map((paragraph, i) => (
              <Reveal key={i} delay={180 + i * 90}>
                <p className="mt-5 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Four capability pillars */}
        <ul className="hairline-grid mt-16 grid sm:grid-cols-2 lg:grid-cols-4 lg:mt-20">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.number} as="li" delay={i * 90} className="flex">
              <Link
                to={pillar.to}
                className="group flex min-h-full flex-col p-6 transition-colors hover:bg-surface-sunken md:p-8"
              >
                <span className="tnum text-[0.75rem] font-semibold tracking-[0.1em] text-content-accent">
                  {pillar.number}
                </span>
                <h3 className="mt-4 text-[length:var(--text-h4)] font-medium leading-snug text-content group-hover:text-content-accent">
                  {pillar.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-content-muted">
                  {pillar.description}
                </p>
                <ArrowIcon className="mt-6 text-content-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ——— Capabilities ——— */}
      <Section tone="sunken" divided>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal from="none">
              <Eyebrow>Capabilities</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[26ch] text-[length:var(--text-h2)]">
              <MaskReveal>Ten disciplines, one delivery practice.</MaskReveal>
            </h2>
          </div>
          <Reveal delay={120}>
            <Link
              to="/capabilities"
              className="link-underline inline-flex items-center gap-2 font-medium text-content-accent"
            >
              All capabilities
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 space-y-12">
          {capabilityCategories.map((category, catIndex) => (
            <div key={category}>
              <Reveal from="none">
                <p className="label mb-5">{category}</p>
              </Reveal>
              <ul className="hairline-grid grid sm:grid-cols-2 lg:grid-cols-4">
                {capabilities
                  .filter((c) => c.category === category)
                  .map((capability, i) => (
                    <Reveal
                      key={capability.slug}
                      as="li"
                      delay={catIndex * 60 + i * 70}
                      className="flex"
                    >
                      <CardLink
                        to={`/capabilities/${capability.slug}`}
                        title={capability.title}
                        description={capability.shortDescription}
                        footer="Capability"
                      />
                    </Reveal>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ——— Transformation flow ——— */}
      <TransformationFlow />

      {/* ——— Brand ecosystem ——— */}
      <Section divided>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>{ecosystemIntro.label}</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[24ch] text-[length:var(--text-h2)]">
              <MaskReveal>{ecosystemIntro.headline}</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[52ch] text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {ecosystemIntro.body}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <LinkButton to="/brands" variant="secondary" className="mt-8">
                Explore the ecosystem
                <ArrowIcon />
              </LinkButton>
            </Reveal>
          </div>

          <Reveal delay={160} from="left">
            <blockquote className="border-l-2 border-accent pl-6 md:pl-8">
              <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
                {company.brandStatement}
              </p>
              <p className="mt-4 text-[0.8125rem] text-content-subtle">
                As published by Skydot Infotech
              </p>
            </blockquote>
          </Reveal>
        </div>

        <div className="mt-16">
          <BrandEcosystem />
        </div>
      </Section>

      {/* ——— Products ——— */}
      <Section tone="sunken" divided>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal from="none">
              <Eyebrow>Products & platforms</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[28ch] text-[length:var(--text-h2)]">
              <MaskReveal>Platforms we own, not just projects we ship.</MaskReveal>
            </h2>
          </div>
          <Reveal delay={120}>
            <Link
              to="/products"
              className="link-underline inline-flex items-center gap-2 font-medium text-content-accent"
            >
              All products
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>

        <ul className="hairline-grid mt-14 grid sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
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

      {/* ——— Deployment footprint: the real-world evidence ——— */}
      <Section divided>
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>Where our software runs</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>{introduction.realWorldLine}</MaskReveal>
          </h2>
          <Reveal delay={140}>
            <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              Thirty named institutions run systems we built — national railway
              academies, signal and telecom training institutes, agricultural and
              medical research bodies, and divisional railway offices across India.
              Every one of them is a real organisation you can look up.
            </p>
          </Reveal>
        </div>

        <div className="mt-14">
          <DeploymentFootprint />
        </div>
      </Section>

      {/* ——— Selected work ——— */}
      {featured ? (
        <Section tone="emphasis" className="tech-grid-bg">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <Reveal from="none">
                <Eyebrow>Selected work</Eyebrow>
              </Reveal>
              <h2 className="mt-5 max-w-[24ch] text-[length:var(--text-h2)]">
                <MaskReveal>{featured.title}</MaskReveal>
              </h2>
              <Reveal delay={140}>
                <dl className="mt-8 space-y-4 border-t border-line pt-6">
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[0.8125rem] uppercase tracking-[0.08em] text-content-subtle">
                      Client
                    </dt>
                    <dd className="text-[0.9375rem] text-content">{featured.client}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[0.8125rem] uppercase tracking-[0.08em] text-content-subtle">
                      Sector
                    </dt>
                    <dd className="text-[0.9375rem] text-content">{featured.industry}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[0.8125rem] uppercase tracking-[0.08em] text-content-subtle">
                      Stack
                    </dt>
                    <dd className="text-[0.9375rem] text-content">
                      {featured.technologies.join(' · ')}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            <Reveal delay={160} from="left">
              <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {featured.summary}
              </p>
              <ul className="mt-10 grid gap-8 sm:grid-cols-2">
                {featured.results.map((result) => (
                  <li key={result.metric}>
                    <p className="font-display text-[2rem] leading-none text-content-accent">
                      {result.metric}
                    </p>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-content-muted">
                      {result.description}
                    </p>
                  </li>
                ))}
              </ul>
              <LinkButton to={`/work/${featured.slug}`} className="mt-10">
                Read the case study
                <ArrowIcon />
              </LinkButton>
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* ——— Industries ——— */}
      <Section divided>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal from="none">
              <Eyebrow>Industries</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[26ch] text-[length:var(--text-h2)]">
              <MaskReveal>Sectors where we already know the constraints.</MaskReveal>
            </h2>
          </div>
          <Reveal delay={120}>
            <Link
              to="/industries"
              className="link-underline inline-flex items-center gap-2 font-medium text-content-accent"
            >
              All industries
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-12 flex flex-wrap gap-3">
          {industries.map((industry, i) => (
            <Reveal key={industry.slug} as="li" delay={i * 45}>
              <Link
                to={`/industries/${industry.slug}`}
                className="inline-flex min-h-11 items-center rounded-[var(--radius-full)] border border-line px-5 py-2.5 text-[0.9375rem] text-content-muted transition-colors hover:border-accent hover:text-content-accent"
              >
                {industry.name}
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ——— How we work ——— */}
      <Section tone="sunken" divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>How we work</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>Five steps, every engagement.</MaskReveal>
          </h2>
          <Reveal delay={140}>
            <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              The same sequence whether the work is a two-month integration or a
              multi-site ERP rollout. It is deliberately unglamorous: most project
              failures happen in step one.
            </p>
          </Reveal>
        </div>

        <div className="mt-16">
          <ProcessSteps />
        </div>
      </Section>

      {/* ——— Facts ——— */}
      <Section divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>By the numbers</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>What we can show you.</MaskReveal>
          </h2>
        </div>
        <div className="mt-12">
          <StatsRow />
        </div>
      </Section>

      {/* ——— Insights ——— */}
      <Section tone="sunken" divided>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal from="none">
              <Eyebrow>Insights</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[26ch] text-[length:var(--text-h2)]">
              <MaskReveal>Notes from the engineering team.</MaskReveal>
            </h2>
          </div>
          <Reveal delay={120}>
            <Link
              to="/insights"
              className="link-underline inline-flex items-center gap-2 font-medium text-content-accent"
            >
              All insights
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>

        <ul className="hairline-grid mt-14 grid md:grid-cols-2">
          {articles.map((article, i) => (
            <Reveal key={article.slug} as="li" delay={i * 90} className="flex">
              <CardLink
                to={`/insights/${article.slug}`}
                eyebrow={article.category}
                title={article.title}
                description={article.summary}
                footer={article.displayDate}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ——— Clients ——— */}
      <Section divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>Who we build for</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>Institutions, industry, and the systems between them.</MaskReveal>
          </h2>
        </div>
        <div className="mt-14">
          <ClientRoster />
        </div>
      </Section>

      <CtaSection />
    </>
  )
}
