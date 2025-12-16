"use client";

import { Search as SearchIcon } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export function Search({
  value,
  onChange,
  placeholder = "Search articles...",
  className,
  isLoading = false,
}: SearchProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const [isComposing, setIsComposing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Debounce
  React.useEffect(() => {
    if (isComposing) return; // don't send the value if the user is composing
    const timer = setTimeout(() => onChange(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue, onChange, isComposing]);

  // Sync external value to internal state
  React.useEffect(() => setInputValue(value), [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInputValue("");
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      // Send the value immediately
      onChange(inputValue);
    }
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className="pl-10 pr-4"
        disabled={isLoading}
        aria-label="Search articles"
      />
    </div>
  );
}
