import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink } from '@/components/ui/CardLink'
import { SourceCallout } from '@/components/ui/SourceNote'
import { PageHero } from '@/components/sections/PageHero'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { useSeo } from '@/lib/seo'
import { openings, workplace } from '@/data/careers'
import { deploymentSites } from '@/data/deployments'
import { primaryEmail } from '@/data/company'

/**
 * Careers.
 *
 * ── HONEST EMPTY STATE ───────────────────────────────────────────────────────
 * `openings` is empty because no real vacancy exists or was supplied, and the
 * source site has no careers page at all. No job titles, salary bands or benefit
 * lists are invented: a fabricated vacancy is a fact a candidate would act on.
 *
 * The page is still useful — it explains the work, and the speculative
 * application path is a real, working form.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function Careers() {
  useSeo({
    title: 'Careers',
    description:
      'Work on enterprise systems that railway academies, research institutes and ' +
      'manufacturers depend on. We are not advertising a specific vacancy right now, ' +
      'but we read every speculative application.',
    path: '/careers',
    breadcrumbs: [{ name: 'Careers', path: '/careers' }],
  })

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={workplace.headline}
        lede={workplace.intro}
        breadcrumbs={[{ name: 'Careers', path: '/careers' }]}
      />

      {/* Open positions — or the honest absence of them */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal from="none">
              <Eyebrow>Open positions</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[26ch] text-[length:var(--text-h2)]">
              <MaskReveal>
                {openings.length === 0
                  ? 'No advertised vacancies at the moment.'
                  : `${openings.length} open position${openings.length === 1 ? '' : 's'}.`}
              </MaskReveal>
            </h2>
          </div>
        </div>

        {openings.length === 0 ? (
          <Reveal delay={140}>
            <div className="mt-12 rounded-[var(--radius-lg)] border border-line bg-surface-sunken p-8 md:p-12">
              <div className="max-w-[52ch]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mb-6 h-9 w-9 text-content-subtle"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  <rect x="2.5" y="6.5" width="19" height="14" rx="2" />
                  <path d="M8.5 6.5V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M2.5 12h19" />
                </svg>

                <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
                  {workplace.emptyStateNote}
                </p>
                <p className="mt-5 leading-relaxed text-content-muted">
                  {workplace.benefitsNote}
                </p>
                <p className="mt-5 leading-relaxed text-content-muted">
                  Send us something concrete — what you have built, in what stack, and
                  what you would want to work on here. Use the form below, or email{' '}
                  <a href={primaryEmail.href} className="link-underline text-content-accent">
                    {primaryEmail.value}
                  </a>
                  .
                </p>
              </div>
            </div>
          </Reveal>
        ) : (
          <ul className="hairline-grid mt-12 grid md:grid-cols-2">
            {openings.map((opening, i) => (
              <Reveal key={opening.slug} as="li" delay={i * 90} className="flex">
                <CardLink
                  to="/careers"
                  eyebrow={`${opening.location} · ${opening.type}`}
                  title={opening.title}
                  description={opening.summary}
                  footer="Apply"
                />
              </Reveal>
            ))}
          </ul>
        )}

        <Reveal delay={220}>
          <SourceCallout className="mt-10 max-w-[70ch]">
            We publish a vacancy only when the role is real, approved and open. An empty
            careers page is less impressive than a list of invented openings — and a great
            deal more useful to anyone deciding where to spend an afternoon applying.
          </SourceCallout>
        </Reveal>
      </Section>

      {/* The work */}
      <Section tone="emphasis" className="tech-grid-bg" divided>
        <div className="max-w-[46rem]">
          <Reveal from="none">
            <Eyebrow>The work</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>Systems with a long shelf life.</MaskReveal>
          </h2>
          <Reveal delay={140}>
            <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              {deploymentSites.length} named institutions run software we built — national
              railway academies, signal and telecom training institutes, agricultural and
              medical research bodies. These are not throwaway projects. What you ship is
              still in use, by people whose working day depends on it, years later.
            </p>
          </Reveal>
        </div>

        <ul className="hairline-grid mt-16 grid md:grid-cols-3">
          {workplace.principles.map((principle, i) => (
            <Reveal key={principle.title} as="li" delay={i * 100} className="flex">
              <div className="p-7 md:p-9">
                <h3 className="font-display text-[length:var(--text-h3)] text-content">
                  {principle.title}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-content-muted">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Application pathway — a real working form */}
      <Section divided>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Speculative application</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[22ch] text-[length:var(--text-h2)]">
              <MaskReveal>Tell us what you build.</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[48ch] leading-relaxed text-content-muted">
                Use the message field for a short note and a link to your work — a
                repository, a shipped product, or a system you are proud of. We cannot
                attach a CV through this form, so send a link, or email it to{' '}
                <a href={primaryEmail.href} className="link-underline text-content-accent">
                  {primaryEmail.value}
                </a>
                .
              </p>
            </Reveal>
          </div>

          <div>
            <InquiryForm kind="corporate" />
          </div>
        </div>
      </Section>
    </>
  )
}
