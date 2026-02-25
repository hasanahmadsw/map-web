import Link from 'next/link';
import type { IntentLinkItem } from '@/types/intents/intent.type';

interface IntentInternalLinksProps {
  internalLinks: IntentLinkItem[];
}

export function IntentInternalLinks({ internalLinks }: IntentInternalLinksProps) {
  if (!internalLinks?.length) return null;

  const uniqueLinks = internalLinks.filter(
    (link, i, arr) => arr.findIndex(l => l.slug === link.slug && l.url === link.url) === i
  );

  return (
    <div className="flex flex-wrap gap-3">
      {uniqueLinks.map((link, index) => (
        <Link
          key={`${link.slug}-${link.url}-${index}`}
          href={link.url}
          className="text-primary hover:underline text-sm font-medium"
        >
          {link.linkLabel}
        </Link>
      ))}
    </div>
  );
}
