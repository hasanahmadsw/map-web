"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchableMultiSelectOption {
  id: number;
  name?: string;
  translations?: Array<{ name: string }>;
}

interface SearchableMultiSelectInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: SearchableMultiSelectOption[];
  className?: string;
  disabled?: boolean;
}

export function SearchableMultiSelectInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  options,
  className,
  disabled = false,
}: SearchableMultiSelectInputProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={`w-full justify-between min-h-[40px] h-auto ${className || ""}`}
                  disabled={disabled}
                >
                  <div className="flex flex-wrap gap-1 flex-1">
                    {field.value && field.value.length > 0 ? (
                      field.value.map((itemId: number) => {
                        const item = options.find((option) => option.id === itemId);
                        return (
                          <Badge key={itemId} variant="secondary" className="mr-1 mb-1">
                            {item?.translations?.[0]?.name || item?.name || `Item ${itemId}`}
                            {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
                            <span
                              role="button"
                              tabIndex={0}
                              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  const currentValue = field.value || [];
                                  field.onChange(currentValue.filter((value: number) => value !== itemId));
                                }
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={() => {
                                const currentValue = field.value || [];
                                field.onChange(currentValue.filter((value: number) => value !== itemId));
                              }}
                            >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </span>
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">{placeholder}</span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={searchPlaceholder} />
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.translations?.[0]?.name || option.name || `Item ${option.id}`}
                        onSelect={() => {
                          const currentValue = field.value || [];
                          const isSelected = (currentValue as number[]).includes(option.id);
                          if (isSelected) {
                            field.onChange((currentValue as number[]).filter((value: number) => value !== option.id));
                          } else {
                            field.onChange([...(currentValue as number[]), option.id]);
                          }
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${(field.value as number[])?.includes(option.id) ? "opacity-100" : "opacity-0"}`}
                        />
                        {option.translations?.[0]?.name || option.name || `Item ${option.id}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
