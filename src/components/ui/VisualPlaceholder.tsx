import { cn } from '@/lib/cn'

/**
 * Designed placeholder for imagery that does not exist yet.
 *
 * Why this component exists: the source site ships no product screenshots (every
 * product's `screenshots` array is empty) and no case-study imagery beyond a
 * generic `placeholder.svg`. Rather than reference files that are not there, or
 * hotlink stock photography as a production strategy, each image slot renders
 * this: an original CSS/SVG visual that is clearly, visibly a placeholder and
 * names what belongs in it.
 *
 * It is `aria-hidden` and paired with visible text, so a screen reader is not
 * read a description of a picture that does not exist.
 */
export function VisualPlaceholder({
  label,
  caption,
  aspect = '16 / 10',
  className,
}: {
  /** What this slot is for, e.g. "SKYDOTERP dashboard". */
  label: string
  /** Optional second line explaining what is needed. */
  caption?: string
  aspect?: string
  className?: string
}) {
  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] border border-line',
        'bg-surface-sunken',
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {/* Technical field — pure CSS, no network request. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--line) 1px, transparent 1px),' +
            'linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)',
        }}
      />

      <figcaption className="absolute inset-0 flex flex-col justify-end gap-1.5 p-5 md:p-6">
        <span className="label label-plain text-content-subtle">Visual pending</span>
        <span className="font-display text-[1.0625rem] leading-snug text-content">{label}</span>
        {caption ? (
          <span className="max-w-[32ch] text-[0.8125rem] leading-relaxed text-content-muted">
            {caption}
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}
