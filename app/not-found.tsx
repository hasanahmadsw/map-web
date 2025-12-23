import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata() {
  return {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
  };
}

export default async function NotFoundPage() {
  return (
    <div className="bg-background relative bottom-5 flex min-h-screen items-center justify-center px-4 py-15 md:px-6">
      <div className="max-w-md space-y-8 text-center">
        <h1 className="text-foreground text-8xl font-bold tracking-tight select-none md:text-9xl">404</h1>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-muted-foreground text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              The page you are looking for does not exist.{' '}
            </p>
          </div>
          <Button asChild className="!h-fit rounded-full !px-6 !py-2 text-base font-semibold">
            <Link href={`/`}>Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
