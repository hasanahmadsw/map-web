import type { Metadata } from "next"
import { solutionsService } from "@/services/solutions.service"
import { getTranslations, sanitizeLang, type Lang } from "@/utils/dictionary-utils"
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta"
import { SolutionCard } from "@/components/home/solution-card"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import Link from "next/link"

interface SolutionsPageParams {
  params: Promise<{ lang: string }>
}

interface SolutionsPageSearchParams {
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
}: SolutionsPageParams & SolutionsPageSearchParams): Promise<Metadata> {
  const { lang: rawLang } = await params
  const { search, page } = await searchParams
  const lang = sanitizeLang(rawLang)

  const t = await getTranslations(lang)
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!

  let title = t.solutions?.title || "Solutions"
  let description = t.solutions?.description || "Discover our professional media production and broadcasting solutions"

  if (search) {
    title = `${title} - Search: ${search}`
    description = `${description} - Search results for "${search}"`
  }

  const pageNum = page ? Number(page) : 1
  if (pageNum > 1) {
    title = `${title} - Page ${pageNum}`
  }

  const metadata = createEnhancedMetadata({
    lang,
    title: { absolute: title },
    description,
    type: "website",
    pathname: "/solutions",
    openGraphOverrides: {
      type: "website",
      title,
      description,
      url: `${siteURL}/${lang}/solutions`,
    },
    twitterOverrides: {
      card: "summary_large_image",
      title,
      description,
    },
  })

  return metadata
}

export default async function SolutionsPage({ params, searchParams }: SolutionsPageParams & SolutionsPageSearchParams) {
  const { lang: rawLang } = await params
  const { search, page, limit, isFeatured } = await searchParams
  const lang = sanitizeLang(rawLang)

  const pageNum = page ? Number(page) : 1
  const limitNum = limit ? Number(limit) : 12

  const solutions = await solutionsService.getAll({
    lang,
    search: search || "",
    page: pageNum,
    limit: limitNum,
    isPublished: true,
    isFeatured: isFeatured === "true" ? true : undefined,
  })

  console.log(solutions)

  const t = await getTranslations(lang)
  const solutionsData = solutions.data || []
  const totalPages = solutions.pagination?.totalPages || 1
  const totalSolutions = solutions.pagination?.total || 0

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
            {t.solutions?.title || "Our Solutions"}
          </h1>
          <p className="max-w-2xl text-muted-foreground pb-6">
            {t.solutions?.description || "Professional media production and broadcasting solutions tailored to your needs"}
          </p>
        </div>

        {/* Solutions Grid */}
        {solutionsData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {search ? `No solutions found for "${search}"` : "No solutions found"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutionsData.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} lang={lang} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {pageNum > 1 ? (
                        <Link href={createPageUrl(pageNum - 1)}>
                          <PaginationPrevious>Previous</PaginationPrevious>
                        </Link>
                      ) : (
                        <PaginationPrevious aria-disabled>Previous</PaginationPrevious>
                      )}
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                      const pageNumber = idx + 1
                      return (
                        <PaginationItem key={pageNumber}>
                          <Link href={createPageUrl(pageNumber)}>
                            <PaginationLink isActive={pageNumber === pageNum}>
                              {pageNumber}
                            </PaginationLink>
                          </Link>
                        </PaginationItem>
                      )
                    })}
                    <PaginationItem>
                      {pageNum < totalPages ? (
                        <Link href={createPageUrl(pageNum + 1)}>
                          <PaginationNext>Next</PaginationNext>
                        </Link>
                      ) : (
                        <PaginationNext aria-disabled>Next</PaginationNext>
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

