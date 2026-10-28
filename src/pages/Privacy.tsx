import { LegalDocument, type LegalClause } from '@/components/sections/LegalDocument'
import { useSeo } from '@/lib/seo'
import { company, offices, primaryEmail } from '@/data/company'

const LAST_UPDATED = '2026-10-28'

/**
 * Privacy Policy, written specifically for this corporate website.
 *
 * It describes only what this site actually does: it collects form submissions,
 * stores one theme preference in the browser, and loads web fonts from Google.
 * There is no analytics, no tracking pixel, no advertising tag and no cookie
 * banner — because there is nothing to consent to. If analytics is added later,
 * this document and §4 in particular must be updated first.
 *
 * No policy was copied from another site or from a document written for a
 * different product or domain.
 */
export default function Privacy() {
  const hq = offices[0]

  useSeo({
    title: 'Privacy Policy',
    description:
      'How NivaSync Infotech Pvt. Ltd. handles information submitted through this ' +
      'website, what is stored in your browser, and what third-party services it uses.',
    path: '/privacy',
    breadcrumbs: [{ name: 'Privacy Policy', path: '/privacy' }],
  })

  const clauses: LegalClause[] = [
    {
      heading: 'Who we are',
      paragraphs: [
        `${company.legalName} ("NivaSync", "we", "us") operates this website. Our corporate office is at ${hq.lines.join(', ')}, ${hq.city}, ${hq.region} ${hq.postalCode}, ${hq.country}.`,
        `Skydot Infotech is a technology brand of ${company.legalName} and operates its own website at skydotinfotech.com. That site is governed by its own policies, not by this one.`,
        `For any question about this policy, or to exercise any of the rights described in it, contact us at ${primaryEmail.value}.`,
      ],
    },
    {
      heading: 'What this website collects',
      paragraphs: [
        'This website collects personal information in exactly one circumstance: when you choose to submit an enquiry form. Nothing is collected from you simply by reading these pages.',
        'When you submit an enquiry form, we process the details you type into it:',
      ],
      list: [
        'Your name and email address, which are required so we can reply.',
        'Your organisation and phone number, which are optional.',
        'Your area of interest, on the project enquiry form, which is optional.',
        'The content of your message.',
        'The date and time of submission.',
      ],
    },
    {
      heading: 'Why we use it, and for how long',
      paragraphs: [
        'We use what you submit for one purpose: to respond to your enquiry and to carry on any business discussion that follows from it. Our lawful basis is our legitimate interest in replying to someone who has contacted us about our services.',
        'We do not sell your information, we do not share it with advertisers, and we do not use it for automated decision-making or profiling.',
        'We keep enquiry correspondence for as long as the business relationship or discussion is live, and for a reasonable period afterwards for our own records. You can ask us to delete your enquiry at any time.',
      ],
    },
    {
      heading: 'Cookies, analytics and tracking',
      paragraphs: [
        'This website sets no cookies, runs no analytics, loads no advertising or social tracking pixels, and does not fingerprint your device. There is no cookie banner on this site because there is nothing for you to consent to.',
        'The site does store one item in your browser’s local storage: your light or dark theme preference, under the key "nivasync-theme". It never leaves your device, it is not personal information, and clearing your browser data removes it. The site works normally if your browser blocks storage.',
        'If we introduce analytics in future, we will update this policy to say precisely what is collected and on what basis before enabling it.',
      ],
    },
    {
      heading: 'Third-party services this site uses',
      paragraphs: [
        'Two third parties are involved in operating this website:',
      ],
      list: [
        'Google Fonts — this site loads its typefaces from fonts.googleapis.com and fonts.gstatic.com. Making that request discloses your IP address and browser details to Google, as any web request does to the server it reaches.',
        'Our web host — our hosting provider processes standard server request logs, which routinely include IP addresses, as part of serving and securing the site.',
      ],
    },
    {
      heading: 'How enquiry forms are delivered',
      paragraphs: [
        'Where a form delivery service is configured, your submission is transmitted to that service, which passes it to us by email. Where one is not configured, the form will tell you plainly that nothing was transmitted and will instead offer to open a pre-filled message in your own email client — in which case your details travel through your own email provider and never touch this website.',
        'We will not show you a confirmation that a message has been sent unless it actually has.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'This website is served over HTTPS. It holds no database and no login, so there is no account or stored record on this site to compromise. Enquiries we receive are held in our business email and internal systems, with access limited to the people who need it in order to respond to you.',
        'Please do not send passwords, financial details, identity documents or other sensitive personal information through an enquiry form. If we need something of that kind, we will arrange a secure route for it.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You can ask us to give you a copy of the information we hold about you, to correct it if it is wrong, or to delete it. You can also object to our continuing to process it.',
        `Write to ${primaryEmail.value} and we will respond. Where the law sets a response deadline, we will meet it. If you are not satisfied with how we have handled a request, you may raise it with the relevant data protection authority.`,
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'This is a business-to-business website. It is not directed at children, and we do not knowingly collect information from them. If you believe a child has sent us personal information, contact us and we will delete it.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If we change this policy we will update the "last updated" date above. Where a change materially affects how we handle your information, we will say what changed rather than quietly replacing the text.',
      ],
    },
  ]

  return (
    <LegalDocument
      title="Privacy Policy"
      path="/privacy"
      intro="What this website collects, why, and what it does not do. It is short because the site does very little with your information."
      lastUpdated={LAST_UPDATED}
      clauses={clauses}
      reviewNotice={
        'This policy was drafted specifically for the NivaSync corporate website and ' +
        'describes the site as actually built. It has not yet been reviewed by legal ' +
        'counsel, and it does not cover skydotinfotech.com or any product platform. ' +
        'Please have it reviewed and formally approved before launch.'
      }
    />
  )
}
