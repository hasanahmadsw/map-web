'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';

import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { EditorInput } from '@/components/shared/text-editor/EditorInput';

export function BasicInformationSection() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <TextInput control={control} name="name" label="Article Title" placeholder="Enter article title" />
        <TextInput control={control} name="slug" label="Slug" placeholder="Enter article slug" />
      </div>

      <EditorInput
        control={control}
        name="content"
        label="Content"
        placeholder="Enter article content"
        language="en"
      />

      <TextAreaInput
        control={control}
        name="excerpt"
        label="Excerpt"
        placeholder="Enter article excerpt"
        className="min-h-[100px]"
      />
    </>
  );
}
