import { EditArticleForm } from '@/components/dashboard/articles/form/edit-article-form';
import { type Metadata } from 'next';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Edit Article',
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
        <p className="text-muted-foreground">Update article information.</p>
      </header>

      <EditArticleForm articleId={id} />
    </div>
  );
}
