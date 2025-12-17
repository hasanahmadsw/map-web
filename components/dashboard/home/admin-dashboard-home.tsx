'use client';

import Link from 'next/link';

import { BriefcaseBusiness, FileText, Package, Plus, UserRound, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import StatCard from './stat-card';
import { adminCards, content } from './data';

interface AdminDashboardHomeProps {
  staffName: string | null;
}

export function AdminDashboardHome({ staffName }: AdminDashboardHomeProps) {
  const title = staffName ? `Welcome back, ${staffName}` : content.title;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <Badge variant="secondary">Admin</Badge>
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Articles" href="/dashboard/articles" icon={FileText} value={5} />
        <StatCard title="Solutions" href="/dashboard/solutions" icon={BriefcaseBusiness} value={5} />
        <StatCard title="Services" href="/dashboard/services" icon={Package} value={5} />
        <StatCard title="Staff" href="/dashboard/staff" icon={Users} value={5} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminCards.map(card => (
          <Card key={card.title} className="h-full">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <card.icon className="text-muted-foreground size-5" />
                    <span>{card.title}</span>
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
                <Badge variant="outline">{card.badge}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-1 text-sm">
                {card.bullets.map(bullet => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href={card.listHref}>View</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={card.createHref}>Create</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-4 w-16" />
      </CardContent>
    </Card>
  );
}
