import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Article } from "@/types/articles.types"

interface SimpleArticleCardProps {
  article: Article
  lang: string
  index: number
}

export function SimpleArticleCard({ article, lang, index }: SimpleArticleCardProps) {
  // Strip HTML from excerpt for display
  const getPlainText = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim()
  }

  const plainExcerpt = getPlainText(article.excerpt || "")

  return (
    <div
      className={cn(
        "group animate-in fade-in slide-in-from-bottom-4 duration-500 h-64",
        `delay-${index * 100}`
      )}
    >
      <Link href={`/${lang}/news/${article.slug}`} className="block h-full">
        <div className="h-full p-6 border-s-2 border-s-border hover:border-s-primary transition-all duration-300 space-y-4 flex flex-col">
          {/* Date */}
          <div className="text-sm text-muted-foreground">
            {article.createdAt
              ? new Date(article.createdAt).toLocaleDateString(lang, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Date not available"}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
            {article.name.length > 65
              ? article.name.slice(0, 65) + "..."
              : article.name}
          </h3>

          {/* Description */}
          <div className="text-muted-foreground leading-relaxed line-clamp-3 flex-1 overflow-hidden text-sm">
            {plainExcerpt.length > 100
              ? plainExcerpt.slice(0, 100) + "..."
              : plainExcerpt}
          </div>

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-foreground group-hover:text-primary transition-colors duration-200 mt-auto">
            <span className="font-medium text-sm">Read more</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  )
}

