import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AddSolutionForm } from "@/components/solutions/add-solution-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import AddSolutionLoading from "./loading";

interface AddSolutionPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AddSolutionPage({ params }: AddSolutionPageProps) {
  const { lang } = await params;
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
            {t.addSolution || "Add Solution"}
          </h1>
          <p className="text-muted-foreground">
            {t.addNewSolutionDescription || "Create a new solution with translations."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.solutionDetails || "Solution Details"}</CardTitle>
          <CardDescription>
            {t.solutionDetailsDescription || "Fill in the solution information."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<AddSolutionLoading />}>
            <AddSolutionForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
