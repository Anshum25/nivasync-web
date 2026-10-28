/**
 * Small, dependency-free validation for the two inquiry forms.
 *
 * Returns a message per invalid field so the form can wire each one to its input
 * via `aria-describedby` and announce it. There is no schema library here because
 * two forms with eight fields do not justify one.
 */

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export interface ValidationRule<T> {
  field: keyof T
  /** Returns an error message, or null when the value is acceptable. */
  check: (value: string, all: T) => string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
/** Permissive on purpose: international formats vary and the field is optional. */
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/

export function required(label: string) {
  return (value: string): string | null =>
    value.trim().length === 0 ? `${label} is required.` : null
}

export function minLength(label: string, min: number) {
  return (value: string): string | null =>
    value.trim().length > 0 && value.trim().length < min
      ? `${label} should be at least ${min} characters.`
      : null
}

export function maxLength(label: string, max: number) {
  return (value: string): string | null =>
    value.trim().length > max ? `${label} should be ${max} characters or fewer.` : null
}

export function email(value: string): string | null {
  if (value.trim().length === 0) return 'Email address is required.'
  return EMAIL_RE.test(value.trim()) ? null : 'Enter a valid email address.'
}

export function optionalPhone(value: string): string | null {
  if (value.trim().length === 0) return null
  return PHONE_RE.test(value.trim()) ? null : 'Enter a valid phone number, or leave it blank.'
}

/** Runs a rule set, returning the first error found per field. */
export function validate<T extends Record<string, string>>(
  values: T,
  rules: ValidationRule<T>[],
): FieldErrors<T> {
  const errors: FieldErrors<T> = {}
  for (const rule of rules) {
    if (errors[rule.field]) continue
    const message = rule.check(values[rule.field] ?? '', values)
    if (message) errors[rule.field] = message
  }
  return errors
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0
}

/**
 * Strips control characters and clamps length before a value leaves the browser.
 *
 * This is a hygiene measure, not a security boundary: real validation must happen
 * server-side in whichever endpoint is configured. Nothing here is ever rendered
 * as HTML — React escapes all interpolated text and the app uses no
 * `dangerouslySetInnerHTML` anywhere.
 */
export function sanitize(value: string, max = 5000): string {
  return (
    value
      // Stripping control characters is the whole point of this function, so the
      // control-character class here is deliberate.
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .trim()
      .slice(0, max)
  )
}
