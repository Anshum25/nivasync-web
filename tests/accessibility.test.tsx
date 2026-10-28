import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute, renderWithRouter } from './helpers'
import { setReducedMotion } from './setup'
import { Reveal } from '@/components/motion/Reveal'
import { VisualPlaceholder } from '@/components/ui/VisualPlaceholder'

const PAGES = [
  '/',
  '/about',
  '/capabilities',
  '/products',
  '/products/itms',
  '/industries',
  '/brands',
  '/work',
  '/insights',
  '/careers',
  '/contact',
  '/privacy',
]

describe('landmarks and headings', () => {
  it.each(PAGES)('has one banner, main and contentinfo on %s', async (path) => {
    renderRoute(path)
    await screen.findByRole('heading', { level: 1 })

    expect(screen.getAllByRole('banner')).toHaveLength(1)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1)
  })

  it.each(PAGES)('starts the heading hierarchy at h1 and never skips to h4 on %s', async (path) => {
    renderRoute(path)
    await screen.findByRole('heading', { level: 1 })

    const levels = screen
      .getAllByRole('heading')
      .map((h) => Number(h.tagName.slice(1)))

    expect(levels[0]).toBe(1)
    // No heading may jump more than one level below its predecessor.
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
    }
  })
})

describe('links', () => {
  it.each(PAGES)('has no empty or placeholder links on %s', async (path) => {
    renderRoute(path)
    await screen.findByRole('heading', { level: 1 })

    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).not.toBe('#')
      // Every link needs a discernible name for screen readers.
      expect((link.textContent ?? '').trim().length).toBeGreaterThan(0)
    }
  })

  it('marks every external link with safe rel attributes', async () => {
    renderRoute('/brands')
    await screen.findByRole('heading', { level: 1 })

    const external = screen
      .getAllByRole('link')
      .filter((l) => (l.getAttribute('href') ?? '').startsWith('http'))

    expect(external.length).toBeGreaterThan(0)
    for (const link of external) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    }
  })
})

describe('description lists', () => {
  it.each(PAGES)('nests every dt/dd correctly on %s', async (path) => {
    renderRoute(path)
    await screen.findByRole('heading', { level: 1 })

    // HTML allows <dl> > dt|dd, or <dl> > div > dt|dd — but not a second
    // wrapper. Lighthouse flagged exactly this on the About page, where a
    // Reveal div wrapped another div around the dt/dd pairs.
    for (const item of document.querySelectorAll('dt, dd')) {
      const parent = item.parentElement as HTMLElement
      const ok =
        parent.tagName === 'DL' ||
        (parent.tagName === 'DIV' && parent.parentElement?.tagName === 'DL')
      expect(
        ok,
        `${item.tagName} on ${path} is nested too deeply inside its <dl>`,
      ).toBe(true)
    }

    for (const list of document.querySelectorAll('dl')) {
      for (const child of list.children) {
        expect(
          ['DT', 'DD', 'DIV', 'SCRIPT', 'TEMPLATE'].includes(child.tagName),
          `<dl> on ${path} has a disallowed child <${child.tagName.toLowerCase()}>`,
        ).toBe(true)
      }
    }
  })
})

describe('controls', () => {
  it.each(PAGES)('gives every button an accessible name on %s', async (path) => {
    renderRoute(path)
    await screen.findByRole('heading', { level: 1 })

    for (const button of screen.getAllByRole('button')) {
      const name =
        button.getAttribute('aria-label') ?? (button.textContent ?? '').trim()
      expect(name.length, `button in ${path} has no accessible name`).toBeGreaterThan(0)
    }
  })

  it('labels every form control on the contact page', async () => {
    renderRoute('/contact')
    await screen.findByRole('heading', { level: 1 })

    const form = document.querySelector('form') as HTMLFormElement
    const controls = form.querySelectorAll('input, textarea, select')

    for (const control of controls) {
      const id = control.getAttribute('id')
      expect(id).toBeTruthy()
      expect(form.querySelector(`label[for="${id}"]`)).toBeTruthy()
    }
  })

  it('exposes the theme toggle state', async () => {
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const toggle = screen.getByRole('button', { name: /switch to (light|dark) theme/i })
    expect(toggle).toHaveAttribute('aria-pressed')
  })
})

describe('reduced motion', () => {
  it('renders revealed content in its final state when reduced motion is requested', () => {
    setReducedMotion(true)
    const { container } = renderWithRouter(
      <Reveal from="up">
        <p>Visible content</p>
      </Reveal>,
    )

    const wrapper = container.firstElementChild as HTMLElement
    // No inline opacity/transform is applied at all — the element is simply
    // rendered, so content can never be stranded invisible.
    expect(wrapper.getAttribute('style')).toBeNull()
    expect(screen.getByText('Visible content')).toBeVisible()
    setReducedMotion(false)
  })

  it('still renders content when motion is enabled', () => {
    renderWithRouter(
      <Reveal from="up">
        <p>Animated content</p>
      </Reveal>,
    )
    expect(screen.getByText('Animated content')).toBeInTheDocument()
  })
})

describe('placeholder imagery', () => {
  it('is hidden from assistive technology but explained in visible text', () => {
    renderWithRouter(
      <VisualPlaceholder label="SKYDOTERP dashboard" caption="Awaiting a screenshot." />,
    )

    expect(screen.getByText('SKYDOTERP dashboard')).toBeInTheDocument()
    expect(screen.getByText(/visual pending/i)).toBeInTheDocument()
    // No <img> is emitted, so nothing references a file that does not exist.
    expect(document.querySelector('img')).toBeNull()
  })
})

describe('keyboard operation', () => {
  it('reaches the primary call to action by keyboard alone', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const header = screen.getByRole('banner')
    const cta = within(header).getByRole('link', { name: /start a conversation/i })

    cta.focus()
    expect(cta).toHaveFocus()
    expect(cta).toHaveAttribute('href', '/contact')

    await user.keyboard('{Enter}')
  })
})
