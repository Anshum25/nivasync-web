import { useEffect, useState } from 'react'

/**
 * Live media-query state.
 *
 * Used by the motion primitives to decide whether a horizontal entrance is safe
 * at the current viewport width. It stays subscribed, so rotating a device or
 * resizing a window updates the answer rather than leaving a stale decision.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
