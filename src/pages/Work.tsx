import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink } from '@/components/ui/CardLink'
import { LinkButton, ArrowIcon } from '@/components/ui/Button'
import { SourceCallout } from '@/components/ui/SourceNote'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { DeploymentFootprint } from '@/components/sections/DeploymentFootprint'
import { ClientRoster } from '@/components/sections/ClientRoster'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { caseStudies } from '@/data/work'
import { deploymentSites } from '@/data/deployments'

/**
 * Selected work.
 *
 * This page is the clearest expression of the project's integrity rule. The
 * source site published four case studies; three used anonymous client names
 * ("Global Retail Chain") with precise unattributable metrics ("$1.4M saved"), so
 * they are not republished here — see docs/CONTENT_INVENTORY.md §10.
 *
 * What replaces them is stronger, not weaker: one corroborated case study, 30
 * named institutional deployments, and a real client roster. The page
 * architecture holds more case studies the moment verified ones are supplied.
 */
export default function Work() {
  useSeo({
    title: 'Selected work',
    description:
      'Case studies and deployment record — including the ITMS training management ' +
      'platform running across 30 named Indian institutions.',
    path: '/work',
    breadcrumbs: [{ name: 'Work', path: '/work' }],
  })

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Fewer case studies than we could write. All of them true."
        lede="We publish work we can evidence. Where we cannot name a client or stand behind a number, we show the deployment record instead — which in our case is the stronger proof anyway."
        breadcrumbs={[{ name: 'Work', path: '/work' }]}
      />

      {/* Case studies */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal from="none">
              <Eyebrow>
                {caseStudies.length === 1
                  ? '1 published case study'
                  : `${caseStudies.length} published case studies`}
              </Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[26ch] text-[length:var(--text-h2)]">
              <MaskReveal>Projects we can put a name to.</MaskReveal>
            </h2>
          </div>
        </div>

        <ul className="hairline-grid mt-12 grid md:grid-cols-2">
          {caseStudies.map((study, i) => (
            <Reveal key={study.slug} as="li" delay={i * 90} className="flex">
              <CardLink
                to={`/work/${study.slug}`}
                eyebrow={study.industry}
                title={study.title}
                description={study.summary}
                footer={study.client}
              />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <SourceCallout className="mt-10 max-w-[70ch]">
            Our client base includes government bodies and public institutions, and most
            engagements are covered by confidentiality terms. That is why this list is
            short: we would rather publish one case study we can fully stand behind than
            several written around an anonymous client and an unverifiable percentage.
          </SourceCallout>
        </Reveal>
      </Section>

      {/* Deployment record as the main body of evidence */}
      <Section tone="sunken" divided>
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>Deployment record</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>{`${deploymentSites.length} institutions, named.`}</MaskReveal>
          </h2>
          <Reveal delay={140}>
            <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              National railway academies, signal and telecom training institutes,
              agricultural and medical research bodies, and divisional railway offices
              across India. You can look up every one of them.
            </p>
          </Reveal>
        </div>
        <div className="mt-14">
          <DeploymentFootprint />
        </div>
      </Section>

      {/* Clients */}
      <Section divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>Client roster</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>Organisations we have delivered for.</MaskReveal>
          </h2>
        </div>
        <div className="mt-14">
          <ClientRoster />
        </div>
      </Section>

      {/* Capability showcase in place of invented projects */}
      <Section tone="emphasis" className="tech-grid-bg" divided>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Evaluating us</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[24ch] text-[length:var(--text-h2)]">
              <MaskReveal>Ask for the walkthrough instead.</MaskReveal>
            </h2>
          </div>
          <Reveal delay={160} from="left">
            <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              A published case study tells you what we chose to write down. A working
              session tells you considerably more. We will take one of our live platforms,
              run it against your actual process, and show you where it fits and where it
              does not.
            </p>
            <p className="mt-5 leading-relaxed text-content-muted">
              Where confidentiality allows, we can also arrange a reference conversation
              with an existing client in your sector.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton to="/contact" size="lg">
                Request a walkthrough
                <ArrowIcon />
              </LinkButton>
              <LinkButton to="/products" variant="secondary" size="lg">
                See the platforms
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaSection />
    </>
  )
}
