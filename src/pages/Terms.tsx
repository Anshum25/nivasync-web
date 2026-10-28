import { LegalDocument, type LegalClause } from '@/components/sections/LegalDocument'
import { useSeo } from '@/lib/seo'
import { SITE_ORIGIN, company, offices, primaryEmail } from '@/data/company'

const LAST_UPDATED = '2026-10-28'

/**
 * Terms of Use for this website.
 *
 * Scoped deliberately narrowly: these terms govern use of this corporate website
 * only. They are not product terms, not a service agreement and not a licence —
 * because this site sells nothing and hosts no product. Written for this site
 * rather than adapted from a policy belonging to another domain.
 */
export default function Terms() {
  const hq = offices[0]
  const host = new URL(SITE_ORIGIN).hostname

  useSeo({
    title: 'Terms of Use',
    description:
      'Terms governing use of the NivaSync Infotech corporate website — scope, ' +
      'intellectual property, external links and liability.',
    path: '/terms',
    breadcrumbs: [{ name: 'Terms of Use', path: '/terms' }],
  })

  const clauses: LegalClause[] = [
    {
      heading: 'Scope of these terms',
      paragraphs: [
        `These terms govern your use of this website at ${host}, operated by ${company.legalName}, whose corporate office is at ${hq.lines.join(', ')}, ${hq.city}, ${hq.region} ${hq.postalCode}, ${hq.country}.`,
        'They cover this website and nothing else. They are not terms of service for any of our products, not a contract for any work we may do for you, and not a licence to any software. Any engagement with us is governed by a separate signed agreement, and where that agreement differs from this page, the agreement prevails.',
        'Skydot Infotech, skydotinfotech.com and our product domains have their own terms. These do not apply to them.',
      ],
    },
    {
      heading: 'Using this website',
      paragraphs: [
        'You may read, print and share the pages of this website for your own business or personal reference. In using it, you agree not to:',
      ],
      list: [
        'Interfere with the operation or security of the site, or attempt to gain unauthorised access to any part of it or its hosting infrastructure.',
        'Submit anything through our enquiry forms that is unlawful, misleading, abusive, or sent on someone else’s behalf without their knowledge.',
        'Use automated systems to harvest content or submit forms.',
        'Present any part of this site as your own work, or in a way that implies an association with us that does not exist.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        `The content, design, code, original illustrations and page structure of this website are owned by ${company.legalName} or licensed to us, except where stated otherwise.`,
        'Our names, logos and brand marks — including NivaSync, Skydot Infotech, SKYDOTERP and SkyLMS — are our marks. You may not use them without our written permission, and in particular not in a way that suggests we endorse, supply or are affiliated with you.',
        'Third-party names, institution names and product names mentioned on this site remain the property of their respective owners. They appear here as factual references to organisations we have worked with or technologies we work in, and their appearance does not imply that those organisations endorse us.',
        'Open-source frameworks we build with — including Frappe, ERPNext and Moodle — are the property of their respective projects and licensors, and we make no claim over them.',
      ],
    },
    {
      heading: 'Accuracy of information',
      paragraphs: [
        'We take care that what is published here is accurate, and we distinguish on the page between facts we can evidence, figures we state about ourselves, and content awaiting approval.',
        'Even so, the information on this site is provided for general information. It is not a quotation, a commitment to deliver, a warranty of fitness, or professional advice on your particular situation. Specifications, availability and capabilities described here may change, and nothing here creates a binding offer.',
        'Where a page states that something is pending confirmation or that a figure is our own stated claim rather than an audited metric, please read it that way.',
      ],
    },
    {
      heading: 'Enquiries you send us',
      paragraphs: [
        'Information you send us through an enquiry form is handled as described in our Privacy Policy.',
        'Please do not send us confidential information, trade secrets or anything covered by someone else’s non-disclosure obligations through a web form. Until we have a confidentiality agreement in place, we cannot treat what you send as confidential. If you need to share something sensitive, tell us and we will put the right agreement in place first.',
        'Unsolicited ideas, proposals or specifications sent to us are not treated as confidential and create no obligation on our part.',
      ],
    },
    {
      heading: 'External links',
      paragraphs: [
        'This site links to our brand and product websites and, in places, to third-party organisations and open-source projects. We do not control third-party sites and are not responsible for their content, availability, security or privacy practices. A link is not an endorsement.',
      ],
    },
    {
      heading: 'Availability',
      paragraphs: [
        'We aim to keep this website available, but we do not guarantee uninterrupted access. We may change, suspend or withdraw any part of it, or the whole of it, at any time and without notice. We may also update these terms; the version published here is the one in force.',
      ],
    },
    {
      heading: 'Liability',
      paragraphs: [
        'To the fullest extent permitted by applicable law, we are not liable for any loss or damage arising from your use of, or inability to use, this website — including any loss of profit, revenue, data or anticipated savings, and any indirect or consequential loss.',
        'Nothing in these terms limits or excludes liability where it cannot lawfully be limited or excluded, including liability for fraud or fraudulent misrepresentation.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of India, and the courts at Ahmedabad, Gujarat have jurisdiction over any dispute arising from them or from your use of this website.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        `Questions about these terms can be sent to ${primaryEmail.value}, or to ${company.legalName} at the corporate address above.`,
      ],
    },
  ]

  return (
    <LegalDocument
      title="Terms of Use"
      path="/terms"
      intro="These terms cover your use of this website. They are not product terms and not a services agreement — any work we do for you is governed by a separate signed agreement."
      lastUpdated={LAST_UPDATED}
      clauses={clauses}
      reviewNotice={
        'These terms were drafted specifically for the NivaSync corporate website. They ' +
        'have not been reviewed by legal counsel, the governing-law and jurisdiction ' +
        'clause assumes Ahmedabad, Gujarat, and they deliberately do not cover product ' +
        'or service contracts. Please have them reviewed and formally approved before launch.'
      }
    />
  )
}
