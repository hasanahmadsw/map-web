import { CompactArticleCard } from "@/components/compact-article-card";
import { Article } from "@/types/articles.types";
import { Translations } from "@/utils/dictionary-utils";

interface RelatedArticlesProps {
  currentArticle: Article;
  allArticles: Article[];
  maxArticles?: number;
  t: Translations;
  lang: string;
}

export function RelatedArticles({ currentArticle, allArticles, maxArticles = 4, t, lang }: RelatedArticlesProps) {
  // Filter related articles based on topic and tags
  const relatedArticles = allArticles
    .filter(
      (article) =>
        article.slug !== currentArticle.slug &&
        (article.topics.some((topic) => currentArticle.topics.some((t) => t.slug === topic.slug)) ||
          article.tags.some((tag) => currentArticle.tags.some((t) => t.slug === tag.slug))),
    )
    .slice(0, maxArticles);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 py-24 border-l pl-8">
      <h2 className="text-xl font-semibold text-foreground">{t.news.relatedArticles}</h2>
      <div className="space-y-4">
        {relatedArticles.map((article) => (
          <CompactArticleCard
            key={article.slug}
            lang={lang}
            article={article}
            className="hover:shadow-md transition-shadow duration-200"
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
