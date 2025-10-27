"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { staffService } from "@/services/staff.service";
import { useTranslation } from "@/providers/translations-provider";

interface FileInputProps {
  name: string;
  label: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  autoUpload?: boolean; // New prop to enable auto-upload
  uploadFieldName?: string; // Field name to store the uploaded URL
}

export function FileInput({
  name,
  label,
  placeholder,
  accept = "image/*",
  maxSize = 5, // 5MB default
  className,
  autoUpload = false,
  uploadFieldName,
}: FileInputProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFilesRef = useRef<Set<string>>(new Set());

  const file = watch(name);
  const error = errors[name];
  const uploadField = uploadFieldName ? watch(uploadFieldName) : (typeof file === 'string' ? file : null);

  // Auto-upload functionality
  const uploadFile = useCallback(async (fileToUpload: File) => {
    const fileKey = `${fileToUpload.name}-${fileToUpload.size}-${fileToUpload.lastModified}`;
    
    // Check if we've already uploaded this file
    if (uploadedFilesRef.current.has(fileKey)) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const { url } = await staffService.uploadPicture(fileToUpload);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (uploadFieldName) {
        setValue(uploadFieldName, url, { shouldDirty: true, shouldValidate: true });
      } else {
        // If no uploadFieldName, set the URL directly to the same field
        setValue(name, url, { shouldDirty: true, shouldValidate: true });
      }
      // Mark this file as uploaded
      uploadedFilesRef.current.add(fileKey);
      toast.success(t.common.imageUploadedSuccessfully);
    } catch (error) {
      clearInterval(progressInterval);
      toast.error(t.common.failedToUploadImage);
      console.error("Upload error:", error);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  }, [uploadFieldName, setValue]);

  useEffect(() => {
    if (autoUpload && file instanceof File && !isUploading) {
      uploadFile(file);
    }
  }, [file, autoUpload, isUploading, uploadFile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      uploadedFilesRef.current.clear();
    };
  }, []);

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setValue(name, null);
        setPreview(null);
        return;
      }

      // Validate file type
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        setValue(name, null);
        setPreview(null);
        return;
      }

      // Set the file in the form data
      setValue(name, file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setValue(name, null);
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setValue(name, null);
    setPreview(null);
    if (uploadFieldName) {
      setValue(uploadFieldName, null);
    }
    // Clear uploaded files tracking
    uploadedFilesRef.current.clear();
    // Reset upload state
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          error ? "border-destructive" : "",
          isUploading ? "border-primary bg-primary/5 cursor-not-allowed" : "hover:border-primary/50 cursor-pointer"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          {...register(name)}
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={isUploading}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
        
        {(preview || uploadField) ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="relative w-32 h-32">
                <img
                  src={uploadField || preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                      <span className="text-xs text-white">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
              {!isUploading && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isUploading ? `${t.common.uploading} ${Math.round(uploadProgress)}%` : (file?.name || t.common.uploadedImage)}
              </p>
              {isUploading && (
                <div className="mt-2 w-32 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-muted">
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              ) : accept.startsWith('image/') ? (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isUploading ? `${t.common.uploading} ${Math.round(uploadProgress)}%` : (placeholder || t.common.chooseFile)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isUploading ? t.common.pleaseWait : t.common.dragAndDropOrClick}
              </p>
              {isUploading && (
                <div className="mt-2 w-32 bg-gray-200 rounded-full h-1.5 mx-auto">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {t.common.maxSize.replace("{size}", maxSize.toString())}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
