'use client';

import ErrorState from '@/components/shared/data-states/error-state';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-4">
      <ErrorState type="api-error" errorMessage={error?.message} onRetry={reset} />
    </div>
  );
}
