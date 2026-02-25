import { BroadcastUnitItemGroup, BroadcastType } from '@/types/broadcasts/broadcast.enums';

export function formatGroup(group: BroadcastUnitItemGroup): string {
  return group.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function formatBroadcastType(type: BroadcastType | `${BroadcastType}`): string {
  return String(type)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function getTypeSlug(type: BroadcastType | `${BroadcastType}`): string {
  return String(type).toLowerCase().replace(/_/g, '-');
}

/** URL for "back to" / "view more" links when unit is under /broadcasting/units */
export function getTypeBroadcastingUrl(type: BroadcastType | `${BroadcastType}`): string {
  const t = String(type);
  if (t === 'OBVAN') return '/broadcasting/outside-broadcast';
  if (t === 'FLIGHT_CASE') return '/broadcasting/portable-broadcast-systems';
  return '/broadcasting';
}

/** Display name for parent page in breadcrumb (matches page titles) */
export function getTypeParentLabel(type: BroadcastType | `${BroadcastType}`): string {
  const t = String(type);
  if (t === 'OBVAN') return 'Outside Broadcast';
  if (t === 'FLIGHT_CASE') return 'Portable Broadcast Systems';
  return 'Broadcasting';
}
