import Link from 'next/link';

export function BlogCTASection() {
  return (
    <div className="glass-card space-y-6 rounded-3xl p-10 md:p-16">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-medium md:text-4xl">Want to Learn More?</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg">
          Explore our services and solutions to discover how we can help transform your media production and
          broadcasting needs. Get in touch with our team for personalized guidance.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link href="/contact">
            <button className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium transition-all duration-200 hover:scale-105">
              Contact Us
            </button>
          </Link>
          <Link href="/services">
            <button className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium transition-all duration-200 hover:scale-105">
              View Services
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
