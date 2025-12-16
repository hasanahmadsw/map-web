import { getTranslations } from '@/utils/dictionary-utils';
import { Lang } from '@/utils/dictionary-utils';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { authorsPageSchema } from '@/utils/seo/schema/authorsPageSchema';
import { AuthorCard } from '@/components/website/authors/author-card';
import type { Metadata } from 'next';

interface AuthorsPageProps {
  params: Promise<{ lang: string }>;
}

// Fake authors data
export const fakeAuthors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    bio: 'Award-winning journalist with over 10 years of experience covering international politics and breaking news. Sarah has reported from conflict zones and major global events.',
    email: 'sarah.johnson@news.com',
    articleCount: 45,
    createdAt: '2020-03-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    slug: 'ahmed-hassan',
    bio: 'Senior reporter specializing in Middle East affairs and technology. Ahmed brings deep cultural understanding and technical expertise to his coverage.',
    email: 'ahmed.hassan@news.com',
    articleCount: 38,
    createdAt: '2019-08-22T09:15:00Z',
    updatedAt: '2024-01-10T16:45:00Z',
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    slug: 'maria-rodriguez',
    bio: "Investigative journalist focused on environmental issues and social justice. Maria's work has led to policy changes and increased public awareness.",
    email: 'maria.rodriguez@news.com',
    articleCount: 52,
    createdAt: '2018-11-05T11:20:00Z',
    updatedAt: '2024-01-12T13:20:00Z',
  },
  {
    id: 4,
    name: 'David Chen',
    slug: 'david-chen',
    bio: 'Technology correspondent covering AI, cybersecurity, and digital innovation. David has a background in computer science and brings technical depth to his reporting.',
    email: 'david.chen@news.com',
    articleCount: 41,
    createdAt: '2021-01-10T08:30:00Z',
    updatedAt: '2024-01-08T10:15:00Z',
  },
  {
    id: 5,
    name: 'Fatima Al-Zahra',
    slug: 'fatima-al-zahra',
    bio: "Business reporter covering global markets, economic policy, and financial trends. Fatima's analysis helps readers understand complex economic developments.",
    email: 'fatima.alzahra@news.com',
    articleCount: 33,
    createdAt: '2020-06-18T14:45:00Z',
    updatedAt: '2024-01-05T09:30:00Z',
  },
  {
    id: 6,
    name: 'James Wilson',
    slug: 'james-wilson',
    bio: 'Sports journalist with expertise in football, basketball, and Olympic sports. James has covered major sporting events worldwide and interviewed top athletes.',
    email: 'james.wilson@news.com',
    articleCount: 67,
    createdAt: '2017-09-12T12:00:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
  },
];

export async function generateMetadata({ params }: AuthorsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getTranslations(lang as Lang);

  const metaData = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: `${dict.metadata?.pages?.authors} - Meet Our ${fakeAuthors.length} Authors` },
    description: `${dict.metadata?.descriptions?.authors} - Discover content by our talented authors and reporters. Find articles written by your favorite journalists.`,
    keywords: [...(dict.metadata?.keywords?.authors || [])],
  });

  return metaData;
}

export default async function AuthorsPage({ params }: AuthorsPageProps) {
  const { lang } = await params;
  const t = await getTranslations(lang as Lang);
  const authors = fakeAuthors;

  const jsonLd = await authorsPageSchema(authors as any, lang as Lang);

  return (
    <>
      <script
        id="authors-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-4 text-4xl font-bold">{t.authors.title}</h1>
          <p className="text-muted-foreground max-w-3xl text-lg">{t.authors.discoverContentByAuthor}</p>
        </div>

        {authors.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-foreground mb-2 text-xl font-semibold">{t.authors.noAuthorsFound}</h3>
            <p className="text-muted-foreground">{t.authors.noAuthorsFoundDescription}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {authors.map(author => (
              <AuthorCard
                key={author.id}
                author={author}
                lang={lang as Lang}
                translations={{
                  articlesCount: t.authors.articlesCount,
                  joinDate: t.authors.joinDate,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
