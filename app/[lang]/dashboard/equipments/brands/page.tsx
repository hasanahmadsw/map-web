import { type Metadata } from 'next';
import EquipmentBrandsTable from '@/components/dashboard/equipments/equipment-brands/equipment-brands-table';

export const metadata: Metadata = {
  title: 'Equipment Brands Management',
};

export default async function EquipmentBrandsPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Equipment Brands Management</h1>
        <p className="text-muted-foreground">Manage your equipment brands</p>
      </header>

      <EquipmentBrandsTable />
    </div>
  );
}
