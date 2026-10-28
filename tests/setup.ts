import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup, configure } from '@testing-library/react'

/**
 * `findBy*` defaults to a 1 second timeout. Every test here mounts the whole
 * app and waits for a lazily-imported route chunk, so under parallel load one
 * second is not always enough — the symptom was tests that passed alone and
 * failed in a full run.
 */
configure({ asyncUtilTimeout: 8000 })

/**
 * jsdom implements neither IntersectionObserver nor matchMedia, and the app uses
 * both: the first for every scroll reveal, the second for reduced motion and
 * theme. They are stubbed here rather than mocked per-test so that components
 * under test behave the way they do in a browser.
 */

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  // Report every observed element as visible immediately, which is what the
  // reveal components expect once an element has scrolled into view.
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
      this,
    )
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

/** Defaults to "no preference" for every query; individual tests can override. */
function createMatchMedia(matches: boolean) {
  return (query: string): MediaQueryList =>
    ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: createMatchMedia(false),
})

/** Test helper: flip reduced-motion on for a single test. */
export function setReducedMotion(enabled: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) =>
      createMatchMedia(enabled && query.includes('prefers-reduced-motion'))(query),
  })
}

// jsdom has no layout, so scrollTo is absent.
window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()

afterEach(() => {
  cleanup()
  document.title = ''
})
