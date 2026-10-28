import { Link, useParams } from 'react-router-dom'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ArrowIcon } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CardLink } from '@/components/ui/CardLink'
import { CtaSection } from '@/components/sections/CtaSection'
import { MaskReveal, Reveal } from '@/components/motion/Reveal'
import { useSeo } from '@/lib/seo'
import { getArticle, relatedArticles } from '@/data/insights'
import { SITE_ORIGIN, company } from '@/data/company'
import type { Article } from '@/types/content'
import NotFound from './NotFound'

/** Article template. */
export default function ArticleDetail() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)

  // The early return lives here, BEFORE any other hook runs. Putting it
  // after useSeo would change hook order between a found and a missing
  // record, which React forbids.
  if (!article) return <NotFound />

  return <ArticleDetailView article={article} slug={slug} />
}

function ArticleDetailView({ article, slug }: { article: Article; slug: string }) {

  const related = relatedArticles(slug)
  const trail = [
    { name: 'Insights', path: '/insights' },
    { name: article.title, path: `/insights/${slug}` },
  ]

  useSeo({
    title: article.title,
    description: article.summary,
    path: `/insights/${slug}`,
    type: 'article',
    publishedTime: article.date,
    breadcrumbs: trail,
    jsonLd: [
      {
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.summary,
        datePublished: article.date,
        articleSection: article.category,
        author: { '@type': 'Organization', name: company.legalName },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        mainEntityOfPage: `${SITE_ORIGIN}/insights/${slug}`,
      },
    ],
  })

  return (
    <>
      <article>
        <div className="border-b border-line bg-surface-sunken pb-[var(--section-y-tight)] pt-12 md:pt-16">
          <Container width="prose">
            <Breadcrumbs trail={trail} />

            <Reveal from="none">
              <Eyebrow>{article.category}</Eyebrow>
            </Reveal>

            <h1 className="mt-5 text-[length:var(--text-h1)] leading-[var(--leading-snug)]">
              <MaskReveal>{article.title}</MaskReveal>
            </h1>

            <Reveal delay={120}>
              <p className="mt-6 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted">
                {article.summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-[0.8125rem] text-content-subtle">
                <span>{article.author}</span>
                <time dateTime={article.date}>{article.displayDate}</time>
              </div>
            </Reveal>
          </Container>
        </div>

        <Section width="prose">
          {article.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="mb-7 text-[length:var(--text-body-lg)] leading-relaxed text-content-muted last:mb-0">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={240}>
            <div className="mt-12 border-t border-line pt-7">
              <p className="text-[0.9375rem] leading-relaxed text-content-muted">
                Written by the {company.shortName} engineering team. If this is relevant
                to something you are building,{' '}
                <Link to="/contact" className="link-underline text-content-accent">
                  start a conversation
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </Section>
      </article>

      {related.length > 0 ? (
        <Section tone="sunken" divided>
          <Reveal from="none">
            <Eyebrow>Related reading</Eyebrow>
          </Reveal>
          <ul className="hairline-grid mt-10 grid md:grid-cols-2">
            {related.map((item, i) => (
              <Reveal key={item.slug} as="li" delay={i * 90} className="flex">
                <CardLink
                  to={`/insights/${item.slug}`}
                  eyebrow={item.category}
                  title={item.title}
                  description={item.summary}
                  footer={item.displayDate}
                />
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200}>
            <Link
              to="/insights"
              className="link-underline mt-10 inline-flex items-center gap-2 font-medium text-content-accent"
            >
              All insights
              <ArrowIcon />
            </Link>
          </Reveal>
        </Section>
      ) : null}

      <CtaSection />
    </>
  )
}
