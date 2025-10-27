import { topicsService } from "@/services/topics.service";
import type { MetadataRoute } from "next";
import { Lang } from "@/utils/dictionary-utils";

export default async function getTopicEntries(): Promise<MetadataRoute.Sitemap> {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const languages: Lang[] = ["en", "ar"];
  const entries: MetadataRoute.Sitemap = [];

  try {
    for (const lang of languages) {
      // Get all topics for each language
      const topics = await topicsService.getAll(lang);

      topics.forEach((topic) => {
        entries.push({
          url: `${siteURL}/${lang}/topics/${topic.slug}`,
          lastModified: new Date(topic.updatedAt),
          changeFrequency: "weekly",
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              languages.map((l) => [
                l,
                `${siteURL}/${l}/topics/${topic.slug}`,
              ])
            ),
          },
        });
      });
    }
  } catch (error) {
    console.error("Error generating topic sitemap entries:", error);
  }

  return entries;
}
