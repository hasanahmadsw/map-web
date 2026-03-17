import { MapPin, Phone, Mail, Share2 } from 'lucide-react';
import Link from 'next/link';
import Logo from '../header/logo';
import { SocialIcons } from '@/components/shared/social-icons';
import { DEFAULT_SETTINGS } from '@/constants/constant';
import { settingsService } from '@/services/settings.service';
import { ApiResponse } from '@/types/common.types';
import { Settings } from '@/types/settings.types';

const currentYear = new Date().getFullYear();

const socialsComponents = {
  facebook: <SocialIcons.facebook className="h-5 w-5" />,
  twitter: <SocialIcons.twitter className="h-5 w-5" />,
  tiktok: <SocialIcons.tiktok className="h-5 w-5" />,
  youtube: <SocialIcons.youtube className="h-5 w-5" />,
  instagram: <SocialIcons.instagram className="h-5 w-5" />,
  telegram: <SocialIcons.telegram className="h-5 w-5" />,
  linkedin: <SocialIcons.linkedin className="h-5 w-5" />,
  whatsapp: <SocialIcons.whatsapp className="h-5 w-5" />,
  snapchat: <SocialIcons.snapchat className="h-5 w-5" />,
};

async function Footer() {
  const settings = await settingsService.getSettings().catch(err => {
    console.error(err);
    return { data: DEFAULT_SETTINGS } as unknown as ApiResponse<Settings>;
  });

  return (
    <footer className="text-card-foreground bg-gray-900">
      {/* Main Footer */}
      <div className="px-4 pt-24 pb-8">
        <div className="mx-auto max-w-7xl">
          {/* Top Section */}
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Logo width={150} height={150} />
              </div>

              <p className="text-sm leading-relaxed text-white/80">{settings.data?.siteDescription || ''}</p>

              <div className="grid w-44 grid-cols-4 gap-3 text-white">
                {settings.data?.social?.map(social => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-foreground/5 hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full fill-white transition-colors"
                  >
                    {socialsComponents[social.platform as keyof typeof socialsComponents] || (
                      <Share2 className="h-5 w-5" />
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Services</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/services"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Video Production Dubai
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Filming Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Production Company
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/commercial-video-production"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Commercial Video Production
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/corporate-video-production"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Corporate Video Production
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/event-video-production"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Event Video Production
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/live-event-production"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Live Event Production
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/studio-video-production"
                    prefetch={false}
                    className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                  >
                    Studio Video Production
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  {
                    href: '/',
                    name: 'Home',
                  },
                  {
                    href: '/equipment-rental',
                    name: 'Equipment',
                  },
                  {
                    href: '/services',
                    name: 'Services',
                  },
                  {
                    href: '/about',
                    name: 'About',
                  },
                  {
                    href: '/contact',
                    name: 'Contact',
                  },
                  {
                    href: '/blog',
                    name: 'Blog',
                  },
                ].map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="my-8 grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="md:col-span-3 lg:col-span-4">
              <h3 className="mb-6 text-lg font-semibold text-white">Get in Touch</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center space-x-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-white/80" />
                  <div>
                    <div className="text-sm text-white/80">Location</div>
                    <div className="text-xs text-white">{settings.data?.contact?.address}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-white/80" />
                  <div>
                    <div className="text-sm text-white/80">Phone</div>
                    <div className="text-white">
                      <a
                        href={`tel:${settings.data?.contact?.phone?.replace(/\s/g, '')}`}
                        className="text-xs text-white hover:underline"
                      >
                        {settings.data?.contact?.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-white/80" />
                  <div>
                    <div className="text-sm text-white/80">Email</div>
                    <div className="text-white">
                      <a
                        href={`mailto:${settings.data?.contact?.email}`}
                        className="text-xs text-white hover:underline"
                      >
                        {settings.data?.contact?.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-border/10 border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-sm text-white/80">
                © {currentYear} MAP. All rights reserved. Powered by{' '}
                <a
                  href="https://www.blendlab.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white/80 transition-colors"
                >
                  BlendLab
                </a>
                .
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-6 text-sm">
                  <Link
                    href="/privacy"
                    prefetch={false}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    prefetch={false}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="border-border/5 border-t px-4 py-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-white/80">Leading Production and Broadcasting Solutions since 2015</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
