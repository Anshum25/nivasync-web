import type { Article } from '@/types/content'

const SRC = 'https://skydotinfotech.com/assets/index-Dj6vDmZa.js (insights data object)'

/**
 * The two articles published on the source site. Titles, dates, categories,
 * summaries and body copy are migrated VERBATIM.
 *
 * Author re-attributed to "NivaSync Engineering". The source's second byline,
 * "Skydot AI Research Lab", is NOT carried over: no evidence of a named research
 * lab exists anywhere in the source material, and inventing an internal
 * organisation would be a fabricated fact.
 *
 * NO ADDITIONAL ARTICLES WERE GENERATED. The brief explicitly forbids padding the
 * site with filler posts. Two real articles with a working template is the honest
 * state of this section; the structure accepts a CMS later without rework.
 */
export const articles: Article[] = [
  {
    slug: 'future-of-erp-in-manufacturing',
    title: 'The Future of ERP in Manufacturing',
    author: 'NivaSync Engineering',
    date: '2026-08-24',
    displayDate: 'August 24, 2026',
    category: 'Enterprise Software',
    summary:
      'How modular ERP systems are replacing monolithic architectures in the modern manufacturing sector.',
    body: [
      'Modern manufacturing requires agility that legacy monolithic ERPs simply cannot provide. By shifting to modular, microservices-based ERP architectures, organizations can update individual components — like inventory management or HR — without disrupting the entire production floor.',
      'This piece explores the technical transition from legacy systems to modern architectures, highlighting the role of APIs and real-time data synchronization.',
    ],
    relatedSlugs: ['ai-in-document-processing'],
    provenance: {
      tag: 'verified',
      origin: SRC,
      note: 'Body copy migrated verbatim; byline re-attributed to NivaSync Engineering.',
    },
  },
  {
    slug: 'ai-in-document-processing',
    title: 'Automating Compliance with AI Document Processing',
    author: 'NivaSync Engineering',
    date: '2026-08-15',
    displayDate: 'August 15, 2026',
    category: 'Artificial Intelligence',
    summary:
      'Leveraging OCR and Large Language Models to automate data extraction from unstructured forms.',
    body: [
      'Extracting data from physical or unstructured digital documents has historically been a bottleneck for enterprise compliance. Today, Retrieval-Augmented Generation (RAG) combined with advanced OCR allows us to accurately parse complex documents, reducing manual entry time by up to 80%.',
      'We discuss the implementation challenges and security considerations when deploying these models on proprietary data.',
    ],
    relatedSlugs: ['future-of-erp-in-manufacturing'],
    provenance: {
      tag: 'verified',
      origin: SRC,
      note:
        'Body copy migrated verbatim, including the source’s "up to 80%" claim, which ' +
        'describes the technique in general rather than a NivaSync client result.',
    },
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function relatedArticles(slug: string): Article[] {
  const article = getArticle(slug)
  if (!article) return []
  return article.relatedSlugs
    .map((s) => getArticle(s))
    .filter((a): a is Article => Boolean(a))
}
