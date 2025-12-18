import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import AddEquipmentForm from '@/components/dashboard/equipments/form/add-equipment-form';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Equipment',
};

export default async function AddEquipmentPage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/equipments">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Equipment</h1>
          <p className="text-muted-foreground">Create a new equipment with name, description, and image.</p>
        </div>
      </header>

      <AddEquipmentForm />
    </div>
  );
}
