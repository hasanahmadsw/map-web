import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ServiceResponse } from "@/types/services.types"
import DivHtml from "@/components/shared/div-html"
import { ArrowRight } from "lucide-react"

interface ServiceCardProps {
  service: ServiceResponse
  className?: string
  lang: string
}

export function ServiceCard({ service, className, lang }: ServiceCardProps) {
  return (
    <Link 
      href={`/${lang}/services/${service.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-lg border border-border",
        "hover:shadow-md transition-all duration-200",
        "aspect-[16/10]",
        className
      )}
    >
      {/* Background Image */}
      {service.featuredImage && service.featuredImage.trim() !== "" ? (
        <Image
          src={service.featuredImage}
          alt={service.name || "Service image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={service.featuredImage.includes("supabase.co")}
        />
      ) : (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-muted-foreground text-4xl opacity-50">
            {service.icon || "🎬"}
          </div>
        </div>
      )}

      {/* Simple Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          
          {service.shortDescription && (
            <div className="text-sm text-white/90 line-clamp-2">
              <DivHtml html={service.shortDescription} />
            </div>
          )}

          {/* CTA Link */}
          <div className="flex items-center text-sm font-medium text-white pt-2 group-hover:text-primary transition-colors">
            <span>Learn More</span>
            <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

