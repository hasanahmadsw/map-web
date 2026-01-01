'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Package, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatBroadcastType(type: BroadcastType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function useBroadcastUnitColumns(opts: {
  onDelete: (broadcastUnit: BroadcastUnit) => void;
}): ColumnDef<BroadcastUnit>[] {
  const { onDelete } = opts;

  const router = useRouter();

  const handleEdit = (broadcastUnit: BroadcastUnit) => {
    router.push(`/dashboard/broadcast-units/${broadcastUnit.id}`);
  };

  return [
    // Broadcast unit name
    {
      id: 'title',
      header: 'Unit Name',
      accessorKey: 'title',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const broadcastUnit = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Package className="text-primary h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{broadcastUnit.title || broadcastUnit.slug}</div>
              <div className="text-muted-foreground text-sm">ID: {broadcastUnit.id}</div>
            </div>
          </div>
        );
      },
    },
    // Type
    {
      id: 'type',
      header: 'Type',
      enableSorting: true,
      accessorKey: 'type',
      cell: ({ row }) => {
        const broadcastUnit = row.original;
        return (
          <Badge variant="outline" className="text-xs">
            {formatBroadcastType(broadcastUnit.type as BroadcastType)}
          </Badge>
        );
      },
    },
    // Items count
    {
      id: 'items',
      header: 'Items',
      enableSorting: false,
      cell: ({ row }) => {
        const broadcastUnit = row.original;
        const itemsCount = broadcastUnit.items?.length || 0;
        return (
          <div className="text-muted-foreground text-sm">
            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
          </div>
        );
      },
    },
    // Summary
    {
      id: 'summary',
      header: 'Summary',
      enableSorting: false,
      cell: ({ row }) => {
        const broadcastUnit = row.original;
        return (
          <div className="text-muted-foreground max-w-xs truncate text-sm">
            {broadcastUnit.summary || broadcastUnit.description || ''}
          </div>
        );
      },
    },
    // Order
    {
      id: 'order',
      header: 'Order',
      enableSorting: true,
      accessorKey: 'order',
      cell: ({ row }) => <div className="font-mono text-sm">{row.original.order || 0}</div>,
    },
    // Status
    {
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => {
        const broadcastUnit = row.original;
        return (
          <Badge variant={broadcastUnit.isPublished ? 'default' : 'secondary'}>
            {broadcastUnit.isPublished ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    },
    // Created date
    {
      id: 'createdAt',
      header: 'Created At',
      enableSorting: true,
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{formatDate(row.original.createdAt)}</span>
        </div>
      ),
    },
    // Actions
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const broadcastUnit = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(broadcastUnit)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(broadcastUnit)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
