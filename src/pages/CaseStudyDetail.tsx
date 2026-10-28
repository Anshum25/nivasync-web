import { useParams } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Tag } from '@/components/ui/CardLink'
import { LinkButton, ArrowIcon } from '@/components/ui/Button'
import { SourceNote } from '@/components/ui/SourceNote'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { getCaseStudy } from '@/data/work'
import { getProduct } from '@/data/products'
import { deploymentSites } from '@/data/deployments'
import { SITE_ORIGIN } from '@/data/company'
import type { CaseStudy } from '@/types/content'
import NotFound from './NotFound'

/** Case study detail template. */
export default function CaseStudyDetail() {
  const { slug = '' } = useParams()
  const study = getCaseStudy(slug)

  // The early return lives here, BEFORE any other hook runs. Putting it
  // after useSeo would change hook order between a found and a missing
  // record, which React forbids.
  if (!study) return <NotFound />

  return <CaseStudyDetailView study={study} slug={slug} />
}

function CaseStudyDetailView({ study, slug }: { study: CaseStudy; slug: string }) {

  const itms = getProduct('itms')
  const isRailways = slug === 'national-railway-infrastructure'

  const trail = [
    { name: 'Work', path: '/work' },
    { name: study.title, path: `/work/${slug}` },
  ]

  useSeo({
    title: study.title,
    description: study.summary,
    path: `/work/${slug}`,
    type: 'article',
    breadcrumbs: trail,
    jsonLd: [
      {
        '@type': 'Article',
        headline: study.title,
        description: study.summary,
        about: study.industry,
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        author: { '@id': `${SITE_ORIGIN}/#organization` },
      },
    ],
  })

  return (
    <>
      <PageHero
        eyebrow="Case study"
        title={study.title}
        lede={study.summary}
        breadcrumbs={trail}
        aside={
          <dl className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
            <div className="mb-5">
              <dt className="label label-plain mb-2">Client</dt>
              <dd className="font-display text-[1.125rem] text-content">{study.client}</dd>
            </div>
            <div className="mb-5">
              <dt className="label label-plain mb-2">Sector</dt>
              <dd className="text-[0.9375rem] text-content-muted">{study.industry}</dd>
            </div>
            <div>
              <dt className="label label-plain mb-2.5">Technologies</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {study.technologies.map((tech) => (
                    <li key={tech}>
                      <Tag>{tech}</Tag>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        }
      />

      {/* Challenge */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>The challenge</Eyebrow>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
              {study.challenge}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Solution */}
      <Section tone="sunken" divided>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>What we built</Eyebrow>
            </Reveal>
            <h2 className="mt-5 text-[length:var(--text-h2)]">
              <MaskReveal>The solution</MaskReveal>
            </h2>
          </div>
          <div>
            <Reveal delay={100}>
              <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {study.solution}
              </p>
            </Reveal>

            {itms && isRailways ? (
              <Reveal delay={180}>
                <div className="mt-10 rounded-[var(--radius-lg)] border border-line bg-surface p-6 md:p-7">
                  <p className="label label-plain mb-3">The platform</p>
                  <h3 className="font-display text-[length:var(--text-h4)] text-content">
                    {itms.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-content-muted">
                    {itms.description}
                  </p>
                  <LinkButton
                    to={`/products/${itms.slug}`}
                    variant="ghost"
                    className="mt-4 -ml-2"
                  >
                    About {itms.title.split(' — ')[0]}
                    <ArrowIcon />
                  </LinkButton>
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Outcomes */}
      <Section tone="emphasis" className="tech-grid-bg" divided>
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>Outcomes</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>What changed.</MaskReveal>
          </h2>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2">
          {study.results.map((result, i) => (
            <Reveal key={result.metric} as="li" delay={i * 110}>
              <p className="font-display text-[clamp(2.5rem,1.8rem+2.4vw,3.75rem)] leading-none text-content-accent">
                {result.metric}
              </p>
              <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {result.description}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={240}>
          <p className="mt-12 max-w-[66ch] border-t border-line pt-7 text-[0.9375rem] leading-relaxed text-content-muted">
            These outcomes are described qualitatively because that is what we can stand
            behind. We do not publish financial or percentage improvements for client
            projects unless the client has verified and approved the figure.
            <SourceNote tag="company-stated" className="ml-2 align-middle" />
          </p>
        </Reveal>
      </Section>

      {/* Scale */}
      {isRailways ? (
        <Section divided>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <Reveal from="none">
                <Eyebrow>Scale</Eyebrow>
              </Reveal>
              <h2 className="mt-5 max-w-[20ch] text-[length:var(--text-h2)]">
                <MaskReveal>{`${deploymentSites.length} institutions`}</MaskReveal>
              </h2>
            </div>
            <Reveal delay={140}>
              <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                The platform is not a single-site pilot. It runs across national
                academies, zonal and signal/telecom training institutes, research bodies
                and divisional railway offices.
              </p>
              <ul className="mt-9 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {deploymentSites
                  .filter((s) => s.category === 'academy' || s.category === 'training-institute')
                  .map((site) => (
                    <li
                      key={site.name}
                      className="text-[0.9375rem] leading-snug text-content-muted"
                    >
                      {site.name}
                    </li>
                  ))}
              </ul>
              <LinkButton to="/work" variant="secondary" className="mt-9">
                See the full deployment record
                <ArrowIcon />
              </LinkButton>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <CtaSection
        headline="Have a similar problem?"
        body="If you are running a training, certification or multi-site operational process on spreadsheets and email, this is the conversation to have."
      />
    </>
  )
}
