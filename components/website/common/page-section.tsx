import { ReactNode } from 'react';

export const SECTION_CLASS = 'container py-8 md:py-10';

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export function PageSection({ children, className = '' }: PageSectionProps) {
  return <section className={`${SECTION_CLASS} ${className}`.trim()}>{children}</section>;
}
