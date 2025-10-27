import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ServicesTable } from "@/components/services/services-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import ServicesTableSkeleton from "./loading";

interface ServicesPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.services || {};
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.servicesManagement || "Services Management"}
          </h1>
          <p className="text-muted-foreground">
            {t.servicesManagementDescription || "Manage your services and their translations."}
          </p>
        </div>
        <Link href="/dashboard/services/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t.addService || "Add Service"}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.contentServices || "Content Services"}</CardTitle>
          <CardDescription>
            {t.contentServicesDescription || "Manage and organize your service offerings."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ServicesTableSkeleton />}>
            <ServicesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
