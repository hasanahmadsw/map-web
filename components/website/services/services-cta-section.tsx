import Link from 'next/link';

export function ServicesCTASection() {
  return (
    <div className="glass-card space-y-6 rounded-3xl p-10 md:p-16">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold md:text-3xl">Ready to Get Started?</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-sm md:text-base">
          Have questions about our services or need a customized solution? Contact us today and let our team
          help you find the perfect service for your needs.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link href="/contact">
            <button className="glass-button cursor-pointer rounded-full px-8 py-4 text-sm font-medium transition-all duration-200 hover:scale-105 md:text-base">
              Contact Us
            </button>
          </Link>
          <Link href="/solutions">
            <button className="glass-button cursor-pointer rounded-full px-8 py-4 text-sm font-medium transition-all duration-200 hover:scale-105 md:text-base">
              Explore Solutions
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
