import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/utils/dictionary-utils";

export async function generateMetadata() {
  const dict = await getTranslations("en");
  return {
    title: dict.errors.pageNotFound,
    description: dict.errors.pageNotFound,
  };
}

export default async function NotFoundPage() {
  const dict = await getTranslations("en");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 md:px-6 py-15 relative bottom-5">
      <div className="max-w-md text-center space-y-8">
        <h1 className="text-8xl md:text-9xl font-bold text-foreground select-none tracking-tight">404</h1>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-muted-foreground">{dict.errors.pageNotFound}</h2>
            <p className="text-muted-foreground text-base leading-relaxed">{dict.errors.pageNotFound} </p>
          </div>
          <Button asChild className="!px-6 !py-2 rounded-full font-semibold text-base !h-fit">
            <Link href={`/`}>{dict.common.goHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
