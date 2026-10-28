import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SourceCallout } from '@/components/ui/SourceNote'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'

export interface LegalClause {
  heading: string
  paragraphs: string[]
  list?: string[]
}

/**
 * Shared layout for the legal pages.
 *
 * Both documents are written specifically for this corporate website. Nothing was
 * copied from another company's policy or from a policy written for a different
 * product or domain, which is why both carry a visible "pending legal review"
 * notice rather than presenting themselves as approved final terms.
 */
export function LegalDocument({
  title,
  path,
  intro,
  lastUpdated,
  clauses,
  reviewNotice,
}: {
  title: string
  /** This document's own route, for the breadcrumb trail. */
  path: string
  intro: string
  lastUpdated: string
  clauses: LegalClause[]
  reviewNotice: string
}) {
  return (
    <>
      <div className="border-b border-line bg-surface-sunken pb-[var(--section-y-tight)] pt-12 md:pt-16">
        <Container width="prose">
          <Breadcrumbs trail={[{ name: title, path }]} />
          <Reveal from="none">
            <Eyebrow>Legal</Eyebrow>
          </Reveal>
          <h1 className="mt-5 text-[length:var(--text-h1)] leading-[var(--leading-snug)]">
            <MaskReveal>{title}</MaskReveal>
          </h1>
          <Reveal delay={120}>
            <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              {intro}
            </p>
            <p className="mt-6 text-[0.8125rem] text-content-subtle">
              Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time>
            </p>
          </Reveal>
        </Container>
      </div>

      <Section width="prose">
        <SourceCallout className="mb-12">{reviewNotice}</SourceCallout>

        {/* On-page contents: these documents are long enough to warrant it. */}
        <nav aria-label="On this page" className="mb-14 border-y border-line py-6">
          <p className="label label-plain mb-4">On this page</p>
          <ol className="space-y-2">
            {clauses.map((clause, i) => (
              <li key={clause.heading}>
                <a
                  href={`#clause-${i + 1}`}
                  className="link-underline text-[0.9375rem] text-content-muted hover:text-content"
                >
                  <span className="tnum mr-2 text-content-subtle">{i + 1}.</span>
                  {clause.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {clauses.map((clause, i) => (
            <section key={clause.heading} id={`clause-${i + 1}`} aria-labelledby={`h-${i + 1}`}>
              <h2 id={`h-${i + 1}`} className="text-[length:var(--text-h3)]">
                <span className="tnum mr-3 text-content-subtle">{i + 1}.</span>
                {clause.heading}
              </h2>

              {clause.paragraphs.map((paragraph, p) => (
                <p key={p} className="mt-5 leading-relaxed text-content-muted">
                  {paragraph}
                </p>
              ))}

              {clause.list ? (
                <ul className="mt-5 space-y-2.5">
                  {clause.list.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-content-muted">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </Section>
    </>
  )
}
