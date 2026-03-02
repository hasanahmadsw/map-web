import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Camera,
  Sparkles,
  Mic,
  Lightbulb,
  Package,
  Tag,
  FolderOpen,
  Info,
} from 'lucide-react';

import { equipmentsService } from '@/services/equipments/equipments.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DivHtml from '@/components/shared/div-html';
import { capitalizeEachWord } from '@/utils/format';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import type { IEquipment } from '@/types/equipments/equipment.type';
import { EquipmentGallery } from '@/components/website/equipments/view/equipment-gallery';
import { EquipmentSpecs } from '@/components/website/equipments/view/equipment-specs';
import { singleEquipmentSchema } from '@/utils/seo/schema/equipments/single-equipment-schema';

interface EquipmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EquipmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  let equipment: IEquipment | null = null;

  try {
    equipment = await equipmentsService.getBySlug(slug);

    const keywords = [
      equipment.name,
      equipment.brand?.name,
      equipment.category?.name,
      equipment.equipmentType,
      'equipment',
      'rental',
      'media production',
    ].filter(Boolean) as string[];

    const metadata = createEnhancedMetadata({
      title: { absolute: `${equipment.name} for Rent in UAE` },
      description:
        equipment.summary || equipment.description || `${equipment.name} - Professional equipment rental`,
      type: 'article',
      keywords,
      pathname: `/equipments/${equipment.slug}`,
      image: equipment.coverPath || undefined,
      mainOverrides: {
        category: equipment.equipmentType,
      },
      openGraphOverrides: {
        section: equipment.equipmentType,
        images:
          equipment.gallery && equipment.gallery.length > 0
            ? equipment.gallery.sort((a, b) => a.order - b.order).map(item => ({ url: item.path }))
            : equipment.coverPath,
      },
    });

    return metadata;
  } catch {
    return {
      title: 'Equipment Not Found',
      description: 'Equipment not found',
    };
  }
}

export default async function EquipmentPage({ params }: EquipmentPageProps) {
  const { slug } = await params;
  let equipment: IEquipment | null = null;

  try {
    equipment = await equipmentsService.getBySlug(slug);
  } catch {
    // Equipment not found
  }

  if (!equipment) {
    notFound();
  }

  const images =
    equipment.gallery && equipment.gallery.length > 0
      ? equipment.gallery.sort((a, b) => a.order - b.order).map(item => item.path)
      : equipment.coverPath
        ? [equipment.coverPath]
        : [];

  const getEquipmentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'camera':
        return <Camera className="h-4 w-4" />;
      case 'lens':
        return <Sparkles className="h-4 w-4" />;
      case 'light':
        return <Lightbulb className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      case 'accessory':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Markup Schema
  const jsonLd = await singleEquipmentSchema(equipment);

  return (
    <div className="bg-background relative min-h-screen">
      {/* JSON-LD */}
      <script
        id="equipment-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />


      {/* Hero Section - Two Columns, No Background Image */}
      <div className="pt-edge-nav-margin relative z-10">
        <div className="container mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
            {/* Left Column: Title, Summary, Description, Equipment Details */}
            <div className="flex flex-col justify-center space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {equipment.isFeatured && (
                  <Badge variant="default" className="text-xs py-1 px-2 font-medium rounded-full">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {equipment.category && (
                  <Badge variant="secondary" className="text-xs py-1 px-2 rounded-full">
                    {equipment.category.name}
                  </Badge>
                )}
                {equipment.brand && (
                  <Badge variant="outline" className="text-xs py-1 px-2 rounded-full">
                    {equipment.brand.name}
                  </Badge>
                )}
                {equipment.equipmentType && (
                  <Badge variant="outline" className="text-xs py-1 px-2 rounded-full">
                    {getEquipmentTypeIcon(equipment.equipmentType)}
                    <span className="ml-1">{capitalizeEachWord(equipment.equipmentType)}</span>
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">{equipment.name}</h1>

              {/* Summary */}
              {equipment.summary && (
                <p className="text-muted-foreground text-md leading-relaxed md:text-lg">{equipment.summary}</p>
              )}

              {/* Description */}
              {equipment.description && (
                <div className="text-muted-foreground leading-relaxed text-sm">
                  <DivHtml html={equipment.description} />
                </div>
              )}

              {/* Equipment Details - Compact */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Equipment Details
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {equipment.brand && (
                    <div className="flex items-center gap-2">
                      <Tag className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                      <span>
                        <span className="text-muted-foreground">Brand:</span>{' '}
                        <span className="font-medium">{equipment.brand.name}</span>
                      </span>
                    </div>
                  )}
                  {equipment.category && (
                    <div className="flex items-center gap-2">
                      <FolderOpen className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                      <span>
                        <span className="text-muted-foreground">Category:</span>{' '}
                        <span className="font-medium">{equipment.category.name}</span>
                      </span>
                    </div>
                  )}
                  {equipment.equipmentType && (
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground">{getEquipmentTypeIcon(equipment.equipmentType)}</div>
                      <span>
                        <span className="text-muted-foreground">Type:</span>{' '}
                        <span className="font-medium">{capitalizeEachWord(equipment.equipmentType)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Images */}
            <div className="flex w-full items-stretch">
              {images.length > 0 ? (
                <EquipmentGallery
                  images={images}
                  equipmentName={equipment.name}
                  aspectRatio="4/3"
                  className="min-h-[280px] w-full sm:min-h-[320px] lg:min-h-[400px]"
                />
              ) : (
                <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-lg">
                  <Package className="text-muted-foreground h-16 w-16" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section - Below Hero */}
      <div className="relative z-10 border-t">
        <div className="container mx-auto max-w-7xl px-6 py-10">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Info className="text-primary h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Specifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <EquipmentSpecs
                specs={equipment.specs}
                equipmentType={equipment.equipmentType as EquipmentType}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
