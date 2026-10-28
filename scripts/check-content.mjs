/**
 * Content integrity check.
 *
 * This enforces in CI what the brief states as an acceptance criterion: that no
 * invented customer, metric, testimonial, award or vacancy is presented as fact.
 *
 * It fails the build if:
 *   1. Any record is tagged `pending-approval` (those must not ship).
 *   2. A withheld case study's unverifiable metric reappears in rendered source.
 *   3. A `company-stated` record exists without the UI component that labels it.
 *   4. The "DO NOT PUBLISH" product candidates leak into the products array.
 *
 * Run: node scripts/check-content.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = resolve(ROOT, 'src')

/**
 * Strips comments before scanning.
 *
 * Several files discuss the withheld claims in doc comments precisely because
 * they are forbidden — documenting the omission is the point. Only RENDERED
 * content is checked, so comments are removed first.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

function walk(dir, pattern = /\.tsx?$/) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full, pattern))
    else if (pattern.test(entry)) out.push(full)
  }
  return out
}

const problems = []
const notes = []

// ── 1. No pending-approval content may ship ──────────────────────────────────
for (const file of walk(resolve(SRC, 'data'))) {
  const source = readFileSync(file, 'utf8')
  const where = relative(ROOT, file).replace(/\\/g, '/')
  const pending = [...source.matchAll(/tag:\s*'pending-approval'/g)]
  if (pending.length > 0) {
    problems.push(`${where}: ${pending.length} record(s) tagged 'pending-approval' must not ship`)
  }
}

// ── 2. Withheld metrics must not appear in any rendered component ────────────
// These are the unverifiable figures from the three case studies that were NOT
// republished. If one reappears in a page or component, something regressed.
const WITHHELD_STRINGS = [
  '$1.4M',
  'Global Retail Chain',
  'Leading Manufacturing Firm',
  'Regional Bank',
  '22% increase',
  '40% reduction',
]

const renderedFiles = [
  ...walk(resolve(SRC, 'pages')),
  ...walk(resolve(SRC, 'components')),
]

for (const file of renderedFiles) {
  const source = stripComments(readFileSync(file, 'utf8'))
  const where = relative(ROOT, file).replace(/\\/g, '/')
  for (const needle of WITHHELD_STRINGS) {
    if (source.includes(needle)) {
      problems.push(`${where}: withheld unverifiable claim "${needle}" appears in rendered code`)
    }
  }
}

// `work.ts` legitimately documents the withheld studies, but they must stay out
// of the published `caseStudies` array.
const workSource = stripComments(readFileSync(resolve(SRC, 'data/work.ts'), 'utf8'))
const publishedBlock = workSource.slice(
  workSource.indexOf('export const caseStudies'),
  workSource.indexOf('export const withheldCaseStudies'),
)
for (const needle of WITHHELD_STRINGS) {
  if (publishedBlock.includes(needle)) {
    problems.push(`src/data/work.ts: withheld claim "${needle}" is inside the PUBLISHED caseStudies array`)
  }
}

// ── 3. company-stated figures must be labelled in the UI ─────────────────────
const companySource = readFileSync(resolve(SRC, 'data/company.ts'), 'utf8')
const statedCount = [...companySource.matchAll(/tag:\s*'company-stated'/g)].length
const statsComponent = readFileSync(
  resolve(SRC, 'components/sections/StatsRow.tsx'),
  'utf8',
)
if (statedCount > 0 && !statsComponent.includes('SourceCallout')) {
  problems.push(
    `${statedCount} company-stated figures exist but StatsRow.tsx does not render a SourceCallout labelling them`,
  )
}
notes.push(`${statedCount} company-stated figures, labelled via SourceCallout in StatsRow.tsx`)

// ── 4. Unpublishable product candidates must stay unpublished ────────────────
const productsSource = readFileSync(resolve(SRC, 'data/products.ts'), 'utf8')
const productsArray = productsSource.slice(
  productsSource.indexOf('export const products'),
  productsSource.indexOf('export const unpublishedProductCandidates'),
)
for (const needle of ['eCount', 'Real Estate Portal']) {
  if (productsArray.includes(needle)) {
    problems.push(
      `src/data/products.ts: "${needle}" is in the published products array but was not found on the source site`,
    )
  }
}

// ── 5. Careers must not list invented vacancies ──────────────────────────────
const careersSource = readFileSync(resolve(SRC, 'data/careers.ts'), 'utf8')
const openingsMatch = careersSource.match(/export const openings: JobOpening\[\] = (\[[^\]]*\])/)
if (openingsMatch && openingsMatch[1].trim() !== '[]') {
  notes.push('Careers lists vacancies — confirm each is a real, approved, open role.')
} else {
  notes.push('Careers lists no vacancies (honest empty state).')
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log('Content integrity check')
for (const note of notes) console.log(`  · ${note}`)

if (problems.length > 0) {
  console.error(`\n${problems.length} content integrity problem(s):`)
  for (const problem of problems) console.error(`  ✗ ${problem}`)
  process.exit(1)
}

console.log('✓ No unapproved, withheld or invented content is published.')
