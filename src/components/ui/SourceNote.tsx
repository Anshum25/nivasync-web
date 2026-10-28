import { cn } from '@/lib/cn'
import type { SourceTag } from '@/types/content'

/**
 * Surfaces a content record's provenance in the UI.
 *
 * This component is how the "no invented facts presented as facts" rule becomes
 * visible to a visitor rather than just documented. `company-stated` figures are
 * labelled as the company's own claims; `illustrative` content is labelled as an
 * example. `verified` renders nothing — verified content needs no caveat.
 */
const copy: Partial<Record<SourceTag, string>> = {
  'company-stated': 'Company-stated figure',
  illustrative: 'Illustrative example',
  'pending-approval': 'Awaiting approval',
}

export function SourceNote({
  tag,
  className,
  detail,
}: {
  tag: SourceTag
  className?: string
  detail?: string
}) {
  const label = copy[tag]
  if (!label) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase',
        'tracking-[0.08em] text-content-subtle',
        className,
      )}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3" fill="currentColor">
        <path d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0Zm.75 9h-1.5V5.25h1.5V9Zm0-4.5h-1.5V3h1.5v1.5Z" />
      </svg>
      {label}
      {detail ? <span className="sr-only"> — {detail}</span> : null}
    </span>
  )
}

/**
 * Block-level variant for a whole section whose content carries a caveat, e.g.
 * the company-stated statistics row or the illustrative case-study notice.
 */
export function SourceCallout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-2.5 rounded-[var(--radius-md)] border border-line',
        'bg-surface-sunken px-4 py-3 text-[0.8125rem] leading-relaxed text-content-muted',
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-content-subtle"
        fill="currentColor"
      >
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.9 11h-1.8V7h1.8v5Zm0-6.2h-1.8V4h1.8v1.8Z" />
      </svg>
      <span>{children}</span>
    </p>
  )
}
