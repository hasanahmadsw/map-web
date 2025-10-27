"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SimpleTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
}

export function SimpleTextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  disabled = false,
}: SimpleTextInputProps) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className={className}
        disabled={disabled}
      />
    </div>
  );
}
