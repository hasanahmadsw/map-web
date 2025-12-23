'use client';

import { useState } from 'react';
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

interface StandaloneIconSelectInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
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

export function StandaloneIconSelectInput({
  value,
  onChange,
  label,
  placeholder = 'Select an icon',
  className,
  disabled = false,
}: StandaloneIconSelectInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter icons based on search query
  const filteredIcons = sortedIconNames.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectIcon = (iconName: string) => {
    onChange(iconName);
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
      {label && <Label>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn('w-full justify-between', !value && 'text-muted-foreground')}
          >
            <div className="flex items-center gap-2">
              {value ? (
                <>
                  {getIconComponent(value)}
                  <span className="truncate">{value}</span>
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
                      {value === iconName && <Check className="text-primary h-4 w-4" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
