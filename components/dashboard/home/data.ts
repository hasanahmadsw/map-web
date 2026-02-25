import { FileText } from 'lucide-react';

export const content = {
  title: 'Welcome back',
  subtitle: 'Manage Articles from one place.',
};

export const adminCards = [
  {
    title: 'Articles',
    badge: 'Content',
    description: 'Create, publish, and maintain your news articles.',
    listHref: '/dashboard/articles',
    createHref: '/dashboard/articles/add',
    icon: FileText,
    bullets: ['Draft, publish, and update posts', 'Manage tags, SEO, and status'],
  },
] as const;
