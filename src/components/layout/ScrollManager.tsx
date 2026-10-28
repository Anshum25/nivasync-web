import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Scroll behaviour on client navigation.
 *
 * A single-page app does not reset scroll by itself, so a new page would open
 * half-way down. This restores the top on a push navigation, and — importantly —
 * leaves POP navigations (browser back/forward) alone so the browser's own scroll
 * restoration keeps working. Hash links are also left alone so in-page anchors
 * behave normally.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
        return
      }
    }

    // `key === 'default'` is the first render; the browser handles that one.
    if (key === 'default') return

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash, key, reduced])

  return null
}
