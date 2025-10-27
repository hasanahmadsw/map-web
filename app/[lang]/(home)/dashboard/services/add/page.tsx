import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AddServiceForm } from "@/components/services/add-service-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import AddServiceLoading from "./loading";

interface AddServicePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AddServicePage({ params }: AddServicePageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.services || {};

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/services">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.addService || "Add Service"}
          </h1>
          <p className="text-muted-foreground">
            {t.addNewServiceDescription || "Create a new service with sub-services and translations."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.serviceDetails || "Service Details"}</CardTitle>
          <CardDescription>
            {t.serviceDetailsDescription || "Fill in the service information and configure sub-services."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<AddServiceLoading />}>
            <AddServiceForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
