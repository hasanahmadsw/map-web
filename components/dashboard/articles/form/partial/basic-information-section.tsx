"use client"

import { useFormContext } from "react-hook-form"
import { TextInput } from "@/components/shared/input/TextInput"
import { AiProvider } from "@/providers/ai-provider"
import ArticleEditor from "@/components/editor"
import { TextAreaInput } from "@/components/shared/input/TextAreaInput"

export function BasicInformationSection() {
  const { control,  watch, setValue } = useFormContext()

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput
        control={control}
        name="name"
        label="Article Title"
        placeholder="Enter article title"
      />
      <TextInput
        control={control}
        name="slug"
        label="Slug"
        placeholder="Enter article slug"
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">Content</label>
      <AiProvider>
        <ArticleEditor
          initialHTML={watch("content")}
          onChange={(html) => setValue("content", html)}
        />
      </AiProvider>
    </div>

    <TextAreaInput
      control={control}
      name="excerpt"
      label="Excerpt"
      placeholder="Enter article excerpt"
      className="min-h-[100px]"
    />
    
    </>
  )
}