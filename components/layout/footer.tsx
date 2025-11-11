import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Facebook, Linkedin, Instagram } from "lucide-react"
import { Translations } from "@/utils/dictionary-utils"

interface FooterProps {
  lang: string
  t: Translations
}

const socialIcons = {
  Facebook: Facebook,
  LinkedIn: Linkedin,
  Instagram: Instagram,
}

export function Footer({ lang, t }: FooterProps) {
  return (
    <footer className="max-w-7xl mx-auto bg-dark-section">
      <div className="container max-w-7xl py-10">
        <div className="space-y-8">
          {/* Main Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Company Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${lang}/about`} className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/contact`} className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <Link href={`/${lang}/services`} className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <Link href={`/${lang}/solutions`} className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <Link href={`/${lang}/news`} className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <Link href={`/${lang}/privacy`} className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/terms`} className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-muted-foreground">
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
  )
}

