import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { Building2, Radio, Zap, Shield, Clock } from 'lucide-react';

export function getTypeMetadata(type: BroadcastType) {
  const metadataMap: Record<
    BroadcastType,
    {
      title: string;
      description: string;
      badgeText: string;
      headerTitle: string;
      highlightedText: string;
      headerDescription: string;
      features: string[];
      benefits: { title: string; description: string; icon: typeof Building2 }[];
      useCases: string[];
    }
  > = {
    [BroadcastType.OBVAN]: {
      title: 'OBVAN Broadcast Units | MAP Media Art Production',
      description:
        'Explore our Outside Broadcast Vans (OBVAN) - state-of-the-art mobile broadcast units designed for live events and professional broadcasting.',
      badgeText: 'OBVAN',
      headerTitle: 'Outside Broadcast ',
      highlightedText: 'Vans',
      headerDescription:
        'State-of-the-art mobile broadcast units designed for live events and professional broadcasting.',
      features: [
        'Multi-camera production setup',
        'Live event coverage capability',
        'Real-time broadcasting',
        'Professional audio mixing',
        'Mobile transmission systems',
        'On-site editing capabilities',
      ],
      benefits: [
        {
          title: 'Mobile Production',
          description: 'Complete broadcast production facility on wheels, ready for any location',
          icon: Building2,
        },
        {
          title: 'Live Coverage',
          description: 'Real-time broadcasting capabilities for sports, events, and breaking news',
          icon: Radio,
        },
        {
          title: 'Professional Quality',
          description: 'Broadcast-grade equipment ensuring exceptional production quality',
          icon: Shield,
        },
      ],
      useCases: [
        'Live Sports Events',
        'Music Festivals',
        'Corporate Events',
        'Breaking News',
        'Political Rallies',
        'Religious Ceremonies',
      ],
    },
    [BroadcastType.FLIGHT_CASE]: {
      title: 'Flight Case Broadcast Units | MAP Media Art Production',
      description:
        'Explore our portable Flight Case broadcast units - compact and mobile solutions for professional broadcasting and media production.',
      badgeText: 'Flight Cases',
      headerTitle: 'Portable Broadcast ',
      highlightedText: 'Flight Cases',
      headerDescription:
        'Compact and mobile broadcast units designed for professional broadcasting and media production.',
      features: [
        'Portable and lightweight',
        'Quick setup and deployment',
        'Durable construction',
        'Travel-friendly design',
        'Compact equipment storage',
        'Easy transportation',
      ],
      benefits: [
        {
          title: 'Portability',
          description: 'Lightweight and compact design perfect for travel and remote locations',
          icon: Zap,
        },
        {
          title: 'Quick Setup',
          description: 'Rapid deployment with minimal setup time for time-sensitive productions',
          icon: Clock,
        },
        {
          title: 'Durability',
          description: 'Robust construction designed to withstand travel and harsh conditions',
          icon: Shield,
        },
      ],
      useCases: [
        'Remote Productions',
        'Travel Documentaries',
        'Field Reporting',
        'Corporate Presentations',
        'Educational Content',
        'Small Events',
      ],
    },
  };
  return metadataMap[type];
}

export function getTypeFromSlug(slug: string): BroadcastType | null {
  const typeMap: Record<string, BroadcastType> = {
    obvan: BroadcastType.OBVAN,
    'flight-case': BroadcastType.FLIGHT_CASE,
  };
  return typeMap[slug.toLowerCase()] || null;
}
