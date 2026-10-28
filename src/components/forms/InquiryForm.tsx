import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { HoneypotField, SelectField, TextArea, TextField } from './Field'
import { formAdapter, type InquiryKind, type SubmitResult } from '@/lib/forms'
import {
  email as emailRule,
  hasErrors,
  maxLength,
  minLength,
  optionalPhone,
  required,
  validate,
  type FieldErrors,
  type ValidationRule,
} from '@/lib/validation'
import { capabilities } from '@/data/capabilities'
import { products } from '@/data/products'

interface Values extends Record<string, string> {
  name: string
  email: string
  organisation: string
  phone: string
  interest: string
  message: string
  trap: string
}

const EMPTY: Values = {
  name: '',
  email: '',
  organisation: '',
  phone: '',
  interest: '',
  message: '',
  trap: '',
}

const rules: ValidationRule<Values>[] = [
  { field: 'name', check: required('Your name') },
  { field: 'name', check: minLength('Your name', 2) },
  { field: 'name', check: maxLength('Your name', 120) },
  { field: 'email', check: emailRule },
  { field: 'organisation', check: maxLength('Organisation', 160) },
  { field: 'phone', check: optionalPhone },
  { field: 'message', check: required('Your message') },
  { field: 'message', check: minLength('Your message', 20) },
  { field: 'message', check: maxLength('Your message', 5000) },
]

const interestOptions = [
  { value: '', label: 'Select an area…' },
  ...capabilities.map((c) => ({ value: c.title, label: c.title })),
  ...products.map((p) => ({ value: p.title, label: `${p.title} (product)` })),
  { value: 'Something else', label: 'Something else' },
]

/**
 * Corporate and project inquiry form.
 *
 * ── HONEST SUBMISSION BEHAVIOUR ──────────────────────────────────────────────
 * This form NEVER shows a success message unless a configured endpoint actually
 * accepted the submission. With no backend configured (the state of this build),
 * submitting produces a clearly-worded `fallback` state that says nothing was
 * transmitted and offers a pre-filled email instead.
 *
 * See src/lib/forms.ts and docs/DEPLOYMENT.md §"Contact form configuration".
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Accessibility:
 *  - Validation runs on submit, and on blur only for fields already touched, so
 *    errors do not appear while someone is still typing their first character.
 *  - The result region is `role="status" aria-live="polite"`; errors use
 *    `role="alert"`. Focus moves to the result so a keyboard user is not left
 *    wondering whether anything happened.
 *  - On a failed submit, focus moves to the first invalid control.
 */
export function InquiryForm({ kind }: { kind: InquiryKind }) {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors<Values>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const isProject = kind === 'project'
  const prefix = `${kind}-`

  const set = (field: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (touched.has(field as string)) {
      const next = validate({ ...values, [field]: value }, rules)
      setErrors((e) => ({ ...e, [field]: next[field] }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const found = validate(values, rules)
    setErrors(found)
    setTouched(new Set(Object.keys(values)))

    if (hasErrors(found)) {
      const firstField = Object.keys(found)[0]
      formRef.current
        ?.querySelector<HTMLElement>(`#${prefix}${firstField}`)
        ?.focus()
      return
    }

    setSubmitting(true)
    setResult(null)

    const response = await formAdapter.submit({
      kind,
      name: values.name,
      email: values.email,
      organisation: values.organisation,
      phone: values.phone,
      interest: isProject ? values.interest : undefined,
      message: values.message,
      trap: values.trap,
    })

    setSubmitting(false)
    setResult(response)

    if (response.status === 'success') setValues(EMPTY)
    // Announce and focus the outcome.
    window.requestAnimationFrame(() => resultRef.current?.focus())
  }

  const markTouched = (field: keyof Values) => {
    setTouched((t) => new Set(t).add(field as string))
    const next = validate(values, rules)
    setErrors((e) => ({ ...e, [field]: next[field] }))
  }

  /**
   * Blur validation is delegated from the form element rather than wired into
   * every field, which keeps the Field components purely presentational.
   */
  const handleBlurCapture = (event: React.FocusEvent<HTMLFormElement>) => {
    const id = (event.target as HTMLElement).id
    if (!id || !id.startsWith(prefix)) return
    const field = id.slice(prefix.length) as keyof Values
    if (field in values) markTouched(field)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onBlurCapture={handleBlurCapture}
      noValidate
      className="relative"
    >
      <HoneypotField value={values.trap} onChange={set('trap')} />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id={`${prefix}name`}
          label="Your name"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          required
          autoComplete="name"
          disabled={submitting}
        />
        <TextField
          id={`${prefix}email`}
          label="Email address"
          type="email"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          required
          autoComplete="email"
          disabled={submitting}
        />
        <TextField
          id={`${prefix}organisation`}
          label="Organisation"
          value={values.organisation}
          onChange={set('organisation')}
          error={errors.organisation}
          autoComplete="organization"
          disabled={submitting}
        />
        <TextField
          id={`${prefix}phone`}
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={set('phone')}
          error={errors.phone}
          autoComplete="tel"
          disabled={submitting}
        />

        {isProject ? (
          <SelectField
            id={`${prefix}interest`}
            label="Area of interest"
            value={values.interest}
            onChange={set('interest')}
            error={errors.interest}
            options={interestOptions}
            disabled={submitting}
            className="sm:col-span-2"
          />
        ) : null}

        <TextArea
          id={`${prefix}message`}
          label={isProject ? 'About the project' : 'Your message'}
          value={values.message}
          onChange={set('message')}
          error={errors.message}
          required
          disabled={submitting}
          hint={
            isProject
              ? 'What has to work better, which systems it touches, and any deadline you are working to.'
              : 'Tell us what this is about and we will route it to the right person.'
          }
          placeholder={
            isProject
              ? 'We run a manufacturing operation on three disconnected systems…'
              : 'We would like to discuss…'
          }
          className="sm:col-span-2"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : isProject ? (
            'Send project enquiry'
          ) : (
            'Send enquiry'
          )}
        </Button>

        <p className="text-[0.8125rem] leading-relaxed text-content-subtle">
          We use your details only to reply to this enquiry.{' '}
          <Link to="/privacy" className="link-underline text-content-muted">
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Result region. `tabIndex={-1}` so focus can be moved here programmatically. */}
      {result ? (
        <div
          ref={resultRef}
          tabIndex={-1}
          role={result.status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={cn(
            'mt-7 rounded-[var(--radius-md)] border p-5',
            result.status === 'success' && 'border-success bg-success-soft',
            result.status === 'error' && 'border-danger bg-danger-soft',
            result.status === 'fallback' && 'border-line-strong bg-surface-sunken',
          )}
        >
          <p className="text-[0.9375rem] font-medium text-content">
            {result.status === 'success'
              ? 'Message sent'
              : result.status === 'error'
                ? 'Could not send'
                : 'Not sent — email us instead'}
          </p>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-content-muted">
            {result.message}
          </p>

          {result.status === 'fallback' ? (
            <a
              href={result.mailtoUrl}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-2.5 text-[0.9375rem] font-medium text-accent-on"
            >
              Open email with these details
            </a>
          ) : null}
        </div>
      ) : null}

      {/* Integration status, stated plainly rather than hidden. */}
      {!formAdapter.configured ? (
        <p className="mt-6 text-[0.8125rem] leading-relaxed text-content-subtle">
          <strong className="font-medium text-content-muted">Note:</strong> this form has
          no delivery backend configured yet, so it will not transmit your message. It
          will hand you a pre-filled email instead. We would rather say so than show you
          a “sent” message that is not true.
        </p>
      ) : null}
    </form>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 animate-spin" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path
        d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
