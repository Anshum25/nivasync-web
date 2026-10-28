import { useEffect, useRef, useState } from 'react'

interface Options {
  /** Fraction of the element that must be visible. */
  threshold?: number
  /** Trigger slightly before the element reaches the viewport edge. */
  rootMargin?: string
  /** Keep the revealed state once seen — reveals should not replay on scroll-up. */
  once?: boolean
}

/**
 * The single scroll-observation mechanism in this application.
 *
 * Every scroll-triggered reveal goes through this hook, which means:
 *  - there is exactly one IntersectionObserver pattern in the codebase,
 *  - no `scroll` event listener is attached for reveals at all (no layout
 *    thrashing, no rAF throttling to get wrong),
 *  - and no second animation library is competing for the same elements.
 *
 * If `IntersectionObserver` is unavailable, the element reports visible
 * immediately, so content is never hidden behind a missing browser API.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: Options = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
