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

import type { FacilityUnit } from '@/types/facilities/facilities.types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function useFacilityUnitColumns(opts: {
  onDelete: (facilityUnit: FacilityUnit) => void;
}): ColumnDef<FacilityUnit>[] {
  const { onDelete } = opts;

  const router = useRouter();

  const handleEdit = (facilityUnit: FacilityUnit) => {
    router.push(`/dashboard/facility-units/${facilityUnit.id}`);
  };

  return [
    // Facility unit name
    {
      id: 'title',
      header: 'Unit Name',
      accessorKey: 'title',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const facilityUnit = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Package className="text-primary h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{facilityUnit.title || facilityUnit.slug}</div>
              <div className="text-muted-foreground text-sm">ID: {facilityUnit.id}</div>
            </div>
          </div>
        );
      },
    },
    // Items count
    {
      id: 'items',
      header: 'Items',
      enableSorting: false,
      cell: ({ row }) => {
        const facilityUnit = row.original;
        const itemsCount = facilityUnit.items?.length || 0;
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
        const facilityUnit = row.original;
        return (
          <div className="text-muted-foreground max-w-xs truncate text-sm">
            {facilityUnit.summary || facilityUnit.description || ''}
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
        const facilityUnit = row.original;
        return (
          <Badge variant={facilityUnit.isPublished ? 'default' : 'secondary'}>
            {facilityUnit.isPublished ? 'Published' : 'Draft'}
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
        const facilityUnit = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(facilityUnit)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(facilityUnit)} className="text-destructive">
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

