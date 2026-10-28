import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Width = 'default' | 'narrow' | 'prose' | 'full'

const widths: Record<Width, string> = {
  default: 'max-w-[var(--container-max)]',
  narrow: 'max-w-[var(--container-narrow)]',
  prose: 'max-w-[var(--container-prose)]',
  full: 'max-w-none',
}

interface ContainerProps {
  children: ReactNode
  width?: Width
  as?: ElementType
  className?: string
}

/** Horizontal rhythm for the whole site. The gutter is a token, not a guess. */
export function Container({
  children,
  width = 'default',
  as: Tag = 'div',
  className,
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-[var(--gutter)]', widths[width], className)}>
      {children}
    </Tag>
  )
}
