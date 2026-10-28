import { Container } from '@/components/ui/Container'

/**
 * Shown while a lazily-imported route chunk is in flight.
 *
 * It is deliberately a quiet, fixed-height block rather than a spinner or a fake
 * progress bar: on a normal connection the chunk arrives in well under the time
 * a spinner takes to become meaningful, and a flashing spinner on every
 * navigation reads as slower than nothing at all. The live region announces the
 * state for screen-reader users.
 */
export function RouteFallback() {
  return (
    <Container className="py-[var(--section-y)]">
      {/*
        A tall placeholder on purpose: if the fallback is much shorter than the
        page that replaces it, the footer visibly jumps when the chunk arrives.
      */}
      <div role="status" aria-live="polite" className="min-h-screen">
        <span className="sr-only">Loading page…</span>
        <div aria-hidden="true" className="max-w-2xl space-y-4 opacity-40">
          <div className="h-3 w-24 rounded-full bg-line-strong" />
          <div className="h-9 w-full rounded-[var(--radius-sm)] bg-line" />
          <div className="h-9 w-4/5 rounded-[var(--radius-sm)] bg-line" />
          <div className="h-4 w-2/3 rounded-full bg-line" />
        </div>
      </div>
    </Container>
  )
}
