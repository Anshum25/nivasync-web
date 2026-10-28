import { Link, useLocation } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton, ArrowIcon } from '@/components/ui/Button'
import { useSeo } from '@/lib/seo'
import { capabilities } from '@/data/capabilities'
import { products } from '@/data/products'
import { primaryEmail } from '@/data/company'

/**
 * 404.
 *
 * `noindex` is set here and nowhere else in the app, so a missing page is never
 * indexed while every real page stays indexable.
 *
 * It is a useful page rather than a dead end: it names the path that failed and
 * offers the routes a visitor most plausibly wanted. It is also rendered directly
 * by the detail templates when a slug does not resolve, so a URL like
 * /products/nonexistent behaves exactly like any other missing page.
 */
export default function NotFound() {
  const { pathname } = useLocation()

  useSeo({
    title: 'Page not found',
    description: 'The page you were looking for does not exist on this site.',
    path: pathname,
    noindex: true,
  })

  return (
    <Section>
      <div className="max-w-[46rem]">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="mt-5 text-[length:var(--text-h1)]">This page does not exist.</h1>

        <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
          We could not find anything at{' '}
          <code className="rounded-[var(--radius-xs)] bg-surface-sunken px-2 py-0.5 text-[0.9375rem] text-content">
            {pathname}
          </code>
          . It may have moved, or the link that brought you here may be out of date.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <LinkButton to="/" size="lg">
            Back to homepage
            <ArrowIcon />
          </LinkButton>
          <LinkButton to="/contact" variant="secondary" size="lg">
            Contact us
          </LinkButton>
        </div>
      </div>

      <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
        <div>
          <p className="label label-plain mb-5">Capabilities</p>
          <ul className="space-y-2.5">
            {capabilities.slice(0, 5).map((capability) => (
              <li key={capability.slug}>
                <Link
                  to={`/capabilities/${capability.slug}`}
                  className="link-underline text-[0.9375rem] text-content-muted hover:text-content"
                >
                  {capability.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label label-plain mb-5">Products</p>
          <ul className="space-y-2.5">
            {products.slice(0, 5).map((product) => (
              <li key={product.slug}>
                <Link
                  to={`/products/${product.slug}`}
                  className="link-underline text-[0.9375rem] text-content-muted hover:text-content"
                >
                  {product.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label label-plain mb-5">Elsewhere</p>
          <ul className="space-y-2.5">
            {[
              { label: 'About NivaSync', to: '/about' },
              { label: 'Brand ecosystem', to: '/brands' },
              { label: 'Selected work', to: '/work' },
              { label: 'Industries', to: '/industries' },
              { label: 'Careers', to: '/careers' },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="link-underline text-[0.9375rem] text-content-muted hover:text-content"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-12 text-[0.9375rem] text-content-muted">
        Still stuck? Email{' '}
        <a href={primaryEmail.href} className="link-underline text-content-accent">
          {primaryEmail.value}
        </a>{' '}
        and tell us what you were looking for.
      </p>
    </Section>
  )
}
