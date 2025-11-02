import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SolutionsTable } from "@/components/solutions/solutions-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import SolutionsTableSkeleton from "./loading";

interface SolutionsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function SolutionsPage({ params }: SolutionsPageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.solutions || {};
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.solutionsManagement || "Solutions Management"}
          </h1>
          <p className="text-muted-foreground">
            {t.solutionsManagementDescription || "Manage your solutions and their translations."}
          </p>
        </div>
        <Link href="/dashboard/solutions/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t.addSolution || "Add Solution"}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.contentSolutions || "Content Solutions"}</CardTitle>
          <CardDescription>
            {t.contentSolutionsDescription || "Manage and organize your solution offerings."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SolutionsTableSkeleton />}>
            <SolutionsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
