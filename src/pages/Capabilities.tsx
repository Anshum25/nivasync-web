import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink, Tag } from '@/components/ui/CardLink'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { SourceCallout } from '@/components/ui/SourceNote'
import { useSeo } from '@/lib/seo'
import { capabilities, capabilityCategories, namedOfferings } from '@/data/capabilities'

export default function Capabilities() {
  useSeo({
    title: 'Capabilities',
    description:
      'Ten engineering capabilities across digital engineering, business systems and ' +
      'digital infrastructure — from custom software and ERPNext implementation to ' +
      'Frappe development and business automation.',
    path: '/capabilities',
    breadcrumbs: [{ name: 'Capabilities', path: '/capabilities' }],
  })

  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="Ten disciplines, one delivery practice."
        lede="Grouped by discipline rather than by buzzword. Each capability below is work we do repeatedly, with people who have done it before."
        breadcrumbs={[{ name: 'Capabilities', path: '/capabilities' }]}
      />

      {capabilityCategories.map((category, catIndex) => {
        const items = capabilities.filter((c) => c.category === category)
        return (
          <Section
            key={category}
            tone={catIndex % 2 === 1 ? 'sunken' : 'default'}
            divided={catIndex > 0}
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Reveal from="none">
                  <Eyebrow>{`0${catIndex + 1} — ${items.length} capabilities`}</Eyebrow>
                </Reveal>
                <h2 className="mt-5 text-[length:var(--text-h2)]">
                  <MaskReveal>{category}</MaskReveal>
                </h2>
              </div>
            </div>

            <ul className="hairline-grid mt-12 grid sm:grid-cols-2 lg:grid-cols-3">
              {items.map((capability, i) => (
                <Reveal key={capability.slug} as="li" delay={i * 80} className="flex">
                  <CardLink
                    to={`/capabilities/${capability.slug}`}
                    title={capability.title}
                    description={capability.shortDescription}
                    footer={capability.technologies.slice(0, 2).join(' · ')}
                  />
                </Reveal>
              ))}
            </ul>
          </Section>
        )
      })}

      {/* Named offerings — honest treatment of the thinner service list */}
      <Section divided>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Also offered</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[22ch] text-[length:var(--text-h2)]">
              <MaskReveal>Supporting services.</MaskReveal>
            </h2>
          </div>

          <div>
            <Reveal delay={120}>
              <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                These sit alongside the capabilities above — usually as part of a larger
                engagement rather than standalone engagements of their own.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {namedOfferings.map((offering) => (
                  <li key={offering.id}>
                    <Tag>{offering.label}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={280}>
              <SourceCallout className="mt-8 max-w-[62ch]">
                We list these as offerings rather than giving each a full service page,
                because that is an honest reflection of how they are delivered. Ask us
                about any of them and we will tell you exactly what is involved.
              </SourceCallout>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="sunken" divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>Engagement approach</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>The same five steps, every time.</MaskReveal>
          </h2>
        </div>
        <div className="mt-16">
          <ProcessSteps />
        </div>
      </Section>

      <CtaSection />
    </>
  )
}
