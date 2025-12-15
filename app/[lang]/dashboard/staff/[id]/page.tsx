import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EditStaffForm } from "@/components/staff/edit-staff-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import EditStaffLoading from "./loading";

interface EditStaffPageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id, lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.staffs;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
      
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.editStaff}</h1>
          <p className="text-muted-foreground">{t.editStaffDescription}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.staffDetails}</CardTitle>
          <CardDescription>{t.staffDetailsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditStaffLoading />}>
            <EditStaffForm staffId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
