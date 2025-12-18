import { Role } from '@/enums/roles.enum';
import {
  BriefcaseBusiness,
  Camera,
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
    allowedRole: [Role.SUPERADMIN, Role.ADMIN, Role.AUTHOR],
  },
  {
    title: 'Articles',
    url: '/dashboard/articles',
    icon: FileText,
    allowedRole: [Role.SUPERADMIN, Role.ADMIN, Role.AUTHOR],
  },
  {
    title: 'Services',
    url: '/dashboard/services',
    icon: Package,
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
  },
  {
    title: 'Staff',
    url: '/dashboard/staff',
    icon: Users,
    allowedRole: [Role.SUPERADMIN],
  },
  {
    title: 'Solutions',
    url: '/dashboard/solutions',
    icon: BriefcaseBusiness,
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
  },
  {
    title: 'Equipments',
    url: '#',
    icon: Camera,
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
    items: [
      {
        title: 'All Equipments',
        url: '/dashboard/equipments',
      },
      {
        title: 'Categories',
        url: '/dashboard/equipments/categories',
      },
      {
        title: 'Brands',
        url: '/dashboard/equipments/brands',
      },
    ],
  },
  {
    title: 'Media',
    url: '/dashboard/media',
    icon: ImageIcon,
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    allowedRole: [Role.SUPERADMIN],
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
