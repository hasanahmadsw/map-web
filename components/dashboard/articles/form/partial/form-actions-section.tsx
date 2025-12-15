"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/shared/buttons/loading-button"

interface FormActionsSectionProps {
  isCreating: boolean
}

export function FormActionsSection({ isCreating }: FormActionsSectionProps) {
  const router = useRouter()

  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/dashboard/articles")}
        disabled={isCreating}
      >
        Cancel
      </Button>
      <LoadingButton 
        isLoading={isCreating} 
        loadingText="Creating" 
        defaultText="Create Article" 
      />
    </div>
  )
}