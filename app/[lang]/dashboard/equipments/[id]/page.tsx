import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EditEquipmentForm from '@/components/dashboard/equipments/form/edit-equipment-from';

import { type Metadata } from 'next';

interface EditEquipmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Edit Equipment',
};

export default async function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/equipments">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Equipment</h1>
          <p className="text-muted-foreground">Update equipment information and manage translations.</p>
        </div>
      </header>

      <EditEquipmentForm equipmentId={id} />
    </div>
  );
}
