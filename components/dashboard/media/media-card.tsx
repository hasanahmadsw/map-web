'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Media } from '@/types/media.types';
import { Copy, Download, Eye, MoreVertical, PlayCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface MediaCardProps {
  media: Media;
  onDelete: (media: Media) => void;
  onCopy: (url: string) => void;
  onView?: (media: Media) => void;
  isSelected?: boolean;
  onSelect?: (media: Media, selected: boolean) => void;
  selectionMode?: boolean;
}

export function MediaCard({
  media,
  onDelete,
  onCopy,
  onView,
  isSelected = false,
  onSelect,
  selectionMode = false,
}: MediaCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = media.mimeType.startsWith('image/');
  const isVideo = media.mimeType.startsWith('video/');

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      // In selection mode, toggle selection
      onSelect(media, !isSelected);
    } else if (!selectionMode && onView) {
      // Not in selection mode, open viewer
      onView(media);
    }
  };

  return (
    <Card
      className={`group overflow-hidden py-0 transition-all hover:shadow-lg ${
        isSelected ? 'ring-primary ring-2' : ''
      } ${selectionMode || onView ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="bg-muted relative aspect-square">
        {isImage && !imageError ? (
          <Image
            src={media.url}
            alt={media.name}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
          />
        ) : isVideo ? (
          <div className="relative h-full w-full">
            <video src={media.url} className="h-full w-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-4xl">📄</span>
          </div>
        )}

        {/* View overlay on hover */}
        {!selectionMode && onView && (isImage || isVideo) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Eye className="h-8 w-8 text-white" />
          </div>
        )}

        {selectionMode && onSelect && (
          <div className="absolute top-2 left-2 z-10" onClick={e => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={checked => onSelect(media, checked as boolean)}
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>
        )}

        {!selectionMode && (
          <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-background/80 h-8 w-8 backdrop-blur-sm"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                {onView && (isImage || isVideo) && (
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      onView(media);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4 text-blue-500" />
                    View
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onCopy(media.url);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4 text-amber-500" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={media.url} download={media.name} onClick={e => e.stopPropagation()}>
                    <Download className="mr-2 h-4 w-4 text-green-500" />
                    Download
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(media);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <p className="truncate text-sm font-medium" title={media.name}>
          {media.name}
        </p>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>{formatFileSize(media.size)}</span>
          <span>{new Date(media.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
