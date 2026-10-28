/**
 * Generates every brand asset from one source of truth.
 *
 * Input:  brand-src/nivasync-logo-source.jpg  (the official logo supplied by the
 *         company) and brand-src/traced.json (its vector trace).
 *
 * Output: public/logo-mark.svg          — the mark alone, exact brand colours
 *         public/favicon.svg            — the mark, sized for a browser tab
 *         public/logo-nivasync.svg      — mark + wordmark lockup
 *         src/components/brand/logoPaths.ts — the path data the React mark uses
 *
 * Why a generator: the mark now appears in five places (header, footer, favicon,
 * boot screen, social image). Deriving them all from one trace means they can
 * never drift apart.
 *
 * To re-trace from a new source file, run `node scripts/trace-logo.mjs` first.
 *
 * Run: node scripts/generate-brand-assets.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const { W, H, blueD, orangeD } = JSON.parse(
  readFileSync(resolve(ROOT, 'brand-src/traced.json'), 'utf8'),
)

/** Sampled from the official artwork — see docs/BRAND_ARCHITECTURE.md §5. */
const ORANGE = '#FC6302'
const BLUE = '#024BB1'
/**
 * On near-black the official #024BB1 scores 2.5:1 and effectively disappears,
 * so dark surfaces use the lighter tint from the blue ramp. This is a
 * legibility adaptation of the artwork and is flagged for brand confirmation in
 * docs/ASSET_INVENTORY.md.
 */
const BLUE_ON_DARK = '#4D8FE8'

const VIEWBOX = `0 0 ${W} ${H}`

/**
 * potrace encodes the interior counters of the N as reverse-wound subpaths,
 * which only render as holes under the evenodd fill rule.
 */
function markBody(orange, blue) {
  return (
    `<path fill="${orange}" fill-rule="evenodd" d="${orangeD}"/>` +
    `<path fill="${blue}" fill-rule="evenodd" d="${blueD}"/>`
  )
}

// ── public/logo-mark.svg — the mark alone ────────────────────────────────────
writeFileSync(
  resolve(ROOT, 'public/logo-mark.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" role="img" aria-label="NivaSync Infotech">` +
    `<title>NivaSync Infotech</title>${markBody(ORANGE, BLUE)}</svg>\n`,
)

// ── public/logo-mark-dark.svg — for near-black backgrounds ───────────────────
writeFileSync(
  resolve(ROOT, 'public/logo-mark-dark.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" role="img" aria-label="NivaSync Infotech">` +
    `<title>NivaSync Infotech</title>${markBody(ORANGE, BLUE_ON_DARK)}</svg>
`,
)

// ── public/favicon.svg ───────────────────────────────────────────────────────
// No background plate: the mark reads on both light and dark browser chrome.
writeFileSync(
  resolve(ROOT, 'public/favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}">${markBody(ORANGE, BLUE)}</svg>\n`,
)

// ── public/logo-nivasync.svg — mark + wordmark lockup ────────────────────────
// Referenced by the Organization structured data, so it must be a complete,
// self-contained representation of the brand.
const LOCKUP_W = W + 2600
writeFileSync(
  resolve(ROOT, 'public/logo-nivasync.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOCKUP_W} ${H}" role="img" aria-label="NivaSync Infotech Pvt. Ltd.">
<title>NivaSync Infotech Pvt. Ltd.</title>
${markBody(ORANGE, BLUE)}
<text x="${W + 240}" y="${H * 0.57}" font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif" font-size="${H * 0.33}" font-weight="700" letter-spacing="-${H * 0.012}" fill="${BLUE}">NivaSync</text>
<text x="${W + 250}" y="${H * 0.78}" font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif" font-size="${H * 0.125}" font-weight="500" letter-spacing="${H * 0.012}" fill="${ORANGE}">INFOTECH PVT. LTD.</text>
</svg>\n`,
)

// ── src/components/brand/logoPaths.ts ────────────────────────────────────────
writeFileSync(
  resolve(ROOT, 'src/components/brand/logoPaths.ts'),
  `/**
 * Vector path data for the official NivaSync mark.
 *
 * ⚠ GENERATED FILE — do not edit by hand.
 * Produced by scripts/generate-brand-assets.mjs from the official artwork in
 * brand-src/. Re-run that script after replacing the source logo.
 *
 * The two subpaths carry the interior counters of the N as reverse-wound
 * contours, so anything rendering them must use \`fillRule="evenodd"\`.
 */

/** Native dimensions of the artwork; use as the SVG viewBox. */
export const LOGO_VIEWBOX = '${VIEWBOX}'

/** Brand colours, sampled from the official artwork. */
export const LOGO_ORANGE = '${ORANGE}'
export const LOGO_BLUE = '${BLUE}'

export const LOGO_PATH_ORANGE =
  '${orangeD}'

export const LOGO_PATH_BLUE =
  '${blueD}'
`,
)

console.log('brand assets written:')
console.log('  public/logo-mark.svg')
console.log('  public/logo-mark-dark.svg')
console.log('  public/favicon.svg')
console.log('  public/logo-nivasync.svg')
console.log('  src/components/brand/logoPaths.ts')
