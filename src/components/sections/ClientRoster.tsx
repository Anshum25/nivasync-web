import { Reveal } from '@/components/motion/Reveal'
import { SourceCallout } from '@/components/ui/SourceNote'
import { clientReferences } from '@/data/deployments'

/**
 * Client roster, rendered as TYPOGRAPHY rather than logos.
 *
 * Three reasons, all deliberate:
 *  1. The logo image files were not available during the audit.
 *  2. Third-party logos are their owners' trademarks, and permission to display
 *     them under a *new* corporate brand is unconfirmed.
 *  3. A wall of fabricated or borrowed logos is the single clearest tell of a
 *     template site, and the brief rules it out outright.
 *
 * Set names in the display face, grouped by sector, read as a considered
 * reference list — and every name here is one the company already publishes.
 */
export function ClientRoster() {
  const institutions = clientReferences.filter((c) => c.group === 'public-institution')
  const enterprises = clientReferences.filter((c) => c.group === 'enterprise')

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <Group
          label="Public institutions & government"
          names={institutions.map((c) => c.name)}
        />
        <Group label="Enterprise & industry" names={enterprises.map((c) => c.name)} delay={90} />
      </div>

      <SourceCallout className="mt-10">
        Organisations we have delivered for, as published by the company. Logos are not
        shown: these marks belong to their owners, and we display them only with written
        permission and supplied artwork.
      </SourceCallout>
    </div>
  )
}

function Group({
  label,
  names,
  delay = 0,
}: {
  label: string
  names: string[]
  delay?: number
}) {
  return (
    <Reveal delay={delay}>
      <p className="label mb-6">{label}</p>
      <ul className="flex flex-wrap gap-x-7 gap-y-3.5">
        {names.map((name) => (
          <li
            key={name}
            className="font-display text-[1.0625rem] leading-snug text-content-muted"
          >
            {name}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
