import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink } from '@/components/ui/CardLink'
import { SourceCallout } from '@/components/ui/SourceNote'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { articles } from '@/data/insights'

/**
 * Insights listing.
 *
 * Two articles, both migrated from the source site. No filler was generated: the
 * brief forbids padding the site with AI-written posts, and a thin honest section
 * reads better than twenty articles nobody wrote on purpose.
 *
 * The content model is a typed array, so connecting a CMS later means replacing
 * the data source for `articles` — no component changes.
 */
export default function Insights() {
  useSeo({
    title: 'Insights',
    description:
      'Notes from the NivaSync engineering team on enterprise software architecture, ' +
      'modular ERP and applied AI.',
    path: '/insights',
    breadcrumbs: [{ name: 'Insights', path: '/insights' }],
  })

  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes from the engineering team."
        lede="Occasional pieces on architecture and applied technology. We publish when there is something worth saying rather than to a content calendar."
        breadcrumbs={[{ name: 'Insights', path: '/insights' }]}
      />

      <Section>
        {/* The card titles are h3, so this h2 is required: without it the page
            jumps from h1 straight to h3 and the outline breaks. */}
        <Reveal from="none">
          <Eyebrow>Published</Eyebrow>
        </Reveal>
        <h2 className="mt-5 max-w-[26ch] text-[length:var(--text-h2)]">
          <MaskReveal>Writing worth the time it took.</MaskReveal>
        </h2>

        <ul className="hairline-grid mt-12 grid md:grid-cols-2">
          {sorted.map((article, i) => (
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

        <Reveal delay={200}>
          <SourceCallout className="mt-10 max-w-[68ch]">
            Two published pieces. We have deliberately not filled this section with
            generated articles to make it look busier — this is the honest state of our
            writing, and the section is wired to a content model that accepts a CMS when
            we have more to say.
          </SourceCallout>
        </Reveal>
      </Section>

      <Section tone="sunken" divided spacing="tight">
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>Topics we work in</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>What we would write about next.</MaskReveal>
          </h2>
          <Reveal delay={140}>
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
              {[
                'Modular ERP architecture',
                'Frappe & ERPNext at scale',
                'Training and certification systems',
                'Document processing with AI',
                'Legacy modernisation',
                'Public-sector delivery',
              ].map((topic) => (
                <li
                  key={topic}
                  className="font-display text-[1.0625rem] text-content-muted"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <CtaSection />
    </>
  )
}
