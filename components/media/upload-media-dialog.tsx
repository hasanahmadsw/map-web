"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploadMedia } from "@/hooks/media/use-media";
import { useTranslation } from "@/providers/translations-provider";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface UploadMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export function UploadMediaDialog({ isOpen, onClose, onUploadSuccess }: UploadMediaDialogProps) {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadMutation = useUploadMedia();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploadProgress(0);
      await uploadMutation.mutateAsync({
        files: selectedFiles,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });
      toast.success(t.media.messages.uploadSuccess);
      setSelectedFiles([]);
      setUploadProgress(0);
      onUploadSuccess?.();
      onClose();
    } catch (error) {
      toast.error(t.media.messages.uploadError);
      console.error("Upload error:", error);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!uploadMutation.isPending) {
      setSelectedFiles([]);
      setUploadProgress(0);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.common.actions.upload}</DialogTitle>
          <DialogDescription>{t.media.actions.uploadDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">
              {t.media.actions.selectFiles}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.media.actions.dragDrop}
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {uploadMutation.isPending && (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
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

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={uploadMutation.isPending}
            >
              {t.common.actions.cancel}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploadMutation.isPending}
            >
              {uploadMutation.isPending
                ? `${t.media.messages.uploading} ${uploadProgress}%`
                : `${t.common.actions.upload} ${selectedFiles.length} file${selectedFiles.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

