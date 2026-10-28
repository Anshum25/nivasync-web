import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink } from '@/components/ui/CardLink'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { DeploymentFootprint } from '@/components/sections/DeploymentFootprint'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { industries } from '@/data/industries'

/**
 * Industries overview.
 *
 * The three sectors with the strongest evidence — railways, government and
 * education, where the 30-site deployment record sits — are presented first and
 * larger. The rest follow. No sector claims "deep specialisation" it cannot show.
 */
const EVIDENCED = ['railways', 'government', 'education']

export default function Industries() {
  useSeo({
    title: 'Industries',
    description:
      'Railways, government, education, manufacturing, finance, logistics, retail, ' +
      'healthcare and more — the sectors NivaSync builds enterprise systems for.',
    path: '/industries',
    breadcrumbs: [{ name: 'Industries', path: '/industries' }],
  })

  const evidenced = industries.filter((i) => EVIDENCED.includes(i.slug))
  const rest = industries.filter((i) => !EVIDENCED.includes(i.slug))

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Sectors where we already know the constraints."
        lede="Twelve industries. Our deepest delivery record is in railways, government and education — which is where most of our named institutional deployments sit."
        breadcrumbs={[{ name: 'Industries', path: '/industries' }]}
      />

      <Section>
        <Reveal from="none">
          <Eyebrow>Strongest delivery record</Eyebrow>
        </Reveal>
        <h2 className="mt-5 max-w-[30ch] text-[length:var(--text-h2)]">
          <MaskReveal>Where our systems are already running.</MaskReveal>
        </h2>

        <ul className="hairline-grid mt-12 grid md:grid-cols-3">
          {evidenced.map((industry, i) => (
            <Reveal key={industry.slug} as="li" delay={i * 90} className="flex">
              <CardLink
                to={`/industries/${industry.slug}`}
                title={industry.name}
                description={industry.description}
                footer={`${industry.challenges.length} challenges addressed`}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="sunken" divided>
        <Reveal from="none">
          <Eyebrow>Also serving</Eyebrow>
        </Reveal>
        <h2 className="mt-5 max-w-[30ch] text-[length:var(--text-h2)]">
          <MaskReveal>Nine more sectors we build for.</MaskReveal>
        </h2>

        <ul className="hairline-grid mt-12 grid sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((industry, i) => (
            <Reveal key={industry.slug} as="li" delay={i * 60} className="flex">
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

      <Section divided>
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>Deployment footprint</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>Thirty named institutions.</MaskReveal>
          </h2>
          <Reveal delay={140}>
            <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              Every entry below is a real, publicly checkable organisation. This is the
              evidence behind our public-sector and education record.
            </p>
          </Reveal>
        </div>
        <div className="mt-14">
          <DeploymentFootprint />
        </div>
      </Section>

      <CtaSection />
    </>
  )
}
