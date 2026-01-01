import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { EditBroadcastUnitForm } from '@/components/dashboard/broadcast-units/form/edit-broadcast-unit-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EditFacilityUnitLoading from './loading';

interface EditBroadcastUnitPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBroadcastUnitPage({ params }: EditBroadcastUnitPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/broadcast-units">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Broadcast Unit</h1>
          <p className="text-muted-foreground">Update broadcast unit information and manage items.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Broadcast Unit Details</CardTitle>
          <CardDescription>Edit the broadcast unit information and manage its items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditFacilityUnitLoading />}>
            <EditBroadcastUnitForm broadcastUnitId={id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
