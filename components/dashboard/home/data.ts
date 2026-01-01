import { FileText, Package } from 'lucide-react';

export const content = {
  title: 'Welcome back',
  subtitle: 'Manage Articles and Services from one place.',
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
  {
    title: 'Services',
    badge: 'Catalog',
    description: 'Maintain service offerings and organize them by solution key.',
    listHref: '/dashboard/services',
    createHref: '/dashboard/services/add',
    icon: Package,
    bullets: ['Create & update services', 'Organize services by solution key'],
  },
] as const;
