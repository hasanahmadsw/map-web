"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SimpleTextAreaInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

export function SimpleTextAreaInput({
  label,
  value,
  onChange,
  placeholder,
  className,
  rows = 4,
  disabled = false,
}: SimpleTextAreaInputProps) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        rows={rows}
        disabled={disabled}
      />
    </div>
  );
}
