'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Filter } from 'lucide-react';

export interface SelectFilterOption {
  value: string;
  label: string;
}

interface SelectFilterProps<T = string> {
  value?: T;
  onValueChange: (value: T | undefined) => void;
  options: SelectFilterOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showFilterIcon?: boolean;
  allOptionLabel?: string;
}

export function SelectFilter<T = string>({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  className,
  disabled = false,
  showFilterIcon = false,
  allOptionLabel,
}: SelectFilterProps<T>) {
  const handleValueChange = (val: string) => {
    if (val === 'all') {
      onValueChange(undefined);
    } else {
      onValueChange(val as T);
    }
  };

  const displayValue = value === undefined ? 'all' : String(value);

  return (
    <Select value={displayValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={`h-9 ${className}`}>
        {showFilterIcon && <Filter className="mr-2 h-4 w-4" />}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allOptionLabel || 'All'}</SelectItem>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
