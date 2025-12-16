import Link from "next/link";
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

interface AuthorCardProps {
  author: Author;
  lang: Lang;
  translations: {
    articlesCount: string;
    joinDate: string;
  };
}

export function AuthorCard({ author, lang, translations }: AuthorCardProps) {
  return (
    <Link
      href={`/${lang}/authors/${author.slug}`}
      className="group block"
    >
      <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-200 group-hover:border-primary/20">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <span className="text-2xl font-bold text-primary">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Name */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {author.name}
          </h3>
          
          {/* Bio */}
          {author.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {author.bio}
            </p>
          )}
          
          {/* Stats */}
          <div className="flex flex-col space-y-2 w-full">
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
    </Link>
  );
}
