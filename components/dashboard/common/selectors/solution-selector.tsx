'use client';

import { useMemo, useState, useCallback } from 'react';
import { useDebouncedValue } from '@/utils/useDebouncedValue';
import { useSolutionsForFilter } from '@/hooks/api/solutions/useSolutionsPublic';
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

interface SolutionSelectorProps {
  value?: string | number;
  onValueChange: (option: SearchableSelectOption | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  valueLabel?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export function SolutionSelector({
  value,
  onValueChange,
  placeholder,
  className,
  disabled = false,
  valueLabel,
  isPublished,
  isFeatured,
}: SolutionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { solutions, isPending } = useSolutionsForFilter({
    limit: 20,
    isPublished,
    isFeatured,
    search: debouncedSearchTerm,
  });

  const solutionOptions: SearchableSelectOption[] = useMemo(() => {
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
      ...(solutions ?? []).reduce((acc, solution) => {
        const isSameSolution = `${solution.id}` === `${value}`;

        if (isSameSolution) return acc;

        return [
          ...acc,
          {
            value: `${solution.id}`,
            label: solution.name,
            searchableText: solution.name,
          },
        ];
      }, [] as SearchableSelectOption[]),
    ];
  }, [solutions, value, valueLabel]);

  const handleSearchChange = useCallback((s: string) => setSearchTerm(s), []);

  const selectedOption = solutionOptions.find(opt => opt.value === value);

  const handleSelect = (optionValue: string | number) => {
    const option = solutionOptions.find(opt => opt.value === optionValue);
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
            {selectedOption ? selectedOption.label : placeholder || 'Select solution'}
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
            placeholder={placeholder || 'Search solutions...'}
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>{isPending ? 'Loading...' : 'No solutions found.'}</CommandEmpty>
            <CommandGroup>
              {solutionOptions.map(option => (
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
