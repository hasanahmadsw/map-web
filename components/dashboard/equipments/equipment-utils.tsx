import { Camera, Lightbulb, Mic, Package } from 'lucide-react';
import { EquipmentType } from '@/types/equipments/equipment.enum';

export function getEquipmentIcon(type: string) {
  const iconClass = 'h-5 w-5';
  switch (type) {
    case EquipmentType.CAMERA:
      return <Camera className={iconClass} />;
    case EquipmentType.LENS:
      return <Camera className={iconClass} />;
    case EquipmentType.LIGHT:
      return <Lightbulb className={iconClass} />;
    case EquipmentType.AUDIO:
      return <Mic className={iconClass} />;
    case EquipmentType.ACCESSORY:
      return <Package className={iconClass} />;
    default:
      return <Package className={iconClass} />;
  }
}
