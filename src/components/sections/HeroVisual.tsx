import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { LOGO_PATH_BLUE, LOGO_PATH_ORANGE } from '@/components/brand/logoPaths'

/**
 * Hero visual: an abstract systems diagram.
 *
 * Why this and not a video or a 3D canvas: it carries the "connected systems"
 * idea at a few kilobytes of inline SVG, needs no network request, no WebGL and
 * no fallback to maintain, and it animates only `stroke-dashoffset` and `opacity`
 * on a handful of nodes.
 *
 * Under `prefers-reduced-motion` every animation is dropped and the diagram
 * renders in its complete, static state — the information is in the shape, not
 * in the movement.
 *
 * It is `aria-hidden`: it is decorative, and the hero's headline already states
 * what it illustrates.
 */
export function HeroVisual() {
  const reduced = usePrefersReducedMotion()

  // Three tiers: edge systems, the integration spine, the platform core.
  const edges = [
    { x: 40, y: 54 },
    { x: 40, y: 124 },
    { x: 40, y: 194 },
    { x: 40, y: 264 },
  ]
  const spine = [
    { x: 196, y: 94 },
    { x: 196, y: 224 },
  ]
  const core = { x: 348, y: 159 }

  return (
    <div className="relative w-full" aria-hidden="true">
      <div className="accent-glow pointer-events-none absolute inset-0 opacity-70" />

      <svg
        viewBox="0 0 430 320"
        className="relative w-full"
        fill="none"
        role="presentation"
      >
        <defs>
          <linearGradient id="hv-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--nv-blue-400)" stopOpacity="0.15" />
            <stop offset="55%" stopColor="var(--nv-blue-400)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--nv-blue-200)" stopOpacity="0.3" />
          </linearGradient>
          {/* The logo's orange, carried into the inbound connections so the
              diagram reads as the same identity as the mark. */}
          <linearGradient id="hv-line-spark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--nv-orange-500)" stopOpacity="0.1" />
            <stop offset="55%" stopColor="var(--nv-orange-500)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--nv-orange-400)" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="hv-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--nv-blue-200)" />
            <stop offset="100%" stopColor="var(--nv-blue-600)" />
          </radialGradient>
        </defs>

        {/* Edge → spine */}
        {edges.map((edge, i) => {
          const target = spine[i < 2 ? 0 : 1]
          const path = `M${edge.x + 26} ${edge.y} C ${edge.x + 90} ${edge.y}, ${target.x - 70} ${target.y}, ${target.x - 14} ${target.y}`
          return (
            <g key={`e${i}`}>
              <path d={path} stroke="var(--line-strong)" strokeWidth="1" />
              <path
                d={path}
                stroke="url(#hv-line-spark)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeDasharray="34 220"
                style={
                  reduced
                    ? { strokeDasharray: 'none', opacity: 0.55 }
                    : {
                        animation: `hv-flow 3.4s linear ${i * 0.42}s infinite`,
                      }
                }
              />
            </g>
          )
        })}

        {/* Spine → core */}
        {spine.map((node, i) => {
          const path = `M${node.x + 14} ${node.y} C ${node.x + 70} ${node.y}, ${core.x - 70} ${core.y}, ${core.x - 20} ${core.y}`
          return (
            <g key={`s${i}`}>
              <path d={path} stroke="var(--line-strong)" strokeWidth="1" />
              <path
                d={path}
                stroke="url(#hv-line)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="30 200"
                style={
                  reduced
                    ? { strokeDasharray: 'none', opacity: 0.6 }
                    : { animation: `hv-flow 2.8s linear ${0.9 + i * 0.5}s infinite` }
                }
              />
            </g>
          )
        })}

        {/* Edge systems */}
        {edges.map((edge, i) => (
          <g key={`en${i}`}>
            <rect
              x={edge.x - 26}
              y={edge.y - 13}
              width="52"
              height="26"
              rx="4"
              fill="var(--surface-raised)"
              stroke="var(--line-strong)"
              strokeWidth="1"
            />
            <rect
              x={edge.x - 16}
              y={edge.y - 4}
              width="22"
              height="2"
              rx="1"
              fill="var(--content-subtle)"
            />
            <rect
              x={edge.x - 16}
              y={edge.y + 1}
              width="14"
              height="2"
              rx="1"
              fill="var(--content-subtle)"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Integration spine */}
        {spine.map((node, i) => (
          <g key={`sn${i}`}>
            <rect
              x={node.x - 14}
              y={node.y - 30}
              width="28"
              height="60"
              rx="6"
              fill="var(--surface-raised)"
              stroke="var(--nv-orange-500)"
              strokeOpacity="0.5"
              strokeWidth="1.25"
            />
            <circle cx={node.x} cy={node.y} r="3.5" fill="var(--nv-orange-500)" />
          </g>
        ))}

        {/* Platform core */}
        <g>
          <circle
            cx={core.x}
            cy={core.y}
            r="52"
            stroke="var(--nv-blue-400)"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeDasharray="3 5"
            style={
              reduced
                ? undefined
                : {
                    animation: 'hv-spin 28s linear infinite',
                    transformOrigin: `${core.x}px ${core.y}px`,
                  }
            }
          />
          <circle cx={core.x} cy={core.y} r="34" fill="url(#hv-core)" fillOpacity="0.12" />
          <circle
            cx={core.x}
            cy={core.y}
            r="34"
            stroke="var(--nv-blue-400)"
            strokeOpacity="0.5"
            strokeWidth="1.25"
          />
          {/* The real NivaSync mark, at the centre of the system. The logo
              artwork is 1254 units square, scaled here to a 58px box. */}
          <g transform={`translate(${core.x - 29} ${core.y - 29}) scale(${58 / 1254})`}>
            <path fill="var(--logo-orange)" fillRule="evenodd" d={LOGO_PATH_ORANGE} />
            <path fill="var(--logo-blue)" fillRule="evenodd" d={LOGO_PATH_BLUE} />
          </g>
        </g>
      </svg>
    </div>
  )
}
