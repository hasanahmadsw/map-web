import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditStaffLoading() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
          <CardDescription>Edit the staff information and manage its translations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Form Skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="border-t pt-6">
            {/* Translations Section Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-9 w-36" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-8" />
                                <Skeleton className="h-5 w-24" />
                              </div>
                              <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-8 w-16" />
                              <Skeleton className="h-8 w-8" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
