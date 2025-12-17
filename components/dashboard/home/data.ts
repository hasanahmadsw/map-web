import { BriefcaseBusiness, FileText, Package } from 'lucide-react';

export const content = {
  title: 'Welcome back',
  subtitle: 'Manage Articles, Solutions, and Services from one place.',
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
    title: 'Solutions',
    badge: 'Business',
    description: 'Organize solutions and keep information up to date.',
    listHref: '/dashboard/solutions',
    createHref: '/dashboard/solutions/add',
    icon: BriefcaseBusiness,
    bullets: ['Add new solutions and edit details', 'Control visibility and metadata'],
  },
  {
    title: 'Services',
    badge: 'Catalog',
    description: 'Maintain service offerings and connect them to solutions.',
    listHref: '/dashboard/services',
    createHref: '/dashboard/services/add',
    icon: Package,
    bullets: ['Create & update services', 'Link services to solutions'],
  },
] as const;
