"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteMedia, useMediaInfinite, useUploadMedia } from "@/hooks/media/use-media";
import { useTranslation } from "@/providers/translations-provider";
import { Media } from "@/types/media.types";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MediaCard } from "./media-card";
import { MediaViewerModal } from "./media-viewer-modal";
import { UploadMediaDialog } from "./upload-media-dialog";

export type MediaPickerMode = "single" | "multiple";
export type MediaPickerFilter = "image" | "video" | "all";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media | Media[]) => void;
  mode?: MediaPickerMode;
  filter?: MediaPickerFilter;
  initialSelected?: string[]; // URLs or paths of initially selected media
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  mode = "single",
  filter = "all",
  initialSelected = [],
}: MediaPickerDialogProps) {
  const { t } = useTranslation();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set(initialSelected));
  const [typeFilter, setTypeFilter] = useState<"image" | "video" | "all">(filter);
  const [viewingMedia, setViewingMedia] = useState<Media | null>(null);
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
    orderBy: "created_at",
    orderDir: "desc",
    limit: 24,
  });

  // Flatten all pages into a single array
  const media = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const uploadMutation = useUploadMedia();

  // Initialize selected media from initialSelected prop
  useEffect(() => {
    if (initialSelected.length > 0) {
      setSelectedMedia(new Set(initialSelected));
    }
  }, [initialSelected]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle media selection
  const handleSelect = (mediaItem: Media) => {
    setSelectedMedia((prev) => {
      const newSet = new Set(prev);
      if (mode === "single") {
        // Single selection: replace selection
        newSet.clear();
        newSet.add(mediaItem.url);
        return newSet;
      } else {
        // Multiple selection: toggle
        if (newSet.has(mediaItem.url)) {
          newSet.delete(mediaItem.url);
        } else {
          newSet.add(mediaItem.url);
        }
        return newSet;
      }
    });
  };

  const handleView = (mediaItem: Media) => {
    setViewingMedia(mediaItem);
  };

  const handleConfirm = () => {
    if (selectedMedia.size === 0) return;
    
    if (mode === "single") {
      const selected = media.find((m) => selectedMedia.has(m.url));
      if (selected) {
        onSelect(selected);
      }
    } else {
      const selectedItems = media.filter((m) => selectedMedia.has(m.url));
      onSelect(selectedItems);
    }
    onOpenChange(false);
  };

  const handleUploadSuccess = () => {
    refetch();
    setIsUploadDialogOpen(false);
  };

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t.media.management.title}</DialogTitle>
            <DialogDescription>{t.common.error}</DialogDescription>
          </DialogHeader>
          <div className="py-12 text-center">
            <p className="text-destructive mb-4">
              {error.message || t.common.failedToLoad}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              {t.validation.retry}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] sm:max-w-7xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {mode === "single" ? t.media.messages.selectMedia || "Select Media" : t.media.messages.selectMedia || "Select Media"}
            </DialogTitle>
            <DialogDescription>
              {mode === "single"
                ? t.media.actions.selectFiles || "Choose one media file"
                : t.media.actions.selectFiles || "Choose one or more media files"}
            </DialogDescription>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Select
                value={typeFilter}
                onValueChange={(value: "image" | "video" | "all") => setTypeFilter(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.media.filters.all}</SelectItem>
                  <SelectItem value="image">{t.media.filters.images}</SelectItem>
                  <SelectItem value="video">{t.media.filters.videos}</SelectItem>
                </SelectContent>
              </Select>
              {selectedMedia.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedMedia.size} {t.common.selected.toLowerCase()}
                </span>
              )}
            </div>
            <Button onClick={() => setIsUploadDialogOpen(true)} variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              {t.common.actions.upload}
            </Button>
          </div>

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto mt-4">
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
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">{t.media.messages.noMedia}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.media.actions.uploadDescription}
                </p>
                <Button
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="mt-4"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t.common.actions.upload}
                </Button>
              </div>
            ) : (
              <>
                <div className="p-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {media.map((item) => (
                    <MediaCard
                      key={item.url}
                      media={item}
                      onDelete={() => {}} // No delete in picker mode
                      onCopy={() => {}}
                      onView={handleView}
                      isSelected={selectedMedia.has(item.url)}
                      onSelect={handleSelect}
                      selectionMode={true}
                    />
                  ))}
                </div>

                {/* Infinite scroll trigger */}
                {hasNextPage && (
                  <div ref={loadMoreRef} className="mt-6 flex justify-center">
                    {isFetchingNextPage && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{t.media.messages.loadingMore}</span>
                      </div>
                    )}
                  </div>
                )}

                {!hasNextPage && media.length > 0 && (
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    {t.media.messages.noMoreItems}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t.common.actions.cancel}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedMedia.size === 0}
            >
              {mode === "single"
                ? t.common.actions.confirm
                : `${t.common.actions.confirm} (${selectedMedia.size})`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UploadMediaDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {viewingMedia && (
        <MediaViewerModal
          media={viewingMedia}
          allMedia={media}
          onClose={() => setViewingMedia(null)}
          onNavigate={setViewingMedia}
        />
      )}
    </>
  );
}
