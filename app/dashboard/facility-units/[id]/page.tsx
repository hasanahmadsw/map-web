import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { EditFacilityUnitForm } from '@/components/dashboard/facility-units/form/edit-facility-unit-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EditFacilityUnitLoading from './loading';

interface EditFacilityUnitPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFacilityUnitPage({ params }: EditFacilityUnitPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/facility-units">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Facility Unit</h1>
          <p className="text-muted-foreground">Update facility unit information and manage items.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facility Unit Details</CardTitle>
          <CardDescription>Edit the facility unit information and manage its items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditFacilityUnitLoading />}>
            <EditFacilityUnitForm facilityUnitId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

