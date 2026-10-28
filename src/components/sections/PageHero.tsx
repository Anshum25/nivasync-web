import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'

/**
 * Shared hero for every inner page.
 *
 * One component rather than a bespoke hero per page: it keeps the vertical
 * rhythm, the heading level (always the page's single <h1>) and the breadcrumb
 * placement identical across 35 routes.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  aside,
  meta,
}: {
  eyebrow: string
  title: string
  lede?: string
  breadcrumbs?: Crumb[]
  /** Optional right-hand column, e.g. a key-facts panel. */
  aside?: ReactNode
  /** Optional inline metadata row under the lede. */
  meta?: ReactNode
}) {
  return (
    <section className="border-b border-line bg-surface-sunken pb-[var(--section-y-tight)] pt-12 md:pt-16">
      <Container>
        {breadcrumbs ? <Breadcrumbs trail={breadcrumbs} /> : null}

        <div className={aside ? 'grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16' : undefined}>
          <div className="max-w-[46rem]">
            <Reveal from="none">
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>

            <h1 className="mt-5 text-[length:var(--text-h1)] leading-[var(--leading-snug)]">
              <MaskReveal>{title}</MaskReveal>
            </h1>

            {lede ? (
              <Reveal delay={120}>
                <p className="mt-6 max-w-[58ch] text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                  {lede}
                </p>
              </Reveal>
            ) : null}

            {meta ? <Reveal delay={200}>{meta}</Reveal> : null}
          </div>

          {aside ? (
            <Reveal delay={160} from="left">
              {aside}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
