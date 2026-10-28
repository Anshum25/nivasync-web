import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/motion/Reveal'
import {
  deploymentCategoryLabels,
  deploymentSites,
} from '@/data/deployments'
import type { DeploymentSite } from '@/types/content'

/**
 * The 30 named institutional deployments, as a map plus a filterable list.
 *
 * This is the most load-bearing evidence on the site: every entry is a real,
 * publicly checkable institution — NAIR Vadodara, IRISET Secunderabad, AIIMS
 * Jodhpur — rather than an anonymous "leading firm". It replaces the invented
 * client metrics that were withheld from the Work section.
 *
 * The map is a projection of the published coordinates onto a plain SVG box,
 * NOT a tile-based map: no third-party map SDK, no API key, no tile requests and
 * nothing to leak a visitor's IP to. The list below it carries the same data in
 * text, so the information never depends on the graphic.
 */

// India's approximate bounding box, used to project lat/lng into the viewBox.
const BOUNDS = { minLat: 6.5, maxLat: 35.5, minLng: 68, maxLng: 92.5 }
const VIEW = { w: 420, h: 480 }

function project(site: DeploymentSite) {
  const x = ((site.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * VIEW.w
  const y = ((BOUNDS.maxLat - site.lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEW.h
  return { x, y }
}

const categories = Object.keys(deploymentCategoryLabels) as DeploymentSite['category'][]

export function DeploymentFootprint() {
  const [filter, setFilter] = useState<DeploymentSite['category'] | 'all'>('all')
  const [active, setActive] = useState<string | null>(null)

  const visible =
    filter === 'all' ? deploymentSites : deploymentSites.filter((s) => s.category === filter)

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      {/* Map */}
      <Reveal from="right">
        <div className="relative mx-auto w-full max-w-[26rem]">
          <svg
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            className="w-full"
            role="img"
            aria-label={`Map showing ${visible.length} deployment locations across India.`}
          >
            {/* Reference graticule, so the dots have spatial context without a
                tile layer. Decorative. */}
            <g aria-hidden="true" stroke="var(--line)" strokeWidth="1">
              {[0.2, 0.4, 0.6, 0.8].map((f) => (
                <line key={`h${f}`} x1="0" y1={VIEW.h * f} x2={VIEW.w} y2={VIEW.h * f} />
              ))}
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={`v${f}`} x1={VIEW.w * f} y1="0" x2={VIEW.w * f} y2={VIEW.h} />
              ))}
            </g>

            {visible.map((site) => {
              const { x, y } = project(site)
              const isActive = active === site.name
              return (
                <g key={site.name}>
                  {isActive && (
                    <circle cx={x} cy={y} r="11" fill="var(--accent)" fillOpacity="0.18" />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 5 : 3.5}
                    fill="var(--accent)"
                    className="transition-all duration-[var(--dur-base)]"
                  />
                </g>
              )
            })}
          </svg>

          <p className="mt-4 text-center text-[0.8125rem] text-content-subtle">
            Approximate locations, plotted from published coordinates.
          </p>
        </div>
      </Reveal>

      {/* Filter + list */}
      <Reveal delay={120}>
        <div>
          <div
            role="group"
            aria-label="Filter deployments by type"
            className="mb-7 flex flex-wrap gap-2"
          >
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              label={`All (${deploymentSites.length})`}
            />
            {categories.map((cat) => {
              const count = deploymentSites.filter((s) => s.category === cat).length
              return (
                <FilterButton
                  key={cat}
                  active={filter === cat}
                  onClick={() => setFilter(cat)}
                  label={`${deploymentCategoryLabels[cat]} (${count})`}
                />
              )
            })}
          </div>

          <ul
            className="max-h-[28rem] space-y-0 overflow-y-auto divide-y divide-line border-y border-line"
            aria-live="polite"
          >
            {visible.map((site) => (
              <li key={site.name}>
                <div
                  onMouseEnter={() => setActive(site.name)}
                  onMouseLeave={() => setActive(null)}
                  className="py-3.5 pr-2 text-[0.9375rem] leading-snug text-content-muted transition-colors hover:text-content"
                >
                  {site.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-[var(--radius-full)] border px-3.5 py-2 text-[0.8125rem] transition-colors',
        active
          ? 'border-accent bg-surface-accent-soft text-content-accent'
          : 'border-line text-content-muted hover:border-line-strong hover:text-content',
      )}
    >
      {label}
    </button>
  )
}
