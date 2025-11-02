"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/translations-provider";
import { Media } from "@/types/media.types";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaViewerModalProps {
  media: Media | null;
  allMedia: Media[];
  onClose: () => void;
  onNavigate?: (media: Media) => void;
}

export function MediaViewerModal({  
  media, 
  allMedia, 
  onClose,
  onNavigate 
}: MediaViewerModalProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (media && allMedia.length > 0) {
      const index = allMedia.findIndex((m) => m.url === media.url);
      setCurrentIndex(index);
    }
  }, [media, allMedia]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!media) return;
      
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [media, currentIndex]);

  if (!media) return null;

  const isImage = media.mimeType.startsWith("image/");
  const isVideo = media.mimeType.startsWith("video/");
  
  const canNavigatePrevious = currentIndex > 0;
  const canNavigateNext = currentIndex < allMedia.length - 1;

  const handlePrevious = () => {
    if (canNavigatePrevious) {
      const newMedia = allMedia[currentIndex - 1];
      onNavigate?.(newMedia);
    }
  };

  const handleNext = () => {
    if (canNavigateNext) {
      const newMedia = allMedia[currentIndex + 1];
      onNavigate?.(newMedia);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-50 h-10 w-10 rounded-full text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
        <span className="sr-only">{t.media.viewer.close}</span>
      </Button>

      {/* Download Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-16 top-4 z-50 h-10 w-10 rounded-full text-white hover:bg-white/20"
        asChild
      >
        <a href={media.url} download={media.name}>
          <Download className="h-5 w-5" />
          <span className="sr-only">{t.media.viewer.download}</span>
        </a>
      </Button>

      {/* Previous Button */}
      {canNavigatePrevious && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
        >
          <ChevronLeft className="h-8 w-8" />
          <span className="sr-only">{t.media.viewer.previous}</span>
        </Button>
      )}

      {/* Next Button */}
      {canNavigateNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <ChevronRight className="h-8 w-8" />
          <span className="sr-only">{t.media.viewer.next}</span>
        </Button>
      )}

      {/* Media Content */}
      <div 
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {isImage && (
          <Image
            src={media.url}
            alt={media.name}
            width={1920}
            height={1080}
            className="max-h-[80vh] max-w-[80vw] rounded object-contain"
            priority
          />
        )}
        
        {isVideo && (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw] rounded"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            Your browser does not support the video tag.
          </video>
        )}

        {!isImage && !isVideo && (
          <div className="flex h-96 w-96 items-center justify-center rounded bg-muted">
            <div className="text-center">
              <span className="text-6xl">📄</span>
              <p className="mt-4 text-white">{media.name}</p>
              <p className="mt-2 text-sm text-white/70">
                {t.media.viewer.fileType}: {media.mimeType}
              </p>
            </div>
          </div>
        )}

        {/* Media Info */}
        {!isVideo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
            <p className="text-sm font-medium text-white">{media.name}</p>
            <div className="mt-1 flex items-center gap-4 text-xs text-white/70">
              <span>{(media.size / 1024 / 1024).toFixed(2)} MB</span>
              <span>{new Date(media.createdAt).toLocaleDateString()}</span>
              {allMedia.length > 1 && (
                <span>
                  {currentIndex + 1} / {allMedia.length}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

