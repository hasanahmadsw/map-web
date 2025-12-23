import { IEquipmentBrand } from './equipment-brand.type';
import { IEquipmentCategory } from './equipment-category.type';
import {
  AudioCategory,
  EquipmentType,
  LightMountType,
  MediaFormat,
  MicrophonePattern,
  MountType,
  ResolutionType,
  SensorType,
} from './equipment.enum';

export interface IEquipment {
  id: number;
  slug: string;
  name: string;
  summary: string;
  description: string;
  category: IEquipmentCategory;
  brand: IEquipmentBrand;
  equipmentType: `${EquipmentType}`;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  coverPath: string;
  galleryPaths: string[];
  specs: IEquipmentSpecs;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Camera Interface
export interface ICameraSpecs {
  type: EquipmentType.CAMERA;
  sensor: `${SensorType}`;
  maxResolution?: `${ResolutionType}`;
  maxFps?: number;
  mounts: `${MountType}`[];
  weightKg?: number;
  media?: `${MediaFormat}`;
}

// Lens Interface
export interface ILensSpecs {
  type: EquipmentType.LENS;
  mount: `${MountType}`;
  focalLengthMm: {
    min: number;
    max: number;
  };
  aperture?: {
    minT: number;
    maxT: number;
  };
  isZoom: boolean;
  weightG?: number;
}

// Light Interface
export interface ILightSpecs {
  type: EquipmentType.LIGHT;
  powerW: number;
  colorTempK?: {
    min: number;
    max: number;
  };
  hasRgb: boolean;
  mount?: `${LightMountType}`;
}

// Audio Interface
export interface IAudioSpecs {
  type: EquipmentType.AUDIO;
  category: `${AudioCategory}`;
  pattern?: `${MicrophonePattern}`;
  channels?: number;
  phantomPower?: boolean;
}

// Accessory Interface
export interface IAccessorySpecs {
  type: EquipmentType.ACCESSORY;
  notes?: string;
}

export type IEquipmentSpecs = ICameraSpecs | ILensSpecs | ILightSpecs | IAudioSpecs | IAccessorySpecs;

export interface EquipmentParams {
  page?: number;
  limit?: number;
  q?: string;
  equipmentType?: string;
  category?: string;
  brand?: string;
  isFeatured?: string;
}
