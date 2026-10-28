import { Reveal } from '@/components/motion/Reveal'
import { processSteps } from '@/data/narrative'

/**
 * The five-step engagement model, as a connected sequence.
 *
 * Laid out horizontally on wide screens and vertically on narrow ones, with the
 * connecting rule drawn in CSS. It is a plain ordered list underneath, so the
 * sequence is conveyed by the markup and not only by the graphic — and it reflows
 * on a phone instead of becoming a horizontal scroller nobody can operate.
 */
export function ProcessSteps() {
  return (
    <ol className="relative grid gap-y-8 md:grid-cols-5 md:gap-x-6">
      {/* Connecting rule — decorative, hidden from assistive tech. */}
      <div
        aria-hidden="true"
        className="absolute left-[0.6875rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-line md:left-0 md:top-[0.6875rem] md:block md:h-px md:w-full"
      />

      {processSteps.map((step, i) => (
        <Reveal key={step.number} delay={i * 110} as="li" className="relative">
          <span
            aria-hidden="true"
            className="relative z-10 mb-5 flex h-5.5 w-5.5 items-center justify-center"
          >
            <span className="h-3 w-3 rounded-full border-2 border-accent bg-surface" />
          </span>

          <span className="tnum block text-[0.75rem] font-semibold tracking-[0.1em] text-content-subtle">
            {step.number}
          </span>
          <h3 className="mt-1.5 text-[length:var(--text-h4)] font-medium text-content">
            {step.title}
          </h3>
          <p className="mt-2 max-w-[24ch] text-[0.9375rem] leading-relaxed text-content-muted">
            {step.description}
          </p>
        </Reveal>
      ))}
    </ol>
  )
}
