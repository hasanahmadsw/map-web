import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TagNotFound() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/tags">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tag Not Found</h1>
          <p className="text-muted-foreground">The requested tag could not be found.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tag Not Found
          </CardTitle>
          <CardDescription>The tag you are looking for does not exist or has been deleted.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="text-center">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Tag Not Found</h3>
              <p className="text-muted-foreground">
                The tag you are trying to edit does not exist or may have been removed.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/tags">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tags
                </Button>
              </Link>
              <Link href="/dashboard/tags">
                <Button variant="outline">View All Tags</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
