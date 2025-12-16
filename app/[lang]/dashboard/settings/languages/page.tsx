import { Suspense } from 'react';
import { LanguagesTable } from '@/components/dashboard/languages/languages-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations, type Lang } from '@/utils/dictionary-utils';
import { Globe } from 'lucide-react';

interface LanguagesPageProps {
  params: Promise<{
    lang: string;
  }>;
}

function LanguagesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-muted h-10 animate-pulse rounded" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-muted h-16 animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}

export default async function LanguagesPage({ params }: LanguagesPageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.languages;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t?.languagesManagement || 'Languages Management'}
        </h1>
        <p className="text-muted-foreground">
          {t?.languagesManagementDescription || 'Manage system languages and localization settings'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t?.systemLanguages || 'System Languages'}
          </CardTitle>
          <CardDescription>
            {t?.systemLanguagesDescription || 'Configure available languages for the system'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LanguagesTableSkeleton />}>
            <LanguagesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
