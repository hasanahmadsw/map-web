'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { navigationLinks } from './data';

function Navbar() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="max-lg:hidden">
      <NavigationMenuList className="gap-2">
        {navigationLinks.map((link, index) => {
          const isActive = link.href === '' ? pathname === `/` : pathname === `/${link.href}`;

          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                active={isActive}
                className={` ${
                  isActive ? 'text-primary! font-bold' : ''
                } hover:text-primary py-1.5 text-sm whitespace-nowrap min-[1100px]:text-[15px]`}
                asChild
              >
                <Link href={`/${link.href}`}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;
