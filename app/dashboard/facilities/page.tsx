import { FacilitiesTable } from '@/components/dashboard/facilities/facilities-table';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facilities',
};

export default async function FacilitiesPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Facilities Management</h1>
        <p className="text-muted-foreground">Manage your facilities and their configurations.</p>
      </header>

      <FacilitiesTable />
    </div>
  );
}
