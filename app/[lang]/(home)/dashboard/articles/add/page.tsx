import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AddArticleForm } from "@/components/articles/add-article-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import AddArticleLoading from "./loading";

interface AddArticlePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AddArticlePage({ params }: AddArticlePageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.articles;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/articles">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.addArticle || "Add Article"}</h1>
          <p className="text-muted-foreground">
            {t.addNewArticleDescription || "Create a new article with content, tags, and topics."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.articleDetails || "Article Details"}</CardTitle>
          <CardDescription>
            {t.articleDetailsDescription || "Fill in the article information and select tags and topics."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<AddArticleLoading />}>
            <AddArticleForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
