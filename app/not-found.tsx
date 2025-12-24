import ErrorState from '@/components/shared/data-states/error-state';

export async function generateMetadata() {
  return {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
  };
}

export default async function NotFoundPage() {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-4">
      <ErrorState type="not-found" entity="Page" showPrimaryAction={false} />
    </div>
  );
}
