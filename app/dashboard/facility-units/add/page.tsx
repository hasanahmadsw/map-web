import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { AddFacilityUnitForm } from '@/components/dashboard/facility-units/form/add-facility-unit-form';
import { Button } from '@/components/ui/button';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Facility Unit',
};

export default async function AddFacilityUnitPage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/facility-units">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Facility Unit</h1>
          <p className="text-muted-foreground">Create a new facility unit with details and items.</p>
        </div>
      </header>

      <AddFacilityUnitForm />
    </div>
  );
}

