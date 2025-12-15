"use client"

import { useFormContext } from "react-hook-form"
import { TextAreaInput } from "@/components/shared/input/TextAreaInput"

export function TagsTopicsSection() {
  const { control } = useFormContext()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextAreaInput
        control={control}
        name="tags"
        label="Tags"
        placeholder="Enter tags separated by commas (e.g., technology, AI, innovation)"
        className="min-h-[80px]"
        rows={3}
      />
      <TextAreaInput
        control={control}
        name="topics"
        label="Topics"
        placeholder="Enter topics separated by commas (e.g., politics, business, health)"
        className="min-h-[80px]"
        rows={3}
      />
    </div>
  )
}