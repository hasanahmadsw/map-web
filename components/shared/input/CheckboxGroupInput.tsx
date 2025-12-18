'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface CheckboxGroupInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  options: CheckboxOption[];
  className?: string;
  gridCols?: '1' | '2' | '3' | '4';
}

export function CheckboxGroupInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  className,
  gridCols = '1',
}: CheckboxGroupInputProps<T>) {
  const gridClass = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[gridCols];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const enabledOptions = options.filter(option => !option.disabled);
        const enabledValues = enabledOptions.map(option => option.value);
        const allSelected =
          enabledValues.length > 0 && enabledValues.every(value => field.value?.includes(value));
        const someSelected = enabledValues.some(value => field.value?.includes(value));

        function handleSelectAll() {
          const currentValues = field.value || [];
          const newValues = [...new Set([...currentValues, ...enabledValues])];
          field.onChange(newValues);
        }

        function handleDeselectAll() {
          const currentValues = field.value || [];
          const newValues = currentValues.filter((value: string) => !enabledValues.includes(value));
          field.onChange(newValues);
        }

        return (
          <FormItem>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <FormLabel className="text-base">{label}</FormLabel>
                  {description && <p className="text-muted-foreground text-sm">{description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={allSelected || enabledOptions.length === 0}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeselectAll}
                    disabled={!someSelected}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            </div>
            <div className={cn('grid gap-3', gridClass, className)}>
              {options.map(option => (
                <FormField
                  key={option.value}
                  control={control}
                  name={name}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={checked => {
                              return checked
                                ? field.onChange([...field.value, option.value])
                                : field.onChange(
                                    field.value?.filter((value: string) => value !== option.value),
                                  );
                            }}
                            disabled={option.disabled}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                          {option.description && (
                            <p className="text-muted-foreground text-sm">{option.description}</p>
                          )}
                        </div>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
