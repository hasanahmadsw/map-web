'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CheckboxGroupInput } from '@/components/shared/input/CheckboxGroupInput';
import { FileInput } from '@/components/shared/input/FileInput';
import { PasswordInput } from '@/components/shared/input/PasswordInput';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { TextInput } from '@/components/shared/input/TextInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useLanguages } from '@/hooks/useLanguages';
import { useStaffMutations } from '@/hooks/staff/mutations';
import { useTranslation } from '@/providers/translations-provider';
import { createStaffSchema, type TCreateStaffDTO } from '@/schemas/staff.schemas';
import { staffService } from '@/services/staff.service';
import { Role, ROLES } from '@/enums/roles.enum';
import { formatValidationMessage } from '@/schemas/common.schemas';

export function AddStaffMember({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { create } = useStaffMutations();
  const { languages, isLoading: isLoadingLanguages } = useLanguages();
  const { t } = useTranslation();
  const [open, setOpen] = useState(isOpen);

  const form = useForm<TCreateStaffDTO>({
    resolver: zodResolver(createStaffSchema(t.validation)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: Role.AUTHOR,
      bio: '',
      image: '',
    },
  });

  // Sync open state with isOpen prop
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onSubmit = async (data: TCreateStaffDTO) => {
    try {
      const payload = {
        ...data,
        image: data.image || undefined,
      };

      await create.mutateAsync(payload);
      toast.success(
        formatValidationMessage(t.validation.createdSuccessfully, {
          entity: t.staffs.staff,
        }),
      );
      form.reset();
      setOpen(false);
      onClose();
    } catch (error) {
      const errorMessage =
        (create.error as Error | undefined)?.message ||
        formatValidationMessage(t.validation.failedToCreate, {
          entity: t.staffs.staff,
        });
      toast.error(errorMessage);
    }
  };

  const handleClose = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      onClose();
    }
  };

  // Show loading state if languages are still loading
  if (isLoadingLanguages || !languages || languages.length === 0) {
    return (
      <Button disabled>
        <Plus className="me-2 h-4 w-4" />
        {t.staffs.addStaff}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" />
          {t.staffs.addStaff}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[500px] overflow-y-auto sm:max-h-[550px] sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-start">{t.staffs.addStaff}</DialogTitle>
          <DialogDescription className="text-start">{t.staffs.createStaffDesc}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                control={form.control}
                name="name"
                label={t.common.name}
                placeholder={t.common.namePlaceholder}
              />

              <TextInput
                control={form.control}
                name="email"
                label={t.common.email}
                placeholder={t.common.emailPlaceholder}
                type="email"
              />

              <PasswordInput
                control={form.control}
                name="password"
                label={t.common.password}
                placeholder={t.common.passwordPlaceholder}
                disabled={create.isPending}
              />

              <SelectInput
                control={form.control}
                name="role"
                label={t.staffs.role}
                placeholder={t.staffs.rolePlaceholder}
                options={ROLES.map(r => ({
                  value: r,
                  label: r.charAt(0).toUpperCase() + r.slice(1),
                }))}
              />
            </div>

            <TextAreaInput
              control={form.control}
              name="bio"
              label={t.common.bio}
              placeholder={t.common.bioPlaceholder}
              className="min-h-[100px]"
            />

            <FileInput
              name="image"
              label={t.common.image}
              placeholder={t.common.chooseFile}
              accept="image/*"
              maxSize={10}
              autoUpload={true}
              uploadService={staffService.uploadPicture}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={create.isPending}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {create.isPending ? t.common.loading : t.common.add}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
