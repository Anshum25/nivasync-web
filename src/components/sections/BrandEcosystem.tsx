import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/motion/Reveal'
import { ExternalIcon, ArrowIcon } from '@/components/ui/Button'
import { SkydotMark } from '@/components/brand/NivaSyncLogo'
import { activeBrands } from '@/data/brands'
import type { Brand } from '@/types/content'

/**
 * Brand ecosystem, rendered from the `brands` data array.
 *
 * Adding a verified brand is a one-object change in src/data/brands.ts — this
 * component, the homepage section and the footer strip all read the same array,
 * so nothing here needs rewriting as the ecosystem grows.
 */
export function BrandEcosystem({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={cn('hairline-grid grid', compact ? 'md:grid-cols-3' : 'md:grid-cols-3')}>
      {activeBrands.map((brand, i) => (
        <Reveal key={brand.id} as="li" delay={i * 100} className="flex">
          <BrandCard brand={brand} />
        </Reveal>
      ))}
    </ul>
  )
}

function BrandCard({ brand }: { brand: Brand }) {
  const isSkydot = brand.id === 'skydot'

  return (
    <article className="flex min-h-full flex-col p-7 md:p-9">
      <div className="mb-6 flex items-center justify-between gap-4">
        {isSkydot ? (
          <SkydotMark className="h-8 w-8" />
        ) : (
          <span
            aria-hidden="true"
            className="h-8 w-8 rounded-[var(--radius-sm)] border border-line"
            style={{
              background: `linear-gradient(135deg, var(${brand.accentVar}) 0%, transparent 85%)`,
            }}
          />
        )}
        <span className="label label-plain text-content-subtle">{brand.role}</span>
      </div>

      <h3 className="font-display text-[length:var(--text-h3)] text-content">{brand.name}</h3>
      <p className="mt-1.5 text-[0.9375rem] text-content-accent">{brand.tagline}</p>

      <p className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-content-muted">
        {brand.summary}
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        {brand.focusAreas.map((area) => (
          <li key={area} className="text-[0.8125rem] text-content-subtle">
            {area}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
        {brand.internalPath ? (
          <Link
            to={brand.internalPath}
            className="link-underline inline-flex items-center gap-2 text-[0.9375rem] font-medium text-content hover:text-content-accent"
          >
            On this site
            <ArrowIcon />
          </Link>
        ) : null}

        {brand.externalUrl ? (
          <a
            href={brand.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-content-accent"
          >
            {new URL(brand.externalUrl).hostname.replace(/^www\./, '')}
            <ExternalIcon />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </article>
  )
}
