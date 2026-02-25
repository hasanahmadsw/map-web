import type { PageFeatureItem } from '@/components/website/common/page-features-grid';
import { Camera, TvMinimal, Video, Package2, Settings2, RadioTower } from 'lucide-react';

/* ----------------------------------
 * What We Do - Core Business Units
 * ---------------------------------- */
export const coreBusinessUnits: (PageFeatureItem & { href: string })[] = [
  {
    icon: Camera,
    title: 'Equipment Rental',
    description:
      'Camera, lens, lighting, and audio rental. Professional production equipment for your next project in Dubai and the UAE.',
    href: '/equipment-rental',
  },
  {
    icon: TvMinimal,
    title: 'Broadcasting Solutions',
    description:
      'Outside broadcast (OB van), portable broadcast systems, and multi-camera live production for events and conferences.',
    href: '/broadcasting',
  },
  {
    icon: Video,
    title: 'Production Services',
    description:
      'Commercial, corporate, event filming, and studio production. Full-service video production from concept to delivery.',
    href: '/services',
  },
];

/* ----------------------------------
 * Equipment Highlights - Internal Links format
 * ---------------------------------- */
export const equipmentCategoryLinks = [
  { text: 'Camera Rental', href: '/equipment-rental/camera-rental' },
  { text: 'Lens Rental', href: '/equipment-rental/lens-rental' },
  { text: 'Lighting Rental', href: '/equipment-rental/lighting-rental' },
];

export const equipmentBrandLinks = [
  { text: 'ARRI', href: '/equipment-rental/arri' },
  { text: 'Sony', href: '/equipment-rental/sony' },
  { text: 'Canon', href: '/equipment-rental/canon' },
  { text: 'Zeiss', href: '/equipment-rental/zeiss' },
];

/* ----------------------------------
 * Broadcasting Infrastructure (PageFeaturesGrid + links)
 * ---------------------------------- */
export const broadcastingInfrastructure: (PageFeatureItem & { href: string })[] = [
  {
    icon: RadioTower,
    title: 'OB Van Capability',
    description: 'Full outside broadcast units for live events',
    href: '/broadcasting/outside-broadcast',
  },
  {
    icon: Package2,
    title: 'Portable Broadcast Units',
    description: 'Compact, mobile broadcast solutions for indoor venues',
    href: '/broadcasting/portable-broadcast-systems',
  },
  {
    icon: Settings2,
    title: 'Multi-Camera Live Production',
    description: 'Professional multi-camera setups for events and conferences',
    href: '/broadcasting',
  },
];

/* ----------------------------------
 * Production Services - Internal Links
 * ---------------------------------- */
export const productionServiceLinks = [
  { text: 'Commercial Production', href: '/commercial-video-production' },
  { text: 'Corporate Filming', href: '/corporate-video-production' },
  { text: 'Event Coverage', href: '/event-video-production' },
  { text: 'Interview Filming', href: '/studio-video-production' },
];

/* ----------------------------------
 * Industries Served - UseCasesGrid format (string[])
 * ---------------------------------- */
export const industriesServed = [
  'Advertising Agencies',
  'Film Production Companies',
  'Corporate Clients',
  'Government Entities',
  'Event Organizers',
  'Broadcasters',
];

/* ----------------------------------
 * Workflow / Process (deployment-style)
 * ---------------------------------- */
export const workflowSteps = [
  { step: '01', title: 'Planning', description: 'Site survey, technical planning, and venue integration.' },
  { step: '02', title: 'Equipment Preparation', description: 'Gear selection, testing, and logistics.' },
  { step: '03', title: 'Setup & Deployment', description: 'On-site installation and configuration.' },
  { step: '04', title: 'Live Production', description: 'Full technical support during the event.' },
  { step: '05', title: 'Breakdown', description: 'Strike, pack, and equipment return.' },
];
