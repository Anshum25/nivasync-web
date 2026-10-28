import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SourceCallout } from '@/components/ui/SourceNote'
import { PageHero } from '@/components/sections/PageHero'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { useSeo } from '@/lib/seo'
import { formAdapter } from '@/lib/forms'
import {
  SITE_ORIGIN,
  company,
  contactChannels,
  offices,
  socialProfiles,
  unpublishedOfficeNote,
} from '@/data/company'
import type { InquiryKind } from '@/lib/forms'

const TABS: { id: InquiryKind; label: string; description: string }[] = [
  {
    id: 'project',
    label: 'Project & sales enquiry',
    description:
      'New software, an ERP rollout, a system that needs replacing, or a product walkthrough.',
  },
  {
    id: 'corporate',
    label: 'Corporate enquiry',
    description: 'Partnerships, brand and media enquiries, or anything about the organisation.',
  },
]

export default function Contact() {
  const [active, setActive] = useState<InquiryKind>('project')
  const hq = offices[0]

  useSeo({
    title: 'Contact',
    description:
      'Contact NivaSync Infotech Pvt. Ltd. — corporate office in Bodakdev, Ahmedabad. ' +
      'Sales +91 97144 90600, support +91 97145 90600, hello@nivasync.in.',
    path: '/contact',
    breadcrumbs: [{ name: 'Contact', path: '/contact' }],
    jsonLd: [
      {
        '@type': 'ContactPage',
        name: 'Contact NivaSync Infotech',
        mainEntity: { '@id': `${SITE_ORIGIN}/#organization` },
      },
    ],
  })

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start with the problem, not the technology."
        lede="Tell us what needs to work better. If we are not the right people for it, we will say so — and usually tell you who is."
        breadcrumbs={[{ name: 'Contact', path: '/contact' }]}
      />

      {/* Forms */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            {/* Tabs. Real tab semantics: roving tabindex, arrow-key navigation,
                aria-controls bound to each panel. */}
            {/* The tablist container is not focusable — per the ARIA pattern the
                tabs themselves carry focus (roving tabindex), and the arrow-key
                handler lives on each tab rather than on the container. */}
            <div
              role="tablist"
              aria-label="Enquiry type"
              className="flex flex-wrap gap-2 border-b border-line pb-px"
            >
              {TABS.map((tab) => {
                const selected = active === tab.id
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(tab.id)}
                    onKeyDown={(e) => {
                      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
                      e.preventDefault()
                      const index = TABS.findIndex((t) => t.id === tab.id)
                      const nextIndex =
                        e.key === 'ArrowRight'
                          ? (index + 1) % TABS.length
                          : (index - 1 + TABS.length) % TABS.length
                      setActive(TABS[nextIndex].id)
                      document.getElementById(`tab-${TABS[nextIndex].id}`)?.focus()
                    }}
                    className={cn(
                      'min-h-11 rounded-t-[var(--radius-sm)] px-4 py-2.5 text-[0.9375rem] transition-colors',
                      selected
                        ? 'border-b-2 border-accent font-medium text-content'
                        : 'border-b-2 border-transparent text-content-muted hover:text-content',
                    )}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {TABS.map((tab) => (
              <div
                key={tab.id}
                id={`panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab.id}`}
                hidden={active !== tab.id}
                className="pt-8"
              >
                {active === tab.id ? (
                  <>
                    <p className="mb-8 max-w-[56ch] leading-relaxed text-content-muted">
                      {tab.description}
                    </p>
                    <InquiryForm kind={tab.id} />
                  </>
                ) : null}
              </div>
            ))}
          </div>

          {/* Direct channels */}
          <div>
            <Reveal from="none">
              <Eyebrow>Direct channels</Eyebrow>
            </Reveal>

            <ul className="mt-7 divide-y divide-line border-y border-line">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <a href={channel.href} className="group block py-5">
                    <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-content-subtle">
                      {channel.label}
                    </span>
                    <span className="mt-1.5 block font-display text-[1.25rem] text-content transition-colors group-hover:text-content-accent">
                      {channel.value}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed text-content-muted">
                      {channel.description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <Reveal delay={120}>
              <div className="mt-10">
                <Eyebrow>Corporate office</Eyebrow>
                <address className="mt-5 not-italic leading-relaxed text-content-muted">
                  <span className="block font-medium text-content">{company.legalName}</span>
                  {hq.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="block">
                    {hq.city}, {hq.region} {hq.postalCode}
                  </span>
                  <span className="block">{hq.country}</span>
                </address>

                <a
                  href={hq.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-content-accent"
                >
                  Directions on Google Maps
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 border-t border-line pt-7">
                <Eyebrow>Follow Skydot</Eyebrow>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {socialProfiles.map((profile) => (
                    <li key={profile.id}>
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-[0.9375rem] text-content-muted hover:text-content"
                      >
                        {profile.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.8125rem] leading-relaxed text-content-subtle">
                  Our social accounts run under the Skydot Infotech brand. There is no
                  separate NivaSync account, so we have not invented one here.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Office + status disclosures */}
      <Section tone="sunken" divided spacing="tight">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Office locations</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-5 max-w-[54ch] leading-relaxed text-content-muted">
                {unpublishedOfficeNote}
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal from="none">
              <Eyebrow>Form delivery status</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              {formAdapter.configured ? (
                <p className="mt-5 max-w-[54ch] leading-relaxed text-content-muted">
                  Enquiries submitted above are delivered to our configured form endpoint.
                  You will see a confirmation only once the endpoint has accepted the
                  submission.
                </p>
              ) : (
                <SourceCallout className="mt-5 max-w-[60ch]">
                  No form delivery backend is configured on this build, so the forms above
                  will tell you plainly that nothing was transmitted and offer you a
                  pre-filled email instead. Email and phone, listed above, work normally.
                </SourceCallout>
              )}
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Map — link, not an embed */}
      <Section divided>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Finding us</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[20ch] text-[length:var(--text-h2)]">
              <MaskReveal>Bodakdev, Ahmedabad.</MaskReveal>
            </h2>
          </div>
          <Reveal delay={120}>
            <p className="max-w-[56ch] text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              We link out to Google Maps rather than embedding a map frame. An embedded
              map loads third-party scripts and cookies on every visit, and most people
              want turn-by-turn directions on their phone anyway.
            </p>
            <a
              href={hq.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-line-strong px-5 py-2.5 font-medium text-content transition-colors hover:border-accent hover:text-content-accent"
            >
              Open in Google Maps
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
