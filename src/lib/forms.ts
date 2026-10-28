import { sanitize } from './validation'

/**
 * Form submission layer.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * HONEST INTEGRATION STATUS: no backend is configured in this build.
 *
 * There is no server, no CRM credential and no form-service account. So this
 * module does exactly two things and claims nothing else:
 *
 *   1. If `VITE_FORM_ENDPOINT` is set at build time, it POSTs the submission
 *      there and reports success ONLY on a 2xx response.
 *   2. If it is not set, it reports `fallback` — never `success` — and the UI
 *      offers a pre-filled email instead, described to the visitor as a fallback.
 *
 * A "message sent" state is never shown unless an endpoint actually accepted the
 * submission. See docs/DEPLOYMENT.md §"Contact form configuration".
 *
 * Note on VITE_ variables: anything prefixed `VITE_` is inlined into the client
 * bundle and is therefore PUBLIC. Only a public endpoint URL belongs here. API
 * keys, SMTP credentials and CRM tokens must live in a server-side function or
 * in the form provider's own account — never in this variable.
 * ──────────────────────────────────────────────────────────────────────────────
 */

export type InquiryKind = 'corporate' | 'project'

export interface InquiryPayload {
  kind: InquiryKind
  name: string
  email: string
  organisation: string
  phone: string
  /** Project inquiries only. */
  interest?: string
  message: string
  /** Honeypot — a real person leaves this empty. */
  trap?: string
}

export type SubmitResult =
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }
  | { status: 'fallback'; message: string; mailtoUrl: string }

export interface FormAdapter {
  readonly id: string
  /** True when a real destination is configured and submissions can be delivered. */
  readonly configured: boolean
  submit(payload: InquiryPayload): Promise<SubmitResult>
}

const SUBJECTS: Record<InquiryKind, string> = {
  corporate: 'Corporate enquiry via nivasync.in',
  project: 'Project enquiry via nivasync.in',
}

export function buildMailto(payload: InquiryPayload, to = 'hello@nivasync.in'): string {
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.organisation ? `Organisation: ${payload.organisation}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.interest ? `Area of interest: ${payload.interest}` : null,
    '',
    payload.message,
  ].filter((l): l is string => l !== null)

  // Percent-encoding, not URLSearchParams: the latter uses form encoding, which
  // turns every space into a `+`. Mail clients render those literally, so the
  // recipient would receive "Asha+Patel" instead of a name.
  const subject = encodeURIComponent(SUBJECTS[payload.kind])
  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:${to}?subject=${subject}&body=${body}`
}

/** Used when no endpoint is configured. Reports `fallback`, never `success`. */
class MailtoFallbackAdapter implements FormAdapter {
  readonly id = 'mailto-fallback'
  readonly configured = false

  async submit(payload: InquiryPayload): Promise<SubmitResult> {
    return {
      status: 'fallback',
      message:
        'This site has no form backend configured yet, so nothing was transmitted. ' +
        'Use the button below to send the same details by email instead.',
      mailtoUrl: buildMailto(payload),
    }
  }
}

/**
 * Generic HTTP adapter. Works with any endpoint that accepts a JSON POST and
 * answers 2xx — a serverless function, Formspree, Web3Forms, a CRM webhook.
 * Spam protection is the endpoint's responsibility; a honeypot field is sent
 * along so a provider that supports one can use it.
 */
class HttpEndpointAdapter implements FormAdapter {
  readonly id = 'http-endpoint'
  readonly configured = true
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async submit(payload: InquiryPayload): Promise<SubmitResult> {
    // Reject honeypot submissions locally rather than forwarding them.
    if (payload.trap && payload.trap.trim().length > 0) {
      return { status: 'error', message: 'Submission rejected.' }
    }

    const body = {
      kind: payload.kind,
      name: sanitize(payload.name, 120),
      email: sanitize(payload.email, 160),
      organisation: sanitize(payload.organisation, 160),
      phone: sanitize(payload.phone, 40),
      interest: payload.interest ? sanitize(payload.interest, 80) : undefined,
      message: sanitize(payload.message, 5000),
      subject: SUBJECTS[payload.kind],
      submittedAt: new Date().toISOString(),
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (response.ok) {
        return {
          status: 'success',
          message: 'Thank you — your message has been sent. We reply within one business day.',
        }
      }

      return {
        status: 'error',
        message: `The form service rejected the submission (HTTP ${response.status}). Please email us directly.`,
      }
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === 'AbortError'
      return {
        status: 'error',
        message: aborted
          ? 'The request timed out. Please try again, or email us directly.'
          : 'We could not reach the form service. Please email us directly.',
      }
    }
  }
}

/** Reads build-time configuration once and returns the adapter in force. */
export function createFormAdapter(): FormAdapter {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT
  if (typeof endpoint === 'string' && /^https:\/\//.test(endpoint)) {
    return new HttpEndpointAdapter(endpoint)
  }
  return new MailtoFallbackAdapter()
}

export const formAdapter = createFormAdapter()
