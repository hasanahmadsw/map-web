import Link from 'next/link';

export function SolutionsCTASection() {
  return (
    <div className="glass-card space-y-6 rounded-3xl p-10 md:p-16">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-medium md:text-4xl">Ready to Transform Your Media Production?</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg">
          Discover how our innovative solutions can elevate your media production and broadcasting
          capabilities. Get in touch with our team to explore the perfect solution for your needs.
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
