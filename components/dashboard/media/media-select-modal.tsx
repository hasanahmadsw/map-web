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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaInfinite, useMediaTree, useUploadMedia } from '@/hooks/api/media/use-media';
import { useTranslation } from '@/providers/translations-provider';
import { Media } from '@/types/mediaa.types';
import {
  CheckSquare2,
  Folder as FolderIcon,
  FolderPlus,
  Loader2,
  Search,
  Square,
  Upload,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { CreateFolderDialog } from './create-folder-dialog';
import { MediaCard } from './media-card';
import ApiError from '../../shared/api-error';

interface MediaSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaUrl: string | string[]) => void; // Can return single or multiple
  typeFilter?: 'image' | 'video' | 'all';
  currentValue?: string | string[]; // Can be single or array
  multiple?: boolean; // Enable multiple selection
  folder?: string; // Initial folder
}

export function MediaSelectModal({
  isOpen,
  onClose,
  onSelect,
  typeFilter: initialTypeFilter = 'image',
  currentValue,
  multiple = false,
  folder: initialFolder,
}: MediaSelectModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [typeFilter, setTypeFilter] = useState<'image' | 'video' | 'all'>(initialTypeFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>(initialFolder || '');
  const [uploadFolder, setUploadFolder] = useState<string>(initialFolder || '');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // For single selection
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  // For multiple selection
  const [selectedMediaSet, setSelectedMediaSet] = useState<Set<string>>(new Set());

  // Get folder tree
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
    limit: 100,
    folder: currentFolder || undefined,
  });

  const uploadMutation = useUploadMedia();

  const allMedia = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const media = useMemo(() => {
    if (!searchQuery.trim()) {
      return allMedia;
    }
    const query = searchQuery.toLowerCase().trim();
    return allMedia.filter(item => item.name.toLowerCase().includes(query));
  }, [allMedia, searchQuery]);

  // Initialize selected media from currentValue
  useEffect(() => {
    if (!currentValue || media.length === 0) return;

    if (multiple && Array.isArray(currentValue)) {
      const urls = new Set(currentValue);
      const found = media.filter(m => urls.has(m.url) || urls.has(m.path));
      setTimeout(() => {
        setSelectedMediaSet(new Set(found.map(m => m.url)));
      }, 0);
    } else if (!multiple && typeof currentValue === 'string') {
      const found = media.find(m => m.url === currentValue || m.path === currentValue);
      if (found) {
        setTimeout(() => {
          setSelectedMedia(found);
        }, 0);
      }
    }
  }, [currentValue, media, multiple]);

  useEffect(() => {
    if (
      !loadMoreRef.current ||
      !hasNextPage ||
      isFetchingNextPage ||
      activeTab !== 'library' ||
      searchQuery.trim()
    )
      return;

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, activeTab, searchQuery]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
    },
    multiple: true,
  });

  const handleMediaSelect = (media: Media) => {
    if (multiple) {
      setSelectedMediaSet(prev => {
        const newSet = new Set(prev);
        if (newSet.has(media.url)) {
          newSet.delete(media.url);
        } else {
          newSet.add(media.url);
        }
        return newSet;
      });
    } else {
      setSelectedMedia(media);
    }
  };

  const handleConfirm = () => {
    if (activeTab === 'library') {
      if (multiple) {
        const urls = Array.from(selectedMediaSet);
        if (urls.length > 0) {
          onSelect(urls);
          handleClose();
        }
      } else if (selectedMedia) {
        onSelect(selectedMedia.url);
        handleClose();
      }
    } else if (activeTab === 'upload' && selectedFiles.length > 0) {
      handleUploadAndSelect();
    }
  };

  const handleUploadAndSelect = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const folder = uploadFolder.trim() || undefined;
      const urls = await uploadMutation.mutateAsync({ files: selectedFiles, folder });
      if (urls && urls.length > 0) {
        if (multiple) {
          onSelect(urls);
        } else {
          onSelect(urls[0]);
        }
        handleClose();
      }
    } catch (error) {
      toast.error('Error uploading media');
      console.error('Upload error:', error);
    }
  };

  const handleClose = () => {
    if (!uploadMutation.isPending) {
      setSelectedFiles([]);
      setSelectedMedia(null);
      setSelectedMediaSet(new Set());
      setActiveTab('library');
      setTypeFilter(initialTypeFilter);
      setSearchQuery('');
      setCurrentFolder(initialFolder || '');
      setUploadFolder(initialFolder || '');
      onClose();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const navigateToFolder = (folderPath?: string) => {
    const path = folderPath || '';
    setCurrentFolder(path);
    setSelectedMedia(null);
    setSelectedMediaSet(new Set());
  };

  const folderSegments = currentFolder ? currentFolder.split('/') : [];

  const handleFolderCreated = (folderPath: string) => {
    navigateToFolder(folderPath);
    setIsCreateFolderOpen(false);
  };

  // Check if all items in current folder are selected
  const allInFolderSelected = useMemo(() => {
    if (!multiple || media.length === 0) return false;
    return media.every(item => selectedMediaSet.has(item.url));
  }, [multiple, media, selectedMediaSet]);

  // Handle select/deselect all in current folder
  const handleSelectAllInFolder = () => {
    if (!multiple) return;

    if (allInFolderSelected) {
      // Deselect all items in current folder
      setSelectedMediaSet(prev => {
        const newSet = new Set(prev);
        media.forEach(item => newSet.delete(item.url));
        return newSet;
      });
    } else {
      // Select all items in current folder
      setSelectedMediaSet(prev => {
        const newSet = new Set(prev);
        media.forEach(item => newSet.add(item.url));
        return newSet;
      });
    }
  };

  const canConfirm =
    activeTab === 'library'
      ? multiple
        ? selectedMediaSet.size > 0
        : !!selectedMedia
      : selectedFiles.length > 0;

  if (error || treeError) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-4xl">
          <ApiError
            errorMessage={error?.message || treeError?.message || 'Error loading media'}
            refetchFunction={refetch}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col sm:max-w-7xl">
          <DialogHeader className="shrink-0">
            <DialogTitle>{multiple ? 'Select Media Files' : 'Select Media File'}</DialogTitle>
            <DialogDescription>
              {activeTab === 'library'
                ? multiple
                  ? 'Select one or more media files from your library'
                  : 'Select a media file from your library'
                : 'Upload new media files'}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={value => setActiveTab(value as 'library' | 'upload')}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <TabsList className="grid w-full shrink-0 grid-cols-2">
              <TabsTrigger value="library">Media Library</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent
              value="library"
              className="mt-4 flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden"
            >
              <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto">
                {/* Breadcrumbs */}
                <Breadcrumb className="shrink-0">
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

                {/* Subfolders section - Display all folders without any limiting */}
                {(folders.length > 0 || isTreeLoading) && (
                  <div className="shrink-0 space-y-3">
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
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="aspect-square w-full rounded-lg" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {/* Display all folders - no slicing or limiting */}
                        {folders.map(folder => (
                          <button
                            key={folder.path}
                            type="button"
                            onClick={() => navigateToFolder(folder.path)}
                            className="group bg-card hover:bg-muted/50 relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                              <FolderIcon className="h-8 w-8 text-orange-300" fill="currentColor" />
                            </div>
                            <span className="line-clamp-2 w-full text-xs font-medium" title={folder.name}>
                              {folder.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex shrink-0 items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      placeholder={'Search media...'}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreateFolderOpen(true)}
                    title="Create folder"
                  >
                    <FolderPlus className="h-4 w-4" />
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
                </div>

                {/* Select All button - only show in subfolders with multiple selection */}
                {multiple && currentFolder && media.length > 0 && (
                  <div className="flex shrink-0 items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllInFolder}
                      className="flex items-center gap-2"
                    >
                      {allInFolderSelected ? (
                        <>
                          <CheckSquare2 className="h-4 w-4" />
                          Deselect All in Folder
                        </>
                      ) : (
                        <>
                          <Square className="h-4 w-4" />
                          Select All in Folder ({media.length})
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {multiple && selectedMediaSet.size > 0 && (
                  <div className="bg-muted/50 shrink-0 rounded-lg border p-2 text-sm">
                    {selectedMediaSet.size} file{selectedMediaSet.size !== 1 ? 's' : ''} selected
                  </div>
                )}

                <div className="min-h-0 flex-1">
                  {isLoading ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="aspect-square w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : media.length === 0 ? (
                    <div className="py-12 text-center">
                      <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                      <h3 className="mt-4 text-lg font-semibold">
                        {searchQuery.trim() ? 'No media found' : 'No media files'}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {searchQuery.trim()
                          ? 'Try adjusting your search terms'
                          : 'Switch to the Upload tab to add new media files'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {media.map(item => {
                          const isSelected = multiple
                            ? selectedMediaSet.has(item.url)
                            : selectedMedia?.url === item.url;
                          return (
                            <div
                              key={item.url}
                              onClick={() => handleMediaSelect(item)}
                              className="cursor-pointer"
                            >
                              <MediaCard
                                media={item}
                                onDelete={() => {}}
                                onCopy={() => {}}
                                selectionMode={multiple}
                                isSelected={isSelected}
                                onSelect={(media, selected) => handleMediaSelect(media)}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {!searchQuery.trim() && hasNextPage && (
                        <div ref={loadMoreRef} className="mt-6 flex justify-center">
                          {isFetchingNextPage && (
                            <div className="text-muted-foreground flex items-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Loading...</span>
                            </div>
                          )}
                        </div>
                      )}

                      {!searchQuery.trim() && !hasNextPage && media.length > 0 && (
                        <div className="text-muted-foreground mt-6 text-center text-sm">
                          No more items to load
                        </div>
                      )}

                      {searchQuery.trim() && media.length > 0 && (
                        <div className="text-muted-foreground mt-6 text-center text-sm">
                          Found {media.length} {media.length === 1 ? 'result' : 'results'}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="upload"
              className="mt-4 flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden"
            >
              <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto">
                {/* Folder selection for upload */}
                <div className="shrink-0 space-y-2">
                  <label className="text-sm font-medium">Upload to folder (optional)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., vehicles/covers or leave empty for root"
                      value={uploadFolder}
                      onChange={e => setUploadFolder(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadFolder(currentFolder)}
                      title="Use current folder"
                    >
                      Use Current
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Enter folder path (e.g., vehicles/covers) or leave empty to upload to root
                  </p>
                </div>

                <div className="flex-1 space-y-4">
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                      isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm font-medium">Select files or drag and drop</p>
                    <p className="text-muted-foreground text-xs">PNG, JPG, GIF, WEBP up to 10MB</p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="max-h-60 space-y-2 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted h-10 w-10 rounded" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                            disabled={uploadMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex shrink-0 justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleClose} disabled={uploadMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!canConfirm || uploadMutation.isPending}>
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : activeTab === 'library' ? (
                multiple ? (
                  `Select ${selectedMediaSet.size} file${selectedMediaSet.size !== 1 ? 's' : ''}`
                ) : (
                  'Select'
                )
              ) : (
                `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        currentFolder={currentFolder || undefined}
        onSuccess={handleFolderCreated}
      />
    </>
  );
}
