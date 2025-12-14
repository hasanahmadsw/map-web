import { articlesService } from "@/services/articles.service";
import type { MetadataRoute } from "next";
import { Lang } from "@/utils/dictionary-utils";

export default async function getArticleEntries(): Promise<MetadataRoute.Sitemap> {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const languages: Lang[] = ["en", "ar"];
  const entries: MetadataRoute.Sitemap = [];

  try {
    for (const lang of languages) {
      // Get all published articles
      const articles = await articlesService.getAll({ 
        limit: 1000 // Get all articles
      });

      articles.data.forEach((article) => {
        entries.push({
          url: `${siteURL}/${lang}/news/${article.slug}`,
          lastModified: new Date(article.updatedAt),
          changeFrequency: "weekly",
          priority: article.isFeatured ? 0.8 : 0.7,
          alternates: {
            languages: Object.fromEntries(
              languages.map((l) => [
                l,
                `${siteURL}/${l}/news/${article.slug}`,
              ])
            ),
          },
        });
      });
    }
  } catch (error) {
    console.error("Error generating article sitemap entries:", error);
  }

  return entries;
}
