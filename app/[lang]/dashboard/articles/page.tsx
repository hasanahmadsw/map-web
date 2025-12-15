import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ArticlesTable } from '@/components/dashboard/articles/articles-table';
import { Button } from '@/components/ui/button';

export default async function ArticlesPage() {
  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles Management</h1>
          <p className="text-muted-foreground">Manage your articles and their translations.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articles/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Article
          </Link>
        </Button>
      </header>

      <ArticlesTable />
    </div>
  );
}
