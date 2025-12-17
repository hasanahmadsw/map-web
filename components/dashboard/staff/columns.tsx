'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Role, type Staff } from '@/types/staff.types';
import { useStaffMe } from '@/hooks/staff/useStaffMe';

function getRoleVariant(role: Staff['role']) {
  switch (role) {
    case Role.SUPERADMIN:
      return 'destructive';
    case Role.ADMIN:
      return 'default';
    case Role.AUTHOR:
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStaffInitials(staff: Staff) {
  const names = staff.name.split(' ');
  const firstInitial = names[0]?.charAt(0)?.toUpperCase() || '';
  const lastInitial = names[names.length - 1]?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
}

export function useStaffColumns(opts: {
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}): ColumnDef<Staff>[] {
  const { onEdit, onDelete } = opts;

  const { isCurrentUser, isAuthor, isAdmin } = useStaffMe();

  return [
    // Staff info
    {
      id: 'staff',
      header: 'Staff Name',
      accessorKey: 'name',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={staff.image || ''} alt={staff.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getStaffInitials(staff)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{staff.name}</div>
              <div className="text-muted-foreground text-sm">ID: {staff.id}</div>
            </div>
          </div>
        );
      },
    },
    // Email
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      enableSorting: true,
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex items-center gap-2">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{staff.email}</span>
          </div>
        );
      },
    },
    // Role
    {
      id: 'role',
      header: 'Role',
      enableSorting: false,
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex items-center gap-2">
            <Shield className="text-muted-foreground h-4 w-4" />
            <Badge variant={getRoleVariant(staff.role)}>{staff.role}</Badge>
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
        const staff = row.original;

        const isCurrent = isCurrentUser(staff.id);
        const isViewingNonAuthor = staff.role !== Role.AUTHOR;

        if (isCurrent || isAuthor || (isAdmin && isViewingNonAuthor)) {
          return null;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(staff)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(staff)} className="text-destructive">
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
