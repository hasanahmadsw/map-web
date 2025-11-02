"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/providers/translations-provider";
import { Media } from "@/types/media.types";
import { Copy, Download, Eye, MoreVertical, PlayCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  selectionMode = false 
}: MediaCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const isImage = media.mimeType.startsWith("image/");
  const isVideo = media.mimeType.startsWith("video/");

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(media, !isSelected);
    } else if (onView) {
      onView(media);
    }
  };

  return (
    <Card 
      className={`py-0 group overflow-hidden transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary" : ""
      } ${selectionMode || onView ? "cursor-pointer" : ""}`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square bg-muted">
        {isImage && !imageError ? (
          <Image
            src={media.url}
            alt={media.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : isVideo ? (
          <div className="relative h-full w-full">
            <video
              src={media.url}
              className="h-full w-full object-cover"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-muted-foreground">📄</span>
          </div>
        )}

        {/* View overlay on hover */}
        {!selectionMode && onView && (isImage || isVideo) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Eye className="h-8 w-8 text-white" />
          </div>
        )}
        
        {selectionMode && onSelect && (
          <div 
            className="absolute left-2 top-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(media, checked as boolean)}
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>
        )}
        
        {!selectionMode && (
          <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (isImage || isVideo) && (
                  <DropdownMenuItem onClick={() => onView(media)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t.media.card.view}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onCopy(media.url)}>
                  <Copy className="mr-2 h-4 w-4" />
                  {t.media.card.copyUrl}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={media.url} download={media.name}>
                    <Download className="mr-2 h-4 w-4" />
                    {t.media.card.download}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(media)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t.media.card.delete}
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
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatFileSize(media.size)}</span>
          <span>{new Date(media.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

