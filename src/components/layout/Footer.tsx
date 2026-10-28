import { Link } from 'react-router-dom'
import { NivaSyncLogo } from '@/components/brand/NivaSyncLogo'
import { ExternalIcon } from '@/components/ui/Button'
import { footerNav, legalNav } from '@/data/navigation'
import { activeBrands } from '@/data/brands'
import {
  company,
  contactChannels,
  offices,
  socialProfiles,
} from '@/data/company'

/**
 * Corporate footer.
 *
 * Rules applied here:
 *  - The copyright year is generated at render time, so it cannot go stale.
 *  - Every link points at a route that exists or a verified external URL. There
 *    are no `href="#"` placeholders and no dummy social icons: only the three
 *    profiles confirmed during the audit appear, and they are labelled as Skydot
 *    brand accounts because no NivaSync-branded account exists.
 *  - The address shown is the single verified corporate office. Rajkot, Vadodara
 *    and Hyderabad are deliberately absent — they are client locations, not
 *    offices.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const hq = offices[0]

  return (
    <footer className="band-emphasis tech-grid-bg border-t border-line">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter)]">
        {/* Identity + navigation */}
        <div className="grid gap-12 py-[var(--section-y-tight)] lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          <div>
            <Link to="/" className="inline-flex transition-opacity hover:opacity-80">
              <NivaSyncLogo />
            </Link>
            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-content-muted">
              {company.description}
            </p>

            <address className="mt-7 not-italic text-[0.9375rem] leading-relaxed text-content-muted">
              <span className="block font-medium text-content">{company.legalName}</span>
              {hq.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">
                {hq.city}, {hq.region} {hq.postalCode}, {hq.country}
              </span>
            </address>

            <ul className="mt-5 space-y-1.5 text-[0.9375rem]">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    className="link-underline inline-flex items-baseline gap-2 text-content-muted hover:text-content"
                  >
                    <span className="text-content-subtle">{channel.label}</span>
                    <span>{channel.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="label label-plain mb-4 text-content-subtle">{group.title}</p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="link-underline text-[0.9375rem] text-content-muted hover:text-content"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Brand ecosystem strip */}
        <div className="border-t border-line py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label label-plain mb-2 text-content-subtle">Brand ecosystem</p>
              <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-content-muted">
                {company.brandStatement}
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {activeBrands.map((brand) => (
                <li key={brand.id}>
                  {brand.externalUrl ? (
                    <a
                      href={brand.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-content hover:text-content-accent"
                    >
                      {brand.name}
                      <ExternalIcon />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="text-[0.9375rem] font-medium text-content">{brand.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal strip */}
        <div className="flex flex-col gap-4 border-t border-line py-7 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.8125rem] text-content-subtle">
            © {year} {company.legalName} All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="link-underline text-[0.8125rem] text-content-subtle hover:text-content"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex items-center gap-4">
              {socialProfiles.map((profile) => (
                <li key={profile.id}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.8125rem] text-content-subtle hover:text-content"
                  >
                    {profile.label}
                    <span className="sr-only"> — Skydot Infotech profile, opens in a new tab</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
