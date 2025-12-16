'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput } from '@/components/shared/input/TextInput';

export function ContactInformationSection() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TextInput
            control={control}
            name="contact.email"
            label="Email"
            type="email"
            placeholder="Enter email address"
          />
          <TextInput control={control} name="contact.phone" label="Phone" placeholder="Enter phone number" />
        </div>
      </CardContent>
    </Card>
  );
}
