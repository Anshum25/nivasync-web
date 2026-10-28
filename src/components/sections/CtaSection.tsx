import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton, ArrowIcon } from '@/components/ui/Button'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { closingCta } from '@/data/narrative'
import { contactChannels } from '@/data/company'

/**
 * The site's single conversion section, reused at the foot of every page.
 *
 * It offers a form route and the direct channels side by side, because a
 * procurement officer who wants to phone should not have to hunt for the number
 * on a separate page.
 */
export function CtaSection({
  headline = closingCta.headline,
  body = closingCta.body,
}: {
  headline?: string
  body?: string
}) {
  return (
    <Section tone="emphasis" className="tech-grid-bg overflow-hidden">
      <div
        aria-hidden="true"
        className="accent-glow pointer-events-none absolute -right-1/4 top-0 h-[32rem] w-[32rem] opacity-60"
      />

      <div className="relative grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          <Reveal from="none">
            <Eyebrow>{closingCta.label}</Eyebrow>
          </Reveal>

          <h2 className="mt-5 max-w-[30ch] text-[length:var(--text-h2)]">
            <MaskReveal>{headline}</MaskReveal>
          </h2>

          <Reveal delay={120}>
            <p className="mt-6 max-w-[56ch] text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
              {body}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton to={closingCta.primary.to} size="lg">
                {closingCta.primary.label}
                <ArrowIcon />
              </LinkButton>
              <LinkButton to={closingCta.secondary.to} variant="secondary" size="lg">
                {closingCta.secondary.label}
              </LinkButton>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} from="left">
          <div className="border-t border-line pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="label label-plain mb-5 text-content-subtle">Direct channels</p>
            <ul className="space-y-5">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    className="group block rounded-[var(--radius-sm)] focus-visible:outline-offset-4"
                  >
                    <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-content-subtle">
                      {channel.label}
                    </span>
                    <span className="mt-1 block font-display text-[1.125rem] text-content transition-colors group-hover:text-content-accent">
                      {channel.value}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] leading-snug text-content-muted">
                      {channel.description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
