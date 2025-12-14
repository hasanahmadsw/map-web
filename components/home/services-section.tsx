import Image from "next/image"
import { servicesService } from "@/services/services.service"
import { ServiceCard } from "./service-card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Translations } from "@/utils/dictionary-utils"

interface ServicesSectionProps {
  lang: string
  t: Translations
}

export async function ServicesSection({ lang, t }: ServicesSectionProps) {
  // Fetch services directly from API
  let servicesResponse
  try {
    servicesResponse = await servicesService.getAll({
      limit: 6,
      isPublished: true,
      isFeatured: true,
    })
    
    // If no featured services, get regular published services
    if (!servicesResponse.data || servicesResponse.data.length === 0) {
      servicesResponse = await servicesService.getAll({
        limit: 6,
        isPublished: true,
      })
    }
  } catch (error) {
    // If there's an error with featured, try regular published services
    try {
      servicesResponse = await servicesService.getAll({
        limit: 6,
        isPublished: true,
      })
    } catch (fallbackError) {
      // If both fail, return empty array - section won't render
      servicesResponse = { data: [] }
    }
  }

  const services = servicesResponse?.data || []

  if (services.length === 0) {
    return null
  }

  return (
    <section className="relative w-full py-16 overflow-hidden">


      {/* Content */}
      <div className="container max-w-7xl px-6 md:px-0 relative z-10">
        <div className="space-y-4">
          <h2 className="max-w-2xl text-3xl font-medium">
            {t.services?.title}
          </h2>
          <p className="max-w-2xl text-muted-foreground pb-6">
            {t.services?.description}
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} lang={lang} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              className={cn("glass-button rounded-full px-8 py-4 cursor-pointer text-base font-medium")}
              href={`/${lang}/services`}
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4 inline" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

