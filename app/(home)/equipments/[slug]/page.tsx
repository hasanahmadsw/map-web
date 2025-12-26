import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Sparkles,
  Mic,
  Lightbulb,
  Package,
  Tag,
  FolderOpen,
  CheckCircle2,
  Clock,
  Info,
  FileText,
  Image as ImageIcon,
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
      title: { absolute: `${equipment.name} for Rent in UAE | ${equipment.equipmentType} | MAP` },
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
        images: equipment.galleryPaths
          ? equipment.galleryPaths.map(path => ({ url: path }))
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
    equipment.galleryPaths && equipment.galleryPaths.length > 0
      ? equipment.galleryPaths
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

      {/* Decorative Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb-blue absolute -top-32 -left-32 h-96 w-96" />
        <div className="orb-purple absolute -right-32 -bottom-32 h-96 w-96" />
      </div>

      {/* Hero Section */}
      <div className="pt-edge-nav-margin relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
        {images.length > 0 ? (
          <>
            <Image
              src={images[0]}
              alt={equipment.name}
              fill
              className="object-cover"
              priority
              unoptimized={images[0].includes('supabase.co') || images[0].includes('unsplash.com')}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
          </>
        ) : (
          <div className="bg-muted absolute inset-0" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-10">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {equipment.isFeatured && (
                <Badge variant="default" className="text-sm font-medium">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
              {equipment.category && (
                <Badge variant="secondary" className="text-sm">
                  <FolderOpen className="mr-1 h-3 w-3" />
                  {equipment.category.name}
                </Badge>
              )}
              {equipment.brand && (
                <Badge variant="outline" className="border-white/30 text-sm text-white">
                  <Tag className="mr-1 h-3 w-3" />
                  {equipment.brand.name}
                </Badge>
              )}
              {equipment.equipmentType && (
                <Badge variant="outline" className="border-white/30 text-sm text-white">
                  {getEquipmentTypeIcon(equipment.equipmentType)}
                  <span className="ml-1">{capitalizeEachWord(equipment.equipmentType)}</span>
                </Badge>
              )}
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{equipment.name}</h1>

            {equipment.summary && (
              <p className="max-w-2xl text-lg text-white/90 md:text-xl">{equipment.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Gallery Section */}
            {images.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <ImageIcon className="text-primary h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Gallery</h2>
                </div>
                <EquipmentGallery images={images} equipmentName={equipment.name} />
              </section>
            )}

            {/* Description Section */}
            {equipment.description && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Description</h2>
                </div>
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="text-muted-foreground leading-relaxed">
                      <DivHtml html={equipment.description} />
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Specifications Card */}
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

            {/* Equipment Info Card */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    {getEquipmentTypeIcon(equipment.equipmentType || 'accessory')}
                    <span className="sr-only">Equipment Type</span>
                  </div>
                  <CardTitle className="text-xl">Equipment Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {equipment.brand && (
                  <div className="flex items-start gap-3">
                    <Tag className="text-muted-foreground mt-0.5 h-4 w-4" />
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-1 text-sm font-medium">Brand</p>
                      <p className="text-base font-medium">{equipment.brand.name}</p>
                    </div>
                  </div>
                )}
                {equipment.category && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <FolderOpen className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">Category</p>
                        <p className="text-base font-medium">{equipment.category.name}</p>
                      </div>
                    </div>
                  </>
                )}
                {equipment.equipmentType && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="text-muted-foreground mt-0.5">
                        {getEquipmentTypeIcon(equipment.equipmentType)}
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">Type</p>
                        <p className="text-base font-medium">{capitalizeEachWord(equipment.equipmentType)}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
