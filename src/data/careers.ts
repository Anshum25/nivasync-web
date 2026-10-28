import type { JobOpening } from '@/types/content'

/**
 * OPEN POSITIONS — DELIBERATELY EMPTY.
 *
 * The source site has no careers page at all (`/careers` is absent from its
 * sitemap, and no vacancy, benefit or hiring copy exists anywhere in its bundle).
 * No real vacancy was supplied with the brief.
 *
 * Inventing job openings or employee benefits would mean publishing fabricated
 * facts that candidates could act on, so this array is empty and the Careers page
 * renders a designed, honest empty state with a working speculative-application
 * route.
 *
 * To publish a vacancy, append a record here. The listing, the detail layout and
 * the empty state all key off this array — nothing else changes.
 */
export const openings: JobOpening[] = []

/**
 * Workplace copy. Taken from the About page's published Team / Culture / Vision
 * framing. No benefits, perks, salary bands or policies are listed, because none
 * are published or supplied.
 */
export const workplace = {
  headline: 'We build systems that institutions depend on.',
  intro:
    'NivaSync engineers software for railway academies, agricultural and medical ' +
    'institutes, government bodies and manufacturers. The work is long-lived: the ' +
    'systems we ship are still in use years later, by people whose day depends on them.',
  principles: [
    {
      title: 'A dedicated team',
      body:
        'We believe in the power of a dedicated team that brings innovative enterprise ' +
        'solutions to life.',
    },
    {
      title: 'A collaborative culture',
      body:
        'Our culture fosters creativity and collaboration, enabling us to deliver ' +
        'world-class digital solutions.',
    },
    {
      title: 'A shared vision',
      body:
        'We are driven by a shared vision to engineer the future of software, AI and ' +
        'digital transformation.',
    },
  ],
  /** Shown on the page so the empty state is explained rather than just blank. */
  emptyStateNote:
    'We are not advertising any specific vacancy at the moment. We do read every ' +
    'speculative application, and we keep strong profiles on file.',
  benefitsNote:
    'Benefits and working arrangements are discussed directly during the hiring ' +
    'process rather than listed here.',
} as const
