import { Link } from 'react-router-dom'

export interface Crumb {
  name: string
  path: string
}

/**
 * Visual breadcrumbs for detail pages. The matching BreadcrumbList structured
 * data is emitted by `useSeo`, so the visible trail and the machine-readable one
 * always come from the same array.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const items = [{ name: 'Home', path: '/' }, ...trail]

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-content-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-content">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link to={item.path} className="link-underline hover:text-content">
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-content-subtle">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
