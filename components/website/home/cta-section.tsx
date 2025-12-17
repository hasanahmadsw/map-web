import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function CTASection() {
  return (
    <section className="container mx-auto max-w-6xl py-16">
      <div className="glass-card space-y-10 rounded-3xl p-10 md:p-16">
        {/* Top Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-medium md:text-4xl">Get in Touch with Us</h2>
          <p className="text-base">
            Ready to start your next project? Contact us today and let's discuss how we can help you achieve
            your goals.
          </p>

          <div className="pt-4">
            <Link href="/contact">
              <button className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        {/* Separator */}
        <Separator />

        {/* Bottom Section - Office Locations */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Our Offices</h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* First Office */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold">Sharjah Office</h4>
              <address className="text-muted-foreground">Sharjah, United Arab Emirates</address>
            </div>

            {/* Second Office */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold">Dubai Office</h4>
              <address className="text-muted-foreground">Dubai, United Arab Emirates</address>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
