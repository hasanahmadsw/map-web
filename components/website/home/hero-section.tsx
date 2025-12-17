import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="container max-w-7xl px-6 py-16 md:px-0 md:py-24">
      <div className="space-y-6 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
          Media Production and Broadcasting Solutions
        </h1>
        <p className="text-md text-muted-foreground mx-auto max-w-2xl md:text-lg">
          Latest news, breaking stories, and in-depth analysis from around the world. Stay informed with our
          comprehensive coverage of politics, technology, business, and more.
        </p>
        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <Link
            className="glass-button flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            href="/solutions"
          >
            Explore Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="glass-button rounded-full px-4 py-2 text-sm font-medium" href="/news">
            Read Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
