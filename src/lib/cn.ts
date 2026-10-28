/**
 * Minimal class-name joiner.
 *
 * Deliberately not `clsx` + `tailwind-merge`: this project has no need to resolve
 * conflicting Tailwind classes at runtime, and two dependencies for a string join
 * is exactly the kind of unnecessary weight the brief rules out.
 */
export type ClassValue = string | number | false | null | undefined

export function cn(...values: ClassValue[]): string {
  let out = ''
  for (const v of values) {
    if (!v && v !== 0) continue
    out = out ? `${out} ${v}` : String(v)
  }
  return out
}
