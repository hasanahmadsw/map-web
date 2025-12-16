import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { AddSolutionForm } from '@/components/dashboard/solutions/form/add-solution-form';
import { Button } from '@/components/ui/button';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Article',
};

export default async function AddSolutionPage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/solutions">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Solution</h1>
          <p className="text-muted-foreground">Create a new solution with translations.</p>
        </div>
      </header>

      <AddSolutionForm />
    </div>
  );
}
