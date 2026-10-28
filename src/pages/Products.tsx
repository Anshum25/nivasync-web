import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CardLink } from '@/components/ui/CardLink'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { SourceCallout } from '@/components/ui/SourceNote'
import { useSeo } from '@/lib/seo'
import { products } from '@/data/products'

export default function Products() {
  useSeo({
    title: 'Products & platforms',
    description:
      'SKYDOTERP, ITMS, SkyLMS, Course Management System, POS, MCX APIs and Frappe ' +
      'custom applications — the platforms NivaSync builds and operates.',
    path: '/products',
    breadcrumbs: [{ name: 'Products', path: '/products' }],
  })

  const active = products.filter((p) => p.availability === 'confirmed-active')
  const other = products.filter((p) => p.availability === 'unconfirmed')

  return (
    <>
      <PageHero
        eyebrow="Products & platforms"
        title="Platforms we own, not just projects we ship."
        lede="Seven products built on our own engineering. Two run on their own public domains; the rest are deployed and operated with the institutions that use them."
        breadcrumbs={[{ name: 'Products', path: '/products' }]}
      />

      <Section>
        <Reveal from="none">
          <Eyebrow>In active delivery</Eyebrow>
        </Reveal>
        <h2 className="mt-5 max-w-[26ch] text-[length:var(--text-h2)]">
          <MaskReveal>Deployed and operating today.</MaskReveal>
        </h2>

        <ul className="hairline-grid mt-12 grid sm:grid-cols-2 lg:grid-cols-4">
          {active.map((product, i) => (
            <Reveal key={product.slug} as="li" delay={i * 80} className="flex">
              <CardLink
                to={`/products/${product.slug}`}
                eyebrow={product.category}
                title={product.title}
                description={product.description}
                footer={product.externalUrl ? 'Has product site' : 'Product'}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="sunken" divided>
        <Reveal from="none">
          <Eyebrow>Also in our portfolio</Eyebrow>
        </Reveal>
        <h2 className="mt-5 max-w-[30ch] text-[length:var(--text-h2)]">
          <MaskReveal>Built, proven, available on request.</MaskReveal>
        </h2>

        <Reveal delay={120}>
          <SourceCallout className="mt-8 max-w-[64ch]">
            These are real products we have built and deployed. We are not currently
            publishing commercial availability, hosting or pricing for them, so please
            ask us about current status rather than assuming it from this page.
          </SourceCallout>
        </Reveal>

        <ul className="hairline-grid mt-12 grid sm:grid-cols-2 lg:grid-cols-3">
          {other.map((product, i) => (
            <Reveal key={product.slug} as="li" delay={i * 80} className="flex">
              <CardLink
                to={`/products/${product.slug}`}
                eyebrow={product.category}
                title={product.title}
                description={product.description}
                footer="Ask about availability"
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaSection
        headline="Want to see one of these working?"
        body="We can walk you through any of our platforms against your own process, rather than a scripted demo. Tell us which one and what you need it to handle."
      />
    </>
  )
}
