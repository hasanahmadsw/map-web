import { EquipmentType } from './equipment.enum';

export interface IEquipmentCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  type: `${EquipmentType}`;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
