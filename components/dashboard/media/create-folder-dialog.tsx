'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateFolder } from '@/hooks/api/media/use-media';
import { useTranslation } from '@/providers/translations-provider';
import { createFolderSchema } from '@/validations/media';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolder?: string;
  onSuccess?: (folderPath: string) => void;
}

export function CreateFolderDialog({
  isOpen,
  onClose,
  currentFolder = '',
  onSuccess,
}: CreateFolderDialogProps) {
  const createFolderMutation = useCreateFolder();

  const folderForm = useForm({
    resolver: zodResolver(createFolderSchema()),
    defaultValues: {
      name: '',
    },
  });

  const folderName = useWatch({
    control: folderForm.control,
    name: 'name',
  });

  const handleCreateFolder = async (data: { name: string }) => {
    const trimmed = data.name.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmed) {
      toast.error('Please enter a folder name');
      return;
    }

    // build the full path relative to the current folder
    const fullPath = currentFolder ? `${currentFolder}/${trimmed}` : trimmed;

    try {
      await createFolderMutation.mutateAsync(fullPath);
      toast.success('Folder created successfully');

      folderForm.reset();
      onClose();

      // Call success callback with the new folder path
      if (onSuccess) {
        onSuccess(fullPath);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Error creating folder');
    }
  };

  const handleClose = () => {
    if (!createFolderMutation.isPending) {
      folderForm.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-start">Create Folder</DialogTitle>
          <DialogDescription className="text-start">
            Create a new folder to organize your media files
          </DialogDescription>
        </DialogHeader>
        <Form {...folderForm}>
          <form onSubmit={folderForm.handleSubmit(handleCreateFolder)} className="space-y-4">
            <FormField
              control={folderForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Enter folder name"
                      disabled={createFolderMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentFolder && (
              <p className="text-muted-foreground text-xs">
                Current Path:
                <span className="font-mono">
                  {currentFolder}/{folderName || '...'}
                </span>
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={createFolderMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={createFolderMutation.isPending}>
                {createFolderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Folder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
