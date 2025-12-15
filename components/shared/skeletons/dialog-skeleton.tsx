'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { VisuallyHidden } from '../../ui/visually-hidden';

interface DialogSkeletonProps {
  title?: string;
  description?: string;
  showFooter?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'sm:max-w-[425px]',
  md: 'sm:max-w-[600px]',
  lg: 'sm:max-w-[800px]',
  xl: 'sm:max-w-[1000px]',
  full: 'sm:max-w-[95vw]',
};

function DialogSkeleton({
  title,
  description,
  showFooter = true,
  size = 'md',
  className,
}: DialogSkeletonProps) {
  return (
    <Dialog open={true}>
      <DialogContent
        className={`max-w-[calc(100vw_-_32px)] ${sizeClasses[size]} ${className || ''}`}
        showCloseButton={false}
      >
        <DialogHeader className="space-y-2">
          {title ? (
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          ) : (
            <>
              <VisuallyHidden>
                <DialogTitle>Modal Title</DialogTitle>
              </VisuallyHidden>
              <Skeleton className="h-6 w-32" />
            </>
          )}

          {description ? (
            <DialogDescription className="text-muted-foreground text-sm">{description}</DialogDescription>
          ) : (
            <>
              <VisuallyHidden>
                <DialogTitle>Modal Description</DialogTitle>
              </VisuallyHidden>
              <Skeleton className="h-4 w-52" />
            </>
          )}
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {showFooter && (
          <div className="flex justify-end gap-2 border-t pt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DialogSkeleton;
