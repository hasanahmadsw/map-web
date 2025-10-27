"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

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
  gridCols?: "1" | "2" | "3" | "4";
}

export function CheckboxGroupInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  className,
  gridCols = "1",
}: CheckboxGroupInputProps<T>) {
  const gridClass = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[gridCols];

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="space-y-2">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className={cn("grid gap-3", gridClass, className)}>
            {options.map((option) => (
              <FormField
                key={option.value}
                control={control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.value}
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option.value])
                              : field.onChange(field.value?.filter((value: string) => value !== option.value));
                          }}
                          disabled={option.disabled}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                        {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
