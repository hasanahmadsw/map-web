import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';
import Logo from '../header/logo';
import { servicesService } from '@/services/services.service';
import { allSolutionKeys } from '@/utils/solution-key-mapping';

const currentYear = new Date().getFullYear();
const Footer = async () => {
  // Fetch services directly from API
  let servicesResponse;
  try {
    servicesResponse = await servicesService.getAll({
      limit: 6,
      isPublished: true,
      isFeatured: true,
    });
  } catch {
    servicesResponse = { data: [] };
  }

  const services = servicesResponse?.data || [];

  // Use static solution keys
  const solutions = allSolutionKeys;

  return (
    <footer className="text-card-foreground bg-gray-900">
      {/* Main Footer */}
      <div className="px-4 pt-24 pb-8">
        <div className="mx-auto max-w-7xl">
          {/* Top Section */}
          <div className="grid gap-12 lg:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Logo width={150} height={150} />
              </div>

              <p className="text-sm leading-relaxed text-white/80">
                Discover our comprehensive range of media production and broadcasting solutions, designed to
                meet the unique needs of businesses and organizations worldwide.
              </p>

              <div className="flex space-x-4 text-white">
                <a
                  href="#"
                  className="bg-foreground/5 hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-foreground/5 hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-foreground/5 hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-foreground/5 hover:bg-foreground/10 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Solutions</h3>
              <ul className="space-y-4">
                {solutions.map(solution => (
                  <li key={solution.key}>
                    <Link
                      href={`/solutions/${solution.slug}`}
                      prefetch={false}
                      className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {solution.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">Services</h3>
              <ul className="space-y-4">
                {services.slice(0, 6).map(service => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      prefetch={false}
                      className="group flex items-center text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
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
                    href: '/rental',
                    name: 'Equipment Rental',
                  },
                  {
                    href: '/solutions',
                    name: 'Solution',
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
                    <div className="text-white">BS 18, Dubai Studio City, Dubai, UAE</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-white/80" />
                  <div>
                    <div className="text-sm text-white/80">Phone</div>
                    <div className="text-white">+974 XXXX XXXX</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-white/80" />
                  <div>
                    <div className="text-sm text-white/80">Email</div>
                    <div className="text-white">info@maproduction.ae</div>
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
                  <Link href="#" className="text-white/80 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="text-white/80 transition-colors">
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
};

export default Footer;
