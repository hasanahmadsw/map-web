"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Path, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";

interface ArrayInputProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  placeholder: string;
}

const ArrayInput = <T extends Record<string, any>>({ name, label, placeholder }: ArrayInputProps<T>) => {
  const form = useFormContext<T>();
  const [input, setInput] = useState("");

  const fieldPath = name as Path<T>;

  const getNestedError = (
    errors: Record<string, unknown>,
    path: string,
  ): { message?: string } | undefined => {
    return path.split(".").reduce((obj: Record<string, unknown> | undefined, key) => {
      return obj?.[key] as Record<string, unknown> | undefined;
    }, errors) as { message?: string } | undefined;
  };

  const errorMessage = getNestedError(form.formState.errors, fieldPath)?.message;

  const values: string[] = form.watch(fieldPath) || [];

  const addItem = (item: string) => {
    if (item.trim() && !values.includes(item.trim())) {
      form.setValue(fieldPath, [...values, item.trim()] as any, {
        shouldDirty: true,
      });
      setInput("");
    }
  };

  const removeItem = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    form.setValue(fieldPath, newValues as any, {
      shouldDirty: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addItem(input.trim());
    }
  };

  return (
    <div className="mb-4">
      <FormLabel className="text-foreground mb-1 block text-base font-medium">{label}</FormLabel>

      {errorMessage && <p className="text-destructive mb-2 text-sm">{errorMessage as string}</p>}

      <div className="mb-2 flex items-center gap-2">
        <input
          className="border-border focus:ring-primary focus:border-primary bg-background text-foreground flex-1 rounded border px-3 py-2 text-sm transition outline-none focus:ring-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={() => addItem(input.trim())}
          aria-label={`Add ${label}`}
        >
          <span className="sr-only">Add {label}</span>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((val, i) => (
            <span
              key={`${val}-${i}`}
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 mr-2 mb-2 inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors"
            >
              {val}
              <button
                type="button"
                className="text-destructive hover:text-destructive/80 ms-2 focus:outline-none"
                onClick={() => removeItem(i)}
                aria-label={`Remove ${val}`}
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArrayInput;
