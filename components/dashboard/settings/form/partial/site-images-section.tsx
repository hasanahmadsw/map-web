'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';

export function SiteImagesSection() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Site Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MediaSelectInput control={control} name="siteLogo" label="Site Logo" typeFilter="image" />
          <MediaSelectInput control={control} name="siteDarkLogo" label="Dark Logo" typeFilter="image" />
          <MediaSelectInput control={control} name="siteFavicon" label="Favicon" typeFilter="image" />
        </div>
      </CardContent>
    </Card>
  );
}
