import getArticleEntries from "@/utils/seo/sitemap/article-entries";
import getTopicEntries from "@/utils/seo/sitemap/topic-entries";
import getTagEntries from "@/utils/seo/sitemap/tag-entries";
import getAuthorEntries from "@/utils/seo/sitemap/author-entries";
import getStaticEntries from "@/utils/seo/sitemap/static-entries";

import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticEntries = getStaticEntries();

  // Dynamic pages
  const [
    articleEntries,
    topicEntries,
    tagEntries,
    authorEntries,
  ] = await Promise.all([
    getArticleEntries(),
    getTopicEntries(),
    getTagEntries(),
    getAuthorEntries(),
  ]);

  return [
    ...staticEntries,
    ...articleEntries,
    ...topicEntries,
    ...tagEntries,
    ...authorEntries,
  ];
}
