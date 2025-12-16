'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Settings, Star, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { StaffService } from '@/types/services.types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function useServiceColumns(opts: {
  onDelete: (service: StaffService) => void;
}): ColumnDef<StaffService>[] {
  const { onDelete } = opts;

  const router = useRouter();

  const handleEdit = (service: StaffService) => {
    router.push(`/dashboard/services/${service.id}`);
  };

  return [
    // Service name
    {
      id: 'name',
      header: 'Service Name',
      accessorKey: 'name',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Settings className="text-primary h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{service.name || service.slug}</div>
              <div className="text-muted-foreground text-sm">ID: {service.id}</div>
            </div>
          </div>
        );
      },
    },
    // Description
    {
      id: 'description',
      header: 'Description',
      enableSorting: false,
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="text-muted-foreground max-w-xs truncate text-sm">
            {service.shortDescription || service.description || ''}
          </div>
        );
      },
    },
    // Sub Services
    {
      id: 'subServices',
      header: 'Sub Services',
      enableSorting: false,
      cell: ({ row }) => {
        const service = row.original;
        const subServicesCount = service.subServices?.length || 0;
        return (
          <div className="text-muted-foreground text-sm">
            {subServicesCount} {subServicesCount === 1 ? 'service' : 'services'}
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
        const service = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={service.isPublished ? 'default' : 'secondary'}>
              {service.isPublished ? 'Published' : 'Draft'}
            </Badge>
            {service.isFeatured && (
              <Badge variant="outline" className="text-xs">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
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
        const service = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(service)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(service)} className="text-destructive">
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
