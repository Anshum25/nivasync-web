import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

interface SectionProps {
  children: ReactNode
  /**
   * `emphasis` renders the secondary band used for hero, CTA, footer and
   * feature sections. It follows the theme — a soft brand tint in light mode,
   * a raised ink panel in dark mode — rather than inverting it.
   */
  tone?: 'default' | 'sunken' | 'emphasis'
  /** Vertical rhythm. `tight` for secondary sections. */
  spacing?: 'default' | 'tight' | 'none'
  width?: 'default' | 'narrow' | 'prose' | 'full'
  /** Hairline above the section — the site's main structural separator. */
  divided?: boolean
  id?: string
  className?: string
  containerClassName?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

const tones = {
  default: 'bg-surface text-content',
  sunken: 'bg-surface-sunken text-content',
  emphasis: 'band-emphasis',
}

const spacings = {
  default: 'py-[var(--section-y)]',
  tight: 'py-[var(--section-y-tight)]',
  none: '',
}

export function Section({
  children,
  tone = 'default',
  spacing = 'default',
  width = 'default',
  divided = false,
  id,
  className,
  containerClassName,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative',
        tones[tone],
        spacings[spacing],
        divided && 'border-t border-line',
        className,
      )}
      {...aria}
    >
      <Container width={width} className={containerClassName}>
        {children}
      </Container>
    </section>
  )
}
