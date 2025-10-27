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
  variant?: "horizontal" | "vertical";
  className?: string;
  lang: string;
  t:Translations
}

export function NewsCard({ article, variant = "vertical", t, className, lang }: NewsCardProps) {


  // if (variant === "horizontal") {
  //   return (
  //     <Card className={cn("group hover:shadow-md transition-all duration-200 p-0", className)}>
  //       <div className="flex">
  //         <Link
  //           href={`/news/${article.slug}`}
  //           className="relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0 overflow-hidden rounded-l-lg"
  //         >
  //           <Image
  //             src={`https://picsum.photos/400/300?random=${article.id}`}
  //             alt={`${article.name || "News image"} thumbnail`}
  //             fill
  //             sizes="(max-width: 768px) 128px, 160px"
  //             className="object-cover group-hover:scale-105 transition-transform duration-200"
  //           />
  //         </Link>
  //         <div className="flex-1 flex flex-col justify-between p-4 space-y-2">
  //           <div>
  //             <div className="flex items-center gap-2 mb-2">
  //               {article?.topics?.slice(0, 3).map((topic) => (
  //                 <Badge key={topic.slug} variant="default" className="text-xs">
  //                   {topic.name}
  //                 </Badge>
  //               ))}

  //               {article.tags.slice(0, 3).map((tag) => (
  //                 <Badge key={tag.slug} variant="secondary" className="text-xs">
  //                   {tag.name}
  //                 </Badge>
  //               ))}
  //             </div>
  //             <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
  //               <Link href={`/news/${article.slug}`} className="hover:underline">
  //                 {article.name}
  //               </Link>
  //             </h3>
  //             <DivHtml html={article.excerpt} />
  //           </div>
  //           <div className="flex items-center justify-between text-xs text-muted-foreground">
  //             <div className="flex items-center gap-1">
  //               <Calendar className="h-3 w-3" />
  //               <span>{formatDate(article.createdAt, lang)}</span>
  //             </div>
  //             <div className="flex items-center gap-1">
  //               <Clock className="h-3 w-3" />
  //               <span>{article.viewCount} { t.common.views}</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Card>
  //   );
  // }

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
            <Badge key={topic.slug} variant="default" className="text-xs">
              {topic.name}
            </Badge>
          ))}
          {article?.topics?.length > 3 && (
            <Badge variant="default" className="text-xs">
              {article?.topics?.length} topics
            </Badge>
          )}
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.slug} variant="secondary" className="text-xs">
              {tag.name}
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
