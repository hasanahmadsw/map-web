import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { servicesService } from "@/services/services.service"
import { getTranslations, Lang } from "@/utils/dictionary-utils"
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta"
import Image from "next/image"
import DivHtml from "@/components/shared/div-html"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import type { SubService } from "@/types/services.types"

interface ServicePageProps {
  params: Promise<{
    slug: string
    lang: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug, lang } = await params
  const service = await servicesService.getBySlug(slug, lang as Lang)
  
  if (!service) {
    notFound()
  }

  const t = await getTranslations(lang as Lang)
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!

  const keywords = [
    service.name,
    ...(service.meta?.keywords || []),
    "media production",
    "broadcasting",
    "services",
  ].filter(Boolean)

  const metadata = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: service.name },
    description: service.shortDescription || service.meta?.description || `${service.name} - Professional media production service`,
    type: "website",
    keywords,
    pathname: `/services/${service.slug}`,
    image: service.featuredImage || undefined,
    openGraphOverrides: {
      type: "website",
      title: service.name,
      description: service.shortDescription || service.meta?.description || "",
      url: `${siteURL}/${lang}/services/${service.slug}`,
      images: service.featuredImage ? [{ url: service.featuredImage }] : undefined,
    },
    twitterOverrides: {
      card: "summary_large_image",
      title: service.name,
      description: service.shortDescription || service.meta?.description || "",
    },
  })

  return metadata
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug, lang } = await params
  const t = await getTranslations(lang as Lang)
  const service = await servicesService.getBySlug(slug, lang as Lang)

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {service.featuredImage && service.featuredImage.trim() !== "" ? (
          <>
            <Image
              src={service.featuredImage}
              alt={service.name}
              fill
              className="object-cover"
              priority
              unoptimized={service.featuredImage.includes("supabase.co")}
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
              href={`/${lang}/services`}
              className={cn(buttonVariants({ variant: "ghost" }), "text-white hover:text-white hover:bg-white/10 w-fit")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
            
            {service.isFeatured && (
              <Badge variant="default" className="text-sm font-medium">
                Featured Service
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-semibold text-white max-w-3xl">
              {service.name}
            </h1>
            
            {service.shortDescription && (
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {service.shortDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background max-w-7xl mx-auto">
        {/* Description Section */}
        {service.description && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">About This Service</h2>
              <div className="max-w-4xl text-muted-foreground leading-relaxed">
                <DivHtml html={service.description} />
              </div>
            </div>
          </section>
        )}

        {/* Sub Services Section */}
        {service.subServices && service.subServices.length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">
                Sub Services
              </h2>
              <p className="max-w-2xl text-muted-foreground pb-6">
                Detailed breakdown of services included in this offering
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.subServices.map((subService: SubService, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {subService.icon && (
                        <div className="flex-shrink-0 text-3xl text-muted-foreground opacity-70">
                          {subService.icon}
                        </div>
                      )}
                      <h3 className="text-xl font-semibold">{subService.title}</h3>
                    </div>
                    
                    {subService.description && (
                      <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                        {subService.description}
                      </p>
                    )}
                    
                    {subService.features && subService.features.length > 0 && (
                      <ul className="space-y-2">
                        {subService.features.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="container max-w-7xl py-10">
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-medium">
              Interested in This Service?
            </h2>
            <p className="text-muted-foreground">
              Contact us to learn more about this service and how it can help your media production and broadcasting needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
                href={`/${lang}/contact`}
              >
                Contact Us
              </Link>
              <Link
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}
                href={`/${lang}/services`}
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

