import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Facebook, Linkedin, Instagram } from 'lucide-react';

const socialIcons = {
  Facebook: Facebook,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

export function Footer() {
  return (
    <footer className="bg-dark-section mx-auto max-w-7xl">
      <div className="container max-w-7xl py-10">
        <div className="space-y-8">
          {/* Main Links Grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Company Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/about`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/contact`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/services`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Our Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Solutions</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/solutions`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Our Solutions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/news`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Articles
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/privacy`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/terms`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
