import MediaGallery from "@/components/media/media-gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations, Lang } from "@/utils/dictionary-utils";
import { Suspense } from "react";

function MediaGallerySkeleton() {
  return (
    <Card>
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface MediaPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { lang } = await params;
  const dictionary = await getTranslations(lang as Lang);
  const t = dictionary.media;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.management.title}</h1>
          <p className="text-muted-foreground">{t.management.description}</p>
        </div>
      </div>

      <Suspense fallback={<MediaGallerySkeleton />}>
        <MediaGallery />
      </Suspense>
    </div>
  );
}

