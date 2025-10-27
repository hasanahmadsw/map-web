import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dict = await getTranslations(lang);

  return {
    title: dict.errors.pageNotFound,
    description: dict.errors.pageNotFound,
  };
}

export default async function NotFoundPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dict = await getTranslations(lang);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 md:px-6 py-15 relative bottom-5">
      <div className="max-w-md text-center space-y-8">
        <h1 className="text-7xl md:text-8xl font-bold text-foreground select-none tracking-wide">404</h1>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-muted-foreground">{dict.errors.pageNotFound}</h2>
            <p className="text-muted-foreground text-base leading-relaxed">{dict.errors.pageNotFound} </p>
          </div>
          <Button asChild className="!px-6 !py-2 font-semibold text-base !h-fit">
            <Link href={`/${lang}`}>{dict.common.goHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
