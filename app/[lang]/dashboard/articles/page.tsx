import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ArticlesTable } from '@/components/dashboard/articles/articles-table';
import { Button } from '@/components/ui/button';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles',
};

export default async function ArticlesPage() {
  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Articles Management</h1>
        <p className="text-muted-foreground">Manage your articles and their translations.</p>
      </header>

      <ArticlesTable />
    </div>
  );
}
