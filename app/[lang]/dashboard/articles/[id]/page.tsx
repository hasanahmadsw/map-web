
import { Suspense } from "react";
import { EditArticleForm } from "@/components/articles/edit-article-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import EditArticleLoading from "./loading";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id, lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.articles;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.editArticle || "Edit Article"}</h1>
          <p className="text-muted-foreground">
            {t.editArticleDescription || "Update article information and manage translations."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.articleDetails || "Article Details"}</CardTitle>
          <CardDescription>
            {t.articleDetailsDescription || "Edit the article information and manage its translations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditArticleLoading />}>
            <EditArticleForm articleId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
