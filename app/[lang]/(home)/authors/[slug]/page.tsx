import { getTranslations } from "@/utils/dictionary-utils";
import { Lang } from "@/utils/dictionary-utils";
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta";
import { authorPageSchema } from "@/utils/seo/schema/authorPageSchema";
import { AuthorProfileCard } from "@/components/authors/author-profile-card";
import { NewsCard } from "@/components/news-card";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fakeAuthors } from "../page";

interface AuthorPageProps {
  params: Promise<{ slug: string; lang: string }>;
}



// Fake articles data
const fakeArticles = [
  {
    id: 1,
    name: "Breaking: New Climate Agreement Reached",
    slug: "breaking-new-climate-agreement-reached",
    excerpt: "World leaders have reached a historic agreement on climate change measures that could significantly impact global emissions.",
    content: "Full article content here...",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    image: "https://picsum.photos/800/600?random=1",
    viewCount: 1250,
    isPublished: true,
    isFeatured: true,
    tags: [{ name: "Climate", slug: "climate" }, { name: "Politics", slug: "politics" }],
    topics: [{ name: "Environment", slug: "environment" }],
  },
  {
    id: 2,
    name: "Tech Giants Face New Regulations",
    slug: "tech-giants-face-new-regulations",
    excerpt: "Major technology companies are preparing for new regulatory frameworks that will reshape the digital landscape.",
    content: "Full article content here...",
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
    image: "https://picsum.photos/800/600?random=2",
    viewCount: 890,
    isPublished: true,
    isFeatured: false,
    tags: [{ name: "Technology", slug: "technology" }, { name: "Business", slug: "business" }],
    topics: [{ name: "Tech", slug: "tech" }],
  },
  {
    id: 3,
    name: "Economic Recovery Shows Strong Signs",
    slug: "economic-recovery-shows-strong-signs",
    excerpt: "Latest economic indicators suggest a robust recovery is underway across multiple sectors.",
    content: "Full article content here...",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
    image: "https://picsum.photos/800/600?random=3",
    viewCount: 2100,
    isPublished: true,
    isFeatured: true,
    tags: [{ name: "Economy", slug: "economy" }, { name: "Finance", slug: "finance" }],
    topics: [{ name: "Business", slug: "business" }],
  },
  {
    id: 4,
    name: "Sports Update: Championship Finals This Weekend",
    slug: "sports-update-championship-finals-this-weekend",
    excerpt: "The highly anticipated championship finals are set to take place this weekend with record-breaking attendance expected.",
    content: "Full article content here...",
    createdAt: "2024-01-08T16:45:00Z",
    updatedAt: "2024-01-08T16:45:00Z",
    image: "https://picsum.photos/800/600?random=4",
    viewCount: 3200,
    isPublished: true,
    isFeatured: false,
    tags: [{ name: "Sports", slug: "sports" }, { name: "Championship", slug: "championship" }],
    topics: [{ name: "Sports", slug: "sports" }],
  },
  {
    id: 5,
    name: "Health Breakthrough: New Treatment Shows Promise",
    slug: "health-breakthrough-new-treatment-shows-promise",
    excerpt: "Researchers have announced a promising new treatment that could revolutionize healthcare in the coming years.",
    content: "Full article content here...",
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-05T11:20:00Z",
    image: "https://picsum.photos/800/600?random=5",
    viewCount: 1800,
    isPublished: true,
    isFeatured: true,
    tags: [{ name: "Health", slug: "health" }, { name: "Research", slug: "research" }],
    topics: [{ name: "Health", slug: "health" }],
  },
];

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug, lang } = await params;

  const author = fakeAuthors.find(a => a.slug === slug);

  if (!author) {
    return notFound();
  }

  const dict = await getTranslations(lang as Lang);

  const metaData = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: `${author.name} - ${dict.metadata?.pages?.authors}` },
    description: author.bio || `${author.name} - Author and Reporter at ${dict.metadata?.siteName}`,
    keywords: [
      author.name,
      ...(dict.metadata?.keywords?.authors || []),

    ],
    type: "website",
    pathname: `/authors/${author.slug}`,
  });

  return metaData;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug, lang } = await params;

  const author = fakeAuthors.find(a => a.slug === slug);

  if (!author) {
    notFound();
  }

  // Get articles by this author (filtered by author ID)
  const authorArticles = fakeArticles.filter(article => 
    article.id <= author.articleCount // Simple filtering for demo
  );

  const t = await getTranslations(lang as Lang);

  const jsonLd = await authorPageSchema(author as any, authorArticles as any, lang as Lang);

  return (
    <>
      <script
        id="author-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className=" mx-auto">
          {/* Author Header */}
          <div className="mb-8">
            <AuthorProfileCard
              author={author}
              lang={lang as Lang}
              translations={{
                author: t.authors.author,
                reporter: t.authors.reporter,
                articlesCount: t.authors.articlesCount,
                joinDate: t.authors.joinDate,
              }}
            />
          </div>

          {/* Author Articles */}
          {authorArticles.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t.authors.articlesBy} {author.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article as any}
                    lang={lang}
                    t={t}
                    variant="vertical"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t.authors.noArticlesBy} {author.name}
              </h3>
              <p className="text-muted-foreground">
                {t.authors.noArticlesByDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
