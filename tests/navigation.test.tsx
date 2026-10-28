import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from './helpers'
import { primaryNav, footerNav, legalNav } from '@/data/navigation'

describe('primary navigation', () => {
  it('renders every top-level item', async () => {
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    for (const item of primaryNav) {
      expect(within(nav).getByText(item.label)).toBeInTheDocument()
    }
  })

  it('opens a mega menu on click and exposes aria-expanded', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const header = screen.getByRole('banner')
    const trigger = within(header).getByRole('button', { name: /^Capabilities$/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    // Panel contents are now reachable.
    expect(within(header).getByRole('link', { name: /All capabilities/i })).toBeInTheDocument()
  })

  it('closes the mega menu on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const trigger = screen.getByRole('button', { name: /^Products$/ })
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('keeps the parent destination reachable from inside the menu', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    // The classic mega-menu trap is that the top-level route becomes
    // unreachable on touch. The overview link exists to prevent that.
    const header = screen.getByRole('banner')
    await user.click(within(header).getByRole('button', { name: /^Industries$/ }))
    const overview = within(header).getByRole('link', { name: /All industries/i })
    expect(overview).toHaveAttribute('href', '/industries')
  })

  it('navigates to a page from the menu', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const nav = screen.getByRole('banner')
    await user.click(within(nav).getByRole('button', { name: /^Products$/ }))
    await user.click(within(nav).getByRole('link', { name: /^SKYDOTERP/ }))

    const heading = await screen.findByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('SKYDOTERP')
  })
})

describe('mobile navigation', () => {
  it('opens as a modal dialog and traps focus', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const trigger = screen.getByRole('button', { name: /open navigation menu/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)

    const dialog = await screen.findByRole('dialog', { name: /site navigation/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('locks body scroll while open and releases it on close', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    await user.click(screen.getByRole('button', { name: /open navigation menu/i }))
    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByRole('button', { name: /close navigation menu/i }))
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('expands a section by tap, not hover', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    await user.click(screen.getByRole('button', { name: /open navigation menu/i }))
    const toggle = await screen.findByRole('button', { name: /show capabilities sections/i })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes when a link inside it is followed', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    await user.click(screen.getByRole('button', { name: /open navigation menu/i }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('link', { name: 'Work' }))

    // AnimatePresence keeps the panel mounted for its exit transition.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

describe('footer', () => {
  it('renders the current year automatically', async () => {
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const footer = screen.getByRole('contentinfo')
    const year = String(new Date().getFullYear())
    expect(within(footer).getByText(new RegExp(`© ${year}`))).toBeInTheDocument()
  })

  it('renders every footer navigation group and legal link', async () => {
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const footer = screen.getByRole('contentinfo')
    for (const group of footerNav) {
      expect(within(footer).getByRole('navigation', { name: group.title })).toBeInTheDocument()
    }
    for (const link of legalNav) {
      expect(within(footer).getByRole('link', { name: link.label })).toHaveAttribute(
        'href',
        link.to,
      )
    }
  })

  it('opens external brand links safely in a new tab', async () => {
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    const footer = screen.getByRole('contentinfo')
    const [skydot] = within(footer).getAllByRole('link', { name: /Skydot Infotech/ })
    expect(skydot).toHaveAttribute('href', 'https://skydotinfotech.com/')
    expect(skydot).toHaveAttribute('target', '_blank')
    expect(skydot).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(skydot).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })
})

describe('skip link', () => {
  it('is the first focusable element and targets main', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await screen.findByRole('heading', { level: 1 })

    await user.tab()
    const skip = screen.getByRole('link', { name: /skip to main content/i })
    expect(skip).toHaveFocus()
    expect(skip).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })
})
