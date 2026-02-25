import { type Metadata } from 'next';
import IntentsTable from '@/components/dashboard/intents/intents-table';

export const metadata: Metadata = {
  title: 'Intents Management',
};

export default async function IntentsPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Intents Management</h1>
        <p className="text-muted-foreground">Manage search page intents for equipment rental</p>
      </header>

      <IntentsTable />
    </div>
  );
}
