import { PageHero } from '@/components/page-hero'
import type { TrustBlock } from '@/lib/trust-content'

export function TrustArticle({
  title,
  subtitle,
  sections,
}: {
  title: string
  subtitle?: string
  sections: TrustBlock[]
}) {
  return (
    <>
      <PageHero title={title} subtitle={subtitle} />
      <article className="page-max page-pad mt-8 max-w-3xl space-y-8 pb-16">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-white">{s.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--fg-tertiary)]">{s.body}</p>
          </section>
        ))}
      </article>
    </>
  )
}
