import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/navigation/Header'
import { Footer } from './Footer'
import { SkipLink } from './SkipLink'
import { ScrollManager } from './ScrollManager'
import { ErrorBoundary } from './ErrorBoundary'
import { RouteFallback } from './RouteFallback'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Dismisses the pre-React boot screen once the app has mounted.
 *
 * The boot screen also removes itself via a CSS animation, so this is belt and
 * braces — but it matters for the case where React mounts faster than the CSS
 * timeline, which is the common case on a warm cache.
 */
function useDismissBootScreen() {
  useEffect(() => {
    const boot = document.getElementById('boot')
    if (!boot) return
    const remove = () => boot.remove()
    // Let the fade finish if it is already running; otherwise remove now.
    const style = window.getComputedStyle(boot)
    if (style.animationName === 'none') {
      remove()
      return
    }
    boot.addEventListener('animationend', remove, { once: true })
    // Hard ceiling: never let the boot screen outlive the page by more than a
    // second, whatever happens to the animation events.
    const timer = window.setTimeout(remove, 1200)
    return () => window.clearTimeout(timer)
  }, [])
}

export function Layout() {
  const { pathname } = useLocation()
  const reduced = usePrefersReducedMotion()
  useDismissBootScreen()

  return (
    <>
      <SkipLink />
      <ScrollManager />
      <Header />

      {/*
        Page transition is enter-only: a short opacity/translate settle keyed on
        the pathname. There is deliberately no exit animation, because delaying
        unmount makes browser back/forward feel broken and can strand focus on a
        page that is leaving.
      */}
      <main
        id="main"
        key={reduced ? 'static' : pathname}
        className="pt-16 md:pt-20"
        style={
          reduced
            ? undefined
            : { animation: 'page-enter 420ms var(--ease-out-expo) both' }
        }
      >
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </>
  )
}
