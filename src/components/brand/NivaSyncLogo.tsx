import { cn } from '@/lib/cn'
import {
  LOGO_PATH_BLUE,
  LOGO_PATH_ORANGE,
  LOGO_VIEWBOX,
} from './logoPaths'

/**
 * The official NivaSync mark.
 *
 * The paths are a vector trace of the artwork supplied by the company, produced
 * by scripts/trace-logo.mjs and written into logoPaths.ts by
 * scripts/generate-brand-assets.mjs. Do not hand-edit them — re-run those
 * scripts if the artwork changes.
 *
 * Colours come from `--logo-orange` and `--logo-blue` rather than being
 * hard-coded, so the mark can lighten its blue on dark surfaces where the
 * official #024BB1 would otherwise disappear into the background. On light
 * surfaces both render at their exact brand values.
 *
 * `fillRule="evenodd"` is required: the interior counters of the N are encoded
 * as reverse-wound subpaths.
 */
export function NivaSyncMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn('h-8 w-8 shrink-0', className)}
    >
      <path fill="var(--logo-orange)" fillRule="evenodd" d={LOGO_PATH_ORANGE} />
      <path fill="var(--logo-blue)" fillRule="evenodd" d={LOGO_PATH_BLUE} />
    </svg>
  )
}

interface LogoProps {
  className?: string
  /** Hide the wordmark and show the mark alone (used in tight footers). */
  markOnly?: boolean
}

/**
 * Full lockup: mark plus wordmark.
 *
 * The wordmark is live text in the display face rather than a flattened image,
 * so it stays crisp at any size, respects the visitor's text scaling, and is
 * read correctly by assistive technology.
 */
export function NivaSyncLogo({ className, markOnly = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <NivaSyncMark className="h-9 w-9" />
      {!markOnly && (
        <span className="font-display text-[1.1875rem] font-extrabold leading-none tracking-[-0.035em] text-content">
          NivaSync
        </span>
      )}
      <span className="sr-only">NivaSync Infotech Pvt. Ltd. — home</span>
    </span>
  )
}

/**
 * Skydot brand mark. Drawn from Skydot's VERIFIED brand colours (#F05A28 /
 * #1677FF, taken from the live site's theme-color and CSS variables) as an
 * abstract "sky dot" — it does not reproduce Skydot's actual logo artwork,
 * which was not supplied as a file.
 */
export function SkydotMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn('h-7 w-7 shrink-0', className)}
      fill="none"
    >
      <path
        d="M4 20.5c4.5-7 9-10.5 13.5-10.5S26 13 28 17"
        stroke="var(--skydot-blue)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="22.5" cy="22" r="4.5" fill="var(--skydot-orange)" />
    </svg>
  )
}
