import {
  Video,
  Radio,
  Users,
  Monitor,
  Building2,
  Truck,
  PcCase,
  Sliders,
  Mic2,
  HardDrive,
  Wifi,
  Camera,
  MapPin,
  Shield,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const broadcastingCapabilities = [
  {
    icon: Video,
    title: 'Live Event Broadcasting',
    description: 'Full-scale outside broadcast and live production for events of any size',
  },
  {
    icon: Camera,
    title: 'Multi-Camera Production',
    description: 'Professional multi-camera setups with vision mixing and real-time switching',
  },
  {
    icon: Radio,
    title: 'Remote Production',
    description: 'REMI and cloud-based production for distributed workflows',
  },
  {
    icon: Users,
    title: 'Hybrid Events',
    description: 'Seamless integration of in-person and virtual attendees',
  },
  {
    icon: Monitor,
    title: 'Conference Streaming',
    description: 'Live streaming for conferences, summits, and corporate events',
  },
  {
    icon: HardDrive,
    title: 'Recording & Archiving',
    description: 'Multi-format recording, backup, and post-event archiving solutions',
  },
];

export const obVanUseCases = [
  'Outdoor event coverage',
  'Sports broadcasting',
  'Government events',
  'Live concerts',
  'Public ceremonies',
];

export const obVanFeatures = [
  {
    icon: Truck,
    title: 'Mobile Production Truck',
    description:
      'Self-contained OB van with cameras, vision mixing, audio, and transmission in one mobile unit',
  },
  {
    icon: Camera,
    title: 'Multi-Camera Setup',
    description: 'Broadcast-grade camera systems for outdoor venues, sports stadia, and open-air events',
  },
  {
    icon: Sliders,
    title: 'Vision Mixing & Graphics',
    description: 'Real-time vision switching and graphics overlay for professional live production',
  },
  {
    icon: Mic2,
    title: 'Audio Suite',
    description: 'Professional audio routing and mixing for clean broadcast-quality sound',
  },
  {
    icon: HardDrive,
    title: 'Recording & Streaming',
    description: 'Redundant recording and multi-platform live streaming capabilities',
  },
];

export const portableUseCases = [
  'Indoor events',
  'Temporary broadcast setup',
  'Hotel ballrooms',
  'Conference halls',
  'Exhibition centers',
];

export const portableFeatures = [
  {
    icon: PcCase,
    title: 'Flight Case Units',
    description: 'Compact, transportable broadcast setups in rugged flight cases for quick deployment',
  },
  {
    icon: Zap,
    title: 'Quick Deployment',
    description: 'Set up in hours—no truck access needed, minimal venue footprint',
  },
  {
    icon: Camera,
    title: 'Indoor-Optimized Cameras',
    description: 'Broadcast-grade cameras tuned for conference halls and indoor lighting',
  },
  {
    icon: Sliders,
    title: 'Vision Mixing & Streaming',
    description: 'Real-time switching and multi-platform live streaming output',
  },
  {
    icon: HardDrive,
    title: 'Recording & Output',
    description: 'Multi-format recording, backup, and delivery to web and social platforms',
  },
];

export const obVsPortableRows = [
  { aspect: 'Best for', ob: 'Outdoor, sports, large venues', portable: 'Indoor, conferences, exhibitions' },
  { aspect: 'Venue access', ob: 'Truck access required', portable: 'Standard loading dock or elevator' },
  { aspect: 'Setup time', ob: 'Full day typically', portable: '2–4 hours typically' },
  { aspect: 'Footprint', ob: 'Large (truck + crew)', portable: 'Compact, minimal footprint' },
  { aspect: 'Scale', ob: 'High-capacity multi-camera', portable: '2–6 cameras typical' },
];

export const portableAdvantages = [
  'Quick deployment—set up in hours, not days',
  'No truck access required—ideal for hotels and indoor venues',
  'Lower footprint—compact equipment, minimal disruption',
  'Cost-effective for conference and corporate events',
  'Easy integration with venue AV (screens, projectors, PA)',
];

export const streamingDestinations = [
  { icon: Wifi, title: 'YouTube Live', description: 'Public and unlisted streams' },
  { icon: Wifi, title: 'LinkedIn Live', description: 'Professional event streaming' },
  { icon: Wifi, title: 'Zoom / Teams', description: 'Hybrid meetings and webinars' },
  { icon: Wifi, title: 'Custom Platform', description: 'Private or internal streaming' },
  { icon: Wifi, title: 'Multi-Platform', description: 'Simultaneous delivery to multiple destinations' },
];

export const postEventDeliverables = [
  'Full event recording (multi-camera or single cut)',
  'Edited highlights and clips',
  'Archive storage with configurable retention',
  'Download links for organizers',
  'Subtitles and transcripts (on request)',
];

export const virtualAudienceTools = [
  'Live Q&A and polls integration',
  'Chat moderation and display',
  'Breakout session support',
  'Registration and analytics',
];

export const venueAvIntegration = [
  'LED walls and projection screens',
  'Existing PA and audio systems',
  'House lighting control',
  'Conference Wi-Fi and network',
];

export const industryVerticals = [
  { icon: Building2, label: 'Corporate' },
  { icon: Building2, label: 'Government' },
  { icon: Building2, label: 'Healthcare' },
  { icon: Building2, label: 'Education' },
  { icon: Building2, label: 'Finance' },
];

export const securityCompliance = [
  'Secure streams with encryption where required',
  'NDA and confidentiality agreements',
  'Restricted access and credentials',
  'Compliance with venue and client policies',
];

export const redundancyBackup = [
  'Dual recording paths',
  'Automatic failover for critical signals',
  'Backup internet uplink',
  'Spare camera and cable readiness',
];

export const brandingGraphics = [
  'Lower thirds and name keys',
  'Logo bumpers and transitions',
  'Holding and intermission screens',
  'Custom templates matching your brand',
];

export const solutionComparison = [
  {
    solution: 'Portable',
    venue: 'Indoor',
    setup: '2–4 hours',
    footprint: 'Compact',
    ideal: 'Conferences, exhibitions',
  },
  {
    solution: 'OB Van',
    venue: 'Outdoor / large',
    setup: 'Full day',
    footprint: 'Large',
    ideal: 'Sports, concerts, ceremonies',
  },
  {
    solution: 'Studio',
    venue: 'Fixed facility',
    setup: 'N/A',
    footprint: 'Permanent',
    ideal: 'Regular shows, news',
  },
];

export const sustainabilityPoints = [
  'Lower power consumption than full OB truck',
  'Compact equipment—less transport and fuel',
  'Reusable flight cases and modular gear',
  'Efficient setup reduces on-site time and energy',
];

export const workflowSteps = [
  'Vision switching',
  'Multi-camera monitoring',
  'Recording & replay',
  'Live streaming output',
  'Audio integration',
];

export const useCases = [
  'Corporate Events',
  'Government Conferences',
  'Sports Coverage',
  'Product Launches',
  'Panel Discussions',
];

export const technicalAreas = [
  { icon: Camera, title: 'Camera Systems', description: 'Multi-format camera setups' },
  { icon: Mic2, title: 'Audio Routing', description: 'Professional audio distribution' },
  { icon: Monitor, title: 'Monitoring', description: 'Multiviewers and QC' },
  { icon: HardDrive, title: 'Recording', description: 'Redundant recording systems' },
  { icon: Wifi, title: 'Streaming Outputs', description: 'Multi-platform delivery' },
  { icon: Sliders, title: 'Vision Mixing', description: 'Real-time switching and graphics overlay' },
];

export const deploymentSteps = [
  { step: '01', title: 'Planning', description: 'Site survey and technical planning' },
  { step: '02', title: 'Setup', description: 'Equipment deployment and configuration' },
  { step: '03', title: 'Live Production', description: 'Full technical crew support' },
  { step: '04', title: 'Breakdown', description: 'Efficient strike and equipment return' },
];

export const serviceCoverage = [
  { icon: MapPin, label: 'Dubai' },
  { icon: MapPin, label: 'UAE' },
  { icon: MapPin, label: 'Saudi Arabia' },
  { icon: MapPin, label: 'Oman' },
  { icon: MapPin, label: 'Qatar' },
];

export const obFaq = [
  {
    q: 'How much does an outside broadcast cost?',
    a: 'OB costs depend on event scale, camera count, crew size, and duration. We provide tailored quotes after understanding your requirements.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend 2–4 weeks for standard events. Large sports or government productions may need 4–8 weeks for planning and coordination.',
  },
  {
    q: 'What venue access do OB vans need?',
    a: 'OB vans require truck access (loading dock or ground-level parking near venue), power (typically 63A three-phase), and space for cable runs.',
  },
  {
    q: 'What crew do you provide?',
    a: 'Our OB crews include vision mixers, camera operators, audio engineers, and technical directors. Crew size scales with production complexity.',
  },
];

export const obVenueRequirements = [
  { label: 'Truck access', desc: 'Loading dock or ground-level parking near venue' },
  { label: 'Power', desc: '63A three-phase typical; backup options available' },
  { label: 'Cable runs', desc: 'Space for camera and audio cable paths to stage/field' },
  { label: 'Communications', desc: 'Intercom or mobile coverage for crew coordination' },
];

export const obCrewRoles = [
  { icon: Sliders, title: 'Vision Mixer', desc: 'Real-time switching and graphics' },
  { icon: Camera, title: 'Camera Operators', desc: 'Multi-camera coverage' },
  { icon: Mic2, title: 'Audio Engineer', desc: 'Sound mixing and routing' },
  { icon: Users, title: 'Technical Director', desc: 'Production coordination' },
];

export const whyChooseMapOb = [
  {
    icon: Shield,
    title: 'Broadcast-Grade Quality',
    desc: 'Professional equipment and crews for reliable live coverage',
  },
  {
    icon: Zap,
    title: 'Rapid Deployment',
    desc: 'Local presence in Dubai and the Gulf for quick turnarounds',
  },
  {
    icon: RefreshCw,
    title: 'Proven Experience',
    desc: 'Government events, sports, and corporate productions',
  },
];

export const portableFaq = [
  {
    q: 'How long does portable broadcast setup take?',
    a: 'Typically 2–4 hours. Our flight case units are designed for quick deployment. No truck access is needed—standard loading dock or elevator suffices.',
  },
  {
    q: 'What venues are suitable for portable broadcast?',
    a: 'Hotel ballrooms, conference halls, exhibition centers, corporate auditoriums, and any indoor venue with standard power and network access.',
  },
  {
    q: 'Can portable systems handle multi-camera production?',
    a: 'Yes. Our portable setups support 2–6 cameras typically, with vision mixing, recording, and live streaming. Ideal for conferences, product launches, and hybrid events.',
  },
  {
    q: 'Do you integrate with venue AV systems?',
    a: 'Yes. We connect to LED walls, projection screens, PA systems, and venue Wi-Fi. Integration is planned during the site survey phase.',
  },
];

export const portableVenueRequirements = [
  { label: 'Access', desc: 'Loading dock or elevator for equipment transport' },
  { label: 'Power', desc: 'Standard three-phase or sufficient single-phase outlets' },
  { label: 'Network', desc: 'Stable internet for streaming; we can provide backup uplink' },
  { label: 'Space', desc: 'Designated area for compact broadcast setup near stage or presenters' },
];

export const outsideBroadcastInternalLinks = [
  { text: '← Broadcasting Home', href: '/broadcasting' },
  { text: 'Portable Broadcast Systems', href: '/broadcasting/portable-broadcast-systems' },
  { text: 'Live Event Production', href: '/live-event-production' },
  { text: 'Equipment Rental', href: '/equipment-rental' },
];

export const portableBroadcastInternalLinks = [
  { text: '← Broadcasting Home', href: '/broadcasting' },
  { text: 'Outside Broadcast', href: '/broadcasting/outside-broadcast' },
  { text: 'Live Event Production →', href: '/live-event-production' },
  { text: 'Equipment Rental →', href: '/equipment-rental' },
];

export const broadcastingInternalLinks = [
  { text: 'Outside Broadcast', href: '/broadcasting/outside-broadcast' },
  { text: 'Portable Broadcast Systems', href: '/broadcasting/portable-broadcast-systems' },
  { text: 'Live Event Production', href: '/live-event-production' },
];

export const whyChooseMapPortable = [
  {
    icon: Zap,
    title: 'Quick Deployment',
    desc: 'Set up in hours, not days—ideal for last-minute or time-sensitive events',
  },
  {
    icon: PcCase,
    title: 'Compact & Flexible',
    desc: 'Flight case units fit hotels and indoor venues without truck access',
  },
  {
    icon: Shield,
    title: 'Conference-Ready',
    desc: 'Proven for corporate conferences, exhibitions, and hybrid events',
  },
];
