'use client';

import * as React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  Table as ReactTable,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Search,
  X,
  Settings2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SkeletonTable from '@/components/shared/table/skeleton-table';
import ApiError from '@/components/shared/api-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Types ---

type DataTableMessages = {
  searchPlaceholder?: string;
  columns?: string;
  noData?: string;
};

interface DataTableContextValue<TData> {
  table: ReactTable<TData>;
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
  messages?: DataTableMessages;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

const DataTableContext = React.createContext<DataTableContextValue<any> | null>(null);

function useDataTable() {
  const context = React.useContext(DataTableContext);
  if (!context) throw new Error('DataTable components must be used within <DataTable />');
  return context;
}

// --- Main Root Component ---

interface DataTableRootProps<TData> {
  children: React.ReactNode;
  tableId?: string;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
  messages?: DataTableMessages;
  // Pagination
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;

  // Logic
  manualFiltering?: boolean;
  onGlobalFilterChange?: (val: string) => void;
  initialGlobalFilter?: string;
}

export function DataTableRoot<TData>({
  children,
  tableId,
  columns,
  data,
  isLoading,
  error,
  refetch,
  messages,
  pageSize,
  onPageSizeChange,
  manualFiltering = true,
  onGlobalFilterChange,
  initialGlobalFilter = '',
}: DataTableRootProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState(initialGlobalFilter);

  // ====== LocalStorage persistence for column visibility & pageSize ======
  const storageKey = tableId ? `dt:${tableId}` : undefined;
  const hasInitializedRef = React.useRef(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    if (!storageKey || hasInitializedRef.current) return;

    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.columnVisibility) {
        setColumnVisibility(parsed.columnVisibility);
      }
    }
    hasInitializedRef.current = true;
  }, [storageKey]);

  // Save to localStorage whenever pageSize or columnVisibility changes (after initialization)
  React.useEffect(() => {
    if (!storageKey || !hasInitializedRef.current) return;
    localStorage.setItem(storageKey, JSON.stringify({ columnVisibility }));
  }, [storageKey, columnVisibility]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: val => {
      setGlobalFilter(val);
      onGlobalFilterChange?.(val);
    },
    manualPagination: true,
    manualFiltering,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const contextValue = React.useMemo(
    () => ({
      table,
      isLoading,
      error,
      refetch,
      messages,
      pageSize,
      onPageSizeChange,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, isLoading, error, messages, refetch, pageSize, onPageSizeChange, columnVisibility],
  ) as DataTableContextValue<TData>;

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className="w-full space-y-3">{children}</div>
    </DataTableContext.Provider>
  );
}

// --- Sub-Components ---

// 1. Search Component
function DataTableSearch({ className }: { className?: string }) {
  const { table, messages } = useDataTable();
  const value = (table.getState().globalFilter as string) ?? '';

  return (
    <div className={clsx('relative w-full max-w-sm', className)}>
      <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder={messages?.searchPlaceholder ?? 'Search...'}
        value={value}
        onChange={e => table.setGlobalFilter(e.target.value)}
        className="ps-10 pe-10 focus-visible:ring-1"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute end-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={() => table.setGlobalFilter('')}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

// 2. Toolbar Component (Wrapper)
function DataTableToolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('flex flex-wrap items-center justify-between gap-2', className)}>{children}</div>
  );
}

// 3. Column Toggle Component
function DataTableColumnToggle() {
  const { table } = useDataTable();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex h-9 gap-2">
          <Settings2 className="h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-72 w-48 overflow-y-auto">
        {table
          .getAllLeafColumns()
          .filter((col: any) => col.getCanHide())
          .map((col: any) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className="capitalize"
              checked={col.getIsVisible()}
              onCheckedChange={v => col.toggleVisibility(!!v)}
            >
              {String(col.columnDef.header ?? col.id)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 4. Main Table Content
function DataTableContent({ stickyHeader, compact }: { stickyHeader?: boolean; compact?: boolean }) {
  const { table, isLoading, error, refetch, messages } = useDataTable();
  const headers = table.getHeaderGroups()[0]?.headers ?? [];

  if (isLoading) return <SkeletonTable colCount={headers.length || 5} />;

  if (error)
    return (
      <div className="rounded-md border p-8">
        <ApiError errorMessage={error.message} refetchFunction={refetch} />
      </div>
    );

  return (
    <div className={clsx('relative max-w-full overflow-x-auto', stickyHeader && 'pb-1')}>
      <Table className={clsx(compact && '[&_td]:py-2 [&_th]:py-2')}>
        <TableHeader
          className={clsx(
            stickyHeader &&
              'bg-background/95 supports-backdrop-filter:bg-background/60 [&_th]:bg-background backdrop-blur [&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:shadow-[0_1px_0_0_hsl(var(--border))]',
          )}
        >
          <TableRow>
            {headers.map((h: any) => (
              <TableHead
                key={h.id}
                className={clsx('cursor-pointer select-none', stickyHeader && 'bg-background')}
                onClick={() => h.column.toggleSorting()}
              >
                <div className="flex items-center gap-1">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getIsSorted() === 'asc' ? ' ▲' : h.column.getIsSorted() === 'desc' ? ' ▼' : ''}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-muted-foreground h-24 text-center">
                {messages?.noData ?? 'No results found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// 5. PageSize Selector
function DataTablePageSize({ pageSizeOptions = [10, 20, 50, 100] }: { pageSizeOptions?: number[] }) {
  const { pageSize, onPageSizeChange } = useDataTable();

  if (!pageSize || !onPageSizeChange) return null;

  return (
    <Select value={pageSize.toString()} onValueChange={v => onPageSizeChange(Number(v))}>
      <SelectTrigger className="h-9 w-[70px]">
        <SelectValue placeholder={pageSize} />
      </SelectTrigger>
      <SelectContent>
        {pageSizeOptions.map(option => (
          <SelectItem key={option} value={option.toString()}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// 6. Pagination Component
function DataTablePagination({
  onPageChange,
  pageIndex,
  totalRows,
}: {
  onPageChange: (page: number) => void;
  pageIndex: number;
  totalRows: number;
  isLoading: boolean;
}) {
  const { pageSize, isLoading } = useDataTable();

  if (!pageSize) return null;

  const totalPages = Math.ceil(totalRows / pageSize) || 1;
  const canNextPage = pageIndex < totalPages;
  const canPrevPage = pageIndex > 1;

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="text-muted-foreground text-sm">
        Total <b>{totalRows}</b> items | Page <b>{pageIndex}</b> of <b>{totalPages}</b>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={!canPrevPage}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPrevPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!canNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        {isLoading && <Loader2 className="text-primary h-4 w-4 animate-spin" />}
      </div>
    </div>
  );
}

// --- Exporting everything as a Single Object ---
export const DataTable = Object.assign(DataTableRoot, {
  Search: DataTableSearch,
  Toolbar: DataTableToolbar,
  ColumnToggle: DataTableColumnToggle,
  Content: DataTableContent,
  Pagination: DataTablePagination,
  PageSize: DataTablePageSize,
});
