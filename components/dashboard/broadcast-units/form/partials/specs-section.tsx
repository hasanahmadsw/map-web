'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { TextInput } from '@/components/shared/input/TextInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import ArrayInput from '@/components/shared/input/ArrayInput';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SpecsSection() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
        <CardDescription>Technical specifications for this broadcast unit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video Production Specs */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Video Production</h3>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <TextInput
              control={control}
              name="specs.format"
              label="Format"
              placeholder="e.g., HD, 4K, UHD"
            />
            <TextInput
              control={control}
              name="specs.routing"
              label="Routing"
              placeholder="e.g., 12G-SDI, IP"
            />
          </div>
        </div>

        {/* Vision Mixing */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Vision Mixing</h3>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <TextInput
              control={control}
              name="specs.visionMixer"
              label="Vision Mixer"
              placeholder="e.g., ATEM Mini Pro"
            />
            <ArrayInput
              name="specs.visionMixers"
              label="Vision Mixers (Multiple)"
              placeholder="Enter vision mixer and press Enter or comma"
            />
          </div>
        </div>

        {/* Camera System */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Camera System</h3>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <NumericInput
              control={control}
              name="specs.cameraChains"
              label="Camera Chains"
              placeholder="e.g., 4"
              allowFloat={false}
            />
            <TextInput
              control={control}
              name="specs.cameraSystem"
              label="Camera System"
              placeholder="e.g., Sony, Canon"
            />
          </div>
        </div>

        {/* Audio */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Audio</h3>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <TextInput
              control={control}
              name="specs.audioMixer"
              label="Audio Mixer"
              placeholder="e.g., Behringer X32"
            />
          </div>
        </div>

        {/* Intercom */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Intercom</h3>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <TextInput
              control={control}
              name="specs.intercom"
              label="Intercom"
              placeholder="e.g., Riedel, Clear-Com"
            />
            <ArrayInput
              name="specs.intercomList"
              label="Intercom List"
              placeholder="Enter intercom item and press Enter or comma"
            />
          </div>
        </div>

        {/* Power */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Power</h3>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <TextInput
              control={control}
              name="specs.power"
              label="Power"
              placeholder="e.g., 220V AC, 12V DC"
            />
            <TextInput
              control={control}
              name="specs.powerBackup"
              label="Power Backup"
              placeholder="e.g., UPS, Generator"
            />
          </div>
        </div>

        {/* Deployment */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Deployment</h3>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <TextInput
              control={control}
              name="specs.mobility"
              label="Mobility"
              placeholder="e.g., Mobile, Fixed, Portable"
            />
            <TextInput
              control={control}
              name="specs.deployment"
              label="Deployment"
              placeholder="e.g., OB Van, Studio, Field"
            />
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Use Cases</h3>
          <ArrayInput
            name="specs.useCases"
            label="Use Cases"
            placeholder="Enter use case and press Enter or comma"
          />
        </div>
      </CardContent>
    </Card>
  );
}

