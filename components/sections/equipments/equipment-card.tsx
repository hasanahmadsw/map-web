import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { IEquipment } from '@/types/equipments/equipment.type';

interface EquipmentCardProps {
  equipment: IEquipment;
  lang: string;
  priority?: boolean;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format&fit=crop';

export function EquipmentCard({ equipment, lang, priority = false }: EquipmentCardProps) {
  const href = `/${lang}/equipments/${equipment.slug}`;
  const coverImage = equipment.coverPath || FALLBACK_IMAGE;

  const isUnoptimized =
    coverImage.includes('unsplash.com') ||
    coverImage.includes('supabase.co') ||
    coverImage.startsWith('http');

  return (
    <Card className="group overflow-hidden p-0 transition-all duration-200 hover:shadow-md">
      <Link href={href} className="relative block h-48 w-full overflow-hidden md:h-56">
        <Image
          src={coverImage}
          alt={`${equipment.name || 'Equipment'} thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          priority={priority}
          unoptimized={isUnoptimized}
        />
      </Link>

      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {equipment.category && (
            <Badge key={equipment.category.id} variant="default" className="text-xs">
              {equipment.category.name}
            </Badge>
          )}
          {equipment.brand && (
            <Badge key={equipment.brand.id} variant="secondary" className="text-xs">
              {equipment.brand.name}
            </Badge>
          )}
          {equipment.equipmentType && (
            <Badge variant="outline" className="text-xs">
              {equipment.equipmentType}
            </Badge>
          )}
        </div>

        <h3 className="group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
          <Link href={href} className="hover:underline">
            {equipment.name}
          </Link>
        </h3>

        {!!equipment.summary && (
          <div className="text-muted-foreground line-clamp-3 text-sm">{equipment.summary}</div>
        )}
      </CardContent>
    </Card>
  );
}
