import { FacilityUnitsTable } from '@/components/dashboard/facility-units/facility-units-table';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facility Units',
};

export default async function FacilityUnitsPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Facility Units Management</h1>
        <p className="text-muted-foreground">Manage facility units and their configurations.</p>
      </header>

      <FacilityUnitsTable />
    </div>
  );
}

