'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Hash, CheckCircle2, XCircle, Tag, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function useEquipmentCategoryColumns(opts: {
  onEdit: (category: IEquipmentCategory) => void;
  onDelete: (category: IEquipmentCategory) => void;
}): ColumnDef<IEquipmentCategory>[] {
  const { onEdit, onDelete } = opts;

  return [
    // Category name
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <Hash className="text-muted-foreground h-4 w-4" />
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-muted-foreground text-sm">Slug: {category.slug}</div>
            </div>
          </div>
        );
      },
    },
    // Description
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      enableSorting: false,
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <div className="max-w-md">
            <p className="line-clamp-2 text-sm">{description}</p>
          </div>
        );
      },
    },
    // Type
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      enableSorting: true,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <Tag className="text-muted-foreground h-4 w-4" />
            <Badge variant="outline">{category.type}</Badge>
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
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            {category.isActive ? (
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
        const category = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive">
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
