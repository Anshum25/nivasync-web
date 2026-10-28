import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { ArrowIcon } from '@/components/ui/Button'
import { legalNav, navCta, primaryNav } from '@/data/navigation'
import { contactChannels } from '@/data/company'

/**
 * Mobile navigation.
 *
 * Behaviour that makes this usable rather than decorative:
 *  - The trigger is a 44px button with `aria-expanded` and `aria-controls`.
 *  - The panel is a `role="dialog" aria-modal="true"`: focus moves into it on
 *    open, is trapped inside while open, and returns to the trigger on close.
 *  - Escape closes it. So does tapping a link, because the route change in
 *    Header's effect closes it.
 *  - Body scroll is locked while open, and the lock is removed on unmount — a
 *    leaked lock is the classic mobile-menu bug.
 *  - Groups are real <button> disclosures, so sub-navigation works by tap AND by
 *    keyboard. Nothing depends on hover, which does not exist here.
 *  - Under reduced motion the panel appears without the slide transition.
 */
export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  /** Tracks whether the panel was open on the previous run of the focus effect. */
  const wasOpen = useRef(false)
  // Lock body scroll while the panel is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Move focus in on open, and keep Tab inside the panel.
  useEffect(() => {
    if (!open) {
      // Return focus to the trigger ONLY when the panel is actually closing.
      // Without this guard the effect also runs on first mount and yanks focus
      // to the hamburger button the moment the page loads, which breaks the
      // skip link and drops a keyboard user into the middle of the header.
      if (wasOpen.current) triggerRef.current?.focus()
      wasOpen.current = false
      return
    }
    wasOpen.current = true

    const panel = panelRef.current
    if (!panel) return

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null)

    focusables()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener('keydown', onKeyDown)
    return () => panel.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => onOpenChange(!open)}
        className={cn(
          'inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)]',
          'text-content transition-colors hover:bg-surface-sunken lg:hidden',
        )}
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={cn(
              'absolute left-0 h-[1.5px] w-full bg-current transition-all duration-[var(--dur-base)]',
              open ? 'top-1.5 rotate-45' : 'top-0',
            )}
          />
          <span
            className={cn(
              'absolute left-0 top-1.5 h-[1.5px] w-full bg-current transition-opacity duration-[var(--dur-fast)]',
              open && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'absolute left-0 h-[1.5px] w-full bg-current transition-all duration-[var(--dur-base)]',
              open ? 'top-1.5 -rotate-45' : 'top-3',
            )}
          />
        </span>
      </button>

      {/*
        The panel is PORTALLED TO <body>, not rendered inside the header.

        The header uses `backdrop-filter` for its translucent blur, and an
        element with a backdrop-filter becomes the containing block for any
        `position: fixed` descendant. Rendered in place, the panel would be
        positioned against the 64px-tall header instead of the viewport, so
        `top-16 bottom-0` collapsed it to a thin strip. The portal also keeps the
        dialog out of the header's stacking context.

        It enters with a CSS keyframe and closes instantly. An exit animation
        would mean keeping an unmounted dialog in the DOM, and the animation
        library that used to drive it cost 42 kB gzipped on every page load for
        this one transition. The keyframe is neutralised by the global
        reduced-motion rule in index.css.
      */}
      {open &&
        createPortal(
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={cn(
            'fixed inset-x-0 top-16 bottom-0 z-[var(--z-overlay)] overflow-y-auto',
            'border-t border-line bg-surface px-[var(--gutter)] py-6 lg:hidden',
            'motion-safe:animate-[mobile-nav-in_280ms_var(--ease-out-expo)_both]',
          )}
        >
            <nav aria-label="Primary mobile">
              <ul className="divide-y divide-line">
                {primaryNav.map((item) => {
                  const hasMenu = Boolean(item.groups?.length)
                  const isExpanded = expanded === item.label

                  return (
                    <li key={item.label} className="py-1">
                      <div className="flex items-center">
                        <Link
                          to={item.to}
                          onClick={() => onOpenChange(false)}
                          className="flex-1 py-3 font-display text-[1.25rem] text-content"
                        >
                          {item.label}
                        </Link>
                        {hasMenu && (
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={`mobile-group-${item.label.toLowerCase()}`}
                            aria-label={`${isExpanded ? 'Hide' : 'Show'} ${item.label} sections`}
                            onClick={() => setExpanded(isExpanded ? null : item.label)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-content-muted hover:bg-surface-sunken"
                          >
                            <svg
                              viewBox="0 0 14 14"
                              aria-hidden="true"
                              className={cn(
                                'h-3.5 w-3.5 transition-transform duration-[var(--dur-base)]',
                                isExpanded && 'rotate-180',
                              )}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path d="M3 5.5L7 9.5l4-4" strokeLinecap="round" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {hasMenu && isExpanded && (
                        <div
                          id={`mobile-group-${item.label.toLowerCase()}`}
                          className="pb-4 pl-1"
                        >
                          {item.groups?.map((group) => (
                            <div key={group.title} className="mb-4 last:mb-0">
                              <p className="label label-plain mb-2">{group.title}</p>
                              <ul>
                                {group.links.map((link) => (
                                  <li key={link.to}>
                                    <Link
                                      to={link.to}
                                      onClick={() => onOpenChange(false)}
                                      className="block py-2.5 text-[0.9375rem] text-content-muted"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="mt-8 border-t border-line pt-6">
              <Link
                to={navCta.to}
                onClick={() => onOpenChange(false)}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-3 font-medium text-accent-on"
              >
                {navCta.label}
                <ArrowIcon />
              </Link>

              <ul className="mt-6 space-y-2">
                {contactChannels.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      className="flex items-baseline gap-2 py-1.5 text-[0.9375rem] text-content-muted"
                    >
                      <span className="text-content-subtle">{channel.label}</span>
                      <span className="text-content">{channel.value}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {legalNav.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => onOpenChange(false)}
                      className="text-[0.8125rem] text-content-subtle"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
