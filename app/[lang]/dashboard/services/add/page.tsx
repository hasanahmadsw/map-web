import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import AddServiceForm from '@/components/dashboard/services/form/add-service-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Service',
};

export default async function AddServicePage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Link href="/dashboard/services">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Service</h1>
          <p className="text-muted-foreground">Create a new service with sub-services and translations.</p>
        </div>
      </header>

      <AddServiceForm />
    </div>
  );
}
