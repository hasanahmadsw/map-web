"use client";

import { useState } from "react";
import { NewsCard } from "@/components/news-card";
import type { Article } from "@/types/articles.types";
import { VariantToggle, ViewVariant } from "./variant-toggle";
import { useTranslation } from "@/providers/translations-provider";

interface ArticlesWithToggleProps {
  articles: Article[];
  lang: string;
}

export function ArticlesWithToggle({ articles, lang }: ArticlesWithToggleProps) {
  const [selectedVariant, setSelectedVariant] = useState<ViewVariant>(ViewVariant.VERTICAL);
  const { t } = useTranslation(); 
  return (
    <>
      <VariantToggle defaultVariant={selectedVariant} onVariantChange={setSelectedVariant} />

      {/* Articles Grid/List */}
      <div
        className={
          selectedVariant === ViewVariant.VERTICAL
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {articles.map((article) => (
          <NewsCard lang={lang} key={article.id} article={article} variant={selectedVariant} t={t} />
        ))}
      </div>
    </>
  );
}
