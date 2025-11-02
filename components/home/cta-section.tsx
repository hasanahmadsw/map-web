import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Translations } from "@/utils/dictionary-utils"

interface CTASectionProps {
  lang: string
  t: Translations
}

export function CTASection({ lang, t }: CTASectionProps) {
  return (
    <section className="py-16">
      <div className="container max-w-6xl mx-auto">
        <div className="rounded-3xl bg-muted">
          <div className="px-10 py-12 md:px-26 md:py-20 space-y-10">
            {/* Top Section */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-medium">
                Get in Touch with Us
              </h2>
              <p className="text-base">
                Ready to start your next project? Contact us today and let's discuss how we can help you achieve your goals.
              </p>

              <div className="pt-4">
                <Link href={`/${lang}/contact`}>
                  <Button
                    size="lg"
                    className="px-8 py-6 text-base rounded-full"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Separator */}
            <Separator />

            {/* Bottom Section - Office Locations */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Our Offices
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Office */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">
                    Sharjah Office
                  </h4>
                  <p className="text-muted-foreground">
                    Sharjah, United Arab Emirates
                  </p>
                </div>

                {/* Second Office */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">
                    Dubai Office
                  </h4>
                  <p className="text-muted-foreground">
                    Dubai, United Arab Emirates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

