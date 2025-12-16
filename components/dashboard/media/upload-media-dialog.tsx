'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUploadMedia } from '@/hooks/api/media/use-media';
import { useTranslation } from '@/providers/translations-provider';
import { Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface UploadMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folder?: string; // current folder from the gallery
}

export function UploadMediaDialog({ isOpen, onClose, folder }: UploadMediaDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uploadMutation = useUploadMedia();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await uploadMutation.mutateAsync({ files: selectedFiles, folder });
      toast.success('Media uploaded successfully');
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      toast.error('Failed to upload media');
      console.error('Upload error:', error);
    }
  };

  const handleClose = () => {
    if (!uploadMutation.isPending) {
      setSelectedFiles([]);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload</DialogTitle>
          <DialogDescription>Upload images and videos to your media library</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={uploadMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || uploadMutation.isPending}>
              {uploadMutation.isPending
                ? 'Uploading...'
                : `Upload ${selectedFiles.length} files${selectedFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
