'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash2, FileText, Star, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Article } from '@/types/articles.types';

import { useStaffMe } from '@/hooks/staff/useStaffMe';
import { Role } from '@/types/roles.enum';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function useArticleColumns(opts: { onDelete: (article: Article) => void }): ColumnDef<Article>[] {
  const { onDelete } = opts;

  const router = useRouter();

  const { isCurrentUser, isAuthor } = useStaffMe();

  const handleEdit = (article: Article) => {
    router.push(`/dashboard/articles/${article.id}`);
  };

  return [
    // Article name
    {
      id: 'name',
      header: 'Article Name',
      accessorKey: 'name',
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{article.name || article.slug}</div>
              <div className="text-muted-foreground text-sm">Author: {article.author.name}</div>
            </div>
          </div>
        );
      },
    },
    // Excerpt
    {
      id: 'excerpt',
      header: 'Excerpt',
      enableSorting: false,
      cell: ({ row }) => {
        const article = row.original;
        return <div className="text-muted-foreground max-w-xs truncate text-sm">{article.excerpt || ''}</div>;
      },
    },
    // Tags
    {
      id: 'tags',
      header: 'Tags',
      enableSorting: false,
      cell: ({ row }) => {
        const article = row.original;
        const tags = Array.isArray(article.tags) ? article.tags : [];

        if (tags.length === 0) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }

        return (
          <div className="flex max-w-md flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    // Topics
    {
      id: 'topics',
      header: 'Topics',
      enableSorting: false,
      cell: ({ row }) => {
        const article = row.original;
        const topics = Array.isArray(article.topics) ? article.topics : [];

        if (topics.length === 0) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }

        return (
          <div className="flex max-w-md flex-wrap gap-1.5">
            {topics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
            {topics.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{topics.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    // Status
    {
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => {
        const article = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={article.isPublished ? 'default' : 'secondary'}>
              {article.isPublished ? 'Published' : 'Draft'}
            </Badge>
            {article.isFeatured && (
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
        const article = row.original;

        const isCurrent = isCurrentUser(article.author.id);
        const isViewingNonAuthor = article.author.role !== Role.AUTHOR;

        if (!isCurrent && isViewingNonAuthor && !isAuthor) {
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
              <DropdownMenuItem onClick={() => handleEdit(article)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(article)} className="text-destructive">
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
