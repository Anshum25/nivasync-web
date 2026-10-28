import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { redirects } from './routes'

/**
 * Every page is code-split EXCEPT the homepage.
 *
 * Home is imported eagerly and deliberately. It is the most common entry point,
 * and splitting it meant the first paint showed the short Suspense fallback and
 * then swapped in a full-length page — which pushed the footer down the
 * viewport and registered as a 0.11 Cumulative Layout Shift. Its chunk is ~15 kB,
 * so folding it into the initial bundle costs little and removes the shift.
 *
 * Every other route stays lazy: nothing else is downloaded until it is asked for.
 */
import Home from '@/pages/Home'
const About = lazy(() => import('@/pages/About'))
const Capabilities = lazy(() => import('@/pages/Capabilities'))
const CapabilityDetail = lazy(() => import('@/pages/CapabilityDetail'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Industries = lazy(() => import('@/pages/Industries'))
const IndustryDetail = lazy(() => import('@/pages/IndustryDetail'))
const Brands = lazy(() => import('@/pages/Brands'))
const Work = lazy(() => import('@/pages/Work'))
const CaseStudyDetail = lazy(() => import('@/pages/CaseStudyDetail'))
const Insights = lazy(() => import('@/pages/Insights'))
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'))
const Careers = lazy(() => import('@/pages/Careers'))
const Contact = lazy(() => import('@/pages/Contact'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const Terms = lazy(() => import('@/pages/Terms'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Route tree, exported separately so tests can mount it under a MemoryRouter. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />

        <Route path="capabilities" element={<Capabilities />} />
        <Route path="capabilities/:slug" element={<CapabilityDetail />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />

        <Route path="industries" element={<Industries />} />
        <Route path="industries/:slug" element={<IndustryDetail />} />

        <Route path="brands" element={<Brands />} />

        <Route path="work" element={<Work />} />
        <Route path="work/:slug" element={<CaseStudyDetail />} />

        <Route path="insights" element={<Insights />} />
        <Route path="insights/:slug" element={<ArticleDetail />} />

        <Route path="careers" element={<Careers />} />
        <Route path="contact" element={<Contact />} />

        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />

        {redirects.map(({ from, to }) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
