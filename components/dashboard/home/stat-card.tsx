import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  href: string;
  value: number;
  icon: typeof FileText;
}

function StatCard({ title, value, href, icon: Icon }: StatCardProps) {
  const displayValue = Number.isFinite(value) ? value.toLocaleString() : '—';

  return (
    <Card className="group focus-within:ring-ring/50 relative overflow-hidden transition-shadow focus-within:ring-2 hover:shadow-sm">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="bg-primary/10 absolute -top-24 -right-24 size-56 rounded-full blur-3xl" />
        <div className="bg-secondary/20 absolute -bottom-28 -left-28 size-56 rounded-full blur-3xl" />
      </div>

      <CardHeader className="relative pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
        <CardAction>
          <div className="bg-muted/60 text-muted-foreground ring-border group-hover:bg-primary/10 group-hover:text-primary grid size-10 place-items-center rounded-lg ring-1 transition-colors">
            <Icon className="size-5 shrink-0" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="relative space-y-2">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{displayValue}</div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground -mx-2 w-fit px-2"
        >
          <Link href={href} className="inline-flex items-center gap-1">
            View
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default StatCard;
