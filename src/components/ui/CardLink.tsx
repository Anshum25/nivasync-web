import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { ArrowIcon } from './Button'

/**
 * The site's editorial card.
 *
 * Deliberately not a bordered box: cards sit in a `hairline-grid`, so they are
 * separated by single-pixel rules and read as one composition rather than a row
 * of identical tiles. The whole card is one link, so the hit area is the card and
 * there is a single tab stop per item.
 */
export function CardLink({
  to,
  eyebrow,
  title,
  description,
  footer,
  className,
}: {
  to: string
  eyebrow?: string
  title: string
  description?: string
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group relative flex min-h-full flex-col p-6 md:p-8',
        'transition-colors duration-[var(--dur-base)] hover:bg-surface-sunken',
        className,
      )}
    >
      {eyebrow ? (
        <span className="label label-plain mb-5 text-content-subtle">{eyebrow}</span>
      ) : null}

      <h3 className="text-[length:var(--text-h4)] font-medium leading-snug text-content transition-colors group-hover:text-content-accent">
        {title}
      </h3>

      {description ? (
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-content-muted">
          {description}
        </p>
      ) : null}

      <span className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-content-subtle">
          {footer ?? 'Read more'}
        </span>
        <ArrowIcon className="text-content-accent transition-transform duration-[var(--dur-base)] group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

/** A compact tag used for features, technologies and industry chips. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-full)] border border-line bg-surface px-3 py-1 text-[0.8125rem] text-content-muted">
      {children}
    </span>
  )
}

/** Bulleted feature list with a consistent accent marker. */
export function FeatureList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={cn('grid gap-y-3', columns === 2 && 'sm:grid-cols-2 sm:gap-x-8')}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed">
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 text-accent"
            fill="currentColor"
          >
            <path d="M0 7h12.5L8 2.5 9.5 1 16 7.5 9.5 14 8 12.5 12.5 8H0V7Z" />
          </svg>
          <span className="text-content-muted">{item}</span>
        </li>
      ))}
    </ul>
  )
}
