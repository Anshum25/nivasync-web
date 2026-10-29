import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from 'react'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { LOGO_PATH_BLUE, LOGO_PATH_ORANGE } from '@/components/brand/logoPaths'

/* ─────────────────────────────────────────────────────────────────────────────
   Data
   ─────────────────────────────────────────────────────────────────────────── */

interface FlowItem {
  id: string
  title: string
  desc: string
  icon: string
}

const PROBLEMS: FlowItem[] = [
  {
    id: 'p1',
    title: 'Disconnected Systems',
    desc: 'Siloed applications that cannot share data',
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  },
  {
    id: 'p2',
    title: 'Manual Repetitive Work',
    desc: 'Staff time lost to avoidable administrative tasks',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    id: 'p3',
    title: 'Scattered Business Data',
    desc: 'No single source of truth across operations',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  },
  {
    id: 'p4',
    title: 'Slow Operational Workflows',
    desc: 'Approvals and processes bottlenecked by legacy steps',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'p5',
    title: 'Limited Business Visibility',
    desc: 'Decisions made without reliable real-time data',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
  {
    id: 'p6',
    title: 'Difficult System Integration',
    desc: 'Costly, fragile connections between third-party tools',
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    id: 'p7',
    title: 'Inconsistent Experiences',
    desc: 'Fragmented customer journeys across touchpoints',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
  },
  {
    id: 'p8',
    title: 'Scaling Bottlenecks',
    desc: 'Infrastructure that cannot grow with the organisation',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
]

const SOLUTIONS: FlowItem[] = [
  {
    id: 's1',
    title: 'Integrated Software Systems',
    desc: 'Unified platforms with seamless data exchange',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
  {
    id: 's2',
    title: 'Intelligent Automation',
    desc: 'Workflows that run reliably without manual effort',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    id: 's3',
    title: 'Unified Business Data',
    desc: 'A single, authoritative source of operational truth',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    id: 's4',
    title: 'Optimised Workflows',
    desc: 'Streamlined processes that reduce friction and delay',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    id: 's5',
    title: 'Real-Time Insights',
    desc: 'Live dashboards and reporting across every function',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    id: 's6',
    title: 'Connected Applications',
    desc: 'Resilient integrations across your entire stack',
    icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  {
    id: 's7',
    title: 'Improved Digital Experiences',
    desc: 'Consistent, purposeful interactions at every touchpoint',
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    id: 's8',
    title: 'Scalable Technology',
    desc: 'Architecture designed to grow alongside the business',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────────────────────────── */

interface Rect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

interface PathData {
  d: string
  id: string
  side: 'left' | 'right'
}

/* ─────────────────────────────────────────────────────────────────────────────
   Inline SVG icon helper
   ─────────────────────────────────────────────────────────────────────────── */

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: '1rem', height: '1rem', flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Problem card
   ─────────────────────────────────────────────────────────────────────────── */

interface CardProps {
  item: FlowItem
  index: number
  isActive: boolean
  isRelated: boolean
  side: 'problem' | 'solution'
  inView: boolean
  reduced: boolean
  onActivate: (id: string | null) => void
  dataId: string
}

function FlowCard({
  item,
  index,
  isActive,
  isRelated,
  side,
  inView,
  reduced,
  onActivate,
  dataId,
}: CardProps) {
  const isProblem = side === 'problem'

  const baseDelay = isProblem ? index * 60 : 600 + index * 60

  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'none'
          : isProblem
            ? 'translate3d(-12px, 0, 0)'
            : 'translate3d(12px, 0, 0)',
        transition: `opacity 500ms var(--ease-out-expo) ${baseDelay}ms, transform 500ms var(--ease-out-expo) ${baseDelay}ms`,
      }

  return (
    <div
      data-card-id={dataId}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onMouseEnter={() => onActivate(item.id)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(item.id)}
      onBlur={() => onActivate(null)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onActivate(isActive ? null : item.id)
      }}
      style={style}
      className={[
        'group relative flex cursor-pointer select-none items-start gap-3 rounded-[var(--radius-md)] border p-3 text-left outline-none',
        'transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-offset-1',
        isProblem
          ? [
              'border-[rgb(255_255_255/0.08)] bg-[rgb(7_12_22/0.6)]',
              isActive || isRelated
                ? 'border-[var(--nv-orange-500)] shadow-[0_0_16px_-4px_var(--nv-orange-500)] bg-[rgb(252_99_2/0.06)]'
                : 'hover:border-[rgb(252_99_2/0.35)] hover:bg-[rgb(252_99_2/0.04)]',
              'focus-visible:ring-[var(--nv-orange-400)]',
            ].join(' ')
          : [
              'border-[rgb(255_255_255/0.08)] bg-[rgb(2_75_177/0.08)]',
              isActive || isRelated
                ? 'border-[var(--nv-blue-400)] shadow-[0_0_16px_-4px_var(--nv-blue-400)] bg-[rgb(77_143_232/0.12)]'
                : 'hover:border-[rgb(77_143_232/0.35)] hover:bg-[rgb(77_143_232/0.06)]',
              'focus-visible:ring-[var(--nv-blue-400)]',
            ].join(' '),
      ].join(' ')}
    >
      {/* Icon pill */}
      <span
        className={[
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-200',
          isProblem
            ? isActive || isRelated
              ? 'bg-[rgb(252_99_2/0.2)] text-[var(--nv-orange-400)]'
              : 'bg-[rgb(255_255_255/0.06)] text-[var(--nv-slate-400)] group-hover:bg-[rgb(252_99_2/0.12)] group-hover:text-[var(--nv-orange-400)]'
            : isActive || isRelated
              ? 'bg-[rgb(77_143_232/0.25)] text-[var(--nv-blue-200)]'
              : 'bg-[rgb(255_255_255/0.06)] text-[var(--nv-slate-400)] group-hover:bg-[rgb(77_143_232/0.15)] group-hover:text-[var(--nv-blue-400)]',
        ].join(' ')}
      >
        <Icon d={item.icon} />
      </span>

      {/* Text */}
      <div className="min-w-0">
        <p
          className={[
            'text-[0.8125rem] font-semibold leading-snug transition-colors duration-200',
            isProblem
              ? isActive || isRelated
                ? 'text-[var(--nv-orange-200)]'
                : 'text-[var(--nv-slate-200)] group-hover:text-[var(--nv-orange-200)]'
              : isActive || isRelated
                ? 'text-[var(--nv-blue-100)]'
                : 'text-[var(--nv-slate-200)] group-hover:text-[var(--nv-blue-100)]',
          ].join(' ')}
        >
          {item.title}
        </p>
        <p className="mt-0.5 text-[0.6875rem] leading-relaxed text-[var(--nv-slate-400)] line-clamp-2">
          {item.desc}
        </p>
      </div>

      {/* Side connector dot */}
      <span
        aria-hidden="true"
        className={[
          'absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full transition-all duration-200',
          isProblem
            ? [
                '-right-[0.4rem]',
                isActive || isRelated
                  ? 'bg-[var(--nv-orange-500)] shadow-[0_0_6px_2px_var(--nv-orange-500)]'
                  : 'bg-[var(--nv-slate-600)]',
              ].join(' ')
            : [
                '-left-[0.4rem]',
                isActive || isRelated
                  ? 'bg-[var(--nv-blue-400)] shadow-[0_0_6px_2px_var(--nv-blue-400)]'
                  : 'bg-[var(--nv-slate-600)]',
              ].join(' '),
        ].join(' ')}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hub
   ─────────────────────────────────────────────────────────────────────────── */

function TransformationHub({
  inView,
  reduced,
}: {
  inView: boolean
  reduced: boolean
}) {
  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView ? 'scale(1)' : 'scale(0.88)',
        transition: 'opacity 700ms var(--ease-out-expo) 300ms, transform 700ms var(--ease-out-expo) 300ms',
      }

  return (
    <div className="flex flex-col items-center gap-4" style={style}>
      {/* Outer ring + hub */}
      <div className="relative flex items-center justify-center">
        {/* Outermost dashed orbit */}
        <div
          aria-hidden="true"
          className="absolute h-52 w-52 rounded-full border border-dashed border-[rgb(77_143_232/0.18)]"
          style={
            reduced
              ? undefined
              : { animation: 'tf-spin 40s linear infinite', animationPlayState: inView ? 'running' : 'paused' }
          }
        />

        {/* Second ring */}
        <div
          aria-hidden="true"
          className="absolute h-44 w-44 rounded-full border border-[rgb(77_143_232/0.12)]"
        />

        {/* Glow backdrop */}
        <div
          aria-hidden="true"
          className="absolute h-36 w-36 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgb(77 143 232 / 0.18) 0%, transparent 70%)',
            animation: reduced
              ? undefined
              : inView
                ? 'tf-pulse 3s ease-in-out infinite'
                : undefined,
          }}
        />

        {/* Inner circle */}
        <div
          className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[rgb(77_143_232/0.35)] bg-[rgb(2_12_32/0.9)]"
          style={{
            boxShadow:
              '0 0 0 1px rgb(77 143 232 / 0.15), 0 0 32px -8px rgb(2 75 177 / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.06)',
          }}
        >
          {/* Orange accent ring segment */}
          <svg
            viewBox="0 0 128 128"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="var(--nv-orange-500)"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              strokeDasharray="48 330"
              strokeDashoffset="-120"
              strokeLinecap="round"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="var(--nv-blue-400)"
              strokeWidth="1"
              strokeOpacity="0.25"
              strokeDasharray="80 330"
              strokeDashoffset="40"
              strokeLinecap="round"
            />
          </svg>

          {/* NivaSync logo mark */}
          <svg
            viewBox="0 0 1254 1254"
            aria-label="NivaSync Infotech"
            focusable="false"
            style={{ width: '3.5rem', height: '3.5rem' }}
          >
            <path
              fill="var(--nv-orange-500)"
              fillRule="evenodd"
              d={LOGO_PATH_ORANGE}
            />
            <path
              fill="var(--nv-blue-400)"
              fillRule="evenodd"
              d={LOGO_PATH_BLUE}
            />
          </svg>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p
          className="text-[0.625rem] font-bold tracking-[0.18em] uppercase text-[var(--nv-slate-400)]"
          aria-label="NivaSync Transformation Hub"
        >
          NivaSync
        </p>
        <p className="text-[0.5625rem] tracking-[0.12em] uppercase text-[var(--nv-slate-500)]">
          Transformation Hub
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG paths canvas (desktop only)
   ─────────────────────────────────────────────────────────────────────────── */

interface ConnectionsProps {
  paths: PathData[]
  activeId: string | null
  inView: boolean
  reduced: boolean
}

function Connections({ paths, activeId, inView, reduced }: ConnectionsProps) {
  // Map item id → whether it's a problem or solution
  const problemIds = new Set(PROBLEMS.map((p) => p.id))
  const solutionIds = new Set(SOLUTIONS.map((s) => s.id))

  const getRelatedSolution = (pid: string) => {
    const idx = PROBLEMS.findIndex((p) => p.id === pid)
    return idx >= 0 ? SOLUTIONS[idx]?.id : null
  }
  const getRelatedProblem = (sid: string) => {
    const idx = SOLUTIONS.findIndex((s) => s.id === sid)
    return idx >= 0 ? PROBLEMS[idx]?.id : null
  }

  const isHighlighted = (pathId: string) => {
    if (!activeId) return false
    if (pathId === activeId) return true
    if (problemIds.has(activeId)) {
      const related = getRelatedSolution(activeId)
      return pathId === related
    }
    if (solutionIds.has(activeId)) {
      const related = getRelatedProblem(activeId)
      return pathId === related
    }
    return false
  }

  if (paths.length === 0) return null

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="tf-grad-in" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--nv-orange-500)" stopOpacity="0.05" />
          <stop offset="60%" stopColor="var(--nv-orange-500)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--nv-blue-400)" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="tf-grad-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--nv-blue-400)" stopOpacity="0.4" />
          <stop offset="40%" stopColor="var(--nv-blue-400)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--nv-blue-400)" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="tf-grad-in-hot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--nv-orange-400)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--nv-orange-400)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--nv-orange-400)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="tf-grad-out-hot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--nv-blue-300)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="var(--nv-blue-200)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--nv-blue-200)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {paths.map((path, i) => {
        const hot = isHighlighted(path.id)
        const isLeft = path.side === 'left'
        const baseGrad = isLeft ? 'url(#tf-grad-in)' : 'url(#tf-grad-out)'
        const hotGrad = isLeft ? 'url(#tf-grad-in-hot)' : 'url(#tf-grad-out-hot)'
        const animDelay = isLeft ? i * 0.18 : 0.6 + i * 0.18
        const dashLen = isLeft ? 28 : 32
        const totalLen = 280

        return (
          <g key={path.id}>
            {/* Base track */}
            <path
              d={path.d}
              stroke={hot ? (isLeft ? 'var(--nv-orange-500)' : 'var(--nv-blue-400)') : 'rgb(255 255 255 / 0.06)'}
              strokeWidth={hot ? 1.5 : 1}
              fill="none"
              style={{ transition: 'stroke 300ms, stroke-width 300ms' }}
            />

            {/* Animated particle */}
            {!reduced && inView && (
              <path
                d={path.d}
                stroke={hot ? hotGrad : baseGrad}
                strokeWidth={hot ? 2.5 : 1.5}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${dashLen} ${totalLen}`}
                style={{
                  animation: `tf-flow ${isLeft ? '2.8s' : '3.2s'} linear ${animDelay}s infinite`,
                }}
              />
            )}

            {/* Static shimmer for reduced-motion */}
            {reduced && (
              <path
                d={path.d}
                stroke={hot ? hotGrad : baseGrad}
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
                opacity={0.5}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mobile layout — vertical stack
   ─────────────────────────────────────────────────────────────────────────── */

function MobileFlow({
  inView,
  reduced,
}: {
  inView: boolean
  reduced: boolean
}) {
  const makeStyle = (delay: number): CSSProperties =>
    reduced
      ? {}
      : {
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translate3d(0, 12px, 0)',
          transition: `opacity 500ms var(--ease-out-expo) ${delay}ms, transform 500ms var(--ease-out-expo) ${delay}ms`,
        }

  const Arrow = () => (
    <div className="flex justify-center py-3" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--nv-blue-400)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '1.25rem', height: '1.25rem', opacity: 0.5 }}
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </div>
  )

  return (
    <div className="space-y-1">
      {/* Problems */}
      <div style={makeStyle(0)}>
        <p className="mb-2 text-center text-[0.625rem] font-bold tracking-[0.16em] uppercase text-[var(--nv-orange-400)]">
          Business Challenges
        </p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-[rgb(255_255_255/0.07)] bg-[rgb(7_12_22/0.5)] px-3 py-2.5"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[rgb(252_99_2/0.12)] text-[var(--nv-orange-400)]">
                <Icon d={p.icon} />
              </span>
              <p className="text-[0.8125rem] font-medium text-[var(--nv-slate-200)]">{p.title}</p>
            </div>
          ))}
        </div>
      </div>

      <Arrow />

      {/* Hub */}
      <div style={makeStyle(200)} className="flex justify-center">
        <TransformationHub inView={inView} reduced={reduced} />
      </div>

      <Arrow />

      {/* Solutions */}
      <div style={makeStyle(400)}>
        <p className="mb-2 text-center text-[0.625rem] font-bold tracking-[0.16em] uppercase text-[var(--nv-blue-400)]">
          Better Solutions
        </p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-[rgb(77_143_232/0.15)] bg-[rgb(2_75_177/0.06)] px-3 py-2.5"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[rgb(77_143_232/0.15)] text-[var(--nv-blue-400)]">
                <Icon d={s.icon} />
              </span>
              <p className="text-[0.8125rem] font-medium text-[var(--nv-slate-200)]">{s.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Desktop layout — three-column with SVG connections
   ─────────────────────────────────────────────────────────────────────────── */

function DesktopFlow({
  inView,
  reduced,
}: {
  inView: boolean
  reduced: boolean
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [paths, setPaths] = useState<PathData[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const problemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const solutionRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const measurePaths = useCallback(() => {
    const container = containerRef.current
    const hub = hubRef.current
    if (!container || !hub) return

    const containerRect = container.getBoundingClientRect()

    const getRelative = (el: HTMLElement): Rect => {
      const r = el.getBoundingClientRect()
      return {
        left: r.left - containerRect.left,
        top: r.top - containerRect.top,
        right: r.right - containerRect.left,
        bottom: r.bottom - containerRect.top,
        width: r.width,
        height: r.height,
      }
    }

    const hubRect = getRelative(hub)
    const hubCX = hubRect.left + hubRect.width / 2
    const hubCY = hubRect.top + hubRect.height / 2

    const newPaths: PathData[] = []

    problemRefs.current.forEach((el, id) => {
      const r = getRelative(el)
      const startX = r.right
      const startY = r.top + r.height / 2
      // Curve from card right edge → hub left
      const cp1x = startX + (hubCX - startX) * 0.55
      const cp1y = startY
      const cp2x = hubCX - (hubCX - startX) * 0.35
      const cp2y = hubCY
      const endX = hubCX - hubRect.width * 0.42
      const endY = hubCY
      newPaths.push({
        id,
        side: 'left',
        d: `M${startX} ${startY} C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`,
      })
    })

    solutionRefs.current.forEach((el, id) => {
      const r = getRelative(el)
      const endX = r.left
      const endY = r.top + r.height / 2
      const startX = hubCX + hubRect.width * 0.42
      const startY = hubCY
      const cp1x = startX + (endX - startX) * 0.35
      const cp1y = startY
      const cp2x = startX + (endX - startX) * 0.55
      const cp2y = endY
      newPaths.push({
        id,
        side: 'right',
        d: `M${startX} ${startY} C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`,
      })
    })

    setPaths(newPaths)
  }, [])

  // Measure after layout + on resize
  useEffect(() => {
    if (!inView) return
    const raf = requestAnimationFrame(() => {
      measurePaths()
    })

    const ro = new ResizeObserver(() => measurePaths())
    if (containerRef.current) ro.observe(containerRef.current)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [inView, measurePaths])

  const setProblemRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) problemRefs.current.set(id, el)
    else problemRefs.current.delete(id)
  }, [])

  const setSolutionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) solutionRefs.current.set(id, el)
    else solutionRefs.current.delete(id)
  }, [])

  // Determine related ids for highlighting
  const relatedIds = (() => {
    if (!activeId) return new Set<string>()
    const problemIdx = PROBLEMS.findIndex((p) => p.id === activeId)
    const solutionIdx = SOLUTIONS.findIndex((s) => s.id === activeId)
    const set = new Set<string>()
    if (problemIdx >= 0 && SOLUTIONS[problemIdx]) set.add(SOLUTIONS[problemIdx].id)
    if (solutionIdx >= 0 && PROBLEMS[solutionIdx]) set.add(PROBLEMS[solutionIdx].id)
    return set
  })()

  return (
    <div ref={containerRef} className="relative">
      {/* SVG connection layer — absolutely positioned, below cards */}
      <Connections
        paths={paths}
        activeId={activeId}
        inView={inView}
        reduced={reduced}
      />

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-10" style={{ zIndex: 2 }}>
        {/* ── LEFT: Problems ── */}
        <div className="flex flex-col gap-2">
          <p className="mb-1.5 text-[0.625rem] font-bold tracking-[0.18em] uppercase text-[var(--nv-orange-400)]">
            Business Challenges
          </p>
          {PROBLEMS.map((p, i) => (
            <div
              key={p.id}
              ref={setProblemRef(p.id)}
            >
              <FlowCard
                item={p}
                index={i}
                isActive={activeId === p.id}
                isRelated={relatedIds.has(p.id)}
                side="problem"
                inView={inView}
                reduced={reduced}
                onActivate={setActiveId}
                dataId={p.id}
              />
            </div>
          ))}
        </div>

        {/* ── CENTER: Hub ── */}
        <div ref={hubRef} className="flex shrink-0 flex-col items-center">
          <TransformationHub inView={inView} reduced={reduced} />
        </div>

        {/* ── RIGHT: Solutions ── */}
        <div className="flex flex-col gap-2">
          <p className="mb-1.5 text-[0.625rem] font-bold tracking-[0.18em] uppercase text-[var(--nv-blue-400)]">
            Connected Solutions
          </p>
          {SOLUTIONS.map((s, i) => (
            <div
              key={s.id}
              ref={setSolutionRef(s.id)}
            >
              <FlowCard
                item={s}
                index={i}
                isActive={activeId === s.id}
                isRelated={relatedIds.has(s.id)}
                side="solution"
                inView={inView}
                reduced={reduced}
                onActivate={setActiveId}
                dataId={s.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Root export
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * TransformationFlow
 *
 * Premium three-part visualisation: Business Challenges → NivaSync Hub →
 * Connected Solutions. Designed for the NivaSync Infotech homepage.
 *
 * - Desktop: three-column layout with SVG curved connection paths and
 *   animated particle flow. Cards are interactive; hovering a problem
 *   highlights its matching solution path (and vice versa).
 * - Mobile: vertical stack with simple arrows. No SVG paths (too narrow).
 * - Reduced-motion: all animations removed; content renders in final state.
 * - Accessibility: cards use role="button" + aria-pressed, keyboard-navigable.
 * - No new dependencies — uses only existing hooks and brand assets.
 */
export function TransformationFlow() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05, rootMargin: '0px' })
  const reduced = usePrefersReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 64rem)')

  const sectionStyle: CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transition: 'opacity 600ms var(--ease-out-expo)',
      }

  return (
    <section
      ref={ref}
      aria-label="From business complexity to connected solutions"
      className="relative overflow-hidden py-[var(--section-y)]"
      style={{
        background:
          'linear-gradient(180deg, var(--nv-ink-950) 0%, var(--nv-ink-900) 40%, var(--nv-ink-800) 100%)',
      }}
    >
      {/* Subtle tech grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(77 143 232 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgb(77 143 232 / 0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgb(2 75 177 / 0.12) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter)]"
        style={sectionStyle}
      >
        {/* Section header */}
        <div className="mb-12 text-center lg:mb-16">
          <p
            className="mb-4 inline-flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-[var(--nv-orange-400)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(8px)',
              transition: 'opacity 500ms var(--ease-out-expo) 60ms, transform 500ms var(--ease-out-expo) 60ms',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: '1.5rem',
                height: '2px',
                backgroundColor: 'var(--nv-orange-500)',
              }}
            />
            How We Work
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: '1.5rem',
                height: '2px',
                backgroundColor: 'var(--nv-orange-500)',
              }}
            />
          </p>

          <h2
            className="font-display text-[length:var(--text-h2)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-display)] text-[var(--nv-slate-50)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(10px)',
              transition: 'opacity 600ms var(--ease-out-expo) 120ms, transform 600ms var(--ease-out-expo) 120ms',
            }}
          >
            From Business Complexity
            <br />
            <span className="text-[var(--nv-blue-400)]">to Connected Solutions</span>
          </h2>

          <p
            className="mx-auto mt-5 max-w-[52ch] text-[length:var(--text-body-lg)] leading-relaxed text-[var(--nv-slate-400)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(8px)',
              transition: 'opacity 500ms var(--ease-out-expo) 200ms, transform 500ms var(--ease-out-expo) 200ms',
            }}
          >
            We help businesses turn disconnected systems and operational challenges
            into more connected, intelligent digital experiences.
          </p>
        </div>

        {/* Visualization */}
        {isDesktop ? (
          <DesktopFlow inView={inView} reduced={reduced} />
        ) : (
          <MobileFlow inView={inView} reduced={reduced} />
        )}
      </div>

      {/* CSS keyframes via style tag — scoped to this component's page position */}
      <style>{`
        @keyframes tf-flow {
          from { stroke-dashoffset: 320; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes tf-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes tf-pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.96); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes tf-flow  { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 0; } }
          @keyframes tf-spin  { to { transform: none; } }
          @keyframes tf-pulse { 0%, 100% { opacity: 0.6; } }
        }
      `}</style>
    </section>
  )
}
