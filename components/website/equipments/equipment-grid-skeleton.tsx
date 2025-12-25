import { Skeleton } from '@/components/ui/skeleton';

export function EquipmentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="glass-card overflow-hidden rounded-xl">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="space-y-4 p-6">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
