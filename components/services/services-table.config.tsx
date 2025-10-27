"use client";

import { Edit, Settings, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/translations-provider";
import type { TableAction, TableColumn } from "../shared/data-table";

export function useServicesTableConfig() {
  const { t } = useTranslation();

  const columns: TableColumn[] = [
    {
      key: "name",
      label: "Service Name",
      render: (service: any) => {
        const translation = service.translations?.[0];
        return <div className="font-medium">{translation?.name || service.slug}</div>;
      },
    },
    {
      key: "description",
      label: "Description",
      render: (service: any) => {
        const translation = service.translations?.[0];
        return (
          <div className="max-w-xs truncate text-sm text-muted-foreground">
            {translation?.shortDescription || translation?.description || ""}
          </div>
        );
      },
    },
    {
      key: "subServices",
      label: "Sub Services",
      render: (service: any) => {
        const translation = service.translations?.[0];
        const subServicesCount = translation?.subServices?.length || 0;
        return (
          <div className="text-sm text-muted-foreground">
            {subServicesCount} {subServicesCount === 1 ? "service" : "services"}
          </div>
        );
      },
    },
    {
      key: "order",
      label: "Order",
      render: (service: any) => (
        <div className="text-sm font-mono">{service.order || 0}</div>
      ),
    },
    {
      key: "status",
      label: t.translations?.status || "Status",
      render: (service: any) => (
        <div className="flex items-center gap-2">
          <Badge variant={service.isPublished ? "default" : "secondary"}>
            {service.isPublished ? "Published" : "Draft"}
          </Badge>
          {service.isFeatured && (
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      ),
    },
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: t.common?.edit || "Edit",
      icon: <Edit className="mr-2 h-4 w-4" />,
      href: (service: any) => `/dashboard/services/${service.id}`,
    },
    {
      key: "delete",
      label: t.common?.delete || "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: "destructive",
    },
  ];

  return {
    columns,
    actions,
    emptyStateIcon: <Settings className="h-8 w-8 text-muted-foreground" />,
    emptyStateMessage: "No services found",
    errorMessage: "Failed to load services",
    deleteConfirmationMessage: t.common?.confirmDelete || "Are you sure you want to delete this service?",
  };
}
