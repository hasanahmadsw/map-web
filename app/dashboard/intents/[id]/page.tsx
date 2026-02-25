import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import EditIntentForm from '@/components/dashboard/intents/form/edit-intent-form';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Intent',
};

interface EditIntentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIntentPage({ params }: EditIntentPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/intents">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Intent</h1>
          <p className="text-muted-foreground">Update the search page intent.</p>
        </div>
      </header>

      <EditIntentForm intentId={id} />
    </div>
  );
}
