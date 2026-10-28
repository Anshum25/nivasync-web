import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '@/app/App'

/** Mounts the whole application at a given route, exactly as the browser would. */
export function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

/** Mounts a single component inside a router, for components that use <Link>. */
export function renderWithRouter(ui: ReactElement, options?: RenderOptions) {
  return render(<MemoryRouter>{ui}</MemoryRouter>, options)
}
