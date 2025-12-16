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
  priority?: boolean
}

// Generate a lightweight blur data URL for placeholder (optimized SVG)
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#f0f0f0"/>
  <rect width="${w}" height="${h}" fill="url(#grad)" opacity="0.5">
    <animate attributeName="x" from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <defs>
    <linearGradient id="grad">
      <stop offset="0%" stop-color="#f0f0f0"/>
      <stop offset="50%" stop-color="#e0e0e0"/>
      <stop offset="100%" stop-color="#f0f0f0"/>
    </linearGradient>
  </defs>
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`

export function ServiceCard({ service, className, lang, priority = false }: ServiceCardProps) {
  // Pre-compute values to avoid repeated calculations
  const hasImage = Boolean(service.featuredImage?.trim())
  const isSupabaseImage = hasImage && service.featuredImage.includes("supabase.co")

  return (
    <Link 
      href={`/${lang}/services/${service.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl glass-card",
        "flex flex-col",
        className
      )}
    >
      {/* Image at Top */}
      {hasImage ? (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={service.featuredImage}
            alt={service.name || "Service image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 will-change-transform"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            placeholder="blur"
            blurDataURL={blurDataURL}
            unoptimized={isSupabaseImage}
          />
        </div>
      ) : (
        <div className="relative w-full h-48 overflow-hidden bg-muted flex items-center justify-center">
          <div className="text-muted-foreground opacity-50">
            {renderIcon(service.icon, { size: 48, fallback: "Video" })}
          </div>
        </div>
      )}

      {/* Content Below Image */}
      <div className="p-6 flex flex-col flex-1">
        {/* Icon */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
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
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 will-change-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

