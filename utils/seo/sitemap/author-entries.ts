import type { MetadataRoute } from "next";
import { Lang } from "@/utils/dictionary-utils";
import { fakeAuthors } from "@/app/[lang]/(home)/authors/page";

// Fake authors data

export default async function getAuthorEntries(): Promise<MetadataRoute.Sitemap> {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const languages: Lang[] = ["en", "ar"];
  const entries: MetadataRoute.Sitemap = [];

  try {
    for (const lang of languages) {
      fakeAuthors.forEach((author) => {
        entries.push({
          url: `${siteURL}/${lang}/authors/${author.slug}`,
          lastModified: new Date(author.updatedAt),
          changeFrequency: "weekly",
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              languages.map((l) => [
                l,
                `${siteURL}/${l}/authors/${author.slug}`,
              ])
            ),
          },
        });
      });
    }
  } catch (error) {
    console.error("Error generating author sitemap entries:", error);
  }

  return entries;
}
