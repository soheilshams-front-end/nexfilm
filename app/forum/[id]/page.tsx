'use client'

import Link from 'next/link'
import { use, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { forumPosts, getTopic } from '@/lib/forum'
import { Button } from '@/components/untitled/button'

export default function ForumTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const topic = getTopic(id)
  const [text, setText] = useState('')
  const [posts, setPosts] = useState(forumPosts[id] ?? [])

  if (!topic) {
    return (
      <main className="min-h-screen bg-black">
        <SiteNav />
        <div className="page-max page-pad pt-32 text-center">
          <p className="text-title-2 text-white">موضوع پیدا نشد</p>
          <Button asChild className="mt-6">
            <Link href="/forum">بازگشت به انجمن</Link>
          </Button>
        </div>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <SiteNav />
      <div className="page-max page-pad pt-28 md:pt-32">
        <Link href="/forum" className="text-[15px] font-semibold text-primary">
          ← بازگشت به انجمن
        </Link>
        <h1 className="mt-4 text-title-1 text-white">{topic.title}</h1>
        <p className="mt-2 text-[15px] text-[var(--label-2)]">{topic.excerpt}</p>

        <div className="mt-8 space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="settings-group p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-semibold text-white">{p.author}</p>
                <span className="text-footnote">{p.createdAt}</span>
              </div>
              <p className="mt-2 text-[15px] leading-7 text-[var(--label-2)]">{p.body}</p>
            </div>
          ))}
        </div>

        <form
          className="mt-6 settings-group p-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!text.trim()) return
            setPosts((prev) => [
              ...prev,
              { id: String(Date.now()), author: 'شما', body: text.trim(), createdAt: 'همین الان' },
            ])
            setText('')
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="پاسخ خود را بنویسید…"
            className="w-full resize-none rounded-[12px] border border-[var(--separator)] bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-primary"
          />
          <Button type="submit" className="mt-3">
            ارسال پاسخ
          </Button>
        </form>

        {topic.movieId ? (
          <Button asChild variant="secondary" className="mt-6">
            <Link href={`/movie/${topic.movieId}`}>مشاهده عنوان مرتبط</Link>
          </Button>
        ) : null}
      </div>
      <SiteFooter />
    </main>
  )
}
