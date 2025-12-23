'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

// Import specific Lucide icons
import {
  Search,
  Check,
  Camera,
  Aperture,
  Clapperboard,
  Film,
  Focus,
  Fullscreen,
  ScanEye,
  Video,
  Webcam,
  Zap,
  SwitchCamera,
  FileVideo,
  Headset,
  FilePlay,
  Play,
  SquarePlay,
  TvMinimal,
  Cable,
  PcCase,
  Palette,
  Contrast,
  Music,
  CirclePlay,
  Volume2,
  FileAudio,
  RadioTower,
  Radio,
  Truck,
  PencilRuler,
  LoaderPinwheel,
  Scissors,
  PaintRoller,
  Layers2,
  Grid2x2,
  Fingerprint,
  Mic,
  MicVocal,
  Speaker,
} from 'lucide-react';

interface IconSelectInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

// Create a comprehensive list of Lucide icons
const iconComponents = {
  Search,
  Check,
  Camera,
  Aperture,
  Clapperboard,
  Film,
  Focus,
  Fullscreen,
  ScanEye,
  Video,
  Webcam,
  Zap,
  SwitchCamera,
  FileVideo,
  Headset,
  FilePlay,
  Play,
  SquarePlay,
  TvMinimal,
  Cable,
  PcCase,
  Palette,
  Contrast,
  Music,
  CirclePlay,
  Volume2,
  FileAudio,
  RadioTower,
  Radio,
  Truck,
  PencilRuler,
  LoaderPinwheel,
  Scissors,
  PaintRoller,
  Layers2,
  Grid2x2,
  Fingerprint,
  Mic,
  MicVocal,
  Speaker,
};

// Get icon names and sort them
const sortedIconNames = Object.keys(iconComponents).sort();

export function IconSelectInput({
  name,
  label,
  placeholder = 'Select an icon',
  className,
}: IconSelectInputProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedIcon = watch(name);
  const error = errors[name];

  // Filter icons based on search query
  const filteredIcons = sortedIconNames.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectIcon = (iconName: string) => {
    setValue(name, iconName, { shouldDirty: true, shouldValidate: true });
    setOpen(false);
    setSearchQuery('');
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents] as React.ComponentType<{
      className?: string;
    }>;
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              !selectedIcon && 'text-muted-foreground',
              error && 'border-destructive',
            )}
          >
            <div className="flex items-center gap-2">
              {selectedIcon ? (
                <>
                  {getIconComponent(selectedIcon)}
                  <span className="truncate">{selectedIcon}</span>
                </>
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search icons..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              <CommandEmpty>No icons found.</CommandEmpty>
              <CommandGroup>
                {filteredIcons.map(iconName => {
                  const IconComponent = iconComponents[
                    iconName as keyof typeof iconComponents
                  ] as React.ComponentType<{ className?: string }>;

                  return (
                    <CommandItem
                      key={iconName}
                      value={iconName}
                      onSelect={() => handleSelectIcon(iconName)}
                      className="flex items-center gap-2"
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span className="flex-1">{iconName}</span>
                      {selectedIcon === iconName && <Check className="text-primary h-4 w-4" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Hidden input for form registration */}
      <input {...register(name)} type="hidden" />

      {error && <p className="text-destructive text-sm">{error.message as string}</p>}
    </div>
  );
}
