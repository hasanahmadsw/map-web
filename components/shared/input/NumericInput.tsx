'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

const inputClassName = cn(
  'min-h-8 rounded-md ps-12 transition-all duration-200 mb-0 focus-visible:ring-1 focus-visible:ring-primary/40',
);
const labelClassName = cn('text-sm font-medium text-foreground ');

interface NumericInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string | React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  icon?: React.ReactNode;
  allowNegative?: boolean;
  allowFloat?: boolean;
  isPhoneNumber?: boolean;
}

export function NumericInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  className,
  icon,
  allowNegative = false,
  allowFloat = false,
  isPhoneNumber = false,
}: NumericInputProps<T>) {
  // Handler to allow digits with optional negative and decimal support
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Remove any characters that don't match the allowed pattern
    const cleanValue = value.replace(/[^0-9.-]/g, '');

    let finalValue = cleanValue;

    if (allowNegative && allowFloat) {
      // Allow: -123, -123.45, 123.45, 123, -, -., -0.5, 0.5
      // Prevent multiple decimal points and leading zeros
      finalValue = cleanValue.replace(/^(-?)(\d*\.?\d*)$/, '$1$2');

      // Prevent multiple minus signs
      const minusCount = (finalValue.match(/-/g) || []).length;
      if (minusCount > 1) {
        finalValue = finalValue.replace(/-/g, '').replace(/^(-?)(\d*\.?\d*)$/, '$1$2');
      }

      // Prevent multiple decimal points
      const decimalCount = (finalValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        const firstDecimalIndex = finalValue.indexOf('.');
        finalValue =
          finalValue.substring(0, firstDecimalIndex + 1) +
          finalValue.substring(firstDecimalIndex + 1).replace(/\./g, '');
      }

      // Prevent leading with dot (convert .123 to 0.123)
      if (finalValue.match(/^-?\./)) {
        finalValue = finalValue.replace(/^(-?)\./, '$10.');
      }

      // Prevent leading zeros (except for 0.xxx or -0.xxx, or if isPhoneNumber)
      if (!isPhoneNumber && !finalValue.match(/^-?0\./) && finalValue.match(/^-?0\d/)) {
        finalValue = finalValue.replace(/^(-?)0+(\d)/, '$1$2');
      }
    } else if (allowNegative) {
      // Allow: -123, 123, -
      // Remove decimal points since allowFloat is false
      finalValue = cleanValue.replace(/\./g, '').replace(/^(-?)(\d*)$/, '$1$2');

      // Prevent multiple minus signs
      const minusCount = (finalValue.match(/-/g) || []).length;
      if (minusCount > 1) {
        finalValue = finalValue.replace(/-/g, '').replace(/^(-?)(\d*)$/, '$1$2');
      }

      // Prevent leading zeros (unless isPhoneNumber)
      if (!isPhoneNumber && finalValue.match(/^-?0\d/)) {
        finalValue = finalValue.replace(/^(-?)0+(\d)/, '$1$2');
      }
    } else if (allowFloat) {
      // Allow: 123.45, 123, 0.5, .
      // Remove minus signs since allowNegative is false
      finalValue = cleanValue.replace(/-/g, '').replace(/^(\d*\.?\d*)$/, '$1');

      // Prevent multiple decimal points
      const decimalCount = (finalValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        const firstDecimalIndex = finalValue.indexOf('.');
        finalValue =
          finalValue.substring(0, firstDecimalIndex + 1) +
          finalValue.substring(firstDecimalIndex + 1).replace(/\./g, '');
      }

      // Prevent leading with dot (convert .123 to 0.123)
      if (finalValue.match(/^\./)) {
        finalValue = finalValue.replace(/^\./, '0.');
      }

      // Prevent leading zeros (except for 0.xxx, or if isPhoneNumber)
      if (!isPhoneNumber && !finalValue.match(/^0\./) && finalValue.match(/^0\d/)) {
        finalValue = finalValue.replace(/^0+(\d)/, '$1');
      }
    } else {
      // Only digits - prevent leading zeros (unless isPhoneNumber)
      finalValue = cleanValue.replace(/[^0-9]/g, '');
      if (!isPhoneNumber && finalValue.match(/^0\d/)) {
        finalValue = finalValue.replace(/^0+(\d)/, '$1');
      }
    }

    e.target.value = finalValue;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <div className="relative">
            {icon && <div className="absolute start-3 top-1/2 -translate-y-1/2">{icon}</div>}
            <FormControl>
              <Input
                className={cn(inputClassName, className)}
                placeholder={placeholder}
                type="text"
                autoComplete={autoComplete}
                inputMode={allowFloat ? 'decimal' : 'numeric'}
                pattern={
                  allowNegative && allowFloat
                    ? '-?\\d*\\.?\\d*'
                    : allowNegative
                      ? '-?\\d*'
                      : allowFloat
                        ? '\\d*\\.?\\d*'
                        : '[0-9]*'
                }
                {...field}
                value={field.value ?? ''}
                onInput={e => {
                  handleInput(e as React.ChangeEvent<HTMLInputElement>);
                  field.onChange(e);
                }}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
