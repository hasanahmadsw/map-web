'use client';

import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteMedia, useMediaInfinite } from '@/hooks/media/use-media';
import { useTranslation } from '@/providers/translations-provider';
import { Media } from '@/types/media.types';
import { Loader2, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
// Error handling component would be imported here if it exists
import { MediaCard } from './media-card';
import { MediaViewerModal } from './media-viewer-modal';
import { UploadMediaDialog } from './upload-media-dialog';

export default function MediaGallery() {
  const { t } = useTranslation();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [viewingMedia, setViewingMedia] = useState<Media | null>(null);
  const [typeFilter, setTypeFilter] = useState<'image' | 'video' | 'all'>('all');

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isLoading,
    refetch,
  } = useMediaInfinite({
    type: typeFilter,
    orderBy: 'created_at',
    orderDir: 'desc',
    limit: 24,
  });

  // Flatten all pages into a single array
  const media = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const total = data?.pages[0]?.pagination?.total || 0;

  const deleteMutation = useDeleteMedia();

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(t.media.messages.urlCopied);
  };

  const handleDelete = (media: Media) => {
    setMediaToDelete(media);
  };

  const handleView = (media: Media) => {
    setViewingMedia(media);
  };

  const handleSelect = (media: Media, selected: boolean) => {
    setSelectedMedia(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(media.path);
      } else {
        newSet.delete(media.path);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedMedia.size === media.length) {
      setSelectedMedia(new Set());
    } else {
      setSelectedMedia(new Set(media.map(m => m.path)));
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedMedia(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedMedia.size === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedMedia.size === 0) return;

    try {
      await deleteMutation.mutateAsync(Array.from(selectedMedia));
      toast.success(t.media.messages.deleteSuccess);
      setSelectedMedia(new Set());
      setShowBulkDeleteConfirm(false);
      setSelectionMode(false);
    } catch (error) {
      toast.error(t.media.messages.deleteError);
      console.error('Error deleting media:', error);
    }
  };

  const confirmDelete = async () => {
    if (!mediaToDelete) return;

    try {
      await deleteMutation.mutateAsync([mediaToDelete.path]);
      toast.success(t.media.messages.deleteSuccess);
      setMediaToDelete(null);
    } catch (error) {
      toast.error(t.media.messages.deleteError);
      console.error('Error deleting media:', error);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-destructive text-lg font-semibold">{t.common.error}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{error.message || t.common.failedToLoad}</p>
            <Button onClick={() => refetch()} className="mt-4" variant="outline">
              {t.validation.retry}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t.media.management.title}</h2>
              <p className="text-muted-foreground text-sm">
                {selectionMode && selectedMedia.size > 0
                  ? `${selectedMedia.size} ${t.common.selected.toLowerCase()}`
                  : `${total} ${total === 1 ? 'file' : 'files'}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectionMode ? (
                <>
                  {selectedMedia.size > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleSelectAll}>
                        {selectedMedia.size === media.length
                          ? t.common.actions.deselectAll
                          : t.common.actions.selectAll}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t.common.actions.delete} ({selectedMedia.size})
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                    <X className="mr-2 h-4 w-4" />
                    {t.common.actions.cancel}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                    {t.common.actions.select}
                  </Button>
                  <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.media.filters.all}</SelectItem>
                      <SelectItem value="image">{t.media.filters.images}</SelectItem>
                      <SelectItem value="video">{t.media.filters.videos}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    {t.common.actions.upload}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="py-12 text-center">
              <Upload className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">{t.media.messages.noMedia}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{t.media.actions.uploadDescription}</p>
              <Button onClick={() => setIsUploadDialogOpen(true)} className="mt-4">
                <Upload className="mr-2 h-4 w-4" />
                {t.common.actions.upload}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {media.map(item => (
                  <MediaCard
                    key={item.url}
                    media={item}
                    onDelete={handleDelete}
                    onCopy={handleCopyUrl}
                    onView={handleView}
                    isSelected={selectedMedia.has(item.path)}
                    onSelect={handleSelect}
                    selectionMode={selectionMode}
                  />
                ))}
              </div>

              {/* Infinite scroll trigger */}
              {hasNextPage && (
                <div ref={loadMoreRef} className="mt-6 flex justify-center">
                  {isFetchingNextPage && (
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t.media.messages.loadingMore}</span>
                    </div>
                  )}
                </div>
              )}

              {!hasNextPage && media.length > 0 && (
                <div className="text-muted-foreground mt-6 text-center text-sm">
                  {t.media.messages.noMoreItems}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UploadMediaDialog isOpen={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)} />

      {mediaToDelete && (
        <ConfirmationDialog
          open={!!mediaToDelete}
          onOpenChange={open => !open && setMediaToDelete(null)}
          onConfirm={confirmDelete}
          title={t.common.confirmation.areYouSure}
          description={t.media.messages.deleteConfirm}
          confirmText={t.common.actions.delete}
          cancelText={t.common.actions.cancel}
          isLoading={deleteMutation.isPending}
        />
      )}

      {showBulkDeleteConfirm && (
        <ConfirmationDialog
          open={showBulkDeleteConfirm}
          onOpenChange={open => !open && setShowBulkDeleteConfirm(false)}
          onConfirm={confirmBulkDelete}
          title={t.common.confirmation.areYouSure}
          description={`${t.media.messages.deleteConfirm} (${selectedMedia.size} files)`}
          confirmText={t.common.actions.delete}
          cancelText={t.common.actions.cancel}
          isLoading={deleteMutation.isPending}
        />
      )}

      <MediaViewerModal
        media={viewingMedia}
        allMedia={media}
        onClose={() => setViewingMedia(null)}
        onNavigate={setViewingMedia}
      />
    </>
  );
}
