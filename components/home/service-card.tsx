import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ServiceResponse } from "@/types/services.types"
import DivHtml from "@/components/shared/div-html"
import { ArrowRight } from "lucide-react"
import { renderIcon } from "@/utils/icon-resolver"

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
        "group relative block overflow-hidden rounded-xl glass-card p-6",
        "flex flex-col min-h-[280px]",
        className
      )}
    >
      {/* Subtle Background Pattern/Image */}
      {service.featuredImage && service.featuredImage.trim() !== "" ? (
        <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
          <Image
            src={service.featuredImage}
            alt={service.name || "Service image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            unoptimized={service.featuredImage.includes("supabase.co")}
          />
        </div>
      ) : null}

      {/* Glass Content Panel */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 backdrop-blur-sm">
            {renderIcon(service.icon, { size: 24, fallback: "Video" })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {service.name}
          </h3>
          
          {service.shortDescription && (
            <div className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
              <DivHtml html={service.shortDescription} />
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center text-sm font-medium text-primary mt-auto pt-4 border-t border-border/50">
            <span>Learn More</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

