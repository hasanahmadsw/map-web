'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { useTranslation } from '@/providers/translations-provider';
import { Media } from '@/types/mediaa.types';

import { Folder as FolderIcon, FolderPlus, Loader2, Trash2, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { CreateFolderDialog } from './create-folder-dialog';
import { MediaCard } from './media-card';
import { UploadMediaDialog } from './upload-media-dialog';
import { useDeleteMedia, useMediaInfinite, useMediaTree } from '@/hooks/api/media/use-media';
import ApiError from '../../shared/api-error';

const MediaViewerModalDynamic = dynamic(
  () => import('./media-viewer-modal').then(mod => mod.MediaViewerModal),
  { ssr: false },
);
const ConfirmDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  { ssr: false },
);

export default function MediaGallery() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [viewingMedia, setViewingMedia] = useState<Media | null>(null);
  const [typeFilter, setTypeFilter] = useState<'image' | 'video' | 'all'>('all');

  // create folder
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // folder from URL (?folder=...)
  const currentFolder = searchParams.get('folder') || '';
  const folderSegments = currentFolder ? currentFolder.split('/') : [];

  // Tree: folders under current folder
  const {
    data: treeData,
    isPending: isTreeLoading,
    error: treeError,
    refetch: refetchTree,
  } = useMediaTree(currentFolder || undefined);

  const folders = treeData?.data?.folders || [];

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
    folder: currentFolder || undefined,
  });

  // Flatten all pages into a single array and filter out .keep files
  const media = useMemo(() => {
    const allMedia = data?.pages.flatMap(page => page.data) || [];
    // Filter out .keep files (files ending with .keep or named .keep)
    return allMedia.filter(item => {
      const fileName = item.name.toLowerCase();
      return !fileName.endsWith('.keep') && fileName !== '.keep';
    });
  }, [data]);

  const total = data?.pages[0]?.pagination?.total || 0;

  const deleteMutation = useDeleteMedia();

  // Reset selection when folder changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedMedia(new Set());
    setSelectionMode(false);
  }, [currentFolder]);

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

  const navigateToFolder = (folderPath?: string) => {
    const params = new URLSearchParams(searchParams);
    if (folderPath && folderPath.trim().length > 0) {
      params.set('folder', folderPath);
    } else {
      params.delete('folder');
    }
    // reset pagination of infinite query ضمنياً لما يتغير الـ queryKey
    router.push(`?${params.toString()}`);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
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
      toast.success('Media deleted successfully');
      setSelectedMedia(new Set());
      setShowBulkDeleteConfirm(false);
      setSelectionMode(false);
    } catch (error) {
      toast.error('Error deleting media');
      console.error('Error deleting media:', error);
    }
  };

  const confirmDelete = async () => {
    if (!mediaToDelete) return;

    try {
      await deleteMutation.mutateAsync([mediaToDelete.path]);
      toast.success('Media deleted successfully');
      setMediaToDelete(null);
    } catch (error) {
      toast.error('Error deleting media');
      console.error('Error deleting media:', error);
    }
  };

  if (error || treeError) {
    return (
      <ApiError
        errorMessage={error?.message || treeError?.message || 'Error loading media'}
        refetchFunction={() => {
          refetch();
          refetchTree();
        }}
      />
    );
  }

  const handleFolderCreated = (folderPath: string) => {
    // Navigate to the newly created folder
    navigateToFolder(folderPath);
  };

  return (
    <>
      <Card>
        <div className="border-b p-6">
          <div className="flex flex-col flex-wrap gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Media Management</CardTitle>

              {/* Breadcrumbs */}
              <Breadcrumb className="mt-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    {!currentFolder ? (
                      <BreadcrumbPage>Root</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        asChild
                        className="cursor-pointer"
                        onClick={() => navigateToFolder(undefined)}
                      >
                        <button type="button">Root</button>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {folderSegments.map((seg, index) => {
                    const path = folderSegments.slice(0, index + 1).join('/');
                    const isLast = index === folderSegments.length - 1;
                    return (
                      <React.Fragment key={path}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{seg}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              asChild
                              className="cursor-pointer"
                              onClick={() => navigateToFolder(path)}
                            >
                              <button type="button">{seg}</button>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {selectionMode ? (
                <>
                  {selectedMedia.size > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleSelectAll}>
                        {selectedMedia.size === media.length ? 'Deselect All' : 'Select All'}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete ({selectedMedia.size})
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                    Select
                  </Button>

                  {/* create folder button */}
                  <Button variant="outline" size="sm" onClick={() => setIsCreateFolderOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Create Folder
                  </Button>

                  <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Subfolders section - Display all folders without any limiting */}
          {folders.length > 0 || isTreeLoading ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <FolderIcon className="text-muted-foreground h-4 w-4" />
                <h3 className="text-sm font-semibold">
                  Folders
                  {!isTreeLoading && folders.length > 0 && (
                    <span className="text-muted-foreground ml-2 font-normal">({folders.length})</span>
                  )}
                </h3>
              </div>
              {isTreeLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="aspect-square w-full rounded-lg" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8">
                  {/* Display all folders - no slicing or limiting */}
                  {folders.map(folder => (
                    <button
                      key={folder.path}
                      type="button"
                      onClick={() => navigateToFolder(folder.path)}
                      className="group bg-card hover:bg-muted/50 relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg">
                        <FolderIcon className="h-10 w-10 text-orange-300" fill="currentColor" />
                      </div>
                      <span className="line-clamp-2 w-full text-sm font-medium" title={folder.name}>
                        {folder.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
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
              <h3 className="mt-4 text-lg font-semibold">No media files</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Upload images and videos to your media library
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)} className="mt-4">
                <Upload className="mr-2 h-4 w-4" />
                Upload
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
                      <span>Loading...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasNextPage && media.length > 0 && (
                <div className="text-muted-foreground mt-6 text-center text-sm">No more items to load</div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UploadMediaDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        folder={currentFolder || undefined}
      />
      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        currentFolder={currentFolder || undefined}
        onSuccess={handleFolderCreated}
      />

      {mediaToDelete && (
        <ConfirmDialogDynamic
          open={!!mediaToDelete}
          onOpenChange={() => setMediaToDelete(null)}
          onConfirm={confirmDelete}
          title="Are you sure you want to delete this media file? This action cannot be undone."
          description="Are you sure you want to delete this media file? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteMutation.isPending}
        />
      )}

      {showBulkDeleteConfirm && (
        <ConfirmDialogDynamic
          open={showBulkDeleteConfirm}
          onOpenChange={() => setShowBulkDeleteConfirm(false)}
          onConfirm={confirmBulkDelete}
          title="Are you sure you want to delete these media files? This action cannot be undone."
          description={`Are you sure you want to delete these media files? This action cannot be undone. (${selectedMedia.size} media files)`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteMutation.isPending}
        />
      )}

      {viewingMedia && (
        <MediaViewerModalDynamic
          media={viewingMedia}
          allMedia={media}
          onClose={() => setViewingMedia(null)}
          onNavigate={setViewingMedia}
        />
      )}
    </>
  );
}
