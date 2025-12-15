"use client"

import { useFormContext } from "react-hook-form"
import { CheckboxInput } from "@/components/shared/input/CheckboxInput"

export function StatusOptionsSection() {
  const { control } = useFormContext()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CheckboxInput
        control={control}
        name="isPublished"
        label="Published"
        description="Publish this article immediately"
        className="rounded-lg border p-4 items-center"
      />
      <CheckboxInput
        control={control}
        name="isFeatured"
        label="Featured"
        description="Feature this article on the homepage"
        className="rounded-lg border p-4 items-center"
      />
    </div>
  )
}