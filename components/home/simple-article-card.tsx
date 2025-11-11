import React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Article } from "@/types/articles.types"

interface SimpleArticleCardProps {
  article: Article
  lang: string
  index: number
}

export function SimpleArticleCard({ article, lang, index }: SimpleArticleCardProps) {
  const coverImage = article.featuredImage || article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"
  
  // Calculate reading time (approximate: 200 words per minute)
  const wordCount = article.content?.split(/\s+/).length || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString(lang, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date not available"

  return (
    <article className="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl glass-card px-8 pb-8 pt-80 transition-all duration-300 hover:bg-background/40">
      {/* Background Image */}
      <Image
        src={coverImage}
        alt={article.name}
        fill
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        unoptimized={coverImage.includes("unsplash.com") || coverImage.includes("supabase.co")}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* Date and Reading Time */}
      <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-muted-foreground mb-3">
        <time dateTime={article.createdAt} className="mr-8">
          {formattedDate}
        </time>
        <div className="-ml-4 flex items-center gap-x-4">
          <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-muted-foreground/50">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <div className="flex gap-x-2.5">
            {readingTime} min read
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold leading-6 text-foreground">
        <Link href={`/${lang}/news/${article.slug}`}>
          <span className="absolute inset-0" />
          {article.name}
        </Link>
      </h3>
    </article>
  )
}

