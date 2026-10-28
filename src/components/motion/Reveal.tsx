import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useInView } from '@/hooks/useInView'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offsets: Record<Direction, string> = {
  up: 'translate3d(0, 1.5rem, 0)',
  down: 'translate3d(0, -1.5rem, 0)',
  left: 'translate3d(1.5rem, 0, 0)',
  right: 'translate3d(-1.5rem, 0, 0)',
  none: 'none',
}

interface RevealProps {
  children: ReactNode
  /** Direction the element travels FROM. */
  from?: Direction
  /** Stagger offset in ms, for sequencing siblings. */
  delay?: number
  duration?: number
  as?: ElementType
  className?: string
}

/**
 * The site's scroll-entrance primitive.
 *
 * Implementation notes, all deliberate:
 *  - Animates `opacity` and `transform` only — both compositor properties, so a
 *    reveal never triggers layout or paint.
 *  - Visibility comes from the shared `useInView` IntersectionObserver hook. No
 *    scroll listener is attached anywhere in this app for reveals.
 *  - Under `prefers-reduced-motion` the element renders in its final state with
 *    no transition at all. Content is never hidden waiting for motion.
 *  - `will-change` is NOT set permanently; it is applied only while the element
 *    is still pending, so hundreds of revealed nodes do not each hold a
 *    compositor layer for the life of the page.
 */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  duration = 720,
  as: Tag = 'div',
  className,
}: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const wide = useMediaQuery('(min-width: 64rem)')
  const { ref, inView } = useInView<HTMLDivElement>()

  if (reduced) {
    return <Tag className={className}>{children}</Tag>
  }

  /**
   * Horizontal entrances only on wide viewports.
   *
   * A `left`/`right` reveal offsets the element by 1.5rem along X while it waits
   * to come into view. In a stacked mobile layout that pushes full-width content
   * past the viewport edge and creates horizontal overflow — the exact bug the
   * brief rules out. The layouts that use horizontal reveals are two-column and
   * stacked below 64rem anyway, so a vertical entrance is the right motion there.
   */
  const direction: Direction =
    !wide && (from === 'left' || from === 'right') ? 'up' : from

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : offsets[direction],
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'var(--ease-out-expo)',
    transitionDelay: `${delay}ms`,
    willChange: inView ? undefined : 'opacity, transform',
  }

  return (
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Sequences its children with a fixed step, so a grid of cards reveals
 * progressively without each call site hand-computing delays.
 */
export function RevealGroup({
  children,
  step = 90,
  from = 'up',
  className,
  as: Tag = 'div',
}: {
  children: ReactNode[]
  step?: number
  from?: Direction
  className?: string
  as?: ElementType
}) {
  return (
    <Tag className={className}>
      {children.map((child, i) => (
        <Reveal key={i} from={from} delay={i * step}>
          {child}
        </Reveal>
      ))}
    </Tag>
  )
}

/**
 * Heading reveal: the line slides up behind a clipping mask rather than fading.
 * Used sparingly — section headlines only, never body copy.
 */
export function MaskReveal({
  children,
  delay = 0,
  className,
  as: Tag = 'span',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: ElementType
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 })

  if (reduced) return <Tag className={className}>{children}</Tag>

  return (
    <span ref={ref} className={cn('block overflow-hidden', className)}>
      <Tag
        className="block"
        style={{
          transform: inView ? 'translateY(0)' : 'translateY(105%)',
          transition: `transform 900ms var(--ease-out-expo) ${delay}ms`,
        }}
      >
        {children}
      </Tag>
    </span>
  )
}
