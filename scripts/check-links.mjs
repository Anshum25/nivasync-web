/**
 * Internal link integrity check.
 *
 * Scans every .tsx file for `to="…"` and `to={`…`}` React Router targets, plus
 * any `href="/…"` anchors, and verifies each one resolves against the real route
 * table. Also fails on placeholder `href="#"` links, which the brief rules out.
 *
 * This is the guard against the single most common failure on a site with 35
 * routes: a link that points at a path nobody ever created.
 *
 * Run: node scripts/check-links.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = resolve(ROOT, 'src')

function read(relativePath) {
  return readFileSync(resolve(ROOT, relativePath), 'utf8')
}

function slugsFrom(relativePath, exclude = []) {
  const found = [...read(relativePath).matchAll(/^\s*slug:\s*'([a-z0-9-]+)'/gm)].map((m) => m[1])
  return [...new Set(found)].filter((s) => !exclude.includes(s))
}

const WITHHELD = [
  'enterprise-erp-manufacturing',
  'ai-inventory-optimization',
  'fintech-mobile-banking',
]

// ── Build the set of valid paths ─────────────────────────────────────────────
const valid = new Set([
  '/',
  '/about',
  '/capabilities',
  '/products',
  '/industries',
  '/brands',
  '/work',
  '/insights',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  // Redirect aliases are legitimate link targets.
  '/services',
  '/solutions',
])

for (const s of slugsFrom('src/data/capabilities.ts')) valid.add(`/capabilities/${s}`)
for (const s of slugsFrom('src/data/products.ts')) valid.add(`/products/${s}`)
for (const s of slugsFrom('src/data/industries.ts')) valid.add(`/industries/${s}`)
for (const s of slugsFrom('src/data/work.ts', WITHHELD)) valid.add(`/work/${s}`)
for (const s of slugsFrom('src/data/insights.ts')) valid.add(`/insights/${s}`)

// ── Walk the source tree ─────────────────────────────────────────────────────
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.tsx?$/.test(entry)) out.push(full)
  }
  return out
}

/**
 * Strips comments before scanning.
 *
 * Without this the checker reports its own documentation: several files discuss
 * placeholder links and withheld claims in doc comments precisely because they
 * are forbidden, and matching those would make the check cry wolf forever.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

const files = walk(SRC)
const problems = []
let checked = 0

/** Template literals like `/products/${slug}` are dynamic — verify the prefix. */
const DYNAMIC_PREFIXES = [
  '/capabilities/',
  '/products/',
  '/industries/',
  '/work/',
  '/insights/',
]

for (const file of files) {
  const source = stripComments(readFileSync(file, 'utf8'))
  const where = relative(ROOT, file).replace(/\\/g, '/')

  // Placeholder links.
  if (/href=["']#["']/.test(source)) {
    problems.push(`${where}: placeholder href="#" found`)
  }

  // Static to="/path" and href="/path"
  for (const match of source.matchAll(/\b(?:to|href)=["'](\/[^"'\s]*)["']/g)) {
    const path = match[1].split('#')[0].replace(/\/$/, '') || '/'
    checked++
    if (!valid.has(path)) {
      problems.push(`${where}: link to "${match[1]}" does not match any route`)
    }
  }

  // Template-literal targets: to={`/products/${slug}`}
  for (const match of source.matchAll(/\bto=\{`(\/[^`]*)`\}/g)) {
    const raw = match[1]
    checked++
    if (!raw.includes('${')) {
      const path = raw.replace(/\/$/, '') || '/'
      if (!valid.has(path)) {
        problems.push(`${where}: link to "${raw}" does not match any route`)
      }
      continue
    }
    const prefix = raw.slice(0, raw.indexOf('${'))
    if (!DYNAMIC_PREFIXES.includes(prefix)) {
      problems.push(`${where}: dynamic link "${raw}" has an unrecognised prefix "${prefix}"`)
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`Checked ${checked} internal links across ${files.length} source files.`)
console.log(`Route table contains ${valid.size} valid paths.`)

if (problems.length > 0) {
  console.error(`\n${problems.length} link problem(s):`)
  for (const problem of problems) console.error(`  ✗ ${problem}`)
  process.exit(1)
}

console.log('✓ All internal links resolve. No placeholder links found.')
