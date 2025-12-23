import { type Metadata } from 'next';
import StaffTable from '@/components/dashboard/staff/staff-table';

export const metadata: Metadata = {
  title: 'Staff Management',
};

export default async function StaffPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">Manage your staff members</p>
      </header>

      <StaffTable />
    </div>
  );
}
