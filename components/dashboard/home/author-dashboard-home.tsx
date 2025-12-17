import Link from 'next/link';
import { Package, Plus, UserRound } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthorDashboardHome({ staffName }: AuthorDashboardHomeProps) {
  const title = staffName ? `Welcome back, ${staffName}` : content.title;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <Badge variant="secondary">Author</Badge>
          </div>
          <p className="text-muted-foreground text-sm">{content.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/profile">
              <UserRound className="size-4" />
              Profile
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/dashboard/articles/add">
              <Plus className="size-4" />
              New article
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="h-full">
          <CardHeader className="gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Package className="text-muted-foreground size-5" />
                  <span>Articles</span>
                </CardTitle>
                <CardDescription>Create, publish, and maintain your news articles.</CardDescription>
              </div>
              <Badge variant="outline">Content</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>Draft, publish, and update posts</li>
              <li>Manage tags, SEO, and status</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard/articles">View</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard/articles/add">Create</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

const content = {
  title: 'Welcome back',
  subtitle: 'Quick access to your available tools.',
};

interface AuthorDashboardHomeProps {
  staffName: string | null;
}
