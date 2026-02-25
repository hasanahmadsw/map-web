import type { LucideIcon } from 'lucide-react';
import { Building2, TvMinimal, Presentation, Film, Video } from 'lucide-react';

export interface MediaProductionNavItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export const mediaProductionNavItems: MediaProductionNavItem[] = [
  {
    label: 'Video Production Dubai',
    href: '/services',
    description: 'Full-service video production and filming services for Dubai and the Gulf.',
    icon: Video,
  },
  {
    label: 'Commercial Video Production',
    href: '/services/commercial-video-production',
    description: 'TV commercials, digital ads, and branded content for agencies and brands.',
    icon: TvMinimal,
  },
  {
    label: 'Corporate Video Production',
    href: '/services/corporate-video-production',
    description: 'Brand films, company profiles, and corporate documentaries.',
    icon: Building2,
  },
  {
    label: 'Event Video Production',
    href: '/services/event-video-production',
    description: 'Conference coverage, product launches, and corporate event filming.',
    icon: Presentation,
  },
  {
    label: 'Live Event Production',
    href: '/services/live-event-production',
    description: 'Live streaming, conference production, and hybrid events.',
    icon: Presentation,
  },
  {
    label: 'Studio Video Production',
    href: '/services/studio-video-production',
    description: 'Studio filming, green screen, and controlled environment production.',
    icon: Film,
  },
];
