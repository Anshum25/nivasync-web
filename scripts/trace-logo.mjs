/**
 * Traces the official NivaSync logo artwork into vector paths.
 *
 * Input:  brand-src/nivasync-logo-source.jpg (the artwork supplied by the company)
 * Output: brand-src/traced.json, consumed by scripts/generate-brand-assets.mjs
 *
 * The two brand colours are isolated into separate 1-bit masks and traced
 * independently, which preserves the thin white hairline that splits the mark.
 * Each mask is blurred slightly first: JPEG artefacts produce stair-stepped
 * edges, and tracing those directly yields ~137 KB of path data instead of 6 KB
 * for a shape the eye cannot tell apart.
 *
 * Only needs re-running if the source artwork changes.
 *
 * Run: node scripts/trace-logo.mjs && node scripts/generate-brand-assets.mjs
 */

import { Jimp } from 'jimp'
import potrace from 'potrace'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const src = await Jimp.read(resolve(ROOT, 'brand-src/nivasync-logo-source.jpg'))
const { width: W, height: H } = src.bitmap

function mask(image, predicate, blur) {
  const { width: w, height: h, data } = image.bitmap
  const out = new Jimp({ width: w, height: h, color: 0xffffffff })
  const od = out.bitmap.data
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const v = predicate(data[i], data[i + 1], data[i + 2]) ? 0 : 255
      od[i] = v; od[i + 1] = v; od[i + 2] = v; od[i + 3] = 255
    }
  }
  // A light blur rounds off JPEG stair-stepping, so potrace emits far fewer
  // segments for the same shape.
  if (blur) out.blur(blur)
  return out
}

const isBlue = (r, g, b) => b > 100 && b - r > 70 && b - g > 40
const isOrange = (r, g, b) => r > 150 && r - b > 90 && g < 190 && g > 30

function tracePath(pngPath, opts) {
  return new Promise((resolve, reject) => {
    const p = new potrace.Potrace({ threshold: 128, optCurve: true, ...opts })
    p.loadImage(pngPath, (err) => {
      if (err) return reject(err)
      const svg = p.getSVG()
      resolve([...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(' '))
    })
  })
}

/** Round every coordinate to one decimal — halves the string with no visible change. */
function compress(d) {
  return d
    .replace(/(\d+\.\d+)/g, (m) => String(Math.round(parseFloat(m) * 10) / 10))
    .replace(/\s+/g, ' ')
    .trim()
}

await mask(src, isBlue, 3).write(resolve(ROOT, 'brand-src/mask-blue.png'))
await mask(src, isOrange, 3).write(resolve(ROOT, 'brand-src/mask-orange.png'))

const opts = { turdSize: 40, optTolerance: 1.1, alphaMax: 1.3 }
const blueD = compress(await tracePath(resolve(ROOT, 'brand-src/mask-blue.png'), opts))
const orangeD = compress(await tracePath(resolve(ROOT, 'brand-src/mask-orange.png'), opts))

console.log('viewBox', W, 'x', H)
console.log('blue  ', (blueD.length / 1024).toFixed(1), 'KB')
console.log('orange', (orangeD.length / 1024).toFixed(1), 'KB')
writeFileSync(resolve(ROOT, 'brand-src/traced.json'), JSON.stringify({ W, H, blueD, orangeD }, null, 1))
