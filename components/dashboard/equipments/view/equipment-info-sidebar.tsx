'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Calendar, Tag } from 'lucide-react';
import type { IEquipment } from '@/types/equipments/equipment.type';

interface EquipmentInfoSidebarProps {
  equipment: IEquipment;
}

function EquipmentInfoSidebar({ equipment }: EquipmentInfoSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Equipment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4" />
              <span>Type</span>
            </div>
            <p className="font-medium capitalize">{equipment.equipmentType}</p>
          </div>

          {equipment.status && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Status</span>
              </div>
              <p className="font-medium">{equipment.status}</p>
            </div>
          )}

          {equipment.order !== undefined && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>Order</span>
              </div>
              <p className="font-medium">{equipment.order}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Created</span>
            </div>
            <p className="text-sm font-medium">{new Date(equipment.createdAt).toLocaleDateString()}</p>
          </div>

          {equipment.updatedAt && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Updated</span>
              </div>
              <p className="text-sm font-medium">{new Date(equipment.updatedAt).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brand & Category */}
      {(equipment.brand || equipment.category) && (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipment.brand && (
              <div className="space-y-2">
                <CardDescription>Brand</CardDescription>
                <p className="font-medium">{equipment.brand.name}</p>
              </div>
            )}
            {equipment.category && (
              <div className="space-y-2">
                <CardDescription>Category</CardDescription>
                <p className="font-medium">{equipment.category.name}</p>
                {equipment.category.description && (
                  <p className="text-muted-foreground text-sm">{equipment.category.description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default EquipmentInfoSidebar;
