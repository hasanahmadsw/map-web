type MetadataStrategy = {
  title: (type: string, category: string, brand: string) => string;
  description: (type: string, category: string, brand: string) => string;
};

export const metadataStrategies: Record<string, MetadataStrategy> = {
  none: {
    title: (_, __, ___) => `Film & Video Equipment Rental in UAE`,
    description: () =>
      `Rent professional film and video production equipment. Cameras, lenses, lighting, audio gear, and accessories available for daily/weekly rental.`,
  },
  'type-only': {
    title: (type, _, ___) => `${type}s for Rent | Professional ${type} Equipment in UAE`,
    description: type =>
      `Browse and rent ${type.toLowerCase()}s for film and video production. Professional ${type.toLowerCase()} equipment from top manufacturers.`,
  },
  'type-brand': {
    title: (type, _, brand) => `${brand} ${type}s for Rent in UAE`,
    description: (type, _, brand) =>
      `Rent ${brand} ${type.toLowerCase()}s for video and film production. Full range of ${brand} available.`,
  },
  'type-category': {
    title: (type, category, _) => `${category} ${type}s Rental in UAE`,
    description: (type, category) =>
      `Browse ${category.toLowerCase()} ${type.toLowerCase()}s for rent. Professional ${category.toLowerCase()} equipment from leading brands.`,
  },
  'type-category-brand': {
    title: (type, category, brand) => `${brand} ${category} ${type}s for Rent in UAE`,
    description: (type, category, brand) =>
      `Rent ${brand} ${category.toLowerCase()} ${type.toLowerCase()}s for professional productions. High-quality ${brand} ${category.toLowerCase()} equipment available for rental.`,
  },
  'brand-only': {
    title: (_, __, brand) => `${brand} Equipment Rental | ${brand} Gear in UAE`,
    description: (_, __, brand) =>
      `Rent ${brand} film and video production equipment. Professional ${brand} cameras, lenses, lighting, and audio gear for rental.`,
  },
  'category-only': {
    title: (_, category, ___) => `${category} Equipment Rental in UAE`,
    description: (_, category) =>
      `Rent professional ${category.toLowerCase()} equipment for film and video production. ${category} cameras, lenses, and accessories available.`,
  },
  'brand-category': {
    title: (_, category, brand) => `${brand} ${category} Equipment in UAE`,
    description: (_, category, brand) =>
      `Rent ${brand} ${category.toLowerCase()} equipment for professional productions. ${brand} ${category.toLowerCase()} gear available for rental.`,
  },
};

export function getStrategyKey(hasType: boolean, hasCategory: boolean, hasBrand: boolean): string {
  if (!hasType && !hasCategory && !hasBrand) return 'none';
  if (hasType && !hasCategory && !hasBrand) return 'type-only';
  if (hasType && hasCategory && !hasBrand) return 'type-category';
  if (hasType && !hasCategory && hasBrand) return 'type-brand';
  if (hasType && hasCategory && hasBrand) return 'type-category-brand';
  if (!hasType && hasCategory && !hasBrand) return 'category-only';
  if (!hasType && !hasCategory && hasBrand) return 'brand-only';
  if (!hasType && hasCategory && hasBrand) return 'brand-category';
  return 'none';
}
