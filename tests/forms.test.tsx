import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderRoute } from './helpers'
import { buildMailto, createFormAdapter } from '@/lib/forms'
import { email, optionalPhone, required, sanitize, validate } from '@/lib/validation'

describe('validation rules', () => {
  it('rejects an empty required field', () => {
    expect(required('Your name')('')).toMatch(/required/i)
    expect(required('Your name')('   ')).toMatch(/required/i)
    expect(required('Your name')('Priya')).toBeNull()
  })

  it('validates email addresses', () => {
    expect(email('')).toMatch(/required/i)
    expect(email('not-an-email')).toMatch(/valid/i)
    expect(email('someone@example')).toMatch(/valid/i)
    expect(email('someone@example.com')).toBeNull()
  })

  it('treats phone as optional but validates it when present', () => {
    expect(optionalPhone('')).toBeNull()
    expect(optionalPhone('+91 97144 90600')).toBeNull()
    expect(optionalPhone('abc')).toMatch(/valid/i)
  })

  it('returns one error per field', () => {
    const errors = validate(
      { name: '', email: 'bad', message: '' },
      [
        { field: 'name', check: required('Your name') },
        { field: 'email', check: email },
        { field: 'message', check: required('Your message') },
      ],
    )
    expect(Object.keys(errors)).toEqual(['name', 'email', 'message'])
  })

  it('strips control characters and clamps length', () => {
    expect(sanitize('hello\u0000world')).toBe('helloworld')
    expect(sanitize('x'.repeat(10), 4)).toHaveLength(4)
  })
})

describe('form adapter', () => {
  it('falls back honestly when no endpoint is configured', async () => {
    const adapter = createFormAdapter()
    // No VITE_FORM_ENDPOINT is set in this build.
    expect(adapter.configured).toBe(false)

    const result = await adapter.submit({
      kind: 'project',
      name: 'Test',
      email: 'test@example.com',
      organisation: '',
      phone: '',
      message: 'Hello',
    })

    // The critical assertion of this whole project: never a false success.
    expect(result.status).toBe('fallback')
    expect(result.status).not.toBe('success')
    if (result.status === 'fallback') {
      expect(result.message).toMatch(/nothing was transmitted/i)
      expect(result.mailtoUrl).toMatch(/^mailto:hello@nivasync\.in/)
    }
  })

  it('builds a mailto carrying the submitted details', () => {
    const url = buildMailto({
      kind: 'corporate',
      name: 'Asha Patel',
      email: 'asha@example.com',
      organisation: 'Example Ltd',
      phone: '+91 90000 00000',
      message: 'We would like to discuss an ERP rollout.',
    })
    expect(url).toContain('mailto:hello@nivasync.in')
    expect(decodeURIComponent(url)).toContain('Asha Patel')
    expect(decodeURIComponent(url)).toContain('ERP rollout')
  })
})

describe('contact form behaviour', () => {
  it('shows accessible errors and does not submit when invalid', async () => {
    const user = userEvent.setup()
    renderRoute('/contact')
    await screen.findByRole('heading', { level: 1 })

    await user.click(screen.getByRole('button', { name: /send project enquiry/i }))

    const nameError = await screen.findByText(/your name is required/i)
    expect(nameError).toBeInTheDocument()

    const nameInput = screen.getByLabelText(/your name/i)
    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    expect(nameInput).toHaveAttribute('aria-describedby', expect.stringContaining('error'))

    // Focus is moved to the first invalid control.
    expect(nameInput).toHaveFocus()

    // Nothing was "sent".
    expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument()
  })

  it('reports the fallback state rather than a fake success', async () => {
    const user = userEvent.setup()
    renderRoute('/contact')
    await screen.findByRole('heading', { level: 1 })

    await user.type(screen.getByLabelText(/your name/i), 'Asha Patel')
    await user.type(screen.getByLabelText(/email address/i), 'asha@example.com')
    await user.type(
      screen.getByLabelText(/about the project/i),
      'We run three disconnected systems and need them consolidated.',
    )

    await user.click(screen.getByRole('button', { name: /send project enquiry/i }))

    const status = await screen.findByRole('status')
    expect(within(status).getByText(/not sent/i)).toBeInTheDocument()
    expect(screen.queryByText(/^message sent$/i)).not.toBeInTheDocument()

    // The fallback offers a real mailto, not a dead button.
    const mailto = within(status).getByRole('link', { name: /open email/i })
    expect(mailto).toHaveAttribute('href', expect.stringContaining('mailto:hello@nivasync.in'))
  })

  it('states the integration status on the page', async () => {
    renderRoute('/contact')
    await screen.findByRole('heading', { level: 1 })
    expect(
      screen.getByText(/no form delivery backend is configured/i),
    ).toBeInTheDocument()
  })

  it('switches enquiry type with arrow keys', async () => {
    const user = userEvent.setup()
    renderRoute('/contact')
    await screen.findByRole('heading', { level: 1 })

    const projectTab = screen.getByRole('tab', { name: /project & sales/i })
    expect(projectTab).toHaveAttribute('aria-selected', 'true')

    projectTab.focus()
    await user.keyboard('{ArrowRight}')

    await waitFor(() =>
      expect(screen.getByRole('tab', { name: /corporate enquiry/i })).toHaveAttribute(
        'aria-selected',
        'true',
      ),
    )
  })

  it('exposes a honeypot that is hidden from assistive technology', async () => {
    renderRoute('/contact')
    await screen.findByRole('heading', { level: 1 })

    const honeypot = document.getElementById('company-website-hp') as HTMLInputElement
    expect(honeypot).toBeTruthy()
    expect(honeypot.tabIndex).toBe(-1)
    expect(honeypot.closest('[aria-hidden="true"]')).toBeTruthy()
  })
})

describe('careers application form', () => {
  it('renders a working application pathway with no invented vacancies', async () => {
    renderRoute('/careers')
    await screen.findByRole('heading', { level: 1 })

    expect(screen.getByText(/no advertised vacancies/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send enquiry/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
  })
})
