import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { solutionsService } from "@/services/solutions.service"
import { getTranslations, Lang } from "@/utils/dictionary-utils"
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta"
import Image from "next/image"
import DivHtml from "@/components/shared/div-html"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ServiceCard } from "@/components/home/service-card"
import type { ServiceResponse } from "@/types/services.types"

interface SolutionPageProps {
  params: Promise<{
    slug: string
    lang: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug, lang } = await params
  const solution = await solutionsService.getBySlug(slug, lang as Lang)
  
  if (!solution) {
    notFound()
  }

  const t = await getTranslations(lang as Lang)
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!

  const keywords = [
    solution.name,
    ...(solution.meta?.keywords || []),
    "media production",
    "broadcasting",
    "solutions",
  ].filter(Boolean)

  const metadata = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: solution.name },
    description: solution.shortDescription || solution.meta?.description || `${solution.name} - Professional media production solution`,
    type: "website",
    keywords,
    pathname: `/solutions/${solution.slug}`,
    image: solution.featuredImage || undefined,
    openGraphOverrides: {
      type: "website",
      title: solution.name,
      description: solution.shortDescription || solution.meta?.description || "",
      url: `${siteURL}/${lang}/solutions/${solution.slug}`,
      images: solution.featuredImage ? [{ url: solution.featuredImage }] : undefined,
    },
    twitterOverrides: {
      card: "summary_large_image",
      title: solution.name,
      description: solution.shortDescription || solution.meta?.description || "",
    },
  })

  return metadata
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug, lang } = await params
  const t = await getTranslations(lang as Lang)
  const solution = await solutionsService.getBySlug(slug, lang as Lang)

  if (!solution) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background ">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {solution.featuredImage ? (
          <>
            <Image
              src={solution.featuredImage}
              alt={solution.name}
              fill
              className="object-cover"
              priority
              unoptimized={solution.featuredImage.includes("supabase.co")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end container max-w-7xl py-10 mx-auto">
          <div className="space-y-4">
            <Link
              href={`/${lang}/solutions`}
              className="glass-button text-white hover:text-white w-fit px-4 py-2 rounded-full flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Solutions
            </Link>
            
            {solution.isFeatured && (
              <Badge variant="default" className="text-sm font-medium">
                Featured Solution
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-semibold text-white max-w-3xl">
              {solution.name}
            </h1>
            
            {solution.shortDescription && (
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {solution.shortDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background max-w-7xl mx-auto">
        {/* Description Section */}
        {solution.description && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">About This Solution</h2>
              <div className="max-w-4xl text-muted-foreground leading-relaxed">
                <DivHtml html={solution.description} />
              </div>
            </div>
          </section>
        )}

        {/* Services Section */}
        {solution.services && solution.services.length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">
                {t.services?.title || "Our Services"}
              </h2>
              <p className="max-w-2xl text-muted-foreground pb-6">
                {t.services?.description || "Comprehensive services included in this solution to meet your media production and broadcasting needs"}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solution.services.map((service: ServiceResponse) => (
                  <ServiceCard key={service.id} service={service} lang={lang} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="container max-w-7xl py-10">
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-medium">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground">
              Contact us to learn more about this solution and how it can help transform your media production and broadcasting needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className="glass-button px-8 py-4 cursor-pointer text-base rounded-full font-medium"
                href={`/${lang}/contact`}
              >
                Contact Us
              </Link>
              <Link
                className="glass-button px-8 py-4 cursor-pointer text-base rounded-full font-medium"
                href={`/${lang}/solutions`}
              >
                View All Solutions
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

