'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { navigationLinks } from './data';
import { MediaProductionDropdown } from './media-production-dropdown';
import { BroadcastDropdown } from './broadcast-dropdown';

function Navbar() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="max-lg:hidden">
      <NavigationMenuList className="gap-2">
        {navigationLinks.map((link, index) => {
          const isActive = link.href === '' ? pathname === `/` : pathname === `${link.href}`;

          // Skip Photography from regular links as it's handled separately
          if (link.href === '/solutions/photography') {
            return null;
          }

          // Render Home first, then dropdowns, then rest of links
          if (link.href === '/') {
            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  active={isActive}
                  className={` ${
                    isActive ? 'text-primary! font-bold' : ''
                  } hover:text-primary py-1.5 text-sm font-medium whitespace-nowrap min-[1100px]:text-[15px]`}
                  asChild
                >
                  <Link href={`${link.href}`}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          // Render dropdowns after Home
          if (index === 1) {
            return (
              <React.Fragment key={`dropdowns-${index}`}>
                <MediaProductionDropdown />
                <BroadcastDropdown />
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    active={isActive}
                    className={` ${
                      isActive ? 'text-primary! font-bold' : ''
                    } hover:text-primary py-1.5 text-sm font-medium whitespace-nowrap min-[1100px]:text-[15px]`}
                    asChild
                  >
                    <Link href={`${link.href}`}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </React.Fragment>
            );
          }

          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                active={isActive}
                className={` ${
                  isActive ? 'text-primary! font-bold' : ''
                } hover:text-primary py-1.5 text-sm font-medium whitespace-nowrap min-[1100px]:text-[15px]`}
                asChild
              >
                <Link href={`${link.href}`}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
        {/* <NavigationMenuItem>
          <NavigationMenuLink
            active={pathname === '/solutions/photography'}
            className={` ${
              pathname === '/solutions/photography' ? 'text-primary! font-bold' : ''
            } hover:text-primary py-1.5 text-sm whitespace-nowrap min-[1100px]:text-[15px]`}
            asChild
          >
            <Link href="/solutions/photography">Photography</Link>
          </NavigationMenuLink>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;
