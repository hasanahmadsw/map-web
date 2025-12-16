import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Image as ImageIcon,
  Package,
  PieChart,
  Settings2,
  Users,
} from 'lucide-react';

export const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: PieChart,
  },
  {
    title: 'Articles',
    url: '/dashboard/articles',
    icon: FileText,
  },
  {
    title: 'Services',
    url: '/dashboard/services',
    icon: Package,
  },
  {
    title: 'Staff',
    url: '/dashboard/staff',
    icon: Users,
  },
  {
    title: 'Solutions',
    url: '/dashboard/solutions',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Media',
    url: '/dashboard/media',
    icon: ImageIcon,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: [
      {
        title: 'General',
        url: '/dashboard/settings/general',
      },
      {
        title: 'Languages',
        url: '/dashboard/settings/languages',
      },
    ],
  },
];
