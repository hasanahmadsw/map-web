import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { Building2, Radio, Zap, Shield, Settings, Users, Clock } from 'lucide-react';

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
    [BroadcastType.SNG]: {
      title: 'SNG Broadcast Units | MAP Media Art Production',
      description:
        'Explore our Satellite News Gathering (SNG) units - professional broadcast solutions for satellite transmission and remote broadcasting.',
      badgeText: 'SNG',
      headerTitle: 'Satellite News ',
      highlightedText: 'Gathering',
      headerDescription:
        'Professional broadcast units designed for satellite transmission and remote broadcasting.',
      features: [
        'Satellite transmission',
        'Global coverage capability',
        'Reliable connectivity',
        'Remote broadcasting',
        'High-quality transmission',
        'Real-time satellite uplink',
      ],
      benefits: [
        {
          title: 'Global Reach',
          description: 'Satellite transmission enabling broadcasting from anywhere in the world',
          icon: Radio,
        },
        {
          title: 'Reliable Connection',
          description: 'Consistent and stable satellite connectivity for critical broadcasts',
          icon: Shield,
        },
        {
          title: 'Remote Access',
          description: 'Broadcast from remote locations without traditional infrastructure',
          icon: Settings,
        },
      ],
      useCases: [
        'Breaking News',
        'International Events',
        'Remote Locations',
        'Disaster Coverage',
        'War Zones',
        'Rural Areas',
      ],
    },
    [BroadcastType.INTERNET_BROADCAST]: {
      title: 'Internet Broadcast Units | MAP Media Art Production',
      description:
        'Explore our Internet Broadcast units - professional solutions for online streaming and digital broadcasting.',
      badgeText: 'Internet Broadcast',
      headerTitle: 'Online Streaming & ',
      highlightedText: 'Digital Broadcasting',
      headerDescription:
        'Professional broadcast units designed for online streaming and digital broadcasting.',
      features: [
        'Online streaming capability',
        'Digital broadcasting',
        'Webinar support',
        'High-quality output',
        'Multi-platform streaming',
        'Interactive features',
      ],
      benefits: [
        {
          title: 'Digital Reach',
          description: 'Broadcast to global audiences through online platforms and streaming services',
          icon: Radio,
        },
        {
          title: 'Cost Effective',
          description: 'Affordable solution for reaching large audiences without satellite costs',
          icon: Zap,
        },
        {
          title: 'Interactive',
          description: 'Engage with audiences through live chat, polls, and interactive features',
          icon: Users,
        },
      ],
      useCases: [
        'Webinars',
        'Online Conferences',
        'Live Streaming',
        'Educational Content',
        'Product Launches',
        'Virtual Events',
      ],
    },
    [BroadcastType.OTHER]: {
      title: 'Other Broadcast Units | MAP Media Art Production',
      description:
        'Explore our additional broadcast units - specialized solutions for various broadcasting and media production needs.',
      badgeText: 'Other',
      headerTitle: 'Additional Broadcast ',
      highlightedText: 'Solutions',
      headerDescription: 'Specialized broadcast units for various broadcasting and media production needs.',
      features: [
        'Custom configurations',
        'Specialized equipment',
        'Tailored solutions',
        'Flexible options',
        'Unique requirements',
        'Bespoke setups',
      ],
      benefits: [
        {
          title: 'Customization',
          description: 'Tailored solutions designed to meet your specific production requirements',
          icon: Settings,
        },
        {
          title: 'Flexibility',
          description: 'Adaptable configurations for unique broadcasting scenarios',
          icon: Zap,
        },
        {
          title: 'Expert Consultation',
          description: 'Professional guidance to design the perfect broadcast solution',
          icon: Users,
        },
      ],
      useCases: [
        'Special Events',
        'Unique Productions',
        'Custom Requirements',
        'Experimental Broadcasting',
        'Niche Markets',
        'Specialized Content',
      ],
    },
  };
  return metadataMap[type];
}

export function getTypeFromSlug(slug: string): BroadcastType | null {
  const typeMap: Record<string, BroadcastType> = {
    obvan: BroadcastType.OBVAN,
    'flight-case': BroadcastType.FLIGHT_CASE,
    sng: BroadcastType.SNG,
    'internet-broadcast': BroadcastType.INTERNET_BROADCAST,
    other: BroadcastType.OTHER,
  };
  return typeMap[slug.toLowerCase()] || null;
}
