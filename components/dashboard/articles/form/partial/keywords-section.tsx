"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function KeywordsSection() {
  const { watch, setValue } = useFormContext()
  const [newKeyword, setNewKeyword] = useState("")
  const keywords = watch("meta.keywords") || []

  const addKeyword = () => {
    const keyword = newKeyword.trim()
    if (keyword && !keywords.includes(keyword)) {
      setValue("meta.keywords", [...keywords, keyword])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setValue("meta.keywords", keywords.filter((k: string) => k !== keyword))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="keywords">Keywords</Label>
      <div className="flex gap-2">
        <Input
          id="keywords"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Add keyword"
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
          className="flex-1"
        />
        <Button type="button" onClick={addKeyword} variant="outline">
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {keywords.map((keyword: string) => (
          <Badge key={keyword} variant="secondary" className="flex items-center gap-1 text-xs">
            {keyword}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive/20"
              onClick={() => removeKeyword(keyword)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}