import { FileQuestion, Home, Newspaper } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <FileQuestion className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you are looking for does not exist or may have been moved.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/news">
                  <Newspaper className="w-4 h-4 mr-2" />
                  Browse All News
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
