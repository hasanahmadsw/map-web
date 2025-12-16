'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

export function BasicInformationSection() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextInput control={control} name="siteName" label="Site Name" placeholder="Enter site name" />
        <TextAreaInput
          control={control}
          name="siteDescription"
          label="Site Description"
          placeholder="Enter site description"
          rows={3}
        />
      </CardContent>
    </Card>
  );
}
