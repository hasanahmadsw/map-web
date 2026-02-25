import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { IntentLinkItem } from '@/types/intents/intent.type';

interface IntentSmartBadgesProps {
  smartBadges: IntentLinkItem[];
}

export function IntentSmartBadges({ smartBadges }: IntentSmartBadgesProps) {
  if (!smartBadges?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {smartBadges.map(badge => (
        <Link
          key={badge.url}
          href={badge.url}
          className="text-sm px-3 py-1.5 rounded-full border bg-card hover:border-primary hover:text-primary transition-colors"
        >
          {badge.linkLabel}
        </Link>
      ))}
    </div>
  );
}
