"use client";

import { format } from "date-fns";
import { Edit, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/translations-provider";
import type { TableAction, TableColumn } from "../shared/data-table";

const roleColors = {
  superadmin: "destructive",
  admin: "default",
  author: "secondary",
} as const;

const roleLabels = {
  superadmin: "Super Admin",
  admin: "Admin",
  author: "Author",
} as const;

export function useStaffTableConfig() {
  const { t } = useTranslation();

  const columns: TableColumn[] = [
    {
      key: "member",
      label: t.staffs.staffMember,
      render: (member: any) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: t.staffs.role,
      render: (member: any) => (
        <Badge variant={roleColors[member.role as keyof typeof roleColors]}>
          {roleLabels[member.role as keyof typeof roleLabels]}
        </Badge>
      ),
    },
    {
      key: "email",
      label: t.common.email,
      render: (member: any) => member.email,
    },
    {
      key: "created",
      label: t.common.createdAt,
      render: (member: any) => format(new Date(member.createdAt), "MMM dd, yyyy"),
    },
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: t.common.edit,
      icon: <Edit className="mr-2 h-4 w-4" />,
      href: (member: any) => `/dashboard/staff/${member.id}`,
    },
    {
      key: "delete",
      label: t.common.delete,
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: "destructive",
      onClick: (member: any) => {
        // Handle delete action
        console.log("Delete member:", member.id);
      },
    },
  ];

  return {
    columns,
    actions,
    emptyStateIcon: <User className="h-8 w-8 text-muted-foreground" />,
    emptyStateMessage: t.common.notFound,
    errorMessage: t.common.failedToLoad,
    deleteConfirmationMessage: t.common.confirmDelete,
  };
}
