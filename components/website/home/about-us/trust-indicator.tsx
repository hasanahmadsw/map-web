import { Star } from 'lucide-react';

export default function TrustIndicator({ label = 'Rated 5/5 by 200+ Clients' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 pt-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className="text-primary fill-primary h-5 w-5" />
        ))}
      </div>
      <span className="text-muted-foreground text-xs font-medium md:text-sm">{label}</span>
    </div>
  );
}
