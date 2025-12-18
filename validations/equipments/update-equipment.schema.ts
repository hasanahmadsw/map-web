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

// Camera Specs Schema
const cameraSpecsSchema = z.object({
  type: z.literal(EquipmentType.CAMERA),
  sensor: z.enum(SensorType, { message: validation.required }),
  maxResolution: z.enum(ResolutionType).optional(),
  maxFps: z.number().int().positive().optional(),
  mounts: z.array(z.enum(MountType)).min(1, validation.required),
  weightKg: z.number().positive().optional(),
  media: z.enum(MediaFormat).optional(),
});

// Lens Specs Schema
const lensSpecsSchema = z
  .object({
    type: z.literal(EquipmentType.LENS),
    mount: z.enum(MountType, { message: validation.required }),
    focalLengthMm: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
    }),
    aperture: z
      .object({
        minT: z.number().positive(),
        maxT: z.number().positive(),
      })
      .optional(),
    isZoom: z.boolean(),
    weightG: z.number().positive().optional(),
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
    powerW: z.number().positive(),
    colorTempK: z
      .object({
        min: z.number().positive(),
        max: z.number().positive(),
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
  channels: z.number().int().positive().optional(),
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
const equipmentSpecsSchema = z.discriminatedUnion('type', [
  cameraSpecsSchema,
  lensSpecsSchema,
  lightSpecsSchema,
  audioSpecsSchema,
  accessorySpecsSchema,
]);

function updateEquipmentSchema() {
  return z
    .object({
      slug: z
        .string(validation.required)
        .min(3, fmt(validation.string.minLength, { min: 3 }))
        .max(200, fmt(validation.string.maxLength, { max: 200 }))
        .regex(/^[a-z0-9-]+$/, validation.string.slugRegex),
      name: z
        .string(validation.required)
        .trim()
        .min(2, fmt(validation.string.minLength, { min: 2 }))
        .max(200, fmt(validation.string.maxLength, { max: 200 })),
      summary: z
        .string(validation.required)
        .trim()
        .min(3, fmt(validation.string.minLength, { min: 3 }))
        .max(500, fmt(validation.string.maxLength, { max: 500 })),
      description: z
        .string(validation.required)
        .trim()
        .min(3, fmt(validation.string.minLength, { min: 3 }))
        .max(5000, fmt(validation.string.maxLength, { max: 5000 })),
      categoryId: z.number().int().positive(validation.required),
      brandId: z.number().int().positive(validation.required),
      equipmentType: z.enum(EquipmentType, { message: validation.required }),
      isPublished: z.boolean().default(false),
      isFeatured: z.boolean().default(false),
      order: z.number().int().min(0).default(0),
      coverPath: z.string(validation.required).min(1, validation.required),
      galleryPaths: z.array(z.string().min(1, validation.required)).optional().default([]),
      specs: equipmentSpecsSchema,
      status: z
        .string()
        .max(100, fmt(validation.string.maxLength, { max: 100 }))
        .optional(),
    })
    .refine(
      data => {
        // Ensure equipmentType matches specs.type
        return data.equipmentType === data.specs.type;
      },
      {
        message: 'Equipment type must match specs type',
        path: ['specs'],
      },
    );
}

type TUpdateEquipmentForm = z.infer<ReturnType<typeof updateEquipmentSchema>>;

export { updateEquipmentSchema, type TUpdateEquipmentForm };
