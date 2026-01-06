import { ReactNode } from 'react';

interface SectionWithContentProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SectionWithContent({ title, description, children }: SectionWithContentProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">{description}</p>
      </div>
      {children}
    </div>
  );
}
