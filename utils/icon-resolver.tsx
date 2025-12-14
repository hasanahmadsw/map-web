import * as React from "react"
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
  type LucideIcon,
} from "lucide-react"

// Map of icon names to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
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
}

// Default fallback icon
const DefaultIcon = Video

// Create a lowercase lookup map for O(1) performance instead of O(n) find()
const iconMapLowercase: Record<string, string> = Object.keys(iconMap).reduce(
  (acc, key) => {
    acc[key.toLowerCase()] = key
    return acc
  },
  {} as Record<string, string>
)

/**
 * Checks if a string is an emoji
 */
function isEmoji(str: string): boolean {
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u
  return emojiRegex.test(str)
}

/**
 * Resolves an icon name from the API to a React component or emoji string
 * @param iconName - The icon name from the API (can be a Lucide icon name or emoji)
 * @param fallback - Optional fallback icon name (defaults to "Video")
 * @returns Either a Lucide icon component or emoji string
 */
export function resolveIcon(
  iconName: string | undefined | null,
  fallback: string = "Video"
): React.ReactNode {
  if (!iconName) {
    const FallbackIcon = iconMap[fallback] || DefaultIcon
    return <FallbackIcon className="h-4 w-4" />
  }

  // If it's an emoji, return it as-is
  if (isEmoji(iconName)) {
    return <span>{iconName}</span>
  }

  // Use cached lowercase lookup for O(1) performance
  const iconKey = iconMapLowercase[iconName.toLowerCase()]

  if (iconKey) {
    const IconComponent = iconMap[iconKey]
    return <IconComponent className="h-4 w-4" />
  }

  // Fallback to default icon if not found
  const FallbackIcon = iconMap[fallback] || DefaultIcon
  return <FallbackIcon className="h-4 w-4" />
}

/**
 * Gets the icon component (for cases where you need the component itself, not rendered)
 * @param iconName - The icon name from the API
 * @param fallback - Optional fallback icon name (defaults to "Video")
 * @returns The Lucide icon component or null if it's an emoji
 */
export function getIconComponent(
  iconName: string | undefined | null,
  fallback: string = "Video"
): LucideIcon | null {
  if (!iconName || isEmoji(iconName)) {
    return iconMap[fallback] || DefaultIcon
  }

  // Use cached lowercase lookup for O(1) performance
  const iconKey = iconMapLowercase[iconName.toLowerCase()]

  return iconKey ? iconMap[iconKey] : iconMap[fallback] || DefaultIcon
}

/**
 * Checks if an icon name is a valid Lucide icon
 */
export function isValidLucideIcon(iconName: string | undefined | null): boolean {
  if (!iconName || isEmoji(iconName)) {
    return false
  }

  // Use cached lowercase lookup for O(1) performance
  return iconMapLowercase.hasOwnProperty(iconName.toLowerCase())
}

/**
 * Renders an icon with custom size and className
 * @param iconName - The icon name from the API
 * @param options - Optional configuration
 */
export function renderIcon(
  iconName: string | undefined | null,
  options?: {
    size?: number | string
    className?: string
    fallback?: string
  }
): React.ReactNode {
  const { size = 16, className = "", fallback = "Video" } = options || {}

  if (!iconName) {
    const FallbackIcon = iconMap[fallback] || DefaultIcon
    return <FallbackIcon className={className} style={{ width: size, height: size }} />
  }

  // If it's an emoji, return it as-is with size
  if (isEmoji(iconName)) {
    return (
      <span className={className} style={{ fontSize: size }}>
        {iconName}
      </span>
    )
  }

  // Use cached lowercase lookup for O(1) performance
  const iconKey = iconMapLowercase[iconName.toLowerCase()]

  if (iconKey) {
    const IconComponent = iconMap[iconKey]
    return (
      <IconComponent
        className={className}
        style={{ width: size, height: size }}
      />
    )
  }

  // Fallback to default icon
  const FallbackIcon = iconMap[fallback] || DefaultIcon
  return (
    <FallbackIcon
      className={className}
      style={{ width: size, height: size }}
    />
  )
}

/**
 * Gets all available icon names (for use in selectors, etc.)
 */
export function getAvailableIconNames(): string[] {
  return Object.keys(iconMap).sort()
}

