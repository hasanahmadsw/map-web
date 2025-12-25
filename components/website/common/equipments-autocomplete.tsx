'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { IEquipment } from '@/types/equipments/equipment.type';
import { equipmentsService } from '@/services/equipments/equipments.service';
import type { EquipmentListParams } from '@/services/equipments/equipments.service';

import { Loader2, Search, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

interface EquipmentsAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  onEquipmentSelect?: (equipment: IEquipment) => void;
  className?: string;
  debounceMs?: number;
  maxSuggestions?: number;
  minCharacters?: number;
  disabled?: boolean;
  required?: boolean;
}

function EquipmentsAutocomplete({
  label,
  placeholder = 'Search equipment...',
  value,
  onValueChange,
  onEquipmentSelect,
  className,
  debounceMs = 300,
  maxSuggestions = 5,
  minCharacters = 2,
  disabled = false,
  required = false,
}: EquipmentsAutocompleteProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [equipments, setEquipments] = useState<IEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingAbortControllerRef = useRef<AbortController | null>(null);
  const generatedId = useId();
  const inputId = generatedId;
  const suggestionsId = `${inputId}-suggestions`;

  // Helper function to format enum values
  function formatEnumValue(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
  }

  // Sync internal value with external value prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (loadingAbortControllerRef.current) {
        loadingAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch equipment search results from API for autocomplete
  const fetchEquipments = useCallback(
    async (query: string, abortSignal: AbortSignal): Promise<IEquipment[]> => {
      if (!query.trim()) return [];

      try {
        const params: EquipmentListParams = {
          search: query.trim(),
          limit: maxSuggestions,
          page: 1,
        };

        const response = await equipmentsService.getAll(params, { signal: abortSignal });
        return response.data || [];
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return [];
        }
        console.error('Error fetching equipment results:', error);
        return [];
      }
    },
    [maxSuggestions],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      // onValueChange(newValue);
      setSelectedIndex(-1);

      if (loadingAbortControllerRef.current) {
        loadingAbortControllerRef.current.abort();
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const trimmedValue = newValue.trim();

      if (!trimmedValue) {
        setIsOpen(false);
        setEquipments([]);
        setIsLoading(false);
        return;
      }

      if (trimmedValue.length < minCharacters) {
        setIsOpen(false);
        setEquipments([]);
        return;
      }

      setIsLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        const abortController = new AbortController();
        loadingAbortControllerRef.current = abortController;

        fetchEquipments(trimmedValue, abortController.signal)
          .then(results => {
            if (!abortController.signal.aborted) {
              setEquipments(results);
              if (results.length > 0) {
                setIsOpen(true);
              }
              setIsLoading(false);
            }
          })
          .catch(error => {
            if (!abortController.signal.aborted) {
              console.error('Error fetching equipments:', error);
              setEquipments([]);
              setIsLoading(false);
            }
          });
      }, debounceMs);
    },
    [minCharacters, fetchEquipments, debounceMs],
  );

  const handleEquipmentClick = useCallback(
    (equipment: IEquipment) => {
      setInternalValue(equipment.name);
      onValueChange(equipment.name);
      setIsOpen(false);
      setEquipments([]);
      setSelectedIndex(-1);
      inputRef.current?.blur();

      if (onEquipmentSelect) {
        onEquipmentSelect(equipment);
      }
    },
    [onValueChange, onEquipmentSelect],
  );

  const handleClear = useCallback(() => {
    setInternalValue('');
    onValueChange('');
    setIsOpen(false);
    setEquipments([]);
    setSelectedIndex(-1);
  }, [onValueChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || equipments.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < equipments.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : equipments.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < equipments.length) {
            handleEquipmentClick(equipments[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, equipments, selectedIndex, handleEquipmentClick],
  );

  const handleFocus = useCallback(() => {
    const trimmedValue = internalValue.trim();
    if (trimmedValue.length >= minCharacters && equipments.length > 0) {
      setIsOpen(true);
    }
  }, [internalValue, minCharacters, equipments.length]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 200);
  }, []);

  const inputClassName = cn(
    'h-10 rounded-md pl-10 pr-10 glass-input',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );

  const labelClassName = cn('text-sm font-medium', disabled && 'opacity-50');

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}
      <div className="relative">
        <Search
          className="text-primary pointer-events-none absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClassName}
          disabled={disabled}
          required={required}
          autoFocus={false}
          aria-autocomplete="list"
          aria-controls={suggestionsId}
          aria-expanded={isOpen}
          autoComplete="off"
          role="combobox"
        />
        {internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="text-primary hover:text-foreground absolute end-3 top-1/2 z-10 -translate-y-1/2 rounded p-0.5 transition-colors disabled:pointer-events-none"
            aria-label={isLoading ? 'Loading' : 'Clear search'}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </button>
        )}
        {isOpen && (
          <div
            id={suggestionsId}
            className="bg-popover absolute top-full mt-1 w-full rounded-2xl border p-0 shadow-lg backdrop-blur-2xl"
            style={{
              backgroundColor: 'color-mix(in oklch, var(--popover) 95%, transparent)',
            }}
            role="listbox"
            aria-label="Equipment suggestions"
          >
            <div className="scrollbar-hide max-h-96 overflow-y-auto">
              {isLoading ? (
                <div
                  className="text-muted-foreground p-4 text-center text-sm"
                  role="status"
                  aria-live="polite"
                >
                  Loading...
                </div>
              ) : equipments.length > 0 ? (
                <div className="py-2">
                  {equipments.map((equipment, index) => (
                    <button
                      key={`${equipment.id}-${index}`}
                      type="button"
                      onClick={() => handleEquipmentClick(equipment)}
                      className={cn(
                        'text-foreground w-full px-3 py-2 text-left transition-colors',
                        'hover:bg-accent focus:bg-accent focus:outline-none',
                        selectedIndex === index && 'bg-accent',
                      )}
                      role="option"
                      aria-selected={selectedIndex === index}
                    >
                      <div className="flex gap-3">
                        {/* Equipment Image */}
                        <div className="bg-muted/50 relative h-16 w-20 shrink-0 overflow-hidden rounded-md">
                          {equipment.coverPath ? (
                            <Image
                              src={equipment.coverPath}
                              alt={equipment.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                              <Search className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        {/* Equipment Details */}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{equipment.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {equipment.brand?.name && `${equipment.brand.name} • `}
                            {equipment.category?.name && `${equipment.category.name} • `}
                            {formatEnumValue(equipment.equipmentType)}
                          </div>
                          {equipment.summary && (
                            <div className="text-muted-foreground mt-1 truncate text-xs">
                              {equipment.summary}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : internalValue.trim() && internalValue.trim().length >= minCharacters ? (
                <div
                  className="text-muted-foreground p-4 text-center text-sm"
                  role="status"
                  aria-live="polite"
                >
                  No equipment found
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EquipmentsAutocomplete;
