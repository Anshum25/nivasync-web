import { useTheme } from '@/hooks/useTheme'

/**
 * Light/dark switch.
 *
 * It is a real <button> with an accurate `aria-pressed` state and a label that
 * says what it will do, not just what it is. The icon is decorative.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={
        'inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] ' +
        'text-content-muted transition-colors duration-[var(--dur-fast)] ' +
        'hover:bg-surface-sunken hover:text-content ' +
        (className ? ` ${className}` : '')
      }
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" fill="currentColor">
          <path d="M10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-11.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 2.5Zm0 13a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 15.5ZM2.5 10a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 2.5 10Zm13 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM4.4 4.4a.75.75 0 0 1 1.06 0l.7.7a.75.75 0 1 1-1.06 1.07l-.7-.71a.75.75 0 0 1 0-1.06Zm9.44 9.44a.75.75 0 0 1 1.06 0l.7.7a.75.75 0 1 1-1.06 1.06l-.7-.7a.75.75 0 0 1 0-1.06Zm1.76-9.44a.75.75 0 0 1 0 1.06l-.7.71a.75.75 0 1 1-1.07-1.07l.71-.7a.75.75 0 0 1 1.06 0ZM6.16 13.84a.75.75 0 0 1 0 1.06l-.7.7A.75.75 0 1 1 4.4 14.54l.7-.7a.75.75 0 0 1 1.06 0Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" fill="currentColor">
          <path d="M8.5 2.3a7.7 7.7 0 1 0 9.2 9.2A6.2 6.2 0 0 1 8.5 2.3Z" />
        </svg>
      )}
    </button>
  )
}
