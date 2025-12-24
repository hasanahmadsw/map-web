import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Star } from 'lucide-react';

export default function TrustIndicator({ label = 'Rated 5/5 by 200+ Clients' }: { label?: string }) {
  return (
    <MotionWrapper
      className="flex items-center justify-center gap-6 pt-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 1.0 }}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className="w-5 h-5 text-primary fill-primary" />
      ))}
      <span className="text-xs md:text-sm text-muted-foreground font-medium">{label}</span>
    </MotionWrapper>
  );
}
