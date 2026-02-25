'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, Hash, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { IIntentBase, IntentType } from '@/types/intents/intent.type';

const INTENT_TYPE_STYLES: Record<IntentType, string> = {
  HUB: 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  CLUSTER: 'border-purple-500/50 bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  CATEGORY: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  BRAND: 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  MODEL: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
  OFFER: 'border-rose-500/50 bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  LOCATION: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function useIntentColumns(opts: {
  onEdit: (intent: IIntentBase) => void;
  onDelete: (intent: IIntentBase) => void;
}): ColumnDef<IIntentBase>[] {
  const { onEdit, onDelete } = opts;

  return [
    {
      id: 'slug',
      header: 'Slug',
      accessorKey: 'slug',
      enableSorting: true,
      cell: ({ row }) => {
        const intent = row.original;
        return (
          <div className="flex items-center gap-2">
            <Hash className="text-muted-foreground h-4 w-4" />
            <div>
              <div className="font-medium">{intent.slug}</div>
              {intent.h1 && (
                <div className="text-muted-foreground text-sm">{intent.h1}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      enableSorting: true,
      cell: ({ row }) => {
        const type = row.original.type as IntentType;
        const style = INTENT_TYPE_STYLES[type] ?? '';
        return <Badge variant="outline" className={style}>{type}</Badge>;
      },
    },
    {
      id: 'linkLabel',
      header: 'Link Label',
      accessorKey: 'linkLabel',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm">{row.original.linkLabel || '-'}</span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorKey: 'createdAt',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{formatDate(row.original.createdAt)}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const intent = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(intent)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(intent)} className="text-destructive">
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
