/**
 * Generates public/og-default.png (1200×630) and public/icon-180.png.
 *
 * Both are rendered by laying out real HTML in headless Chromium and taking a
 * screenshot, so they use the official logo artwork and the site's real
 * typeface rather than an approximation. The previous version of this script
 * encoded PNGs by hand with a bitmap font, which was only necessary while no
 * brand assets existed.
 *
 * Run: node scripts/generate-og.mjs
 * (Requires the Playwright Chromium browser, a devDependency of this project.)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const ORANGE = '#FC6302'
const BLUE = '#024BB1'
const INK = '#070C16'
const PAPER = '#F1F4F9'

const dataUri = (file) =>
  `data:image/svg+xml;base64,${Buffer.from(readFileSync(resolve(ROOT, file), 'utf8')).toString('base64')}`

/** The social card sits on ink, so it uses the dark-surface variant. */
const markOnDark = dataUri('public/logo-mark-dark.svg')
const markOnLight = dataUri('public/logo-mark.svg')

const FONT_LINK = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap`

function page({ width, height, body, background }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONT_LINK}">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${width}px;height:${height}px;overflow:hidden}
  body{background:${background};font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .grid{position:absolute;inset:0;
    background-image:linear-gradient(to right,rgba(255,255,255,.045) 1px,transparent 1px),
                     linear-gradient(to bottom,rgba(255,255,255,.045) 1px,transparent 1px);
    background-size:72px 72px}
  .glow{position:absolute;width:760px;height:760px;right:-200px;bottom:-320px;border-radius:50%;
    background:radial-gradient(circle, rgba(2,75,177,.55) 0%, rgba(2,75,177,0) 68%)}
  .glow2{position:absolute;width:560px;height:560px;left:-180px;top:-240px;border-radius:50%;
    background:radial-gradient(circle, rgba(252,99,2,.32) 0%, rgba(252,99,2,0) 70%)}
</style></head><body>${body}</body></html>`
}

const ogBody = `
<div class="grid"></div><div class="glow"></div><div class="glow2"></div>
<div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 86px">
  <div style="display:flex;align-items:center;gap:22px;margin-bottom:46px">
    <img src="${markOnDark}" width="86" height="86" alt="">
    <div>
      <div style="font-size:38px;font-weight:800;letter-spacing:-.035em;color:#fff;line-height:1">NivaSync</div>
      <div style="font-size:14px;font-weight:600;letter-spacing:.16em;color:${ORANGE};margin-top:7px">INFOTECH PVT. LTD.</div>
    </div>
  </div>
  <div style="font-size:66px;font-weight:800;letter-spacing:-.04em;line-height:1.08;color:#fff;max-width:900px">
    Enterprise technology,<br>engineered to last.
  </div>
  <div style="font-size:25px;font-weight:500;line-height:1.5;color:#AEB8CC;margin-top:30px;max-width:830px">
    Software, ERP and training platforms for government, education and industry.
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:10px;
    background:linear-gradient(90deg, ${ORANGE} 0%, ${ORANGE} 42%, ${BLUE} 58%, #4D8FE8 100%)"></div>
</div>`

const iconBody = `
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">
  <img src="${markOnLight}" width="132" height="132" alt="">
</div>`

const browser = await chromium.launch()

async function shoot({ width, height, body, background, out, scale = 1 }) {
  const p = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: scale,
  })
  await p.setContent(page({ width, height, body, background }), { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(250)
  const buf = await p.screenshot({ type: 'png' })
  writeFileSync(resolve(ROOT, out), buf)
  console.log(`${out} written: ${width * scale}×${height * scale}, ${(buf.length / 1024).toFixed(1)} KB`)
  await p.close()
}

await shoot({
  width: 1200,
  height: 630,
  body: ogBody,
  background: INK,
  out: 'public/og-default.png',
})

await shoot({
  width: 180,
  height: 180,
  body: iconBody,
  background: PAPER,
  out: 'public/icon-180.png',
})

await browser.close()
