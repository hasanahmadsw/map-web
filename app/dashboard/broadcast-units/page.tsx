import { BroadcastUnitsTable } from '@/components/dashboard/broadcast-units/broadcast-units-table';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Broadcast Units',
};

export default async function BroadcastUnitsPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Broadcast Units Management</h1>
        <p className="text-muted-foreground">Manage broadcast units and their configurations.</p>
      </header>

      <BroadcastUnitsTable />
    </div>
  );
}
