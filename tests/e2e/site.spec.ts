import { test, expect, type Page } from '@playwright/test'

/**
 * Browser checks against the production build.
 *
 * These cover what jsdom cannot: real layout (horizontal overflow), real
 * navigation and refresh against a server, real console output, and the boot
 * screen that lives outside React.
 */

const ROUTES = [
  '/',
  '/about',
  '/capabilities',
  '/capabilities/erp-solutions',
  '/products',
  '/products/itms',
  '/industries',
  '/industries/railways',
  '/brands',
  '/work',
  '/work/national-railway-infrastructure',
  '/insights',
  '/insights/future-of-erp-in-manufacturing',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
]

/** Collects genuine page errors, ignoring benign noise. */
function watchConsole(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    // A missing favicon variant or a font 304 is not an application error.
    if (/favicon|net::ERR_ABORTED.*\.(ico|png)/i.test(text)) return
    errors.push(text)
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  return errors
}

test.describe('every route loads directly', () => {
  for (const route of ROUTES) {
    test(`loads ${route} with no console errors`, async ({ page }) => {
      const errors = watchConsole(page)

      const response = await page.goto(route, { waitUntil: 'networkidle' })
      expect(response?.status(), `HTTP status for ${route}`).toBeLessThan(400)

      // Exactly one h1, with real text.
      const h1 = page.locator('h1')
      await expect(h1).toHaveCount(1)
      await expect(h1).not.toBeEmpty()

      // Landmarks present.
      await expect(page.locator('header[role="banner"]')).toHaveCount(1)
      await expect(page.locator('main#main')).toHaveCount(1)
      await expect(page.locator('footer')).toHaveCount(1)

      // The pre-React boot screen must have removed itself.
      await expect(page.locator('#boot')).toHaveCount(0)

      expect(errors, `console errors on ${route}`).toEqual([])
    })
  }
})

test.describe('no horizontal overflow', () => {
  const widths = [320, 375, 414, 768, 1024, 1440, 1920]

  for (const width of widths) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })

      for (const route of ['/', '/about', '/products/itms', '/contact', '/work']) {
        await page.goto(route, { waitUntil: 'networkidle' })

        // Below-the-fold sections use `content-visibility: auto`, so the browser
        // skips laying them out until they approach the viewport — which would
        // hide an overflowing element from this measurement. Force full layout
        // first so the check covers the whole page, not just the top of it.
        await page.addStyleTag({
          content: 'main > section { content-visibility: visible !important; }',
        })
        await page.waitForTimeout(150)

        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))

        expect(
          overflow.scrollWidth,
          `${route} overflows horizontally at this width`,
        ).toBeLessThanOrEqual(overflow.clientWidth + 1)
      }
    })
  }
})

test.describe('navigation', () => {
  test('every primary navigation item reaches a real page', async ({ page }) => {
    test.skip(
      test.info().project.name === 'mobile-chromium',
      'Desktop navigation is hidden below lg.',
    )

    // Each menu trigger, its overview link, and the URL that link must reach.
    const menus = [
      { trigger: 'About', overview: 'About NivaSync', url: /\/about$/ },
      { trigger: 'Capabilities', overview: 'All capabilities', url: /\/capabilities$/ },
      { trigger: 'Products', overview: 'All products', url: /\/products$/ },
      { trigger: 'Industries', overview: 'All industries', url: /\/industries$/ },
    ]

    const header = page.locator('header[role="banner"]')

    for (const menu of menus) {
      await page.goto('/')
      const trigger = header.getByRole('button', { name: menu.trigger, exact: true })
      await trigger.click()
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')

      const overview = header.getByRole('link', { name: menu.overview, exact: true }).last()
      await overview.click()

      await expect(page).toHaveURL(menu.url)
      await expect(page.locator('h1')).toHaveCount(1)
    }

    // Plain links, with no menu.
    for (const [label, url] of [
      ['Work', /\/work$/],
      ['Insights', /\/insights$/],
    ] as const) {
      await page.goto('/')
      await header.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(url)
      await expect(page.locator('h1')).toHaveCount(1)
    }
  })

  test('mobile menu opens, navigates and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await page.getByRole('button', { name: /open navigation menu/i }).click()
    const dialog = page.getByRole('dialog', { name: /site navigation/i })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('link', { name: 'Work', exact: true }).click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/\/work$/)
  })

  test('browser back and forward work', async ({ page }) => {
    await page.goto('/')
    await page.goto('/products');
    await page.goto('/products/itms')

    await page.goBack()
    await expect(page).toHaveURL(/\/products$/)
    await page.goForward()
    await expect(page).toHaveURL(/\/products\/itms$/)
  })

  test('refreshing a deep link keeps the page', async ({ page }) => {
    await page.goto('/industries/railways')
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('h1')).toContainText('Railways')
  })

  test('an unknown path renders the site 404, not the host 404', async ({ page }) => {
    await page.goto('/definitely-not-a-page')
    await expect(page.locator('h1')).toContainText('does not exist')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('/services redirects to /capabilities', async ({ page }) => {
    await page.goto('/services')
    await expect(page).toHaveURL(/\/capabilities$/)
  })
})

test.describe('content correctness', () => {
  test('product page shows its own content', async ({ page }) => {
    await page.goto('/products/itms')
    await expect(page.locator('h1')).toContainText('ITMS')
    await expect(page.getByText('Training Planning')).toBeVisible()
  })

  test('capability page shows its own content', async ({ page }) => {
    await page.goto('/capabilities/erpnext-implementation')
    await expect(page.locator('h1')).toContainText('ERPNext Implementation')
    await expect(page.getByText('Data Migration')).toBeVisible()
  })

  test('brand links point at the real Skydot site', async ({ page }) => {
    await page.goto('/brands')
    const link = page.getByRole('link', { name: /Visit skydotinfotech\.com/i })
    await expect(link).toHaveAttribute('href', 'https://skydotinfotech.com/')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })

  test('withheld case studies are not reachable', async ({ page }) => {
    await page.goto('/work/ai-inventory-optimization')
    await expect(page.locator('h1')).toContainText('does not exist')
  })
})

test.describe('contact form is honest', () => {
  test('shows validation errors and never a false success', async ({ page }) => {
    await page.goto('/contact')

    await page.getByRole('button', { name: /send project enquiry/i }).click()
    await expect(page.getByText(/your name is required/i)).toBeVisible()
    await expect(page.getByText(/^Message sent$/)).toHaveCount(0)

    await page.getByLabel(/your name/i).fill('Asha Patel')
    await page.getByLabel(/email address/i).fill('asha@example.com')
    await page
      .getByLabel(/about the project/i)
      .fill('We run three disconnected systems and need them consolidated.')
    await page.getByRole('button', { name: /send project enquiry/i }).click()

    const status = page.getByRole('status')
    await expect(status).toContainText(/not sent/i)
    await expect(status.getByRole('link', { name: /open email/i })).toHaveAttribute(
      'href',
      /^mailto:hello@nivasync\.in/,
    )
  })
})

test.describe('accessibility basics', () => {
  test('skip link is first in the tab order and moves focus to main', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chromium', 'Keyboard test is desktop-only.')

    await page.goto('/')
    await page.keyboard.press('Tab')

    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim())
    expect(focused).toContain('Skip to main content')
  })

  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // The boot screen is skipped entirely under reduced motion.
    await expect(page.locator('#boot')).toHaveCount(0)
    // Content is present and visible, not stranded at opacity 0.
    await expect(page.locator('h1')).toBeVisible()

    const opacity = await page
      .locator('main p')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity)
    expect(Number(opacity)).toBeGreaterThan(0.9)
  })

  test('all images have alt text', async ({ page }) => {
    for (const route of ['/', '/products/itms', '/about']) {
      await page.goto(route)
      const missing = await page.locator('img:not([alt])').count()
      expect(missing, `images without alt on ${route}`).toBe(0)
    }
  })
})

test.describe('theme consistency', () => {
  /**
   * Large surfaces must follow the active theme: light in light mode, dark in
   * dark mode. The site previously used an INVERTED band — a near-black hero,
   * CTA and footer sitting on an otherwise light page — which broke the reading
   * rhythm and handed light-mode visitors a dark slab they never chose.
   *
   * This measures the computed background of every big block and asserts its
   * relative luminance sits on the correct side of the line, so the inverted
   * band cannot come back by accident.
   */
  const SURFACES = ['/', '/about', '/brands', '/work', '/careers', '/contact', '/products/itms']

  async function bigSurfaceLuminances(page: Page) {
    return page.evaluate(() => {
      const luminance = (css: string) => {
        const m = css.match(/rgba?\(([^)]+)\)/)
        if (!m) return null
        const [r, g, b, a = '1'] = m[1].split(',').map((v) => parseFloat(v))
        if (parseFloat(String(a)) === 0) return null // transparent: inherits
        const lin = (v: number) => {
          const c = v / 255
          return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
      }

      const out: { tag: string; cls: string; lum: number }[] = []
      const minArea = window.innerWidth * window.innerHeight * 0.12
      for (const el of document.querySelectorAll('section, footer, header, main > div')) {
        const rect = el.getBoundingClientRect()
        if (rect.width * rect.height < minArea) continue
        const lum = luminance(getComputedStyle(el).backgroundColor)
        if (lum === null) continue
        out.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 60), lum })
      }
      return out
    })
  }

  for (const route of SURFACES) {
    test(`light mode keeps every large surface light on ${route}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await page.goto(route, { waitUntil: 'networkidle' })
      await page.addStyleTag({
        content: 'main > section { content-visibility: visible !important; }',
      })
      await page.waitForTimeout(200)

      for (const s of await bigSurfaceLuminances(page)) {
        expect(s.lum, `${s.tag}.${s.cls} on ${route} is dark in light mode`).toBeGreaterThan(0.5)
      }
    })

    test(`dark mode keeps every large surface dark on ${route}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto(route, { waitUntil: 'networkidle' })
      await page.addStyleTag({
        content: 'main > section { content-visibility: visible !important; }',
      })
      await page.waitForTimeout(200)

      for (const s of await bigSurfaceLuminances(page)) {
        expect(s.lum, `${s.tag}.${s.cls} on ${route} is light in dark mode`).toBeLessThan(0.2)
      }
    })
  }
})

test.describe('SEO output', () => {
  test('serves robots.txt and sitemap.xml', async ({ page }) => {
    const robots = await page.goto('/robots.txt')
    expect(robots?.status()).toBe(200)
    expect(await robots?.text()).toContain('Sitemap:')

    const sitemap = await page.goto('/sitemap.xml')
    expect(sitemap?.status()).toBe(200)
    const xml = (await sitemap?.text()) ?? ''
    expect(xml).toContain('<urlset')
    expect((xml.match(/<url>/g) ?? []).length).toBe(44)
  })

  test('each page has a distinct canonical', async ({ page }) => {
    const canonicals = new Set<string>()
    for (const route of ['/', '/about', '/products', '/contact']) {
      await page.goto(route)
      const href = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(href).toBeTruthy()
      canonicals.add(href as string)
    }
    expect(canonicals.size).toBe(4)
  })
})
