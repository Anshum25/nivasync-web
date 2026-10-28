import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'relative inline-flex items-center justify-center gap-2 font-medium ' +
  'rounded-[var(--radius-sm)] transition-[transform,background-color,border-color,color] ' +
  'duration-[var(--dur-base)] ease-[var(--ease-out-quint)] ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-55 ' +
  // 44px minimum touch target on every variant and size.
  'min-h-11'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-on hover:bg-accent-hover shadow-xs',
  secondary:
    'border border-line-strong bg-transparent text-content hover:border-accent hover:text-content-accent',
  ghost: 'text-content-accent hover:bg-surface-accent-soft',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-[0.9375rem]',
  lg: 'px-6 py-3.5 text-base',
}

interface CommonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  )
}

interface LinkButtonProps extends CommonProps {
  to: string
  /** External URLs get `rel="noopener noreferrer"` and an accessible hint. */
  external?: boolean
  'aria-label'?: string
}

/**
 * A button that navigates. Internal routes use react-router's <Link> so client
 * navigation works; external URLs use a plain anchor with safe rel attributes.
 */
export function LinkButton({
  children,
  to,
  external = false,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: LinkButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
        <ExternalIcon />
      </a>
    )
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {children}
    </Link>
  )
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={cn('h-4 w-4 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M6 3h7v7M13 3L5.5 10.5M12 9.5V13H3V4h3.5" strokeLinecap="round" />
    </svg>
  )
}
