import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { formatBroadcastType, getTypeBroadcastingUrl } from './unit-utils';

interface UnitNavigationProps {
  type: BroadcastType | `${BroadcastType}`;
}

export function UnitNavigation({ type }: UnitNavigationProps) {
  const typeUrl = getTypeBroadcastingUrl(type);

  return (
    <section className="mb-12">
      <Link
        href={typeUrl}
        className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to {formatBroadcastType(type)} Units
      </Link>
    </section>
  );
}

