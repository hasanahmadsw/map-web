'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';

interface searchProps {
  query?: string;
  placeholder: string;
  onSearchChange?: (key: string, value: string) => void;
  Icon?: React.ReactNode;
  className?: string;
}

function CustomSearch({ query = 'search', placeholder, onSearchChange, Icon, className }: searchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current search value from URL
  const currentSearch = searchParams.get(query) || '';
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Update local state when URL changes
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Debounced search function using use-debounce
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term.trim()) {
      params.set(query, term);
    } else {
      params.delete(query);
    }

    // Reset pagination on every change
    if (params.has('page')) params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  // Debounced callback for onSearchChange
  const debouncedOnSearchChange = useDebouncedCallback((key: string, val: string) => {
    if (typeof onSearchChange === 'function') {
      onSearchChange(key, val);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (typeof onSearchChange === 'function') {
      debouncedOnSearchChange(query, value);
    } else {
      handleSearch(value);
    }
  };

  return (
    <div className="relative">
      {Icon ? (
        Icon
      ) : (
        <Search className="text-primary absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
      )}
      <Input
        type="search"
        aria-label={`Search ${placeholder.toLowerCase()}`}
        placeholder={placeholder}
        className={`focus:ring-primary/50 h-12 w-full rounded-xl bg-white/95 py-2 ps-12 pe-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:outline-none ${className}`}
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default CustomSearch;
