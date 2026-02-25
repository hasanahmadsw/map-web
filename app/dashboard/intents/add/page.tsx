import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import AddIntentForm from '@/components/dashboard/intents/form/add-intent-form';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Intent',
};

export default async function AddIntentPage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/intents">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Intent</h1>
          <p className="text-muted-foreground">Create a new search page intent for equipment rental.</p>
        </div>
      </header>

      <AddIntentForm />
    </div>
  );
}
