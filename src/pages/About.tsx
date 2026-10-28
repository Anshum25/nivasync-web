import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { StatsRow } from '@/components/sections/StatsRow'
import { BrandEcosystem } from '@/components/sections/BrandEcosystem'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { SourceCallout } from '@/components/ui/SourceNote'
import { useSeo } from '@/lib/seo'
import { about } from '@/data/narrative'
import { capabilityCategories, capabilities } from '@/data/capabilities'
import { company, offices, unpublishedOfficeNote } from '@/data/company'
import { ecosystemIntro } from '@/data/brands'

export default function About() {
  const hq = offices[0]

  useSeo({
    title: 'About NivaSync Infotech',
    description:
      'NivaSync Infotech Pvt. Ltd. is an engineering company building enterprise ' +
      'software, ERP and training platforms for government, education and industry. ' +
      'Parent company of Skydot Infotech.',
    path: '/about',
    breadcrumbs: [{ name: 'About', path: '/about' }],
  })

  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        title={about.headline}
        lede={about.lede}
        breadcrumbs={[{ name: 'About', path: '/about' }]}
      />

      {/* Story */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>{about.story.label}</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[22ch] text-[length:var(--text-h2)]">
              <MaskReveal>{about.story.headline}</MaskReveal>
            </h2>
          </div>

          <div>
            {about.story.body.map((paragraph, i) => (
              <Reveal key={i} delay={i * 110}>
                <p className="mb-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted last:mb-0">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <Reveal delay={240}>
              <SourceCallout className="mt-8">
                We do not publish a founding year on this site. Our published position is
                that we have more than ten years of delivery experience; a specific
                incorporation date is pending corporate confirmation.
              </SourceCallout>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Positioning as parent company */}
      <Section tone="emphasis" className="tech-grid-bg" divided>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Corporate positioning</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[24ch] text-[length:var(--text-h2)]">
              <MaskReveal>The organisation behind the brands.</MaskReveal>
            </h2>
          </div>
          <Reveal delay={140} from="left">
            <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              {ecosystemIntro.body}
            </p>
            <blockquote className="mt-9 border-l-2 border-accent pl-6">
              <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
                {company.brandStatement}
              </p>
            </blockquote>
          </Reveal>
        </div>

        <div className="mt-16">
          <BrandEcosystem />
        </div>
      </Section>

      {/* Technology capabilities */}
      <Section divided>
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>Technology capabilities</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>What we are actually good at.</MaskReveal>
          </h2>
          <Reveal delay={140}>
            <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              Ten capabilities across three disciplines. This list is deliberately
              finite: it is what we do repeatedly and can staff properly, not a menu of
              everything in the industry.
            </p>
          </Reveal>
        </div>

        <dl className="mt-14 space-y-10">
          {capabilityCategories.map((category, i) => (
            // The grid classes go on Reveal itself rather than an inner <div>:
            // a <dl> may contain dt/dd wrapped in at most ONE div, and the extra
            // wrapper made the list invalid.
            <Reveal
              key={category}
              delay={i * 100}
              className="grid gap-x-10 gap-y-4 border-t border-line pt-7 md:grid-cols-[14rem_1fr]"
            >
              <dt className="font-display text-[length:var(--text-h4)] text-content">{category}</dt>
              <dd>
                <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
                  {capabilities
                    .filter((c) => c.category === category)
                    .map((c) => (
                      <li key={c.slug} className="text-[0.9375rem] text-content-muted">
                        {c.title}
                      </li>
                    ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* Values */}
      <Section tone="sunken" divided>
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>{about.values.label}</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>{about.values.headline}</MaskReveal>
          </h2>
        </div>

        <ul className="hairline-grid mt-14 grid md:grid-cols-3">
          {about.values.items.map((value, i) => (
            <Reveal key={value.title} as="li" delay={i * 100} className="flex">
              <div className="p-7 md:p-9">
                <h3 className="font-display text-[length:var(--text-h3)] text-content">
                  {value.title}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-content-muted">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <SourceCallout className="mt-10 max-w-[62ch]">{about.values.note}</SourceCallout>
        </Reveal>
      </Section>

      {/* Operating approach */}
      <Section divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>Operating approach</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>How an engagement runs.</MaskReveal>
          </h2>
        </div>
        <div className="mt-16">
          <ProcessSteps />
        </div>
      </Section>

      {/* Facts */}
      <Section tone="sunken" divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>Company facts</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>Verifiable first, claimed second.</MaskReveal>
          </h2>
        </div>
        <div className="mt-12">
          <StatsRow />
        </div>
      </Section>

      {/* Office + leadership note */}
      <Section divided>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Corporate office</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h3)]">{hq.label}</h2>
            <Reveal delay={120}>
              <address className="mt-5 not-italic text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                <span className="block text-content">{company.legalName}</span>
                {hq.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">
                  {hq.city}, {hq.region} {hq.postalCode}, {hq.country}
                </span>
              </address>
              <a
                href={hq.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-5 inline-flex text-[0.9375rem] font-medium text-content-accent"
              >
                Open in Google Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <SourceCallout className="mt-7 max-w-[54ch]">
                {unpublishedOfficeNote}
              </SourceCallout>
            </Reveal>
          </div>

          <div>
            <Reveal from="none">
              <Eyebrow>Leadership & team</Eyebrow>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 max-w-[52ch] text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {about.leadershipNote}
              </p>
              <p className="mt-5 max-w-[52ch] leading-relaxed text-content-muted">
                We would rather leave this section empty than fill it with stock
                photography and invented biographies. Ask us directly and we will tell
                you exactly who would work on your project.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaSection />
    </>
  )
}
