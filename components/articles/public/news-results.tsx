import type { Article } from "@/types/articles.types";
import { EmptyStateWrapper } from "./empty-state-wrapper";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { NewsCard } from "@/components/news-card";
import Link from "next/link";
import { Translations, getTranslations } from "@/utils/dictionary-utils";

interface NewsResultsProps {
  articles: Article[];
  totalArticles: number;
  lang: string;
  currentPage: number;
  limit: number;
  searchParams?: Record<string, string>;
  t:Translations
}

export function NewsResults({
  articles,
  totalArticles,
  lang,
  currentPage,
  limit,
  searchParams = {},
  t,
}: NewsResultsProps) {
  const totalPages = Math.max(1, Math.ceil(totalArticles / limit));
  // Create URL search params for pagination links
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  if (articles.length === 0) {
    return (
      <EmptyStateWrapper
        title="No articles found"
        description="No articles found"
        buttonText="Reload"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
            <NewsCard key={article.id} article={article} lang={lang} t={t} />
          ))}
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 ? (
                <Link href={createPageUrl(currentPage - 1)}>
                  <PaginationPrevious>Previous</PaginationPrevious>
                </Link>
              ) : (
                <PaginationPrevious aria-disabled>Previous</PaginationPrevious>
              )}
            </PaginationItem>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
              const page = idx + 1;
              return (
                <PaginationItem key={page}>
                  <Link href={createPageUrl(page)}>
                    <PaginationLink isActive={page === currentPage}>
                      {page}
                    </PaginationLink>
                  </Link>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              {currentPage < totalPages ? (
                <Link href={createPageUrl(currentPage + 1)}>
                  <PaginationNext>Next</PaginationNext>
                </Link>
              ) : (
                <PaginationNext aria-disabled>Next</PaginationNext>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
