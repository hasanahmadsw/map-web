import Image from 'next/image';
import { Building2, type LucideIcon } from 'lucide-react';

interface PageHeroSectionProps {
  imageSrc: string;
  imageAlt?: string;
  badgeIcon?: LucideIcon;
  badgeText: string;
  title: string;
  highlightedText?: string;
  description: string;
  secondaryDescription?: string;
  height?: string;
}

export function PageHeroSection({
  imageSrc,
  imageAlt = 'Hero background',
  badgeIcon: BadgeIcon = Building2,
  badgeText,
  title,
  highlightedText,
  description,
  secondaryDescription,
  height = 'h-[75vh] md:h-[85vh]',
}: PageHeroSectionProps) {
  return (
    <div className={`pt-edge-nav-margin relative ${height} w-full overflow-hidden`}>
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority unoptimized />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/70 to-black/50" />

      {/* Content Overlay - Centered */}
      <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-10">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <BadgeIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">{badgeText}</span>
            </div>

            <h1 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
              {title}
              {highlightedText && (
                <>
                  {' '}
                  <span className="from-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                    {highlightedText}
                  </span>
                </>
              )}
            </h1>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
              {description}
            </p>

            {secondaryDescription && (
              <p className="mx-auto hidden max-w-2xl text-sm leading-relaxed text-white/80 sm:block sm:text-base">
                {secondaryDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
