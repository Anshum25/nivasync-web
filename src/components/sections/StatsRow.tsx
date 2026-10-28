import { Reveal } from '@/components/motion/Reveal'
import { SourceCallout } from '@/components/ui/SourceNote'
import { companyStats, verifiedFacts } from '@/data/company'

/**
 * Two kinds of number, shown differently on purpose.
 *
 * `verifiedFacts` are counts derived from this repository's own content data — 30
 * named deployment sites, 12 industries, 7 platforms. They are checkable by
 * clicking through, so they lead.
 *
 * `companyStats` are the company's own published claims (300+ clients, 500+
 * projects). They are genuine first-party statements but nobody outside the
 * company can audit them, so they appear second and are explicitly attributed as
 * company-stated rather than dressed up as measured results.
 *
 * Neither set animates a counting-up effect. A number ticking from zero implies
 * a live measurement, which these are not.
 */
export function StatsRow() {
  return (
    <div>
      <dl className="hairline-grid grid sm:grid-cols-3">
        {verifiedFacts.map((fact, i) => (
          // DOM order is dt → dd (valid), visual order is reversed with flex
          // `order` so the figure reads first without breaking the markup.
          <Reveal key={fact.label} delay={i * 90} className="flex flex-col p-6 md:p-8">
            <dt className="order-2 mt-2 text-[0.9375rem] font-medium text-content">
              {fact.label}
            </dt>
            <dd className="tnum order-1 font-display text-[clamp(2.5rem,1.8rem+2.4vw,3.75rem)] leading-none text-content-accent">
              {fact.value}
            </dd>
            <dd className="order-3 mt-3 text-[0.8125rem] leading-relaxed text-content-muted">
              {fact.detail}
            </dd>
          </Reveal>
        ))}
      </dl>

      <div className="mt-10">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
          {companyStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className="flex flex-col">
              <dt className="order-2 mt-2 text-[0.8125rem] leading-snug text-content-muted">
                {stat.label}
              </dt>
              <dd className="tnum order-1 font-display text-[1.875rem] leading-none text-content">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>

        <SourceCallout className="mt-7">
          The four figures above are our own published company figures rather than
          independently audited metrics. The three counts above them can be verified by
          browsing this site.
        </SourceCallout>
      </div>
    </div>
  )
}
