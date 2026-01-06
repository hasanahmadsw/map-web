import { SolutionKey } from '@/types/solution-key.enum';
import { Video, Camera, Calendar, Zap, Award, Settings, Users, Clock, Shield } from 'lucide-react';

export interface SolutionKeyInfo {
  key: SolutionKey;
  slug: string;
  title: string;
  description: string;
  icon: typeof Video;
  keywords: string[];
}

export const solutionKeyMap: Record<SolutionKey, SolutionKeyInfo> = {
  [SolutionKey.PRODUCTION]: {
    key: SolutionKey.PRODUCTION,
    slug: 'media-production',
    title: 'Media Production',
    description:
      'Comprehensive media production services including video production, post-production, broadcasting, and content creation.',
    icon: Video,
    keywords: ['media production', 'video production', 'broadcasting', 'content creation', 'post-production'],
  },
  [SolutionKey.PHOTOGRAPHY]: {
    key: SolutionKey.PHOTOGRAPHY,
    slug: 'photography',
    title: 'Photography',
    description:
      'Professional photography services for events, corporate needs, product photography, and creative projects.',
    icon: Camera,
    keywords: [
      'photography',
      'photo shoots',
      'corporate photography',
      'event photography',
      'product photography',
    ],
  },
  [SolutionKey.EVENTS]: {
    key: SolutionKey.EVENTS,
    slug: 'events-management',
    title: 'Events Management',
    description:
      'Complete event management solutions including live event coverage, production, and technical support.',
    icon: Calendar,
    keywords: ['events management', 'live events', 'event production', 'event coverage', 'technical support'],
  },
};

export function getSolutionKeyInfo(solutionKey: SolutionKey): SolutionKeyInfo {
  return solutionKeyMap[solutionKey];
}

export function getSolutionKeyBySlug(slug: string): SolutionKey | null {
  const entry = Object.values(solutionKeyMap).find(info => info.slug === slug);
  return entry ? entry.key : null;
}

export const allSolutionKeys = Object.values(solutionKeyMap);

// Get solution-specific metadata
export function getSolutionMetadata(key: SolutionKey) {
  const metadataMap: Record<
    SolutionKey,
    {
      features: string[];
      benefits: { title: string; description: string; icon: typeof Award }[];
      useCases: string[];
    }
  > = {
    [SolutionKey.PRODUCTION]: {
      features: [
        'Professional video production',
        'Post-production editing',
        'Broadcast quality output',
        'Multi-camera setups',
        'Live streaming capabilities',
        'Content creation services',
      ],
      benefits: [
        {
          title: 'Professional Quality',
          description: 'Broadcast-grade production ensuring exceptional visual and audio quality',
          icon: Award,
        },
        {
          title: 'Expert Team',
          description: 'Experienced professionals with years of industry expertise',
          icon: Users,
        },
        {
          title: 'Advanced Technology',
          description: 'State-of-the-art equipment and cutting-edge production tools',
          icon: Settings,
        },
      ],
      useCases: [
        'Corporate Videos',
        'Commercial Production',
        'Documentary Films',
        'Live Broadcasts',
        'Content Marketing',
        'Social Media Content',
      ],
    },
    [SolutionKey.PHOTOGRAPHY]: {
      features: [
        'Professional photography',
        'Event coverage',
        'Product photography',
        'Corporate headshots',
        'Creative photo shoots',
        'Post-processing services',
      ],
      benefits: [
        {
          title: 'Creative Excellence',
          description: 'Artistic vision combined with technical expertise for stunning results',
          icon: Award,
        },
        {
          title: 'Versatile Solutions',
          description: 'Adaptable to various photography needs from events to commercial shoots',
          icon: Settings,
        },
        {
          title: 'Quick Turnaround',
          description: 'Efficient workflow ensuring timely delivery of high-quality images',
          icon: Clock,
        },
      ],
      useCases: [
        'Corporate Events',
        'Product Launches',
        'Wedding Photography',
        'Fashion Shoots',
        'Real Estate',
        'Portrait Sessions',
      ],
    },
    [SolutionKey.EVENTS]: {
      features: [
        'Event planning & coordination',
        'Live event coverage',
        'Technical support',
        'Equipment rental',
        'On-site production',
        'Post-event services',
      ],
      benefits: [
        {
          title: 'Complete Solutions',
          description: 'End-to-end event management from planning to execution',
          icon: Shield,
        },
        {
          title: 'Reliable Support',
          description: '24/7 technical support ensuring smooth event operations',
          icon: Users,
        },
        {
          title: 'Scalable Services',
          description: 'Flexible solutions that adapt to events of any size',
          icon: Zap,
        },
      ],
      useCases: [
        'Corporate Conferences',
        'Music Festivals',
        'Sports Events',
        'Product Launches',
        'Award Ceremonies',
        'Trade Shows',
      ],
    },
  };
  return metadataMap[key];
}
