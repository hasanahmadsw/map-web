'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { Menu } from 'lucide-react';

import { navigationLinks } from './data';
import { MobileMediaProductionAccordion } from './media-production-accordion';
import { MobileBroadcastAccordion } from './broadcast-accordion';

import { usePathname } from 'next/navigation';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

function NavigationSheet() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer rounded-full lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] max-w-full p-0 sm:w-[400px]">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>

        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Navigation Menu</h2>
            {/* <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </SheetClose> */}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigationLinks.map(link => {
                const Icon = link.icon;
                const isActive = link.href === '' ? pathname === `/` : pathname === `${link.href}`;

                // Skip Photography from regular links as it's handled separately
                if (link.href === '/solutions/photography') {
                  return null;
                }

                return (
                  <li key={link.label}>
                    <SheetClose asChild>
                      <Link
                        href={`${link.href}`}
                        onClick={handleLinkClick}
                        className={`links-center flex gap-3 rounded-lg p-3 transition-all ${
                          isActive ? 'bg-accent text-primary' : 'hover:bg-accent hover:text-primary'
                        }`}
                      >
                        <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>{link.label}</span>
                      </Link>
                    </SheetClose>
                  </li>
                );
              })}
              <li>
                <MobileMediaProductionAccordion onLinkClick={handleLinkClick} />
              </li>
              <li>
                <MobileBroadcastAccordion onLinkClick={handleLinkClick} />
              </li>
              <li>
                <SheetClose asChild>
                  <Link
                    href="/solutions/photography"
                    onClick={handleLinkClick}
                    className={`links-center flex gap-3 rounded-lg p-3 transition-all ${
                      pathname === '/solutions/photography'
                        ? 'bg-accent text-primary'
                        : 'hover:bg-accent hover:text-primary'
                    }`}
                  >
                    <span
                      className={`font-medium ${pathname === '/solutions/photography' ? 'text-primary' : ''}`}
                    >
                      Photography
                    </span>
                  </Link>
                </SheetClose>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NavigationSheet;
