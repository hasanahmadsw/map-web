'use client';

import ApiError from '@/components/shared/api-error';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-4">
      <ApiError errorMessage={error?.message} refetchFunction={reset} />
    </div>
  );
}
