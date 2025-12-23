import { SolutionsTable } from '@/components/dashboard/solutions/solutions-table';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions',
};

export default async function SolutionsPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Solutions Management</h1>
        <p className="text-muted-foreground">Manage your solutions and their translations.</p>
      </header>

      <SolutionsTable />
    </div>
  );
}
