import Image from 'next/image';
import { ReactNode } from 'react';
import MotionWrapper from './motion/motion-wrapper';

interface ContactHeroProps {
  imageSrc: string;
  imageAlt?: string;
  overlayDirection?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
  children?: ReactNode;
  className?: string;
}

function HeroSection({
  imageSrc,
  imageAlt = 'Hero background',
  overlayDirection = 'left-to-right',
  children,
  className = '',
}: ContactHeroProps) {
  // Determine gradient direction based on prop
  const getGradientDirection = () => {
    switch (overlayDirection) {
      case 'right-to-left':
        return 'bg-gradient-to-l from-secondary/80 via-secondary/70 to-transparent';
      case 'top-to-bottom':
        return 'bg-gradient-to-t from-secondary/80 via-secondary/70 to-transparent';
      case 'bottom-to-top':
        return 'bg-gradient-to-b from-secondary/80 via-secondary/70 to-transparent';
      default: // left-to-right
        return 'bg-gradient-to-r from-secondary/80 via-secondary/70 to-transparent';
    }
  };

  return (
    <div className={`relative h-[70vh] w-full overflow-hidden ${className}`}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover opacity-90 blur-xs"
        priority
        fetchPriority="high"
      />
      <div className={`absolute inset-0 ${getGradientDirection()}`} />

      <div className="top-edge-nav-margin absolute inset-0 flex items-center justify-center">
        <MotionWrapper
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8"
        >
          {children}
        </MotionWrapper>
      </div>
    </div>
  );
}
export default HeroSection;
