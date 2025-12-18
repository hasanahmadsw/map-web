'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Calendar, Hash, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function useEquipmentBrandColumns(opts: {
  onEdit: (brand: IEquipmentBrand) => void;
  onDelete: (brand: IEquipmentBrand) => void;
}): ColumnDef<IEquipmentBrand>[] {
  const { onEdit, onDelete } = opts;

  return [
    // Brand name
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <div className="flex items-center gap-2">
            <Hash className="text-muted-foreground h-4 w-4" />
            <div>
              <div className="font-medium">{brand.name}</div>
              <div className="text-muted-foreground text-sm">Slug: {brand.slug}</div>
            </div>
          </div>
        );
      },
    },
    // Order
    {
      id: 'order',
      header: 'Order',
      accessorKey: 'order',
      enableSorting: true,
      cell: ({ row }) => {
        return <span className="text-sm">{row.original.order}</span>;
      },
    },
    // Status
    {
      id: 'isActive',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <div className="flex items-center gap-2">
            {brand.isActive ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <Badge variant="default">Active</Badge>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <Badge variant="secondary">Inactive</Badge>
              </>
            )}
          </div>
        );
      },
    },
    // Actions
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const brand = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(brand)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(brand)} className="text-destructive">
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
