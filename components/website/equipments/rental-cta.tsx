import Link from 'next/link';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RentalCTA() {
  return (
    <section className="container mx-auto mb-16 px-6">
      <div className="bg-muted/50 border-border rounded-2xl border p-8 md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-semibold md:text-3xl">Need Help Finding the Right Equipment?</h2>
          <p className="text-muted-foreground mb-8 text-base md:text-lg">
            Our team is here to help you find the perfect equipment for your project. Get in touch with us
            today and let's discuss your rental needs.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>

            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-sm">
              <a
                href="tel:+974XXXXXXXX"
                className="hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:info@maproduction.ae"
                className="hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
