'use client';

import { useMemo, useState, useCallback } from 'react';
import { useDebouncedValue } from '@/utils/useDebouncedValue';
import { useBrandsForFilter } from '@/hooks/api/equipments/equipment-brands/use-equipment-brands-controller';
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

interface BrandSelectorProps {
  value?: string | number;
  onValueChange: (option: SearchableSelectOption | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  valueLabel?: string;
}

export function BrandSelector({
  value,
  onValueChange,
  placeholder,
  className,
  disabled = false,
  valueLabel,
}: BrandSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { brands, isPending } = useBrandsForFilter({
    limit: 20,
    isActive: true,
    search: debouncedSearchTerm,
  });

  const brandOptions: SearchableSelectOption[] = useMemo(() => {
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
      ...(brands ?? []).reduce((acc, brand) => {
        const isSameBrand = `${brand.id}` === `${value}`;

        if (isSameBrand) return acc;

        return [
          ...acc,
          {
            value: `${brand.id}`,
            label: brand.name,
            searchableText: brand.name,
          },
        ];
      }, [] as SearchableSelectOption[]),
    ];
  }, [brands, value, valueLabel]);

  const handleSearchChange = useCallback((s: string) => setSearchTerm(s), []);

  const selectedOption = brandOptions.find(opt => opt.value === value);

  const handleSelect = (optionValue: string | number) => {
    const option = brandOptions.find(opt => opt.value === optionValue);
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
            {selectedOption ? selectedOption.label : placeholder || 'Select brand'}
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
            placeholder={placeholder || 'Search brands...'}
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>{isPending ? 'Loading...' : 'No brands found.'}</CommandEmpty>
            <CommandGroup>
              {brandOptions.map(option => (
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
