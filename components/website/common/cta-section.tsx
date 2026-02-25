import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTAButton {
  text: string;
  href: string;
}

interface CTASectionOffice {
  name: string;
  location: string;
}

interface CTASectionProps {
  title: string;
  description: string;
  buttons: CTAButton[];
  offices?: CTASectionOffice[];
  titleClassName?: string;
  descriptionClassName?: string;
}

const DEFAULT_OFFICES: CTASectionOffice[] = [
  { name: 'Dubai Studio City', location: 'BS 18, Dubai Studio City, United Arab Emirates' },
  { name: 'Dubai Production City', location: 'B29, Dubai Production City, United Arab Emirates' },
];

export function CTASection({
  title,
  description,
  buttons,
  offices = DEFAULT_OFFICES,
  titleClassName = 'text-2xl font-semibold tracking-tight md:text-3xl',
  descriptionClassName = 'text-muted-foreground',
}: CTASectionProps) {
  const primaryButton = buttons[0];

  return (
    <section className="py-12 lg:py-16">
      <div className="rounded-2xl border border-border/60 bg-muted/30 px-8 py-12 md:px-16 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 max-w-xl">
            <h2 className={titleClassName}>{title}</h2>
            <p className={descriptionClassName}>{description}</p>
          </div>
          {primaryButton && (
            <Link
              href={primaryButton.href}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'rounded-full inline-flex items-center gap-2 w-fit shrink-0'
              )}
            >
              {primaryButton.text}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {offices.length > 0 && (
          <div className="mt-12 pt-10 border-t border-border/60">
            <h3 className="text-lg font-semibold mb-6">Our Offices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offices.map(office => (
                <div key={office.name}>
                  <h4 className="font-medium">{office.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{office.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
