import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { EditFacilityForm } from '@/components/dashboard/facilities/form/edit-facility-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EditFacilityLoading from './loading';

interface EditFacilityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFacilityPage({ params }: EditFacilityPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/facilities">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Facility</h1>
          <p className="text-muted-foreground">Update facility information and configuration.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facility Details</CardTitle>
          <CardDescription>Edit the facility information and manage its configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditFacilityLoading />}>
            <EditFacilityForm facilityId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

