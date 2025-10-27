"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useTransition } from "react";
import { Search } from "@/components/search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/translations-provider";
import type { Topic } from "@/types/topics.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortBy, SortOrder } from "@/types/common.types";
import { VariantToggle, ViewVariant } from "@/components/articles/public/variant-toggle";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

interface NewsControlsProps {
  topics: Topic[];
}

export function NewsControls({ topics }: NewsControlsProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // valid topic ids for guard (string form)
  const validTopicIds = useMemo(() => new Set(topics.map((c) => String(c.id))), [topics]);

  // derive all values from URL (single source of truth)
  const urlSearch = searchParams.get("search") ?? "";
  const urlTopicsRaw = searchParams.get("topics") ?? "all";
  const urlTopics = validTopicIds.has(urlTopicsRaw) ? urlTopicsRaw : "all";
  const sortByParam = searchParams.get("sortBy");
  const urlSortBy = sortByParam && (Object.values(SortBy) as string[]).includes(sortByParam) ? (sortByParam as SortBy) : undefined;
  const urlSortOrder = (searchParams.get("sortOrder") as SortOrder) || SortOrder.DESC;
  const urlVariant = (searchParams.get("variant") as ViewVariant) || ViewVariant.VERTICAL;

  // normalize URL if invalid topics sneaks in
  useEffect(() => {
    if (urlTopicsRaw !== urlTopics) {
      const next = new URLSearchParams(searchParams.toString());
      if (urlTopics === "all") next.delete("topics");
      else next.set("topics", urlTopics);
      startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTopicsRaw, urlTopics, pathname, router, searchParams]);

  // small helper to update params immutably and clean defaults
  const updateParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);

      // clean defaults
      if (!(next.get("search") ?? "").trim()) next.delete("search");
      if ((next.get("topics") ?? "all") === "all") next.delete("topics");
      if ((next.get("sortBy") as SortBy) === SortBy.CREATED_AT) next.delete("sortBy");
      if ((next.get("sortOrder") as SortOrder) === SortOrder.DESC) next.delete("sortOrder");
      if ((next.get("variant") as ViewVariant) === ViewVariant.VERTICAL) next.delete("variant");
      // reset page when filters change implicitly
      if (next.has("page")) next.delete("page");

      const qs = next.toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [searchParams, pathname, router],
  );

  // handlers → write directly to URL, UI re-derives from URL
  const onSearchChange = useCallback(
    (q: string) => {
      updateParams((p) => {
        const v = q.trim();
        if (v) p.set("search", v);
        else p.delete("search");
      });
    },
    [updateParams],
  );

  const onTopicsChange = useCallback(
    (topicId: string) => {
      const safe = validTopicIds.has(topicId) ? topicId : "all";
      updateParams((p) => {
        if (safe === "all") p.delete("topics");
        else p.set("topics", safe);
      });
    },
    [updateParams, validTopicIds],
  );

  const onSortByChange = useCallback(
    (value: string) => {
      const safe = Object.values(SortBy).includes(value as SortBy) ? (value as SortBy) : undefined;
      updateParams((p) => {
        if (!safe) p.delete("sortBy");
        else p.set("sortBy", safe);
      });
    },
    [updateParams],
  );

  const onSortOrderToggle = useCallback(() => {
    const next = urlSortOrder === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC;
    updateParams((p) => {
      if (next === SortOrder.DESC) p.delete("sortOrder");
      else p.set("sortOrder", next);
    });
  }, [urlSortOrder, updateParams]);

  const onVariantChange = useCallback(
    (variant: ViewVariant) => {
      updateParams((p) => {
        if (variant === ViewVariant.VERTICAL) p.delete("variant");
        else p.set("variant", variant);
      });
    },
    [updateParams],
  );

  // limit filter removed per request

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <Search
            placeholder={t.news.searchArticles}
            value={urlSearch}
            onChange={onSearchChange}
            isLoading={isPending}
          />
        </div>
      
        {/* Sort & Limit */}
        <div className="flex items-center gap-2">
          <Select value={urlSortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder={t.common.sortBy} /></SelectTrigger>
            <SelectContent>
              <SelectItem value={SortBy.CREATED_AT}>{t.common.createdAt}</SelectItem>
              <SelectItem value={SortBy.UPDATED_AT}>{t.common.updatedAt || "Updated At"}</SelectItem>
              <SelectItem value={SortBy.VIEW_COUNT}>{t.common.views || "Views"}</SelectItem>
              <SelectItem value={SortBy.NAME}>{t.common.name}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onSortOrderToggle} className="gap-2">
            {urlSortOrder === SortOrder.DESC ? (
              <>
                <ArrowDownAZ className="h-4 w-4" />
                <span>{t.common.orderDesc || "DESC"}</span>
              </>
            ) : (
              <>
                <ArrowUpAZ className="h-4 w-4" />
                <span>{t.common.orderAsc || "ASC"}</span>
              </>
            )}
          </Button>
          {/* Limit selector removed */}
        </div>
        
      </div>

      {/* Topics Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={urlTopics === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onTopicsChange("all")}
          aria-pressed={urlTopics === "all"}
        >
          {t.common.allTopics}
        </Button>
        {topics.map((topic) => (
          <Button
            key={topic.id}
            variant={urlTopics === String(topic.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onTopicsChange(String(topic.id))}
            aria-pressed={urlTopics === String(topic.id)}
            className="flex items-center gap-2"
          >
            <span>{topic.name}</span>
            <Badge variant="secondary" className="ml-1 pointer-events-none">
              {topic.articleCount}
            </Badge>
          </Button>
        ))}
      </div>
      
    </div>
  );
}
