import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import type {
  IEquipmentSpecs,
  ICameraSpecs,
  ILensSpecs,
  ILightSpecs,
  IAudioSpecs,
  IAccessorySpecs,
} from '@/types/equipments/equipment.type';
import { capitalizeEachWord } from '@/utils/format';
import {
  Monitor,
  Gauge,
  Film,
  HardDrive,
  Weight,
  Focus,
  Aperture,
  ZoomIn,
  Zap,
  Palette,
  Radio,
  Volume2,
  Plug,
  FileText,
  Mic as MicIcon,
} from 'lucide-react';

interface EquipmentSpecsProps {
  specs: IEquipmentSpecs;
  equipmentType: EquipmentType;
}

function SpecRow({
  label,
  value,
  isFirst,
  icon: Icon,
}: {
  label: string;
  value: string | number | undefined | null;
  isFirst?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <>
      {!isFirst && <Separator />}
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="bg-primary/10 mt-0.5 flex h-5 w-5 items-center justify-center rounded">
            <Icon className="text-primary h-3 w-3" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-muted-foreground mb-1 text-sm font-medium">{label}</p>
          <p className="text-base font-medium">{String(value)}</p>
        </div>
      </div>
    </>
  );
}

function SpecBadgeRow({
  label,
  values,
  isFirst,
}: {
  label: string;
  values: string[] | undefined;
  isFirst?: boolean;
}) {
  if (!values || values.length === 0) return null;

  return (
    <>
      {!isFirst && <Separator />}
      <div>
        <p className="text-muted-foreground mb-2 text-sm font-medium">{label}</p>
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <Badge key={index} variant="outline">
              {capitalizeEachWord(value)}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}

function CameraSpecs({ specs }: { specs: ICameraSpecs }) {
  const rows = [
    { label: 'Sensor', value: capitalizeEachWord(specs.sensor?.replace(/_/g, ' ')), icon: Monitor },
    { label: 'Max Resolution', value: specs.maxResolution, icon: Film },
    { label: 'Max FPS', value: specs.maxFps ? `${specs.maxFps} fps` : undefined, icon: Gauge },
    { label: 'Weight', value: specs.weightKg ? `${specs.weightKg} kg` : undefined, icon: Weight },
    { label: 'Media Format', value: specs.media, icon: HardDrive },
  ].filter(row => row.value);

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <SpecRow key={row.label} label={row.label} value={row.value} isFirst={index === 0} icon={row.icon} />
      ))}
      <SpecBadgeRow label="Mounts" values={specs.mounts} isFirst={rows.length === 0} />
    </div>
  );
}

function LensSpecs({ specs }: { specs: ILensSpecs }) {
  const focalLength = specs.focalLengthMm
    ? specs.focalLengthMm.min === specs.focalLengthMm.max
      ? `${specs.focalLengthMm.min}mm`
      : `${specs.focalLengthMm.min}-${specs.focalLengthMm.max}mm`
    : undefined;

  const aperture = specs.aperture ? `T${specs.aperture.minT}-${specs.aperture.maxT}` : undefined;

  const rows = [
    { label: 'Mount', value: specs.mount, icon: Plug },
    { label: 'Focal Length', value: focalLength, icon: Focus },
    { label: 'Aperture', value: aperture, icon: Aperture },
    { label: 'Type', value: specs.isZoom ? 'Zoom' : 'Prime', icon: ZoomIn },
    { label: 'Weight', value: specs.weightG ? `${specs.weightG} g` : undefined, icon: Weight },
  ].filter(row => row.value);

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <SpecRow key={row.label} label={row.label} value={row.value} isFirst={index === 0} icon={row.icon} />
      ))}
    </div>
  );
}

function LightSpecs({ specs }: { specs: ILightSpecs }) {
  const colorTemp = specs.colorTempK ? `${specs.colorTempK.min}K - ${specs.colorTempK.max}K` : undefined;

  const rows = [
    { label: 'Power', value: specs.powerW ? `${specs.powerW}W` : undefined, icon: Zap },
    { label: 'Color Temperature', value: colorTemp, icon: Palette },
    { label: 'RGB', value: specs.hasRgb ? 'Yes' : 'No', icon: Palette },
    { label: 'Mount', value: specs.mount ? capitalizeEachWord(specs.mount) : undefined, icon: Plug },
  ].filter(row => row.value);

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <SpecRow key={row.label} label={row.label} value={row.value} isFirst={index === 0} icon={row.icon} />
      ))}
    </div>
  );
}

function AudioSpecs({ specs }: { specs: IAudioSpecs }) {
  const rows = [
    { label: 'Category', value: capitalizeEachWord(specs.category), icon: MicIcon },
    { label: 'Pattern', value: specs.pattern ? capitalizeEachWord(specs.pattern) : undefined, icon: Radio },
    { label: 'Channels', value: specs.channels, icon: Volume2 },
    {
      label: 'Phantom Power',
      value: specs.phantomPower !== undefined ? (specs.phantomPower ? 'Yes' : 'No') : undefined,
      icon: Zap,
    },
  ].filter(row => row.value);

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <SpecRow key={row.label} label={row.label} value={row.value} isFirst={index === 0} icon={row.icon} />
      ))}
    </div>
  );
}

function AccessorySpecs({ specs }: { specs: IAccessorySpecs }) {
  return (
    <div className="space-y-2">
      {specs.notes && (
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 mt-0.5 flex h-5 w-5 items-center justify-center rounded">
            <FileText className="text-primary h-3 w-3" />
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-sm font-medium">Notes</p>
            <p className="text-base">{specs.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function EquipmentSpecs({ specs, equipmentType }: EquipmentSpecsProps) {
  switch (equipmentType) {
    case EquipmentType.CAMERA:
      return <CameraSpecs specs={specs as ICameraSpecs} />;
    case EquipmentType.LENS:
      return <LensSpecs specs={specs as ILensSpecs} />;
    case EquipmentType.LIGHT:
      return <LightSpecs specs={specs as ILightSpecs} />;
    case EquipmentType.AUDIO:
      return <AudioSpecs specs={specs as IAudioSpecs} />;
    case EquipmentType.ACCESSORY:
      return <AccessorySpecs specs={specs as IAccessorySpecs} />;
    default:
      return <p className="text-muted-foreground text-sm">No specifications available</p>;
  }
}
