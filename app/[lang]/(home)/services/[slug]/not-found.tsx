import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-4xl font-bold">Service Not Found</h1>
        <p className="text-muted-foreground">
          The service you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>
    </div>
  )
}

