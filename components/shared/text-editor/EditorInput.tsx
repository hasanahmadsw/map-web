'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control, FieldValues, Path } from 'react-hook-form';
import Editor from '@/components/shared/text-editor/Editor';

interface EditorInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  placeholder?: string;
  language?: string;
}

export function EditorInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  language,
}: EditorInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className="mb-0.5!">{label}</FormLabel>}
          <FormControl>
            <Editor placeholder={placeholder} language={language} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
