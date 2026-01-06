import { SolutionKey } from '@/types/solution-key.enum';
import { Video, Camera, Calendar } from 'lucide-react';

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
