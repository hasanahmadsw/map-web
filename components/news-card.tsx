import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import type { Article } from "@/types/articles.types";
import { Translations } from "@/utils/dictionary-utils";
import DivHtml from "./shared/div-html";

interface NewsCardProps {
  article: Article;
  className?: string;
  lang: string;
  t:Translations
}

export function NewsCard({ article, t, className, lang }: NewsCardProps) {

  return (
    <Card className={cn("group hover:shadow-md transition-all duration-200 p-0", className)}>
      <Link href={`/${lang}/news/${article.slug}`} className="relative w-full h-48 md:h-56 overflow-hidden rounded-t-lg">
        {article.image ? 
          <Image
          src={article.image}
          alt={`${article.name || "News image"} thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          /> :
        <div className="w-full h-full  bg-gray-200"></div>
        }
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm border border-border">
            {article.viewCount} { t.common.views}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {article?.topics?.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="default" className="text-xs">
              {topic}
            </Badge>
          ))}
          {article?.topics?.length > 3 && (
            <Badge variant="default" className="text-xs">
              {article?.topics?.length} topics
            </Badge>
          )}
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          <Link href={`/news/${article.slug}`} className="hover:underline">
            {article.name}
          </Link>
        </h3>
        <DivHtml html={article.excerpt} />
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(article.createdAt, lang)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
