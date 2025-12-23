import { EquipmentsTable } from '@/components/dashboard/equipments/equipments-table';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Equipments Management',
};

export default async function EquipmentsPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Equipments Management</h1>
        <p className="text-muted-foreground">Manage your equipments and their specifications.</p>
      </header>

      <EquipmentsTable />
    </div>
  );
}
