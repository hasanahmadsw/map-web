import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EditServiceForm } from "@/components/services/edit-service-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import EditServiceLoading from "./loading";

interface EditServicePageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id, lang } = await params;
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
            {t.editService || "Edit Service"}
          </h1>
          <p className="text-muted-foreground">
            {t.editServiceDescription || "Update service information and manage translations."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.serviceDetails || "Service Details"}</CardTitle>
          <CardDescription>
            {t.serviceDetailsDescription || "Edit the service information and manage its translations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditServiceLoading />}>
            <EditServiceForm serviceId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
