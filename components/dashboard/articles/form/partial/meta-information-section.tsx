"use client"

import { useFormContext } from "react-hook-form"
import { TextInput } from "@/components/shared/input/TextInput"
import { TextAreaInput } from "@/components/shared/input/TextAreaInput"
import { SelectInput } from "@/components/shared/input/SelectInput"
import { useLanguages } from "@/hooks/useLanguages"

export function MetaInformationSection() {
  const { control } = useFormContext()
  const { languages } = useLanguages()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          control={control}
          name="meta.title"
          label="Meta Title"
          placeholder="Enter meta title"
        />
        <SelectInput
          control={control}
          name="languageCode"
          label="Default Language"
          placeholder="Select Language"
          options={
            languages?.map((lang) => ({
              value: lang.code,
              label: `${lang.name} (${lang.code})`,
            })) || []
          }
        />
      </div>

      <TextAreaInput
        control={control}
        name="meta.description"
        label="Meta Description"
        placeholder="Enter meta description"
        className="min-h-[100px]"
      />
    </>
  )
}