"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2, Settings, Star, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";
import type { StaffSolution } from "@/types/solutions.types";
import type { Lang } from "@/utils/dictionary-utils";

function formatDate(dateString: string, lang: Lang) {
  return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function useSolutionColumns(opts: {
  lang: Lang;
  onDelete: (solution: StaffSolution) => void;
}): ColumnDef<StaffSolution>[] {
  const { lang, onDelete } = opts;
  const { t } = useTranslation();
  const router = useRouter();
  const currentLang = useLang();
  const common = t.common || {};
  const solutions = t.solutions || {};

  const handleEdit = (solution: StaffSolution) => {
    router.push(`/${currentLang}/dashboard/solutions/${solution.id}`);
  };

  return [
    // Solution name
    {
      id: "name",
      header: solutions.solutionName || common.name || "Solution Name",
      accessorKey: "name",
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const solution = row.original;
        const translation = solution.translations?.[0];
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{translation?.name || solution.slug}</div>
              <div className="text-muted-foreground text-sm">ID: {solution.id}</div>
            </div>
          </div>
        );
      },
    },
    // Description
    {
      id: "description",
      header: solutions.description || "Description",
      enableSorting: false,
      cell: ({ row }) => {
        const solution = row.original;
        const translation = solution.translations?.[0];
        return (
          <div className="max-w-xs truncate text-sm text-muted-foreground">
            {translation?.shortDescription || translation?.description || ""}
          </div>
        );
      },
    },
    // Services count
    {
      id: "services",
      header: solutions.services || "Services",
      enableSorting: false,
      cell: ({ row }) => {
        const solution = row.original;
        const servicesCount = solution.services?.length || 0;
        return (
          <div className="text-sm text-muted-foreground">
            {servicesCount} {servicesCount === 1 ? "service" : "services"}
          </div>
        );
      },
    },
    // Order
    {
      id: "order",
      header: solutions.order || "Order",
      enableSorting: true,
      accessorKey: "order",
      cell: ({ row }) => (
        <div className="text-sm font-mono">{row.original.order || 0}</div>
      ),
    },
    // Status
    {
      id: "status",
      header: common.status || "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const solution = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={solution.isPublished ? "default" : "secondary"}>
              {solution.isPublished ? (common.published || "Published") : (common.draft || "Draft")}
            </Badge>
            {solution.isFeatured && (
              <Badge variant="outline" className="text-xs">
                <Star className="mr-1 h-3 w-3" />
                {solutions.featured || "Featured"}
              </Badge>
            )}
          </div>
        );
      },
    },
    // Created date
    {
      id: "createdAt",
      header: common.createdAt || "Created At",
      enableSorting: true,
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{formatDate(row.original.createdAt, lang)}</span>
        </div>
      ),
    },
    // Actions
    {
      id: "actions",
      header: typeof common.actions === "string" ? common.actions : "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const solution = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(solution)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                {common.edit || "Edit"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(solution)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                {common.delete || "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

