import { Skeleton } from '@/components/ui/skeleton';

export function FormSkeleton() {
  return (
    <div className="py-dash-section-padding-y">
      <div className="space-y-6">
        {/* Form Fields Skeleton */}
        <div className="space-y-8">
          {/* Step Header */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>

          {/* Text Area Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>

          {/* Image Uploaders Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            ))}
          </div>

          {/* Form Navigation Buttons */}
          <div className="flex justify-between">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormSkeleton;
