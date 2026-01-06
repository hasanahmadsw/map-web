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
