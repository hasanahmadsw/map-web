import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EditServiceForm } from '@/components/dashboard/services/form/edit-service-form';
import { Button } from '@/components/ui/button';

import { type Metadata } from 'next';

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Edit Service',
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Link href="/dashboard/services">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground">Update service information and manage translations.</p>
        </div>
      </header>

      <EditServiceForm serviceId={id} />
    </div>
  );
}
