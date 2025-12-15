"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/shared/input/TextInput';
import { FileInput } from '@/components/shared/input/FileInput';
import { useTranslation } from '@/providers/translations-provider';
import { useStaff } from '@/hooks/staff/useStaff';
import { Save, Loader2 } from 'lucide-react';
import { updateMeSchema } from '@/schemas/staff.schemas';
import { z } from 'zod';
import type { TUpdateMeDTO } from '@/schemas/staff.schemas';
import { useAuth } from '@/hooks/useAuth';
import { formatValidationMessage } from '@/schemas/common.schemas';
import { staffService } from '@/services/staff.service';

interface EditProfilePageProps {
  params: Promise<{ lang: string }>;
}

export default function EditProfilePage({ params }: EditProfilePageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: user } = useAuth();
  const { updateMe, isUpdatingMe, updateError } = useStaff();

  // Profile form
  interface UpdateMeFormValues extends TUpdateMeDTO { file?: File }

  const profileForm = useForm<UpdateMeFormValues>({
    resolver: zodResolver(updateMeSchema({
      required: t.validation.required,
      invalidUrl: t.validation.invalidUrl,
      passwordTooShort: t.validation.passwordTooShort,
      atLeastOne: t.validation.atLeastOne,
    }).extend({ file: z.any().optional() })) as any,
    defaultValues: {
      image: '',
      password: '',
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        image: user.image || '',
        password: '',
      });
    }
  }, [user, profileForm]);

  // Watch for file changes (handled by FileInput auto-upload)
  const selectedFile = profileForm.watch('file');

  const onProfileSubmit = async (data: UpdateMeFormValues) => {
    try {
      // Prepare update payload - only include fields that have values
      const updatePayload: Partial<TUpdateMeDTO> = {};
      
      // Include image if it has a value
      if (data.image && data.image.trim() !== '') {
        updatePayload.image = data.image;
      }
      
      // Only include password if it's provided and not empty
      if (data.password && data.password.trim() !== '') {
        updatePayload.password = data.password;
      }
      
      // Update profile
      await updateMe(updatePayload as TUpdateMeDTO);
      
      toast.success(formatValidationMessage(t.validation.updatedSuccessfully, {
        entity: t.staffs.staff,
      }));
    } catch (error) {
      toast.error(updateError || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
    
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.staffs.editProfile }</h1>
          <p className="text-muted-foreground">{t.staffs.editProfileDescription }</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.common.profileDetails}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.staffs.editProfileDescription }
          </p>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <TextInput
                  control={profileForm.control}
                  name="password"
                  label={t.common.password}
                  placeholder={t.common.passwordPlaceholder}
                  type="password"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.common.image}</label>
                  {!(selectedFile instanceof File) && (() => {
                    const currentImage = profileForm.watch('image') || user.image;
                    return currentImage ? (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">{t.common.currentImage}:</p>
                        <img
                          src={currentImage}
                          alt="Current profile"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      </div>
                    ) : null;
                  })()}
                  <FileInput
                    name="file"
                    label=""
                    placeholder={t.common.chooseNewProfilePicture}
                    accept="image/*"
                    maxSize={5}
                    autoUpload={true}
                    uploadFieldName="image"
                    uploadService={staffService.uploadPicture}
                  />
                </div>
                
                
                
              </div>

              <Button type="submit" disabled={isUpdatingMe}>
                {isUpdatingMe && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {isUpdatingMe ? t.validation.updating : t.validation.update}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
