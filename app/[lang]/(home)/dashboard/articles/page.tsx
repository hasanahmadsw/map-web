import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ArticlesTable } from "@/components/articles/articles-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import ArticlesTableSkeleton from "./loading";

interface ArticlesPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.articles;
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.articlesManagement}</h1>
          <p className="text-muted-foreground">{t.articlesManagementDescription}</p>
        </div>
        <Link href="/dashboard/articles/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t.addArticle}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.contentArticles}</CardTitle>
          <CardDescription>{t.contentArticlesDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ArticlesTableSkeleton />}>
            <ArticlesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
