import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { BroadcastUnitItemGroup, BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { numberValidation, gallerySchema } from '../common';

const broadcastUnitItemSchema = z.object({
  group: z.nativeEnum(BroadcastUnitItemGroup).optional(),
  title: z
    .string(validation.required)
    .trim()
    .min(1, fmt(validation.string.minLength, { min: 1 }))
    .max(200, fmt(validation.string.maxLength, { max: 200 })),
  qty: numberValidation(1, 10000).optional().or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(500, fmt(validation.string.maxLength, { max: 500 }))
    .optional(),
  order: numberValidation(1, 1000).optional().or(z.literal('')),
});

const broadcastUnitSpecsSchema = z.object({
  format: z.string().optional(),
  routing: z.string().optional(),
  intercom: z.string().optional(),
  intercomList: z.array(z.string()).optional(),
  useCases: z.array(z.string()).optional(),
  audioMixer: z.string().optional(),
  visionMixer: z.string().optional(),
  visionMixers: z.array(z.string()).optional(),
  cameraChains: z.number().int().positive().optional(),
  cameraSystem: z.string().optional(),
  powerBackup: z.string().optional(),
  power: z.string().optional(),
  mobility: z.string().optional(),
  deployment: z.string().optional(),
});

function createBroadcastUnitSchema() {
  return z.object({
    type: z.nativeEnum(BroadcastType, { message: validation.required }),
    slug: z
      .string(validation.required)
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .regex(/^[a-z0-9-]+$/, validation.string.slugRegex),
    title: z
      .string()
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .optional(),
    summary: z
      .string()
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(500, fmt(validation.string.maxLength, { max: 500 }))
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(5000, fmt(validation.string.maxLength, { max: 5000 }))
      .optional(),
    specs: broadcastUnitSpecsSchema.optional(),
    coverImage: z.string().min(1, validation.required).optional(),
    gallery: gallerySchema,
    isPublished: z.boolean().default(false),
    order: numberValidation(1, 100).optional().or(z.literal('')),
    items: z.array(broadcastUnitItemSchema).optional().default([]),
  });
}

type TCreateBroadcastUnitForm = z.infer<ReturnType<typeof createBroadcastUnitSchema>>;

export { createBroadcastUnitSchema, type TCreateBroadcastUnitForm };
