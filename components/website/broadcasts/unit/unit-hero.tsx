import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import { formatBroadcastType, getTypeSlug } from './unit-utils';

interface UnitHeroProps {
  unit: BroadcastUnit;
}

export function UnitHero({ unit }: UnitHeroProps) {
  const typeSlug = getTypeSlug(unit.type);

  return (
    <div className="pt-edge-nav-margin relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
      {unit.coverImage ? (
        <>
          <Image
            src={unit.coverImage}
            alt={unit.title || unit.slug}
            fill
            className="object-cover"
            priority
            unoptimized={unit.coverImage.includes('supabase.co')}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
        </>
      ) : (
        <>
          <Image src="/hero.webp" alt="hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
        </>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Link
              href={`/broadcasts/${typeSlug}`}
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {formatBroadcastType(unit.type)}
            </Link>
            <span className="text-white/60">/</span>
            <span className="text-sm text-white">{unit.title || unit.slug}</span>
          </div>

          <Badge variant="default" className="text-sm font-medium">
            {formatBroadcastType(unit.type)}
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">
            {unit.title || unit.slug}
          </h1>

          {unit.summary && <p className="max-w-2xl text-lg text-white/90 md:text-xl">{unit.summary}</p>}
        </div>
      </div>
    </div>
  );
}
