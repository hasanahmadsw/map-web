import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import {
  AudioCategory,
  EquipmentType,
  LightMountType,
  MediaFormat,
  MicrophonePattern,
  MountType,
  ResolutionType,
  SensorType,
} from '@/types/equipments/equipment.enum';
import { numberValidation } from '../common';

// Camera Specs Schema
const cameraSpecsSchema = z.object({
  type: z.literal(EquipmentType.CAMERA),
  sensor: z.enum(SensorType, { message: validation.required }),
  maxResolution: z.enum(ResolutionType).optional(),
  maxFps: numberValidation(1, 1000).optional().or(z.literal('')), // 1 - 1000fps
  mounts: z.array(z.enum(MountType)).min(1, validation.required),
  weightKg: numberValidation(0.001, 50).optional().or(z.literal('')), // 0.001 - 50Kg
  media: z.enum(MediaFormat).optional(),
});

// Lens Specs Schema
const lensSpecsSchema = z
  .object({
    type: z.literal(EquipmentType.LENS),
    mount: z.enum(MountType, { message: validation.required }),

    focalLengthMm: z.object({
      min: numberValidation(0.1, 50_000), // 0.1 to 5000mm
      max: numberValidation(0.1, 50_000), // 0.1 to 5000mm
    }),
    aperture: z
      .object({
        minT: numberValidation(0.1, 50), // 0.1 to T50
        maxT: numberValidation(0.1, 50), // 0.1 to T50
      })
      .optional(),
    isZoom: z.boolean(),
    weightG: numberValidation(1, 50_000).optional().or(z.literal('')), // 1 - 50_000g
  })
  .refine(data => data.focalLengthMm.max >= data.focalLengthMm.min, {
    message: 'Max focal length must be greater than or equal to min',
    path: ['focalLengthMm'],
  })
  .refine(
    data => {
      if (data.aperture) {
        return data.aperture.maxT >= data.aperture.minT;
      }
      return true;
    },
    {
      message: 'Max aperture must be greater than or equal to min',
      path: ['aperture'],
    },
  );

// Light Specs Schema
const lightSpecsSchema = z
  .object({
    type: z.literal(EquipmentType.LIGHT),
    powerW: numberValidation(2, 50000), // 2 - 50000W
    colorTempK: z
      .object({
        min: numberValidation(1000, 20000), // 1000 - 20000K
        max: numberValidation(1000, 20000), // 1000 - 20000K
      })
      .optional(),
    hasRgb: z.boolean(),
    mount: z.enum(LightMountType).optional(),
  })
  .refine(
    data => {
      if (data.colorTempK) {
        return data.colorTempK.max >= data.colorTempK.min;
      }
      return true;
    },
    {
      message: 'Max color temperature must be greater than or equal to min',
      path: ['colorTempK'],
    },
  );

// Audio Specs Schema
const audioSpecsSchema = z.object({
  type: z.literal(EquipmentType.AUDIO),
  category: z.enum(AudioCategory, { message: validation.required }),
  pattern: z.enum(MicrophonePattern).optional(),
  channels: numberValidation(1, 64).optional().or(z.literal('')), // 1 - 64 channels
  phantomPower: z.boolean().optional(),
});

// Accessory Specs Schema
const accessorySpecsSchema = z.object({
  type: z.literal(EquipmentType.ACCESSORY),
  notes: z
    .string()
    .max(1024, fmt(validation.string.maxLength, { max: 1024 }))
    .optional(),
});

// Discriminated Union for Specs
export const equipmentSpecsSchema = z.discriminatedUnion('type', [
  cameraSpecsSchema,
  lensSpecsSchema,
  lightSpecsSchema,
  audioSpecsSchema,
  accessorySpecsSchema,
]);
