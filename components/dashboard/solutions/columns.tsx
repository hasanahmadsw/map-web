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

import type { StaffSolution } from '@/types/solutions.types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function useSolutionColumns(opts: {
  onDelete: (solution: StaffSolution) => void;
}): ColumnDef<StaffSolution>[] {
  const { onDelete } = opts;

  const router = useRouter();

  const handleEdit = (solution: StaffSolution) => {
    router.push(`/dashboard/solutions/${solution.id}`);
  };

  return [
    // Solution name
    {
      id: 'name',
      header: 'Solution Name',
      accessorKey: 'name',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const solution = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Settings className="text-primary h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{solution.name || solution.slug}</div>
              <div className="text-muted-foreground text-sm">ID: {solution.id}</div>
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
        const solution = row.original;
        return (
          <div className="text-muted-foreground max-w-xs truncate text-sm">
            {solution.shortDescription || solution.description || ''}
          </div>
        );
      },
    },
    // Services count
    {
      id: 'services',
      header: 'Services',
      enableSorting: false,
      cell: ({ row }) => {
        const solution = row.original;
        const servicesCount = solution.services?.length || 0;
        return (
          <div className="text-muted-foreground text-sm">
            {servicesCount} {servicesCount === 1 ? 'service' : 'services'}
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
        const solution = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={solution.isPublished ? 'default' : 'secondary'}>
              {solution.isPublished ? 'Published' : 'Draft'}
            </Badge>
            {solution.isFeatured && (
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
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(solution)} className="text-destructive">
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
