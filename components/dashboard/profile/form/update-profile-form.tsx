'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useStaffMe } from '@/hooks/staff/useStaffMe';
import { useUpdateMeMutation } from '@/hooks/staff/mutations';
import { getChangedValues } from '@/utils/format';
import { updateMeSchema, type TUpdateMeForm } from '@/validations/staff/update-me.schema';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { TextInput } from '@/components/shared/input/TextInput';
import { PasswordInput } from '@/components/shared/input/PasswordInput';

export function UpdateProfileForm() {
  const router = useRouter();
  const { currentStaff, isLoading, isError, error, refetch } = useStaffMe();
  const updateMeMutation = useUpdateMeMutation();

  const form = useForm<TUpdateMeForm>({
    resolver: zodResolver(updateMeSchema()) as Resolver<TUpdateMeForm>,
  });

  useEffect(() => {
    if (!currentStaff) return;

    form.reset({
      name: currentStaff.name,
      bio: currentStaff.bio || '',
      image: currentStaff.image || '',
      password: undefined,
      confirmPassword: undefined,
    });
  }, [currentStaff, form]);

  const onSubmit = async (data: TUpdateMeForm) => {
    if (!currentStaff) return;

    const { confirmPassword, ...rest } = data;
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateMeForm, rest);

    if (!Object.keys(changedValues).length) {
      toast.error('No changes to update');
      return;
    }

    try {
      await updateMeMutation.mutateAsync(changedValues);
      toast.success('Profile updated successfully');
      router.push('/dashboard/profile');
      router.refresh();
    } catch (err) {
      const message = (err as Error)?.message || 'Failed to update profile';
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !currentStaff) {
    return (
      <div className="flex h-32 flex-col items-center justify-center gap-3">
        <p className="text-destructive text-sm">{error || 'Failed to load profile'}</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
            <CardDescription>Update your personal information and profile photo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <TextInput control={form.control} name="name" label="Name" placeholder="Enter name" />

            <TextAreaInput
              control={form.control}
              name="bio"
              label="Bio"
              placeholder="Enter bio"
              className="min-h-[100px]"
              disabled={updateMeMutation.isPending}
            />

            {/* Featured image */}
            <MediaSelectInput control={form.control} name="image" label="Profile Image" typeFilter="image" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Change your password (optional).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Leave blank to keep your current password</AlertTitle>
              <AlertDescription>Only fill these fields if you want to update your password.</AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PasswordInput
                control={form.control}
                name="password"
                label="New Password"
                placeholder="Enter new password"
                autoComplete="new-password"
                disabled={updateMeMutation.isPending}
              />
              <PasswordInput
                control={form.control}
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={updateMeMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={updateMeMutation.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={updateMeMutation.isPending}
            loadingText="Updating..."
            defaultText="Update Profile"
            icon={Save}
            disabled={!form.formState.isDirty}
          />
        </div>
      </form>
    </Form>
  );
}
