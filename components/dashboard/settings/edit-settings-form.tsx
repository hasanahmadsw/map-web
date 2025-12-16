'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { useSettings } from '@/hooks/settings/useSettings';
import {
  updateSettingsSchema,
  type TUpdateSettingsForm,
} from '@/validations/settings/update-settings.schema';
import ResponseError from '@/components/shared/response-error';
import { getChangedValues, sanitizeDto } from '@/utils/format';
import type { Settings } from '@/types/settings.types';

import { BasicInformationSection } from './form/partial/basic-information-section';
import { SiteImagesSection } from './form/partial/site-images-section';
import { MetaInformationSection } from './form/partial/meta-information-section';
import { SocialLinksSection } from './form/partial/social-links-section';
import { AnalyticsSection } from './form/partial/analytics-section';
import { ContactInformationSection } from './form/partial/contact-information-section';
import { CustomScriptsSection } from './form/partial/custom-scripts-section';

interface EditSettingsFormProps {
  settings: Settings;
}

export default function EditSettingsForm({ settings }: EditSettingsFormProps) {
  const router = useRouter();
  const { updateSettings, isUpdating, updateError } = useSettings();

  const form = useForm<TUpdateSettingsForm>({
    resolver: zodResolver(updateSettingsSchema()) as Resolver<TUpdateSettingsForm>,
    defaultValues: {
      siteName: settings?.siteName || '',
      siteDescription: settings?.siteDescription || '',
      siteLogo: settings?.siteLogo || '',
      siteDarkLogo: settings?.siteDarkLogo || '',
      siteFavicon: settings?.siteFavicon || '',
      defaultLanguage: settings?.defaultLanguage || 'en',
      meta: {
        title: settings?.meta?.title || '',
        description: settings?.meta?.description || '',
        keywords: settings?.meta?.keywords || [],
      },
      social: settings?.social || [],
      analytics: {
        googleAnalytics: settings?.analytics?.googleAnalytics || '',
        facebookPixel: settings?.analytics?.facebookPixel || '',
        customScripts: settings?.analytics?.customScripts || [],
      },
      contact: {
        email: settings?.contact?.email || '',
        phone: settings?.contact?.phone || '',
      },
      customScripts: {
        header: settings?.customScripts?.header || [],
        footer: settings?.customScripts?.footer || [],
      },
    },
  });

  const onSubmit = async (data: TUpdateSettingsForm) => {
    if (!settings?.id) {
      toast.error('Settings not found');
      return;
    }
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateSettingsForm, data);

    try {
      await updateSettings(changedValues);
      toast.success('Settings updated successfully');
      router.refresh();
    } catch {
      toast.error(updateError || 'Failed to update settings');
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <BasicInformationSection />

          {/* Site Images */}
          <SiteImagesSection />

          {/* Meta Information */}
          <MetaInformationSection />

          {/* Social Links */}
          <SocialLinksSection />

          {/* Analytics */}
          <AnalyticsSection />

          {/* Contact Information */}
          <ContactInformationSection />

          {/* Custom Scripts */}
          <CustomScriptsSection />

          <ResponseError error={updateError as unknown as Error} />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isUpdating}>
              Cancel
            </Button>
            <LoadingButton
              isLoading={isUpdating}
              loadingText="Saving..."
              defaultText="Save Changes"
              icon={Save}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
