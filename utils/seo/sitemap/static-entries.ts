import type { MetadataRoute } from "next";

export default function getStaticEntries(): MetadataRoute.Sitemap {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const languages = ["en", "ar"];

  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/news", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/topics", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/tags", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/authors", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    staticPages.forEach((page) => {
      entries.push({
        url: `${siteURL}/${lang}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            languages.map((l) => [
              l,
              `${siteURL}/${l}${page.path}`,
            ])
          ),
        },
      });
    });
  });

  return entries;
}
