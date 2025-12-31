'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Building2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Facility } from '@/types/facilities/facilities.types';
import { FacilityType } from '@/types/facilities/facility.enums';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatFacilityType(type: FacilityType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function useFacilityColumns(opts: { onDelete: (facility: Facility) => void }): ColumnDef<Facility>[] {
  const { onDelete } = opts;

  const router = useRouter();

  const handleEdit = (facility: Facility) => {
    router.push(`/dashboard/facilities/${facility.id}`);
  };

  return [
    // Facility name
    {
      id: 'title',
      header: 'Facility Name',
      accessorKey: 'title',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const facility = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{facility.title || facility.slug}</div>
              <div className="text-muted-foreground text-sm">ID: {facility.id}</div>
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
        const facility = row.original;
        return (
          <Badge variant="outline" className="text-xs">
            {formatFacilityType(facility.type)}
          </Badge>
        );
      },
    },
    // Summary
    {
      id: 'summary',
      header: 'Summary',
      enableSorting: false,
      cell: ({ row }) => {
        const facility = row.original;
        return (
          <div className="text-muted-foreground max-w-xs truncate text-sm">
            {facility.summary || facility.description || ''}
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
        const facility = row.original;
        return (
          <Badge variant={facility.isPublished ? 'default' : 'secondary'}>
            {facility.isPublished ? 'Published' : 'Draft'}
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
        const facility = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(facility)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(facility)} className="text-destructive">
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
