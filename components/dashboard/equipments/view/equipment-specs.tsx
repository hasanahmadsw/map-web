'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getEquipmentIcon } from '../equipment-utils';
import type { IEquipment } from '@/types/equipments/equipment.type';
import { EquipmentType } from '@/types/equipments/equipment.enum';

interface EquipmentSpecsProps {
  specs: IEquipment['specs'];
  equipmentType: string;
}

function EquipmentSpecs({ specs, equipmentType }: EquipmentSpecsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getEquipmentIcon(equipmentType)}
          Specifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EquipmentSpecsDisplay specs={specs} />
      </CardContent>
    </Card>
  );
}

function EquipmentSpecsDisplay({ specs }: { specs: IEquipment['specs'] }) {
  if (specs.type === EquipmentType.CAMERA) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SpecItem label="Sensor" value={specs.sensor.replace('_', ' ')} />
        {specs.maxResolution && <SpecItem label="Max Resolution" value={specs.maxResolution} />}
        {specs.maxFps && <SpecItem label="Max FPS" value={`${specs.maxFps}`} />}
        {specs.mounts && specs.mounts.length > 0 && (
          <SpecItem label="Mounts" value={specs.mounts.join(', ')} />
        )}
        {specs.weightKg && <SpecItem label="Weight" value={`${specs.weightKg} kg`} />}
        {specs.media && <SpecItem label="Media Format" value={specs.media} />}
      </div>
    );
  }

  if (specs.type === EquipmentType.LENS) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SpecItem label="Mount" value={specs.mount} />
        <SpecItem
          label="Focal Length"
          value={`${specs.focalLengthMm.min}mm - ${specs.focalLengthMm.max}mm`}
        />
        {specs.aperture && (
          <SpecItem label="Aperture" value={`T${specs.aperture.minT} - T${specs.aperture.maxT}`} />
        )}
        <SpecItem label="Type" value={specs.isZoom ? 'Zoom' : 'Prime'} />
        {specs.weightG && <SpecItem label="Weight" value={`${specs.weightG}g`} />}
      </div>
    );
  }

  if (specs.type === EquipmentType.LIGHT) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SpecItem label="Power" value={`${specs.powerW}W`} />
        {specs.colorTempK && (
          <SpecItem label="Color Temperature" value={`${specs.colorTempK.min}K - ${specs.colorTempK.max}K`} />
        )}
        <SpecItem label="RGB" value={specs.hasRgb ? 'Yes' : 'No'} />
        {specs.mount && <SpecItem label="Mount" value={specs.mount} />}
      </div>
    );
  }

  if (specs.type === EquipmentType.AUDIO) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SpecItem label="Category" value={specs.category} />
        {specs.pattern && <SpecItem label="Pattern" value={specs.pattern} />}
        {specs.channels && <SpecItem label="Channels" value={`${specs.channels}`} />}
        {specs.phantomPower !== undefined && (
          <SpecItem label="Phantom Power" value={specs.phantomPower ? 'Yes' : 'No'} />
        )}
      </div>
    );
  }

  if (specs.type === EquipmentType.ACCESSORY) {
    return (
      <div className="space-y-2">
        {specs.notes && (
          <div>
            <CardDescription className="mb-2">Notes</CardDescription>
            <p className="text-sm">{specs.notes}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export default EquipmentSpecs;
