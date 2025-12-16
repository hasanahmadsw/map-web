import { ServicesTable } from '@/components/dashboard/services/services-table';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services Management',
};

export default async function ServicesPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
        <p className="text-muted-foreground">Manage your services and their translations.</p>
      </header>

      <ServicesTable />
    </div>
  );
}
