import { tagsService } from "@/services/tags.service";
import type { MetadataRoute } from "next";
import { Lang } from "@/utils/dictionary-utils";

export default async function getTagEntries(): Promise<MetadataRoute.Sitemap> {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const languages: Lang[] = ["en", "ar"];
  const entries: MetadataRoute.Sitemap = [];

  try {
    for (const lang of languages) {
      // Get all tags for each language
      const tags = await tagsService.getAll(lang);

      tags.forEach((tag) => {
        entries.push({
          url: `${siteURL}/${lang}/tags/${tag.slug}`,
          lastModified: new Date(tag.updatedAt),
          changeFrequency: "weekly",
          priority: 0.5,
          alternates: {
            languages: Object.fromEntries(
              languages.map((l) => [
                l,
                `${siteURL}/${l}/tags/${tag.slug}`,
              ])
            ),
          },
        });
      });
    }
  } catch (error) {
    console.error("Error generating tag sitemap entries:", error);
  }

  return entries;
}
