import type { Metadata } from "next"
import { servicesService } from "@/services/services.service"
import { getTranslations, type Lang } from "@/utils/dictionary-utils"
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta"
import { ServiceCard } from "@/components/home/service-card"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import Link from "next/link"

interface ServicesPageParams {
  params: Promise<{ lang: string }>
}

interface ServicesPageSearchParams {
  searchParams: Promise<{
    search?: string
    page?: string
    limit?: string
    isFeatured?: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
  searchParams,
}: ServicesPageParams & ServicesPageSearchParams): Promise<Metadata> {
  const { lang } = await params
  const { search, page } = await searchParams

  const t = await getTranslations(lang as Lang)
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!

  let title = t.services?.title || "Services"
  let description = t.services?.description || "Discover our professional media production and broadcasting services"

  if (search) {
    title = `${title} - Search: ${search}`
    description = `${description} - Search results for "${search}"`
  }

  const pageNum = page ? Number(page) : 1
  if (pageNum > 1) {
    title = `${title} - Page ${pageNum}`
  }

  const metadata = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: title },
    description,
    type: "website",
    pathname: "/services",
    openGraphOverrides: {
      type: "website",
      title,
      description,
      url: `${siteURL}/${lang}/services`,
    },
    twitterOverrides: {
      card: "summary_large_image",
      title,
      description,
    },
  })

  return metadata
}

export default async function ServicesPage({ params, searchParams }: ServicesPageParams & ServicesPageSearchParams) {
  const { lang } = await params
  const { search, page, limit, isFeatured } = await searchParams

  const pageNum = page ? Number(page) : 1
  const limitNum = limit ? Number(limit) : 12

  const services = await servicesService.getAll({
    lang,
    search: search || "",
    page: pageNum,
    limit: limitNum,
    isPublished: true,
    isFeatured: isFeatured === "true" ? true : undefined,
  })

  const t = await getTranslations(lang as Lang)
  const servicesData = services.data || []
  const totalPages = services.pagination?.totalPages || 1
  const totalServices = services.pagination?.total || 0

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (isFeatured === "true") params.set("isFeatured", "true")
    if (page > 1) params.set("page", String(page))
    const queryString = params.toString()
    return queryString ? `?${queryString}` : ""
  }

  return (
    <div className="container max-w-7xl py-10 mx-auto">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="max-w-2xl text-3xl font-medium mb-3">
            {t.services?.title || "Our Services"}
          </h1>
          <p className="max-w-2xl text-muted-foreground pb-6">
            {t.services?.description || "Professional media production and broadcasting services tailored to your needs"}
          </p>
        </div>

        {/* Services Grid */}
        {servicesData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {search ? `No services found for "${search}"` : "No services found"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData.map((service) => (
                <ServiceCard key={service.id} service={service} lang={lang} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      {pageNum > 1 ? (
                        <Link href={createPageUrl(pageNum - 1)}>
                          <PaginationPrevious className="glass-button rounded-full px-4 py-2">Previous</PaginationPrevious>
                        </Link>
                      ) : (
                        <PaginationPrevious aria-disabled className="opacity-50 cursor-not-allowed rounded-full px-4 py-2">Previous</PaginationPrevious>
                      )}
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                      const pageNumber = idx + 1
                      return (
                        <PaginationItem key={pageNumber}>
                          <Link href={createPageUrl(pageNumber)}>
                            <PaginationLink 
                              isActive={pageNumber === pageNum}
                              className={pageNumber === pageNum 
                                ? "glass-button rounded-full px-4 py-2 bg-primary/20 border-primary/30" 
                                : "glass-button rounded-full px-4 py-2"
                              }
                            >
                              {pageNumber}
                            </PaginationLink>
                          </Link>
                        </PaginationItem>
                      )
                    })}
                    <PaginationItem>
                      {pageNum < totalPages ? (
                        <Link href={createPageUrl(pageNum + 1)}>
                          <PaginationNext className="glass-button rounded-full px-4 py-2">Next</PaginationNext>
                        </Link>
                      ) : (
                        <PaginationNext aria-disabled className="opacity-50 cursor-not-allowed rounded-full px-4 py-2">Next</PaginationNext>
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

