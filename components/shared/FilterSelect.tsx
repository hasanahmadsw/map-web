'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { useTheme } from 'next-themes';
import Image from 'next/image';

import { useEffect, useId, useState } from 'react';

interface FilterSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string; logo?: string; logoDark?: string; disabled?: boolean }>;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  isLoading?: boolean;
}

export function FilterSelect({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  className,
  disabled = false,
  required = false,
  name,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  isLoading = false,
}: FilterSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  const selectClassName = cn(
    'min-h-10 rounded-xl cursor-pointer border border-border',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );

  const labelClassName = cn('text-sm font-medium', disabled && 'opacity-50');

  const selectedOption = options.find(opt => opt.value === value);

  // Helper function to get the correct logo based on theme
  const getLogoSrc = (option: { logo?: string; logoDark?: string }) => {
    if (!option.logo) return undefined;
    return mounted && resolvedTheme === 'dark' && option.logoDark ? option.logoDark : option.logo;
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={selectId} className={labelClassName}>
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading} name={name}>
        <SelectTrigger
          id={selectId}
          className={selectClassName}
          aria-label={ariaLabel || label}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption && getLogoSrc(selectedOption) ? (
              <div className="flex items-center gap-2">
                <div className="relative h-5 w-5 shrink-0">
                  <Image
                    src={getLogoSrc(selectedOption)!}
                    alt={selectedOption.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="truncate">{selectedOption.label}</span>
              </div>
            ) : selectedOption ? (
              selectedOption.label
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {options.map(option => {
            const logoSrc = getLogoSrc(option);
            return (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {logoSrc ? (
                  <div className="flex items-center gap-2">
                    <div className="relative h-5 w-5 shrink-0">
                      <Image src={logoSrc} alt={option.label} fill className="object-contain" />
                    </div>
                    <span>{option.label}</span>
                  </div>
                ) : (
                  option.label
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
