/**
 * Skip link — the first thing in the tab order on every page.
 *
 * It is always in the DOM (never `display: none`, which removes it from the tab
 * order) and becomes visible on focus.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={
        'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 ' +
        'focus:z-[var(--z-skip-link)] focus:rounded-[var(--radius-sm)] ' +
        'focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium ' +
        'focus:text-accent-on focus:shadow-md'
      }
    >
      Skip to main content
    </a>
  )
}
