'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Package, Star, Calendar, Image as ImageIcon, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IEquipment } from '@/types/equipments/equipment.type';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import Link from 'next/link';

function formatEquipmentType(type: string) {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function EquipmentNameCell({ equipment }: { equipment: IEquipment }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {equipment.coverPath && !imageError ? (
        <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
          <Image
            src={equipment.coverPath}
            alt={equipment.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Package className="text-primary h-5 w-5" />
        </div>
      )}
      <div>
        <div className="font-medium">{equipment.name || equipment.slug}</div>
        <div className="text-muted-foreground text-sm">ID: {equipment.id}</div>
      </div>
    </div>
  );
}

export function useEquipmentColumns(opts: {
  onDelete: (equipment: IEquipment) => void;
}): ColumnDef<IEquipment>[] {
  const { onDelete } = opts;

  const router = useRouter();

  return [
    // Equipment name
    {
      id: 'name',
      header: 'Equipment Name',
      accessorKey: 'name',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => <EquipmentNameCell equipment={row.original} />,
    },
    // Type
    {
      id: 'equipmentType',
      header: 'Type',
      accessorKey: 'equipmentType',
      enableSorting: true,
      cell: ({ row }) => {
        const equipment = row.original;
        return (
          <Badge variant="outline" className="text-xs">
            {formatEquipmentType(equipment.equipmentType)}
          </Badge>
        );
      },
    },
    // Category
    {
      id: 'category',
      header: 'Category',
      enableSorting: false,
      cell: ({ row }) => {
        const equipment = row.original;
        return <div className="text-muted-foreground text-sm">Category ID: {equipment.category.name}</div>;
      },
    },
    // Brand
    {
      id: 'brand',
      header: 'Brand',
      enableSorting: false,
      cell: ({ row }) => {
        const equipment = row.original;
        return <div className="text-muted-foreground text-sm">Brand ID: {equipment.brand.name}</div>;
      },
    },
    // Summary
    {
      id: 'summary',
      header: 'Summary',
      enableSorting: false,
      cell: ({ row }) => {
        const equipment = row.original;
        return (
          <div className="text-muted-foreground max-w-xs truncate text-sm">{equipment.summary || ''}</div>
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
        const equipment = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={equipment.isPublished ? 'default' : 'secondary'}>
              {equipment.isPublished ? 'Published' : 'Draft'}
            </Badge>
            {equipment.isFeatured && (
              <Badge variant="outline" className="text-xs">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
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
        const equipment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/equipments/${equipment.id}?view=1`}>
                  <Eye className="mr-2 h-4 w-4 text-blue-500" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/equipments/${equipment.id}`}>
                  <Edit className="mr-2 h-4 w-4 text-green-500" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(equipment)} className="text-destructive">
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
