import { Suspense } from "react";
import { AddStaffMember } from "@/components/staff/add-staff";
import { StaffTable } from "@/components/staff/staff-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import StaffTableSkeleton from "./loading";

interface StaffPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function StaffPage({ params }: StaffPageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang as Lang);
  const t = translations.staffs;
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.staffManagement}</h1>
          <p className="text-muted-foreground">{t.staffManagementDescription}</p>
        </div>
        <AddStaffMember />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.staffMembers}</CardTitle>
          <CardDescription>{t.staffMembersDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<StaffTableSkeleton />}>
            <StaffTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
