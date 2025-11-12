"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2, Mail, Calendar, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";
import type { Staff } from "@/types/staff.types";
import type { Lang } from "@/utils/dictionary-utils";

function getRoleVariant(role: Staff["role"]) {
  switch (role) {
    case "superadmin":
      return "destructive";
    case "admin":
      return "default";
    case "author":
      return "secondary";
    default:
      return "outline";
  }
}

function getRoleText(role: Staff["role"], dict: any) {
  switch (role) {
    case "superadmin":
      return dict.roleSuperAdmin || "Super Admin";
    case "admin":
      return dict.roleAdmin || "Admin";
    case "author":
      return dict.roleAuthor || "Author";
    default:
      return role;
  }
}

function formatDate(dateString: string, lang: Lang) {
  return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStaffInitials(staff: Staff) {
  const names = staff.name.split(" ");
  const firstInitial = names[0]?.charAt(0)?.toUpperCase() || "";
  const lastInitial = names[names.length - 1]?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
}

export function useStaffColumns(opts: {
  lang: Lang;
  onDelete: (staff: Staff) => void;
}): ColumnDef<Staff>[] {
  const { lang, onDelete } = opts;
  const { t } = useTranslation();
  const router = useRouter();
  const currentLang = useLang();
  const common = t.common || {};
  const staffs = t.staffs || {};

  const handleEdit = (staff: Staff) => {
    router.push(`/${currentLang}/dashboard/staff/${staff.id}`);
  };

  return [
    // Staff info
    {
      id: "staff",
      header: staffs.staffMember || common.name || "Staff Member",
      accessorKey: "name",
      enableSorting: true,
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={staff.image || ""} alt={staff.name} />
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
      id: "email",
      header: common.email || "Email",
      accessorKey: "email",
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
      id: "role",
      header: staffs.role || "Role",
      enableSorting: false,
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <div className="flex items-center gap-2">
            <Shield className="text-muted-foreground h-4 w-4" />
            <Badge variant={getRoleVariant(staff.role)}>{getRoleText(staff.role, staffs)}</Badge>
          </div>
        );
      },
    },
    // Created date
    {
      id: "createdAt",
      header: common.createdAt || "Created At",
      enableSorting: true,
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{formatDate(row.original.createdAt, lang)}</span>
        </div>
      ),
    },
    // Actions
    {
      id: "actions",
      header: typeof common.actions === "string" ? common.actions : "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const staff = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(staff)}>
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                {common.edit || "Edit"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(staff)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                {common.delete || "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

