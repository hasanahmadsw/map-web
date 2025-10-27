import { Lang } from "@/utils/dictionary-utils";

interface Author {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  email?: string;
  articleCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthorProfileCardProps {
  author: Author;
  lang: Lang;
  translations: {
    author: string;
    reporter: string;
    articlesCount: string;
    joinDate: string;
  };
}

export function AuthorProfileCard({ author, lang, translations }: AuthorProfileCardProps) {
  return (
    <div className="bg-card border rounded-lg p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">
            {author.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Author Info */}
        <div className="flex-1 text-center md:text-start">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {author.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {translations.author} & {translations.reporter}
          </p>
          {author.bio && (
            <p className="text-muted-foreground leading-relaxed">
              {author.bio}
            </p>
          )}
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{translations.articlesCount}:</span> {author.articleCount || 0}
            </div>
            {author.createdAt && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{translations.joinDate}:</span>{" "}
                {new Date(author.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
