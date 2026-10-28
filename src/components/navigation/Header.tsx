import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { NivaSyncLogo } from '@/components/brand/NivaSyncLogo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { LinkButton, ArrowIcon } from '@/components/ui/Button'
import { MobileNav } from './MobileNav'
import { navCta, primaryNav } from '@/data/navigation'

/**
 * Site header.
 *
 * Accessibility decisions, all deliberate:
 *  - Each menu is a DISCLOSURE (button + panel) with `aria-expanded` and
 *    `aria-controls`, not a fake `role="menu"`. Menu roles imply application
 *    keyboard semantics this navigation does not have.
 *  - Pointer hover opens a panel as a convenience, but the button is fully
 *    operable by keyboard: Enter/Space toggles, Escape closes and returns focus,
 *    and Tab out of the panel closes it.
 *  - The parent item's own route is reachable: the panel repeats it as its first
 *    link and as the overview link, so the top-level destination is never lost
 *    behind a hover-only menu (the classic mega-menu trap on touch devices).
 *  - On touch devices there is no hover, so the first tap opens the panel rather
 *    than navigating — which is why the overview link exists.
 *
 * Scroll behaviour uses one passive listener that only writes component state;
 * it reads `window.scrollY` and nothing from the layout, so it cannot thrash.
 */
export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  /**
   * Whether the currently open panel was opened by hover rather than by an
   * explicit click. Without this, a pointer user who hovers a trigger (opening
   * the panel) and then clicks it sees the panel close instantly, because the
   * click handler reads an already-open state and toggles it shut.
   */
  const openedByHover = useRef(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Any navigation closes everything. Without this, a menu stays open over the
  // new page after a client-side route change.
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (openMenu) {
        setOpenMenu(null)
        // Return focus to the trigger that opened the panel.
        navRef.current
          ?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${openMenu}"]`)
          ?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openMenu])

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  // Small grace period so moving the pointer from trigger to panel across the
  // gap does not snap the panel shut.
  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140)
  }, [cancelClose])

  useEffect(() => cancelClose, [cancelClose])

  const active = primaryNav.find((item) => item.label === openMenu)

  return (
    <header
      ref={navRef}
      role="banner"
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-header)] transition-[background-color,border-color,box-shadow]',
        'duration-[var(--dur-base)] ease-[var(--ease-out-quint)]',
        scrolled || openMenu
          ? 'border-b border-line bg-surface/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-surface/60 backdrop-blur-md',
      )}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex h-16 w-full max-w-[var(--container-max)] items-center gap-2 px-[var(--gutter)] md:h-20">
        <Link
          to="/"
          className="mr-2 shrink-0 rounded-[var(--radius-sm)] transition-opacity hover:opacity-80"
        >
          <NivaSyncLogo />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) => {
              const hasMenu = Boolean(item.groups?.length)
              const isOpen = openMenu === item.label

              if (!hasMenu) {
                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'inline-flex h-11 items-center rounded-[var(--radius-sm)] px-3.5',
                          'text-[0.9375rem] transition-colors duration-[var(--dur-fast)]',
                          isActive
                            ? 'text-content-accent'
                            : 'text-content-muted hover:text-content',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              }

              return (
                <li
                  key={item.label}
                  onMouseEnter={() => {
                    cancelClose()
                    if (openMenu !== item.label) openedByHover.current = true
                    setOpenMenu(item.label)
                  }}
                >
                  <button
                    type="button"
                    data-menu-trigger={item.label}
                    aria-expanded={isOpen}
                    aria-controls={`menu-${item.label.toLowerCase()}`}
                    onClick={() => {
                      // A click on a panel that hover just opened confirms it
                      // rather than closing it; a second click then closes.
                      if (isOpen && openedByHover.current) {
                        openedByHover.current = false
                        return
                      }
                      openedByHover.current = false
                      setOpenMenu(isOpen ? null : item.label)
                    }}
                    className={cn(
                      'inline-flex h-11 items-center gap-1.5 rounded-[var(--radius-sm)] px-3.5',
                      'text-[0.9375rem] transition-colors duration-[var(--dur-fast)]',
                      isOpen || location.pathname.startsWith(item.to)
                        ? 'text-content-accent'
                        : 'text-content-muted hover:text-content',
                    )}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className={cn(
                        'h-3 w-3 transition-transform duration-[var(--dur-base)]',
                        isOpen && 'rotate-180',
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-3">
          <ThemeToggle />
          {/*
            The wrapper does the hiding, not a `hidden` class on the button.
            LinkButton's base class list already contains `inline-flex`, and both
            are unprefixed display utilities — so which one wins depends on
            stylesheet order, not on the order they are written here. Putting the
            responsive rule on a wrapper removes the ambiguity entirely.
          */}
          <span className="hidden sm:block">
            <LinkButton to={navCta.to} size="md">
              {navCta.label}
              <ArrowIcon />
            </LinkButton>
          </span>
          <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>
      </div>

      {/* Mega-menu panel. One panel element, contents swapped — so there is a
          single place where focus and keyboard behaviour are handled. */}
      {active?.groups && (
        <div
          id={`menu-${active.label.toLowerCase()}`}
          className="hidden border-t border-line bg-surface/95 backdrop-blur-xl lg:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter)] py-8">
            <div
              className={cn(
                'grid gap-x-10 gap-y-8',
                active.groups.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2',
              )}
            >
              {active.groups.map((group) => (
                <div key={group.title}>
                  <p className="label label-plain mb-4">{group.title}</p>
                  <ul className="space-y-0.5">
                    {group.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className={cn(
                            'group block rounded-[var(--radius-sm)] px-3 py-2.5 -mx-3',
                            'transition-colors duration-[var(--dur-fast)] hover:bg-surface-sunken',
                          )}
                        >
                          <span className="block text-[0.9375rem] font-medium text-content group-hover:text-content-accent">
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="mt-0.5 block text-[0.8125rem] leading-snug text-content-muted">
                              {link.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {active.overviewLabel && (
              <div className="mt-7 border-t border-line pt-5">
                <Link
                  to={active.to}
                  className="link-underline inline-flex items-center gap-2 text-[0.9375rem] font-medium text-content-accent"
                >
                  {active.overviewLabel}
                  <ArrowIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
