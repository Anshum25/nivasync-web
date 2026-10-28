import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const controlClasses =
  'w-full rounded-[var(--radius-sm)] border bg-surface px-4 py-3 text-[0.9375rem] ' +
  'text-content placeholder:text-content-subtle transition-colors ' +
  'duration-[var(--dur-fast)] focus:border-accent focus-visible:outline-offset-1'

/**
 * Accessible form field wrapper.
 *
 * Every control gets: a real <label> bound by `htmlFor`, an `aria-describedby`
 * that points at the hint and/or the error, `aria-invalid` when it has an error,
 * and `aria-required` where required. Error text is rendered next to the field
 * — not only in a summary — because that is where someone fixing it is looking.
 */
interface BaseProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  required?: boolean
  autoComplete?: string
  disabled?: boolean
  className?: string
}

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

function Labelled({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.9375rem] font-medium text-content">
        {label}
        {required ? (
          <span className="ml-1 text-content-accent" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 text-[0.8125rem] font-normal text-content-subtle">
            (optional)
          </span>
        )}
      </label>

      {hint ? (
        <p id={`${id}-hint`} className="mb-2 text-[0.8125rem] text-content-muted">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-start gap-1.5 text-[0.8125rem] text-danger"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            fill="currentColor"
          >
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.9 10.5h-1.8v-1.8h1.8v1.8Zm0-3h-1.8V4h1.8v4.5Z" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function TextField({
  type = 'text',
  placeholder,
  ...props
}: BaseProps & { type?: 'text' | 'email' | 'tel'; placeholder?: string }) {
  const { id, label, value, onChange, error, hint, required, autoComplete, disabled, className } =
    props

  return (
    <Labelled
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, error ? 'border-danger' : 'border-line-strong')}
      />
    </Labelled>
  )
}

export function TextArea({
  rows = 6,
  placeholder,
  ...props
}: BaseProps & { rows?: number; placeholder?: string }) {
  const { id, label, value, onChange, error, hint, required, disabled, className } = props

  return (
    <Labelled
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(
          controlClasses,
          'resize-y',
          error ? 'border-danger' : 'border-line-strong',
        )}
      />
    </Labelled>
  )
}

export function SelectField({
  options,
  ...props
}: BaseProps & { options: { value: string; label: string }[] }) {
  const { id, label, value, onChange, error, hint, required, disabled, className } = props

  return (
    <Labelled
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, error ? 'border-danger' : 'border-line-strong')}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Labelled>
  )
}

/**
 * Honeypot. Positioned off-screen rather than `display: none`, labelled, and
 * marked `aria-hidden` with `tabIndex={-1}` so no keyboard or screen-reader user
 * can reach it — but a naive bot that fills every input will.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="company-website-hp">Leave this field empty</label>
      <input
        id="company-website-hp"
        name="company-website-hp"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
