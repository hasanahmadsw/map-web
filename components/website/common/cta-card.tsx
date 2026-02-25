import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SimpleCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ElementType;
  className?: string;
  href?: string;
}

export default function CATSection({
  title,
  description,
  buttonText,
  buttonIcon: ButtonIcon = Sparkles,
  className = '',
  href,
}: SimpleCTAProps) {
  return (
    <div
      className={`from-primary/5 to-secondary/5 border-primary/10 rounded-3xl border bg-linear-to-r p-8 text-center shadow-sm ${className}`}
    >
      <h3 className="text-foreground mb-4 text-2xl font-semibold md:text-3xl">
        {title}
      </h3>

      <p className="text-muted-foreground mx-auto mb-8 max-w-md">
        {description}
      </p>

      <div className="group inline-block">
        <Button
          size="default"
          className="bg-primary hover:shadow-3xl group text-primary-foreground relative overflow-hidden px-8 py-6 text-sm font-medium shadow-2xl transition-all duration-300"
          asChild
        >
          <Link href={href || '#'} role="button" prefetch={false}>
            <ButtonIcon className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
            <span className="relative z-10">{buttonText}</span>

            {/* Shine effect */}
            <span className="bg-primary-foreground/20 absolute inset-0 -translate-x-8 rotate-12 transform opacity-0 transition-all duration-500 group-hover:opacity-100" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
