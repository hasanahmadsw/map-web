import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { AddFacilityForm } from '@/components/dashboard/facilities/form/add-facility-form';
import { Button } from '@/components/ui/button';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Facility',
};

export default async function AddFacilityPage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/facilities">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Facility</h1>
          <p className="text-muted-foreground">Create a new facility with details and configuration.</p>
        </div>
      </header>

      <AddFacilityForm />
    </div>
  );
}

