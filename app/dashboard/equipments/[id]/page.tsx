import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EditEquipmentForm from '@/components/dashboard/equipments/form/edit-equipment-from';

import { type Metadata } from 'next';
import EquipmentView from '@/components/dashboard/equipments/view/equipment-view';

interface EditEquipmentPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    view?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Edit Equipment',
};

export default async function EditEquipmentPage({ params, searchParams }: EditEquipmentPageProps) {
  const { id } = await params;
  const { view } = await searchParams;

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/equipments">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        {view === '1' ? (
          <div>
            <h1 className="text-3xl font-bold tracking-tight">View Equipment</h1>
            <p className="text-muted-foreground">View equipment information.</p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Equipment</h1>
            <p className="text-muted-foreground">Update equipment information.</p>
          </div>
        )}
      </header>

      {view === '1' ? <EquipmentView equipmentId={id} /> : <EditEquipmentForm equipmentId={id} />}
    </div>
  );
}
