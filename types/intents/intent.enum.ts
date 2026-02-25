export const INTENT_TYPES = [
  'HUB',
  'CLUSTER',
  'CATEGORY',
  'BRAND',
  'MODEL',
  'OFFER',
  'LOCATION',
] as const;

export type IntentTypeEnum = (typeof INTENT_TYPES)[number];
