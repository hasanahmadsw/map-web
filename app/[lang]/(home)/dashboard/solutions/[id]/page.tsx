import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EditSolutionForm } from "@/components/solutions/edit-solution-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import EditSolutionLoading from "./loading";

interface EditSolutionPageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export default async function EditSolutionPage({ params }: EditSolutionPageProps) {
  const { id, lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.solutions || {};

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/solutions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.editSolution || "Edit Solution"}
          </h1>
          <p className="text-muted-foreground">
            {t.editSolutionDescription || "Update solution information and manage translations."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.solutionDetails || "Solution Details"}</CardTitle>
          <CardDescription>
            {t.solutionDetailsDescription || "Edit the solution information and manage its translations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditSolutionLoading />}>
            <EditSolutionForm solutionId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
