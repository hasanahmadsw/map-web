import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { AddArticleForm } from '@/components/dashboard/articles/form/add-article-form';
import { Button } from '@/components/ui/button';
import { getTranslations, type Lang } from '@/utils/dictionary-utils';
import { type Metadata } from 'next';

interface AddArticlePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Add Article',
  description: 'Create a new article with content, tags, and topics.',
};

export default async function AddArticlePage({ params }: AddArticlePageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.articles;

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Link href="/dashboard/articles">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Article</h1>
          <p className="text-muted-foreground">Create a new article with content, tags, and topics.</p>
        </div>
      </header>

      <AddArticleForm />
    </div>
  );
}
