import { type Metadata } from 'next';
import EquipmentCategoriesTable from '@/components/dashboard/equipments/equipment-categories/equipment-categories-table';

export const metadata: Metadata = {
  title: 'Equipment Categories Management',
};

export default async function EquipmentCategoriesPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Equipment Categories Management</h1>
        <p className="text-muted-foreground">Manage your equipment categories</p>
      </header>

      <EquipmentCategoriesTable />
    </div>
  );
}
