'use client';

import { useMemo, useState, useCallback } from 'react';
import { useDebouncedValue } from '@/utils/useDebouncedValue';
import { useCategoriesForFilter } from '@/hooks/api/equipments/equipment-categories/use-equipment-categories-controller';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectOption {
  value: string | number;
  label: string;
  searchableText: string;
}

interface CategorySelectorProps {
  value?: string | number;
  onValueChange: (option: SearchableSelectOption | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  valueLabel?: string;
  type?: string;
}

export function CategorySelector({
  value,
  onValueChange,
  placeholder,
  className,
  disabled = false,
  valueLabel,
  type,
}: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { categories, isPending } = useCategoriesForFilter({
    limit: 20,
    isActive: true,
    search: debouncedSearchTerm,
    type,
  });

  const categoryOptions: SearchableSelectOption[] = useMemo(() => {
    return [
      ...(value && valueLabel
        ? [
            {
              value: value,
              label: valueLabel,
              searchableText: valueLabel,
            },
          ]
        : []),
      ...(categories ?? []).reduce((acc, category) => {
        const isSameCategory = `${category.id}` === `${value}`;

        if (isSameCategory) return acc;

        return [
          ...acc,
          {
            value: `${category.id}`,
            label: category.name,
            searchableText: category.name,
          },
        ];
      }, [] as SearchableSelectOption[]),
    ];
  }, [categories, value, valueLabel]);

  const handleSearchChange = useCallback((s: string) => setSearchTerm(s), []);

  const selectedOption = categoryOptions.find(opt => opt.value === value);

  const handleSelect = (optionValue: string | number) => {
    const option = categoryOptions.find(opt => opt.value === optionValue);
    if (option) {
      onValueChange(option);
    } else if (optionValue === value) {
      onValueChange(undefined);
    }
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isPending}
          className={cn('w-full justify-between', !value && 'text-muted-foreground', className)}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder || 'Select category'}
          </span>
          {isPending ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={placeholder || 'Search categories...'}
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>{isPending ? 'Loading...' : 'No categories found.'}</CommandEmpty>
            <CommandGroup>
              {categoryOptions.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.searchableText}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
