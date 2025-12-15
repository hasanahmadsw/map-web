'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import TableNavigationFooter from '@/components/shared/table/table-footer';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/providers/translations-provider';
import { ConfirmationDialog } from '@/components/confirmation-dialog';

// Types
export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableAction<T = any> {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: (item: T) => void;
  href?: (item: T) => string;
  variant?: 'default' | 'destructive';
  disabled?: (item: T) => boolean;
}

export interface PaginationData {
  currentPage: number;
  total: number;
  limit: number;
  totalPages: number;
}

export interface DataTableProps<T = any> {
  // Data
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];

  // Selection
  selectable?: boolean;
  onSelectionChange?: (selectedIds: number[]) => void;
  getItemId: (item: T) => number;

  // Entity
  entityName: string;

  // Pagination
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;

  // States
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  isDeleting?: boolean;

  // UI
  emptyStateIcon?: ReactNode;
  emptyStateMessage?: string;
  errorMessage?: string;
  loadingRows?: number;

  // Header actions
  headerActions?: ReactNode;

  // Confirmation
  deleteConfirmationMessage?: string;
  onDelete?: (id: number) => void;
}

export function DataTable<T = any>({
  data,
  columns,
  actions = [],
  selectable = true,
  onSelectionChange,
  getItemId,
  entityName,
  pagination,
  onPageChange,
  onPrevious,
  onNext,
  onFirstPage,
  onLastPage,
  isLoading = false,
  isError = false,
  error,
  isDeleting = false,
  emptyStateIcon,
  emptyStateMessage,
  errorMessage,
  loadingRows = 5,
  headerActions,
  onDelete,
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { t } = useTranslation();

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  const handleSelectItem = (itemId: number) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === safeData.length) {
      setSelectedItems([]);
      onSelectionChange?.([]);
    } else {
      const allIds = safeData.map(getItemId);
      setSelectedItems(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const handleDeleteClick = (itemId: number) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete === null) return;

    try {
      await onDelete?.(itemToDelete);
      setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const renderLoadingSkeleton = () => {
    // Fixed widths to prevent hydration mismatch
    const skeletonWidths = ['w-24', 'w-32', 'w-20', 'w-28', 'w-16', 'w-36', 'w-22', 'w-30'];

    return Array.from({ length: loadingRows }).map((_, i) => (
      <TableRow key={i}>
        {selectable && (
          <TableCell>
            <input
              type="checkbox"
              checked={false}
              disabled
              className="rounded border-gray-300 opacity-50"
              aria-label="Loading"
              readOnly
            />
          </TableCell>
        )}
        {columns.map((column, colIndex) => (
          <TableCell key={colIndex}>
            <div
              className={`bg-muted h-4 animate-pulse rounded ${skeletonWidths[colIndex % skeletonWidths.length]}`}
            />
          </TableCell>
        ))}
        {actions.length > 0 && (
          <TableCell>
            <div className="bg-muted h-8 w-8 animate-pulse rounded" />
          </TableCell>
        )}
      </TableRow>
    ));
  };

  const renderEmptyState = () => (
    <TableRow key="empty-state">
      <TableCell
        colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
        className="py-8 text-center"
      >
        <div className="flex flex-col items-center space-y-2">
          {emptyStateIcon}
          <p className="text-muted-foreground">{emptyStateMessage || 'No data found'}</p>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderActions = (item: T) => {
    if (actions.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{'Actions'}</DropdownMenuLabel>
          {actions.map((action, index) => {
            const isDisabled = action.disabled?.(item) || false;
            const isDeleteAction = action.variant === 'destructive';

            if (action.href) {
              return (
                <DropdownMenuItem key={action.key} asChild disabled={isDisabled}>
                  <Link href={action.href(item)}>
                    {action.icon}
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={action.key}
                className={isDeleteAction ? 'text-destructive' : ''}
                onClick={() => {
                  if (isDeleteAction && onDelete) {
                    handleDeleteClick(getItemId(item));
                  } else {
                    action.onClick?.(item);
                  }
                }}
                disabled={isDisabled || (isDeleteAction && isDeleting)}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isError) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{errorMessage || 'Failed to load data'}</p>
          {error && <p className="text-muted-foreground text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      {headerActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">{/* Search can be added here */}</div>
          {headerActions}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === safeData.length && safeData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
              )}
              {columns.map(column => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? renderLoadingSkeleton()
              : safeData.length === 0
                ? renderEmptyState()
                : safeData.map(item => (
                    <TableRow key={getItemId(item)}>
                      {selectable && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(getItemId(item))}
                            onChange={() => handleSelectItem(getItemId(item))}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                      )}
                      {columns.map(column => (
                        <TableCell key={column.key} className={column.className}>
                          {column.render ? column.render(item) : (item as any)[column.key]}
                        </TableCell>
                      ))}
                      {actions.length > 0 && <TableCell>{renderActions(item)}</TableCell>}
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>

      {/* Navigation Footer */}
      {pagination && (
        <TableNavigationFooter
          selectedCount={selectedItems.length}
          totalCount={pagination.total}
          onPrevious={onPrevious || (() => {})}
          onNext={onNext || (() => {})}
          canPrevious={pagination.currentPage > 1}
          canNext={pagination.currentPage < pagination.totalPages}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          itemsPerPage={pagination.limit}
          onFirstPage={onFirstPage}
          onLastPage={onLastPage}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t.common.confirmDeleteArticle?.replace(/\{\{entity\}\}/g, entityName) || 'Confirm Delete'}
        description={
          t.validation.confirmDeleteArticle?.replace(/\{\{entity\}\}/g, entityName) ||
          `Are you sure you want to delete this ${entityName}? This action cannot be undone.`
        }
        confirmText={t.common.delete || 'Delete'}
        cancelText={t.common.cancel || 'Cancel'}
        loadingText={t.common.deleting || 'Deleting...'}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
