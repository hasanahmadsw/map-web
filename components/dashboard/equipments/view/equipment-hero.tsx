'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle2, XCircle, Star, Edit } from 'lucide-react';
import type { IEquipment } from '@/types/equipments/equipment.type';

interface EquipmentHeroProps {
  equipment: IEquipment;
}

function EquipmentHero({ equipment }: EquipmentHeroProps) {
  return (
    <div className="bg-muted relative h-[400px] w-full overflow-hidden rounded-xl border md:h-[500px]">
      {equipment.coverPath ? (
        <>
          <Image
            src={equipment.coverPath}
            alt={equipment.name}
            fill
            className="object-cover"
            priority
            unoptimized={equipment.coverPath.includes('supabase.co')}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="text-muted-foreground/50 h-24 w-24" />
        </div>
      )}

      {/* Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="default" size="sm" asChild>
          <Link href={`/dashboard/equipments/${equipment.id}`}>
            <Edit className="h-4 w-4 text-green-500" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {equipment.brand && (
              <Badge variant="secondary" className="text-sm">
                {equipment.brand.name}
              </Badge>
            )}
            {equipment.category && (
              <Badge variant="outline" className="text-sm text-white">
                {equipment.category.name}
              </Badge>
            )}
            {equipment.isFeatured && (
              <Badge variant="default" className="gap-1 text-sm">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            {equipment.isPublished ? (
              <Badge variant="default" className="gap-1 bg-green-600 text-sm hover:bg-green-700">
                <CheckCircle2 className="h-3 w-3" />
                Published
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 text-sm">
                <XCircle className="h-3 w-3" />
                Draft
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{equipment.name}</h1>
          {equipment.summary && <p className="max-w-3xl text-lg text-white/90">{equipment.summary}</p>}
        </div>
      </div>
    </div>
  );
}

export default EquipmentHero;
