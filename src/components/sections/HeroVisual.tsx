import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { LOGO_PATH_BLUE, LOGO_PATH_ORANGE } from '@/components/brand/logoPaths'

/**
 * HeroVisual — premium systems-diagram illustration.
 *
 * Redesigned from the original placeholder to show labelled system nodes,
 * a richer integration hub with the real NivaSync mark, animated particle
 * flow along every connection path, and layered depth rings.
 *
 * Design decisions:
 *  - Pure inline SVG: zero network requests, no WebGL, no extra deps.
 *  - Animates only stroke-dashoffset, opacity and transform — all compositor.
 *  - Under prefers-reduced-motion everything renders in its final, visible
 *    state: no hidden content, no frozen mid-animation elements.
 *  - aria-hidden: the diagram is decorative; the headline carries the meaning.
 */
export function HeroVisual() {
  const reduced = usePrefersReducedMotion()

  // ── Layout constants ───────────────────────────────────────────────────────
  const W = 480
  const H = 340
  const cx = 348   // hub centre X
  const cy = H / 2 // hub centre Y  (170)

  // Left-column system cards: { cx, cy, label, sub, isOrange }
  const cards = [
    { x: 48,  y: 52,  label: 'ERP Systems',       sub: 'Business core',    accent: true  },
    { x: 48,  y: 122, label: 'CRM & Sales',        sub: 'Customer data',    accent: false },
    { x: 48,  y: 192, label: 'Field Operations',   sub: 'On-site workflows', accent: false },
    { x: 48,  y: 262, label: 'Analytics Layer',    sub: 'Reporting & BI',   accent: true  },
  ]

  // Mid-tier aggregator nodes (the old "spine")
  const spine = [
    { x: 218, y: 100 },
    { x: 218, y: 240 },
  ]

  // Card size
  const CW = 104
  const CH = 36

  // Hub radii
  const R_OUTER_DASH = 60
  const R_INNER_FILL = 42
  const R_CORE       = 42
  const LOGO_SIZE    = 62  // visual px of the mark inside the hub

  // ── Path builders ──────────────────────────────────────────────────────────
  // Card right-edge → spine node
  const cardToSpine = (card: typeof cards[0], sp: typeof spine[0]) => {
    const x0 = card.x + CW / 2
    const y0 = card.y
    const x1 = sp.x - 9
    const y1 = sp.y
    return `M${x0} ${y0} C${x0 + 55} ${y0} ${x1 - 40} ${y1} ${x1} ${y1}`
  }

  // Spine node → hub left edge
  const spineToHub = (sp: typeof spine[0]) => {
    const x0 = sp.x + 9
    const y0 = sp.y
    const x1 = cx - R_CORE
    const y1 = cy
    return `M${x0} ${y0} C${x0 + 50} ${y0} ${x1 - 40} ${y1} ${x1} ${y1}`
  }

  return (
    <div className="relative w-full select-none" aria-hidden="true">
      {/* Ambient glow behind the whole visual */}
      <div
        className="accent-glow pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 75% 50%, color-mix(in oklab, var(--nv-blue-500) 22%, transparent) 0%, transparent 70%)',
        }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative w-full"
        fill="none"
        role="presentation"
      >
        {/* ── Defs ── */}
        <defs>
          {/* Card → spine: orange sparks */}
          <linearGradient id="hv2-spark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--nv-orange-500)" stopOpacity="0.05" />
            <stop offset="50%"  stopColor="var(--nv-orange-500)" stopOpacity="0.9"  />
            <stop offset="100%" stopColor="var(--nv-orange-400)" stopOpacity="0.3"  />
          </linearGradient>
          {/* Spine → hub: blue flow */}
          <linearGradient id="hv2-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--nv-blue-400)" stopOpacity="0.1"  />
            <stop offset="55%"  stopColor="var(--nv-blue-400)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--nv-blue-200)" stopOpacity="0.3"  />
          </linearGradient>
          {/* Hub fill */}
          <radialGradient id="hv2-hub" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="var(--nv-blue-500)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--nv-blue-800)" stopOpacity="0.06" />
          </radialGradient>
          {/* Outer glow ring */}
          <radialGradient id="hv2-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="var(--nv-blue-400)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--nv-blue-400)" stopOpacity="0"    />
          </radialGradient>
          {/* Card surface */}
          <filter id="hv2-card-shadow" x="-10%" y="-20%" width="120%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--nv-ink-950)" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════════
            LAYER 1 — base track lines (muted)
            ══════════════════════════════════════════════════ */}
        {cards.map((card, i) => {
          const sp = spine[i < 2 ? 0 : 1]
          return (
            <path
              key={`bt-c${i}`}
              d={cardToSpine(card, sp)}
              stroke="var(--line-strong)"
              strokeWidth="1"
              opacity="0.5"
            />
          )
        })}
        {spine.map((sp, i) => (
          <path
            key={`bt-s${i}`}
            d={spineToHub(sp)}
            stroke="var(--line-strong)"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* ══════════════════════════════════════════════════
            LAYER 2 — animated particle flows
            ══════════════════════════════════════════════════ */}
        {cards.map((card, i) => {
          const sp = spine[i < 2 ? 0 : 1]
          const d  = cardToSpine(card, sp)
          const delay = i * 0.38
          return (
            <path
              key={`pf-c${i}`}
              d={d}
              stroke="url(#hv2-spark)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="26 200"
              style={
                reduced
                  ? { strokeDasharray: 'none', opacity: 0.45 }
                  : { animation: `hv-flow 3.2s linear ${delay}s infinite` }
              }
            />
          )
        })}
        {spine.map((sp, i) => {
          const d = spineToHub(sp)
          return (
            <path
              key={`pf-s${i}`}
              d={d}
              stroke="url(#hv2-flow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="28 180"
              style={
                reduced
                  ? { strokeDasharray: 'none', opacity: 0.55 }
                  : { animation: `hv-flow 2.6s linear ${0.8 + i * 0.6}s infinite` }
              }
            />
          )
        })}

        {/* ══════════════════════════════════════════════════
            LAYER 3 — spine aggregator nodes
            ══════════════════════════════════════════════════ */}
        {spine.map((sp, i) => (
          <g key={`sp${i}`}>
            {/* Body */}
            <rect
              x={sp.x - 9}
              y={sp.y - 26}
              width="18"
              height="52"
              rx="5"
              fill="var(--surface-raised)"
              stroke="var(--nv-orange-500)"
              strokeOpacity="0.55"
              strokeWidth="1.2"
              filter="url(#hv2-card-shadow)"
            />
            {/* Dot */}
            <circle
              cx={sp.x}
              cy={sp.y}
              r="4"
              fill="var(--nv-orange-500)"
              style={
                reduced
                  ? undefined
                  : { animation: `hv2-dot-pulse 2.4s ease-in-out ${i * 1.1}s infinite` }
              }
            />
            {/* Tick marks */}
            <rect x={sp.x - 4} y={sp.y - 15} width="8" height="1.5" rx="0.75" fill="var(--nv-orange-400)" opacity="0.55" />
            <rect x={sp.x - 4} y={sp.y - 11} width="5" height="1.5" rx="0.75" fill="var(--nv-orange-400)" opacity="0.35" />
            <rect x={sp.x - 4} y={sp.y + 10} width="8" height="1.5" rx="0.75" fill="var(--nv-orange-400)" opacity="0.55" />
            <rect x={sp.x - 4} y={sp.y + 14} width="5" height="1.5" rx="0.75" fill="var(--nv-orange-400)" opacity="0.35" />
          </g>
        ))}

        {/* ══════════════════════════════════════════════════
            LAYER 4 — system cards (edge nodes)
            ══════════════════════════════════════════════════ */}
        {cards.map((card, i) => {
          const rx = card.x - CW / 2
          const ry = card.y - CH / 2
          return (
            <g key={`card${i}`}>
              {/* Card body */}
              <rect
                x={rx}
                y={ry}
                width={CW}
                height={CH}
                rx="6"
                fill="var(--surface-raised)"
                stroke={card.accent ? 'var(--nv-orange-500)' : 'var(--line-strong)'}
                strokeOpacity={card.accent ? 0.5 : 0.8}
                strokeWidth="1"
                filter="url(#hv2-card-shadow)"
              />

              {/* Left accent bar */}
              <rect
                x={rx + 1}
                y={ry + 6}
                width="2.5"
                height={CH - 12}
                rx="1.25"
                fill={card.accent ? 'var(--nv-orange-500)' : 'var(--nv-blue-400)'}
                opacity="0.8"
              />

              {/* Label */}
              <text
                x={rx + 12}
                y={card.y - 4}
                fontSize="7.5"
                fontWeight="600"
                fill="var(--content)"
                fontFamily="var(--font-display)"
                letterSpacing="-0.01em"
              >
                {card.label}
              </text>
              {/* Sub-label */}
              <text
                x={rx + 12}
                y={card.y + 7}
                fontSize="6"
                fill="var(--content-subtle)"
                fontFamily="var(--font-body)"
              >
                {card.sub}
              </text>

              {/* Right dot connector */}
              <circle
                cx={rx + CW - 5}
                cy={card.y}
                r="2.5"
                fill={card.accent ? 'var(--nv-orange-500)' : 'var(--nv-blue-400)'}
                opacity="0.7"
              />
            </g>
          )
        })}

        {/* ══════════════════════════════════════════════════
            LAYER 5 — platform hub
            ══════════════════════════════════════════════════ */}
        <g>
          {/* Outermost ambient glow disc */}
          <circle cx={cx} cy={cy} r={R_OUTER_DASH + 22} fill="url(#hv2-glow)" />

          {/* Outer dashed orbit ring */}
          <circle
            cx={cx}
            cy={cy}
            r={R_OUTER_DASH}
            stroke="var(--nv-blue-400)"
            strokeOpacity="0.2"
            strokeWidth="1"
            strokeDasharray="3 6"
            style={
              reduced
                ? undefined
                : {
                    animation: 'hv-spin 32s linear infinite',
                    transformOrigin: `${cx}px ${cy}px`,
                  }
            }
          />

          {/* Second ring */}
          <circle
            cx={cx}
            cy={cy}
            r={R_INNER_FILL + 8}
            stroke="var(--nv-blue-400)"
            strokeOpacity="0.12"
            strokeWidth="1"
          />

          {/* Orange accent arc */}
          <circle
            cx={cx}
            cy={cy}
            r={R_INNER_FILL + 8}
            stroke="var(--nv-orange-500)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="22 220"
            strokeDashoffset="-60"
            strokeLinecap="round"
            style={
              reduced
                ? undefined
                : {
                    animation: 'hv-spin 18s linear infinite reverse',
                    transformOrigin: `${cx}px ${cy}px`,
                  }
            }
          />

          {/* Hub fill circle */}
          <circle
            cx={cx}
            cy={cy}
            r={R_INNER_FILL}
            fill="url(#hv2-hub)"
            style={
              reduced
                ? undefined
                : { animation: `hv2-pulse 3s ease-in-out infinite` }
            }
          />

          {/* Hub border */}
          <circle
            cx={cx}
            cy={cy}
            r={R_CORE}
            stroke="var(--nv-blue-400)"
            strokeOpacity="0.5"
            strokeWidth="1.25"
          />

          {/* Blue accent arc on hub border */}
          <circle
            cx={cx}
            cy={cy}
            r={R_CORE}
            stroke="var(--nv-blue-200)"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            strokeDasharray="18 240"
            strokeDashoffset="30"
            strokeLinecap="round"
          />

          {/* NivaSync mark — centred in hub */}
          <g
            transform={`translate(${cx - LOGO_SIZE / 2} ${cy - LOGO_SIZE / 2}) scale(${LOGO_SIZE / 1254})`}
          >
            <path fill="var(--logo-orange)" fillRule="evenodd" d={LOGO_PATH_ORANGE} />
            <path fill="var(--logo-blue)"   fillRule="evenodd" d={LOGO_PATH_BLUE}   />
          </g>
        </g>

        {/* ══════════════════════════════════════════════════
            LAYER 6 — floating status badge (top-right)
            ══════════════════════════════════════════════════ */}
        <g
          style={
            reduced
              ? undefined
              : { animation: 'hv2-float 4s ease-in-out 0.5s infinite' }
          }
        >
          <rect
            x={cx + 52}
            y={cy - 64}
            width="74"
            height="26"
            rx="6"
            fill="var(--surface-raised)"
            stroke="var(--nv-blue-400)"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <circle cx={cx + 60} cy={cy - 51} r="3.5" fill="var(--nv-blue-400)" opacity="0.8" />
          <text x={cx + 68} y={cy - 54} fontSize="6.5" fontWeight="600" fill="var(--content)" fontFamily="var(--font-display)">
            Systems live
          </text>
          <text x={cx + 68} y={cy - 45} fontSize="5.5" fill="var(--content-subtle)" fontFamily="var(--font-body)">
            All integrations active
          </text>
        </g>

        {/* Floating metric badge (bottom-right) */}
        <g
          style={
            reduced
              ? undefined
              : { animation: 'hv2-float 3.6s ease-in-out 1.4s infinite' }
          }
        >
          <rect
            x={cx + 52}
            y={cy + 38}
            width="72"
            height="26"
            rx="6"
            fill="var(--surface-raised)"
            stroke="var(--nv-orange-500)"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <circle cx={cx + 60} cy={cy + 51} r="3.5" fill="var(--nv-orange-500)" opacity="0.8" />
          <text x={cx + 68} y={cy + 48} fontSize="6.5" fontWeight="600" fill="var(--content)" fontFamily="var(--font-display)">
            30+ deployments
          </text>
          <text x={cx + 68} y={cy + 58} fontSize="5.5" fill="var(--content-subtle)" fontFamily="var(--font-body)">
            Verified institutions
          </text>
        </g>
      </svg>

      {/* Scoped keyframes — complement the global hv-flow & hv-spin in index.css */}
      <style>{`
        @keyframes hv2-pulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1;   }
        }
        @keyframes hv2-dot-pulse {
          0%, 100% { r: 4;   opacity: 0.9; }
          50%       { r: 5.5; opacity: 1;   }
        }
        @keyframes hv2-float {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-4px);  }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes hv2-pulse     { 0%, 100% { opacity: 0.85; } }
          @keyframes hv2-dot-pulse { 0%, 100% { r: 4; opacity: 0.9; } }
          @keyframes hv2-float     { 0%, 100% { transform: none; } }
        }
      `}</style>
    </div>
  )
}
