import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * The small tracked-out caps label that opens most sections.
 *
 * Rendered as a <p>, not a heading: it is a kicker, and putting it in the heading
 * hierarchy would break the document outline that screen readers rely on.
 */
export function Eyebrow({
  children,
  plain = false,
  className,
}: {
  children: ReactNode
  /** Drops the leading accent rule. */
  plain?: boolean
  className?: string
}) {
  return <p className={cn('label', plain && 'label-plain', className)}>{children}</p>
}
