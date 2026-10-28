import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { LinkButton, ExternalIcon } from '@/components/ui/Button'
import { SourceCallout } from '@/components/ui/SourceNote'
import { PageHero } from '@/components/sections/PageHero'
import { CtaSection } from '@/components/sections/CtaSection'
import { BrandEcosystem } from '@/components/sections/BrandEcosystem'
import { NivaSyncMark, SkydotMark } from '@/components/brand/NivaSyncLogo'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { brands, ecosystemIntro } from '@/data/brands'
import { company } from '@/data/company'

/**
 * Brand ecosystem page.
 *
 * Language is deliberately conservative throughout: "brand of", never
 * "subsidiary", "division" or "group company". The relationship confirmed by the
 * company — and published in its own words on skydotinfotech.com — is
 * parent-company-to-brand, and this page asserts nothing beyond it.
 * See docs/BRAND_ARCHITECTURE.md §2.
 */
export default function Brands() {
  useSeo({
    title: 'Brand ecosystem',
    description:
      'NivaSync Infotech Pvt. Ltd. is the parent company. Skydot Infotech is its ' +
      'technology brand, alongside the SKYDOTERP and SkyLMS product brands.',
    path: '/brands',
    breadcrumbs: [{ name: 'Brand ecosystem', path: '/brands' }],
  })

  const skydot = brands.find((b) => b.id === 'skydot')

  return (
    <>
      <PageHero
        eyebrow={ecosystemIntro.label}
        title={ecosystemIntro.headline}
        lede={ecosystemIntro.body}
        breadcrumbs={[{ name: 'Brand ecosystem', path: '/brands' }]}
      />

      {/* The structure, drawn */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>The relationship</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-[22ch] text-[length:var(--text-h2)]">
              <MaskReveal>Parent company, operating brands.</MaskReveal>
            </h2>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[52ch] text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                NivaSync holds the engineering organisation: the delivery practice, the
                standards, and the long-term investment in our platforms. Each brand
                takes those capabilities to its own market with its own identity.
              </p>
            </Reveal>
          </div>

          {/* Structure diagram. Plain markup with a CSS rule, not an image, so it
              scales, themes, and is readable by assistive technology. */}
          <Reveal delay={160} from="left">
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface-sunken p-7 md:p-10">
              <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-line bg-surface px-5 py-4">
                <NivaSyncMark className="h-7 w-7 text-accent" />
                <span>
                  <span className="block font-display text-[1.0625rem] text-content">
                    {company.legalName}
                  </span>
                  <span className="block text-[0.8125rem] text-content-subtle">
                    Parent company
                  </span>
                </span>
              </div>

              <div
                aria-hidden="true"
                className="ml-7 h-7 w-px bg-line-strong"
              />

              <ul className="space-y-3">
                {brands.map((brand) => (
                  <li key={brand.id} className="flex items-center gap-4 pl-7">
                    <span aria-hidden="true" className="h-px w-5 shrink-0 bg-line-strong" />
                    <span className="flex flex-1 items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3">
                      {brand.id === 'skydot' ? (
                        <SkydotMark className="h-6 w-6" />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 rounded-[var(--radius-xs)]"
                          style={{
                            background: `linear-gradient(135deg, var(${brand.accentVar}), transparent 85%)`,
                          }}
                        />
                      )}
                      <span className="flex-1">
                        <span className="block text-[0.9375rem] font-medium text-content">
                          {brand.name}
                        </span>
                        <span className="block text-[0.8125rem] text-content-subtle">
                          {brand.role}
                        </span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Skydot, in focus */}
      {skydot ? (
        <Section tone="emphasis" className="tech-grid-bg" divided>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <Reveal from="none">
                <Eyebrow>In focus</Eyebrow>
              </Reveal>
              <div className="mt-6 flex items-center gap-4">
                <SkydotMark className="h-11 w-11" />
                <h2 className="font-display text-[length:var(--text-h2)]">{skydot.name}</h2>
              </div>
              <Reveal delay={140}>
                <p className="mt-3 text-[length:var(--text-body-lg)] text-content-accent">
                  {skydot.tagline}
                </p>
              </Reveal>
            </div>

            <Reveal delay={160} from="left">
              <blockquote className="border-l-2 border-accent pl-6 md:pl-8">
                <p className="font-display text-[length:var(--text-h3)] leading-snug text-content">
                  {skydot.summary}
                </p>
                <p className="mt-4 text-[0.8125rem] text-content-subtle">
                  Published by Skydot Infotech
                </p>
              </blockquote>

              <ul className="mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {skydot.focusAreas.map((area) => (
                  <li key={area} className="text-[0.9375rem] text-content-muted">
                    {area}
                  </li>
                ))}
              </ul>

              {skydot.externalUrl ? (
                <LinkButton to={skydot.externalUrl} external className="mt-9">
                  Visit skydotinfotech.com
                </LinkButton>
              ) : null}
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* All brands */}
      <Section divided>
        <div className="max-w-[44rem]">
          <Reveal from="none">
            <Eyebrow>The ecosystem</Eyebrow>
          </Reveal>
          <h2 className="mt-5 text-[length:var(--text-h2)]">
            <MaskReveal>Every brand, and what it covers.</MaskReveal>
          </h2>
        </div>
        <div className="mt-14">
          <BrandEcosystem />
        </div>
      </Section>

      {/* Product domains */}
      <Section tone="sunken" divided spacing="tight">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal from="none">
              <Eyebrow>Product domains</Eyebrow>
            </Reveal>
          </div>
          <div>
            <Reveal delay={100}>
              <p className="text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                Two of our platforms run on their own public domains. Both sit within the
                Skydot brand.
              </p>
              <ul className="mt-7 divide-y divide-line border-y border-line">
                {brands
                  .filter((b) => b.role === 'Product brand' && b.externalUrl)
                  .map((brand) => (
                    <li key={brand.id}>
                      <a
                        href={brand.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 py-4"
                      >
                        <span>
                          <span className="block text-[1.0625rem] text-content group-hover:text-content-accent">
                            {brand.name}
                          </span>
                          <span className="mt-0.5 block text-[0.8125rem] text-content-subtle">
                            {brand.tagline}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[0.9375rem] text-content-accent">
                          {new URL(brand.externalUrl as string).hostname.replace(/^www\./, '')}
                          <ExternalIcon />
                          <span className="sr-only">(opens in a new tab)</span>
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </Reveal>

            <Reveal delay={180}>
              <SourceCallout className="mt-9 max-w-[64ch]">
                {ecosystemIntro.legalNote}
              </SourceCallout>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaSection
        headline="Not sure which brand you need?"
        body="Start with us. We will route you to the right brand and the right team — or tell you straight away if it is not something we do."
      />
    </>
  )
}
