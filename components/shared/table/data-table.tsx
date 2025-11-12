"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SkeletonTable from "./skeleton-table";
import ApiError from "@/components/shared/api-error";
import { useTranslation } from "@/providers/translations-provider";
import { getDirection, isRTL, Lang } from "@/utils/dictionary-utils";

type DataTableMessages = {
  searchPlaceholder?: string;
  columns?: string;
  page?: string;
  of?: string;
  total?: string;
  noData?: string;
};

type DataTableProps<TData, TValue> = {
  tableId?: string; // To save column preferences and sometimes pageSize
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  // Loading/Error
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
  emptyMessage?: string;
  emptyState?: React.ReactNode;

  // Server-side pagination
  pageIndex: number; // 1-based externally
  pageSize: number;
  totalRows: number;
  totalPages: number;
  canNextPage: boolean;
  canPrevPage: boolean;
  onPageChange: (page: number) => void; // 1-based
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];

  // Optional client-side features (only on this page)
  enableClientSorting?: boolean; // default true
  enableGlobalFilter?: boolean; // default false
  onGlobalFilterChange?: (value: string) => void; // For server-side search
  initialGlobalFilter?: string; // Initial value for global filter
  manualFiltering?: boolean; // default false - enables server-side filtering

  // Selection / Row click
  enableRowSelection?: boolean;
  onSelectionChange?: (rows: TData[]) => void;
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData, index: number) => string;

  // Toolbar slots
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;

  // UI
  compact?: boolean; // Row density
  stickyHeader?: boolean; // Makes the header sticky
  className?: string;
  messages?: DataTableMessages;
  lang: Lang;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500, 1000];

export function DataTable<TData, TValue>({
  tableId,
  columns,
  data,
  isLoading,
  error,
  refetch,
  emptyMessage = "No data.",
  emptyState,
  pageIndex,
  pageSize,
  totalRows,
  totalPages,
  canNextPage,
  canPrevPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  enableClientSorting = true,
  enableGlobalFilter = false,
  onGlobalFilterChange,
  initialGlobalFilter = "",
  manualFiltering = false,
  enableRowSelection = false,
  onSelectionChange,
  onRowClick,
  getRowId,
  toolbarLeft,
  toolbarRight,
  compact = false,
  stickyHeader = false,
  className,
  messages,
  lang,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState(initialGlobalFilter);

  const isRTLDir = isRTL(lang);
  const { t: translations } = useTranslation();

  // ====== LocalStorage persistence for column visibility & pageSize ======
  const storageKey = tableId ? `dt:${tableId}` : undefined;
  React.useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.columnVisibility) setColumnVisibility(parsed.columnVisibility);
        if (parsed.pageSize && pageSizeOptions.includes(parsed.pageSize)) {
          onPageSizeChange(parsed.pageSize);
        }
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  React.useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ columnVisibility, pageSize }));
    } catch {
      /* ignore */
    }
  }, [storageKey, columnVisibility, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true, // server-side
    manualFiltering, // server-side filtering
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableClientSorting ? getSortedRowModel() : undefined,
    enableRowSelection,
  });

  React.useEffect(() => {
    if (!onSelectionChange) return;
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);
    onSelectionChange(selected);
  }, [rowSelection, table, onSelectionChange]);

  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const t = {
    searchPlaceholder: translations.common.search,
    columns: translations.common.columns,
    page: translations.common.page,
    of: translations.common.of,
    total: translations.common.total,
    noData: emptyMessage,
    ...messages,
  };

  return (
    <div className={clsx("space-y-3", className)} dir={getDirection(lang)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {toolbarLeft ??
          (enableGlobalFilter && (
            <div className="relative">
              <div className="absolute start-4 top-1/2 z-10 -translate-y-1/2">
                <Search className="text-muted-foreground h-4 w-4" />
              </div>
              <Input
                placeholder={t.searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setGlobalFilter(value);
                  onGlobalFilterChange?.(value);
                }}
                className="focus-visible:ring-primary/40 ps-12 pe-10 transition-all duration-200 focus-visible:ring-1"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute end-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => {
                    setGlobalFilter("");
                    onGlobalFilterChange?.("");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}

        <div className="ml-auto flex items-center gap-2">
          {toolbarRight}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {t.columns}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 w-56 overflow-auto">
              {table.getAllLeafColumns().map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(Boolean(v))}
                >
                  {String(col.columnDef.header ?? col.id)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            value={pageSize.toString()}
            onValueChange={(value: string) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className={clsx("relative max-w-full overflow-x-auto", stickyHeader && "pb-1")}>
        <Table className={clsx(compact && "[&_td]:py-1.5 [&_th]:py-1.5")}>
          <TableHeader
            className={clsx(
              stickyHeader &&
                "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 backdrop-blur",
            )}
          >
            <TableRow>
              {headers.map((h) => (
                <TableHead
                  key={h.id}
                  className={clsx(
                    "text-start select-none",
                    enableClientSorting && h.column.getCanSort?.() && "cursor-pointer",
                  )}
                  onClick={() => {
                    if (!enableClientSorting) return;
                    const canSort = h.column.getCanSort?.();
                    if (canSort) {
                      h.column.toggleSorting(h.column.getIsSorted() === "asc");
                    }
                  }}
                >
                  <div className="inline-flex items-center gap-1">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {enableClientSorting && h.column.getCanSort?.() ? (
                      <span className="text-muted-foreground text-xs">
                        {h.column.getIsSorted() === "asc"
                          ? "▲"
                          : h.column.getIsSorted() === "desc"
                            ? "▼"
                            : ""}
                      </span>
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable colCount={headers.length || 1} />
            ) : error ? (
              <TableRow>
                <TableCell colSpan={headers.length || 1} className="hover:bg-background !p-0 !py-8">
                  <ApiError errorMessage={error.message} refetchFunction={refetch} />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={headers.length || 1} className="text-muted-foreground !py-8 text-center">
                  {emptyState ?? t.noData}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (server-side) */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-muted-foreground text-sm">
          {totalRows ? (
            <>
              {t.page} <b>{pageIndex}</b> {t.of} <b>{totalPages}</b> • {t.total} <b>{totalRows}</b>
            </>
          ) : (
            <>&nbsp;</>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={!canPrevPage}>
            <ChevronsLeft className={`h-4 w-4 ${isRTLDir ? "rotate-180" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPrevPage}
          >
            <ChevronLeft className={`h-4 w-4 ${isRTLDir ? "rotate-180" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            <ChevronRight className={`h-4 w-4 ${isRTLDir ? "rotate-180" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!canNextPage}
          >
            <ChevronsRight className={`h-4 w-4 ${isRTLDir ? "rotate-180" : ""}`} />
          </Button>
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </div>
      </div>
    </div>
  );
}
