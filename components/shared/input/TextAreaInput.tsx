'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextAreaInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  maxHeight?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  disabled?: boolean;
}

export function TextAreaInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  rows = 4,
  maxHeight,
  resize = 'vertical',
  disabled = false,
}: TextAreaInputProps<T>) {
  const textareaStyles = cn(
    className,
    resize === 'none' && 'resize-none',
    resize === 'horizontal' && 'resize-x',
    resize === 'vertical' && 'resize-y',
    resize === 'both' && 'resize',
  );

  const dynamicStyles = {
    ...(maxHeight && { maxHeight }),
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              className={textareaStyles}
              placeholder={placeholder}
              rows={rows}
              style={dynamicStyles}
              disabled={disabled}
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
