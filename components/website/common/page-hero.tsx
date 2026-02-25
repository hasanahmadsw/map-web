import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

export interface HeroButton {
  text: string;
  href: string;
  variant?: 'default' | 'outline';
}

interface PageHeroProps {
  title: string;
  description: string;
  buttons: HeroButton[];
  breadcrumbs?: BreadcrumbItemType[];
  minHeight?: '55vh' | '60vh';
}

export function PageHero({
  title,
  description,
  buttons,
  breadcrumbs,
  minHeight = '55vh',
}: PageHeroProps) {
  const heightClass = minHeight === '60vh' ? 'min-h-[calc(60vh-1rem)]' : 'min-h-[calc(55vh-1rem)]';

  return (
    <section
      className={`relative ${heightClass} pt-edge-nav-margin container max-w-7xl flex items-center overflow-hidden`}
    >
      <div className="max-w-2xl">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              {breadcrumbs.map((item, i) => (
                <span key={i} className="contents">
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1 className="text-3xl font-bold md:text-4xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-4 text-base tracking-tight max-w-2xl">{description}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          {buttons.map((btn, i) => (
            <Button
              key={i}
              asChild
              size="lg"
              variant={btn.variant || 'default'}
              className="rounded-full"
            >
              <Link href={btn.href}>
                {btn.text}
                {btn.variant !== 'outline' && <ArrowRight className="ml-2 size-4" />}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
